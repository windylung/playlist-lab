import { isSheetsEnabled } from "../server/src/sheets.js";

export default async function handler(_req, res) {
  res.status(200).json({
    ok: true,
    sheets: isSheetsEnabled() ? "enabled" : "disabled",
    timestamp: new Date().toISOString(),
  });
}
