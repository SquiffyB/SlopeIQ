import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   REVEAL ANIMATION
───────────────────────────────────────────────────────────── */
function Reveal({ children, className, delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   APP STORE BUTTON
───────────────────────────────────────────────────────────── */
function AppStoreButton({ light = false }) {
  return (
    <a
      href="#download"
      className="inline-flex items-center gap-3 px-5 py-3 rounded-xl transition-transform hover:-translate-y-0.5"
      style={{
        background: light ? 'rgba(255,255,255,0.18)' : '#0D0E14',
        backdropFilter: light ? 'blur(12px)' : 'none',
        border: light ? '1px solid rgba(255,255,255,0.25)' : 'none',
        boxShadow: light ? 'none' : '0 4px 20px rgba(13,14,20,0.25)',
      }}
    >
      {/* Apple logo */}
      <svg width="20" height="24" viewBox="0 0 20 24" fill={light ? 'white' : 'white'}>
        <path d="M16.462 12.707c-.028-3.13 2.558-4.641 2.674-4.715-1.459-2.134-3.728-2.426-4.527-2.456-1.93-.197-3.772 1.143-4.75 1.143-.978 0-2.49-1.115-4.09-1.085-2.1.031-4.034 1.226-5.116 3.1-2.175 3.773-.557 9.36 1.563 12.426 1.036 1.5 2.275 3.186 3.901 3.125 1.565-.063 2.156-1.013 4.05-1.013 1.892 0 2.42 1.013 4.086.982 1.685-.031 2.763-1.53 3.79-3.038 1.2-1.739 1.695-3.427 1.722-3.514-.038-.014-3.303-1.267-3.303-5.055zm-3.1-9.29c.863-1.041 1.443-2.49 1.284-3.93-1.24.05-2.74.826-3.63 1.867-.795.924-1.49 2.39-1.303 3.8 1.382.107 2.786-.7 3.65-1.736z"/>
      </svg>
      <div>
        <p className="text-[9px] leading-none mb-0.5" style={{ color: light ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
          Download on the
        </p>
        <p className="text-[15px] font-semibold leading-none text-white" style={{ letterSpacing: '-0.01em' }}>
          App Store
        </p>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   iPHONE FRAME
───────────────────────────────────────────────────────────── */
function IPhone({ children, width = 260 }) {
  const h = Math.round(width * 2.165);
  const r = Math.round(width * 0.145);

  return (
    <div className="relative shrink-0 select-none" style={{ width, height: h }}>
      {/* Frame */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, #48484A 0%, #1C1C1E 45%, #3A3A3C 100%)',
          borderRadius: r,
          boxShadow: [
            '0 50px 100px rgba(0,0,0,0.40)',
            '0 20px 40px rgba(0,0,0,0.25)',
            '0 0 0 1px rgba(255,255,255,0.10)',
            'inset 0 1px 0 rgba(255,255,255,0.12)',
          ].join(', '),
        }}
      />
      {/* Screen */}
      <div
        className="absolute overflow-hidden"
        style={{ inset: 3, borderRadius: r - 3, background: '#000' }}
      >
        {children}
      </div>
      {/* Dynamic island */}
      <div
        className="absolute z-20 bg-black"
        style={{
          top: Math.round(h * 0.018),
          left: '50%',
          transform: 'translateX(-50%)',
          width: Math.round(width * 0.32),
          height: Math.round(width * 0.082),
          borderRadius: 999,
        }}
      />
      {/* Side button */}
      <div
        className="absolute"
        style={{
          right: -2,
          top: Math.round(h * 0.29),
          width: 3,
          height: Math.round(h * 0.115),
          background: '#48484A',
          borderRadius: '0 2px 2px 0',
        }}
      />
      {/* Volume buttons */}
      {[0.215, 0.305].map((t, i) => (
        <div key={i} className="absolute" style={{
          left: -2, top: Math.round(h * t),
          width: 3, height: Math.round(h * 0.082),
          background: '#48484A', borderRadius: '2px 0 0 2px',
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   APP SCREENS
───────────────────────────────────────────────────────────── */
function DebriefScreen() {
  return (
    <div className="w-full h-full bg-[#0D0E14] text-white flex flex-col text-left overflow-hidden" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="flex justify-between items-center px-5 pt-14 pb-1 text-[9px] opacity-60">
        <span className="font-semibold">9:41</span>
        <span>●●●● WiFi ▓</span>
      </div>
      <div className="px-4 pt-2 pb-3">
        <span className="text-[11px] text-white/35">← Sessions</span>
        <p className="text-[19px] font-bold mt-1 leading-tight">Killington</p>
        <p className="text-[11px] text-white/35 mt-0.5">Jan 18 · 14 runs · 4h 22m</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-4 mb-3">
        {[['34.2', 'mph', 'Top speed'], ['18.4k', 'ft', 'Vertical'], ['14', 'runs', 'Total']].map(([v, u, l]) => (
          <div key={l} className="bg-white/[0.06] rounded-xl p-2.5">
            <p className="text-[15px] font-bold leading-none">{v}<span className="text-[9px] text-white/40 ml-0.5">{u}</span></p>
            <p className="text-[9px] text-white/30 mt-1">{l}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 rounded-xl p-3 mb-3 flex items-center justify-between" style={{ background: 'rgba(27,118,220,0.18)' }}>
        <div>
          <p className="text-[8px] tracking-widest uppercase mb-0.5" style={{ color: '#7DB9F0' }}>SlopeScore</p>
          <p className="text-[28px] font-bold leading-none">78</p>
        </div>
        <p className="text-[16px] font-bold" style={{ color: '#1B76DC' }}>+3 ↑</p>
      </div>
      <div className="px-4 flex-1 space-y-2">
        <p className="text-[8px] tracking-widest uppercase text-white/20">Coaching observations</p>
        {[
          'Speed dropped 18% between runs 7–10. Classic mid-session fade.',
          'Your peak vertical rate was 3,200 ft/hr before run 6.',
          'Fatigue window hit at run 9, matching your 3-session average.',
        ].map((t, i) => (
          <div key={i} className="bg-white/[0.04] rounded-xl p-2.5">
            <p className="text-[11px] text-white/55 leading-snug">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreScreen() {
  const C = 2 * Math.PI * 50;
  return (
    <div className="w-full h-full bg-[#F5F5F3] flex flex-col overflow-hidden" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="flex justify-between items-center px-5 pt-14 pb-1 text-[9px] text-[#0D0E14] opacity-60">
        <span className="font-semibold">9:41</span>
        <span>●●●●</span>
      </div>
      <div className="px-4 pt-2 pb-3">
        <p className="text-[19px] font-bold text-[#0D0E14] leading-tight">SlopeScore</p>
        <p className="text-[11px] text-[#52546A] mt-0.5">This season</p>
      </div>
      <div className="flex justify-center my-1">
        <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
          <svg viewBox="-65 -65 130 130" className="absolute inset-0 w-full h-full">
            <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(13,14,20,0.07)" strokeWidth="7" />
            <circle cx="0" cy="0" r="50" fill="none" stroke="#1B76DC" strokeWidth="7"
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * 0.22} transform="rotate(-90)" />
          </svg>
          <div className="text-center z-10">
            <p className="text-[34px] font-bold text-[#0D0E14] leading-none">78</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#1B76DC' }}>+3 today</p>
          </div>
        </div>
      </div>
      <div className="px-4 flex-1 space-y-2">
        <p className="text-[8px] tracking-widest uppercase text-[#52546A] mb-1">Breakdown</p>
        {[['Consistency', 72], ['Fatigue Mgmt', 88], ['Vertical Rate', 65], ['Recovery', 80], ['Speed', 62]].map(([l, v]) => (
          <div key={l}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] text-[#52546A]">{l}</span>
              <span className="text-[10px] font-semibold text-[#0D0E14]">{v}</span>
            </div>
            <div className="h-1 rounded-full bg-[rgba(13,14,20,0.07)]">
              <div className="h-full rounded-full" style={{ width: `${v}%`, background: '#1B76DC' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 mt-2">
        <p className="text-[8px] tracking-widest uppercase text-[#52546A] mb-1.5">Season trend</p>
        <div className="h-12 bg-[rgba(13,14,20,0.05)] rounded-xl flex items-end px-2 pb-2 gap-1">
          {[62, 65, 68, 65, 71, 74, 78].map((v, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / 100) * 80}%`, background: '#1B76DC', opacity: i === 6 ? 1 : 0.3 + i * 0.08 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CoachScreen() {
  const plan = [
    { time: '09:00', run: 'Rime + Snowdon', note: 'warmup',      accent: false, dim: false },
    { time: '09:45', run: 'Superstar',       note: 'peak →',     accent: true,  dim: false },
    { time: '10:50', run: '—',              note: 'rest',        accent: false, dim: true  },
    { time: '11:25', run: 'Cascade',         note: '2nd block',  accent: false, dim: false },
    { time: '13:40', run: '—',              note: 'done',        accent: false, dim: true  },
  ];
  return (
    <div className="w-full h-full bg-[#0D0E14] text-white flex flex-col overflow-hidden" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="flex justify-between items-center px-5 pt-14 pb-1 text-[9px] opacity-60">
        <span className="font-semibold">9:41</span>
        <span>●●●● WiFi ▓</span>
      </div>
      <div className="px-4 pt-2 pb-4">
        <p className="text-[19px] font-bold leading-tight">Mountain Coach</p>
        <p className="text-[11px] text-white/35 mt-0.5">Killington · Saturday</p>
      </div>
      <div className="px-4 flex-1">
        <p className="text-[8px] tracking-widest uppercase text-white/20 mb-2">Today's plan</p>
        <div className="border border-white/[0.07] rounded-xl overflow-hidden">
          {plan.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 border-b border-white/[0.04] last:border-0 ${item.dim ? 'py-2 opacity-25' : 'py-3'}`}>
              <span className="text-[10px] font-mono text-white/20 w-8 shrink-0">{item.time}</span>
              <span className={`flex-1 leading-none font-bold ${item.run === '—' ? 'text-[11px] text-white/20' : 'text-[13px] text-white'}`}>{item.run}</span>
              <span className={`text-[10px] shrink-0 ${item.accent ? '' : 'text-white/20'}`} style={item.accent ? { color: '#1B76DC' } : {}}>{item.note}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-white/[0.04] rounded-xl p-3">
          <p className="text-[8px] tracking-widest uppercase text-white/20 mb-1">Coach note</p>
          <p className="text-[11px] text-white/50 leading-snug">Avg fatigue at Killington: run 9.2 — built from 12 prior sessions.</p>
        </div>
      </div>
    </div>
  );
}

function HistoryScreen() {
  return (
    <div className="w-full h-full bg-[#F5F5F3] flex flex-col overflow-hidden" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="flex justify-between items-center px-5 pt-14 pb-1 text-[9px] text-[#0D0E14] opacity-60">
        <span className="font-semibold">9:41</span>
        <span>●●●●</span>
      </div>
      <div className="px-4 pt-2 pb-3">
        <p className="text-[19px] font-bold text-[#0D0E14] leading-tight">Sessions</p>
        <p className="text-[11px] text-[#52546A] mt-0.5">2025–26 season</p>
      </div>
      <div className="px-4 space-y-2 flex-1">
        {[
          { resort: 'Killington', date: 'Jan 18', score: 78, runs: 14, delta: '+3' },
          { resort: 'Stowe',      date: 'Jan 11', score: 74, runs: 11, delta: '+3' },
          { resort: 'Sugarbush',  date: 'Dec 28', score: 71, runs: 9,  delta: '+6' },
          { resort: 'Okemo',      date: 'Dec 20', score: 65, runs: 7,  delta: 'first' },
        ].map(s => (
          <div key={s.date} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={{ boxShadow: '0 1px 3px rgba(13,14,20,0.06)' }}>
            <div>
              <p className="text-[13px] font-bold text-[#0D0E14]">{s.resort}</p>
              <p className="text-[10px] text-[#52546A] mt-0.5">{s.date} · {s.runs} runs</p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-bold leading-none" style={{ color: '#1B76DC' }}>{s.score}</p>
              <p className="text-[10px] text-[#52546A]">{s.delta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO — sky blue radial gradient, centered, partial phone
───────────────────────────────────────────────────────────── */
const HERO_GRADIENT = 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #C6EAFF 35%, #D6FDFF 68%, #B5C5FF 100%)';

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-24" style={{ background: HERO_GRADIENT }}>
      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-[720px] mx-auto pt-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          className="font-display font-bold text-[#0B2039] leading-[0.95] tracking-[-0.02em] mb-6"
          style={{ fontSize: 'clamp(3.2rem, 8vw, 6.4rem)' }}
        >
          Your ski data,<br />finally useful.
        </h1>
        <p className="text-[#0B2039]/55 text-[18px] sm:text-[20px] max-w-[480px] mx-auto leading-[1.65] mb-10">
          SlopeIQ analyzes your Slopes sessions and turns raw numbers
          into a coaching debrief, a SlopeScore, and a day plan
          built around your actual performance.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <AppStoreButton />
          <span className="text-[13px] text-[#0B2039]/35">Free to download</span>
        </div>
      </motion.div>

      {/* Partial phone — rises from bottom edge */}
      <motion.div
        className="relative z-10 flex justify-center"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{ marginTop: 'auto' }}
      >
        {/* Fade out bottom of phone at hero edge */}
        <div className="relative overflow-hidden" style={{ maxHeight: '52vh' }}>
          <IPhone width={280}>
            <DebriefScreen />
          </IPhone>
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, ${HERO_GRADIENT.match(/#B5C5FF/)?.[0] || '#C6EAFF'}, transparent)` }} />
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   TWO PHONES — full reveal of hero phone + score phone
───────────────────────────────────────────────────────────── */
function DoublePhonesSection() {
  return (
    <section className="bg-white py-28 px-6 overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-20">
          <h2
            className="font-display font-bold text-[#0B2039] tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.04 }}
          >
            Everything your session<br />has been trying to tell you.
          </h2>
        </Reveal>

        <div className="flex items-end justify-center gap-6 sm:gap-10">
          <Reveal delay={0.05} className="hidden sm:block" style={{ marginBottom: '-2rem' }}>
            <IPhone width={240}>
              <HistoryScreen />
            </IPhone>
          </Reveal>
          <Reveal delay={0}>
            <IPhone width={290}>
              <DebriefScreen />
            </IPhone>
          </Reveal>
          <Reveal delay={0.1} className="hidden sm:block" style={{ marginBottom: '-3rem' }}>
            <IPhone width={240}>
              <ScoreScreen />
            </IPhone>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURE SECTION — phone + tab switcher
───────────────────────────────────────────────────────────── */
function FeatureBlock({ headline, body, tabs, screens, flip = false, dark = false }) {
  const [active, setActive] = useState(0);

  const bg = dark ? '#0D0E14' : 'white';
  const headColor = dark ? '#EFEFED' : '#0B2039';
  const bodyColor = dark ? 'rgba(239,239,237,0.50)' : '#52546A';
  const tabActive = dark ? 'rgba(239,239,237,0.12)' : 'rgba(13,14,20,0.08)';
  const tabActiveTxt = dark ? '#EFEFED' : '#0B2039';
  const tabTxt = dark ? 'rgba(239,239,237,0.38)' : '#52546A';

  return (
    <section className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Phone */}
        <Reveal className={`flex justify-center ${flip ? 'lg:order-2' : 'lg:order-1'}`}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <IPhone width={270}>
              {screens[active]}
            </IPhone>
          </motion.div>
        </Reveal>

        {/* Text + tabs */}
        <Reveal delay={0.1} className={flip ? 'lg:order-1' : 'lg:order-2'}>
          <h2
            className="font-display font-bold leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', lineHeight: 1.04, color: headColor }}
          >
            {headline}
          </h2>
          <p className="text-[17px] leading-[1.75] mb-10" style={{ color: bodyColor }}>
            {body}
          </p>
          <div className="space-y-2">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200"
                style={{ background: active === i ? tabActive : 'transparent' }}
              >
                <p className="text-[15px] font-semibold transition-colors" style={{ color: active === i ? tabActiveTxt : tabTxt }}>
                  {tab.label}
                </p>
                {active === i && (
                  <p className="text-[13px] mt-1 leading-snug" style={{ color: bodyColor }}>
                    {tab.desc}
                  </p>
                )}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHILOSOPHY — minimal honest text
───────────────────────────────────────────────────────────── */
function PhilosophySection() {
  return (
    <section className="py-28 px-6" style={{ background: '#F5F5F3' }}>
      <div className="max-w-[720px] mx-auto">
        <Reveal>
          <p className="text-[12px] tracking-[0.22em] uppercase mb-8 font-sans" style={{ color: '#1B76DC' }}>Why we built this</p>
          <h2
            className="font-display font-bold text-[#0B2039] mb-8 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1 }}
          >
            Great data was sitting there, completely unread.
          </h2>
          <div className="space-y-5 text-[17px] leading-[1.8]" style={{ color: '#52546A' }}>
            <p>
              The Slopes app captures a huge amount during every ski day —
              speed, vertical, timestamps, run-by-run timing, GPS tracks.
              It was all there. But nobody was doing anything meaningful with it.
              You'd get a summary of how many feet you skied and call it a day.
            </p>
            <p>
              SlopeIQ exists to change that. Not generic tips. Not motivational noise.
              Specific observations about your skiing — grounded in your numbers —
              updated every time you get on the mountain.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CTA — mountain image + download
───────────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="download" ref={ref} className="relative min-h-[75vh] flex items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/mountain.jpg"
          alt="Aerial panorama of the Alps at dawn"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 35%', transform: 'scale(1.18)', opacity: 0.65 }}
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,9,13,0.92) 0%, rgba(8,9,13,0.55) 55%, rgba(8,9,13,0.65) 100%)' }} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 py-24 text-center">
        <Reveal>
          <h2
            className="font-display font-bold text-[#EFEFED] mx-auto mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.94, letterSpacing: '-0.02em', maxWidth: '14ch' }}
          >
            Your runs are talking.
          </h2>
          <p className="text-[#EFEFED]/50 text-[18px] max-w-[340px] mx-auto leading-[1.7] mb-10">
            Free to download. One session on us.
            Upgrade when it clicks.
          </p>
          <AppStoreButton light />
          <p className="text-[#EFEFED]/20 text-[11px] mt-6 tracking-[0.18em] uppercase font-sans">
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
export default function Landing() {
  return (
    <div>
      <HeroSection />

      <DoublePhonesSection />

      <FeatureBlock
        headline={<>Know what<br />happened.</>}
        body="Upload your .slopes file and get a complete breakdown — speed, vertical, run-by-run timing, and seven coaching observations grounded in your exact numbers."
        tabs={[
          { label: 'Session stats', desc: 'Top speed, vertical, ski time, run count — the full picture, instantly.' },
          { label: 'Coached debrief', desc: 'Seven observations per session. Not averages — specific calls about your specific day.' },
          { label: 'Run timeline', desc: 'Every run listed with speed and vertical. See exactly where your day changed.' },
        ]}
        screens={[<DebriefScreen />, <DebriefScreen />, <DebriefScreen />]}
      />

      <FeatureBlock
        flip
        dark
        headline={<>One number,<br />all season.</>}
        body="SlopeScore is 0–100, calibrated to your baseline. It tracks five dimensions of performance across every session and shows you whether you're actually getting better."
        tabs={[
          { label: 'SlopeScore', desc: 'A single number that accounts for consistency, fatigue, vertical, recovery, and speed.' },
          { label: 'Season trend', desc: 'Watch your score move across the whole season. See which days moved it and why.' },
          { label: 'Dimension breakdown', desc: 'Five sub-scores show you where you improved and where you faded.' },
        ]}
        screens={[<ScoreScreen />, <ScoreScreen />, <ScoreScreen />]}
      />

      <FeatureBlock
        headline={<>Your day,<br />before you click in.</>}
        body="Tell the coach where you're skiing. It reads your session history, identifies your fatigue window, and sequences your day around it."
        tabs={[
          { label: 'Day plan', desc: 'A full run sequence built from your historical fatigue pattern at that mountain.' },
          { label: 'Fatigue window', desc: 'Knows exactly when you typically blow up — and plans your rest around it.' },
          { label: 'History-aware', desc: 'The more sessions you upload, the more precise the plan becomes.' },
        ]}
        screens={[<CoachScreen />, <CoachScreen />, <CoachScreen />]}
      />

      <FeatureBlock
        flip
        dark
        headline={<>Every session,<br />saved forever.</>}
        body="Your full season archive, always there. Go back to any day, track your SlopeScore across years, and see exactly how your skiing has changed."
        tabs={[
          { label: 'Session archive', desc: 'Every upload saved permanently. Free sessions clear on next upload — Pro keeps them all.' },
          { label: 'Score history', desc: 'Your SlopeScore timeline across the entire season and beyond.' },
          { label: 'Resort history', desc: 'See how you perform at each mountain over time.' },
        ]}
        screens={[<HistoryScreen />, <HistoryScreen />, <HistoryScreen />]}
      />

      <PhilosophySection />

      <CTASection />
    </div>
  );
}
