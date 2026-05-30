import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/* ── Shared helpers ──────────────────────────────────────────── */
function InView({ children, className, delay = 0, y = 32 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-accent font-mono">
      <span className="w-1 h-1 rounded-full bg-accent inline-block" />
      {children}
    </span>
  );
}

/* ── Ski Binding SVG Animation ───────────────────────────────── */
/*
  Coordinate system: 0,0 at center. All part centers defined here.
  Animation phases driven by scroll progress (0→1 over 280vh):
    0.00–0.08  : headline fades in
    0.08–0.40  : binding explodes outward, labels appear
    0.40–0.72  : labels fade out, parts arc into ring positions
    0.72–1.00  : ring completes, SlopeScore text fades in
*/

const RING_R = 108; // ring radius in SVG units
const RING_ANGLES = Array.from({ length: 7 }, (_, i) => -90 + i * (360 / 7));
const RING_POS = RING_ANGLES.map(deg => {
  const rad = (deg * Math.PI) / 180;
  return { x: +(RING_R * Math.cos(rad)).toFixed(1), y: +(RING_R * Math.sin(rad)).toFixed(1) };
});

// Each part: cx/cy = assembled SVG center, ex/ey/er = explode offset, label
const BINDING_PARTS = [
  {
    id: 'toe-cap',
    cx: 0, cy: -118,
    render: () => (
      <path
        d="M-38,-14 L-18,-24 L18,-24 L38,-14 L38,14 L-38,14 Z"
        fill="#090C14" rx="3"
      />
    ),
    ex: 18, ey: -90, er: 8,
    label: 'SlopeScore', labelAnchor: 'start', lx: 46, ly: 0,
    ringIdx: 0,
  },
  {
    id: 'toe-body',
    cx: 0, cy: -76,
    render: () => (
      <>
        <rect x="-54" y="-22" width="108" height="44" rx="8" fill="#141C2E" />
        <rect x="-38" y="-14" width="76" height="28" rx="5" fill="#1E2B42" />
        <circle cx="28" cy="0" r="7" fill="#0057FF" opacity="0.25" />
        <circle cx="28" cy="0" r="3.5" fill="#0057FF" opacity="0.6" />
      </>
    ),
    ex: -105, ey: -26, er: -18,
    label: 'Run Analysis', labelAnchor: 'end', lx: -62, ly: 0,
    ringIdx: 1,
  },
  {
    id: 'spine',
    cx: 0, cy: -20,
    render: () => (
      <>
        <rect x="-9" y="-44" width="18" height="88" rx="5" fill="#2D3A50" />
        <rect x="-5" y="-22" width="10" height="44" rx="3" fill="#3D4F6A" />
      </>
    ),
    ex: 8, ey: 0, er: 0,
    label: 'Session Debrief', labelAnchor: 'start', lx: 20, ly: 0,
    ringIdx: 2,
  },
  {
    id: 'heel-body',
    cx: 0, cy: 42,
    render: () => (
      <>
        <rect x="-50" y="-22" width="100" height="44" rx="8" fill="#141C2E" />
        <rect x="-36" y="-14" width="72" height="28" rx="5" fill="#1E2B42" />
      </>
    ),
    ex: 100, ey: 30, er: 12,
    label: 'Mountain Coach', labelAnchor: 'start', lx: 58, ly: 0,
    ringIdx: 3,
  },
  {
    id: 'heel-lever',
    cx: 0, cy: 92,
    render: () => (
      <path
        d="M-28,-10 L28,-10 L28,10 L10,10 L10,24 L-10,24 L-10,10 L-28,10 Z"
        fill="#090C14"
      />
    ),
    ex: 0, ey: 105, er: -6,
    label: 'Fatigue Window', labelAnchor: 'end', lx: -36, ly: 26,
    ringIdx: 4,
  },
  {
    id: 'brake-l',
    cx: -52, cy: 72,
    render: () => (
      <g transform="rotate(-28)">
        <rect x="-7" y="-26" width="14" height="52" rx="4" fill="#2D3A50" />
        <circle cx="0" cy="26" r="5" fill="#1E2B42" />
      </g>
    ),
    ex: -108, ey: -8, er: -30,
    label: 'Consistency', labelAnchor: 'end', lx: -22, ly: 0,
    ringIdx: 5,
  },
  {
    id: 'brake-r',
    cx: 52, cy: 72,
    render: () => (
      <g transform="rotate(28)">
        <rect x="-7" y="-26" width="14" height="52" rx="4" fill="#2D3A50" />
        <circle cx="0" cy="26" r="5" fill="#1E2B42" />
      </g>
    ),
    ex: 108, ey: -8, er: 30,
    label: 'Progression', labelAnchor: 'start', lx: 22, ly: 0,
    ringIdx: 6,
  },
];

