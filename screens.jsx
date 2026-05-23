// === SCREEN 0: LANDING (motion poster) ==========================
// musical-note-svg.svg 의 path d 속성을 그대로 옮겨옴 (viewBox 0 0 100 100)
const NOTE_PATH =
  "m93.161 0.071c-33.501-1.114-60.941 11.243-60.941 11.243l-0.02 62.709c-3.411-1.354-7.559-1.675-11.772-0.651-9.083 2.207-15.031 9.82-13.285 17.007s10.524 11.225 19.606 9.019c8.564-2.081 14.338-8.969 13.507-15.772v-46.855s19.404-6.784 44.573-8.485v34.849c-3.374-1.292-7.443-1.585-11.579-0.58-9.083 2.206-15.031 9.819-13.285 17.007 1.745 7.187 10.523 11.224 19.606 9.018 7.931-1.927 13.471-7.977 13.587-14.264l0.003 0.004v-74.249z";

// 음표 하나 — 내부에서만 hue 가 회전한다
function HeroMusicNote() {
  return (
    <svg
      className="hero-note-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* 음표 외곽 마스크 */}
        <clipPath id="hero-note-clip">
          <path d={NOTE_PATH} />
        </clipPath>

        {/* 음표 안을 채울 진한 원색 그라데이션 */}
        <linearGradient id="hero-note-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7c3aed" />
          <stop offset="25%"  stopColor="#e11d48" />
          <stop offset="50%"  stopColor="#eab308" />
          <stop offset="75%"  stopColor="#0891b2" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* 컬러 블롭을 부드럽게 흘리기 위한 블러 */}
        <filter id="hero-note-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* === 음표 내부 === hue 애니메이션은 오직 이 안에서만 발생 */}
      <g clipPath="url(#hero-note-clip)">
        <g className="hero-note-hue">
          {/* 베이스 무지개 채우기 */}
          <rect x="0" y="0" width="100" height="100" fill="url(#hero-note-grad)" />

          {/* 살짝씩 떠다니는 컬러 블롭들 — 빛이 흐르는 느낌 */}
          <g filter="url(#hero-note-blur)">
            <circle className="hero-blob hero-blob-a" cx="30" cy="22" r="26" fill="#ff0080" />
            <circle className="hero-blob hero-blob-b" cx="72" cy="58" r="28" fill="#00a8ff" />
            <circle className="hero-blob hero-blob-c" cx="44" cy="82" r="24" fill="#ffcc00" />
          </g>
        </g>
      </g>

    </svg>
  );
}

function LandingScreen({ tweaks = {}, onStart }) {
  const titleLine1 = "우리반의";
  const titleLine2 = "음악취향";

  return (
    <div className="screen landing">
      <div className="landing-bg" aria-hidden="true" />
      <div className="grain landing-grain" aria-hidden="true" />

      {/* 중앙의 음표 한 개 */}
      <div className="hero-note" aria-hidden="true">
        <HeroMusicNote />
      </div>

      {/* 하단 타이틀 / 서브카피 / CTA */}
      <div className="landing-content">
        <h1 className="landing-title rise">
          {titleLine1}
          <br />
          {titleLine2}
        </h1>
        <button
          type="button"
          className="landing-cta glass-btn rise delay-1"
          onClick={onStart}
          aria-label="시작하기"
        >
          <span>시작하기</span>
          <Ic.Arrow />
        </button>
      </div>
    </div>
  );
}

