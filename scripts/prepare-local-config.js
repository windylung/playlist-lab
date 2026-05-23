/**
 * server/.env 를 읽어 survey-config.js 생성 (로컬 개발용)
 * API는 http://localhost:8787 — python http.server 와 분리
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, "server", ".env");
const outPath = path.join(root, "survey-config.js");

function parseEnvFile(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

if (!fs.existsSync(envPath)) {
  console.error("[local] server/.env 가 없습니다. server/.env.example 을 복사하세요.");
  process.exit(1);
}

const env = parseEnvFile(fs.readFileSync(envPath, "utf8"));
const apiKey = env.SURVEY_API_KEY || "";
const port = env.PORT || "8787";

if (!apiKey) {
  console.error("[local] server/.env 에 SURVEY_API_KEY 가 필요합니다.");
  process.exit(1);
}

const content = `// 로컬 개발용 (scripts/prepare-local-config.js)
window.SURVEY_SAVE_MODE = "stable";
window.SURVEY_STABLE_ENDPOINT = "http://localhost:${port}/api/survey-responses";
window.SURVEY_STABLE_API_KEY = ${JSON.stringify(apiKey)};
`;

fs.writeFileSync(outPath, content, "utf8");
console.log(`[local] survey-config.js → http://localhost:${port}/api/survey-responses`);
