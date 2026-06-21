import { useState, useEffect, useRef, Fragment } from "react";

/* ---------- lucide-style icons (stroke, currentColor) ---------- */
const Svg = ({ size = 24, sw = 2, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
       strokeLinejoin="round" {...p}>{children}</svg>
);
const Zap = (p) => <Svg {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></Svg>;
const Repeat = (p) => <Svg {...p}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></Svg>;
const Clock = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Svg>;

/* ---------- social brand icons ---------- */
const Instagram = (p) => <Svg {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></Svg>;
const Facebook = (p) => <Svg {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></Svg>;
const Linkedin = (p) => <Svg {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></Svg>;
const XLogo = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const Youtube = (p) => <Svg {...p}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></Svg>;
const Tiktok = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.43 3.98-2.11 6.15-1.7.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);
const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: XLogo, label: "X", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
  { Icon: Tiktok, label: "TikTok", href: "#" },
];

/* booking links */
const AUDIT_URL = "https://cal.com/blackrain/audit";        // free 15-min audit — TODO: confirm real Cal.com slug
const BLUEPRINT_URL = "https://cal.com/blackrain/blueprint"; // paid $999 Blueprint

/* ---------- scroll reveal: alternating slide-in, re-triggering ---------- */
function useReveal() {
  useEffect(() => {
    const scopes = document.querySelectorAll("main section:not(.hero), footer");
    const tracked = [];
    scopes.forEach((scope) => {
      scope.querySelectorAll(".reveal").forEach((el, i) => {
        if (!el.classList.contains("reveal-left") && !el.classList.contains("reveal-right")) {
          el.classList.add(i % 2 === 0 ? "reveal-left" : "reveal-right");
        }
        tracked.push(el);
      });
    });
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { tracked.forEach((e) => e.classList.add("in")); return; }
    let raf = null;
    const check = () => {
      raf = null;
      const vh = window.innerHeight;
      tracked.forEach((el) => {
        const r = el.getBoundingClientRect();
        const visible = r.top < vh * 0.86 && r.bottom > vh * 0.14;
        el.classList.toggle("in", visible);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

const delay = (s) => ({ transitionDelay: `${s}s` });

/* ---------- subtle magnetic pull on [data-magnetic] ---------- */
function useMagnetic() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const RADIUS = 90, MAX = 7, STRENGTH = 0.16;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        document.querySelectorAll("[data-magnetic]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = e.clientX - cx, dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const tx = Math.max(-MAX, Math.min(MAX, dx * STRENGTH));
            const ty = Math.max(-MAX, Math.min(MAX, dy * STRENGTH));
            el.style.translate = `${tx}px ${ty}px`;
          } else if (el.style.translate) {
            el.style.translate = "0px 0px";
          }
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);
}

/* ---------- scroll-driven character reveal ---------- */
function ScrollText({ text, as = "h2", className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll(".sr-char"));
    const n = chars.length || 1;
    let raf = null;
    const update = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.5 + r.height)));
      const sweep = p * (n + 6);
      chars.forEach((c, i) => {
        const t = Math.max(0, Math.min(1, sweep - i));
        c.style.opacity = (0.16 + 0.84 * t).toFixed(3);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);
  const El = as;
  return (
    <El ref={ref} className={className}>
      {Array.from(text).map((ch, i) => (
        <span className="sr-char" key={i} style={{ opacity: 0.16 }}>{ch}</span>
      ))}
    </El>
  );
}

/* ---------- char reveal preserving inner markup (.tnum, .hl) ---------- */
function CharReveal({ as = "h2", className, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    const chars = [];
    textNodes.forEach((tn) => {
      const frag = document.createDocumentFragment();
      for (const ch of tn.textContent) {
        const span = document.createElement("span");
        span.className = "sr-char";
        span.textContent = ch;
        span.style.opacity = "0.16";
        frag.appendChild(span);
        chars.push(span);
      }
      tn.parentNode.replaceChild(frag, tn);
    });
    const n = chars.length || 1;
    let raf = null;
    const update = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.5 + r.height)));
      const sweep = p * (n + 6);
      chars.forEach((c, i) => {
        const t = Math.max(0, Math.min(1, sweep - i));
        c.style.opacity = (0.16 + 0.84 * t).toFixed(3);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const El = as;
  return <El ref={ref} className={className}>{children}</El>;
}

/* ---------- top scroll-progress bar ---------- */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (ref.current) ref.current.style.width = (p * 100).toFixed(2) + "%";
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><i ref={ref} /></div>;
}

/* ---------- interactive rain — the brand signature ----------
   Site-wide faint rain; drops part around the cursor, ripples on click/tap.
   Canvas for smoothness on mobile; off for reduced-motion. */
function RainField() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    let w = 0, h = 0, dpr = 1, drops = [], ripples = [], raf = null, last = 0;
    const pointer = { x: -9999, y: -9999 };

    const mkDrop = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      len: 7 + Math.random() * 13,
      vy: 240 + Math.random() * 280,
      vx: 6 + Math.random() * 10,
      th: Math.random() < 0.5 ? 0.7 : 1.1,
      a: 0.06 + Math.random() * 0.1,
    });

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(130, w / (coarse ? 13 : 8)));
      drops = Array.from({ length: count }, mkDrop);
    };

    const step = (t) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0); last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const d of drops) {
        const dx = d.x - pointer.x, dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 9000) {
          const f = (9000 - dist2) / 9000;
          d.x += (dx >= 0 ? 1 : -1) * f * 2.6;
        }
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y > h + d.len) { d.y = -d.len; d.x = Math.random() * w; }
        if (d.x > w + 4) d.x = -4;
        ctx.strokeStyle = `rgba(74, 78, 86, ${d.a})`;
        ctx.lineWidth = d.th;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.vx * 0.03, d.y - d.len);
        ctx.stroke();
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += dt;
        const p = r.t / 0.7;
        if (p >= 1) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(70, 74, 82, ${0.4 * (1 - p)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, p * 46, 0, Math.PI * 2);
        ctx.stroke();
      }
      raf = requestAnimationFrame(step);
    };

    const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    const onDown = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      ripples.push({ x, y, t: 0 });
      if (ripples.length > 8) ripples.shift();
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    if (!coarse) window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);
  return <canvas className="rainfield" ref={ref} aria-hidden="true" />;
}

