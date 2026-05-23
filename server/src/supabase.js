import { createClient } from "@supabase/supabase-js";

let client = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function saveSurveyResponse(row) {
  const supabase = getSupabase();

  const { data: existing, error: readError } = await supabase
    .from("survey_responses")
    .select("response_id")
    .eq("response_id", row.response_id)
    .maybeSingle();

  if (readError) throw readError;
  if (existing) {
    return { duplicate: true, response_id: row.response_id };
  }

  const { error: insertError } = await supabase.from("survey_responses").insert(row);
  if (insertError) {
    if (insertError.code === "23505") {
      return { duplicate: true, response_id: row.response_id };
    }
    throw insertError;
  }

  return { duplicate: false, response_id: row.response_id };
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
