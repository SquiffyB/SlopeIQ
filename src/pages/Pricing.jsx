import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BLUE = '#1B76DC';
const INK = '#0B2039';
const MUTED = '#52546A';
const LINE = 'rgba(11,32,57,0.08)';

const FREE_FEATURES = [
  'Full session debrief on every import — unlimited, free forever',
  'Vertical-first breakdown: vertical, descent rate, ski time',
  'Every stat: top speed, runs, distance, lift time, avg vertical',
  'Vertical-by-run and top-speed charts',
  'Run-by-run timeline',
  'Plain-language insights pulled from your numbers',
];

const PRO_FEATURES = [
  'Everything in Free',
  'SlopeScore — your 0–100 rating, graded against your own baseline',
  'Five-dimension breakdown: fatigue, consistency, vertical, progression, recovery',
  'AI Mountain Coach — chat that knows your sessions',
  "Coach's read on every session",
  'Saved session history, synced across your devices',
];

const FAQS = [
  {
    q: 'What is a .slopes file?',
    a: 'A .slopes file is an export from the Slopes ski-tracking app. Open Slopes, go to any session, tap share/export, and choose .slopes. It contains your full session — every run and lift, speed, vertical, and timestamps.',
  },
  {
    q: 'What do I get for free?',
    a: 'Everything except the SlopeScore and the Mountain Coach. Every session you import gives you the complete debrief — vertical, stats, charts, run timeline, and insights — unlimited, with no per-session limit.',
  },
  {
    q: 'What does Pro add?',
    a: 'Pro unlocks your SlopeScore (a 0–100 rating calibrated to your own baseline across five dimensions) and the AI Mountain Coach you can chat with, plus saved session history across devices.',
  },
  {
    q: 'Does SlopeIQ store my GPS data?',
    a: 'No. Your raw GPS data never leaves your device. SlopeIQ parses the .slopes file on-device and only stores derived metrics (speeds, vertical totals, run durations) to power your debrief and score.',
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes. Cancel anytime and you keep Pro until the end of the billing period you've paid for.",
  },
  {
    q: 'How is SlopeScore calculated?',
    a: 'It is a weighted composite of five dimensions: fatigue resistance (first vs. second-half pace), consistency (speed variance run to run), vertical efficiency (feet per minute of ski time), progression (trend across sessions), and recovery use (how rest translates to performance). Each is 0–100, and the score is graded against your own history.',
  },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);
  const { user, getToken } = useAuth();

  async function handleUpgrade() {
    if (!user) { window.location.href = '/login'; return; }
    const token = await getToken();
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ priceId: 'price_monthly_placeholder' }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div style={{ background: '#F5F5F3' }}>
      <div className="max-w-[900px] mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-14">
          <p className="text-[12px] tracking-[0.22em] uppercase font-semibold" style={{ color: BLUE }}>Pricing</p>
          <h1 className="font-display font-bold mt-4" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', lineHeight: 1.02, color: INK }}>
            Free to ski.<br />Pro to improve.
          </h1>
          <p className="mt-5 text-[18px] leading-[1.6] max-w-[520px] mx-auto" style={{ color: MUTED }}>
            Every session debrief is free and unlimited. Pro adds your SlopeScore and the AI Mountain Coach.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[760px] mx-auto items-start">
          {/* Free */}
          <div className="rounded-2xl p-8 flex flex-col bg-white" style={{ border: `1px solid ${LINE}` }}>
            <p className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: MUTED }}>Free</p>
            <div className="flex items-baseline gap-1 mt-3">
              <p className="font-display font-bold leading-none" style={{ fontSize: '3rem', color: INK }}>$0</p>
              <p className="text-[14px]" style={{ color: MUTED }}>forever</p>
            </div>
            <ul className="mt-7 space-y-3 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ color: MUTED }}>
                  <span className="shrink-0 mt-0.5" style={{ color: MUTED }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="/" className="mt-8 text-center py-3 w-full block rounded-xl text-[15px] font-semibold transition-colors"
              style={{ border: `1.5px solid ${LINE}`, color: INK }}>
              Get the app
            </a>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-8 flex flex-col bg-white" style={{ border: `1.5px solid ${BLUE}40`, boxShadow: `0 0 44px ${BLUE}14` }}>
            <p className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: BLUE }}>Pro</p>
            <div className="flex items-baseline gap-1 mt-3">
              <p className="font-display font-bold leading-none" style={{ fontSize: '3rem', color: INK }}>$10</p>
              <p className="text-[14px]" style={{ color: MUTED }}>/month</p>
            </div>
            <ul className="mt-7 space-y-3 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ color: MUTED }}>
                  <span className="shrink-0 mt-0.5" style={{ color: BLUE }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={handleUpgrade} className="mt-8 w-full py-3 rounded-xl text-[15px] font-semibold text-white transition-all"
              style={{ background: BLUE, boxShadow: `0 4px 16px ${BLUE}40` }}>
              Upgrade to Pro
            </button>
            <p className="text-[12px] text-center mt-2.5" style={{ color: MUTED }}>Cancel anytime.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 border-t pt-16 max-w-[640px] mx-auto" style={{ borderColor: LINE }}>
          <p className="text-[12px] tracking-[0.22em] uppercase font-semibold mb-8 text-center" style={{ color: BLUE }}>Common questions</p>
          <div className="space-y-1">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b" style={{ borderColor: LINE }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-5 flex items-center justify-between gap-4"
                >
                  <span className="text-[16px] font-semibold" style={{ color: INK }}>{faq.q}</span>
                  <span className={`shrink-0 text-[20px] transition-transform ${openFaq === i ? 'rotate-45' : ''}`} style={{ color: BLUE }}>+</span>
                </button>
                {openFaq === i && (
                  <p className="text-[15px] leading-relaxed pb-5" style={{ color: MUTED }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
