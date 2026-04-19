const { useState, useEffect, useRef } = React;

// ───────── Tweakable defaults ─────────
const TWEAKS = {
  "theme": "linen",
  "cardStyle": "soft",
  "dateFormat": "pretty"
};

// Coordinated themes: each pairs a background with an accent and the full
// neutral ramp so contrast stays intact.
const THEMES = {
  linen: {
    label: "Linen",
    bg:        "#f7f3ec",
    bgCard:    "#ffffff",
    ink:       "#1a1814",
    inkMuted:  "#6b6558",
    inkDim:    "#a49d8f",
    rule:      "#e6e0d2",
    ruleSoft:  "#eee8da",
    accent:    "oklch(0.62 0.11 38)",
    mockBg:    "#fafaf5",
  },
  paper: {
    label: "Paper",
    bg:        "#fafaf7",
    bgCard:    "#ffffff",
    ink:       "#171717",
    inkMuted:  "#5c5c5c",
    inkDim:    "#9a9a9a",
    rule:      "#e5e5e1",
    ruleSoft:  "#efefea",
    accent:    "oklch(0.52 0.09 250)",
    mockBg:    "#f4f4f0",
  },
  moss: {
    label: "Moss",
    bg:        "#ecefe5",
    bgCard:    "#f7f8f2",
    ink:       "#1b2018",
    inkMuted:  "#5e6a58",
    inkDim:    "#9ba595",
    rule:      "#d6ddc9",
    ruleSoft:  "#e2e7d7",
    accent:    "oklch(0.48 0.09 140)",
    mockBg:    "#f0f3e8",
  },
  rose: {
    label: "Rose",
    bg:        "#f5ecea",
    bgCard:    "#fbf4f2",
    ink:       "#241a1a",
    inkMuted:  "#70605e",
    inkDim:    "#b09e9a",
    rule:      "#e9d8d4",
    ruleSoft:  "#efdfdb",
    accent:    "oklch(0.50 0.12 355)",
    mockBg:    "#f7ede9",
  },
  ink: {
    label: "Ink",
    bg:        "#14120f",
    bgCard:    "#1d1a15",
    ink:       "#ece6d6",
    inkMuted:  "#928a78",
    inkDim:    "#5c564a",
    rule:      "#2c2821",
    ruleSoft:  "#26231c",
    accent:    "oklch(0.78 0.12 75)",
    mockBg:    "#211d17",
  },
  harbor: {
    label: "Harbor",
    bg:        "#e9edf1",
    bgCard:    "#f5f7fa",
    ink:       "#141a22",
    inkMuted:  "#5a6470",
    inkDim:    "#9aa4b0",
    rule:      "#d5dce3",
    ruleSoft:  "#e0e6ec",
    accent:    "oklch(0.55 0.13 240)",
    mockBg:    "#eef1f4",
  },
};

