import { createClient } from "@supabase/supabase-js";
import ws from "ws";

let client = null;

function supabaseClientOptions() {
  const options = {
    auth: { persistSession: false, autoRefreshToken: false },
  };
  // Node 18: native WebSocket 없음 → Realtime 초기화 실패 방지
  if (typeof globalThis.WebSocket === "undefined") {
    options.realtime = { transport: ws };
  }
  return options;
}

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  client = createClient(url, key, supabaseClientOptions());
  return client;
}

function buildResponsePatch(row) {
  return {
    submitted_at: row.submitted_at,
    student_name: row.student_name,
    student_class: row.student_class,
    student_group: row.student_group,
    started_at: row.started_at,
    reactions: row.reactions,
    favorites: row.favorites,
    app_version: row.app_version,
    mode: row.mode,
    sheet_sync_status: "pending",
    sheet_sync_error: null,
    sheet_synced_at: null,
  };
}

async function updateSurveyResponseById(supabase, responseId, row) {
  const { error: updateError } = await supabase
    .from("survey_responses")
    .update(buildResponsePatch(row))
    .eq("response_id", responseId);

  if (updateError) throw updateError;

  return {
    duplicate: false,
    updated: true,
    response_id: responseId,
  };
}

export async function saveSurveyResponse(row) {
  const supabase = getSupabase();

  // 동일 submission 재전송 (네트워크 재시도)
  const { data: byResponseId, error: readByResponseError } = await supabase
    .from("survey_responses")
    .select("response_id")
    .eq("response_id", row.response_id)
    .maybeSingle();

  if (readByResponseError) throw readByResponseError;
  if (byResponseId) {
    return {
      duplicate: true,
      updated: false,
      response_id: byResponseId.response_id,
    };
  }

  // 동일 학생 재제출 → 기존 행 갱신
  const { data: byStudent, error: readByStudentError } = await supabase
    .from("survey_responses")
    .select("response_id")
    .eq("student_id", row.student_id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (readByStudentError) throw readByStudentError;
  if (byStudent) {
    return updateSurveyResponseById(supabase, byStudent.response_id, row);
  }

  const { error: insertError } = await supabase.from("survey_responses").insert(row);
  if (insertError?.code === "23505") {
    const { data: conflict, error: conflictError } = await supabase
      .from("survey_responses")
      .select("response_id")
      .eq("student_id", row.student_id)
      .maybeSingle();

    if (!conflictError && conflict) {
      return updateSurveyResponseById(supabase, conflict.response_id, row);
    }
  }
  if (insertError) throw insertError;

  return {
    duplicate: false,
    updated: false,
    response_id: row.response_id,
  };
}

export async function fetchSurveyResponseByResponseId(responseId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("response_id", responseId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPendingSheetSync(limit = 20) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .in("sheet_sync_status", ["pending", "failed"])
    .order("submitted_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function markSheetSync(responseId, status, extra = {}) {
  const supabase = getSupabase();
  const patch = {
    sheet_sync_status: status,
    sheet_sync_error: extra.error ?? null,
    sheet_synced_at: status === "synced" ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from("survey_responses")
    .update(patch)
    .eq("response_id", responseId);

  if (error) throw error;
}

export async function markAllSkippedIfNoSheets() {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("survey_responses")
    .update({ sheet_sync_status: "skipped", sheet_sync_error: null })
    .eq("sheet_sync_status", "pending");

  if (error) throw error;
}
