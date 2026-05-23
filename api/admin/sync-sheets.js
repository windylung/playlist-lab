import { checkApiKey } from "../_lib/auth.js";
import { syncPendingToSheets } from "../../server/src/sheets.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const auth = checkApiKey(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ ok: false, error: auth.error });
  }

  try {
    const result = await syncPendingToSheets();
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("[sheet-sync]", err);
    return res.status(500).json({ ok: false, error: "sync_failed" });
  }
}