// ───────── Date formatting ─────────
function formatDate(iso, style) {
  const d = new Date(iso + "T12:00:00");
  if (style === "pretty") {
    const day = d.getDate();
    const suffix = (n) => {
      if (n >= 11 && n <= 13) return "th";
      const last = n % 10;
      return last === 1 ? "st" : last === 2 ? "nd" : last === 3 ? "rd" : "th";
    };
    const month = d.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${day}${suffix(day)}, ${d.getFullYear()}`;
  }
  if (style === "numeric") return iso.replace(/-/g, ".");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ───────── Hero & image visuals ─────────
function Hero({ hero }) {
  if (!hero) return null;
  if (hero.type === "gradient") {
    return (
      <div
        className="hero hero--gradient"
        style={{ backgroundImage: `linear-gradient(135deg, ${hero.from}, ${hero.to})` }}
      >
        <svg className="hero__grain" aria-hidden="true">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#grain)" opacity="0.35"/>
        </svg>
        {hero.label && <span className="hero__label">{hero.label}</span>}
      </div>
    );
  }
  return null;
}

function ImageMock({ variant }) {
  if (variant === "editor") {
    return (
      <div className="img-mock img-mock--editor">
        <div className="img-mock__gutter">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
        </div>
        <div className="img-mock__text">
          <div className="img-mock__line" style={{width: "78%"}} />
          <div className="img-mock__line" style={{width: "64%"}} />
          <div className="img-mock__line" style={{width: "88%"}} />
          <div className="img-mock__cursor" />
          <div className="img-mock__line" style={{width: "42%"}} />
          <div className="img-mock__line" style={{width: "70%"}} />
        </div>
        <div className="img-mock__note">suggestion • accept ⌥⏎</div>
      </div>
    );
  }
  if (variant === "diff") {
    return (
      <div className="img-mock img-mock--diff">
        <div className="img-mock__col">
          <div className="img-mock__diff-line"><span>- </span>You are a helpful assistant.</div>
          <div className="img-mock__diff-line img-mock__diff-line--add"><span>+ </span>You are a careful assistant.</div>
          <div className="img-mock__diff-line">Respond in plain prose.</div>
          <div className="img-mock__diff-line img-mock__diff-line--add"><span>+ </span>Cite sources inline.</div>
        </div>
        <div className="img-mock__margin">
          <div className="img-mock__stat">+4.2</div>
          <div className="img-mock__statlabel">eval Δ</div>
        </div>
      </div>
    );
  }
  return null;
}

// ───────── Card (collapsed timeline entry) ─────────
function Card({ entry, side, onOpen, tweaks, hidden }) {
  return (
    <div
      className={`node node--${side} node--${entry.kind} ${hidden ? "node--hidden" : ""}`}
      data-id={entry.id}
    >
      <div className="node__connector" aria-hidden="true" />
      <div className="node__dot" aria-hidden="true" />
      <button
        className={`card card--${entry.kind} card--${tweaks.cardStyle}`}
        onClick={() => onOpen(entry.id)}
        aria-label={`Open: ${entry.title}`}
      >
        {entry.kind === "project" && (
          <>
            <div className="card__hero"><Hero hero={entry.hero} /></div>
            <div className="card__foot">
              <h3 className="card__title">{entry.title}</h3>
              <div className="card__date">{formatDate(entry.date, tweaks.dateFormat)}</div>
            </div>
          </>
        )}
        {entry.kind === "text" && (
          <>
            <h3 className="card__title card__title--lg">{entry.title}</h3>
            <div className="card__date">{formatDate(entry.date, tweaks.dateFormat)}</div>
          </>
        )}
        {entry.kind === "image" && (
          <>
            <h3 className="card__title">{entry.title}</h3>
            <div className="card__date">{formatDate(entry.date, tweaks.dateFormat)}</div>
            <div className="card__image"><ImageMock variant={entry.image.variant} /></div>
          </>
        )}
      </button>
    </div>
  );
}

// ───────── Expanded reader (Staged animation) ─────────
function Reader({ entry, onClose, tweaks, side }) {
  const panelRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Step 3 of staged sequence: panel enters after cards have faded and spine has started sliding
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 280);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    const el = panelRef.current;
    if (el) {
      el.style.transition = "opacity 200ms ease-in, transform 200ms ease-in";
      el.style.opacity = "0";
      el.style.transform = "scale(0.97) translateY(4px)";
    }
    setTimeout(() => onClose(), 210);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`reader reader--side-${side}${visible ? " reader--visible" : ""}`}>
      <div className="reader__backdrop" onClick={handleClose} />
      <div className="reader__rail" aria-hidden="true">
        <div className="reader__connector" />
        <div className="reader__dot" />
      </div>
      <article className="reader__panel" ref={panelRef}>
        <button className="reader__close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 4l12 12M16 4L4 16"/>
          </svg>
        </button>
        <div className="reader__inner">
          <h1 className="reader__title">{entry.title}</h1>
          <div className="reader__date">{formatDate(entry.date, tweaks.dateFormat)}</div>
          {entry.kind === "image" && entry.image && (
            <div className="reader__image"><ImageMock variant={entry.image.variant} /></div>
          )}
          {entry.kind === "project" && entry.hero && (
            <div className="reader__hero"><Hero hero={entry.hero} /></div>
          )}
          <div className="reader__body" dangerouslySetInnerHTML={{ __html: entry.body }} />
        </div>
      </article>
    </div>
  );
}

// ───────── Nav ─────────
function Nav() {
  return (
    <nav className="nav">
      <button className="nav__hamburger" aria-label="Menu">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>
      <a className="nav__title" href="#" aria-label="Home">
        Building AI and Building with AI
      </a>
      <div className="nav__links">
        <a href="#projects">Projects</a>
        <a href="#notes">Notes</a>
        <a href="#about">About me</a>
      </div>
    </nav>
  );
}

// ───────── Timeline ─────────
function Timeline({ entries, onOpen, tweaks, openId }) {
  return (
    <div className="timeline">
      <div className="timeline__spine" aria-hidden="true" />
      <div className="timeline__today">Today</div>
      <div className="timeline__list">
        {entries.map((e, i) => (
          <Card
            key={e.id}
            entry={e}
            side={i % 2 === 0 ? "left" : "right"}
            onOpen={onOpen}
            tweaks={tweaks}
            hidden={openId === e.id}
          />
        ))}
      </div>
      <div className="timeline__end" aria-hidden="true">
        <div className="timeline__endcap" />
      </div>
    </div>
  );
}

// ───────── Tweaks panel ─────────
function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };
  return (
    <div className="tweaks">
      <div className="tweaks__title">Tweaks</div>
      <div className="tweaks__row">
        <label>Theme</label>
        <div className="tweaks__opts tweaks__opts--themes">
          {Object.keys(THEMES).map((k) => {
            const t = THEMES[k];
            return (
              <button
                key={k}
                className={`tweaks__theme ${tweaks.theme === k ? "is-active" : ""}`}
                onClick={() => update("theme", k)}
                aria-label={t.label}
                title={t.label}
              >
                <span className="tweaks__theme-bg" style={{ background: t.bg, borderColor: t.rule }}>
                  <span className="tweaks__theme-accent" style={{ background: t.accent }} />
                </span>
                <span className="tweaks__theme-label">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="tweaks__row">
        <label>Cards</label>
        <div className="tweaks__opts">
          {["soft", "bordered", "flat"].map((v) => (
            <button key={v} className={`tweaks__pill ${tweaks.cardStyle === v ? "is-active" : ""}`}
              onClick={() => update("cardStyle", v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweaks__row">
        <label>Dates</label>
        <div className="tweaks__opts">
          {["pretty", "short", "numeric"].map((v) => (
            <button key={v} className={`tweaks__pill ${tweaks.dateFormat === v ? "is-active" : ""}`}
              onClick={() => update("dateFormat", v)}>{v}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────── Medium RSS feed ─────────
function parseMediumFeed(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return [...doc.querySelectorAll("item")].map(item => {
    const get = tag => item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
    const link = get("link");
    const slug = link.split("/").filter(Boolean).pop() || get("guid").split("/").pop();
    const rawDate = get("pubDate");
    const date = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const rawBody = get("content:encoded") || get("description");
    const body = rawBody.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
      + `<p style="margin-top:1.5em"><a href="${link}" target="_blank" rel="noopener">Read on Medium →</a></p>`;
    return { id: `medium-${slug}`, date, kind: "text", title: get("title"), body, tags: ["medium"] };
  }).filter(e => e.title && e.id);
}

// ───────── Substack RSS feed ─────────
function parseSubstackFeed(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return [...doc.querySelectorAll("item")].map(item => {
    const get = tag => item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
    const link = get("link");
    const slug = link.split("/").filter(Boolean).pop() || get("guid").split("/").pop();
    const rawDate = get("pubDate");
    const date = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const rawBody = get("content:encoded") || get("description");
    const body = rawBody.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
    return { id: slug, date, kind: "text", title: get("title"), body, tags: [] };
  }).filter(e => e.title && e.id);
}

// ───────── App ─────────
function App() {
  const [tweaks, setTweaks] = useState(TWEAKS);
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [siteModifier, setSiteModifier] = useState(null);

  // Tweaks toggle via postMessage (design tool integration)
  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksVisible(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksVisible(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    const t = THEMES[tweaks.theme] || THEMES.linen;
    const root = document.documentElement;
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--bg-card", t.bgCard);
    root.style.setProperty("--ink", t.ink);
    root.style.setProperty("--ink-muted", t.inkMuted);
    root.style.setProperty("--ink-dim", t.inkDim);
    root.style.setProperty("--rule", t.rule);
    root.style.setProperty("--rule-soft", t.ruleSoft);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--mock-bg", t.mockBg);
    root.dataset.theme = tweaks.theme;
  }, [tweaks.theme]);

  // Scroll lock when reader is open
  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
  }, [openId]);

  const [entries, setEntries] = useState(() =>
    [...window.TIMELINE_DATA].sort((a, b) => b.date.localeCompare(a.date))
  );

  useEffect(() => {
    const RSS = "https://ishanbhalla.substack.com/feed";
    fetch("https://corsproxy.io/?url=" + encodeURIComponent(RSS))
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(xml => {
        const posts = parseSubstackFeed(xml);
        if (posts.length > 0) {
          setEntries(prev => {
            const merged = [...prev, ...posts.filter(p => !prev.find(e => e.id === p.id))];
            return merged.sort((a, b) => b.date.localeCompare(a.date));
          });
        }
      })
      .catch(err => console.warn("Substack feed unavailable, using sample posts:", err));
  }, []);

  useEffect(() => {
    const RSS = "https://medium.com/feed/@lukwhostalking";
    fetch("https://corsproxy.io/?url=" + encodeURIComponent(RSS))
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(xml => {
        const posts = parseMediumFeed(xml);
        if (posts.length > 0) {
          setEntries(prev => {
            const merged = [...prev, ...posts.filter(p => !prev.find(e => e.id === p.id))];
            return merged.sort((a, b) => b.date.localeCompare(a.date));
          });
        }
      })
      .catch(err => console.warn("Medium feed unavailable:", err));
  }, []);

  const openEntry = entries.find((e) => e.id === openId);
  const openIndex = entries.findIndex((e) => e.id === openId);
  const openSide = openIndex >= 0 ? (openIndex % 2 === 0 ? "left" : "right") : "left";

  const handleOpen = (id) => {
    setSiteModifier("opening"); // adds transition-delay to spine (step 2 fires after cards fade)
    setOpenId(id);
  };

  const handleClose = () => {
    setSiteModifier(null); // remove delay so spine returns immediately after panel fades
    setOpenId(null);
  };

  const siteClass = [
    "site",
    openId ? "site--reader-open" : "",
    openId ? `site--reader-${openSide}` : "",
    siteModifier ? `site--${siteModifier}` : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={siteClass}>
      <Nav />
      <main className="site__main">
        <Timeline entries={entries} onOpen={handleOpen} tweaks={tweaks} openId={openId} />
      </main>
      {openEntry && (
        <Reader entry={openEntry} onClose={handleClose} tweaks={tweaks} side={openSide} />
      )}
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
