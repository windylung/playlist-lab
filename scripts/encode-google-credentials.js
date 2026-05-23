/**
 * 서비스 계정 JSON → base64 (Vercel 환경변수용)
 * 사용: node scripts/encode-google-credentials.js server/google-service-account.json
 */
import fs from "node:fs";
import path from "node:path";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/encode-google-credentials.js <path-to-json>");
  process.exit(1);
}

const abs = path.resolve(filePath);
if (!fs.existsSync(abs)) {
  console.error("File not found:", abs);
  process.exit(1);
}

const b64 = Buffer.from(fs.readFileSync(abs)).toString("base64");
console.log("\nGOOGLE_SERVICE_ACCOUNT_JSON_BASE64=\n");
console.log(b64);
console.log("\n→ 위 한 줄을 Vercel Environment Variables에 붙여넣으세요.\n");
