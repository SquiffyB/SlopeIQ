import { Link } from 'react-router-dom';

const FEATURES = [
  'Unlimited session uploads',
  'Full AI coaching debrief (5–7 personalized observations)',
  'SlopeScore tracked over time with trend chart',
  'All 5 SlopeScore dimensions per session',
  'Mountain Coach — conversational AI with live trail data',
  'Optimal Day Planner: runs, timing, fatigue cutoff',
  'Cross-session pattern detection',
  'Pre-session recommendations by resort',
];

export default function UpgradePrompt({ feature = 'this feature', compact = false }) {
  if (compact) {
    return (
      <div className="card p-6 text-center border-coral/20">
        <p className="text-ink font-semibold mb-1">Pro required</p>
        <p className="text-muted text-[14px] mb-4">{feature} is available on the Pro plan.</p>
        <Link to="/pricing" className="btn-primary text-[14px] px-5 py-2.5">Upgrade to Pro — $10/mo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-[480px] w-full text-center">
        <div className="cta-orb animate-orb" aria-hidden="true" />
        <p className="eyebrow mb-3">Pro plan</p>
        <h2 className="font-serif text-[36px] sm:text-[44px] text-ink mb-4">
          Unlock the full platform
        </h2>
        <p className="text-muted text-[16px] leading-relaxed mb-8">
          {feature} requires a Pro subscription. Get unlimited uploads, AI coaching, Mountain Coach, and SlopeScore history.
        </p>
        <ul className="text-left space-y-2.5 mb-8">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-3 text-[15px] text-muted">
              <span className="text-teal mt-0.5 shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Link to="/pricing" className="btn-primary">Upgrade to Pro — $10/month</Link>
        <p className="text-muted-2 text-[12px] mt-3">Cancel anytime. No commitments.</p>
      </div>
    </div>
  );
}