/* ---------- cycling headline word ---------- */
const HERO_PHRASES = ["more booked.", "more profit.", "more done.", "more visible."];
function CycleWord() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = null;
    const id = setInterval(() => {
      setOut(true);
      t = setTimeout(() => { setI((v) => (v + 1) % HERO_PHRASES.length); setOut(false); }, 350);
    }, 2800);
    return () => { clearInterval(id); if (t) clearTimeout(t); };
  }, []);
  return <span className={"accent cycle" + (out ? " out" : "")}>{HERO_PHRASES[i]}</span>;
}

/* ---------- count-up number (animates when scrolled into view) ---------- */
function CountUp({ end, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(end); return; }
    const el = ref.current;
    if (!el) return;
    let raf = null, start = null, ran = false;
    const dur = 1100;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !ran) { ran = true; raf = requestAnimationFrame(step); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [end]);
  return <span ref={ref} className={(className ? className + " " : "") + "tnum"}>{prefix}{val}{suffix}</span>;
}

/* ============================================================ */
function Header() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"site-header" + (show ? " visible" : "")}>
      <div className="container bar">
        <a className="brand-lockup" href="#top" aria-label="BlackRain — home">
          <span className="wordmark">Black<span className="r">Rain</span></span>
        </a>
        <nav className="header-nav">
          <a className="nav-only" href="#what-i-build">Services</a>
          <a className="nav-only" href="#how-it-works">Process</a>
          <a className="nav-only" href="#pricing">Pricing</a>
          <a className="cta" data-magnetic href="#start">
            <span className="label">Book a Free Audit</span>
            <span className="arrow">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ============================================================ */
