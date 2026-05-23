import { searchItunes } from "../server/src/itunes-search.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const term = String(req.query.term || req.query.q || "").trim();
  if (!term) {
    return res.status(400).json({ ok: false, error: "term_required" });
  }

  try {
    const results = await searchItunes(term);
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error("[itunes-search]", err);
    return res.status(502).json({ ok: false, error: "search_failed" });
  }
}
