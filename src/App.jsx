import { useState, useEffect, useRef, Fragment } from "react";

/* ---------- lucide-style icons (stroke, currentColor) ---------- */
const Svg = ({ size = 24, sw = 2, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
       strokeLinejoin="round" {...p}>{children}</svg>
);
const MessageSquare = (p) => <Svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>;
const BarChart3 = (p) => <Svg {...p}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></Svg>;
const Calendar = (p) => <Svg {...p}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></Svg>;
const Check = (p) => <Svg size={16} {...p}><path d="M20 6 9 17l-5-5"/></Svg>;

const DROPLET = "/assets/droplet.png";

/* ---------- scroll reveal: alternating slide-in, bidirectional, re-triggering ---------- */
function useReveal() {
  useEffect(() => {
    // assign alternating slide direction per section (top-to-bottom)
    const scopes = document.querySelectorAll("main section:not(.hero-card), footer");
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
        // revealed once ~14% has entered from the bottom; hides again past the top
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

/* small util: stagger delay style */
const delay = (s) => ({ transitionDelay: `${s}s` });

/* ---------- subtle magnetic pull on [data-magnetic] elements ---------- */
function useMagnetic() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return; // skip touch
    const RADIUS = 80;   // activation distance from element center
    const MAX = 6;       // max displacement in px — quiet whisper
    const STRENGTH = 0.14;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        document.querySelectorAll("[data-magnetic]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
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

/* ---------- scroll-driven character reveal (adapted AnimatedText) ---------- */
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
      // 0 when the line sits low in the viewport, 1 once it has risen past the middle
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.5 + r.height)));
      const sweep = p * (n + 6); // small buffer so it completes before fully scrolled
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

/* ---------- char reveal that preserves inner markup (.tnum, .hl) ---------- */
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
        <a className="brand-lockup" href="#top" aria-label="Blackrain — home">
          <img src={DROPLET} alt="" />
          <span className="wordmark">Blackrain</span>
        </a>
        <nav className="header-nav">
          <a className="nav-only" href="#how-it-works">Process</a>
          <a className="nav-only" href="#pricing">Pricing</a>
          <a className="cta" data-magnetic href="#diagnostic">
            <span className="label">Book the Blueprint</span>
            <span className="arrow">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ============================================================ */
function HeroCard() {
  return (
    <section className="hero-card" id="top">
      <img className="hero-droplet" src={DROPLET} alt="Blackrain droplet" />
      <div className="wordmark reveal in" style={delay(0.05)}>Blackrain</div>
      <p className="eyebrow reveal in" style={delay(0.1)}>AI Automation Consultancy</p>
    </section>
  );
}

function HeroMessage() {
  return (
    <section className="hero-message">
      <p className="hero-eyebrow shimmer reveal" data-text="Briefing">Briefing</p>
      <CharReveal as="h1" className="hero-stat">
        <span className="hl"><span className="tnum">88%</span> use AI.</span>
        <span className="hl">Fewer than <span className="tnum">10%</span> use it well.</span>
      </CharReveal>
      <div className="hero-body reveal" style={delay(0.08)}>
        <p>
          AI is everywhere. AI done well is not. Most use it for the smallest things — a subject line, a meeting summary — and stop there. A smaller number have done the quieter, harder work, and built it into how the business operates. Their margins compound. The distance widens every quarter. <a className="hero-cite cite-em" href="https://hai.stanford.edu/ai-index/2026-ai-index-report" target="_blank" rel="noopener noreferrer">(Stanford AI Index 2026.)</a>
        </p>
        <p>
          Blackrain is built for the smaller number — custom, project-based, paid back in weeks.
        </p>
      </div>
      <div className="hero-ctas reveal" style={delay(0.12)}>
      </div>
    </section>
  );
}

/* ============================================================ */
const PROBLEMS = [
  { Icon: MessageSquare, title: "Lead Follow-up",
    body: "New leads pile up. By the time someone gets to them, half are cold. Personalized follow-up at scale doesn’t happen because nobody has the hours." },
  { Icon: BarChart3, title: "Weekly Reporting",
    body: "Mondays vanish to pulling numbers from five systems, formatting a deck, and writing the same story slightly different. By Tuesday you’ve already lost the week." },
  { Icon: Calendar, title: "Meeting Prep & Follow-up",
    body: "Walk into the meeting underprepared, walk out with action items that nobody captures. The follow-through dies in someone’s inbox." },
];

function Problem() {
  return (
    <section className="section" id="problem">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">The Problem</p>
          <ScrollText as="h2" text="Three workflows are eating your week. You know exactly which ones." />
        </div>
        <div className="card-grid">
          {PROBLEMS.map(({ Icon, title, body }, i) => (
            <div className="card reveal" key={title} style={delay(i * 0.08)}>
              <div className="icon"><Icon /></div>
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
const FEATURES = [
  { num: "01", title: "Lead Qualification & Follow-up",
    body: "New leads enter your CRM. We score them, route the hot ones to the right rep, and send a personalized first-touch email within 60 seconds — without your team writing a word.",
    outcomes: ["Reply rate up 3–5×", "First-touch time: minutes, not days", "Reps focus on hot leads, not the noise"] },
  { num: "02", title: "Weekly Reporting",
    body: "Every Monday morning, the report writes itself. Numbers pulled from your stack, narrative drafted by AI, in your inbox before your first coffee.",
    outcomes: ["3–4 hours/week back to you", "Same format every week — no manual deck wrangling", "Drill-down links to the underlying data"] },
  { num: "03", title: "Meeting Prep & Follow-up",
    body: "Before every call: a one-pager on who you’re meeting, what they care about, and what’s happened since last contact. After every call: action items captured, owners assigned, follow-ups scheduled.",
    outcomes: ["Walk in armed every time", "Zero action items lost", "Compounds across your whole team"] },
];

function WhatWeBuild() {
  return (
    <section className="section" id="what-we-build">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">What We Build</p>
          <ScrollText as="h2" text="Custom automation for the work you can’t hire fast enough to cover." />
        </div>
        <div style={{ marginTop: "1rem" }}>
          {FEATURES.map((f, i) => (
            <div className={"feature reveal" + (i % 2 ? " flip" : "")} key={f.num}>
              <div className="feature-text">
                <div className="feature-num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <ul className="outcomes">
                  {f.outcomes.map((o) => (
                    <li key={o}><span className="tick"><Check /></span>{o}</li>
                  ))}
                </ul>
              </div>
              <div className="feature-preview">
                <span className="ph-label">UI preview</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
const STEPS = [
  { n: "01", title: "The discovery call.", timing: "~45 minutes, remote.",
    body: "A recorded conversation about how your business runs. We walk through where the money comes from, where your time goes, where the friction lives, what’s already wired and what isn’t. No pitch, no software demo — just a careful look." },
  { n: "02", title: "The written report.", timing: "Delivered within seven days.",
    body: "A formal report: the revenue plays, the time-savings plays, and the compound plays that do both — each with cost, ROI math, and timeline. Built from the call transcript, not a template." },
  { n: "03", title: "The closing call.", timing: "~20 minutes, remote.",
    body: "We walk you through the findings. From there, three paths: build the top priority with us, build it yourself with the roadmap, or build nothing. The report is yours either way." },
];

function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow how-eyebrow">How It Works</p>
          <CharReveal as="h2" className="how-headline">A conversation, a blueprint, a decision.</CharReveal>
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
        <p className="how-closing reveal">Most of these turn into a build. Some don’t. Both are fine outcomes for us — we don’t sell what doesn’t pencil out.</p>
      </div>
    </section>
  );
}

/* ============================================================ */
const PLANS = [
  { tier: "Starter", price: "$2k", what: "A task, automated.", delivery: "2 weeks", support: "30-day" },
  { tier: "Standard", price: "$5–10k", what: "A whole process runs itself.", delivery: "3–4 weeks", support: "30-day" },
  { tier: "Premium", price: "$15–25k", popular: true, what: "A custom AI employee.", delivery: "4–6 weeks", support: "30-day + handoff" },
  { tier: "Enterprise", price: "$25k+", what: "Autonomous, ongoing.", delivery: "Custom", support: "Optional retainer" },
];

function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="container pricing-min reveal">
        <p className="moment-eyebrow how-eyebrow">Pricing</p>
        <CharReveal as="h2" className="how-headline">Priced to scope.</CharReveal>
        <p className="moment-body">
          Project-based work, custom-quoted after the $999 blueprint.
        </p>
        <p className="how-closing">
          Larger systems sometimes warrant an optional monthly retainer — tuning, monitoring, priority support. Quoted in the blueprint when applicable.
        </p>
      </div>
    </section>
  );
}

/* ============================================================ */
function Consult() {
  return (
    <section className="section consult" id="diagnostic">
      <div className="container">
        <div className="reveal">
          <ScrollText as="h2" text="Book your blueprint." />
          <p className="sub">
            A paid, written walk through your operation. Yours to keep,
            credited to any build.
          </p>
        </div>
        <div className="cta-with-sub reveal">
          <a className="cta-pill" data-magnetic href="https://cal.com/blackrain/blueprint" target="_blank" rel="noopener noreferrer">
            <span className="text">Let’s begin.</span>
            <span className="arrow" aria-hidden="true">→</span>
          </a>
          <p className="cta-sub">Booking is paid: $999, credited to any build.</p>
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
            <div className="lockup">
              <img src={DROPLET} alt="" />
              <span className="wordmark">Blackrain</span>
            </div>
            <p className="tagline">AI automations, custom-built.</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Navigate</h4>
            <nav className="footer-inline-row" aria-label="Footer">
              <a href="#top">Home</a>
              <span className="sep" aria-hidden="true">·</span>
              <a href="#how-it-works">Process</a>
              <span className="sep" aria-hidden="true">·</span>
              <a href="#pricing">Pricing</a>
              <span className="sep" aria-hidden="true">·</span>
              <a href="#diagnostic">Begin</a>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Contact</h4>
            <div className="footer-inline-row">
              <a href="tel:18608032795">860.803.2795</a>
              <span className="sep" aria-hidden="true">·</span>
              <a href="mailto:ryan@blackrainautomations.com">ryan@blackrainautomations.com</a>
              {/* TODO: <a href={LINKEDIN_URL}>...</a> once profile URL is finalized */}
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
const MARQUEE_A = ["Lead scoring", "60-second first touch", "CRM routing", "Reply rate 3–5×", "Hot leads, not noise", "First-touch in minutes"];
const MARQUEE_B = ["Monday report auto-drafted", "Meeting one-pagers", "Action items captured", "Drill-down links", "Edge-case tested", "You own everything"];

function MarqueeRow({ items, dir, scrollRef }) {
  return (
    <div className="marquee-row" ref={scrollRef} data-dir={dir}>
      {[...items, ...items, ...items].map((label, i) => (
        <span className="marquee-tile" key={i}>
          <span className="m-dot"></span>{label}
        </span>
      ))}
    </div>
  );
}

function MarqueeBand() {
  const secRef = useRef(null);
  const row1 = useRef(null);
  const row2 = useRef(null);
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const base1 = row1.current ? row1.current.scrollWidth / 3 : 0;
    const base2 = row2.current ? row2.current.scrollWidth / 3 : 0;
    let raf = null;
    const update = () => {
      raf = null;
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.18;
      if (row1.current) row1.current.style.transform = `translateX(${-base1 - offset}px)`;
      if (row2.current) row2.current.style.transform = `translateX(${-base2 + offset}px)`;
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
  return (
    <section className="marquee" ref={secRef} aria-hidden="true">
      <div className="marquee-rows">
        <MarqueeRow items={MARQUEE_A} dir="left" scrollRef={row1} />
        <MarqueeRow items={MARQUEE_B} dir="right" scrollRef={row2} />
      </div>
    </section>
  );
}

/* ============================================================ */
function TheMoment() {
  return (
    <section className="section" id="the-moment">
      <div className="container moment reveal">
        <p className="moment-eyebrow">The Arrival</p>
        <CharReveal as="h2" className="moment-h">The infrastructure has arrived.</CharReveal>
        <p className="moment-body">
          On May 13, 2026, Anthropic introduced Claude for Small Business: fifteen workflows for the work that quietly eats small operators — invoice chasing, lead follow-up, outbound campaigns, month-end close. The models underneath are all 2026 — Opus 4.8 (May 28), Sonnet 4.6, GPT-5.4, Gemini 3.1. The economics are no longer speculative: every dollar invested returns <span className="tnum">$3.50</span>, with first real return inside sixty days.
        </p>
        <a className="arrival-link" href="#pricing">
          <span className="al-label">See pricing</span>
          <span className="arrow">→</span>
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
      <Header />
      <main>
        <HeroCard />
        <HeroMessage />
        <hr className="divider" />
        <TheMoment />
        <hr className="divider" />
        <HowItWorks />
        <hr className="divider" />
        <Pricing />
        <hr className="divider" />
        <Consult />
      </main>
      <Footer />
    </Fragment>
  );
}
