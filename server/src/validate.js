const ACTIONS = new Set(["like", "skip", "dislike"]);

export function validateSubmission(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "invalid_json_body" };
  }

  const responseId = String(body.response_id || "").trim();
  if (!responseId || responseId.length > 128) {
    return { ok: false, error: "invalid_response_id" };
  }

  const submittedAt = body.submitted_at;
  if (!submittedAt || Number.isNaN(Date.parse(submittedAt))) {
    return { ok: false, error: "invalid_submitted_at" };
  }

  const student = body.student || {};
  const studentId = String(student.student_id || "").trim();
  const studentName = String(student.name || "").trim();
  if (!studentId || !studentName) {
    return { ok: false, error: "invalid_student" };
  }

  const reactions = Array.isArray(body.reactions) ? body.reactions : [];
  if (reactions.length === 0 || reactions.length > 50) {
    return { ok: false, error: "invalid_reactions" };
  }

  for (const r of reactions) {
    if (!r || typeof r !== "object") return { ok: false, error: "invalid_reaction_item" };
    if (!String(r.song_id || "").trim()) return { ok: false, error: "invalid_song_id" };
    if (!ACTIONS.has(r.action)) return { ok: false, error: "invalid_action" };
  }

  const favorites = Array.isArray(body.favorites) ? body.favorites : [];
  if (favorites.length > 5) {
    return { ok: false, error: "too_many_favorites" };
  }

  return {
    ok: true,
    row: {
      response_id: responseId,
      submitted_at: submittedAt,
      student_id: studentId,
      student_name: studentName,
      student_class: student.class ?? null,
      student_group: student.group ?? null,
      started_at: student.started_at || null,
      reactions,
      favorites,
      app_version: String(body.app_version || "music_survey_v1"),
      mode: String(body.mode || "stable"),
      sheet_sync_status: "pending",
    },
  };
}
