import { Link } from 'react-router-dom';
import SlopeScoreDisplay from '../components/SlopeScoreDisplay';

const FEATURES = [
  {
    label: 'Session Debrief',
    body: 'Upload your .slopes file and get a full breakdown of your skiing — SlopeScore, AI coaching observations, and run-by-run analysis that goes beyond the obvious.',
  },
  {
    label: 'Mountain Coach',
    body: 'Tell it where you\'re skiing. It knows the trails, knows your ability level, and builds your optimal day — warmup runs, peak window, when to stop — before you even click in.',
  },
  {
    label: 'SlopeScore History',
    body: 'Your personal performance index, tracked across every session. Consistency, fatigue management, vertical efficiency, progression — all in one number that actually means something.',
  },
];

const STATS = [
  { value: '2,100+', label: 'Sessions Analyzed' },
  { value: '47', label: 'Resorts Covered' },
  { value: '5', label: 'Performance Dimensions' },
];

const DIMENSIONS = { consistency: 72, fatigue: 88, vertical: 65, progression: 55, recovery: 80 };

const SCORE_DIMS = [
  { label: 'Consistency' },
  { label: 'Fatigue Management' },
  { label: 'Vertical Efficiency' },
  { label: 'Progression Rate' },
  { label: 'Recovery Utilization' },
];

export default function Landing() {
  return (
    <div>

      {/* Hero */}
      <section className="max-w-[1040px] mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="stagger max-w-[720px]">
          <p className="eyebrow">AI Coaching for Skiers</p>
          <h1 className="text-[60px] sm:text-[80px] font-semibold leading-[1.0] tracking-tight mt-5 text-ink">
            Your ski data,<br />finally useful.
          </h1>
          <p className="mt-7 text-muted text-[18px] sm:text-[20px] leading-relaxed max-w-[540px]">
            Upload your Slopes session. Get coaching that goes beyond the numbers — SlopeScore, AI observations, and a Mountain Coach that knows your ability.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/signup" className="btn-primary text-[16px] px-8 py-4">Get started free</Link>
            <Link to="/how-it-works" className="btn-ghost text-[16px] px-8 py-4">How it works</Link>
          </div>
          <p className="mt-5 text-muted-2 text-[13px]">One free session. No credit card required.</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-line">
        <div className="max-w-[1040px] mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-20">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[40px] font-bold text-ink leading-none tracking-tight">{s.value}</p>
                <p className="text-muted-2 text-[13px] mt-1.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1040px] mx-auto px-6 py-24">
        <p className="eyebrow">Features</p>
        <h2 className="text-[42px] sm:text-[52px] font-semibold tracking-tight mt-4 text-ink leading-[1.05] max-w-[560px]">
          Everything your data has been waiting for.
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={f.label} className="card p-7 hover:shadow-md transition-shadow duration-200">
              <p className="text-[11px] font-semibold text-coral tracking-widest uppercase mb-4">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-[19px] font-semibold text-ink leading-snug">{f.label}</h3>
              <p className="text-muted text-[15px] mt-3 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SlopeScore */}
      <section className="border-t border-line">
        <div className="max-w-[1040px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow">SlopeScore</p>
              <h2 className="text-[42px] sm:text-[50px] font-semibold tracking-tight mt-4 text-ink leading-[1.05]">
                A number that actually means something.
              </h2>
              <p className="text-muted text-[17px] mt-6 leading-relaxed">
                SlopeScore is a 0–100 composite index calibrated to you — not a universal benchmark. It learns your baseline and updates after every session, tracking five dimensions of performance.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {SCORE_DIMS.map(d => (
                  <span key={d.label} className="text-[13px] font-medium text-muted bg-surface border border-line rounded-full px-3.5 py-1.5">
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <SlopeScoreDisplay score={78} trend={3} dimensions={DIMENSIONS} tier="pro" size={220} />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-line">
        <div className="max-w-[1040px] mx-auto px-6 py-24">
          <p className="eyebrow">Pricing</p>
          <h2 className="text-[42px] sm:text-[50px] font-semibold tracking-tight mt-4 text-ink leading-[1.05]">
            Simple, honest pricing.
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[640px]">
            <div className="card p-8">
              <p className="text-[12px] font-semibold text-muted-2 uppercase tracking-widest">Free</p>
              <p className="text-[52px] font-bold text-ink mt-3 leading-none tracking-tight">$0</p>
              <p className="text-muted text-[14px] mt-1.5">forever</p>
              <ul className="mt-7 space-y-3 text-[14px] text-muted">
                {['One session upload', 'Full session stats', 'Single-session SlopeScore', 'Run-by-run breakdown'].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-ink/8 flex items-center justify-center text-[10px] text-ink font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-ghost w-full text-center mt-8 block py-3 text-[15px]">Get started</Link>
            </div>
            <div className="card p-8 border-coral/20" style={{ boxShadow: '0 0 0 1px rgba(56,152,236,0.15), 0 4px 24px rgba(56,152,236,0.08)' }}>
              <p className="text-[12px] font-semibold text-coral uppercase tracking-widest">Pro</p>
              <p className="text-[52px] font-bold text-ink mt-3 leading-none tracking-tight">$10</p>
              <p className="text-muted text-[14px] mt-1.5">per month</p>
              <ul className="mt-7 space-y-3 text-[14px] text-muted">
                {['Everything in Free', 'Unlimited uploads', 'Full AI coaching debrief', 'SlopeScore history + trends', 'Mountain Coach'].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-coral/10 flex items-center justify-center text-[10px] text-coral font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="btn-primary w-full text-center mt-8 block py-3 text-[15px]">See full pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-surface">
        <div className="max-w-[1040px] mx-auto px-6 py-24 sm:py-32 text-center">
          <h2 className="text-[44px] sm:text-[60px] font-semibold tracking-tight text-ink leading-[1.05] max-w-[600px] mx-auto">
            Your skiing has data.<br />Start using it.
          </h2>
          <p className="mt-6 text-muted text-[18px] max-w-[420px] mx-auto leading-relaxed">
            Join skiers who know exactly what their data means.
          </p>
          <div className="mt-10">
            <Link to="/signup" className="btn-primary text-[16px] px-10 py-4">Create your free account</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
