import { Link } from 'react-router-dom';
import SlopeScoreDisplay from '../components/SlopeScoreDisplay';

const FEATURES = [
  {
    label: 'Session Debrief',
    body: 'Upload your .slopes file. Get a full breakdown of your skiing with a SlopeScore and coaching observations that go beyond the obvious.',
  },
  {
    label: 'Mountain Coach',
    body: 'Tell it where you\'re skiing. It knows the trails, knows your ability level, and builds your optimal day before you even click in.',
  },
  {
    label: 'SlopeScore',
    body: 'Your personal performance index. Tracks consistency, fatigue management, vertical efficiency, and progression across every session you\'ve ever uploaded.',
  },
];

const DIMENSIONS = { consistency: 72, fatigue: 88, vertical: 65, progression: 55, recovery: 80 };

const STATS = [
  { value: '2,100+', label: 'Sessions Analyzed' },
  { value: '47', label: 'Resorts Covered' },
  { value: '∞', label: 'SlopeScore Tracking' },
];

const SCORE_DIMS = [
  { icon: '⟳', label: 'Consistency' },
  { icon: '⬇', label: 'Fatigue Management' },
  { icon: '▲', label: 'Vertical Efficiency' },
  { icon: '↑', label: 'Progression Rate' },
  { icon: '◎', label: 'Recovery Utilization' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-orb animate-orb" aria-hidden="true" />
        <svg className="absolute right-[-100px] bottom-[-60px] opacity-[0.06] pointer-events-none" width="420" height="420" viewBox="0 0 420 420" aria-hidden="true">
          <circle cx="210" cy="210" r="200" stroke="#f0f0ee" strokeWidth="1" fill="none" />
          <circle cx="210" cy="210" r="155" stroke="#f0f0ee" strokeWidth="1" fill="none" />
        </svg>
        <div className="relative max-w-[900px] mx-auto px-6 pt-28 pb-32 sm:pt-36 sm:pb-40 text-center stagger">
          <p className="eyebrow">AI Coaching for Skiers</p>
          <h1 className="font-serif text-[52px] sm:text-[68px] leading-[1.05] mt-5 text-ink">
            Understand every run.
            <br />
            <span className="italic text-coral/95">Ski better next time.</span>
          </h1>
          <p className="mt-6 text-muted text-[17px] sm:text-[18px] leading-relaxed max-w-[560px] mx-auto">
            Upload your Slopes session and get coaching that actually means something. SlopeIQ learns your skiing, tracks your progress, and tells you things your data was always hiding.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link to="/signup" className="btn-primary text-[16px] px-8 py-4">Start for free</Link>
            <p className="text-muted-2 text-[13px]">One free session. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <div className="max-w-[900px] mx-auto px-6 pb-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 border-t border-b border-line py-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-[32px] text-ink leading-none">{s.value}</p>
              <p className="text-muted-2 text-[13px] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature highlights */}
      <section className="max-w-[900px] mx-auto px-6 py-24">
        <p className="eyebrow text-center">Features</p>
        <h2 className="font-serif text-[40px] text-center mt-3 text-ink">Everything your data has been waiting for</h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.label} className="card p-7 hover:bg-elevated transition-all duration-200 hover:-translate-y-1">
              <h3 className="text-[18px] font-semibold text-ink">{f.label}</h3>
              <p className="text-muted text-[15px] mt-3 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SlopeScore explanation */}
      <section className="max-w-[900px] mx-auto px-6 py-24 border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow">SlopeScore</p>
            <h2 className="font-serif text-[40px] mt-3 text-ink leading-tight">A number that actually means something</h2>
            <p className="text-muted text-[16px] mt-5 leading-relaxed">
              SlopeScore is a 0–100 composite index calibrated to you — not a universal benchmark. It learns your baseline. A 74 for a beginner means something different than a 74 for an expert. It updates after every session and tracks five dimensions of performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {SCORE_DIMS.map(d => (
                <span key={d.label} className="flex items-center gap-1.5 text-[13px] text-muted bg-surface border border-line rounded-full px-3 py-1.5">
                  <span className="text-coral">{d.icon}</span> {d.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <SlopeScoreDisplay score={78} trend={3} dimensions={DIMENSIONS} tier="pro" size={220} />
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-[900px] mx-auto px-6 py-24 border-t border-line">
        <p className="eyebrow text-center">Pricing</p>
        <h2 className="font-serif text-[40px] text-center mt-3 text-ink">Simple, honest pricing</h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[620px] mx-auto">
          <div className="card p-7">
            <p className="text-[13px] text-muted uppercase tracking-wider">Free</p>
            <p className="font-serif text-[44px] text-ink mt-2">$0</p>
            <p className="text-muted text-[14px] mt-1">forever</p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-muted">
              {['One session upload', 'Full session stats', 'Single-session SlopeScore', 'Run-by-run breakdown'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-muted-2 mt-0.5">✓</span>{f}</li>
              ))}
            </ul>
            <Link to="/signup" className="btn-ghost w-full text-center mt-7 block py-3">Get started</Link>
          </div>
          <div className="card p-7 border-coral/30" style={{ boxShadow: '0 0 0 1px rgba(232,99,74,0.2), 0 0 30px rgba(232,99,74,0.07)' }}>
            <p className="text-[13px] text-coral uppercase tracking-wider">Pro</p>
            <p className="font-serif text-[44px] text-ink mt-2">$10</p>
            <p className="text-muted text-[14px] mt-1">per month</p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-muted">
              {['Everything in Free', 'Unlimited uploads', 'Full AI coaching debrief', 'SlopeScore history + trends', 'Mountain Coach'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-teal mt-0.5">✓</span>{f}</li>
              ))}
            </ul>
            <Link to="/pricing" className="btn-primary w-full text-center mt-7 block py-3">See full pricing</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-[900px] mx-auto px-6 py-28 text-center border-t border-line">
        <div className="cta-orb animate-orb" aria-hidden="true" />
        <h2 className="font-serif text-[44px] sm:text-[52px] text-ink relative z-10">
          Your skiing has data.
          <br />
          <span className="italic text-coral/90">Start using it.</span>
        </h2>
        <div className="mt-10 relative z-10">
          <Link to="/signup" className="btn-primary text-[16px] px-8 py-4">Create your free account</Link>
        </div>
      </section>
    </div>
  );
}