// === SCREEN 1: ENTRY ============================================
function EntryScreen({ session, tweaks = {}, onEnter }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const [confirmRetake, setConfirmRetake] = React.useState(null);

  const hasQuery = query.trim().length > 0;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return window.STUDENTS.filter((s) =>
      s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [query]);

  function handleEnter() {
    if (!selected) return;
    const prev = JSON.parse(localStorage.getItem("music_survey_v1") || "null");
    if (prev?.completed && prev?.session?.student_id === selected.id) {
      setConfirmRetake(selected);
      return;
    }
    onEnter(selected);
  }

  return (
    <div className="screen entry">
      <div className="entry-bg" aria-hidden="true" />
      <div className="grain entry-grain" aria-hidden="true" />

      <div className="screen-pad entry-header">
        <h1 className="screen-title rise">프로필을 선택해주세요</h1>
        <p className="screen-subtitle rise delay-1">
          이름이나 학번을 입력하면<br />
          자동으로 검색됩니다
        </p>

        {/* Search */}
        <div className="rise delay-2 search glass-light">
          <Ic.Search />
          <input
            placeholder="이름 또는 학번 검색"
            value={query}
            autoFocus={typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches}
            onChange={(e) => setQuery(e.target.value)} />
          {query &&
            <button type="button" className="icon-btn entry-icon-btn" onClick={() => { setQuery(""); setSelected(null); }}>
              <Ic.X />
            </button>
          }
        </div>
      </div>

      {/* Student list — only visible while searching */}
      <div className="screen-pad-x entry-list">
        {!hasQuery ? null : (
          <div className="rise entry-scroll-wrap">
            <div className="scroll entry-scroll">
              {filtered.length === 0 ? (
                <div className="text-center entry-no-result">
                  검색 결과가 없습니다
                </div>
              ) : (
                filtered.map((s) => (
                  <div
                    key={s.id}
                    className={"row glass-light" + (selected?.id === s.id ? " selected" : "")}
                    onClick={() => setSelected(s)}>
                    <span className="row-id">{s.id}</span>
                    <span className="row-name">{s.name}</span>
                    {selected?.id === s.id && <Ic.Check s={18} />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="screen-pad entry-footer">
        <button type="button" className="btn full glass-light entry-cta" disabled={!selected} onClick={handleEnter}>
          {selected ? `${selected.name}님으로 입장하기` : "학생을 선택해 주세요"}
          {selected && <Ic.Arrow />}
        </button>
      </div>

      {confirmRetake &&
        <Modal onClose={() => setConfirmRetake(null)}>
          <div className="display" style={{ fontSize: 28, marginBottom: 8 }}>
            이미 응답하셨어요
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: 20 }}>
            <strong style={{ color: "var(--ink)" }}>{confirmRetake.name}</strong>님은 이전에 응답을 완료했습니다. 다시 응답하시겠어요? 이전 데이터는 그대로 보존됩니다.
          </p>
          <div className="flex gap-3">
            <button className="btn ghost flex-1" onClick={() => setConfirmRetake(null)}>취소</button>
            <button className="btn flex-1" onClick={() => { onEnter(confirmRetake); setConfirmRetake(null); }}>
              다시 응답
            </button>
          </div>
        </Modal>
      }
    </div>
  );
}

// === SCREEN 2: INTRO ============================================
function IntroScreen({ session, tweaks = {}, onStart }) {
  if (!session) return null;

  const actions = [
  { kind: "like", label: tweaks.labelLike || "좋아요", desc: "이런 노래 더 듣고 싶어요", icon: <Ic.HeartFill s={22} /> },
  { kind: "skip", label: tweaks.labelSkip || "그저 그래요", desc: "좀 애매해요, 넘어갈게요", icon: <Ic.Wave s={22} /> },
  { kind: "dislike", label: tweaks.labelDislike || "별로에요", desc: "이런 분위기는 잘 안 들어요", icon: <Ic.X s={22} /> }];


  return (
    <div className="screen intro">
      <div className="intro-bg" aria-hidden="true" />
      <div className="grain intro-grain" aria-hidden="true" />

      <div className="screen-pad intro-header">
        <h1 className="screen-title rise">
          총 {window.SONGS.length}곡을 듣고<br />
          반응을 선택해주세요
        </h1>
        <p className="screen-subtitle rise delay-1">
          한 번 선택하면 돌아갈 수 없어요.
          <br />
          소요 시간은 약 2분 입니다
        </p>
      </div>

      <div className="screen-pad-x intro-body">
        <div className="flex col gap-3 intro-actions">
          {actions.map((a, i) => (
            <div key={a.kind} className={"intro-card glass-light rise delay-" + (i + 2)}>
              <div className="intro-card-icon">{a.icon}</div>
              <div className="intro-card-text">
                <div className="intro-card-label">{a.label}</div>
                <div className="intro-card-desc">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="screen-pad intro-footer">
        <button type="button" className="btn full glass-light intro-cta rise delay-5" onClick={onStart}>
          시작하기
          <Ic.Arrow />
        </button>
      </div>
    </div>
  );

}

// === SCREEN 3: REACTION (CORE) =================================
function ReactionScreen({ session, tweaks = {}, responses, onResponse, onComplete }) {
  const songs = window.SONGS;
  const songOrder = session?.songOrder || songs.map((_, i) => i);
  const idx = responses.length;
  const song = songs[songOrder[idx]];
  const [pressed, setPressed] = React.useState(null);
  const [exiting, setExiting] = React.useState(null);
  const [entering, setEntering] = React.useState(false);
  const stageColor = song?.edgeColor || null;
  const stageHue = song?.hue ?? 268;
  const stageBg = React.useMemo(() => {
    if (Array.isArray(stageColor)) {
      const { h, s, l } = window.rgbToHsl(stageColor[0], stageColor[1], stageColor[2]);
      const sat = Math.max(s, 0.18);
      return `hsl(${h} ${(sat * 100).toFixed(1)}% ${Math.max(l * 0.38, 0.12) * 100}%)`;
    }
    return `oklch(0.28 0.18 ${stageHue})`;
  }, [stageColor, stageHue]);

  React.useEffect(() => {
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 450);
    return () => clearTimeout(t);
  }, [idx]);

  function react(action) {
    if (exiting || pressed) return;
    setPressed(action);
    setExiting(action);

    setTimeout(() => {
      const next = responses.length + 1;
      onResponse({ song_id: song.id, action, timestamp: new Date().toISOString() });
      setPressed(null);
      setExiting(null);
      if (next >= songs.length) {
        setTimeout(onComplete, 350);
      }
    }, 420);
  }

  if (!song) return null;

  const exitAnim = exiting === "like" ? "swipe-right .42s cubic-bezier(.45,.05,.3,1) forwards" :
  exiting === "dislike" ? "swipe-left .42s cubic-bezier(.45,.05,.3,1) forwards" :
  exiting === "skip" ? "swipe-up .42s cubic-bezier(.45,.05,.3,1) forwards" :
  "none";

  return (
    <div className="screen" style={{ background: stageBg, color: "oklch(1 0 0 / 0.96)", transition: "background .6s ease" }}>
      <InfraredStage hue={stageHue} color={stageColor} key={song.id} />
      <div className="grain" />

      {/* Thin progress bar — only top affordance left */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, zIndex: 4,
        padding: "10px 20px 0"
      }}>
        <div style={{
          position: "relative",
          height: 3,
          borderRadius: 3,
          background: "oklch(1 0 0 / 0.16)",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${idx / songs.length * 100}%`,
            background: "oklch(1 0 0 / 0.92)",
            borderRadius: 3,
            transition: "width .55s cubic-bezier(.2,.7,.2,1)"
          }} />
        </div>
      </div>

      {/* Album art + meta */}
      <div className="flex col center" style={{ flex: 1, padding: "44px 24px 12px", position: "relative", zIndex: 2 }}>
        <div
          key={song.id}
          style={{
            animation: exiting ? exitAnim :
            entering ? "rise .55s cubic-bezier(.2,.7,.2,1) both" :
            "none",
            transformOrigin: "center",
            willChange: "transform"
          }}>
          
          <AlbumArt song={song} size={240} />
        </div>

        <div style={{ textAlign: "center", maxWidth: 320, marginTop: 26 }}>
          <h2 className="display" style={{ fontSize: 30, margin: 0, color: "oklch(1 0 0 / 0.98)" }}>
            {song.title}
          </h2>
          <div style={{ fontSize: 16, color: "oklch(1 0 0 / 0.72)", marginTop: 6, fontWeight: 400, letterSpacing: "-0.015em" }}>
            {song.artist}
          </div>
        </div>

        <a
          href={song.youtube} target="_blank" rel="noreferrer"
          className="glass glass-btn"
          style={{
            marginTop: 22,
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 16px",
            fontSize: 12, fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "-0.005em"
          }}>
          
          <Ic.Play s={11} /> YouTube에서 들어보기 <Ic.External s={11} />
        </a>
      </div>

      {/* Reaction buttons */}
      <div style={{ position: "relative", zIndex: 3, padding: "0 12px 26px" }}>
        <div className="flex gap-2" style={{ alignItems: "stretch" }}>
          <ReactionBtn kind="dislike" onClick={() => react("dislike")} pressed={pressed === "dislike"} />
          <ReactionBtn kind="skip" onClick={() => react("skip")} pressed={pressed === "skip"} />
          <ReactionBtn kind="like" onClick={() => react("like")} pressed={pressed === "like"} />
        </div>
      </div>
    </div>);

}

// === SCREEN 4: FAVORITES ========================================
// Expanded local dataset (fallback) — covers common search terms when iTunes is unreachable.
const FAKE_ITUNES = [
// K-POP
{ title: "Love Lee", artist: "AKMU", hue: 30 },
{ title: "Spicy", artist: "aespa", hue: 350 },
{ title: "Super Shy", artist: "NewJeans", hue: 20 },
{ title: "OMG", artist: "NewJeans", hue: 10 },
{ title: "Hype Boy", artist: "NewJeans", hue: 25 },
{ title: "ETA", artist: "NewJeans", hue: 40 },
{ title: "Ditto", artist: "NewJeans", hue: 200 },
{ title: "I AM", artist: "IVE", hue: 290 },
{ title: "After LIKE", artist: "IVE", hue: 300 },
{ title: "Kitsch", artist: "IVE", hue: 320 },
{ title: "ANTIFRAGILE", artist: "LE SSERAFIM", hue: 350 },
{ title: "UNFORGIVEN", artist: "LE SSERAFIM", hue: 340 },
{ title: "Cupid", artist: "FIFTY FIFTY", hue: 340 },
{ title: "Queencard", artist: "(여자)아이들", hue: 320 },
{ title: "Tomboy", artist: "(여자)아이들", hue: 280 },
{ title: "FAST FORWARD", artist: "전소미", hue: 320 },
{ title: "FOREVER 1", artist: "소녀시대", hue: 200 },
{ title: "Seven", artist: "정국", hue: 280 },
{ title: "Standing Next to You", artist: "정국", hue: 260 },
{ title: "Slow Dancing", artist: "V", hue: 30 },
{ title: "Like Crazy", artist: "지민", hue: 350 },
{ title: "Drama", artist: "아이브", hue: 240 },
// 발라드
{ title: "사랑은 늘 도망가", artist: "임영웅", hue: 240 },
{ title: "다시 만날 수 있을까", artist: "임영웅", hue: 250 },
{ title: "이제 나만 믿어요", artist: "임영웅", hue: 230 },
{ title: "사건의 지평선", artist: "윤하", hue: 260 },
{ title: "비도 오고 그래서", artist: "헤이즈", hue: 220 },
{ title: "헤픈 우연", artist: "헤이즈", hue: 230 },
{ title: "밤편지", artist: "IU", hue: 240 },
{ title: "Love Poem", artist: "IU", hue: 220 },
{ title: "에잇", artist: "IU", hue: 200 },
{ title: "Love wins all", artist: "IU", hue: 0 },
{ title: "홀씨", artist: "IU", hue: 60 },
{ title: "신호등", artist: "이무진", hue: 60 },
{ title: "에피소드", artist: "이무진", hue: 80 },
{ title: "청혼", artist: "폴킴", hue: 0 },
{ title: "모든 날, 모든 순간", artist: "폴킴", hue: 30 },
{ title: "야생화", artist: "박효신", hue: 220 },
{ title: "사랑은 늘", artist: "MeloMance", hue: 240 },
// 힙합
{ title: "Antifreeze", artist: "백예린", hue: 200 },
{ title: "이 노래가 클럽에서 나온다면", artist: "DPR LIVE", hue: 350 },
{ title: "VVS", artist: "미란이, 먼치맨, Khundi Panda, MUSHVENOM", hue: 60 },
{ title: "Polaroid", artist: "10cm", hue: 50 },
{ title: "Spot!", artist: "지코", artist2: "제니", hue: 320 },
{ title: "새삥", artist: "지코", hue: 30 },
{ title: "BAM YANG GANG", artist: "BIBI", hue: 320 },
{ title: "Daydream", artist: "장기하", hue: 80 },
// R&B
{ title: "어떻게 이별까지 사랑하겠어", artist: "AKMU", hue: 200 },
{ title: "낙하 (NAKKA)", artist: "AKMU", hue: 220 },
{ title: "오래된 노래", artist: "스탠딩에그", hue: 240 },
{ title: "Instagram", artist: "DEAN", hue: 280 },
{ title: "Vibe", artist: "TAEYANG", hue: 320 },
// 인디 / 락
{ title: "Tomboy", artist: "혁오", hue: 60 },
{ title: "Wi Ing Wi Ing", artist: "혁오", hue: 200 },
{ title: "주저하는 연인들을 위해", artist: "잔나비", hue: 30 },
{ title: "전등사", artist: "검정치마", hue: 220 },
{ title: "Antifreeze", artist: "검정치마", hue: 200 },
// OST
{ title: "사랑인가 봐", artist: "멜로망스", hue: 350 },
{ title: "사랑의 시", artist: "10cm", hue: 320 }];


function upgradeArtworkUrl(url) {
  if (!url) return undefined;
  return url.replace(/(\d+)x(\d+)bb\.jpg$/, "300x300bb.jpg");
}

function normalizeItunesRows(results) {
  return (results || []).map((r) => ({
    title: r.trackName || r.title,
    artist: r.artistName || r.artist,
    artwork: upgradeArtworkUrl(r.artworkUrl100 || r.artwork),
    hue: Math.abs(r.trackId || hashCode(r.trackName || r.title || "") || 0) % 360
  })).filter((s) => s.title && s.artist);
}

// JSONP — localhost static dev only (third-party script often blocked on *.vercel.app).
function itunesSearchJsonp(term, timeoutMs = 3500) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&country=kr&limit=10`;
  return new Promise((resolve, reject) => {
    const cb = "__it_" + Math.random().toString(36).slice(2, 9);
    let done = false;
    const cleanup = () => {
      done = true;
      try { delete window[cb]; } catch {}
      if (s.parentNode) s.parentNode.removeChild(s);
    };
    const to = setTimeout(() => { if (!done) { cleanup(); reject(new Error("jsonp timeout")); } }, timeoutMs);
    window[cb] = (data) => { clearTimeout(to); cleanup(); resolve(data.results || []); };
    const s = document.createElement("script");
    s.src = url + "&callback=" + cb;
    s.onerror = () => { clearTimeout(to); cleanup(); reject(new Error("jsonp error")); };
    document.head.appendChild(s);
  });
}

async function itunesSearch(term, timeoutMs = 3500) {
  const q = term.trim();
  if (!q) return [];

  // 1) Same-origin API — reliable on Vercel (deploy blocks cross-site iTunes JSONP/fetch).
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`/api/itunes-search?term=${encodeURIComponent(q)}`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results[0].title ? data.results : normalizeItunesRows(data.results);
      }
    }
  } catch (_) {}

  // 2) JSONP fallback for python http.server local dev (no /api routes).
  try {
    const raw = await itunesSearchJsonp(q, timeoutMs);
    return normalizeItunesRows(raw);
  } catch (_) {
    return [];
  }
}
function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i), h |= 0;
  return h;
}

function localSearch(q) {
  const ql = q.trim().toLowerCase();
  if (!ql) return [];
  return FAKE_ITUNES.filter((s) =>
  s.title.toLowerCase().includes(ql) || s.artist.toLowerCase().includes(ql)
  ).slice(0, 8);
}

// Suggestion chips by category — surfaced before user types
const SUGGESTION_CHIPS = [
{ label: "IU", q: "IU" },
{ label: "NewJeans", q: "NewJeans" },
{ label: "BTS", q: "BTS" },
{ label: "아이브", q: "IVE" },
{ label: "헤이즈", q: "헤이즈" },
{ label: "염따", q: "염따" },
{ label: "AKMU", q: "AKMU" },
{ label: "지코", q: "지코" }];


function FavoritesScreen({ session, tweaks = {}, favorites, onSubmit }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(favorites || []);
  const [manualOpen, setManualOpen] = React.useState(false);
  const [dupAlert, setDupAlert] = React.useState(null);
  const [source, setSource] = React.useState(null); // 'itunes' | 'local' | null
  const debounceRef = React.useRef(null);
  const reqIdRef = React.useRef(0);

  React.useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);setSource(null);setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const myReq = ++reqIdRef.current;
      const q = query.trim();
      // 1) Try iTunes (fetch + JSONP race)
      let itunes = [];
      try {
        itunes = await itunesSearch(q);
      } catch (_) {}
      if (myReq !== reqIdRef.current) return; // stale
      if (itunes && itunes.length > 0) {
        setResults(itunes);
        setSource("itunes");
        setLoading(false);
        return;
      }
      // 2) Fallback to local dataset
      const local = localSearch(q);
      if (myReq !== reqIdRef.current) return;
      setResults(local);
      setSource(local.length > 0 ? "local" : "empty");
      setLoading(false);
    }, 320);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function addSong(s, src) {
    if (selected.length >= 2) return;
    if (selected.some((x) => x.title === s.title && x.artist === s.artist)) {
      setDupAlert(s);
      setTimeout(() => setDupAlert(null), 1800);
      return;
    }
    setSelected([...selected, { ...s, source: src || source || "itunes" }]);
    setQuery("");
    setResults([]);
    setSource(null);
  }
  function removeSong(i) {
    setSelected(selected.filter((_, idx) => idx !== i));
  }
  function pickSuggestion(q) {setQuery(q);}

  return (
    <div className="screen" style={{ background: "var(--electric)", color: "var(--paper)" }}>
      <BlobStage tint="electric" intensity={0.85} />
      <div className="grain" />

      <div className="screen-pad" style={{ paddingTop: 30, paddingBottom: 12, position: "relative", zIndex: 2 }}>
        <div className="rise" style={{ marginBottom: 18 }}>
          <h1 className="screen-title on-dark">
            자주 듣는 노래를<br />알려 주세요
          </h1>
          <p className="screen-subtitle on-dark" style={{ marginTop: 12, marginBottom: 0 }}>
            제목과 아티스트를 검색해 1~2곡을 선택해주세요
          </p>
        </div>

        {/* selected songs */}
        {selected.length > 0 &&
        <div className="flex col gap-2 rise" style={{ marginBottom: 14 }}>
            {selected.map((s, i) =>
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px 10px 10px",
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: 14
          }}>
                <MiniArt song={{ hue: s.hue || 268 }} artwork={s.artwork} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.artist} {s.source === "manual" && <span style={{ opacity: 0.6 }}>· 직접 입력</span>}
                  </div>
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32, color: "oklch(1 0 0 / 0.7)" }} onClick={() => removeSong(i)}>
                  <Ic.X />
                </button>
              </div>
          )}
          </div>
        }

        {/* search */}
        {selected.length < 2 &&
        <div className="search glass rise delay-1">
            <Ic.Search />
            <input
            placeholder="곡 또는 아티스트 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
          
            {loading &&
          <div style={{ width: 14, height: 14, border: "2px solid oklch(1 0 0 / 0.3)", borderTopColor: "oklch(1 0 0 / 0.95)", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          }
          </div>
        }
      </div>

      {/* results */}
      <div className="screen-pad-x scroll" style={{ flex: 1, position: "relative", zIndex: 2, paddingBottom: 12 }}>
        {selected.length >= 2 ?
        <div style={{ textAlign: "center", padding: "30px 20px" }}>
            <div className="display" style={{ fontSize: 28, color: "oklch(1 0 0 / 0.98)" }}>2곡 다 선택했어요</div>
            <div style={{ fontSize: 13, marginTop: 8, color: "oklch(1 0 0 / 0.65)" }}>제출 버튼을 눌러 주세요</div>
          </div> :
        query.trim() === "" ?
        <div style={{ padding: "8px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "0 10px 12px", color: "oklch(1 0 0 / 0.6)" }}>
              인기 아티스트로 시작해 보세요
            </div>
            <div className="flex" style={{ flexWrap: "wrap", gap: 8, padding: "0 6px 18px" }}>
              {SUGGESTION_CHIPS.map((c, i) =>
            <button
              key={i}
              onClick={() => pickSuggestion(c.q)}
              style={{
                height: 34, padding: "0 14px",
                borderRadius: "var(--r-pill)",
                background: "oklch(1 0 0 / 0.12)",
                backdropFilter: "blur(12px)",
                boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.22)",
                color: "oklch(1 0 0 / 0.95)",
                fontSize: 13, fontWeight: 500,
                letterSpacing: "-0.01em",
                transition: "background .15s, transform .15s"
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              
                  {c.label}
                </button>
            )}
            </div>
          </div> :
        loading ?
        <div className="flex col gap-3" style={{ padding: "8px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "0 10px", color: "oklch(1 0 0 / 0.6)" }}>
              검색 중…
            </div>
            {[0, 1, 2].map((i) =>
          <div key={i} className="flex gap-3" style={{ padding: "12px 14px", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--paper-2)", animation: "blink 1.4s ease-in-out infinite" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 14, width: "60%", borderRadius: 4, background: "var(--paper-2)", animation: "blink 1.4s ease-in-out infinite" }} />
                  <div style={{ height: 11, width: "40%", borderRadius: 4, background: "var(--paper-2)", animation: "blink 1.4s ease-in-out infinite", marginTop: 8 }} />
                </div>
              </div>
          )}
          </div> :
        source === "empty" ?
        <div className="text-center" style={{ padding: "30px 20px", fontSize: 14 }}>
            <div style={{ color: "oklch(1 0 0 / 0.85)", marginBottom: 4 }}>"{query}"에 대한 결과가 없어요</div>
            <div style={{ fontSize: 12, color: "oklch(1 0 0 / 0.55)" }}>다른 키워드로 검색해 주세요</div>
          </div> :

        <div>
            {results.map((s, i) =>
          <div key={i} className="row glass" onClick={() => addSong(s, source)}>
                <MiniArt song={{ hue: s.hue }} artwork={s.artwork} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "oklch(1 0 0 / 0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.artist}</div>
                </div>
                <Ic.Plus s={18} />
              </div>
          )}
          </div>
        }
      </div>

      {/* manual + submit */}
      <div className="screen-pad" style={{ paddingTop: 8, paddingBottom: 24, position: "relative", zIndex: 2 }}>
        {selected.length < 2 &&
        <button type="button" onClick={() => setManualOpen(true)} className="favorites-manual-link favorites-manual-link--footer">
            검색이 안 되나요? 직접 입력
          </button>
        }
        <button className="btn full glass" disabled={selected.length === 0} onClick={() => onSubmit(selected)}>
          {selected.length === 0 ? "1~2곡을 선택해 주세요" : "제출하기"}
          {selected.length > 0 && <Ic.Arrow />}
        </button>
      </div>

      {manualOpen && <ManualModal onClose={() => setManualOpen(false)} onSave={(s) => {addSong(s, "manual");setManualOpen(false);}} />}

      {dupAlert &&
      <div style={{
        position: "absolute", bottom: 100, left: 24, right: 24, zIndex: 200,
        background: "var(--ink)", color: "var(--paper)",
        padding: "12px 16px", borderRadius: 12,
        fontSize: 13, animation: "rise .25s ease-out"
      }}>
          이미 추가된 곡이에요 — <strong>{dupAlert.title}</strong>
        </div>
      }
    </div>);

}

function ManualModal({ onClose, onSave }) {
  const [title, setTitle] = React.useState("");
  const [artist, setArtist] = React.useState("");
  const valid = title.trim().length > 0 && artist.trim().length > 0;
  return (
    <Modal onClose={onClose} variant="glass">
      <h2 className="modal-glass-title">직접 입력</h2>
      <div className="flex col gap-3 modal-glass-fields">
        <div>
          <label className="modal-glass-label" htmlFor="manual-song-title">곡 제목</label>
          <input
            id="manual-song-title"
            className="modal-glass-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 밤편지"
            maxLength={50}
          />
        </div>
        <div>
          <label className="modal-glass-label" htmlFor="manual-song-artist">아티스트</label>
          <input
            id="manual-song-artist"
            className="modal-glass-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="예: IU"
            maxLength={50}
          />
        </div>
      </div>
      <div className="flex gap-3 modal-glass-actions">
        <button type="button" className="btn glass-light flex-1 modal-glass-btn-ghost" onClick={onClose}>취소</button>
        <button type="button" className="btn glass-light flex-1" disabled={!valid} onClick={() => onSave({ title: title.trim(), artist: artist.trim(), hue: 240 })}>추가</button>
      </div>
    </Modal>
  );
}

// === SCREEN 5: COMPLETE ========================================
function CompleteScreen({ session, tweaks = {}, responses, favorites, onRetake, saveStatus = "idle", saveMessage = "", saveMode = "minimal", onRetrySave }) {
  const stats = React.useMemo(() => {
    const c = { like: 0, skip: 0, dislike: 0 };
    responses.forEach((r) => {c[r.action] = (c[r.action] || 0) + 1;});
    return c;
  }, [responses]);

  const topGenre = React.useMemo(() => {
    const g = {};
    responses.filter((r) => r.action === "like").forEach((r) => {
      const song = window.SONGS.find((s) => s.id === r.song_id);
      if (song) g[song.genre] = (g[song.genre] || 0) + 1;
    });
    const arr = Object.entries(g).sort((a, b) => b[1] - a[1]);
    return arr[0]?.[0] || null;
  }, [responses]);

  const [confirmRetake, setConfirmRetake] = React.useState(false);

  return (
    <div className="screen complete">
      <div className="intro-bg" aria-hidden="true" />
      <div className="grain intro-grain" aria-hidden="true" />

      <div className="scroll" style={{ flex: 1, position: "relative", zIndex: 3 }}>
        <div className="screen-pad complete-stack" style={{ paddingTop: 30, paddingBottom: 20 }}>
          <div className="rise">
            <h1 className="screen-title">
              수고하셨어요,<br />
              {session?.name}님
            </h1>
          </div>

          <div className="rise delay-1 complete-save-card glass-light">
            {saveStatus === "saved" &&
            <p className="complete-save-card__status complete-save-card__status--saved">응답 저장 완료</p>
            }
            {saveStatus === "failed" &&
            <div className="complete-save-card__failed-row">
              <p className="complete-save-card__status complete-save-card__status--failed">응답 저장 실패</p>
              <button type="button" className="btn glass-light complete-save-card__retry" onClick={onRetrySave}>
                새로고침
              </button>
            </div>
            }
            {(saveStatus === "saving" || saveStatus === "idle") &&
            <p className="complete-save-card__status complete-save-card__status--saving">응답 저장 중…</p>
            }
          </div>

          {/* response summary card */}
          <div className="rise delay-2 complete-glass-card glass-light">
            <div className="complete-glass-card__reactions-bar flex">
              {stats.like > 0 && <div className="complete-glass-card__bar-segment complete-glass-card__bar-segment--dark" style={{ flex: stats.like }} />}
              {stats.skip > 0 && <div className="complete-glass-card__bar-segment complete-glass-card__bar-segment--mid" style={{ flex: stats.skip }} />}
              {stats.dislike > 0 && <div className="complete-glass-card__bar-segment complete-glass-card__bar-segment--light" style={{ flex: stats.dislike }} />}
            </div>
            <div className="complete-glass-card__reactions-stats flex between">
              {[
              { k: "like", label: tweaks.labelLike || "좋아요", count: stats.like || 0 },
              { k: "skip", label: tweaks.labelSkip || "그저 그래요", count: stats.skip || 0 },
              { k: "dislike", label: tweaks.labelDislike || "별로에요", count: stats.dislike || 0 }].
              map((it) =>
              <div key={it.k} className="flex col gap-2" style={{ flex: 1 }}>
                  <div className="flex center gap-2" style={{ justifyContent: "flex-start" }}>
                    <div className="complete-glass-card__reaction-dot" />
                    <span className="complete-glass-card__reaction-label">{it.label}</span>
                  </div>
                  <div className="display complete-glass-card__reaction-count">{it.count}</div>
                </div>
              )}
            </div>
          </div>

          {topGenre &&
          <div className="rise delay-3 complete-glass-card glass-light complete-glass-card--genre">
              <Ic.Sparkle s={16} />
              <div className="serif-ko complete-glass-card__genre">{topGenre}</div>
            </div>
          }

          {/* favorites card */}
          {favorites && favorites.length > 0 &&
          <div className="rise delay-4 complete-glass-card glass-light">
              <div className="flex col complete-glass-card__favorites">
                {favorites.map((s, i) =>
              <div key={i} className="flex gap-3 complete-glass-card__favorite-row">
                    <MiniArt song={{ hue: s.hue || 268 }} artwork={s.artwork} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="complete-glass-card__favorite-title">{s.title}</div>
                      <div className="complete-glass-card__favorite-artist">{s.artist}</div>
                    </div>
                    <Ic.Note s={14} />
                  </div>
              )}
              </div>
            </div>
          }

          {/* next class card */}
          <div className="rise delay-5 complete-glass-card glass-light complete-glass-card--next">
            <p className="complete-glass-card__next-text">
              다음 수업 시간에는 <span className="complete-glass-card__next-highlight serif">K-Means 군집화</span>로 음악 추천 시스템을 만들어봅시다.
            </p>
          </div>
        </div>
      </div>

      <div className="complete-footer" style={{ position: "relative", zIndex: 3, padding: "0 24px 22px", textAlign: "center" }}>
        <button type="button" className="rise delay-6 complete-retake-btn" onClick={() => setConfirmRetake(true)}>
          다시 응답하고 싶어요
        </button>
      </div>

      {confirmRetake &&
      <Modal onClose={() => setConfirmRetake(false)}>
          <div className="display" style={{ fontSize: 24, marginBottom: 10, color: "var(--ink)" }}>
            다시 응답하시겠어요?
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: 20 }}>
            현재 응답은 그대로 저장됩니다. 처음 화면으로 돌아가요.
          </p>
          <div className="flex gap-3">
            <button className="btn ghost flex-1" onClick={() => setConfirmRetake(false)}>취소</button>
            <button className="btn flex-1" onClick={onRetake}>다시 응답</button>
          </div>
        </Modal>
      }
    </div>);

}

Object.assign(window, {
  EntryScreen, IntroScreen, ReactionScreen, FavoritesScreen, CompleteScreen
});