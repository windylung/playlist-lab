import fs from "node:fs";
import { google } from "googleapis";
import { markSheetSync } from "./supabase.js";

let sheetsClient = null;
let sheetConfig = null;

function loadCredentials() {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;

  if (b64) {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  }
  if (path && fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }
  return null;
}

export function isSheetsEnabled() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const creds = loadCredentials();
  return Boolean(spreadsheetId && creds?.client_email && creds?.private_key);
}

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const creds = loadCredentials();
  if (!creds) throw new Error("google_credentials_missing");

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  sheetConfig = {
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    tabName: process.env.GOOGLE_SHEETS_TAB_NAME || "응답",
  };
  return sheetsClient;
}

function getSheetConfig() {
  getSheetsClient();
  return sheetConfig;
}

// 곡 ID → 시트 컬럼 헤더 매핑 (순서 = 시트 컬럼 순서)
const SONG_COLUMNS = [
  { id: "M001", header: "KPOP_1" },
  { id: "M002", header: "KPOP_2" },
  { id: "M003", header: "INDIE_1" },
  { id: "M004", header: "INDIE_2" },
  { id: "M005", header: "HIPHOP_1" },
  { id: "M006", header: "HIPHOP_2" },
  { id: "M007", header: "POP_1" },
  { id: "M008", header: "POP_2" },
  { id: "M009", header: "BALLAD_1" },
  { id: "M010", header: "BALLAD_2" },
];

// 마지막 컬럼 알파벳 계산 (고정 7 + 곡 10 + 고정 6 = 23열 → W)
// A(0)~G(6): 고정 앞, H(7)~Q(16): 곡, R(17)~W(22): 고정 뒤
const LAST_COL = String.fromCharCode(
  "A".charCodeAt(0) + 6 + SONG_COLUMNS.length + 6
);

function flattenRow(record) {
  const reactions = Array.isArray(record.reactions) ? record.reactions : [];
  const favorites = Array.isArray(record.favorites) ? record.favorites : [];

  // 곡 ID → action 맵
  const reactionMap = {};
  for (const r of reactions) {
    reactionMap[r.song_id] = r.action;
  }

  const reactionSummary = reactions
    .map((r) => `${r.song_id}:${r.action}`)
    .join(" | ");

  const favoriteSummary = favorites
    .map((f) => `${f.title} - ${f.artist}`)
    .join(" | ");

  return [
    record.response_id,
    record.submitted_at,
    record.student_id,
    record.student_name,
    record.student_class ?? "",
    record.student_group ?? "",
    record.started_at ?? "",
    ...SONG_COLUMNS.map((s) => reactionMap[s.id] ?? ""),
    reactions.length,
    reactionSummary,
    favoriteSummary,
    record.app_version,
    record.mode,
    record.created_at,
  ];
}

const HEADER = [
  "response_id",
  "submitted_at",
  "student_id",
  "student_name",
  "class",
  "group",
  "started_at",
  ...SONG_COLUMNS.map((s) => s.header),
  "reaction_count",
  "reactions",
  "favorites",
  "app_version",
  "mode",
  "db_created_at",
];

async function ensureHeader(sheets) {
  const { tabName, spreadsheetId } = getSheetConfig();
  const range = `${tabName}!A1:${LAST_COL}1`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const first = res.data.values?.[0];
  if (first && first.length >= HEADER.length) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [HEADER] },
  });
}

async function findSheetRowByStudentId(sheets, studentId) {
  const { tabName, spreadsheetId } = getSheetConfig();
  const range = `${tabName}!C2:C`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = res.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || "") === String(studentId)) {
      return i + 2; // header is row 1
    }
  }
  return null;
}

/** 학생 ID 기준 upsert (재제출 시 시트 행 갱신) */
export async function upsertSurveyToSheet(record) {
  const sheets = getSheetsClient();
  const { tabName, spreadsheetId } = getSheetConfig();
  await ensureHeader(sheets);

  const values = [flattenRow(record)];
  const existingRow = await findSheetRowByStudentId(sheets, record.student_id);

  if (existingRow) {
    const range = `${tabName}!A${existingRow}:${LAST_COL}${existingRow}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    return { action: "updated", row: existingRow };
  }

  const range = `${tabName}!A:${LAST_COL}`;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
  return { action: "appended" };
}

export async function syncRecordToSheet(record) {
  if (!isSheetsEnabled()) return { skipped: true, reason: "sheets_not_configured" };

  await markSheetSync(record.response_id, "syncing");
  try {
    const sheetResult = await upsertSurveyToSheet(record);
    await markSheetSync(record.response_id, "synced");
    return { ok: true, ...sheetResult };
  } catch (err) {
    await markSheetSync(record.response_id, "failed", {
      error: String(err?.message || err).slice(0, 500),
    });
    throw err;
  }
}

export async function syncPendingToSheets() {
  if (!isSheetsEnabled()) return { skipped: true, reason: "sheets_not_configured" };

  const { fetchPendingSheetSync } = await import("./supabase.js");
  const pending = await fetchPendingSheetSync(25);
  let synced = 0;
  let failed = 0;

  for (const record of pending) {
    try {
      await syncRecordToSheet(record);
      synced += 1;
    } catch {
      failed += 1;
    }
  }

  return { synced, failed, total: pending.length };
}
