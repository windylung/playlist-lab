import { checkApiKey } from "./_lib/auth.js";
import { saveSurveyResponse } from "../server/src/supabase.js";
import { trySyncAfterSave } from "../server/src/sync-after-save.js";
import { validateSubmission } from "../server/src/validate.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const auth = checkApiKey(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ ok: false, error: auth.error });
  }

  const validation = validateSubmission(req.body);
  if (!validation.ok) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    const result = await saveSurveyResponse(validation.row);
    const sheetSync = await trySyncAfterSave(result);
    return res.status(200).json({
      ok: true,
      response_id: result.response_id,
      duplicate: result.duplicate,
      updated: result.updated,
      sheet_sync: sheetSync,
    });
  } catch (err) {
    console.error("[survey-save]", err);
    return res.status(500).json({ ok: false, error: "save_failed" });
  }
}
