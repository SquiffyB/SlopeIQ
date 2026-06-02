import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

function Reveal({ children, className, delay = 0, y = 36 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO — full-screen Alps video, headline bottom-left
───────────────────────────────────────────────────────────── */
function VideoHero() {
  const navigate = useNavigate();
  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-[#08090D]">
      <video
        autoPlay muted loop playsInline
        poster="/mountain.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        style={{ objectPosition: 'center 30%' }}
      >
        <source src="/alps.mov" type="video/mp4" />
        <source src="/alps.mov" type="video/quicktime" />
      </video>

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(8,9,13,0.92) 0%, rgba(8,9,13,0.30) 50%, rgba(8,9,13,0.15) 100%)' }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <h1
            className="font-display font-bold text-[#EFEFED] leading-[0.91] tracking-[-0.01em] mb-7"
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          >
            Know Your<br />Mountain.
          </h1>
          <p className="text-[#EFEFED]/55 text-[17px] sm:text-[18px] max-w-[420px] leading-[1.7] mb-10 font-light">
            SlopeIQ turns your Slopes sessions into structured
            performance data. Upload a session. Understand what happened.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/signup')} className="btn-white">Upload free</button>
            <button onClick={() => navigate('/how-it-works')} className="btn-outline-white">How it works</button>
          </div>
        </motion.div>
      </div>

      <motion.span
        className="absolute bottom-10 right-10 text-[10px] tracking-[0.26em] uppercase text-[#EFEFED]/25 font-sans"
        style={{ writingMode: 'vertical-rl' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        Scroll
      </motion.span>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIER SPLIT — no cards, grid-gap divider, prose-forward
───────────────────────────────────────────────────────────── */
function TierSection() {
  return (
    <section className="bg-[#F2F2F0] py-24 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold text-ink mb-14"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.4rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}
          >
            Two ways to use it.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          {/* Free */}
          <Reveal className="bg-[#F2F2F0] p-10 sm:p-14 flex flex-col">
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted font-sans mb-7">Free</p>
            <h3
              className="font-display font-bold text-ink mb-4"
              style={{ fontSize: 'clamp(1.9rem, 3vw, 2.7rem)', lineHeight: 1.04 }}
            >
              Your session, raw.
            </h3>
            <p className="text-muted text-[16px] leading-[1.75] mb-10 flex-1">
              Upload a <code className="text-[13px] bg-[#E2E2DF] px-1.5 py-0.5 font-mono rounded-sm">.slopes</code> file
              and get every number from your day — speed, vertical, run count, distance,
              a run-by-run timeline. One session at a time. No history stored between uploads.
              No coaching. No score.
            </p>
            <Link to="/signup" className="btn-ghost self-start">Start free →</Link>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.08} className="bg-[#0D0E14] p-10 sm:p-14 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <p className="text-[11px] tracking-[0.22em] uppercase text-accent/70 font-sans mb-7">Pro — $10 / month</p>
            <h3
              className="font-display font-bold text-[#EFEFED] mb-4"
              style={{ fontSize: 'clamp(1.9rem, 3vw, 2.7rem)', lineHeight: 1.04 }}
            >
              Your season, coached.
            </h3>
            <p className="text-[#EFEFED]/50 text-[16px] leading-[1.75] mb-10 flex-1">
              Everything in Free, plus seven grounded coaching observations per session,
              a SlopeScore that tracks your performance across your whole season,
              a mountain coach that plans your day from your history,
              and permanent storage of every session you've ever uploaded.
            </p>
            <Link to="/pricing" className="btn-white self-start">Get Pro →</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   DEBRIEF — dark, full-bleed skier image
───────────────────────────────────────────────────────────── */
function DebriefSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#08090D]">
      <div className="absolute inset-0">
        <img
          src="/skier.jpg"
          alt="Skier driving a hard carving turn, spray of powder"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
          style={{ objectPosition: '65% center' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(8,9,13,1) 0%, rgba(8,9,13,0.90) 35%, rgba(8,9,13,0.50) 62%, transparent 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 py-24 w-full">
        <Reveal className="max-w-[500px]">
          <h2
            className="font-display font-bold text-[#EFEFED] leading-[1.00] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.2rem)' }}
          >
            Know what actually<br />happened.
          </h2>
          <p className="text-[#EFEFED]/52 text-[17px] leading-[1.75] mb-10">
            Free users get clean stats and a run-by-run timeline.
            Pro users get seven coaching observations grounded
            in their exact numbers — no generic advice, no guesswork.
          </p>
          <Link to="/signup" className="btn-white inline-flex">Try it free</Link>
        </Reveal>

        {/* Data readout — not a "card", just structured text */}
        <Reveal delay={0.14} className="mt-16 max-w-[340px]">
          <div className="border-l-2 border-[rgba(239,239,237,0.10)] pl-6">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#EFEFED]/20 font-sans mb-6">
              Killington · Jan 18
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
              {[['Top speed', '34.2 mph'], ['Vertical', '18,400 ft'], ['Runs', '14'], ['Ski time', '4h 22m']].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[11px] text-[#EFEFED]/25 mb-1 font-sans">{l}</p>
                  <p className="text-[20px] font-display font-bold text-[#EFEFED] leading-none">{v}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(239,239,237,0.07)] pt-5">
              <p className="text-[13px] text-[#EFEFED]/48 leading-[1.7]">
                Speed dropped <span className="text-[#EFEFED]/75 font-semibold">18%</span> between
                runs 7 and 10. Classic mid-session fade.
                Build a break after run 8.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SLOPESCORE — light section, minimal ring
───────────────────────────────────────────────────────────── */
function ScoreSection() {
  const C = 2 * Math.PI * 88;
  return (
    <section className="bg-[#F2F2F0] py-32 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <h2
            className="font-display font-bold text-ink tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)', lineHeight: 1.02 }}
          >
            One number.<br />A whole season<br />of context.
          </h2>
          <p className="text-muted text-[17px] leading-[1.75]">
            SlopeScore is 0–100, calibrated to your baseline across
            five performance dimensions. It grows when you ski better,
            flags when you fade, and means something different
            at every ability level. A 74 for a beginner and a 74
            for an expert are not the same score.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center">
          <div className="relative flex items-center justify-center w-[270px] h-[270px]">
            <svg viewBox="-108 -108 216 216" className="absolute inset-0 w-full h-full">
              <circle cx="0" cy="0" r="88" fill="none" stroke="rgba(13,14,20,0.06)" strokeWidth="8" />
              <circle
                cx="0" cy="0" r="88" fill="none"
                stroke="#0057FF" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - 0.78)}
                transform="rotate(-90)"
              />
              {Array.from({ length: 36 }, (_, i) => {
                const a = (-90 + i * 10) * Math.PI / 180;
                const isMajor = i % 9 === 0;
                const r1 = isMajor ? 94 : 96, r2 = 100;
                return (
                  <line key={i}
                    x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                    x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                    stroke={isMajor ? 'rgba(13,14,20,0.18)' : 'rgba(13,14,20,0.07)'}
                    strokeWidth={isMajor ? 1.5 : 0.75}
                  />
                );
              })}
            </svg>
            <div className="text-center z-10">
              <p className="text-[9px] tracking-[0.26em] uppercase text-accent font-sans mb-1.5">SlopeScore</p>
              <p className="font-display font-bold text-ink leading-none" style={{ fontSize: '4.8rem' }}>78</p>
              <p className="text-[12px] text-muted mt-1.5">+3 this session</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOUNTAIN COACH — dark, day-plan timing board
   (replaces generic chat-bubble UI)
───────────────────────────────────────────────────────────── */
function CoachSection() {
  const plan = [
    { time: '09:00', run: 'Rime + Snowdon', tag: 'warmup',          accent: false, dim: false },
    { time: '09:45', run: 'Superstar',       tag: 'peak window →',  accent: true,  dim: false },
    { time: '10:50', run: null,              tag: 'fatigue — rest', accent: false, dim: true  },
    { time: '11:25', run: 'Cascade',         tag: 'second block',   accent: false, dim: false },
    { time: '13:40', run: null,              tag: 'end session',    accent: false, dim: true  },
  ];

  return (
    <section className="bg-[#08090D] py-28 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-20 items-start">
        <Reveal>
          <h2
            className="font-display font-bold text-[#EFEFED] leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)', lineHeight: 1.02 }}
          >
            Your day, before<br />you click in.
          </h2>
          <p className="text-[#EFEFED]/48 text-[17px] leading-[1.75]">
            Tell it where you're skiing. It reads your session history,
            finds your fatigue window, and sequences your runs
            around it — peak terrain at peak energy,
            rest before you blow up.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Timing board — not chat bubbles */}
          <div className="border border-[rgba(239,239,237,0.08)]">
            <div className="px-5 py-3 border-b border-[rgba(239,239,237,0.06)] flex justify-between items-baseline">
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#EFEFED]/18 font-sans">Killington · Sat Jan 25</span>
              <span className="text-[10px] text-[#EFEFED]/12 font-sans">12 sessions</span>
            </div>

            {plan.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 border-b border-[rgba(239,239,237,0.04)] last:border-0
                  ${item.dim ? 'py-3 opacity-28' : 'py-4'}`}
              >
                <span className="text-[11px] font-mono text-[#EFEFED]/20 w-10 shrink-0 tabular-nums">
                  {item.time}
                </span>
                <span className={`font-display font-bold flex-1 leading-none ${
                  item.run ? 'text-[15px] text-[#EFEFED]' : 'text-[13px] text-[#EFEFED]/18'
                }`}>
                  {item.run ?? '—'}
                </span>
                <span className={`text-[11px] font-sans tracking-wide shrink-0 ${
                  item.accent ? 'text-accent' : 'text-[#EFEFED]/22'
                }`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#EFEFED]/15 mt-3 font-sans tracking-wide">
            Avg fatigue onset at Killington: run 9.2
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS — light background (breaks dark-dark-dark run)
───────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Export from Slopes', body: 'After skiing, export the .slopes file from the Slopes app. About 10 seconds.' },
    { n: '02', title: 'Upload to SlopeIQ',  body: 'Drop the file in. Every data point parsed — speed, vertical, run timing — in under 30 seconds.' },
    { n: '03', title: 'Read your debrief',  body: 'Free: clean stats and a run timeline. Pro: coached observations, SlopeScore update, day-plan for next time.' },
  ];

  return (
    <section className="bg-[#F2F2F0] py-24 px-6 sm:px-10">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold text-ink mb-16"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.4rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}
          >
            Three steps.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-line">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="bg-[#F2F2F0] p-8 sm:p-10">
              <p
                className="font-display font-bold text-ink/10 leading-none mb-8"
                style={{ fontSize: '3.5rem' }}
              >
                {s.n}
              </p>
              <h3
                className="font-display font-bold text-ink mb-3"
                style={{ fontSize: '1.45rem', lineHeight: 1.12 }}
              >
                {s.title}
              </h3>
              <p className="text-muted text-[15px] leading-[1.75]">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRICING — dark (pairs with dark CTA, no more light-dark flip)
───────────────────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section className="bg-[#08090D] py-28 px-6 sm:px-10">
      <div className="max-w-[860px] mx-auto">
        <Reveal>
          <h2
            className="font-display font-bold text-[#EFEFED] mb-16"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.4rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}
          >
            Simple pricing.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(239,239,237,0.07)]">
          {/* Free */}
          <Reveal className="bg-[#08090D] p-10 sm:p-12">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#EFEFED]/22 font-sans mb-5">Free</p>
            <p
              className="font-display font-bold text-[#EFEFED] leading-none mb-1"
              style={{ fontSize: '4.5rem' }}
            >
              $0
            </p>
            <p className="text-[#EFEFED]/28 text-[13px] mb-10">Forever. No card needed.</p>
            <ul className="space-y-2.5 text-[14px] text-[#EFEFED]/38 mb-12">
              {['One session at a time', 'Full raw stats', 'Run-by-run breakdown', 'Basic math observations'].map(f => (
                <li key={f} className="flex gap-3 items-start">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-[#EFEFED]/20 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-outline-white inline-flex">Get started</Link>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.1} className="bg-[#10111A] p-10 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <p className="text-[11px] tracking-[0.22em] uppercase text-accent/80 font-sans mb-5">Pro</p>
            <p
              className="font-display font-bold text-[#EFEFED] leading-none mb-1"
              style={{ fontSize: '4.5rem' }}
            >
              $10
            </p>
            <p className="text-[#EFEFED]/28 text-[13px] mb-10">per month</p>
            <ul className="space-y-2.5 text-[14px] text-[#EFEFED]/45 mb-12">
              {['Everything in Free', 'Unlimited uploads', 'Coached session debrief', 'SlopeScore + full history', 'Mountain Coach'].map(f => (
                <li key={f} className="flex gap-3 items-start">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-accent/60 shrink-0" />
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

/* ─────────────────────────────────────────────────────────────
   CTA — mountain image, parallax
───────────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);

  return (
    <section ref={ref} className="relative min-h-[78vh] flex items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/mountain.jpg"
          alt="Aerial panorama of the French Alps at dawn, peaks above cloud"
          className="w-full h-full object-cover opacity-48"
          style={{ objectPosition: 'center 38%', transform: 'scale(1.16)' }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(8,9,13,0.88) 0%, rgba(8,9,13,0.50) 55%, rgba(8,9,13,0.62) 100%)' }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 py-28 w-full text-center">
        <Reveal>
          <h2
            className="font-display font-bold text-[#EFEFED] mx-auto mb-7"
            style={{
              fontSize: 'clamp(3.2rem, 8vw, 7.5rem)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '14ch',
            }}
          >
            Your runs are talking.
          </h2>
          <p className="text-[#EFEFED]/48 text-[17px] max-w-[360px] mx-auto leading-[1.7] mb-10">
            Upload your first session for free. No credit card.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-white">Create your free account</Link>
            <Link to="/how-it-works" className="btn-outline-white">How it works</Link>
          </div>
          <p className="text-[#EFEFED]/20 text-[11px] mt-7 tracking-[0.16em] uppercase font-sans">
            Works with Slopes App
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
      <VideoHero />     {/* dark */}
      <TierSection />   {/* light */}
      <DebriefSection />{/* dark */}
      <ScoreSection />  {/* light */}
      <CoachSection />  {/* dark */}
      <HowItWorks />    {/* light — intentional break before dark-dark */}
      <PricingSection />{/* dark */}
      <CTASection />    {/* dark */}
    </div>
  );
}