// Compute ring deltas: where each part must move to reach its ring position
BINDING_PARTS.forEach(p => {
  const ring = RING_POS[p.ringIdx];
  p.rx = +(ring.x - p.cx).toFixed(1);
  p.ry = +(ring.y - p.cy).toFixed(1);
});

function BindingPart({ part, progress }) {
  const s = part.ringIdx * 0.012; // stagger

  const x = useTransform(progress,
    [0 + s, 0.30 + s, 0.68 + s, 1],
    [0, part.ex, part.rx, part.rx]
  );
  const y = useTransform(progress,
    [0 + s, 0.30 + s, 0.68 + s, 1],
    [0, part.ey, part.ry, part.ry]
  );
  const rotate = useTransform(progress,
    [0 + s, 0.30 + s, 0.68 + s, 1],
    [0, part.er, 0, 0]
  );
  // Labels fade in during explosion, out before ring
  const labelOpacity = useTransform(progress,
    [0.18 + s, 0.32 + s, 0.50, 0.62],
    [0, 1, 1, 0]
  );

  return (
    <motion.g style={{ x, y }} transform={`translate(${part.cx},${part.cy})`}>
      <motion.g style={{ rotate, transformOrigin: '0px 0px' }}>
        {part.render()}
        {/* Label */}
        <motion.g style={{ opacity: labelOpacity }}>
          <line
            x1={part.lx > 0 ? 14 : -14} y1={part.ly}
            x2={part.lx} y2={part.ly}
            stroke="#0057FF" strokeWidth="0.8" strokeDasharray="2 2"
          />
          <text
            x={part.lx + (part.labelAnchor === 'start' ? 4 : -4)}
            y={part.ly + 4}
            fill="#0057FF"
            fontSize="9"
            fontWeight="600"
            fontFamily="Space Mono, monospace"
            textAnchor={part.labelAnchor}
            letterSpacing="0.08em"
          >
            {part.label.toUpperCase()}
          </text>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

// Ring dot must be its own component so hooks aren't called inside a map
function RingDot({ cx, cy, progress, i }) {
  const opacity = useTransform(progress, [0.72 + i * 0.01, 0.82 + i * 0.01], [0, 1]);
  return <motion.circle cx={cx} cy={cy} r="3.5" fill="#0057FF" style={{ opacity }} />;
}

function BindingScene({ progress }) {
  const circumference  = +(2 * Math.PI * RING_R).toFixed(1); // ≈ 678.6
  const ringOpacity    = useTransform(progress, [0.63, 0.80], [0, 1]);
  const ringScale      = useTransform(progress, [0.63, 0.80], [0.88, 1]);
  const scoreOpacity   = useTransform(progress, [0.80, 0.94], [0, 1]);
  const ringDashOffset = useTransform(progress, [0.63, 0.88], [circumference, 0]);
  const pathLength     = useTransform(progress, [0.63, 0.88], [0, 1]);

  return (
    <svg
      viewBox="-175 -175 350 350"
      className="w-full max-w-[420px] mx-auto"
      aria-hidden="true"
    >
      {/* Crosshair & outer reference circle — data aesthetic */}
      <line x1="-160" y1="0" x2="160" y2="0" stroke="rgba(0,87,255,0.05)" strokeWidth="0.5" />
      <line x1="0" y1="-160" x2="0" y2="160" stroke="rgba(0,87,255,0.05)" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="160" stroke="rgba(0,87,255,0.04)" strokeWidth="0.5" fill="none" />

      {/* Assembling ring group */}
      <motion.g style={{ opacity: ringOpacity, scale: ringScale, transformOrigin: '0px 0px' }}>
        {/* Ghost ring track */}
        <circle cx="0" cy="0" r={RING_R} fill="none" stroke="rgba(0,87,255,0.09)" strokeWidth="1.5" />
        {/* Animated ring arc */}
        <motion.circle
          cx="0" cy="0" r={RING_R}
          fill="none"
          stroke="#0057FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: ringDashOffset,
            rotate: -90,
            transformOrigin: '0px 0px',
          }}
        />
        {/* One dot per ring position — each is its own component so hooks are legal */}
        {RING_POS.map((pos, i) => (
          <RingDot key={i} cx={pos.x} cy={pos.y} progress={progress} i={i} />
        ))}
      </motion.g>

      {/* Binding parts */}
      {BINDING_PARTS.map(part => (
        <BindingPart key={part.id} part={part} progress={progress} />
      ))}

      {/* Score display — fades in after ring forms */}
      <motion.g style={{ opacity: scoreOpacity }}>
        <text
          x="0" y="-14"
          textAnchor="middle"
          fill="#0057FF"
          fontSize="10"
          fontFamily="Space Mono, monospace"
          fontWeight="400"
          letterSpacing="0.22em"
        >
          SLOPESCORE
        </text>
        <text
          x="0" y="26"
          textAnchor="middle"
          fill="#090C14"
          fontSize="46"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="700"
          letterSpacing="-3"
        >
          78
        </text>
        <text
          x="0" y="46"
          textAnchor="middle"
          fill="rgba(9,12,20,0.30)"
          fontSize="9"
          fontFamily="Space Mono, monospace"
          letterSpacing="0.16em"
        >
          PRO ONLY
        </text>
      </motion.g>
    </svg>
  );
}

