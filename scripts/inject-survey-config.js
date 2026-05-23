import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "survey-config.js");

const endpoint = process.env.SURVEY_STABLE_ENDPOINT || "/api/survey-responses";
const apiKey = process.env.SURVEY_API_KEY || "";
const mode = process.env.SURVEY_SAVE_MODE || "stable";

const content = `// 자동 생성됨 (npm run build / Vercel 배포 시)
window.SURVEY_SAVE_MODE = ${JSON.stringify(mode)};
window.SURVEY_STABLE_ENDPOINT = ${JSON.stringify(endpoint)};
window.SURVEY_STABLE_API_KEY = ${JSON.stringify(apiKey)};
`;

fs.writeFileSync(outPath, content, "utf8");
console.log("[build] wrote survey-config.js");
