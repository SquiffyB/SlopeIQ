import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Fade-in on scroll ──────────────────────────────────────── */
function Reveal({ children, className, delay = 0, y = 40 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Hero ── full-screen Alps video, text bottom-left ─────── */
function VideoHero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-[#08090D]">
      {/* Video */}
      <video
        autoPlay muted loop playsInline
        poster="/mountain.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        style={{ objectPosition: 'center 30%' }}
      >
        <source src="/alps.mov" type="video/mp4" />
        <source src="/alps.mov" type="video/quicktime" />
      </video>

      {/* Gradient: strong at bottom, subtle top */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,9,13,0.90) 0%, rgba(8,9,13,0.35) 45%, rgba(8,9,13,0.15) 100%)',
        }}
      />

      {/* Content — bottom left */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <h1
            className="font-display font-bold text-[#EFEFED] leading-[0.92] tracking-[-0.01em] mb-6"
            style={{ fontSize: 'clamp(3.8rem, 9vw, 8rem)' }}
          >
            Know Your<br />Mountain.
          </h1>
          <p className="text-[#EFEFED]/60 text-[17px] sm:text-[19px] max-w-[440px] leading-relaxed mb-10 font-light">
            SlopeIQ turns your Slopes sessions into structured performance data.
            Upload a session. Understand what happened.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/signup')} className="btn-white">
              Upload free
            </button>
            <button onClick={() => navigate('/how-it-works')} className="btn-outline-white">
              How it works
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 right-8 sm:right-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span
          className="text-[10px] tracking-[0.22em] uppercase text-[#EFEFED]/30 font-sans"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

/* ── Two tiers — clean, no card borders ────────────────────── */
function TierSection() {
  return (
    <section className="bg-[#F2F2F0] py-28 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold text-ink tracking-tight mb-16"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 1.02 }}
          >
            Two ways to use it.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          {/* Free */}
          <Reveal className="bg-[#F2F2F0] p-10 sm:p-14">
            <p className="text-[12px] tracking-[0.2em] uppercase text-muted mb-6 font-sans font-medium">Free</p>
            <h3
              className="font-display font-bold text-ink mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.05 }}
            >
              Your session, raw.
            </h3>
            <p className="text-muted text-[16px] leading-relaxed mb-8">
              Upload a <code className="text-[14px] bg-elevated px-1.5 py-0.5 rounded font-mono">.slopes</code> file
              and see every number from your day — speed, vertical, run count, distance.
              One session at a time. No history, no coaching, no score.
            </p>
            <ul className="space-y-2.5 text-[15px] text-muted mb-10">
              {['Full session stats', 'Run-by-run breakdown', 'Basic math observations', 'No account required'].map(f => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-ghost inline-flex">Start free →</Link>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.08} className="bg-[#0D0E14] p-10 sm:p-14">
            <p className="text-[12px] tracking-[0.2em] uppercase text-[#EFEFED]/35 mb-6 font-sans font-medium">Pro — $10/mo</p>
            <h3
              className="font-display font-bold text-[#EFEFED] mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.05 }}
            >
              Your season, coached.
            </h3>
            <p className="text-[#EFEFED]/55 text-[16px] leading-relaxed mb-8">
              Every session analyzed with seven grounded observations.
              A SlopeScore that tracks your performance over time.
              An AI mountain coach that knows your history.
              All sessions saved permanently.
            </p>
            <ul className="space-y-2.5 text-[15px] text-[#EFEFED]/55 mb-10">
              {['Everything in Free', 'Coached session debrief', 'SlopeScore + history', 'Mountain Coach', 'Permanent session archive'].map(f => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="btn-white inline-flex">Get Pro →</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Feature: dark with skier image ─────────────────────────── */
function DebriefSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#08090D]">
      {/* Skier photo — right side */}
      <div className="absolute inset-0">
        <img
          src="/skier.jpg"
          alt="Skier carving a hard turn through deep powder"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ objectPosition: '70% center' }}
        />
        {/* Gradient: solid dark left → transparent right */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(8,9,13,1) 0%, rgba(8,9,13,0.88) 38%, rgba(8,9,13,0.45) 65%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 py-28 w-full">
        <Reveal className="max-w-[520px]">
          <h2
            className="font-display font-bold text-[#EFEFED] leading-[1.00] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
          >
            Know what actually<br />happened out there.
          </h2>
          <p className="text-[#EFEFED]/55 text-[17px] leading-relaxed mb-10">
            Upload your <code className="font-mono text-[15px] text-[#EFEFED]/70">.slopes</code> file and
            get the full picture. Free users get clean stats and
            a run-by-run timeline. Pro users get seven grounded coaching
            observations — no generics, no guesswork.
          </p>
          <Link to="/signup" className="btn-white inline-flex">Try it free</Link>
        </Reveal>

        {/* Mini data card */}
        <Reveal delay={0.15} className="mt-16 max-w-[340px]">
          <div className="bg-[#12131A] border border-[rgba(239,239,237,0.07)] rounded-lg p-6">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#EFEFED]/25 mb-5 font-sans">Last session · Killington</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[['Top speed', '34.2 mph'], ['Vertical', '18,400 ft'], ['Runs', '14'], ['Ski time', '4h 22m']].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[11px] text-[#EFEFED]/30 mb-1">{l}</p>
                  <p className="text-[22px] font-display font-bold text-[#EFEFED] leading-none">{v}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(239,239,237,0.06)] pt-4">
              <p className="text-[11px] tracking-widest uppercase text-[#EFEFED]/20 mb-2">Pro observation</p>
              <p className="text-[13px] text-[#EFEFED]/55 leading-relaxed">
                Speed dropped <span className="text-[#EFEFED]/80 font-semibold">18%</span> between
                runs 7–10. Classic mid-session fade. Take a break after run 8 next time.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Feature: light — SlopeScore ────────────────────────────── */
function ScoreSection() {
  const circumference = 2 * Math.PI * 88;

  return (
    <section className="bg-[#F2F2F0] py-28 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <p className="text-[12px] tracking-[0.2em] uppercase text-accent mb-5 font-sans font-semibold">Pro only</p>
          <h2
            className="font-display font-bold text-ink leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4rem)' }}
          >
            One number.<br />A full season<br />of context.
          </h2>
          <p className="text-muted text-[17px] leading-relaxed">
            SlopeScore is 0–100, calibrated to your baseline.
            It tracks five performance dimensions across every session and
            tells you whether you're progressing — in a number you can watch over time.
            A 74 for a beginner and a 74 for an expert mean different things.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center">
          <div className="relative flex items-center justify-center w-[280px] h-[280px]">
            <svg viewBox="-110 -110 220 220" className="absolute inset-0 w-full h-full">
              {/* Track */}
              <circle cx="0" cy="0" r="88" fill="none" stroke="rgba(13,14,20,0.07)" strokeWidth="10" />
              {/* Score arc */}
              <circle
                cx="0" cy="0" r="88"
                fill="none"
                stroke="#0057FF"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - 0.78)}
                transform="rotate(-90)"
              />
              {/* Ticks */}
              {Array.from({ length: 24 }, (_, i) => {
                const a = (-90 + i * 15) * Math.PI / 180;
                const r1 = 96, r2 = 102;
                return (
                  <line
                    key={i}
                    x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                    x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                    stroke="rgba(13,14,20,0.10)" strokeWidth="1"
                  />
                );
              })}
            </svg>
            <div className="text-center z-10">
              <p className="text-[10px] tracking-[0.2em] uppercase text-accent font-sans mb-1">SlopeScore</p>
              <p className="font-display font-bold text-ink leading-none" style={{ fontSize: '4.5rem' }}>78</p>
              <p className="text-[13px] text-muted mt-1">+3 this session</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Feature: dark — Mountain Coach ─────────────────────────── */
function CoachSection() {
  return (
    <section className="bg-[#08090D] py-28 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Chat mockup */}
        <Reveal className="order-2 lg:order-1 flex justify-center lg:justify-start">
          <div className="bg-[#12131A] border border-[rgba(239,239,237,0.06)] rounded-lg p-6 w-full max-w-[340px]">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#EFEFED]/25 mb-5 font-sans">Mountain Coach</p>
            <div className="space-y-3">
              <div className="bg-[rgba(239,239,237,0.06)] rounded-md px-4 py-3 text-[13px] text-[#EFEFED]/70 leading-relaxed">
                Where are you skiing this weekend?
              </div>
              <div className="bg-accent/90 rounded-md px-4 py-3 text-[13px] text-white leading-relaxed ml-6">
                Killington on Saturday
              </div>
              <div className="bg-[rgba(239,239,237,0.06)] rounded-md px-4 py-3 text-[13px] text-[#EFEFED]/70 leading-relaxed">
                Your fatigue window hits at run 9 based on your last three sessions.
                Start on Rime or Snowdon, move to Superstar by 10am.
                Peak window is 9–11.
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="text-[12px] tracking-[0.2em] uppercase text-accent mb-5 font-sans font-semibold">Pro only</p>
          <h2
            className="font-display font-bold text-[#EFEFED] leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4rem)' }}
          >
            Your day planned<br />before you click in.
          </h2>
          <p className="text-[#EFEFED]/50 text-[17px] leading-relaxed">
            Tell it where you're skiing. It cross-references your session history
            with your fatigue patterns and builds your optimal run order —
            peak window, break timing, terrain match.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Feature: light — Session History ───────────────────────── */
function HistorySection() {
  const sessions = [
    { resort: 'Killington', date: 'Jan 18', score: 78, runs: 14 },
    { resort: 'Stowe',      date: 'Jan 11', score: 74, runs: 11 },
    { resort: 'Sugarbush',  date: 'Dec 28', score: 71, runs: 9  },
  ];

  return (
    <section className="bg-[#F2F2F0] py-28 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <p className="text-[12px] tracking-[0.2em] uppercase text-accent mb-5 font-sans font-semibold">Pro only</p>
          <h2
            className="font-display font-bold text-ink leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4rem)' }}
          >
            Every session,<br />permanently saved.
          </h2>
          <p className="text-muted text-[17px] leading-relaxed">
            Free sessions clear when you upload the next one.
            Pro keeps every session — go back to any day,
            compare seasons, track your SlopeScore over time.
            Your entire ski history in one place.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center">
          <div className="bg-white border border-line rounded-lg p-5 w-full max-w-[320px]">
            <p className="text-[11px] tracking-[0.18em] uppercase text-muted-2 mb-4 font-sans">Session history</p>
            <div className="space-y-1.5">
              {sessions.map(s => (
                <div key={s.date} className="flex items-center justify-between px-4 py-3.5 bg-[#F2F2F0] rounded-md">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{s.resort}</p>
                    <p className="text-[12px] text-muted-2 font-sans">{s.date} · {s.runs} runs</p>
                  </div>
                  <span className="text-[22px] font-display font-bold text-accent leading-none">{s.score}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── How it works — dark timeline ───────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Export from Slopes', body: 'After your session, export the .slopes file from the Slopes app on your phone. Takes about 10 seconds.' },
    { n: '02', title: 'Upload to SlopeIQ', body: 'Drop the file in. We parse every data point — speed, vertical, run timing — in under 30 seconds.' },
    { n: '03', title: 'Read your debrief', body: 'Free users get clean stats. Pro users get a coached debrief, SlopeScore update, and mountain recommendations.' },
  ];

  return (
    <section className="bg-[#08090D] py-28 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold text-[#EFEFED] tracking-tight mb-20"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 1.02 }}
          >
            Three steps.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-px bg-[rgba(239,239,237,0.06)]">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="bg-[#08090D] p-8 sm:p-10">
              <p className="font-display font-bold text-[#EFEFED]/15 text-[3rem] leading-none mb-8">{s.n}</p>
              <h3
                className="font-display font-bold text-[#EFEFED] mb-3"
                style={{ fontSize: '1.5rem', lineHeight: 1.1 }}
              >
                {s.title}
              </h3>
              <p className="text-[#EFEFED]/45 text-[15px] leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section className="bg-[#F2F2F0] py-28 px-6 sm:px-10">
      <div className="max-w-[800px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold text-ink tracking-tight mb-16"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 1.02 }}
          >
            Simple pricing.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line">
          <Reveal className="bg-[#F2F2F0] p-10">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-4 font-sans">Free</p>
            <p className="font-display font-bold text-ink text-[4.5rem] leading-none mb-1">$0</p>
            <p className="text-muted text-[14px] mb-8">Forever. No card needed.</p>
            <ul className="space-y-2 text-[14px] text-muted mb-10">
              {['One session at a time', 'Full raw stats', 'Run-by-run breakdown'].map(f => (
                <li key={f} className="flex gap-2.5 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-ghost inline-flex">Get started</Link>
          </Reveal>

          <Reveal delay={0.1} className="bg-[#0D0E14] p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-4 font-sans">Pro</p>
            <p className="font-display font-bold text-[#EFEFED] text-[4.5rem] leading-none mb-1">$10</p>
            <p className="text-[#EFEFED]/35 text-[14px] mb-8">per month</p>
            <ul className="space-y-2 text-[14px] text-[#EFEFED]/50 mb-10">
              {['Everything in Free', 'Unlimited uploads', 'Coached debrief', 'SlopeScore + trends', 'Mountain Coach', 'Full session history'].map(f => (
                <li key={f} className="flex gap-2.5 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="btn-white inline-flex">Get Pro</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── CTA — mountain image full bleed ────────────────────────── */
function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#08090D]">
      {/* Parallax mountain */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/mountain.jpg"
          alt="Aerial panorama of the French Alps at dawn"
          className="w-full h-full object-cover opacity-50"
          style={{ objectPosition: 'center 40%', transform: 'scale(1.15)' }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,9,13,0.80) 0%, rgba(8,9,13,0.40) 60%, rgba(8,9,13,0.55) 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 py-28 w-full text-center">
        <Reveal>
          <h2
            className="font-display font-bold text-[#EFEFED] tracking-tight mx-auto mb-8"
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.96, maxWidth: '16ch' }}
          >
            Your runs are talking.
          </h2>
          <p className="text-[#EFEFED]/55 text-[18px] max-w-[380px] mx-auto leading-relaxed mb-10">
            Upload your first session for free. No credit card.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-white">Create your free account</Link>
            <Link to="/how-it-works" className="btn-outline-white">How it works</Link>
          </div>
          <p className="text-[#EFEFED]/25 text-[12px] mt-6 tracking-wide font-sans">
            Works with Slopes App · No setup required
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div>
      <VideoHero />
      <TierSection />
      <DebriefSection />
      <ScoreSection />
      <CoachSection />
      <HistorySection />
      <HowItWorks />
      <PricingSection />
      <CTASection />
    </div>
  );
}
