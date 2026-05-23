// === ICONS (custom — no platform emoji) =============================
const Ic = {
  Search: (p) => (
    <svg className="ic" width={p.s||18} height={p.s||18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="8" cy="8" r="5"/><path d="M12 12l4 4"/>
    </svg>
  ),
  X: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M4 4l8 8M12 4l-8 8"/>
    </svg>
  ),
  Check: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8.5l3.2 3.2L13 5"/>
    </svg>
  ),
  Arrow: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  ),
  Back: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 8H3M7 4L3 8l4 4"/>
    </svg>
  ),
  // reaction icons (spotify-ish but original)
  Heart: (p) => (
    <svg className="ic" width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/>
    </svg>
  ),
  HeartFill: (p) => (
    <svg className="ic" width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 20.5s-7.2-4.65-7.2-10.2a4.2 4.2 0 017.2-2.85A4.2 4.2 0 0119.2 10.3c0 5.55-7.2 10.2-7.2 10.2z"/>
    </svg>
  ),
  Skip: (p) => (
    <svg className="ic" width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 14 Q 6 9 9 14 T 15 14 T 21 14"/>
    </svg>
  ),
  Wave: (p) => (
    <svg className="ic" width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 14 Q 6 9 9 14 T 15 14 T 21 14"/>
    </svg>
  ),
  HeartBroken: (p) => (
    <svg className="ic" width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/>
      <path d="M11.5 6.5l1 3-2.2 1.2 2.4 2.2-1.4 3.1"/>
    </svg>
  ),
  ThumbDown: (p) => (
    <svg className="ic" width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 14V4M17 4h2v10h-2zM14 14l-2 5a1.5 1.5 0 01-2.8-.4L10 14H5.6a1.5 1.5 0 01-1.5-1.85L5.8 5.15A1.5 1.5 0 017.25 4H14"/>
    </svg>
  ),
  Play: (p) => (
    <svg className="ic" width={p.s||14} height={p.s||14} viewBox="0 0 14 14" fill="currentColor" {...p}>
      <path d="M3 2.5v9l8-4.5z"/>
    </svg>
  ),
  External: (p) => (
    <svg className="ic" width={p.s||14} height={p.s||14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 3H3v8h8V9M8 3h3v3M11 3L6.5 7.5"/>
    </svg>
  ),
  Plus: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M8 3v10M3 8h10"/>
    </svg>
  ),
  Sparkle: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path d="M8 1l1.2 4.6L14 7 9.2 8.4 8 13l-1.2-4.6L2 7l4.8-1.4L8 1z"/>
    </svg>
  ),
  Note: (p) => (
    <svg className="ic" width={p.s||16} height={p.s||16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12V3l8-1.5V11"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="11" r="1.5"/>
    </svg>
  ),
};

// === COLOR UTILS ====================================================
// RGB(0~255) → HSL { h: 0-360, s: 0-1, l: 0-1 }.
function rgbToHsl(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h = ((h * 60) + 360) % 360;
  return { h, s, l };
}

function rgbToHue(r, g, b) {
  const { h, s } = rgbToHsl(r, g, b);
  return s < 0.04 ? null : h;
}

// Hosts that don't return CORS headers; we skip canvas extraction for them
// to avoid console errors and cache-mode collisions with the main <img>.
const EDGE_HUE_BLOCKED_HOSTS = ["cdnimg.melon.co.kr"];