/* ── Hero Section ────────────────────────────────────────────── */
function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the raw scroll
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.5 });

  // Headline transforms
  const headlineY       = useTransform(progress, [0, 0.5], [0, -60]);
  const headlineOpacity = useTransform(progress, [0, 0.08, 0.42], [0, 1, 0]);
  const subOpacity      = useTransform(progress, [0.04, 0.12, 0.38], [0, 1, 0]);
  const ctaOpacity      = useTransform(progress, [0.06, 0.16, 0.36], [0, 1, 0]);

  // Post-ring tag line
  const tagOpacity = useTransform(progress, [0.82, 0.94], [0, 1]);
  const tagY       = useTransform(progress, [0.82, 0.94], [20, 0]);

  const navigate = useNavigate();

  return (
    <div ref={containerRef} style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center bg-bg">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,87,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,87,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,87,255,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Headline */}
        <motion.div
          className="absolute top-[18%] left-0 right-0 text-center px-6 z-10"
          style={{ y: headlineY }}
        >
          <motion.p
            className="eyebrow mb-5"
            style={{ opacity: headlineOpacity }}
          >
            Know your mountain
          </motion.p>
          <motion.h1
            className="text-[48px] sm:text-[64px] lg:text-[76px] font-bold tracking-[-0.03em] text-ink leading-[1.02] max-w-[720px] mx-auto"
            style={{ opacity: headlineOpacity }}
          >
            Performance data,<br />
            <span style={{ color: '#0057FF' }}>precisely</span> understood.
          </motion.h1>
          <motion.p
            className="mt-5 text-muted text-[18px] max-w-[460px] mx-auto leading-relaxed"
            style={{ opacity: subOpacity }}
          >
            SlopeIQ turns your Slopes sessions into structured,
            actionable insight. Upload a session. See what it means.
          </motion.p>
          <motion.div
            className="mt-8 flex items-center justify-center gap-3 flex-wrap"
            style={{ opacity: ctaOpacity }}
          >
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary"
            >
              Upload free
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="btn-ghost"
            >
              How it works →
            </button>
          </motion.div>
        </motion.div>

        {/* Binding animation */}
        <div className="relative z-0 w-full flex items-center justify-center mt-12 sm:mt-0">
          <BindingScene progress={progress} />
        </div>

        {/* Post-ring CTA */}
        <motion.div
          className="absolute bottom-[10%] left-0 right-0 flex flex-col items-center gap-3"
          style={{ opacity: tagOpacity, y: tagY }}
        >
          <p className="text-muted text-[14px]">Your skiing has data. Start using it.</p>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Create your free account
          </button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: useTransform(progress, [0, 0.12], [1, 0]) }}
        >
          <span className="text-[11px] font-mono tracking-widest text-muted uppercase">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Divider line ────────────────────────────────────────────── */
