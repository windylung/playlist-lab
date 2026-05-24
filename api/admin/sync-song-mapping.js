import { checkApiKey } from "../_lib/auth.js";
import { getSupabase } from "../../server/src/supabase.js";
import { syncSongMappingSheet } from "../../server/src/sheets.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const auth = checkApiKey(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ ok: false, error: auth.error });
  }

  try {
    const supabase = getSupabase();
    const { data: songs, error } = await supabase
      .from("songs")
      .select("id, title, artist, genre")
      .order("sort_order", { ascending: true });
    if (error) throw error;

    const result = await syncSongMappingSheet(songs);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[sync-song-mapping]", err);
    return res.status(500).json({ ok: false, error: "sync_failed" });
  }
}