// Sample the outer ring of an image and average it to get the dominant
// "edge color". Returns a hue (0~360) or null on failure / CORS block.
function extractEdgeHue(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    try {
      const host = new URL(url, window.location.href).hostname;
      if (EDGE_HUE_BLOCKED_HOSTS.includes(host)) return resolve(null);
    } catch {
      return resolve(null);
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0, g = 0, b = 0, count = 0;
        const ring = 3;
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const onEdge = x < ring || y < ring || x >= size - ring || y >= size - ring;
            if (!onEdge) continue;
            const i = (y * size + x) * 4;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (!count) return resolve(null);
        resolve(rgbToHue(r / count, g / count, b / count));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// === INFRARED STAGE — heat-map style background for the play screen ===
// Either `color` (RGB array sampled from the album palette) or `hue` drives
// the mood. When color is provided we use its true H/S/L so muted album art
// stays muted and vibrant art stays vibrant; saturation gets a soft floor
// so achromatic covers still receive a faint tint instead of pure gray.
function InfraredStage({ hue = 28, color = null }) {
  let baseH, baseS, baseL;
  if (Array.isArray(color)) {
    const hsl = rgbToHsl(color[0], color[1], color[2]);
    baseH = hsl.h;
    baseS = Math.max(hsl.s, 0.18);
    baseL = hsl.l;
  } else {
    baseH = hue;
    baseS = 0.72;
    baseL = 0.52;
  }

  const pct = (n) => `${Math.max(0, Math.min(100, n * 100)).toFixed(1)}%`;
  const c = (h, s, l) => `hsl(${((h % 360) + 360) % 360} ${pct(s)} ${pct(l)})`;

  const mainColor =
    c(baseH, Math.min(baseS + 0.08, 0.95), Math.min(baseL + 0.18, 0.78));
  const accentColor =
    c(baseH, Math.max(baseS - 0.05, 0.16), Math.min(baseL + 0.32, 0.88));

  const blobs = [
    { c: mainColor,   w: 520, h: 520, x: "-20%", y: "-10%", a: "heat1", d: "0s",  b: 70, o: 0.95 },
    { c: accentColor, w: 460, h: 460, x: "55%",  y: "8%",   a: "heat2", d: "-3s", b: 60, o: 0.85 },
    { c: mainColor,   w: 420, h: 420, x: "60%",  y: "60%",  a: "heat4", d: "-9s", b: 70, o: 0.9  },
    { c: accentColor, w: 380, h: 380, x: "10%",  y: "55%",  a: "heat3", d: "-6s", b: 80, o: 0.8  },
    { c: mainColor,   w: 240, h: 240, x: "35%",  y: "30%",  a: "heat1", d: "-2s", b: 60, o: 0.7  },
  ];

  const baseGradient =
    `radial-gradient(120% 90% at 50% 50%,` +
    ` ${c(baseH, Math.min(baseS + 0.05, 0.9),  Math.max(baseL * 0.6,  0.22))} 0%,` +
    ` ${c(baseH, baseS,                        Math.max(baseL * 0.42, 0.14))} 65%,` +
    ` ${c(baseH, Math.max(baseS - 0.10, 0.15), Math.max(baseL * 0.28, 0.08))} 100%)`;

  return (
    <div className="infrared" aria-hidden="true">
      <div style={{
        position: "absolute", inset: 0,
        background: baseGradient,
      }}/>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="heat-blob"
          style={{
            width: b.w, height: b.h,
            background: b.c,
            left: b.x, top: b.y,
            filter: `blur(${b.b}px)`,
            opacity: b.o,
            animation: `${b.a} 18s ease-in-out infinite`,
            animationDelay: b.d,
          }}
        />
      ))}
    </div>
  );
}

// === BLOB STAGE — animated soft glowing organic shapes (poster vibe) ===
// Each tint uses exactly two fixed colors (main + accent). Animation only
// moves the blobs around; colors themselves never change.
function BlobStage({ tint = "electric", intensity = 1 }) {
  const palettes = {
    electric: { main: "oklch(0.55 0.24 268)", accent: "oklch(0.78 0.20 35)"  },
    cream:    { main: "oklch(0.84 0.14 55)",  accent: "oklch(0.72 0.18 268)" },
    sunset:   { main: "oklch(0.78 0.20 35)",  accent: "oklch(0.72 0.20 18)"  },
    mono:     { main: "oklch(0.55 0.24 268)", accent: "oklch(0.42 0.24 268)" },
  };
  const pal = palettes[tint] || palettes.electric;

  const blobs = [
    { c: pal.main,   s: 420, x: "60%",  y: "-20%", a: "drift2", d: "-2s", b: 80 },
    { c: pal.accent, s: 360, x: "-10%", y: "10%",  a: "drift1", d: "0s",  b: 60 },
    { c: pal.main,   s: 280, x: "70%",  y: "70%",  a: "drift1", d: "-6s", b: 90 },
    { c: pal.accent, s: 300, x: "30%",  y: "60%",  a: "drift3", d: "-4s", b: 70 },
  ];

  return (
    <div className="blob-stage" aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="blob"
          style={{
            width: b.s, height: b.s,
            background: b.c,
            left: b.x, top: b.y,
            filter: `blur(${b.b}px)`,
            opacity: 0.85 * intensity,
            animation: `${b.a} 14s ease-in-out infinite`,
            animationDelay: b.d,
          }}
        />
      ))}
    </div>
  );
}

// === STATUS BAR ===
function TopBar({ label, invert = false, right = null }) {
  return (
    <div className={"topbar" + (invert ? " invert" : "")}>
      <div><span className="dot"/>{label}</div>
      <div>{right}</div>
    </div>
  );
}

// === PROGRESS BAR ===
function Progress({ value, total, invert = false }) {
  const pct = Math.max(0, Math.min(100, (value / total) * 100));
  return (
    <div className={"progress-track" + (invert ? " invert" : "")}>
      <div className="progress-fill" style={{ width: pct + "%" }} />
    </div>
  );
}

// === SAVE INDICATOR ===
function SaveIndicator({ status }) {
  // status: 'idle' | 'saving' | 'saved' | 'failed'
  const label = {
    idle:   "AUTOSAVE",
    saving: "SAVING…",
    saved:  "✓ SAVED",
    failed: "⚠ RETRYING",
  }[status] || "AUTOSAVE";
  return (
    <span className={"save-ind " + status}>
      {status === "saving" && <span className="live-dot"/>}
      {label}
    </span>
  );
}

