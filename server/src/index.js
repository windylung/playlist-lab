import "dotenv/config";
import cors from "cors";
import express from "express";
import { saveSurveyResponse } from "./supabase.js";
import { isSheetsEnabled, syncPendingToSheets } from "./sheets.js";
import { validateSubmission } from "./validate.js";

const PORT = Number(process.env.PORT || 8787);
const API_KEY = process.env.SURVEY_API_KEY || "";
const SHEET_SYNC_INTERVAL_MS = Number(process.env.SHEET_SYNC_INTERVAL_MS || 30000);

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || "*";
  if (raw.trim() === "*") return true;
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function requireApiKey(req, res, next) {
  if (!API_KEY) {
    return res.status(500).json({ ok: false, error: "server_misconfigured_api_key" });
  }
  const key = req.get("x-survey-api-key") || "";
  if (key !== API_KEY) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

const app = express();
app.use(express.json({ limit: "256kb" }));

const allowedOrigins = parseAllowedOrigins();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins === true) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("null")) {
        return callback(null, true);
      }
      return callback(new Error("cors_not_allowed"));
    },
  })
);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    sheets: isSheetsEnabled() ? "enabled" : "disabled",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/survey-responses", requireApiKey, async (req, res) => {
  const validation = validateSubmission(req.body);
  if (!validation.ok) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    const result = await saveSurveyResponse(validation.row);
    res.status(200).json({
      ok: true,
      response_id: result.response_id,
      duplicate: result.duplicate,
      sheet_sync: isSheetsEnabled() ? "queued" : "skipped",
    });
  } catch (err) {
    console.error("[survey-save]", err);
    res.status(500).json({ ok: false, error: "save_failed" });
  }
});

app.post("/api/admin/sync-sheets", requireApiKey, async (_req, res) => {
  try {
    const result = await syncPendingToSheets();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("[sheet-sync]", err);
    res.status(500).json({ ok: false, error: "sync_failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[collector] listening on http://localhost:${PORT}`);
  console.log(`[collector] sheets sync: ${isSheetsEnabled() ? "ON" : "OFF"}`);

  if (SHEET_SYNC_INTERVAL_MS > 0 && isSheetsEnabled()) {
    setInterval(async () => {
      try {
        const r = await syncPendingToSheets();
        if (r.total > 0) console.log("[sheet-sync]", r);
      } catch (err) {
        console.error("[sheet-sync-bg]", err);
      }
    }, SHEET_SYNC_INTERVAL_MS);
  }
});