function SectionDivider() {
  return <div className="h-px bg-line mx-0" />;
}

/* ── Free vs Pro Section ─────────────────────────────────────── */
function TierSection() {
  return (
    <section className="bg-bg py-28 px-6">
      <div className="max-w-[1100px] mx-auto">
        <InView>
          <Tag>Two tiers</Tag>
          <h2 className="mt-4 text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] text-ink leading-[1.06]">
            Two ways to know<br />your mountain.
          </h2>
        </InView>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <InView delay={0.05}>
            <div className="rounded-3xl border border-line bg-surface p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[12px] font-mono tracking-[0.18em] uppercase text-muted-2">Free</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-elevated text-muted-2 uppercase tracking-wider font-mono">$0</span>
              </div>
              <h3 className="text-[26px] font-bold text-ink tracking-tight mb-3">Your session, unfiltered.</h3>
              <p className="text-muted text-[15px] leading-relaxed mb-8 flex-1">
                Upload your <code className="text-[13px] bg-elevated px-1.5 py-0.5 rounded font-mono">.slopes</code> file and get the raw numbers: speed, vertical, run count, distance. No interpretation, no coaching — just your data, clearly presented.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  ['Session stats', 'Speed, vertical, distance, runs'],
                  ['Run-by-run breakdown', 'Every run in the session'],
                  ['Basic math observations', 'Fastest run, longest run, averages'],
                  ['One session at a time', 'No history — data clears on next upload'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-elevated flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="#090C14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{title}</p>
                      <p className="text-[13px] text-muted-2">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto space-y-2 border-t border-line pt-6">
                {['SlopeScore', 'AI coaching', 'Session history'].map(f => (
                  <div key={f} className="flex gap-2 items-center">
                    <span className="w-4 h-4 rounded-full bg-elevated flex items-center justify-center shrink-0">
                      <span className="w-2 h-0.5 bg-muted-2/50 rounded" />
                    </span>
                    <span className="text-[13px] text-muted-2 line-through opacity-50">{f}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup" className="btn-ghost text-center mt-8 block">Start free</Link>
            </div>
          </InView>

          {/* Pro */}
          <InView delay={0.12}>
            <div
              className="rounded-3xl border p-8 h-full flex flex-col relative overflow-hidden"
              style={{
                borderColor: 'rgba(0,87,255,0.25)',
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F0F5FF 100%)',
                boxShadow: '0 0 0 1.5px rgba(0,87,255,0.15), 0 20px 60px rgba(0,87,255,0.10)',
              }}
            >
              {/* accent strip */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

              <div className="flex items-center justify-between mb-6">
                <span className="text-[12px] font-mono tracking-[0.18em] uppercase text-accent">Pro</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent text-white uppercase tracking-wider font-mono">$10 / mo</span>
              </div>
              <h3 className="text-[26px] font-bold text-ink tracking-tight mb-3">Your season, coached.</h3>
              <p className="text-muted text-[15px] leading-relaxed mb-8 flex-1">
                Everything in Free, plus a data-driven debrief on every session, a SlopeScore that tracks your performance across the season, an AI mountain coach, and permanent session history.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  ['Everything in Free', null],
                  ['SlopeScore', '0–100 performance rating, calibrated to you'],
                  ['Coached session debrief', '7 data-grounded observations per upload'],
                  ['Mountain Coach', 'AI plans your day based on your session history'],
                  ['Full session history', 'Every session saved — revisit any time'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{title}</p>
                      {desc && <p className="text-[13px] text-muted-2">{desc}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/pricing"
                className="btn-primary text-center block mt-auto"
              >
                Get Pro
              </Link>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ── Feature Rows ────────────────────────────────────────────── */
function DataCard({ label, value, sub }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5">
      <p className="text-[11px] font-mono tracking-[0.18em] uppercase text-muted-2 mb-2">{label}</p>
      <p className="text-[42px] font-bold text-ink tracking-[-0.03em] leading-none font-mono">{value}</p>
      {sub && <p className="text-[13px] text-muted mt-2">{sub}</p>}
    </div>
  );
}

function SessionMockup() {
  return (
    <div className="bg-ink rounded-3xl p-6 w-full max-w-[320px] shadow-2xl">
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-5">Last session — Killington</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          ['Top Speed', '34.2 mph'],
          ['Vertical', '18,400 ft'],
          ['Runs', '14'],
          ['Ski Time', '4h 22m'],
        ].map(([l, v]) => (
          <div key={l} className="bg-white/[0.05] rounded-xl p-3">
            <p className="text-[10px] text-white/30 font-mono mb-1">{l}</p>
            <p className="text-[16px] font-bold text-white font-mono">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/[0.05] rounded-xl p-4">
        <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-2">Coach observation</p>
        <p className="text-[12px] text-white/70 leading-relaxed">
          Speed dropped <span className="text-white font-semibold">18%</span> between runs 7–10.
          Classic mid-session fade — build a break after run 8.
        </p>
      </div>
    </div>
  );
}

function ScoreMockup() {
  return (
    <div className="relative flex items-center justify-center w-[260px] h-[260px]">
      <svg viewBox="-110 -110 220 220" className="absolute inset-0 w-full h-full">
        {/* Background ring */}
        <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(9,12,20,0.06)" strokeWidth="12" />
        {/* Score arc (78% = 280.8deg of 360) */}
        <circle
          cx="0" cy="0" r="90"
          fill="none"
          stroke="#0057FF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(78/100) * 2 * Math.PI * 90} ${2 * Math.PI * 90}`}
          transform="rotate(-90)"
          style={{ opacity: 0.85 }}
        />
        {/* Tick marks */}
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (-90 + i * 18) * Math.PI / 180;
          const x1 = Math.cos(angle) * 96, y1 = Math.sin(angle) * 96;
          const x2 = Math.cos(angle) * 104, y2 = Math.sin(angle) * 104;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(9,12,20,0.12)" strokeWidth="1" />;
        })}
      </svg>
      <div className="text-center z-10">
        <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-accent mb-1">SlopeScore</p>
        <p className="text-[62px] font-bold text-ink tracking-[-0.04em] leading-none font-mono">78</p>
        <p className="text-[12px] text-muted mt-1">+3 this session</p>
      </div>
    </div>
  );
}

function CoachMockup() {
  return (
    <div className="bg-ink rounded-3xl p-5 w-full max-w-[300px] shadow-2xl">
      <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-4">Mountain Coach</p>
      <div className="space-y-2.5">
        <div className="bg-white/10 rounded-xl px-3.5 py-2.5 text-[12px] text-white/80">
          Where are you skiing this weekend?
        </div>
        <div className="bg-accent rounded-xl px-3.5 py-2.5 text-[12px] text-white ml-6">
          Killington on Saturday
        </div>
        <div className="bg-white/10 rounded-xl px-3.5 py-2.5 text-[12px] text-white/80 leading-relaxed">
          Your fatigue window hits at run 9. Start on Rime or Snowdon, move to Superstar by 10am — peak performance window is 9–11.
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ tag, headline, body, visual, flip = false, tinted = false }) {
  return (
    <section
      className="py-28 px-6"
      style={tinted ? {
        background: 'linear-gradient(160deg, rgba(0,87,255,0.025) 0%, transparent 50%), #F8FAFF',
      } : {}}
    >
      <SectionDivider />
      <div className="max-w-[1100px] mx-auto pt-28">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <InView>
            <Tag>{tag}</Tag>
            <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold tracking-[-0.03em] text-ink leading-[1.08]">
              {headline}
            </h2>
            <p className="mt-5 text-muted text-[17px] leading-relaxed">{body}</p>
          </InView>
          <InView delay={0.1} className="flex justify-center">
            {visual}
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ── History Mockup ──────────────────────────────────────────── */
function HistoryMockup() {
  const sessions = [
    { resort: 'Killington', date: 'Jan 18', score: 78, runs: 14 },
    { resort: 'Stowe',      date: 'Jan 11', score: 74, runs: 11 },
    { resort: 'Sugarbush',  date: 'Dec 28', score: 71, runs: 9  },
  ];
  return (
    <div className="bg-surface border border-line rounded-3xl p-5 w-full max-w-[320px] shadow-sm">
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-2 mb-4">Session History</p>
      <div className="space-y-2">
        {sessions.map(s => (
          <div key={s.date} className="flex items-center justify-between px-4 py-3 bg-bg rounded-xl">
            <div>
              <p className="text-[13px] font-semibold text-ink">{s.resort}</p>
              <p className="text-[11px] text-muted-2 font-mono">{s.date} · {s.runs} runs</p>
            </div>
            <span className="text-[18px] font-bold text-accent font-mono">{s.score}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-2 text-center mt-4 font-mono">Pro — unlimited history</p>
    </div>
  );
}

/* ── How It Works ────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Export from Slopes',
      body: 'After your session, export the .slopes file from the Slopes App on your phone. Takes about 10 seconds.',
    },
    {
      n: '02',
      title: 'Upload to SlopeIQ',
      body: 'Drop the file into SlopeIQ. We parse every data point — speed, vertical, run timing, GPS — in under 30 seconds.',
    },
    {
      n: '03',
      title: 'Read your debrief',
      body: 'Free users see clean stats. Pro users get a coached debrief, SlopeScore update, and mountain recommendations.',
    },
  ];

  return (
    <section className="py-28 px-6 bg-bg">
      <SectionDivider />
      <div className="max-w-[1100px] mx-auto pt-28">
        <InView>
          <Tag>How it works</Tag>
          <h2 className="mt-4 text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] text-ink leading-[1.06]">
            Three steps.<br />No setup required.
          </h2>
        </InView>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <InView key={s.n} delay={i * 0.1}>
              <div className="relative pt-8 pl-6 border-l-2 border-accent/20">
                <span className="absolute top-8 left-[-1px] w-3 h-3 rounded-full bg-accent block -translate-x-1.5" />
                <p className="text-[11px] font-mono tracking-[0.2em] text-accent mb-3">{s.n}</p>
                <h3 className="text-[20px] font-bold text-ink mb-2 tracking-tight">{s.title}</h3>
                <p className="text-[15px] text-muted leading-relaxed">{s.body}</p>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Integrations ────────────────────────────────────────────── */
function IntegrationsSection() {
  return (
    <section className="py-28 px-6 bg-bg">
      <SectionDivider />
      <div className="max-w-[1100px] mx-auto pt-28">
        <InView>
          <Tag>Works with</Tag>
          <h2 className="mt-4 text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] text-ink leading-[1.06]">
            Built on Slopes App.
          </h2>
          <p className="mt-5 text-muted text-[17px] max-w-[480px] leading-relaxed">
            SlopeIQ reads your <strong className="text-ink font-semibold">Slopes App</strong> export files directly.
            No account linking, no OAuth, no data sharing — you own the file.
            Apple Watch and Garmin support are in development.
          </p>
        </InView>
        <div className="mt-10 flex flex-wrap gap-3">
          {[
            { name: 'Slopes App', status: 'live',  dot: '#0057FF' },
            { name: 'Apple Watch', status: 'soon', dot: '#1F2025' },
            { name: 'Garmin',      status: 'soon', dot: '#007CC2' },
          ].map(item => (
            <InView key={item.name}>
              <div className={`flex items-center gap-2.5 px-5 py-3 rounded-full border ${
                item.status === 'live'
                  ? 'border-line bg-surface shadow-sm'
                  : 'border-line/50 bg-surface/50 opacity-55'
              }`}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.dot }} />
                <span className={`text-[14px] font-semibold ${item.status === 'live' ? 'text-ink' : 'text-muted'}`}>
                  {item.name}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  item.status === 'live'
                    ? 'text-accent bg-accent/10'
                    : 'text-muted-2 bg-black/[0.05]'
                }`}>
                  {item.status === 'live' ? 'Live' : 'Soon'}
                </span>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section className="py-28 px-6 bg-bg">
      <SectionDivider />
      <div className="max-w-[640px] mx-auto pt-28">
        <InView>
          <Tag>Pricing</Tag>
          <h2 className="mt-4 text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] text-ink leading-[1.06]">
            Simple. No surprises.
          </h2>
        </InView>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InView delay={0.05}>
            <div className="rounded-3xl border border-line bg-surface p-8 h-full flex flex-col">
              <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-2">Free</p>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-[52px] font-bold text-ink tracking-[-0.03em] leading-none font-mono">$0</span>
              </div>
              <p className="text-muted text-[13px] mt-1 mb-6">Forever. No card required.</p>
              <ul className="space-y-2.5 text-[14px] text-muted flex-1">
                {['One session at a time', 'Full raw stats', 'Run-by-run breakdown', 'Basic math observations'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-2 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-ghost w-full text-center mt-8 block">Get started</Link>
            </div>
          </InView>
          <InView delay={0.12}>
            <div
              className="rounded-3xl p-8 h-full flex flex-col relative overflow-hidden"
              style={{
                background: '#090C14',
                boxShadow: '0 20px 60px rgba(0,87,255,0.15)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
              <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-accent">Pro</p>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-[52px] font-bold text-white tracking-[-0.03em] leading-none font-mono">$10</span>
              </div>
              <p className="text-white/40 text-[13px] mt-1 mb-6">per month</p>
              <ul className="space-y-2.5 text-[14px] text-white/70 flex-1">
                {['Everything in Free', 'Unlimited uploads', 'SlopeScore + trends', 'Coached session debrief', 'Mountain Coach AI', 'Full session history'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="btn-primary w-full text-center mt-8 block">Get Pro</Link>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-36 px-6 bg-bg relative overflow-hidden">
      <SectionDivider />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,87,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,87,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,87,255,0.07) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-[800px] mx-auto text-center">
        <InView>
          <p className="eyebrow mb-6">Ready</p>
          <h2 className="text-[52px] sm:text-[72px] font-bold tracking-[-0.03em] text-ink leading-[1.02]">
            Your runs are talking.<br />
            <span style={{ color: '#0057FF' }}>Start listening.</span>
          </h2>
          <p className="mt-6 text-muted text-[18px] max-w-[400px] mx-auto leading-relaxed">
            Upload your first session for free. No credit card. No account required to try.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-[16px] px-8 py-4">
              Create your free account
            </Link>
            <Link to="/how-it-works" className="btn-ghost text-[16px] px-8 py-4">
              How it works
            </Link>
          </div>
          <p className="mt-5 text-muted-2 text-[13px] font-mono">Works with Slopes App · No setup required</p>
        </InView>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="bg-bg">
      <HeroSection />

      <TierSection />

      <FeatureRow
        tag="Session Debrief"
        headline="Know what actually happened out there."
        body="Upload your .slopes file and get the full picture. Free users see clean stats and run-by-run data. Pro users get seven data-grounded coaching observations — no guesswork, no generic advice."
        tinted
        visual={<SessionMockup />}
      />

      <FeatureRow
        tag="SlopeScore — Pro"
        headline="A number that actually means something."
        body="0–100, calibrated to your baseline. SlopeScore tracks five performance dimensions across every session and tells you whether you're progressing or regressing — in a number you can track over time."
        flip
        visual={<ScoreMockup />}
      />

      <FeatureRow
        tag="Mountain Coach — Pro"
        headline="Your day planned before you click in."
        body="Tell it where you're skiing. It cross-references your session history with your fatigue patterns and builds an optimal run order — peak window, break timing, terrain match."
        tinted
        visual={<CoachMockup />}
      />

      <FeatureRow
        tag="Session History — Pro"
        headline="Every session, permanently saved."
        body="Free sessions clear when you upload the next one. Pro keeps every session — go back to any day, compare seasons, track your SlopeScore over time. Your entire ski history in one place."
        flip
        visual={<HistoryMockup />}
      />

      <HowItWorks />

      <IntegrationsSection />

      <PricingSection />

      <CTASection />
    </div>
  );
}