// === ALBUM ART — shows real artwork when available, procedural gradient fallback ===
function AlbumArt({ song, size = 280 }) {
  const hue = song?.hue ?? 268;
  const artwork = song?.artwork;
  return (
    <div style={{
      position: "relative",
      width: size, height: size,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 24px 50px -20px oklch(0.16 0.03 270 / 0.55), 0 0 0 1px oklch(1 0 0 / 0.10)",
      background: `oklch(0.40 0.24 268)`,
    }}>
      {artwork ? (
        <img
          src={artwork}
          alt={song?.title || ""}
          referrerPolicy="no-referrer"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, oklch(0.50 0.24 268) 0%, oklch(0.32 0.24 268) 100%)`,
          }}/>
          <div style={{
            position: "absolute",
            width: size * 0.95, height: size * 0.95,
            left: "-20%", top: "5%",
            background: `oklch(0.82 0.20 ${hue})`,
            borderRadius: "50%",
            filter: `blur(${size * 0.11}px)`,
            mixBlendMode: "screen",
          }}/>
          <div style={{
            position: "absolute",
            width: size * 0.7, height: size * 0.7,
            right: "-12%", bottom: "-8%",
            background: `oklch(0.86 0.16 ${(hue+30)%360})`,
            borderRadius: "50%",
            filter: `blur(${size * 0.10}px)`,
            mixBlendMode: "screen",
          }}/>
          <div style={{
            position: "absolute",
            width: size * 0.55, height: size * 0.55,
            left: "32%", top: "38%",
            background: `oklch(0.74 0.22 ${(hue+340)%360})`,
            borderRadius: "50%",
            filter: `blur(${size * 0.14}px)`,
            mixBlendMode: "screen",
          }}/>
        </>
      )}
      <div className="grain heavy" style={{ position: "absolute", inset: 0, zIndex: 2 }}/>
    </div>
  );
}

// === SMALL ALBUM ART for lists ===
function MiniArt({ song, size = 44, artwork }) {
  const hue = song?.hue ?? 268;
  const url = artwork || song?.artwork;
  if (url) {
    return (
      <div style={{
        position: "relative",
        width: size, height: size,
        borderRadius: 8,
        overflow: "hidden",
        background: `oklch(0.40 0.24 268)`,
        flexShrink: 0,
        boxShadow: "inset 0 0 0 1px oklch(0.16 0.03 270 / 0.08)",
      }}>
        <img src={url} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
      </div>
    );
  }
  return (
    <div style={{
      position: "relative",
      width: size, height: size,
      borderRadius: 8,
      overflow: "hidden",
      background: `linear-gradient(135deg, oklch(0.55 0.24 268), oklch(0.42 0.24 268))`,
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", inset: -size*0.3,
        background: `radial-gradient(circle at 30% 40%, oklch(0.78 0.20 ${hue}) 0%, transparent 60%)`,
        mixBlendMode: "screen",
      }}/>
      <div style={{
        position: "absolute", inset: -size*0.3,
        background: `radial-gradient(circle at 80% 80%, oklch(0.84 0.14 ${(hue+30)%360}) 0%, transparent 50%)`,
        mixBlendMode: "screen",
      }}/>
    </div>
  );
}

// === REACTION BUTTON — glassmorphism ===
function ReactionBtn({ kind, onClick, pressed, labels }) {
  const L = labels || {};
  const config = {
    like:    { label: L.like    || "좋아요",     icon: <Ic.HeartFill s={26}/>,   tint: "oklch(0.78 0.18 28)" },
    skip:    { label: L.skip    || "그저 그래요", icon: <Ic.Wave s={26}/>,        tint: "oklch(1 0 0 / 0.5)" },
    dislike: { label: L.dislike || "별로에요",   icon: <Ic.X s={26}/>,             tint: "oklch(0.7 0.18 18)" },
  }[kind];
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "10px 6px 6px",
        transition: "transform .15s cubic-bezier(.2,.7,.2,1)",
        transform: pressed ? "scale(0.92)" : "scale(1)",
      }}
    >
      <div className="glass" style={{
        position: "relative",
        width: 68, height: 68, borderRadius: "50%",
        display: "grid", placeItems: "center",
        background: pressed ? "oklch(1 0 0 / 0.22)" : "oklch(1 0 0 / 0.10)",
      }}>
        {pressed && (
          <span style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: config.tint,
            animation: "pulse-ring .6s ease-out forwards",
            mixBlendMode: "screen",
          }}/>
        )}
        <span style={{ color: "oklch(1 0 0 / 0.98)", display: "grid", placeItems: "center", position: "relative" }}>
          {config.icon}
        </span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em", color: "oklch(1 0 0 / 0.92)" }}>{config.label}</div>
    </button>
  );
}

// === MODAL ===
function Modal({ children, onClose, variant }) {
  const isGlass = variant === "glass";
  return (
    <div className={"modal-bg" + (isGlass ? " modal-bg-glass" : "")} onClick={onClose}>
      <div className={"modal" + (isGlass ? " modal-glass" : "")} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// === Export to window ===
Object.assign(window, {
  Ic, BlobStage, InfraredStage, TopBar, Progress, SaveIndicator,
  AlbumArt, MiniArt, ReactionBtn, Modal,
  extractEdgeHue, rgbToHue, rgbToHsl,
});
