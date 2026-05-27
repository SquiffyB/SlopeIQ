import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FREE_FEATURES = [
  'Full session data overview (vertical, runs, top speed, time on mountain)',
  'Run-by-run breakdown table with lift rows',
  'Ski time vs. lift time ratio',
  'Basic SlopeScore (single session only, not tracked over time)',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited session uploads',
  'Full AI coaching debrief (5–7 personalized observations)',
  'SlopeScore tracked over time with trend chart',
  'All 5 SlopeScore dimensions broken down per session',
  'Optimal Day Planner — runs, timing, breaks, fatigue cutoff',
  'Mountain Coach — conversational AI with live trail data',
  'Session history with searchable archive',
  'Cross-session pattern detection',
  'Pre-session recommendations by resort',
];

const FAQS = [
  {
    q: 'What is a .slopes file?',
    a: 'A .slopes file is an export from the Slopes ski tracking app. To get one: open Slopes, go to any session, tap the share/export button, and choose .slopes (Active Times). The file contains your full session data — every run, every lift, speed, vertical, and timestamps.',
  },
  {
    q: 'Does SlopeIQ store my GPS data?',
    a: 'No. Your raw GPS data never leaves your device. SlopeIQ parses the .slopes file in your browser and sends only derived metrics (speeds, vertical totals, run durations) to the AI for coaching. Your location data is never transmitted or stored.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your Profile page and your subscription ends at the next billing cycle. You keep Pro access until the end of the period you\'ve paid for.',
  },
  {
    q: 'What ski apps does this work with?',
    a: 'SlopeIQ works with .slopes files exported from the Slopes app (iOS). Other ski tracking apps use different formats — we plan to support additional export formats in the future.',
  },
  {
    q: 'How does SlopeScore get calculated?',
    a: 'SlopeScore is a weighted composite of five dimensions: Consistency Index (standard deviation of avg speeds across runs), Fatigue Management (first-half vs second-half speed comparison), Vertical Efficiency (feet of vertical per minute of ski time), Progression Rate (improvement across sessions), and Recovery Utilization (correlation between lift duration and next run performance). Each dimension is 0–100 and weighted into a single composite score.',
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { user, getToken } = useAuth();

  async function handleUpgrade() {
    if (!user) { window.location.href = '/signup'; return; }
    const token = await getToken();
    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ priceId: annual ? 'price_annual_placeholder' : 'price_monthly_placeholder' }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="eyebrow">Pricing</p>
        <h1 className="font-serif text-[52px] mt-4 text-ink">Simple, honest pricing</h1>
        <p className="text-muted mt-4 text-[17px]">One free session. Unlimited everything on Pro.</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3 mt-8 bg-surface border border-line rounded-full p-1">
          <button onClick={() => setAnnual(false)} className={`px-4 py-1.5 rounded-full text-[14px] transition-all ${!annual ? 'bg-coral text-white' : 'text-muted hover:text-ink'}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-1.5 rounded-full text-[14px] transition-all ${annual ? 'bg-coral text-white' : 'text-muted hover:text-ink'}`}>
            Annual <span className="text-teal ml-1">2 months free</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[700px] mx-auto">
        {/* Free */}
        <div className="card p-8 flex flex-col">
          <div>
            <p className="text-[13px] text-muted-2 uppercase tracking-wider">Free</p>
            <p className="font-serif text-[48px] text-ink mt-3 leading-none">$0</p>
            <p className="text-muted-2 text-[14px] mt-1">forever</p>
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-[14px] text-muted">
                <span className="text-muted-2 mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="btn-ghost mt-8 text-center py-3 w-full block">Get started free</Link>
        </div>

        {/* Pro */}
        <div className="card p-8 flex flex-col" style={{ border: '1px solid rgba(232,99,74,0.3)', boxShadow: '0 0 40px rgba(232,99,74,0.07)' }}>
          <div>
            <p className="text-[13px] text-coral uppercase tracking-wider">Pro</p>
            <div className="flex items-baseline gap-1 mt-3">
              <p className="font-serif text-[48px] text-ink leading-none">${annual ? '8' : '10'}</p>
              <p className="text-muted-2 text-[14px]">/month{annual ? ', billed annually' : ''}</p>
            </div>
            {annual && <p className="text-teal text-[13px] mt-1">$100/year — save $20</p>}
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-[14px] text-muted">
                <span className="text-teal mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
          <button onClick={handleUpgrade} className="btn-primary mt-8 w-full py-3">
            Upgrade to Pro
          </button>
          <p className="text-muted-2 text-[12px] text-center mt-2">Cancel anytime.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-24 border-t border-line pt-16 max-w-[640px] mx-auto">
        <p className="eyebrow mb-8 text-center">Common questions</p>
        <div className="space-y-1">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-line">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left py-5 flex items-center justify-between gap-4"
              >
                <span className="text-ink text-[16px] font-medium">{faq.q}</span>
                <span className={`text-coral shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <p className="text-muted text-[15px] leading-relaxed pb-5">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
