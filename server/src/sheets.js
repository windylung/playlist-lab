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

function flattenRow(record) {
  const reactions = Array.isArray(record.reactions) ? record.reactions : [];
  const favorites = Array.isArray(record.favorites) ? record.favorites : [];

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
    reactions.length,
    reactionSummary,
    favorites.length,
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
  "reaction_count",
  "reactions",
  "favorite_count",
  "favorites",
  "app_version",
  "mode",
  "db_created_at",
];

async function ensureHeader(sheets) {
  const range = `${sheetConfig.tabName}!A1:N1`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetConfig.spreadsheetId,
    range,
  });
  const first = res.data.values?.[0];
  if (first && first.length >= 5) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetConfig.spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [HEADER] },
  });
}

export async function appendSurveyToSheet(record) {
  const sheets = getSheetsClient();
  await ensureHeader(sheets);

  const range = `${sheetConfig.tabName}!A:N`;
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetConfig.spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [flattenRow(record)] },
  });
}

export async function syncPendingToSheets() {
  if (!isSheetsEnabled()) return { skipped: true, reason: "sheets_not_configured" };

  const { fetchPendingSheetSync } = await import("./supabase.js");
  const pending = await fetchPendingSheetSync(25);
  let synced = 0;
  let failed = 0;

  for (const record of pending) {
    try {
      await markSheetSync(record.response_id, "syncing");
      await appendSurveyToSheet(record);
      await markSheetSync(record.response_id, "synced");
      synced += 1;
    } catch (err) {
      failed += 1;
      await markSheetSync(record.response_id, "failed", {
        error: String(err?.message || err).slice(0, 500),
      });
    }
  }

  return { synced, failed, total: pending.length };
}