function Splash() {
  const inner = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = null;
    const update = () => {
      raf = null;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
      if (inner.current) inner.current.style.opacity = String(Math.max(0, 1 - p * 1.25));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="splash" id="top">
      <div className="splash-inner" ref={inner}>
        <div className="splash-droplet-wrap">
          <img className="splash-droplet" src="/assets/droplet.png" alt="BlackRain" />
        </div>
        <div className="splash-wordmark">BLACKRAIN</div>
        <p className="splash-tag">AI Automation Consultancy</p>
        <p className="splash-line">You can&rsquo;t see the rain in the dark &mdash; but you wake to everything it watered.</p>
        <div className="splash-rule" />
        <div className="splash-contact">
          <a href="tel:+18608032795">860.803.2795</a>
          <a href="mailto:ryan@blackrainautomations.com">ryan@blackrainautomations.com</a>
          <a href="https://blackrainautomations.com" target="_blank" rel="noopener noreferrer">blackrainautomations.com</a>
        </div>
        <p className="splash-sig">Ryan Kirchberger</p>
        <p className="splash-role">Founder</p>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><span className="chev" /></div>
    </section>
  );
}

function Manifesto() {
  const near = Array.from({ length: 20 });
  const far = Array.from({ length: 12 });
  return (
    <section className="manifesto" id="story">
      <div className="rain rain-far" aria-hidden="true">
        {far.map((_, i) => (
          <span key={i} style={{ left: `${(i * 9 + 5) % 100}%`, animationDelay: `${(i % 5) * 0.5}s`, animationDuration: `${1.8 + (i % 3) * 0.5}s` }} />
        ))}
      </div>
      <div className="rain rain-near" aria-hidden="true">
        {near.map((_, i) => (
          <span key={i} style={{ left: `${(i * 7.3 + 2) % 100}%`, animationDelay: `${(i % 6) * 0.35}s`, animationDuration: `${0.9 + (i % 4) * 0.35}s` }} />
        ))}
      </div>
      <div className="lightning" aria-hidden="true" />
      <div className="container manifesto-inner">
        <p className="m-eyebrow reveal"><span>A</span> <span>quiet</span> <span>word</span></p>
        <p className="m-line big reveal">Would you like more <em>time</em> — to savor a good glass of whiskey?</p>
        <p className="m-line big reveal">Or more <em>money</em> — to spend exactly as you please?</p>
        <p className="m-line reveal">Old-school cool, with the times — the finest AI, built precisely for your business.</p>
        <p className="m-quote reveal">Born in <em>Connecticut</em>, for the owner who finds his luxury in the quiet of the early-morning rain.</p>
        <p className="m-line reveal">While the world sleeps, the morning is yours — the long bath, the slow coffee. Black Rain has the business covered.</p>
        <p className="m-signoff reveal">Good morning.</p>
        <a className="cta-pill m-cta reveal" data-magnetic href={AUDIT_URL} target="_blank" rel="noopener noreferrer">
          <span className="m-cta-label">Start with a free 15-minute assessment <span className="arrow" aria-hidden="true">→</span></span>
        </a>
        <p className="m-cta-sub reveal">Free · fifteen minutes · no pitch.</p>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
        <h1 className="hero-headline">
          AI systems that get local businesses <CycleWord />
        </h1>
        <p className="hero-sub">
          Premium AI automations, custom-built for service businesses. Your leads get
          answered in sixty seconds, your quotes never go silent, and the busywork
          runs itself — turning inquiries into revenue, effortlessly.
        </p>
        <div className="hero-ctas">
          <a className="cta-pill" data-magnetic href={AUDIT_URL} target="_blank" rel="noopener noreferrer">
            Book a Free Audit <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="cta-ghost" data-magnetic href="#how-it-works">
            See How It Works <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
function Briefing() {
  return (
    <section className="section" id="briefing">
      <div className="container moment">
        <div className="stat-block reveal">
          <div className="stat-row">
            <CountUp className="big" end={88} suffix="%" />
            <span className="cap">of businesses now use AI.</span>
          </div>
          <div className="stat-rule" />
          <div className="stat-row">
            <CountUp className="big pink" end={10} prefix="<" suffix="%" />
            <span className="cap">use it well enough to win.</span>
          </div>
        </div>
        <div className="reveal" style={delay(0.06)}>
          <p className="moment-eyebrow">The Briefing</p>
          <div className="hero-body">
            <p>
              The ten percent aren’t smarter than you. They just did the quiet work, wired AI into how the business
              actually runs. Now their leads get answered in sixty seconds, their quotes never go silent, and their
              margins compound every quarter while their competitors wonder what changed.{" "}
              <a className="hero-cite cite-em" href="https://hai.stanford.edu/ai-index/2026-ai-index-report" target="_blank" rel="noopener noreferrer">(Stanford AI Index 2026.)</a>
            </p>
            <p>
              You won’t see them coming, because nothing looks different from the outside. The phone just stops ringing
              as often. BlackRain’s job is to make sure you’re the one this happens <em>for</em> — custom systems, built
              and run for you, paid back in weeks. The first fifteen minutes are free.
            </p>
          </div>
          <div className="hero-ctas-row">
            <a className="cta-pill" data-magnetic href={AUDIT_URL} target="_blank" rel="noopener noreferrer">
              Book a free 15-min audit <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="cta" data-magnetic href="#start">
              <span className="label">or start the $999 Blueprint</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
const BUILDS = [
  { Icon: Zap, tag: "Makes you money", kind: "rev", title: "Speed-to-lead",
    body: "A customer who calls three companies hires the one that answers first. Yours answers in sixty seconds — nights, weekends, mid-job — and books the appointment itself." },
  { Icon: Repeat, tag: "Makes you money", kind: "rev", title: "Follow-up that never quits",
    body: "The quote you sent Tuesday gets chased Thursday, next week, and the week after — politely, automatically, until it’s a yes or a no. Nothing goes quiet again." },
  { Icon: Clock, tag: "Saves you time", kind: "time", title: "The busywork, handled",
    body: "Reports that write themselves. Schedules that fill themselves. Call notes, invoices, data entry — the hours that eat your week, given back." },
];
function WhatIBuild() {
  return (
    <section className="section" id="what-i-build">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">What I Build</p>
          <ScrollText as="h2" text="The work that starts running itself." />
        </div>
        <div className="card-grid">
          {BUILDS.map(({ tag, kind, title, body }, i) => (
            <div className="card reveal" key={title} style={delay(i * 0.08)}>
              <p className={"tag " + kind}>{tag}</p>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <p className="how-closing reveal">Something bigger in mind? Custom AI agents, trained on your business — scoped in the Blueprint.</p>
      </div>
    </section>
  );
}

/* ============================================================ */
const MORE = [
  { title: "AI Motion Websites", body: "Cinematic, fast, built to convert — a site that looks like you charge what you’re worth." },
  { title: "Local SEO & Google Profile", body: "When someone nearby searches for what you do, yours is the first name they see." },
  { title: "AI Ad Management", body: "ChatGPT and Meta ads launched, tuned, and managed — leads arriving while you work." },
  { title: "Custom AI Agents", body: "An assistant trained on your business, your data, your voice — on duty around the clock." },
  { title: "Content Engines", body: "On-brand social and email, drafted and scheduled before you’ve had coffee." },
  { title: "AI Team Training", body: "Your team, fluent in the tools that actually move the needle." },
];
function MoreServices() {
  return (
    <section className="section" id="more">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Beyond Automation</p>
          <ScrollText as="h2" text="Under the same roof." />
        </div>
        <div className="card-grid">
          {MORE.map(({ title, body }, i) => (
            <div className="card reveal" key={title} style={delay((i % 3) * 0.08)}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
const STEPS = [
  { n: "01", title: "The free 15-minute audit.", timing: "Fifteen minutes. No cost, no pitch.",
    body: "You tell me how the work actually flows; I point to where the money is leaking and what would stop it. You keep the ideas whether we go further or not." },
  { n: "02", title: "The $999 Blueprint.", timing: "Delivered within seven days.",
    body: "A written roadmap of your highest-return automations — what to build, what it costs, what it returns, in plain numbers. Yours to keep, credited in full toward any build." },
  { n: "03", title: "I build it — and keep it running.", timing: "Done-for-you.",
    body: "Pick the play and I build it, test it, and hand it over working. Want it owned, watched, and improved every month? That’s the Concierge — seven seats, month-to-month, and you see exactly what it books you." },
];
function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow how-eyebrow">How It Works</p>
          <CharReveal as="h2" className="how-headline">Three steps. The first one’s free.</CharReveal>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step-row reveal" key={s.n}>
              <div className="step-n">{s.n}</div>
              <div className="step-content">
                <h3 className="step-title">{s.title}</h3>
                <p className="step-timing">{s.timing}</p>
                <p className="step-body">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="how-closing reveal">Most audits turn into a build. Some don’t. Both are fine outcomes — I don’t sell what doesn’t pencil out.</p>
      </div>
    </section>
  );
}

/* ============================================================ */
function Founder() {
  return (
    <section className="section" id="founder">
      <div className="container moment reveal">
        <p className="moment-eyebrow">Who You Work With</p>
        <CharReveal as="h2" className="moment-h">One operator. Not an agency.</CharReveal>
        <p className="moment-body">
          BlackRain is one operator. I spent years in merchant finance, on the phone with hundreds of owners, watching
          good businesses bleed the same way: leads dying in an inbox, follow-up that never happened, hours lost to
          reports nobody read. I build the systems that end it. When you call, you get the person who built your
          system — no account manager, no offshore team. Built in Connecticut.
        </p>
      </div>
    </section>
  );
}

/* ============================================================ */
function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="container pricing-min reveal">
        <p className="moment-eyebrow how-eyebrow">Pricing</p>
        <CharReveal as="h2" className="how-headline">Priced to scope.</CharReveal>
        <p className="moment-body">
          Project-based work, custom-quoted after the $999 Blueprint. No subscriptions required, no surprises — the
          price is in writing before anything begins.
        </p>
        <p className="how-closing">
          Larger systems sometimes warrant an optional monthly retainer — tuning, monitoring, priority support. Quoted
          in the blueprint when applicable.
        </p>
      </div>
    </section>
  );
}

/* ============================================================ */
function Consult() {
  return (
    <section className="section consult" id="start">
      <div className="container">
        <div className="consult-inner reveal">
          <ScrollText as="h2" text="Start with fifteen free minutes." />
          <p className="sub">
            I look at how your business actually runs and show you one or two places AI pays for itself. No pitch, no
            obligation — you keep the ideas either way.
          </p>
          <p className="sub">
            If it’s a fit, the $999 Blueprint maps your highest-return automations into a written roadmap, credited in
            full toward any build. And for owners who want it run for them, there’s the Concierge — seven seats,
            month-to-month, and you see exactly what it books you. Walk away any time.
          </p>
          <p className="sub italic">
            You’re never out the money on the diagnosis — the $999 credits toward whatever you build.
          </p>
          <div className="cta-stack">
            <a className="cta-pill" data-magnetic href={AUDIT_URL} target="_blank" rel="noopener noreferrer">
              Book the free 15-min audit <span className="arrow" aria-hidden="true">→</span>
            </a>
            <p className="cta-sub">Free · 15 minutes · no pitch.</p>
            <a className="cta" data-magnetic href={BLUEPRINT_URL} target="_blank" rel="noopener noreferrer">
              <span className="label">Or go straight to the $999 Blueprint</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-stack">
        <div className="footer-cols">
          <div className="footer-brand">
            <div className="lockup"><span className="wordmark">Black<span className="r">Rain</span></span></div>
            <p className="tagline">AI systems that pay for themselves.</p>
            <div className="footer-social" aria-label="Social profiles">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} className="social-btn" href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div className="footer-section">
            <h4 className="footer-section-title">Navigate</h4>
            <nav className="footer-inline-row" aria-label="Footer">
              <a href="#top">Home</a><span className="sep" aria-hidden="true">·</span>
              <a href="#what-i-build">Services</a><span className="sep" aria-hidden="true">·</span>
              <a href="#how-it-works">Process</a><span className="sep" aria-hidden="true">·</span>
              <a href="#start">Begin</a>
            </nav>
          </div>
          <div className="footer-section">
            <h4 className="footer-section-title">Contact</h4>
            <div className="footer-inline-row">
              <a href="tel:+18608032795">860.803.2795</a>
              <span className="sep" aria-hidden="true">·</span>
              <a href="mailto:ryan@blackrainautomations.com">ryan@blackrainautomations.com</a>
            </div>
          </div>
        </div>
        <hr className="footer-rule" />
        <div className="footer-legal">
          <p className="copy">© 2026 BlackRain Automations LLC · Built in Connecticut</p>
          <nav className="legal-links" aria-label="Legal">
            <a href="/terms-of-service.html">Terms of Service</a>
            <span className="sep" aria-hidden="true">·</span>
            <a href="/privacy-policy.html">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================ */
/* ============================================================ */
const LADDER = [
  { step: "Free 15-Min Audit", price: "Free", desc: "We find where your pipeline leaks. No pitch — you keep the ideas." },
  { step: "The $999 Blueprint", price: "$999", desc: "A written roadmap of your highest-ROI automations. Credited in full toward any build." },
  { step: "Builds", price: "$2k–25k+", desc: "Starter to enterprise. Priced in writing before a thing is built." },
  { step: "The Concierge", price: "~$1,500/mo", desc: "The flagship — six seats, done-with-you. Strategy, direct access, systems run and improved every month." },
  { step: "Retainers", price: "$300–1,500/mo", desc: "Monitoring and tuning on the larger systems." },
];
const STAGES = [
  { key: "Capture", sub: "Leads arriving but slipping", items: ["Speed-to-lead", "Missed-call text-back", "AI receptionist, 24/7", "Lead qualification"] },
  { key: "Prospect", sub: "Not enough leads", items: ["Outbound AI SDR", "DM-to-sale closer"] },
  { key: "Close", sub: "Deals dying mid-funnel", items: ["Quote automation", "Quote recovery", "Sales follow-up", "Booking + no-show", "Proposal & contract", "Bid / RFP response"] },
  { key: "Expand", sub: "Money left on the table", items: ["Upsell & cross-sell", "Reorder / replenish", "Referral mining"] },
  { key: "Recover", sub: "Earned money leaking out", items: ["Win-back / churn-save", "CRM reactivation", "Review requests", "Invoice follow-up"] },
];
const TIME = [
  "Reports & dashboards that build themselves",
  "Scheduling that fills itself",
  "Call notes & transcription, logged for you",
  "Invoice & payment follow-up",
  "Data entry & admin, automated",
  "Skill-File builds — your knowledge, turned into agent skills",
  "AI team training & setup",
];
const VISIBILITY = [
  "Full Business Revamp — site, Google, reviews, booking, brand",
  "AI Motion Websites",
  "Local SEO & Google Business Profile",
  "AI Ad Management (Meta + ChatGPT)",
  "Content engines — social & email on autopilot",
  "Review generation — more 5-stars, automatically",
];

function Menu() {
  return (
    <section className="section" id="menu">
      <div className="container">
        <div className="section-head reveal" style={{ textAlign: "center" }}>
          <p className="eyebrow">The Menu</p>
          <ScrollText as="h2" text="Everything we build." />
          <p className="menu-intro">Most businesses run the stock version of themselves. Here&rsquo;s everything we use to jailbreak yours &mdash; we diagnose first, then prescribe one system at a time.</p>
        </div>
        <div className="ladder reveal">
          {LADDER.map((l) => (
            <div className="ladder-row" key={l.step}>
              <div className="ladder-main"><h3>{l.step}</h3><p>{l.desc}</p></div>
              <div className="ladder-price">{l.price}</div>
            </div>
          ))}
        </div>
        <p className="menu-group-label reveal">Make More Money <span>&middot; revenue systems</span></p>
        <div className="revenue-grid">
          {STAGES.map((s) => (
            <div className="rg-stage reveal" key={s.key}>
              <h3>{s.key}</h3>
              <p className="stage-sub">{s.sub}</p>
              <ul className="menu-list">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="menu-group-label reveal">Save Time <span>&middot; the busywork, automated</span></p>
        <ul className="menu-list cols reveal">{TIME.map((t) => <li key={t}>{t}</li>)}</ul>
        <p className="menu-group-label reveal">Get Seen &amp; Look the Part <span>&middot; visibility &amp; brand</span></p>
        <ul className="menu-list cols reveal">{VISIBILITY.map((v) => <li key={v}>{v}</li>)}</ul>
      </div>
    </section>
  );
}

function BookCTA() {
  return (
    <section className="section consult" id="book">
      <div className="container consult-inner reveal" style={{ textAlign: "center" }}>
        <ScrollText as="h2" text="Start with fifteen free minutes." />
        <p className="sub">No pitch. We look at how your business runs and show you where AI pays for itself — you keep the ideas either way.</p>
        <a className="cta-pill" data-magnetic href={AUDIT_URL} target="_blank" rel="noopener noreferrer">
          Book a Free Audit <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

/* ============================================================ */
export default function App() {
  useReveal();
  useMagnetic();
  return (
    <Fragment>
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <main>
        <Splash />
        <Menu />
        <BookCTA />
      </main>
      <Footer />
    </Fragment>
  );
}
