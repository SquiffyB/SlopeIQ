import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────────────────────────── */
function Reveal({ children, className, delay = 0, y = 28, style }) {
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

const BLUE = '#1B76DC';
const DARK_BG = '#0D0E14';
const INK = '#0B2039';
const MUTED = '#52546A';

// App light-theme palette (matches the iOS app exactly)
const APP_BG = '#F5F5F3';
const SURF = '#FFFFFF';
const FAINT = '#8A93A3';
const LINE = 'rgba(11,32,57,0.08)';
const SUBTLE = 'rgba(11,32,57,0.04)';
const ACCLT = '#E7F0FB';
const GOOD = '#1B9E6B';

/* ─────────────────────────────────────────────────────────────
   APP STORE BUTTON
───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   iPHONE FRAME
───────────────────────────────────────────────────────────── */
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
   APP CHROME — matches the real app's top date-nav + bottom dock
───────────────────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 pt-3 pb-0.5 text-[9px] font-semibold" style={{ color: INK }}>
      <span>9:41</span>
      <span style={{ color: 'rgba(11,32,57,0.55)' }}>●●● 􀙇</span>
    </div>
  );
}

function AppHeader({ date = 'Feb 14', activeIdx = 3, marked = [1, 3] }) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div style={{ background: APP_BG }}>
      <StatusBar />
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <div className="flex items-center gap-1">
          <span className="text-[18px] font-bold" style={{ color: INK }}>{date}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
        <div className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, border: `1px solid ${LINE}`, background: SUBTLE }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>
        </div>
      </div>
      <div className="flex justify-between px-3 pb-3">
        {days.map((d, i) => {
          const sel = i === activeIdx;
          const has = marked.includes(i);
          const fill = sel || has;
          return (
            <div key={i} className="flex flex-col items-center gap-1" style={{ width: '13.5%' }}>
              <span className="text-[8px] font-semibold" style={{ color: FAINT }}>{d}</span>
              <div className="rounded-full flex items-center justify-center" style={{ width: 22, height: 22, background: fill ? BLUE : 'transparent', border: sel ? `2px solid ${BLUE}` : `1px solid ${LINE}`, opacity: i > activeIdx ? 0.4 : 1 }}>
                {fill && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7" /></svg>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabIcon({ name, color }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      {name === 'debrief' && <><line x1="5" y1="20" x2="5" y2="13" {...p} /><line x1="12" y1="20" x2="12" y2="5" {...p} /><line x1="19" y1="20" x2="19" y2="10" {...p} /></>}
      {name === 'score' && <><circle cx="12" cy="12" r="9" {...p} /><circle cx="12" cy="12" r="4" {...p} /><circle cx="12" cy="12" r="1.4" fill={color} stroke="none" /></>}
      {name === 'coach' && <path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5z" {...p} />}
    </svg>
  );
}

function AppTabBar({ active = 'debrief' }) {
  const tabs = [['debrief', 'Debrief'], ['score', 'Score'], ['coach', 'Coach']];
  return (
    <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 10 }}>
      <div className="flex px-2 py-2 rounded-[22px]" style={{ width: '86%', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 30px rgba(11,32,57,0.16)' }}>
        {tabs.map(([k, label]) => {
          const on = k === active;
          return (
            <div key={k} className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-[16px]" style={{ background: on ? 'rgba(11,32,57,0.06)' : 'transparent' }}>
              <TabIcon name={k} color={on ? BLUE : 'rgba(11,32,57,0.45)'} />
              <span className="text-[9px]" style={{ color: on ? BLUE : 'rgba(11,32,57,0.5)', fontWeight: on ? 700 : 500 }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Phone screen shell — app background, persistent header, floating dock.
function Screen({ active, header = true, children }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: APP_BG, fontFamily: "'Barlow', sans-serif" }}>
      {header ? <AppHeader /> : <StatusBar />}
      <div style={{ paddingBottom: 72 }}>{children}</div>
      <AppTabBar active={active} />
    </div>
  );
}

function ResortHead({ resort = 'Jackson Hole', date = 'February 14, 2024' }) {
  return (
    <div className="px-4 pt-1 pb-2">
      <p className="text-[17px] font-bold leading-tight" style={{ color: INK }}>{resort}</p>
      <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{date}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DEBRIEF SCREENS
───────────────────────────────────────────────────────────── */
function DebriefStats() {
  const stats = [['Avg speed', '23.8', 'mph'], ['Top speed', '47.6', 'mph'], ['Runs', '11', ''], ['Distance', '18.2', 'mi'], ['Lift time', '1h 05m', ''], ['Avg vertical', '1,985', 'ft']];
  return (
    <Screen active="debrief">
      <ResortHead />
      <div className="mx-4 rounded-[18px] p-4 mb-3" style={{ background: BLUE }}>
        <p className="text-[8px] tracking-[0.2em] font-semibold" style={{ color: 'rgba(255,255,255,0.72)' }}>VERTICAL</p>
        <p className="text-[34px] font-extrabold leading-none text-white mt-1">21,840<span className="text-[14px] font-bold"> ft</span></p>
        <div className="flex items-center gap-4 mt-3">
          <div><p className="text-[13px] font-bold text-white leading-none">6,820<span className="text-[8px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}> ft/hr</span></p><p className="text-[8px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Descent rate</p></div>
          <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.25)' }} />
          <div><p className="text-[13px] font-bold text-white leading-none">3:12</p><p className="text-[8px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Ski time · 75%</p></div>
        </div>
      </div>
      <div className="mx-4 grid grid-cols-3 gap-2">
        {stats.map(([l, v, u]) => (
          <div key={l} className="rounded-xl p-2.5" style={{ background: SURF, border: `1px solid ${LINE}` }}>
            <p className="text-[8px] mb-1" style={{ color: MUTED }}>{l}</p>
            <p className="text-[15px] font-bold leading-none" style={{ color: INK }}>{v}<span className="text-[8px] font-semibold ml-0.5" style={{ color: FAINT }}>{u}</span></p>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function DebriefChart() {
  const runs = [2100, 2240, 1980, 2050, 1890, 2010, 1760, 2120, 1950, 1820, 1920];
  const max = Math.max(...runs);
  return (
    <Screen active="debrief">
      <ResortHead />
      <p className="px-4 text-[13px] font-bold mb-2" style={{ color: INK }}>Vertical by run</p>
      <div className="mx-4 rounded-2xl p-3 mb-3" style={{ background: SURF, border: `1px solid ${LINE}` }}>
        <div className="flex items-end justify-between gap-1" style={{ height: 96 }}>
          {runs.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full rounded-t-[3px]" style={{ height: `${(v / max) * 100}%`, background: BLUE }} />
              <span className="text-[7px] mt-1" style={{ color: FAINT }}>{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="px-4 text-[13px] font-bold mb-2" style={{ color: INK }}>Time on mountain</p>
      <div className="mx-4 rounded-2xl p-3" style={{ background: SURF, border: `1px solid ${LINE}` }}>
        <div className="flex h-2.5 rounded-full overflow-hidden">
          <div style={{ flex: 75, background: BLUE }} />
          <div style={{ flex: 25, background: FAINT }} />
        </div>
        <div className="flex gap-4 mt-2.5">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} /><span className="text-[9px]" style={{ color: MUTED }}>Skiing 3:12 · 75%</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: FAINT }} /><span className="text-[9px]" style={{ color: MUTED }}>Lifts 1:05 · 25%</span></div>
        </div>
      </div>
    </Screen>
  );
}

function DebriefTimeline() {
  const runs = [[1, 2100, 22.4, 39.1], [2, 2240, 24.8, 44.2], [3, 1980, 23.1, 41.0], [4, 2050, 25.6, 47.6], [5, 1890, 22.9, 38.7], [6, 2010, 24.2, 42.3], [7, 1760, 21.8, 36.9], [8, 2120, 25.1, 45.8], [9, 1950, 23.7, 40.4]];
  return (
    <Screen active="debrief">
      <ResortHead />
      <p className="px-4 text-[13px] font-bold mb-2" style={{ color: INK }}>Run timeline</p>
      <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: SURF, border: `1px solid ${LINE}` }}>
        <div className="grid px-3 py-2" style={{ gridTemplateColumns: '0.5fr 1fr 1fr 1fr', borderBottom: `1px solid ${LINE}` }}>
          {['RUN', 'VERT (FT)', 'AVG (MPH)', 'TOP (MPH)'].map(hd => <span key={hd} className="text-[7px] tracking-wider font-semibold" style={{ color: FAINT }}>{hd}</span>)}
        </div>
        {runs.map(([n, v, a, t]) => (
          <div key={n} className="grid px-3 py-2 items-center" style={{ gridTemplateColumns: '0.5fr 1fr 1fr 1fr', borderBottom: `1px solid ${SUBTLE}` }}>
            <span className="text-[11px] font-bold" style={{ color: INK }}>{n}</span>
            <span className="text-[11px] font-medium" style={{ color: INK }}>{v.toLocaleString()}</span>
            <span className="text-[11px]" style={{ color: MUTED }}>{a}</span>
            <span className="text-[11px]" style={{ color: MUTED }}>{t}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCORE SCREENS
───────────────────────────────────────────────────────────── */
function ScoreMain() {
  const C = 2 * Math.PI * 52;
  return (
    <Screen active="score">
      <p className="text-center text-[8px] tracking-[0.22em] font-semibold pt-1" style={{ color: BLUE }}>SLOPESCORE</p>
      <p className="text-center text-[15px] font-bold" style={{ color: INK }}>Jackson Hole</p>
      <div className="flex justify-center mt-3">
        <div className="relative flex items-center justify-center" style={{ width: 150, height: 150 }}>
          <svg viewBox="-75 -75 150 150" className="absolute inset-0 w-full h-full">
            <circle cx="0" cy="0" r="52" fill="none" stroke={SUBTLE} strokeWidth="11" />
            <circle cx="0" cy="0" r="52" fill="none" stroke={BLUE} strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * 0.22} transform="rotate(-90)" />
          </svg>
          <div className="text-center z-10"><p className="text-[44px] font-extrabold leading-none" style={{ color: BLUE }}>78</p><p className="text-[10px] font-semibold" style={{ color: FAINT }}>/ 100</p></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-[15px] font-bold" style={{ color: BLUE }}>Strong</span>
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: SUBTLE, color: GOOD }}>↑ +6 vs your average</span>
      </div>
      <div className="mx-4 mt-4 flex rounded-2xl py-3" style={{ background: SURF, border: `1px solid ${LINE}` }}>
        {[['72', 'YOUR AVG'], ['84', 'YOUR BEST'], ['9', 'SESSIONS']].map(([v, l], i, arr) => (
          <div key={l} className="flex-1 text-center" style={{ borderRight: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
            <p className="text-[20px] font-extrabold leading-none" style={{ color: INK }}>{v}</p>
            <p className="text-[8px] tracking-wider font-semibold mt-1" style={{ color: FAINT }}>{l}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function ScoreDimensions() {
  const dims = [['Fatigue resistance', 88], ['Consistency', 79], ['Vertical efficiency', 85], ['Progression', 68], ['Recovery use', 62]];
  const col = (v) => (v >= 80 ? GOOD : v >= 60 ? BLUE : '#D98324');
  return (
    <Screen active="score">
      <p className="text-center text-[8px] tracking-[0.22em] font-semibold pt-1" style={{ color: BLUE }}>SLOPESCORE</p>
      <p className="text-center text-[15px] font-bold" style={{ color: INK }}>Jackson Hole</p>
      <p className="px-4 text-[8px] tracking-widest font-semibold mt-3 mb-2" style={{ color: FAINT }}>DIMENSIONS</p>
      <div className="mx-4 rounded-2xl px-4 py-1" style={{ background: SURF, border: `1px solid ${LINE}` }}>
        {dims.map(([l, v], i) => (
          <div key={l} className="py-2.5" style={{ borderBottom: i < dims.length - 1 ? `1px solid ${SUBTLE}` : 'none' }}>
            <div className="flex justify-between items-center mb-1.5"><span className="text-[12px] font-semibold" style={{ color: INK }}>{l}</span><span className="text-[14px] font-bold" style={{ color: col(v) }}>{v}</span></div>
            <div className="h-1.5 rounded-full" style={{ background: SUBTLE }}><div className="h-full rounded-full" style={{ width: `${v}%`, background: col(v) }} /></div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ─────────────────────────────────────────────────────────────
   COACH SCREENS
───────────────────────────────────────────────────────────── */
function CoachIntro() {
  const starters = ['Plan my optimal day', 'What should I work on?', 'Where does my data say I fade?'];
  return (
    <Screen active="coach">
      <div className="flex flex-col items-center px-5 pt-5">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: ACCLT }}>
          <TabIcon name="coach" color={BLUE} />
        </div>
        <p className="text-[20px] font-extrabold" style={{ color: INK }}>Mountain Coach</p>
        <p className="text-[10px] text-center leading-snug mt-1.5" style={{ color: MUTED }}>I read your sessions — fatigue window, vertical, consistency — and coach from your real numbers. Ask me anything, or start here:</p>
        <div className="w-full mt-4 space-y-2">
          {starters.map(q => (
            <div key={q} className="rounded-xl px-3.5 py-3 text-[12px] font-semibold" style={{ background: SURF, border: `1px solid ${LINE}`, color: INK }}>{q}</div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function CoachPlan() {
  return (
    <Screen active="coach">
      <div className="px-3 pt-3 space-y-2">
        <div className="flex justify-end"><div className="rounded-2xl rounded-br-md px-3 py-2 text-[11px] text-white max-w-[80%]" style={{ background: BLUE }}>Plan my optimal day</div></div>
        <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md px-3 py-2.5 text-[11px] max-w-[90%] leading-snug" style={{ background: SURF, border: `1px solid ${LINE}`, color: INK }}>
          Let's target <b>12 runs and ~23,000 ft</b> — a notch above your Jackson Hole average. Push runs 1–6 while fresh (your 88 fatigue score holds early), break after run 7, then 4 more. Stop by run 12.<br /><br />What are you working on this season?
        </div></div>
      </div>
    </Screen>
  );
}

function CoachWork() {
  return (
    <Screen active="coach">
      <div className="px-3 pt-3 space-y-2">
        <div className="flex justify-end"><div className="rounded-2xl rounded-br-md px-3 py-2 text-[11px] text-white max-w-[80%]" style={{ background: BLUE }}>What should I work on?</div></div>
        <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md px-3 py-2.5 text-[11px] max-w-[90%] leading-snug" style={{ background: SURF, border: `1px solid ${LINE}`, color: INK }}>
          Your consistency sits at <b>79</b> — speed swings most on runs 7–9 as you tire. Tighten the back half: same line, controlled. Hold it and your SlopeScore clears <b>82</b>.
        </div></div>
      </div>
    </Screen>
  );
}

/* ─────────────────────────────────────────────────────────────
   HISTORY SCREENS
───────────────────────────────────────────────────────────── */
function SavedSessions() {
  const sessions = [['Jackson Hole', 'February 14, 2024'], ['Stowe', 'February 7, 2024'], ['Sugarloaf', 'January 29, 2024'], ['Big Sky', 'January 18, 2024']];
  return (
    <Screen active="debrief">
      <p className="px-4 pt-1 text-[18px] font-bold" style={{ color: INK }}>Saved sessions</p>
      <div className="mx-4 mt-2 space-y-2">
        {sessions.map(([r, d]) => (
          <div key={r} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: SURF, border: `1px solid ${LINE}` }}>
            <div><p className="text-[12px] font-bold" style={{ color: INK }}>{r}</p><p className="text-[9px] mt-0.5" style={{ color: MUTED }}>{d}</p></div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={FAINT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function CalendarView() {
  const marked = [3, 7, 12, 18, 22];
  const sel = 14;
  return (
    <Screen active="debrief">
      <p className="px-4 pt-1 text-[16px] font-bold mb-2" style={{ color: INK }}>February 2024</p>
      <div className="mx-4 rounded-2xl p-3" style={{ background: SURF, border: `1px solid ${LINE}` }}>
        <div className="grid grid-cols-7 mb-2">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="text-center text-[8px] font-semibold" style={{ color: FAINT }}>{d}</span>)}</div>
        <div className="grid grid-cols-7 gap-y-1.5">
          {Array.from({ length: 33 }, (_, i) => {
            const day = i - 3;
            if (day < 1 || day > 29) return <div key={i} />;
            const isSel = day === sel;
            const isMarked = marked.includes(day);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="rounded-full flex items-center justify-center" style={{ width: 19, height: 19, background: isSel ? BLUE : 'transparent' }}>
                  <span className="text-[9px]" style={{ color: isSel ? '#fff' : INK, fontWeight: isSel ? 700 : 500 }}>{day}</span>
                </div>
                {isMarked && !isSel ? <div className="rounded-full" style={{ width: 3, height: 3, background: BLUE, marginTop: 1 }} /> : <div style={{ height: 4 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

/* ─────────────────────────────────────────────────────────────
   WHAT SLOPES IS
───────────────────────────────────────────────────────────── */
function WhatSlopesSection() {
  return (
    <section className="py-24 px-6 sm:px-10" style={{ background: '#F0F7FF' }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-[11px] font-semibold uppercase tracking-widest" style={{ background: `${BLUE}18`, color: BLUE }}>
            Works with Slopes App
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold mb-5" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.06, color: INK }}>
                What is Slopes App?
              </h2>
              <p className="text-[17px] leading-[1.75] mb-6" style={{ color: MUTED }}>
                Slopes is the ski tracking app used by millions of skiers to record
                their days on the mountain. It automatically captures your speed,
                vertical, GPS track, and run-by-run timing using your iPhone or Apple Watch.
              </p>
              <p className="text-[17px] leading-[1.75] mb-8" style={{ color: MUTED }}>
                SlopeIQ reads the export file from Slopes and does something Slopes
                doesn't — it tells you what it all means.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://getslopes.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold"
                  style={{ background: BLUE, color: 'white', boxShadow: `0 4px 16px ${BLUE}40` }}>
                  Get Slopes App →
                </a>
                <p className="self-center text-[13px]" style={{ color: MUTED }}>Free on the App Store</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '⛷', title: 'Auto-tracks your runs', body: 'Speed, vertical, GPS, timing — all captured automatically as you ski.' },
                { icon: '⌚', title: 'Apple Watch support', body: 'Track from your wrist. Your iPhone stays in your pocket.' },
                { icon: '📤', title: 'Easy export', body: 'Tap Share → Export .slopes file. Takes about 10 seconds after your session.' },
                { icon: '🔒', title: 'Your data', body: 'SlopeIQ never connects to your Slopes account. You share only what you choose.' },
              ].map(({ icon, title, body }) => (
                <div key={title} className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 8px rgba(13,14,20,0.07)' }}>
                  <p className="text-[20px] mb-2">{icon}</p>
                  <p className="text-[13px] font-bold mb-1" style={{ color: INK }}>{title}</p>
                  <p className="text-[12px] leading-snug" style={{ color: MUTED }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW TO DO IT
───────────────────────────────────────────────────────────── */
function HowToSection() {
  const steps = [
    { n: '01', title: 'Track your day in Slopes', body: 'Open Slopes before your first run. It automatically records speed, vertical, and GPS for every run. No setup. Works with iPhone or Apple Watch.', detail: 'Available free on the App Store' },
    { n: '02', title: 'Export your .slopes file', body: 'After your session, tap the share icon in Slopes and export your session file. Takes about 10 seconds. You can do it on the chairlift.', detail: 'Logbook → Session → Share → Export' },
    { n: '03', title: 'Upload to SlopeIQ', body: 'Drop the file into SlopeIQ. In under 30 seconds you have a full debrief — stats, coaching observations, and your updated SlopeScore.', detail: 'Free insights every session. Pro for score + coach.' },
  ];
  return (
    <section className="py-24 px-6 sm:px-10" style={{ background: 'white' }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2 className="font-display font-bold mb-16" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.04, color: INK }}>
            How it works.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(13,14,20,0.08)' }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="p-8 sm:p-10" style={{ background: 'white' }}>
              <p className="font-display font-bold leading-none mb-7" style={{ fontSize: '3rem', color: 'rgba(13,14,20,0.08)' }}>{s.n}</p>
              <h3 className="font-display font-bold mb-3" style={{ fontSize: '1.4rem', lineHeight: 1.12, color: INK }}>{s.title}</h3>
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
   HERO
───────────────────────────────────────────────────────────── */
const HERO_BG = 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #C6EAFF 35%, #D6FDFF 68%, #B5C5FF 100%)';

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-24" style={{ background: HERO_BG }}>
      <motion.div className="relative z-10 text-center px-6 max-w-[720px] mx-auto pt-12"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="font-display font-bold leading-[0.95] tracking-[-0.02em] mb-6" style={{ fontSize: 'clamp(3.2rem, 8vw, 6.4rem)', color: INK }}>
          Your ski data,<br />finally useful.
        </h1>
        <p className="text-[18px] sm:text-[20px] max-w-[480px] mx-auto leading-[1.65] mb-10" style={{ color: `${INK}88` }}>
          SlopeIQ analyzes your Slopes sessions and turns raw numbers
          into a coaching debrief, a SlopeScore, and a day plan
          built around your actual performance.
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
          <IPhone width={280}><DebriefStats /></IPhone>
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #B5C5FF, transparent)' }} />
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   THREE PHONES
───────────────────────────────────────────────────────────── */
function DoublePhonesSection() {
  return (
    <section className="bg-white py-28 px-6 overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-20">
          <h2 className="font-display font-bold tracking-tight" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.04, color: INK }}>
            Everything your session<br />has been trying to tell you.
          </h2>
        </Reveal>
        <div className="flex items-end justify-center gap-6 sm:gap-10">
          <Reveal delay={0.05} className="hidden sm:block" style={{ marginBottom: '-2rem' }}>
            <IPhone width={235}><SavedSessions /></IPhone>
          </Reveal>
          <Reveal delay={0}>
            <IPhone width={290}><DebriefStats /></IPhone>
          </Reveal>
          <Reveal delay={0.1} className="hidden sm:block" style={{ marginBottom: '-3rem' }}>
            <IPhone width={235}><ScoreMain /></IPhone>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURE BLOCK — phone + tab switcher
───────────────────────────────────────────────────────────── */
function FeatureBlock({ headline, body, tabs, screens, flip = false, tint = false }) {
  const [active, setActive] = useState(0);
  const bg = tint ? APP_BG : 'white';

  return (
    <section className="py-28 px-6" style={{ background: bg }}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal className={`flex justify-center ${flip ? 'lg:order-2' : 'lg:order-1'}`}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <IPhone width={270}>{screens[active]}</IPhone>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        <Reveal delay={0.1} className={flip ? 'lg:order-1' : 'lg:order-2'}>
          <h2 className="font-display font-bold leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', lineHeight: 1.04, color: INK }}>
            {headline}
          </h2>
          <p className="text-[17px] leading-[1.75] mb-8" style={{ color: MUTED }}>{body}</p>
          <div className="space-y-1.5">
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="w-full text-left px-5 py-3.5 rounded-xl transition-all duration-200 border"
                style={{
                  background: active === i ? 'rgba(27,118,220,0.07)' : 'transparent',
                  borderColor: active === i ? `${BLUE}30` : 'transparent',
                }}>
                <p className="text-[14px] font-semibold transition-colors" style={{ color: active === i ? BLUE : MUTED }}>
                  {tab.label}
                </p>
                {active === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="text-[13px] mt-1 leading-snug" style={{ color: MUTED }}>
                    {tab.desc}
                  </motion.p>
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
   PHILOSOPHY
───────────────────────────────────────────────────────────── */
function PhilosophySection() {
  return (
    <section className="py-28 px-6" style={{ background: '#F5F5F3' }}>
      <div className="max-w-[720px] mx-auto">
        <Reveal>
          <p className="text-[12px] tracking-[0.22em] uppercase mb-8 font-sans font-semibold" style={{ color: BLUE }}>Why we built this</p>
          <h2 className="font-display font-bold mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1, color: INK }}>
            Great data was sitting there, completely unread.
          </h2>
          <div className="space-y-5 text-[17px] leading-[1.8]" style={{ color: MUTED }}>
            <p>The Slopes app captures a huge amount during every ski day — speed, vertical, timestamps, run-by-run timing, GPS tracks. It was all there. But nobody was doing anything meaningful with it. You'd get a summary of how many feet you skied and call it a day.</p>
            <p>SlopeIQ exists to change that. Not generic tips. Not motivational noise. Specific observations about your skiing — grounded in your numbers — updated every time you get on the mountain.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CTA
───────────────────────────────────────────────────────────── */
function CTASection() {
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
            Your runs are talking.
          </h2>
          <p className="text-[18px] max-w-[340px] mx-auto leading-[1.7] mb-10" style={{ color: 'rgba(239,239,237,0.50)' }}>
            Free to download. Full session insights on us. Upgrade when it clicks.
          </p>
          <AppStoreButton light />
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
export default function Landing() {
  return (
    <div>
      <HeroSection />
      <DoublePhonesSection />

      <FeatureBlock
        headline={<>Know what<br />happened.</>}
        body="Upload your .slopes file and get a complete picture of your session — a vertical-first breakdown, the stats that matter, and a run-by-run timeline."
        tabs={[
          { label: 'Session stats', desc: 'Vertical, descent rate, ski time, top speed, runs, distance. Every number from your day, instantly.' },
          { label: 'Vertical by run', desc: 'See how much you earned each run, and how your time split between skiing and lifts.' },
          { label: 'Run timeline', desc: 'Every run listed with vertical, average and top speed. The whole day, run by run.' },
        ]}
        screens={[<DebriefStats />, <DebriefChart />, <DebriefTimeline />]}
      />

      <FeatureBlock flip tint
        headline={<>One number,<br />all season.</>}
        body="SlopeScore is 0–100, graded against your own baseline across five performance dimensions. It calibrates as you build history, so it actually means something for you."
        tabs={[
          { label: 'Your SlopeScore', desc: 'A single number — with how today compares to your average, your best, and your session count.' },
          { label: 'Dimension breakdown', desc: 'Five weighted sub-scores: fatigue resistance, consistency, vertical efficiency, progression, recovery.' },
        ]}
        screens={[<ScoreMain />, <ScoreDimensions />]}
      />

      <FeatureBlock
        headline={<>A coach that<br />knows your data.</>}
        body="The AI Mountain Coach reads your real sessions and coaches from them — run count, vertical, fatigue, and what you're working on. Ask anything."
        tabs={[
          { label: 'Ask anything', desc: 'Start from a prompt or type your own. It already knows your numbers — no setup, no generic advice.' },
          { label: 'Plan your day', desc: 'A run-count and vertical plan built around your fatigue window, with break timing and a stop point.' },
          { label: 'What to work on', desc: 'It pinpoints the weak spot in your skiing and tells you exactly how to move the number.' },
        ]}
        screens={[<CoachIntro />, <CoachPlan />, <CoachWork />]}
      />

      <FeatureBlock flip tint
        headline={<>Every session,<br />saved forever.</>}
        body="Your full history, always there. Jump to any day from the calendar, and watch your SlopeScore build across the season."
        tabs={[
          { label: 'Saved sessions', desc: 'Every upload kept and organized by resort and date. Tap any one to reopen the full debrief.' },
          { label: 'Calendar', desc: 'Navigate your whole season by day. Marked days are sessions — tap to jump straight in.' },
        ]}
        screens={[<SavedSessions />, <CalendarView />]}
      />

      <WhatSlopesSection />
      <HowToSection />
      <PhilosophySection />
      <CTASection />
    </div>
  );
}
