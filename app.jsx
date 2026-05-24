// === MAIN APP ===
const STORAGE_KEY = "music_survey_v1";
const SUBMIT_QUEUE_KEY = "music_survey_submit_queue_v1";
const SUBMIT_MODE = (window.SURVEY_SAVE_MODE || "minimal").toLowerCase(); // "minimal" | "stable"
const MINIMAL_ENDPOINT = window.SURVEY_MINIMAL_ENDPOINT || "";
const STABLE_ENDPOINT = window.SURVEY_STABLE_ENDPOINT || "";
const STABLE_API_KEY = window.SURVEY_STABLE_API_KEY || "";
const SUBMIT_RETRY_LIMIT = 3;
const SUBMIT_TIMEOUT_MS = 7000;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "glowHue": 28,
  "labelLike": "좋아요",
  "labelSkip": "그저 그래요",
  "labelDislike": "별로에요",
  "grain": true,
  "showProgressBar": true,
  "albumArtSize": 240
}/*EDITMODE-END*/;

function shuffleSongs() {
  const indices = window.SONGS.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function loadSubmitQueue() {
  try {
    const raw = localStorage.getItem(SUBMIT_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSubmitQueue(queue) {
  try { localStorage.setItem(SUBMIT_QUEUE_KEY, JSON.stringify(queue)); } catch {}
}

function makeResponseId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return "resp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

function createSubmissionPayload({ session, responses, favorites }) {
  return {
    response_id: makeResponseId(),
    submitted_at: new Date().toISOString(),
    mode: SUBMIT_MODE,
    student: {
      student_id: session?.student_id || session?.id || "",
      name: session?.name || "",
      class: session?.class ?? null,
      group: session?.group ?? null,
      started_at: session?.started_at || null,
    },
    reactions: Array.isArray(responses) ? responses : [],
    favorites: Array.isArray(favorites) ? favorites : [],
    app_version: "music_survey_v1",
  };
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postJson(endpoint, payload, extraHeaders = {}) {
  if (!endpoint) throw new Error("missing endpoint");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SUBMIT_TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      throw new Error(`http ${res.status}`);
    }
    return true;
  } finally {
    clearTimeout(timer);
  }
}

async function submitMinimal(payload) {
  return postJson(MINIMAL_ENDPOINT, payload);
}

async function submitStable(payload) {
  if (!STABLE_ENDPOINT) throw new Error("stable endpoint missing");
  const studentId = payload.student?.student_id || "";
  return postJson(STABLE_ENDPOINT, payload, {
    ...(STABLE_API_KEY ? { "x-survey-api-key": STABLE_API_KEY } : {}),
    "x-idempotency-key": studentId || payload.response_id,
  });
}

async function submitPayload(payload) {
  if (SUBMIT_MODE === "stable") {
    if (STABLE_ENDPOINT) return submitStable(payload);
    if (MINIMAL_ENDPOINT) return submitMinimal(payload);
    throw new Error("no endpoint configured");
  }
  if (MINIMAL_ENDPOINT) return submitMinimal(payload);
  if (STABLE_ENDPOINT) return submitStable(payload);
  throw new Error("no endpoint configured");
}

function enqueueSubmission(payload) {
  const queue = loadSubmitQueue();
  const exists = queue.some((item) => item?.payload?.response_id === payload.response_id);
  if (exists) return;
  queue.push({ payload, attempts: 0, last_error: null });
  saveSubmitQueue(queue);
}

async function trySubmitWithRetry(payload) {
  let lastError = null;
  for (let attempt = 1; attempt <= SUBMIT_RETRY_LIMIT; attempt++) {
    try {
      await submitPayload(payload);
      return { ok: true };
    } catch (err) {
      lastError = err;
      if (attempt < SUBMIT_RETRY_LIMIT) {
        await wait(500 * Math.pow(2, attempt - 1));
      }
    }
  }
  return { ok: false, error: lastError };
}

async function flushSubmissionQueue() {
  const queue = loadSubmitQueue();
  if (!queue.length) return { flushed: 0, remaining: 0 };
  const nextQueue = [];
  let flushed = 0;
  for (const item of queue) {
    const result = await trySubmitWithRetry(item.payload);
    if (result.ok) {
      flushed += 1;
    } else {
      nextQueue.push({
        payload: item.payload,
        attempts: (item.attempts || 0) + 1,
        last_error: result.error ? String(result.error.message || result.error) : "unknown",
      });
    }
  }
  saveSubmitQueue(nextQueue);
  return { flushed, remaining: nextQueue.length };
}

const PAGE_TRANSITION_MS = 300;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // page 0 = LandingScreen (모션 포스터), 1~5 = 기존 흐름
  const [page, setPage] = React.useState(0);
  const [session, setSession] = React.useState(null);
  const [responses, setResponses] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [saveStatus, setSaveStatus] = React.useState("idle"); // idle | saving | saved | failed
  const [saveMessage, setSaveMessage] = React.useState("");
  const [pendingSubmission, setPendingSubmission] = React.useState(null);
  const [submissionMeta, setSubmissionMeta] = React.useState(null);
  const [outgoingPage, setOutgoingPage] = React.useState(null);
  const transitionLock = React.useRef(false);

  // restore from localStorage on mount
  React.useEffect(() => {
    const s = loadState();
    if (!s) return;
    if (s.session) setSession(s.session);
    if (s.responses) setResponses(s.responses);
    if (s.favorites) setFavorites(s.favorites);
    if (s.submissionMeta) setSubmissionMeta(s.submissionMeta);
    if (s.completed) setPage(5);
    else if (s.favorites?.length) setPage(5);
    else if (s.responses?.length >= window.SONGS.length) setPage(4);
    else if (s.responses?.length > 0) setPage(3);
    else if (s.session) setPage(2);
  }, []);

  // persist
  React.useEffect(() => {
    if (!session && !responses.length) return;
    saveState({
      session, responses, favorites,
      submissionMeta,
      completed: page === 5,
      last_page: page,
    });
  }, [session, responses, favorites, submissionMeta, page]);

  // toggle grain visibility via root class
  React.useEffect(() => {
    document.documentElement.classList.toggle("no-grain", !t.grain);
  }, [t.grain]);

  // 모바일: 브라우저 UI(상·하 바)와 앱 배경을 동기화
  React.useEffect(() => {
    const lightPages = page === 0 || page === 1 || page === 2 || page === 5;
    const bg = lightPages ? "#ffffff" : "oklch(0.56 0.24 268)";
    const theme = lightPages ? "#ffffff" : "#5a4ae6";
    window.__setMobileChromeColor?.(bg, theme);
  }, [page]);

  React.useEffect(() => {
    let cancelled = false;
    async function flushOnMount() {
      const result = await flushSubmissionQueue();
      if (cancelled) return;
      if (result.flushed > 0 && result.remaining === 0 && submissionMeta && page === 5) {
        setSaveStatus("saved");
        setSaveMessage("대기 중이던 응답이 전송되었습니다.");
      }
    }
    flushOnMount();
    const onOnline = async () => {
      const result = await flushSubmissionQueue();
      if (cancelled) return;
      if (result.flushed > 0 && result.remaining === 0 && page === 5) {
        setSaveStatus("saved");
        setSaveMessage("네트워크 복구 후 자동 저장되었습니다.");
      }
    };
    window.addEventListener("online", onOnline);
    return () => {
      cancelled = true;
      window.removeEventListener("online", onOnline);
    };
  }, [page, submissionMeta]);

  React.useEffect(() => {
    if (!pendingSubmission) return;
    let active = true;
    async function submitNow() {
      setSaveStatus("saving");
      setSaveMessage("응답을 저장 중입니다...");
      const result = await trySubmitWithRetry(pendingSubmission);
      if (!active) return;
      if (result.ok) {
        setSaveStatus("saved");
        setSaveMessage("응답이 안전하게 저장되었습니다.");
        setSubmissionMeta({
          response_id: pendingSubmission.response_id,
          submitted_at: pendingSubmission.submitted_at,
          status: "saved",
        });
      } else {
        enqueueSubmission(pendingSubmission);
        setSaveStatus("failed");
        setSaveMessage("저장에 실패해 임시 보관되었습니다. 온라인 시 자동 재시도합니다.");
        setSubmissionMeta({
          response_id: pendingSubmission.response_id,
          submitted_at: pendingSubmission.submitted_at,
          status: "queued",
        });
      }
      setPendingSubmission(null);
    }
    submitNow();
    return () => {
      active = false;
    };
  }, [pendingSubmission]);

  React.useEffect(() => {
    if (page !== 5) return;
    if (!submissionMeta) return;
    if (submissionMeta.status === "saved") {
      setSaveStatus("saved");
      setSaveMessage("응답이 안전하게 저장되었습니다.");
    } else if (submissionMeta.status === "queued") {
      setSaveStatus("failed");
      setSaveMessage("오프라인/오류로 임시 보관되었습니다. 자동 또는 수동 재시도됩니다.");
    } else if (submissionMeta.status === "pending") {
      setSaveStatus("saving");
      setSaveMessage("응답을 저장 중입니다...");
    }
  }, [page, submissionMeta]);

  function navigate(next) {
    if (next === page || transitionLock.current) return;
    transitionLock.current = true;
    setOutgoingPage(page);
    setPage(next);
    window.setTimeout(() => {
      setOutgoingPage(null);
      transitionLock.current = false;
    }, PAGE_TRANSITION_MS);
  }

  function handleLandingStart() { navigate(1); }
  function handleEnter(student) {
    const songOrder = shuffleSongs();
    setSession({ ...student, student_id: student.id, started_at: new Date().toISOString(), songOrder });
    setResponses([]);
    setFavorites([]);
    setSubmissionMeta(null);
    setSaveStatus("idle");
    setSaveMessage("");
    navigate(2);
  }
  function handleStart() { navigate(3); }
  function handleResponse(r) { setResponses(prev => [...prev, r]); }
  function handleReactionComplete() { navigate(4); }
  function handleSubmitFavorites(list) {
    const payload = createSubmissionPayload({
      session,
      responses,
      favorites: list,
    });
    setSubmissionMeta({
      response_id: payload.response_id,
      submitted_at: payload.submitted_at,
      status: "pending",
    });
    setPendingSubmission(payload);
    setFavorites(list);
    navigate(5);
  }

  function handleRetrySave() {
    if (!submissionMeta?.response_id) return;
    const queue = loadSubmitQueue();
    const queued = queue.find((item) => item?.payload?.response_id === submissionMeta.response_id);
    if (queued?.payload) {
      setPendingSubmission(queued.payload);
      const nextQueue = queue.filter((item) => item?.payload?.response_id !== submissionMeta.response_id);
      saveSubmitQueue(nextQueue);
      return;
    }
    const payload = createSubmissionPayload({
      session,
      responses,
      favorites,
    });
    setSubmissionMeta({
      response_id: payload.response_id,
      submitted_at: payload.submitted_at,
      status: "pending",
    });
    setPendingSubmission(payload);
  }

  function handleRetake() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSubmissionMeta(null);
    setSaveStatus("idle");
    setSaveMessage("");
    setSession(null); setResponses([]); setFavorites([]);
    navigate(0);
  }

  const tweaks = t;
  const transitioning = outgoingPage !== null;

  function renderScreen(pageNum) {
    switch (pageNum) {
      case 0: return <LandingScreen tweaks={tweaks} onStart={handleLandingStart}/>;
      case 1: return <EntryScreen session={session} tweaks={tweaks} onEnter={handleEnter}/>;
      case 2: return <IntroScreen session={session} tweaks={tweaks} onStart={handleStart}/>;
      case 3: return <ReactionScreen session={session} tweaks={tweaks} responses={responses} onResponse={handleResponse} onComplete={handleReactionComplete}/>;
      case 4: return <FavoritesScreen session={session} tweaks={tweaks} favorites={favorites} onSubmit={handleSubmitFavorites}/>;
      case 5: return <CompleteScreen session={session} tweaks={tweaks} responses={responses} favorites={favorites} onRetake={handleRetake} saveStatus={saveStatus} saveMessage={saveMessage} saveMode={SUBMIT_MODE} onRetrySave={handleRetrySave}/>;
      default: return <LandingScreen tweaks={tweaks} onStart={handleLandingStart}/>;
    }
  }

  return (
    <div className="viewport">
      {outgoingPage !== null && (
        <div key={`leave-${outgoingPage}`} className="screen-stage screen-stage--leave" aria-hidden="true">
          {renderScreen(outgoingPage)}
        </div>
      )}
      <div
        key={`active-${page}`}
        className={"screen-stage" + (transitioning ? " screen-stage--arrive" : "")}
      >
        {renderScreen(page)}
      </div>

      <TweaksPanel>
        <TweakSection label="반응 버튼 라벨"/>
        <TweakText  label="좋아요"   value={t.labelLike}    onChange={(v) => setTweak("labelLike", v)}/>
        <TweakText  label="그저 그래요" value={t.labelSkip}    onChange={(v) => setTweak("labelSkip", v)}/>
        <TweakText  label="별로에요"  value={t.labelDislike} onChange={(v) => setTweak("labelDislike", v)}/>

        <TweakSection label="비주얼"/>
        <TweakSlider label="글로우 색조" value={t.glowHue} min={0} max={360} step={1} unit="°"
                     onChange={(v) => setTweak("glowHue", v)}/>
        <TweakSlider label="앨범아트 크기" value={t.albumArtSize} min={180} max={300} step={4} unit="px"
                     onChange={(v) => setTweak("albumArtSize", v)}/>
        <TweakToggle label="필름 그레인"    value={t.grain}           onChange={(v) => setTweak("grain", v)}/>
        <TweakToggle label="진행 바 표시"   value={t.showProgressBar} onChange={(v) => setTweak("showProgressBar", v)}/>

        <TweakSection label="진단"/>
        <TweakButton label="응답 초기화" onClick={() => {
          try { localStorage.removeItem(STORAGE_KEY); } catch {}
          location.reload();
        }}/>
      </TweaksPanel>
    </div>
  );
}

// students·songs 데이터를 Supabase API에서 받아온 뒤 렌더링
(async function initApp() {
  try {
    const [studentsRes, songsRes] = await Promise.all([
      fetch("/api/students"),
      fetch("/api/songs"),
    ]);
    const { students } = await studentsRes.json();
    const { songs } = await songsRes.json();
    window.STUDENTS = students;
    window.SONGS = songs;
  } catch (err) {
    console.error("[init] 데이터 로딩 실패", err);
    document.getElementById("root").innerHTML =
      '<p style="color:#e11d48;padding:2rem;font-family:sans-serif">데이터를 불러오지 못했습니다. 새로고침 해주세요.</p>';
    return;
  }
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App/>);
})();

// 모든 화면에서 재사용하는 브라우저 UI 색상 동기화 함수
window.__setMobileChromeColor = function setMobileChromeColor(backgroundColor, themeColor) {
  const bg = backgroundColor || "#ffffff";
  const theme = themeColor || bg;
  document.documentElement.style.setProperty("--page-bg", bg);
  document.documentElement.style.backgroundColor = bg;
  document.body.style.backgroundColor = bg;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", theme);
};
