import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────────────────────────── */
function Reveal({ children, className, delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
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

const BLUE = '#1B76DC';
const DARK_BG = '#0D0E14';
const LIGHT_BG = '#F5F5F3';
const INK = '#0B2039';
const MUTED = '#52546A';

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
   DEBRIEF SCREENS — three distinct views
───────────────────────────────────────────────────────────── */

// Tab 0: Session stats — big numbers front and center
function DebriefScreenStats() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[11px] text-white/30">← Sessions</p>
        <p className="text-[18px] font-bold mt-1">Killington</p>
        <p className="text-[10px] text-white/30 mt-0.5">Jan 18 · 14 runs · 4h 22m</p>
      </div>
      {/* Stats highlighted */}
      <div className="mx-3 rounded-2xl p-4 mb-3" style={{ background: 'rgba(27,118,220,0.14)', border: `1px solid ${BLUE}40` }}>
        <p className="text-[8px] tracking-widest uppercase mb-3" style={{ color: BLUE }}>Session stats</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[['34.2', 'mph', 'Top speed'], ['18.4k', 'ft', 'Vertical'], ['14', '', 'Runs']].map(([v, u, l]) => (
            <div key={l} className="bg-white/[0.07] rounded-xl p-2.5">
              <p className="text-[17px] font-bold leading-none">{v}<span className="text-[9px] text-white/40 ml-0.5">{u}</span></p>
              <p className="text-[9px] text-white/30 mt-1">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['4:22', 'hr', 'Ski time'], ['3,200', 'ft/hr', 'Vert rate'], ['28.1', 'mph', 'Avg speed']].map(([v, u, l]) => (
            <div key={l} className="bg-white/[0.05] rounded-xl p-2.5">
              <p className="text-[15px] font-bold leading-none">{v}<span className="text-[8px] text-white/35 ml-0.5">{u}</span></p>
              <p className="text-[9px] text-white/25 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-3 bg-white/[0.04] rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[8px] tracking-widest uppercase text-white/20 mb-0.5">SlopeScore</p>
          <p className="text-[26px] font-bold leading-none">78</p>
        </div>
        <p className="text-[15px] font-bold" style={{ color: BLUE }}>+3 ↑</p>
      </div>
    </div>
  );
}

// Tab 1: Coached debrief — observations as the hero
function DebriefScreenCoach() {
  const obs = [
    { icon: '⬇', text: 'Speed dropped 18% between runs 7–10. Classic mid-session fade. Plan a break after run 8.' },
    { icon: '⚡', text: 'Peak vertical rate: 3,200 ft/hr before run 6. Your morning window is your strongest.' },
    { icon: '🎯', text: 'Fatigue window hit at run 9 — matching your 3-session average at this mountain.' },
    { icon: '📈', text: 'Consistency score 72/100. Run length variance is high; longer runs improve it.' },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-white/30">Killington · Jan 18</p>
          <div className="flex gap-3 mt-1">
            {['34.2mph', '18.4k ft', '14 runs'].map(s => (
              <span key={s} className="text-[10px] text-white/40">{s}</span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-white/25 uppercase tracking-wider">Score</p>
          <p className="text-[20px] font-bold" style={{ color: BLUE }}>78</p>
        </div>
      </div>
      {/* Observations highlighted */}
      <div className="mx-3 rounded-2xl p-3 mb-1" style={{ background: 'rgba(27,118,220,0.12)', border: `1px solid ${BLUE}35` }}>
        <p className="text-[8px] tracking-widest uppercase mb-2.5" style={{ color: BLUE }}>Coaching observations · 7 total</p>
        <div className="space-y-2">
          {obs.map((o, i) => (
            <div key={i} className="bg-white/[0.05] rounded-xl p-2.5 flex gap-2">
              <span className="text-[11px] shrink-0 mt-0.5">{o.icon}</span>
              <p className="text-[11px] text-white/60 leading-snug">{o.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tab 2: Run timeline — every run listed
function DebriefScreenTimeline() {
  const runs = [
    { n: 1,  t: '09:02', s: '34.2', v: '1,240', hi: false },
    { n: 2,  t: '09:18', s: '32.8', v: '980',   hi: false },
    { n: 3,  t: '09:35', s: '33.1', v: '1,100', hi: false },
    { n: 4,  t: '09:52', s: '30.4', v: '890',   hi: false },
    { n: 5,  t: '10:12', s: '31.2', v: '1,020', hi: false },
    { n: 6,  t: '10:31', s: '29.8', v: '860',   hi: false },
    { n: 7,  t: '10:52', s: '28.6', v: '780',   hi: false },
    { n: 8,  t: '11:10', s: '27.4', v: '720',   hi: false },
    { n: 9,  t: '11:30', s: '27.8', v: '810',   hi: true  },
    { n: 10, t: '11:52', s: '28.1', v: '750',   hi: false },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[11px] text-white/30">Killington · Jan 18</p>
        <p className="text-[16px] font-bold mt-0.5">Run Timeline</p>
      </div>
      <div className="mx-3 rounded-xl overflow-hidden mb-2" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-4 px-3 py-2 text-[8px] tracking-widest uppercase text-white/20 border-b border-white/[0.05]">
          <span>Run</span><span>Time</span><span>Speed</span><span>Vertical</span>
        </div>
        {runs.map(r => (
          <div key={r.n} className={`grid grid-cols-4 px-3 py-2 border-b border-white/[0.04] last:border-0 ${r.hi ? 'rounded-md' : ''}`}
            style={r.hi ? { background: 'rgba(27,118,220,0.18)' } : {}}>
            <span className="text-[11px] font-bold text-white/60">{r.n}</span>
            <span className="text-[10px] text-white/35">{r.t}</span>
            <span className="text-[11px] font-semibold" style={{ color: r.hi ? BLUE : 'white' }}>{r.s}<span className="text-[8px] text-white/30 ml-0.5">mph</span></span>
            <span className="text-[10px] text-white/45">{r.v}<span className="text-[8px] text-white/25 ml-0.5">ft</span></span>
          </div>
        ))}
      </div>
      <p className="px-4 text-[9px] text-white/20">↑ Run 9 — fatigue window detected</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCORE SCREENS — three distinct views
───────────────────────────────────────────────────────────── */

// Tab 0: The score ring, large
function ScoreScreenGauge() {
  const C = 2 * Math.PI * 52;
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: LIGHT_BG, fontFamily: "'Barlow', sans-serif" }}>
      <StatusBar dark={false} />
      <div className="px-4 pt-1 pb-2">
        <p className="text-[18px] font-bold" style={{ color: INK }}>SlopeScore</p>
        <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>Killington · Jan 18</p>
      </div>
      <div className="flex justify-center my-2">
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
          <svg viewBox="-80 -80 160 160" className="absolute inset-0 w-full h-full">
            <circle cx="0" cy="0" r="52" fill="none" stroke="rgba(13,14,20,0.07)" strokeWidth="9" />
            <circle cx="0" cy="0" r="52" fill="none" stroke={BLUE} strokeWidth="9"
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * 0.22} transform="rotate(-90)" />
            {Array.from({ length: 32 }, (_, i) => {
              const a = (-90 + i * 11.25) * Math.PI / 180;
              return <line key={i} x1={Math.cos(a) * 57} y1={Math.sin(a) * 57} x2={Math.cos(a) * 61} y2={Math.sin(a) * 61} stroke="rgba(13,14,20,0.08)" strokeWidth="1" />;
            })}
          </svg>
          <div className="text-center z-10">
            <p className="text-[42px] font-bold leading-none" style={{ color: INK }}>78</p>
            <p className="text-[12px] font-semibold mt-0.5" style={{ color: BLUE }}>+3 today</p>
          </div>
        </div>
      </div>
      <div className="mx-4 grid grid-cols-2 gap-2 mb-3">
        {[['Season best', '78'], ['Season low', '62'], ['Sessions', '6'], ['Avg score', '72']].map(([l, v]) => (
          <div key={l} className="bg-white rounded-xl p-3" style={{ boxShadow: '0 1px 4px rgba(13,14,20,0.07)' }}>
            <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: MUTED }}>{l}</p>
            <p className="text-[20px] font-bold leading-none" style={{ color: INK }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tab 1: Season trend — full chart
function ScoreScreenTrend() {
  const data = [
    { score: 62, label: 'Dec 15', resort: 'Okemo' },
    { score: 65, label: 'Dec 20', resort: 'Okemo' },
    { score: 68, label: 'Dec 28', resort: 'Sugarbush' },
    { score: 65, label: 'Jan 4',  resort: 'Stowe' },
    { score: 71, label: 'Jan 11', resort: 'Stowe' },
    { score: 74, label: 'Jan 15', resort: 'Killington' },
    { score: 78, label: 'Jan 18', resort: 'Killington' },
  ];
  const max = 90, min = 55;
  const range = max - min;
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: LIGHT_BG, fontFamily: "'Barlow', sans-serif" }}>
      <StatusBar dark={false} />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[18px] font-bold" style={{ color: INK }}>Season Trend</p>
        <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>7 sessions · 2025–26</p>
      </div>
      {/* Chart */}
      <div className="mx-4 bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 1px 6px rgba(13,14,20,0.07)' }}>
        <div className="relative" style={{ height: 100 }}>
          <svg viewBox={`0 0 ${data.length * 36} 100`} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[65, 70, 75, 80].map(v => {
              const y = 100 - ((v - min) / range) * 90;
              return <g key={v}><line x1="0" y1={y} x2={data.length * 36} y2={y} stroke="rgba(13,14,20,0.06)" strokeWidth="1" /><text x="0" y={y - 2} fontSize="7" fill="rgba(13,14,20,0.3)">{v}</text></g>;
            })}
            {/* Line */}
            <polyline
              fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              points={data.map((d, i) => `${i * 36 + 18},${100 - ((d.score - min) / range) * 90}`).join(' ')}
            />
            {/* Area fill */}
            <polygon
              fill={`${BLUE}18`}
              points={[
                ...data.map((d, i) => `${i * 36 + 18},${100 - ((d.score - min) / range) * 90}`),
                `${(data.length - 1) * 36 + 18},100`, `18,100`,
              ].join(' ')}
            />
            {/* Dots */}
            {data.map((d, i) => (
              <circle key={i} cx={i * 36 + 18} cy={100 - ((d.score - min) / range) * 90} r={i === data.length - 1 ? 4.5 : 3}
                fill={i === data.length - 1 ? BLUE : 'white'} stroke={BLUE} strokeWidth="2" />
            ))}
          </svg>
        </div>
        <div className="flex justify-between mt-2">
          {data.map((d, i) => (
            <div key={i} className="text-center" style={{ width: 36 }}>
              <p className="text-[8px] leading-none" style={{ color: i === data.length - 1 ? BLUE : MUTED }}>{d.label.split(' ')[1]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 flex items-center justify-between bg-white rounded-xl px-4 py-3" style={{ boxShadow: '0 1px 4px rgba(13,14,20,0.06)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Season improvement</p>
          <p className="text-[22px] font-bold leading-none" style={{ color: INK }}>+16 pts</p>
        </div>
        <p className="text-[24px] font-bold" style={{ color: BLUE }}>↑</p>
      </div>
    </div>
  );
}

// Tab 2: Dimension breakdown
function ScoreScreenBreakdown() {
  const dims = [
    { label: 'Fatigue Mgmt', v: 88, delta: '+5' },
    { label: 'Consistency',  v: 72, delta: '+2' },
    { label: 'Recovery',     v: 80, delta: '+4' },
    { label: 'Vertical Rate',v: 65, delta: '+1' },
    { label: 'Speed',        v: 62, delta: '—'  },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: LIGHT_BG, fontFamily: "'Barlow', sans-serif" }}>
      <StatusBar dark={false} />
      <div className="px-4 pt-1 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[18px] font-bold" style={{ color: INK }}>Breakdown</p>
          <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>SlopeScore 78 · Jan 18</p>
        </div>
        <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
          <svg viewBox="-26 -26 52 52" className="absolute inset-0 w-full h-full">
            <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(13,14,20,0.07)" strokeWidth="4" />
            <circle cx="0" cy="0" r="20" fill="none" stroke={BLUE} strokeWidth="4"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * 0.22} transform="rotate(-90)" />
          </svg>
          <p className="text-[13px] font-bold z-10" style={{ color: INK }}>78</p>
        </div>
      </div>
      <div className="px-4 flex-1 space-y-3">
        {dims.map(({ label, v, delta }) => (
          <div key={label}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[12px] font-medium" style={{ color: INK }}>{label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px]" style={{ color: MUTED }}>{delta}</span>
                <span className="text-[14px] font-bold" style={{ color: INK }}>{v}</span>
              </div>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(13,14,20,0.07)' }}>
              <div className="h-full rounded-full" style={{ width: `${v}%`, background: v >= 80 ? BLUE : v >= 70 ? `${BLUE}CC` : `${BLUE}88` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 mt-3 bg-white rounded-xl p-3" style={{ boxShadow: '0 1px 4px rgba(13,14,20,0.06)' }}>
        <p className="text-[10px]" style={{ color: MUTED }}>Weakest dimension: <span className="font-semibold" style={{ color: INK }}>Speed (62)</span> — more aggressive run selection could help.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COACH SCREENS — three distinct views
───────────────────────────────────────────────────────────── */

// Tab 0: The day plan board
function CoachScreenPlan() {
  const plan = [
    { time: '09:00', run: 'Rime + Snowdon', note: 'warmup',    accent: false, dim: false },
    { time: '09:45', run: 'Superstar',       note: 'peak →',   accent: true,  dim: false },
    { time: '10:50', run: '—',              note: 'rest',      accent: false, dim: true  },
    { time: '11:25', run: 'Cascade',         note: '2nd block', accent: false, dim: false },
    { time: '13:40', run: '—',              note: 'done',      accent: false, dim: true  },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-4">
        <p className="text-[18px] font-bold">Mountain Coach</p>
        <p className="text-[10px] text-white/30 mt-0.5">Killington · Saturday</p>
      </div>
      <div className="mx-3 flex-1">
        <p className="text-[8px] tracking-widest uppercase text-white/20 mb-2">Today's plan</p>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {plan.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 border-b border-white/[0.04] last:border-0 ${item.dim ? 'py-2 opacity-28' : 'py-3.5'}`}>
              <span className="text-[10px] font-mono text-white/20 w-8 shrink-0">{item.time}</span>
              <span className={`flex-1 leading-none font-bold ${item.run === '—' ? 'text-[11px] text-white/18' : 'text-[13px]'}`}>{item.run}</span>
              <span className="text-[10px] shrink-0" style={{ color: item.accent ? BLUE : 'rgba(255,255,255,0.22)' }}>{item.note}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-white/15 mt-2.5">Built from 12 Killington sessions · avg fatigue: run 9.2</p>
      </div>
    </div>
  );
}

// Tab 1: Fatigue window visualization
function CoachScreenFatigue() {
  const speeds = [34.2, 32.8, 33.1, 30.4, 31.2, 29.8, 28.6, 27.4, 27.8, 28.1];
  const max = 36, min = 24, range = max - min;
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[18px] font-bold">Fatigue Window</p>
        <p className="text-[10px] text-white/30 mt-0.5">Based on 12 Killington sessions</p>
      </div>
      <div className="mx-3 bg-white/[0.05] rounded-2xl p-4 mb-3">
        <p className="text-[8px] tracking-widest uppercase text-white/20 mb-3">Speed over session (Jan 18)</p>
        <div className="relative" style={{ height: 80 }}>
          <svg viewBox={`0 0 ${speeds.length * 24} 80`} className="w-full h-full overflow-visible">
            <rect x={8 * 24} y="0" width={24} height={80} fill={`${BLUE}22`} />
            <polyline fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
              points={speeds.map((s, i) => `${i * 24 + 12},${80 - ((s - min) / range) * 70}`).join(' ')} />
            {speeds.map((s, i) => (
              <circle key={i} cx={i * 24 + 12} cy={80 - ((s - min) / range) * 70} r={i === 8 ? 4 : 2.5}
                fill={i === 8 ? BLUE : 'rgba(255,255,255,0.6)'} />
            ))}
            <text x={8 * 24 + 2} y={12} fontSize="7" fill={`${BLUE}CC`}>fatigue</text>
          </svg>
        </div>
        <div className="flex justify-between mt-1">
          {[1,2,3,4,5,6,7,8,'9↑',10].map((r, i) => (
            <span key={i} className="text-[8px] text-center" style={{ width: 24, color: i === 8 ? BLUE : 'rgba(255,255,255,0.2)' }}>{r}</span>
          ))}
        </div>
      </div>
      <div className="mx-3 space-y-2">
        <div className="bg-white/[0.05] rounded-xl p-3 flex justify-between items-center">
          <span className="text-[12px] text-white/50">Avg onset</span>
          <span className="text-[18px] font-bold" style={{ color: BLUE }}>Run 9.2</span>
        </div>
        <div className="bg-white/[0.05] rounded-xl p-3 flex justify-between items-center">
          <span className="text-[12px] text-white/50">Speed drop</span>
          <span className="text-[18px] font-bold text-white">–18%</span>
        </div>
        <div className="bg-white/[0.05] rounded-xl p-3">
          <p className="text-[11px] text-white/45 leading-snug">Today's plan puts a rest at run 9 — before your window hits.</p>
        </div>
      </div>
    </div>
  );
}

// Tab 2: Session history powering the plan
function CoachScreenHistory() {
  const sessions = [
    { resort: 'Killington', n: 12, fatigue: 9.2, peak: '09:45–11:00' },
    { resort: 'Stowe',      n: 8,  fatigue: 8.5, peak: '09:30–10:45' },
    { resort: 'Sugarbush',  n: 5,  fatigue: 10.1, peak: '10:00–11:30' },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: DARK_BG, fontFamily: "'Barlow', sans-serif", color: 'white' }}>
      <StatusBar dark />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[18px] font-bold">History Powering Plan</p>
        <p className="text-[10px] text-white/30 mt-0.5">25 sessions · 3 resorts</p>
      </div>
      <div className="mx-3 flex-1 space-y-2">
        <p className="text-[8px] tracking-widest uppercase text-white/20 mb-1">Resorts analyzed</p>
        {sessions.map(s => (
          <div key={s.resort} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[13px] font-bold">{s.resort}</p>
              <span className="text-[10px] text-white/30">{s.n} sessions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[8px] text-white/25 uppercase tracking-wider mb-0.5">Fatigue onset</p>
                <p className="text-[13px] font-semibold" style={{ color: BLUE }}>Run {s.fatigue}</p>
              </div>
              <div>
                <p className="text-[8px] text-white/25 uppercase tracking-wider mb-0.5">Peak window</p>
                <p className="text-[11px] font-semibold text-white/70">{s.peak}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-xl p-3" style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30` }}>
          <p className="text-[11px] text-white/50 leading-snug">More uploads = more precise plans. Every session refines your profile.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HISTORY SCREENS — three distinct views
───────────────────────────────────────────────────────────── */

// Tab 0: Session archive list
function HistoryScreenArchive() {
  const sessions = [
    { resort: 'Killington', date: 'Jan 18', score: 78, runs: 14, delta: '+3' },
    { resort: 'Stowe',      date: 'Jan 11', score: 74, runs: 11, delta: '+3' },
    { resort: 'Sugarbush',  date: 'Dec 28', score: 71, runs: 9,  delta: '+6' },
    { resort: 'Okemo',      date: 'Dec 20', score: 65, runs: 7,  delta: 'first' },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: LIGHT_BG, fontFamily: "'Barlow', sans-serif" }}>
      <StatusBar dark={false} />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[18px] font-bold" style={{ color: INK }}>Sessions</p>
        <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>2025–26 season · 6 uploads</p>
      </div>
      <div className="px-4 space-y-2">
        {sessions.map(s => (
          <div key={s.date} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={{ boxShadow: '0 1px 3px rgba(13,14,20,0.06)' }}>
            <div>
              <p className="text-[13px] font-bold" style={{ color: INK }}>{s.resort}</p>
              <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{s.date} · {s.runs} runs</p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-bold leading-none" style={{ color: BLUE }}>{s.score}</p>
              <p className="text-[10px]" style={{ color: MUTED }}>{s.delta}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[9px] mt-3" style={{ color: MUTED }}>All sessions saved · Pro plan</p>
    </div>
  );
}

// Tab 1: Score progression chart
function HistoryScreenScoreHistory() {
  const data = [62, 65, 68, 65, 71, 74, 78];
  const labels = ['D15', 'D20', 'D28', 'J4', 'J11', 'J15', 'J18'];
  const max = 85, min = 55, range = max - min;
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: LIGHT_BG, fontFamily: "'Barlow', sans-serif" }}>
      <StatusBar dark={false} />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[18px] font-bold" style={{ color: INK }}>Score History</p>
        <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>62 → 78 this season</p>
      </div>
      {/* Big chart */}
      <div className="mx-4 bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 1px 6px rgba(13,14,20,0.07)' }}>
        <div className="relative" style={{ height: 120 }}>
          <svg viewBox={`0 0 ${data.length * 30} 120`} className="w-full h-full overflow-visible">
            {[65, 70, 75, 80].map(v => {
              const y = 120 - ((v - min) / range) * 110;
              return <line key={v} x1="0" y1={y} x2={data.length * 30} y2={y} stroke="rgba(13,14,20,0.06)" strokeWidth="0.8" />;
            })}
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity="0.18" />
                <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon fill="url(#scoreGrad)"
              points={[
                ...data.map((v, i) => `${i * 30 + 15},${120 - ((v - min) / range) * 110}`),
                `${(data.length - 1) * 30 + 15},120`, `15,120`,
              ].join(' ')} />
            <polyline fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
              points={data.map((v, i) => `${i * 30 + 15},${120 - ((v - min) / range) * 110}`).join(' ')} />
            {data.map((v, i) => (
              <circle key={i} cx={i * 30 + 15} cy={120 - ((v - min) / range) * 110}
                r={i === data.length - 1 ? 5 : 3.5}
                fill={i === data.length - 1 ? BLUE : 'white'} stroke={BLUE} strokeWidth="2" />
            ))}
          </svg>
        </div>
        <div className="flex justify-between mt-1">
          {labels.map((l, i) => (
            <span key={i} className="text-[8px] text-center" style={{ width: 30, color: i === data.length - 1 ? BLUE : MUTED }}>{l}</span>
          ))}
        </div>
      </div>
      <div className="mx-4 grid grid-cols-3 gap-2">
        {[['Current', '78', false], ['Season best', '78', false], ['Gain', '+16', true]].map(([l, v, accent]) => (
          <div key={l} className="bg-white rounded-xl p-3 text-center" style={{ boxShadow: '0 1px 3px rgba(13,14,20,0.06)' }}>
            <p className="text-[8px] uppercase tracking-wider mb-1" style={{ color: MUTED }}>{l}</p>
            <p className="text-[18px] font-bold leading-none" style={{ color: accent ? BLUE : INK }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tab 2: Resort breakdown
function HistoryScreenResort() {
  const resorts = [
    { name: 'Killington', sessions: 12, best: 78, avg: 74 },
    { name: 'Stowe',      sessions: 8,  best: 74, avg: 70 },
    { name: 'Sugarbush',  sessions: 5,  best: 71, avg: 68 },
    { name: 'Okemo',      sessions: 3,  best: 65, avg: 64 },
  ];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: LIGHT_BG, fontFamily: "'Barlow', sans-serif" }}>
      <StatusBar dark={false} />
      <div className="px-4 pt-1 pb-3">
        <p className="text-[18px] font-bold" style={{ color: INK }}>By Resort</p>
        <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>4 mountains · 28 sessions</p>
      </div>
      <div className="px-4 space-y-2">
        {resorts.map((r, i) => (
          <div key={r.name} className="bg-white rounded-xl p-3.5" style={{ boxShadow: '0 1px 3px rgba(13,14,20,0.06)', borderLeft: i === 0 ? `3px solid ${BLUE}` : '3px solid transparent' }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[13px] font-bold" style={{ color: INK }}>{r.name}</p>
              <span className="text-[9px]" style={{ color: MUTED }}>{r.sessions} sessions</span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Best</p>
                <p className="text-[16px] font-bold leading-none" style={{ color: i === 0 ? BLUE : INK }}>{r.best}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Avg</p>
                <p className="text-[16px] font-bold leading-none" style={{ color: MUTED }}>{r.avg}</p>
              </div>
              <div className="flex-1">
                <p className="text-[8px] uppercase tracking-wider mb-1" style={{ color: MUTED }}>Trend</p>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(13,14,20,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${r.best}%`, background: i === 0 ? BLUE : `${BLUE}70` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
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
              <h2
                className="font-display font-bold mb-5"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.06, color: INK }}
              >
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
   HOW TO DO IT — three steps
───────────────────────────────────────────────────────────── */
function HowToSection() {
  const steps = [
    {
      n: '01',
      title: 'Track your day in Slopes',
      body: 'Open Slopes before your first run. It automatically records speed, vertical, and GPS for every run. No setup. Works with iPhone or Apple Watch.',
      detail: 'Available free on the App Store',
    },
    {
      n: '02',
      title: 'Export your .slopes file',
      body: 'After your session, tap the share icon in Slopes and export your session file. Takes about 10 seconds. You can do it on the chairlift.',
      detail: 'Logbook → Session → Share → Export',
    },
    {
      n: '03',
      title: 'Upload to SlopeIQ',
      body: 'Drop the file into SlopeIQ. In under 30 seconds you have a full debrief — stats, coaching observations, and your updated SlopeScore.',
      detail: 'Free for one session. Pro for the full season.',
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-10" style={{ background: 'white' }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold mb-16"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.04, color: INK }}
          >
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
          <IPhone width={280}><DebriefScreenStats /></IPhone>
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
            <IPhone width={235}><HistoryScreenArchive /></IPhone>
          </Reveal>
          <Reveal delay={0}>
            <IPhone width={290}><DebriefScreenCoach /></IPhone>
          </Reveal>
          <Reveal delay={0.1} className="hidden sm:block" style={{ marginBottom: '-3rem' }}>
            <IPhone width={235}><ScoreScreenGauge /></IPhone>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURE BLOCK — phone + tab switcher
───────────────────────────────────────────────────────────── */
function FeatureBlock({ headline, body, tabs, screens, flip = false, dark = false }) {
  const [active, setActive] = useState(0);
  const bg = dark ? DARK_BG : 'white';
  const headColor = dark ? '#EFEFED' : INK;
  const bodyColor = dark ? 'rgba(239,239,237,0.48)' : MUTED;

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
            style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', lineHeight: 1.04, color: headColor }}>
            {headline}
          </h2>
          <p className="text-[17px] leading-[1.75] mb-8" style={{ color: bodyColor }}>{body}</p>
          <div className="space-y-1.5">
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="w-full text-left px-5 py-3.5 rounded-xl transition-all duration-200 border"
                style={{
                  background: active === i ? (dark ? 'rgba(239,239,237,0.10)' : 'rgba(27,118,220,0.07)') : 'transparent',
                  borderColor: active === i ? (dark ? 'rgba(239,239,237,0.12)' : `${BLUE}30`) : 'transparent',
                }}>
                <p className="text-[14px] font-semibold transition-colors"
                  style={{ color: active === i ? (dark ? '#EFEFED' : BLUE) : bodyColor }}>
                  {tab.label}
                </p>
                {active === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="text-[13px] mt-1 leading-snug" style={{ color: bodyColor }}>
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
            Free to download. One session on us. Upgrade when it clicks.
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
        body="Upload your .slopes file and get a complete picture of your session — stats, coaching observations, and a run-by-run timeline."
        tabs={[
          { label: 'Session stats', desc: 'Top speed, vertical, ski time, run count, vertical rate. Every number from your day, instantly.' },
          { label: 'Coached debrief', desc: 'Seven observations per session grounded in your exact numbers. Not averages — your specific day.' },
          { label: 'Run timeline', desc: 'Every run listed with speed and vertical. See exactly when your speed dropped — and by how much.' },
        ]}
        screens={[<DebriefScreenStats />, <DebriefScreenCoach />, <DebriefScreenTimeline />]}
      />

      <FeatureBlock flip dark
        headline={<>One number,<br />all season.</>}
        body="SlopeScore is 0–100, calibrated to your baseline across five performance dimensions. Track whether you're actually improving."
        tabs={[
          { label: 'SlopeScore', desc: 'A single number accounting for consistency, fatigue, vertical, recovery, and speed.' },
          { label: 'Season trend', desc: 'Your SlopeScore charted across every session this season. See the arc of your improvement.' },
          { label: 'Dimension breakdown', desc: 'Five sub-scores show where you improved and where you faded. Weakest link identified.' },
        ]}
        screens={[<ScoreScreenGauge />, <ScoreScreenTrend />, <ScoreScreenBreakdown />]}
      />

      <FeatureBlock
        headline={<>Your day,<br />before you click in.</>}
        body="Tell the coach where you're skiing. It reads your history, finds your fatigue pattern, and sequences your day around it."
        tabs={[
          { label: 'Day plan', desc: 'A full run sequence — warmup, peak window, rest, second block — built from your real fatigue data.' },
          { label: 'Fatigue window', desc: 'The exact run number where your speed historically drops. Visualized from your session history.' },
          { label: 'History-aware', desc: 'Every resort you upload from builds a separate profile. Plans get sharper with each session.' },
        ]}
        screens={[<CoachScreenPlan />, <CoachScreenFatigue />, <CoachScreenHistory />]}
      />

      <FeatureBlock flip dark
        headline={<>Every session,<br />saved forever.</>}
        body="Your full season archive, always there. Go back to any day, track your score across years, see how you ski at each mountain."
        tabs={[
          { label: 'Session archive', desc: 'Every upload saved permanently. Free clears on next upload — Pro keeps them all, forever.' },
          { label: 'Score history', desc: 'Your SlopeScore plotted across the full season. 62 to 78 in six sessions.' },
          { label: 'Resort history', desc: 'Performance grouped by mountain. Best score, average, fatigue patterns per resort.' },
        ]}
        screens={[<HistoryScreenArchive />, <HistoryScreenScoreHistory />, <HistoryScreenResort />]}
      />

      <WhatSlopesSection />
      <HowToSection />
      <PhilosophySection />
      <CTASection />
    </div>
  );
}
