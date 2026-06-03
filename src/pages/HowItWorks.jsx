import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   SHARED TOKENS + PRIMITIVES (match home page design system)
───────────────────────────────────────────────────────────── */
const BLUE = '#1B76DC';
const DARK_BG = '#0D0E14';
const INK = '#0B2039';
const MUTED = '#52546A';
const HERO_BG = 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #C6EAFF 35%, #D6FDFF 68%, #B5C5FF 100%)';

function Reveal({ children, className, style, delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function StatusBar({ dark = true }) {
  const c = dark ? 'rgba(255,255,255,0.5)' : 'rgba(13,14,20,0.45)';
  return (
    <div className="flex justify-between items-center px-5 pt-14 pb-1 text-[9px] font-semibold" style={{ color: c }}>
      <span>9:41</span>
      <span>●●●● WiFi</span>
    </div>
  );
}

function AppStoreButton({ light = false }) {
  return (
    <a href="#download" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl transition-transform hover:-translate-y-0.5"
      style={{
        background: light ? 'rgba(255,255,255,0.18)' : DARK_BG,
        backdropFilter: light ? 'blur(12px)' : 'none',
        border: light ? '1px solid rgba(255,255,255,0.25)' : 'none',
        boxShadow: light ? 'none' : '0 4px 20px rgba(13,14,20,0.25)',
      }}>
      <svg width="20" height="24" viewBox="0 0 20 24" fill="white">
        <path d="M16.462 12.707c-.028-3.13 2.558-4.641 2.674-4.715-1.459-2.134-3.728-2.426-4.527-2.456-1.93-.197-3.772 1.143-4.75 1.143-.978 0-2.49-1.115-4.09-1.085-2.1.031-4.034 1.226-5.116 3.1-2.175 3.773-.557 9.36 1.563 12.426 1.036 1.5 2.275 3.186 3.901 3.125 1.565-.063 2.156-1.013 4.05-1.013 1.892 0 2.42 1.013 4.086.982 1.685-.031 2.763-1.53 3.79-3.038 1.2-1.739 1.695-3.427 1.722-3.514-.038-.014-3.303-1.267-3.303-5.055zm-3.1-9.29c.863-1.041 1.443-2.49 1.284-3.93-1.24.05-2.74.826-3.63 1.867-.795.924-1.49 2.39-1.303 3.8 1.382.107 2.786-.7 3.65-1.736z"/>
      </svg>
      <div>
        <p className="text-[9px] leading-none mb-0.5 text-white/60" style={{ letterSpacing: '0.04em' }}>Download on the</p>
        <p className="text-[15px] font-semibold leading-none text-white" style={{ letterSpacing: '-0.01em' }}>App Store</p>
      </div>
    </a>
  );
}

function IPhone({ children, width = 260 }) {
  const h = Math.round(width * 2.165);
  const r = Math.round(width * 0.145);
  return (
    <div className="relative shrink-0 select-none" style={{ width, height: h }}>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(165deg, #48484A 0%, #1C1C1E 45%, #3A3A3C 100%)',
        borderRadius: r,
        boxShadow: '0 50px 100px rgba(0,0,0,0.40), 0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.12)',
      }} />
      <div className="absolute overflow-hidden" style={{ inset: 3, borderRadius: r - 3, background: '#000' }}>
        {children}
      </div>
      <div className="absolute z-20 bg-black" style={{
        top: Math.round(h * 0.018), left: '50%', transform: 'translateX(-50%)',
        width: Math.round(width * 0.32), height: Math.round(width * 0.082), borderRadius: 999,
      }} />
      <div className="absolute" style={{ right: -2, top: Math.round(h * 0.29), width: 3, height: Math.round(h * 0.115), background: '#48484A', borderRadius: '0 2px 2px 0' }} />
      {[0.215, 0.305].map((t, i) => (
        <div key={i} className="absolute" style={{ left: -2, top: Math.round(h * t), width: 3, height: Math.round(h * 0.082), background: '#48484A', borderRadius: '2px 0 0 2px' }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMPORT SCREEN — shown in the hero phone
───────────────────────────────────────────────────────────── */
function ImportScreen() {
  const steps = [
    { label: 'Parsed 14 runs', done: true },
    { label: 'Calculated session stats', done: true },
    { label: 'SlopeScore ready', done: true },
    { label: 'Generating coaching debrief', done: false },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-4">
        <p className="text-[11px] text-white/30">Import</p>
        <p className="text-[18px] font-bold mt-1">Session imported</p>
      </div>
      {/* File card */}
      <div className="mx-3 rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: 'rgba(27,118,220,0.14)', border: `1px solid ${BLUE}40` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: BLUE }}>
          <span className="text-[13px] font-bold text-white">↓</span>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold truncate">Killington_Jan18.slopes</p>
          <p className="text-[10px] text-white/40">2.4 MB · Active Times</p>
        </div>
      </div>
      {/* Parse checklist */}
      <div className="mx-3 space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/[0.05] rounded-xl px-3.5 py-3">
            <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{ background: s.done ? BLUE : 'transparent', border: s.done ? 'none' : '1.5px solid rgba(255,255,255,0.25)' }}>
              {s.done && <span className="text-[8px] text-white font-bold">✓</span>}
            </span>
            <span className="text-[12px]" style={{ color: s.done ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)' }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-auto mb-5">
        <div className="rounded-xl py-3 text-center text-[13px] font-semibold text-white" style={{ background: BLUE }}>
          View debrief
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-24" style={{ background: HERO_BG }}>
      <motion.div className="relative z-10 text-center px-6 max-w-[720px] mx-auto pt-12"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="font-display font-bold leading-[0.95] tracking-[-0.02em] mb-6" style={{ fontSize: 'clamp(3rem, 7.5vw, 6rem)', color: INK }}>
          From file to coaching<br />in minutes.
        </h1>
        <p className="text-[18px] sm:text-[20px] max-w-[460px] mx-auto leading-[1.65] mb-10" style={{ color: `${INK}88` }}>
          Four steps. No technical setup. No account required
          for your first session.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <AppStoreButton />
          <span className="text-[13px]" style={{ color: `${INK}55` }}>Free to download</span>
        </div>
      </motion.div>
      <motion.div className="relative z-10 flex justify-center"
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
        <div className="relative overflow-hidden" style={{ maxHeight: '52vh' }}>
          <IPhone width={280}><ImportScreen /></IPhone>
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #B5C5FF, transparent)' }} />
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEPS — 2×2 grid, matches home HowToSection styling
───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Export from Slopes',
    body: 'Open Slopes, pick a session, tap Export and choose the .slopes file (Active Times). That file holds every run, lift, speed, vertical, and timestamp from your day.',
    detail: 'Use "Active Times" — regular exports skip run-level data.',
  },
  {
    n: '02',
    title: 'Upload to SlopeIQ',
    body: 'Drop the file in. SlopeIQ parses it right in your browser. Only derived metrics — never raw GPS — get sent for the AI coaching step.',
    detail: 'Your location data never leaves your device.',
  },
  {
    n: '03',
    title: 'Get your SlopeScore + debrief',
    body: 'Your SlopeScore computes instantly. Then coaching runs against your data and your history to surface patterns: warmup tendencies, fatigue windows, effort efficiency.',
    detail: 'The more history you build, the sharper the coaching gets.',
  },
  {
    n: '04',
    title: 'Plan your next session',
    body: 'Open Mountain Coach and say where you are going. It pulls live trail data, cross-references your speed profile and SlopeScore, and builds a run-by-run plan.',
    detail: 'Mountain Coach is a Pro feature.',
  },
];

function Steps() {
  return (
    <section className="py-24 px-6 sm:px-10" style={{ background: 'white' }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2 className="font-display font-bold mb-16" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.04, color: INK }}>
            How it works.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(13,14,20,0.08)' }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.08} className="p-8 sm:p-12" style={{ background: 'white' }}>
              <p className="font-display font-bold leading-none mb-7" style={{ fontSize: '3rem', color: 'rgba(13,14,20,0.08)' }}>{s.n}</p>
              <h3 className="font-display font-bold mb-3" style={{ fontSize: '1.55rem', lineHeight: 1.12, color: INK }}>{s.title}</h3>
              <p className="text-[15px] leading-[1.75] mb-5" style={{ color: MUTED }}>{s.body}</p>
              <p className="text-[12px] font-semibold" style={{ color: BLUE }}>{s.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRIVACY BAND — dark section for rhythm
───────────────────────────────────────────────────────────── */
function PrivacyBand() {
  const points = [
    { title: 'Parsed on your device', body: 'Your .slopes file is read in the browser. The raw file never gets uploaded to a server.' },
    { title: 'GPS stays with you', body: 'Only calculated metrics — speeds, vertical totals, run durations — are sent for coaching. Never your location track.' },
    { title: 'No account to try', body: 'Your first session runs without signing up. Create an account only when you want history saved.' },
  ];
  return (
    <section className="py-24 px-6 sm:px-10" style={{ background: DARK_BG }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <p className="text-[12px] tracking-[0.22em] uppercase mb-6 font-sans font-semibold" style={{ color: BLUE }}>Your data</p>
          <h2 className="font-display font-bold mb-14" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.06, color: '#EFEFED' }}>
            Your data stays yours.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(239,239,237,0.08)' }}>
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="p-8" style={{ background: DARK_BG }}>
              <h3 className="font-display font-bold mb-3" style={{ fontSize: '1.3rem', lineHeight: 1.15, color: '#EFEFED' }}>{p.title}</h3>
              <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(239,239,237,0.48)' }}>{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CTA — mountain parallax (matches home)
───────────────────────────────────────────────────────────── */
function CTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <section id="download" ref={ref} className="relative min-h-[75vh] flex items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src="/mountain.jpg" alt="Aerial panorama of the Alps at dawn" className="w-full h-full object-cover"
          style={{ objectPosition: 'center 35%', transform: 'scale(1.18)', opacity: 0.65 }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,9,13,0.92) 0%, rgba(8,9,13,0.55) 55%, rgba(8,9,13,0.65) 100%)' }} />
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 py-24 text-center">
        <Reveal>
          <h2 className="font-display font-bold text-[#EFEFED] mx-auto mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.94, letterSpacing: '-0.02em', maxWidth: '14ch' }}>
            Ready to start?
          </h2>
          <p className="text-[18px] max-w-[340px] mx-auto leading-[1.7] mb-10" style={{ color: 'rgba(239,239,237,0.50)' }}>
            First session is free. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <AppStoreButton light />
            <Link to="/signup" className="text-[14px] font-semibold px-5 py-3 rounded-xl text-white transition-transform hover:-translate-y-0.5"
              style={{ background: BLUE, boxShadow: `0 4px 16px ${BLUE}40` }}>
              Create free account
            </Link>
          </div>
          <p className="text-[11px] mt-6 tracking-[0.18em] uppercase font-sans" style={{ color: 'rgba(239,239,237,0.20)' }}>
            Requires Slopes App · iPhone only
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function HowItWorks() {
  return (
    <div>
      <Hero />
      <Steps />
      <PrivacyBand />
      <CTA />
    </div>
  );
}
