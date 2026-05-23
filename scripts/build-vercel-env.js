/**
 * server/.env → .env.vercel 생성 (Vercel 대시보드 Import용)
 *
 * 사용:
 *   npm run env:vercel
 *
 * Vercel 적용:
 *   Dashboard → Project → Settings → Environment Variables → Import .env
 *   파일: vercel-env.json (Finder에서 선택 가능, 권장)
 *         .env.vercel (숨김 파일 — 터미널용)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const serverEnvPath = path.join(root, "server", ".env");
const outDotEnvPath = path.join(root, ".env.vercel");
const outJsonPath = path.join(root, "vercel-env.json");
const outVisibleEnvPath = path.join(root, "vercel-env.env");

function parseEnvFile(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function readGoogleCredentialsBase64(env) {
  if (env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64.replace(/\s+/g, "");
  }

  const credPath = env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) return "";

  const abs = path.isAbsolute(credPath)
    ? credPath
    : path.join(root, "server", credPath.replace(/^\.\//, ""));

  if (!fs.existsSync(abs)) {
    console.warn("[warn] Google credentials file not found:", abs);
    return "";
  }

  return Buffer.from(fs.readFileSync(abs)).toString("base64");
}

if (!fs.existsSync(serverEnvPath)) {
  console.error("[error] server/.env 가 없습니다. server/.env.example 을 참고해 만드세요.");
  process.exit(1);
}

const src = parseEnvFile(fs.readFileSync(serverEnvPath, "utf8"));
const googleB64 = readGoogleCredentialsBase64(src);

const vercelEnv = {
  SUPABASE_URL: src.SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: src.SUPABASE_SERVICE_ROLE_KEY || "",
  SURVEY_API_KEY: src.SURVEY_API_KEY || "",
  SURVEY_SAVE_MODE: "stable",
  SURVEY_STABLE_ENDPOINT: "/api/survey-responses",
  GOOGLE_SHEETS_SPREADSHEET_ID: src.GOOGLE_SHEETS_SPREADSHEET_ID || "",
  GOOGLE_SHEETS_TAB_NAME: src.GOOGLE_SHEETS_TAB_NAME || "응답",
  GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: googleB64,
  CRON_SECRET: src.CRON_SECRET || src.SURVEY_API_KEY || "",
};

const missing = [];
if (!vercelEnv.SUPABASE_URL) missing.push("SUPABASE_URL");
if (!vercelEnv.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (!vercelEnv.SURVEY_API_KEY) missing.push("SURVEY_API_KEY");

const lines = [
  "# Vercel import용 — npm run env:vercel 로 생성됨",
  "# Dashboard → Settings → Environment Variables → Import .env",
  "#",
  ...Object.entries(vercelEnv).map(([k, v]) => `${k}=${v}`),
  "",
];

const dotEnvBody = lines.join("\n");
fs.writeFileSync(outDotEnvPath, dotEnvBody, "utf8");
fs.writeFileSync(outVisibleEnvPath, dotEnvBody, "utf8");

const jsonPayload = {
  _comment: "Vercel import용 — npm run env:vercel 로 생성됨. Git에 커밋하지 마세요.",
  env: vercelEnv,
};
fs.writeFileSync(outJsonPath, JSON.stringify(jsonPayload, null, 2), "utf8");

console.log("[ok] wrote", outDotEnvPath);
console.log("[ok] wrote", outJsonPath);
console.log("[ok] wrote", outVisibleEnvPath, "(Finder · Vercel Import .env 권장)");
console.log("");
console.log("다음 단계:");
console.log("  1. Vercel → Project → Settings → Environment Variables");
console.log("  2. Import .env → vercel-env.env 선택 (JSON은 백업/확인용)");
console.log("  3. Production + Preview + Development 체크");
console.log("  4. Import 후 Redeploy");
console.log("");

if (missing.length) {
  console.warn("[warn] 비어 있는 필수 값:", missing.join(", "));
}

if (!vercelEnv.GOOGLE_SHEETS_SPREADSHEET_ID || !googleB64) {
  console.warn("[warn] Google Sheets 미설정 — 시트 동기화는 비활성입니다.");
}
