import { getSupabase } from "../server/src/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("students")
      .select("id, name, class, group")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return res.status(200).json({ ok: true, students: data });
  } catch (err) {
    console.error("[students]", err);
    return res.status(500).json({ ok: false, error: "fetch_failed" });
  }
}
