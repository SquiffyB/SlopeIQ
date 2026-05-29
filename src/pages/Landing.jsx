import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SlopeScoreDisplay from '../components/SlopeScoreDisplay';
import SmoothScrollHero from '../components/SmoothScrollHero';

function InView({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────
   MARQUEE
─────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  'Consistency Score', 'Fatigue Window', 'Vertical Rate', 'Run Analysis',
  'Mountain Coach', 'SlopeScore', 'Peak Window', 'Rest Sensitivity',
  'Session Debrief', 'Progression Tracking', 'Resort Planning', 'Data-Driven Coaching',
];

function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line py-5 select-none bg-surface">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
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

/* ──────────────────────────────────────────
   APP MOCKUP CARDS
─────────────────────────────────────────── */
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
    <div className="bg-[#1F2025] rounded-2xl p-5 w-[240px] shadow-2xl">
      <p className="text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-4">Mountain Coach</p>
      <div className="space-y-3">
        <div className="bg-white/10 rounded-xl px-3 py-2.5 text-[12px] text-white/80 leading-snug">
          Where are you skiing this weekend?
        </div>
        <div className="bg-[#3898EC] rounded-xl px-3 py-2.5 text-[12px] text-white leading-snug ml-6">
          Heading to Killington on Saturday
        </div>
        <div className="bg-white/10 rounded-xl px-3 py-2.5 text-[12px] text-white/80 leading-snug">
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
        <span className="text-[9px] bg-coral/10 text-coral font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Data</span>
      </div>
      <p className="text-[12px] text-muted leading-relaxed">
        Your speed dropped <span className="text-ink font-semibold">18%</span> between runs 7–10, peaking at 34 mph early then settling at 28. Classic mid-session fade — build in a break after run 8.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────
   FEATURE SECTION
─────────────────────────────────────────── */
function FeatureSection({ label, headline, body, visual, flip = false, tinted = false }) {
  return (
    <section
      className="border-t border-line relative overflow-hidden"
      style={tinted ? {
        background: 'radial-gradient(ellipse 80% 60% at 0% 50%, rgba(56,152,236,0.055) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 100% 50%, rgba(96,165,250,0.04) 0%, transparent 70%), #F3F6F7',
      } : {}}
    >
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

/* ──────────────────────────────────────────
   PERSONAS
─────────────────────────────────────────── */
const PERSONAS = [
  {
    emoji: '⛷️',
    title: 'Weekend Warrior',
    color: '#3898EC',
    bg: 'rgba(56,152,236,0.07)',
    desc: 'You ski hard when you can. SlopeIQ helps you squeeze every run out of limited days on snow — and walk away ready for the next one.',
    tags: ['SlopeScore', 'Fatigue Window', 'Session Debrief'],
  },
  {
    emoji: '🏆',
    title: 'Competitor',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.07)',
    desc: 'You measure everything. Track training load, peak at the right moment, and avoid over-skiing before race day.',
    tags: ['Progression Tracking', 'Vertical Rate', 'Peak Window'],
  },
  {
    emoji: '📊',
    title: 'Data Nerd',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.07)',
    desc: 'You want the full picture. Speed, vertical, consistency, recovery — every metric Slopes captures, fully analyzed.',
    tags: ['Run Analysis', 'Consistency Score', 'Full Stats'],
  },
  {
    emoji: '🎿',
    title: 'Instructor / Coach',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.07)',
    desc: 'Use your own data to demonstrate technique, track how your skiing evolves, and plan smarter days on mountain.',
    tags: ['Resort Planning', 'Mountain Coach', 'Session History'],
  },
];

