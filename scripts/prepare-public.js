/**
 * Vercel 배포용: 정적 파일을 public/ 으로 복사
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

const STATIC_FILES = [
  "Music Survey.html",
  "styles.css",
  "shared.jsx",
  "screens.jsx",
  "tweaks-panel.jsx",
  "app.jsx",
  "survey-config.js",
];

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const name of STATIC_FILES) {
  const src = path.join(root, name);
  if (!fs.existsSync(src)) {
    console.error(`[build] missing: ${name}`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(publicDir, name));
}

console.log("[build] copied", STATIC_FILES.length, "files → public/");
