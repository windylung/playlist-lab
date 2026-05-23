import { fetchSurveyResponseByResponseId } from "./supabase.js";
import { isSheetsEnabled, syncRecordToSheet } from "./sheets.js";

/** DB 저장 직후 시트 즉시 동기화 (실패 시 pending 으로 cron/수동 재시도) */
export async function trySyncAfterSave(saveResult) {
  if (!isSheetsEnabled()) return "skipped";
  if (saveResult.duplicate) return "unchanged";

  try {
    const record = await fetchSurveyResponseByResponseId(saveResult.response_id);
    await syncRecordToSheet(record);
    return "synced";
  } catch (err) {
    console.error("[sheet-sync-immediate]", err);
    return "queued";
  }
}
