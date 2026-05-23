/** iTunes Search API — server-side proxy (avoids browser CORS / JSONP blocks on deploy). */

export function upgradeArtworkUrl(url) {
  if (!url) return undefined;
  return url.replace(/(\d+)x(\d+)bb\.jpg$/, "300x300bb.jpg");
}

export function normalizeItunesResults(raw) {
  return (raw || [])
    .map((r) => ({
      title: r.trackName || "",
      artist: r.artistName || "",
      artwork: upgradeArtworkUrl(r.artworkUrl100),
      hue: Math.abs(r.trackId || 0) % 360,
    }))
    .filter((s) => s.title && s.artist);
}

export async function searchItunes(term, limit = 10) {
  const q = String(term || "").trim();
  if (!q) return [];

  const params = new URLSearchParams({
    term: q,
    media: "music",
    entity: "song",
    country: "kr",
    limit: String(limit),
  });
  const url = `https://itunes.apple.com/search?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`itunes_http_${res.status}`);
  const data = await res.json();
  return normalizeItunesResults(data.results);
}
