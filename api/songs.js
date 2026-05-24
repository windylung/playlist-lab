import { getSupabase } from "../server/src/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("songs")
      .select("id, title, artist, genre, genre_en, hue, edge_color, artwork, youtube")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    const songs = data.map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      genre: s.genre,
      genreEn: s.genre_en,
      hue: s.hue,
      edgeColor: s.edge_color,
      artwork: s.artwork,
      youtube: s.youtube,
    }));
    return res.status(200).json({ ok: true, songs });
  } catch (err) {
    console.error("[songs]", err);
    return res.status(500).json({ ok: false, error: "fetch_failed" });
  }
}