function PersonaSection() {
  return (
    <section className="border-t border-line">
      <div className="max-w-[1100px] mx-auto px-6 py-28">
        <InView>
          <p className="eyebrow">Who it's for</p>
          <h2 className="text-[40px] sm:text-[52px] font-semibold tracking-tight mt-4 text-ink leading-[1.05]">
            SlopeIQ adapts<br />to every skier.
          </h2>
          <p className="mt-5 text-muted text-[17px] max-w-[460px] leading-relaxed">
            Whether you ski a few weekends a year or train year-round, your sessions are telling a story. SlopeIQ helps you read it.
          </p>
        </InView>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERSONAS.map((p, i) => (
            <InView key={p.title} delay={i * 0.08}>
              <div
                className="rounded-2xl p-6 h-full border border-line flex flex-col transition-shadow hover:shadow-md"
                style={{ background: p.bg }}
              >
                <div className="text-[30px] mb-4">{p.emoji}</div>
                <h3 className="text-[17px] font-semibold text-ink mb-2">{p.title}</h3>
                <p className="text-[14px] text-muted leading-relaxed flex-1">{p.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: p.color, background: `${p.color}18` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   TESTIMONIALS
─────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Jake M.',
    handle: '@jakeski_vt',
    date: 'Feb 2026',
    text: 'Finally understand why I feel wrecked after day 3. The fatigue window prediction is scary accurate — SlopeIQ called it exactly right.',
    resort: 'Stowe, VT',
  },
  {
    name: 'Sarah K.',
    handle: '@sarahr_ski',
    date: 'Jan 2026',
    text: 'Mountain Coach planned my whole Vail day around my session history. Hit every run at the right time. Zero bad decisions.',
    resort: 'Vail, CO',
  },
  {
    name: 'Tom W.',
    handle: '@tomwski',
    date: 'Dec 2025',
    text: 'My SlopeScore went from 61 to 79 over the season. Watching the progression keeps me motivated to actually push myself.',
    resort: 'Whistler, BC',
  },
  {
    name: 'Mia R.',
    handle: '@mia_onsnow',
    date: 'Mar 2026',
    text: 'I teach skiing and started running my own sessions through SlopeIQ. The run-by-run breakdown is unreal. I had no idea how inconsistent I was.',
    resort: 'Park City, UT',
  },
  {
    name: 'Dan B.',
    handle: '@danbski',
    date: 'Jan 2026',
    text: 'Upload, get coaching, go back out. Takes 5 minutes. Way more useful than just staring at the Slopes stats screen.',
    resort: 'Killington, VT',
  },
  {
    name: 'Chris L.',
    handle: '@clskiracer',
    date: 'Feb 2026',
    text: 'As someone who races NASTAR, the progression tracking is exactly what I needed. Actual data behind the improvement, not just vibes.',
    resort: 'Mammoth, CA',
  },
];

function TestimonialCard({ name, handle, date, text, resort }) {
  return (
    <div className="shrink-0 w-[300px] bg-surface rounded-2xl p-6 border border-line shadow-sm flex flex-col">
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-[14px] text-muted leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-line">
        <div>
          <p className="text-[13px] font-semibold text-ink">{name}</p>
          <p className="text-[11px] text-muted-2">{handle} · {resort}</p>
        </div>
        <p className="text-[11px] text-muted-2">{date}</p>
      </div>
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="border-t border-line overflow-hidden py-24 bg-surface">
      <div className="max-w-[1100px] mx-auto px-6 mb-14">
        <InView>
          <p className="eyebrow">Reviews</p>
          <h2 className="text-[40px] sm:text-[52px] font-semibold tracking-tight mt-4 text-ink leading-[1.05]">
            Loved by skiers<br />everywhere.
          </h2>
        </InView>
      </div>
      {/* Fade edges */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to right, #FFFFFF, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to left, #FFFFFF, transparent)' }} />
        <motion.div
          className="flex gap-5 px-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
          style={{ width: 'max-content' }}
        >
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   INTEGRATIONS
─────────────────────────────────────────── */
const INTEGRATIONS = [
  { name: 'Slopes App', dot: '#3898EC' },
  { name: 'Apple Watch', dot: '#1F2025' },
  { name: 'Garmin', dot: '#007CC2' },
  { name: 'Strava', dot: '#FC4C02' },
  { name: 'Whoop', dot: '#00D4AA' },
  { name: 'Oura Ring', dot: '#2D2D2D' },
  { name: 'Fitbit', dot: '#00B0B9' },
  { name: 'Polar', dot: '#D00000' },
  { name: 'Suunto', dot: '#1A1A1A' },
  { name: 'Wahoo', dot: '#E5001B' },
];

function IntegrationsSection() {
  return (
    <section className="border-t border-line overflow-hidden py-24">
      <div className="max-w-[1100px] mx-auto px-6 mb-14">
        <InView>
          <p className="eyebrow">Works with</p>
          <h2 className="text-[40px] sm:text-[52px] font-semibold tracking-tight mt-4 text-ink leading-[1.05]">
            Your gear, connected.
          </h2>
          <p className="mt-5 text-muted text-[17px] max-w-[440px] leading-relaxed">
            Start with your Slopes sessions. More integrations with wearables and training platforms are on the way.
          </p>
        </InView>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to right, #F3F6F7, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to left, #F3F6F7, transparent)' }} />
        <motion.div
          className="flex gap-3 px-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          style={{ width: 'max-content' }}
        >
          {[...INTEGRATIONS, ...INTEGRATIONS].map((item, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-full border border-line bg-surface shadow-sm"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.dot }} />
              <span className="text-[14px] font-semibold text-ink whitespace-nowrap">{item.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   STATS
─────────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="border-t border-line bg-surface">
      <div className="max-w-[1100px] mx-auto px-6 py-24">
        <InView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { value: '2,100+', label: 'Sessions analyzed' },
              { value: '47', label: 'Resorts covered' },
              { value: '5', label: 'Performance dimensions' },
            ].map(s => (
              <div key={s.label}>
                <p
                  className="text-[56px] font-bold leading-none tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #1F2025 0%, #3898EC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.value}
                </p>
                <p className="text-muted text-[15px] mt-3">{s.label}</p>
              </div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   PRICING
─────────────────────────────────────────── */
function PricingSection() {
  return (
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
                    <span className="w-4 h-4 rounded-full bg-elevated flex items-center justify-center text-[9px] text-ink font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-ghost w-full text-center mt-8 block py-3 text-[15px]">Get started</Link>
            </div>
          </InView>
          <InView delay={0.12}>
            <div
              className="card p-8 h-full"
              style={{ boxShadow: '0 0 0 1.5px rgba(56,152,236,0.3), 0 8px 40px rgba(56,152,236,0.10)' }}
            >
              <p className="text-[12px] font-semibold text-coral uppercase tracking-widest">Pro</p>
              <p className="text-[52px] font-bold text-ink mt-3 leading-none tracking-tight">$10</p>
              <p className="text-muted text-[14px] mt-1.5">per month</p>
              <ul className="mt-7 space-y-3 text-[14px] text-muted">
                {['Everything in Free', 'Unlimited uploads', 'Full coaching debrief', 'SlopeScore history + trends', 'Mountain Coach'].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-coral/10 flex items-center justify-center text-[9px] text-coral font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="btn-primary w-full text-center mt-8 block py-3 text-[15px]">See full pricing</Link>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   CTA
─────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="border-t border-line relative overflow-hidden">
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #151820 0%, #1e2a3a 40%, #162030 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 80% at 80% 50%, rgba(56,152,236,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 10% 80%, rgba(96,165,250,0.10) 0%, transparent 60%)
          `,
        }}
      />
      {/* Ski image strip at top */}
      <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden opacity-20">
        <img src="/ski-hero.avif" alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#151820]" />
      </div>
      <div className="relative max-w-[1100px] mx-auto px-6 py-32 sm:py-40 text-center">
        <InView>
          <p className="text-white/50 text-[12px] font-semibold tracking-[0.2em] uppercase mb-6">Ready when you are</p>
          <h2 className="text-[48px] sm:text-[68px] font-semibold tracking-tight text-white leading-[1.04]">
            Your skiing has data.<br />Start using it.
          </h2>
          <p className="mt-6 text-white/50 text-[18px] max-w-[400px] mx-auto leading-relaxed">
            Join skiers who finally know what their numbers mean.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-ink font-semibold text-[16px] rounded-full hover:bg-white/90 transition-colors"
            >
              Create your free account
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center px-10 py-4 bg-white/10 text-white font-semibold text-[16px] rounded-full hover:bg-white/15 transition-colors border border-white/15"
            >
              How it works
            </Link>
          </div>
          <p className="mt-6 text-white/30 text-[13px]">One free session. No credit card required.</p>
        </InView>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   PAGE
─────────────────────────────────────────── */
const DIMS = { consistency: 72, fatigue: 88, vertical: 65, progression: 55, recovery: 80 };

export default function Landing() {
  return (
    <div>
      <SmoothScrollHero />

      <Marquee />

      <FeatureSection
        label="Session Debrief"
        headline="Know what actually happened out there."
        body="Upload your .slopes file and get a full breakdown — SlopeScore, seven data-driven coaching observations grounded in your exact numbers, and a run-by-run timeline. Not summaries. Not averages. The real story."
        tinted
        visual={
          <div className="relative flex gap-4 items-start justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <RunCard />
            </motion.div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="mt-12"
            >
              <DebriefCard />
            </motion.div>
          </div>
        }
      />

      <PersonaSection />

      <FeatureSection
        flip
        label="Mountain Coach"
        headline="Your day plan, before you click in."
        body="Tell it where you're skiing. It knows the trails, knows your ability level from your sessions, and builds your optimal day — warmup runs, peak window, when to take a break, when to stop."
        visual={
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CoachCard />
          </motion.div>
        }
      />

      <FeatureSection
        label="SlopeScore"
        headline="A number that actually means something."
        body="0–100, calibrated to you. It learns your baseline across every session and tracks five dimensions of performance. A 74 for a beginner means something different than a 74 for an expert."
        tinted
        visual={<SlopeScoreDisplay score={78} trend={3} dimensions={DIMS} tier="pro" size={240} />}
      />

      <TestimonialSection />

      <IntegrationsSection />

      <StatsSection />

      <PricingSection />

      <CTASection />
    </div>
  );
}
