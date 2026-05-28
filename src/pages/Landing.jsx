import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SlopeScoreDisplay from '../components/SlopeScoreDisplay';

/* ── animation helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

function InView({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.25, 0.1, 0.25, 1], delay } } }}
    >
      {children}
    </motion.div>
  );
}

/* ── Marquee ── */
const MARQUEE_ITEMS = [
  'Consistency Score', 'Fatigue Window', 'Vertical Rate', 'Run Analysis',
  'Mountain Coach', 'SlopeScore', 'Peak Window', 'Rest Sensitivity',
  'Session Debrief', 'Progression Tracking', 'Resort Planning', 'AI Coaching',
];

function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line py-5 select-none">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-[14px] font-medium text-muted shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── App-style mockup cards ── */
function ScoreCard() {
  return (
    <div className="bg-[#1F2025] rounded-2xl p-5 w-[200px] shadow-2xl">
      <p className="text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-3">SlopeScore</p>
      <div className="flex items-end gap-2">
        <span className="text-[52px] font-bold text-white leading-none">78</span>
        <span className="text-[#3898EC] text-[13px] font-semibold mb-2">+3 ↑</span>
      </div>
      <div className="mt-3 space-y-2">
        {[['Consistency', 72], ['Fatigue Mgmt', 88], ['Vertical', 65]].map(([label, val]) => (
          <div key={label}>
            <div className="flex justify-between text-[10px] text-white/40 mb-1">
              <span>{label}</span><span>{val}</span>
            </div>
            <div className="h-1 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#3898EC] to-[#60A5FA]" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RunCard() {
  return (
    <div className="bg-white rounded-2xl p-5 w-[190px] shadow-xl border border-line">
      <p className="text-[10px] font-semibold tracking-widest text-muted-2 uppercase mb-3">Last Session</p>
      <div className="space-y-3">
        {[['Top Speed', '34.2 mph'], ['Vertical', '18,400 ft'], ['Runs', '14'], ['Ski Time', '4h 22m']].map(([label, val]) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[12px] text-muted">{label}</span>
            <span className="text-[13px] font-semibold text-ink">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachCard() {
  return (
    <div className="bg-[#1F2025] rounded-2xl p-5 w-[220px] shadow-2xl">
      <p className="text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-4">Mountain Coach</p>
      <div className="space-y-3">
        <div className="bg-white/10 rounded-xl px-3 py-2 text-[12px] text-white/80 leading-snug">
          Where are you skiing this weekend?
        </div>
        <div className="bg-[#3898EC] rounded-xl px-3 py-2 text-[12px] text-white leading-snug ml-4">
          Heading to Killington on Saturday
        </div>
        <div className="bg-white/10 rounded-xl px-3 py-2 text-[12px] text-white/80 leading-snug">
          Based on your fatigue window hitting at run 9, start on Rime or Snowdon before moving to Superstar by 10am…
        </div>
      </div>
    </div>
  );
}

function DebriefCard() {
  return (
    <div className="bg-white rounded-2xl p-5 w-[210px] shadow-xl border border-line">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-semibold tracking-widest text-muted-2 uppercase">Fatigue Window</p>
        <span className="text-[9px] bg-coral/10 text-coral font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
      </div>
      <p className="text-[12px] text-muted leading-relaxed">
        Your speed dropped <span className="text-ink font-semibold">18%</span> between runs 7–10, peaking at 34 mph early then settling at 28. Classic mid-session fade — build in a break after run 8.
      </p>
    </div>
  );
}

/* ── Feature section ── */
function FeatureSection({ label, headline, body, visual, flip = false }) {
  return (
    <section className="border-t border-line">
      <div className="max-w-[1100px] mx-auto px-6 py-28">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <InView>
            <p className="eyebrow mb-4">{label}</p>
            <h2 className="text-[36px] sm:text-[44px] font-semibold tracking-tight text-ink leading-[1.08]">
              {headline}
            </h2>
            <p className="mt-6 text-muted text-[17px] leading-relaxed">{body}</p>
          </InView>
          <InView delay={0.1} className="flex justify-center">
            {visual}
          </InView>
        </div>
      </div>
    </section>
  );
}

const DIMS = { consistency: 72, fatigue: 88, vertical: 65, progression: 55, recovery: 80 };

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[92vh] flex items-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full">
          <div className="max-w-[1100px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.p variants={fadeUp} className="eyebrow">AI Coaching for Skiers</motion.p>
              <motion.h1 variants={fadeUp} className="text-[58px] sm:text-[76px] font-semibold leading-[1.0] tracking-tight mt-5 text-ink">
                Your ski data,<br />finally<br />useful.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-7 text-muted text-[18px] sm:text-[20px] leading-relaxed max-w-[460px]">
                Upload your Slopes session. Get coaching grounded in your own numbers — not generic tips.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/signup" className="btn-primary text-[16px] px-8 py-4">Get started free</Link>
                <Link to="/how-it-works" className="btn-ghost text-[16px] px-8 py-4">How it works</Link>
              </motion.div>
              <motion.p variants={fadeUp} className="mt-5 text-muted-2 text-[13px]">
                One free session. No credit card required.
              </motion.p>
            </motion.div>

            {/* Right: floating cards */}
            <motion.div
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
              className="relative h-[480px] hidden lg:block"
            >
              <motion.div variants={fadeUp} className="absolute top-0 right-8"
                animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                <ScoreCard />
              </motion.div>
              <motion.div variants={fadeUp} className="absolute top-36 left-0"
                animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <RunCard />
              </motion.div>
              <motion.div variants={fadeUp} className="absolute bottom-4 right-4"
                animate={{ y: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
                <DebriefCard />
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Feature: Session Debrief ── */}
      <FeatureSection
        label="Session Debrief"
        headline="Know what actually happened out there."
        body="Upload your .slopes file and get a full breakdown — SlopeScore, seven AI coaching observations grounded in your exact numbers, and a run-by-run timeline. Not summaries. Not averages. The real story."
        visual={
          <div className="relative flex gap-4 items-start justify-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <RunCard />
            </motion.div>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="mt-10">
              <DebriefCard />
            </motion.div>
          </div>
        }
      />

      {/* ── Feature: Mountain Coach ── */}
      <FeatureSection
        flip
        label="Mountain Coach"
        headline="Your day plan, before you click in."
        body="Tell it where you're skiing. It knows the trails, knows your ability level from your sessions, and builds your optimal day — warmup runs, peak window, when to take a break, when to stop."
        visual={
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <CoachCard />
          </motion.div>
        }
      />

      {/* ── Feature: SlopeScore ── */}
      <FeatureSection
        label="SlopeScore"
        headline="A number that actually means something."
        body="0–100, calibrated to you. It learns your baseline across every session and tracks five dimensions of performance. A 74 for a beginner means something different than a 74 for an expert."
        visual={<SlopeScoreDisplay score={78} trend={3} dimensions={DIMS} tier="pro" size={240} />}
      />

      {/* ── Stats ── */}
      <section className="border-t border-line bg-surface">
        <div className="max-w-[1100px] mx-auto px-6 py-24">
          <InView>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { value: '2,100+', label: 'Sessions analyzed' },
                { value: '47', label: 'Resorts covered' },
                { value: '5', label: 'Performance dimensions' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[52px] font-bold text-ink leading-none tracking-tight">{s.value}</p>
                  <p className="text-muted text-[15px] mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </InView>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="border-t border-line">
        <div className="max-w-[1100px] mx-auto px-6 py-28">
          <InView>
            <p className="eyebrow">Pricing</p>
            <h2 className="text-[42px] sm:text-[52px] font-semibold tracking-tight mt-4 text-ink leading-[1.05]">
              Simple, honest pricing.
            </h2>
          </InView>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[640px]">
            <InView delay={0.05}>
              <div className="card p-8 h-full">
                <p className="text-[12px] font-semibold text-muted-2 uppercase tracking-widest">Free</p>
                <p className="text-[52px] font-bold text-ink mt-3 leading-none tracking-tight">$0</p>
                <p className="text-muted text-[14px] mt-1.5">forever</p>
                <ul className="mt-7 space-y-3 text-[14px] text-muted">
                  {['One session upload', 'Full session stats', 'SlopeScore', 'Run-by-run breakdown'].map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-elevated flex items-center justify-center text-[9px] text-ink font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="btn-ghost w-full text-center mt-8 block py-3 text-[15px]">Get started</Link>
              </div>
            </InView>
            <InView delay={0.12}>
              <div className="card p-8 h-full border-coral/20" style={{ boxShadow: '0 0 0 1px rgba(56,152,236,0.15), 0 4px 24px rgba(56,152,236,0.08)' }}>
                <p className="text-[12px] font-semibold text-coral uppercase tracking-widest">Pro</p>
                <p className="text-[52px] font-bold text-ink mt-3 leading-none tracking-tight">$10</p>
                <p className="text-muted text-[14px] mt-1.5">per month</p>
                <ul className="mt-7 space-y-3 text-[14px] text-muted">
                  {['Everything in Free', 'Unlimited uploads', 'Full AI coaching debrief', 'SlopeScore history + trends', 'Mountain Coach'].map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-coral/10 flex items-center justify-center text-[9px] text-coral font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing" className="btn-primary w-full text-center mt-8 block py-3 text-[15px]">See full pricing</Link>
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-line bg-[#1F2025]">
        <div className="max-w-[1100px] mx-auto px-6 py-28 sm:py-36 text-center">
          <InView>
            <h2 className="text-[44px] sm:text-[64px] font-semibold tracking-tight text-white leading-[1.05]">
              Your skiing has data.<br />Start using it.
            </h2>
            <p className="mt-6 text-white/50 text-[18px] max-w-[400px] mx-auto">
              Join skiers who know exactly what their data means.
            </p>
            <div className="mt-10">
              <Link to="/signup" className="inline-flex items-center justify-center px-10 py-4 bg-white text-ink font-semibold text-[16px] rounded-full hover:bg-white/90 transition-colors">
                Create your free account
              </Link>
            </div>
          </InView>
        </div>
      </section>

    </div>
  );
}
