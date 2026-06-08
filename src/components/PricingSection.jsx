import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const BLUE = '#1B76DC';
const INK = '#0B2039';
const MUTED = '#52546A';
const LINE = 'rgba(11,32,57,0.08)';

const FREE = [
  'Full session debrief on every import — unlimited, free forever',
  'Vertical-first breakdown: vertical, descent rate, ski time',
  'Every stat: top speed, runs, distance, lift time, avg vertical',
  'Vertical-by-run and top-speed charts',
  'Run-by-run timeline',
];

const PRO = [
  'Everything in Free',
  'SlopeScore — your 0–100 rating, graded against your own baseline',
  'Five-dimension breakdown: fatigue, consistency, vertical, progression, recovery',
  'AI Mountain Coach — chat that knows your sessions',
  'Saved session history, synced across devices',
];

export default function PricingSection() {
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
    <section id="pricing" className="py-32 px-6" style={{ background: '#F5F5F3' }}>
      <div className="max-w-[860px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[12px] tracking-[0.22em] uppercase font-semibold" style={{ color: BLUE }}>Pricing</p>
          <h2 className="font-display font-bold mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.02, color: INK }}>
            Free to ski. Pro to improve.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] max-w-[500px] mx-auto" style={{ color: MUTED }}>
            Every session debrief is free and unlimited. Pro adds your SlopeScore and the AI Mountain Coach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[720px] mx-auto items-start">
          <div className="rounded-2xl p-8 flex flex-col bg-white" style={{ border: `1px solid ${LINE}` }}>
            <p className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: MUTED }}>Free</p>
            <div className="flex items-baseline gap-1 mt-3">
              <p className="font-display font-bold leading-none" style={{ fontSize: '3rem', color: INK }}>$0</p>
              <p className="text-[14px]" style={{ color: MUTED }}>forever</p>
            </div>
            <ul className="mt-7 space-y-3 flex-1">
              {FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ color: MUTED }}>
                  <span className="shrink-0 mt-0.5" style={{ color: MUTED }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="#download" className="mt-8 text-center py-3 w-full block rounded-xl text-[15px] font-semibold"
              style={{ border: `1.5px solid ${LINE}`, color: INK }}>
              Get the app
            </a>
          </div>

          <div className="rounded-2xl p-8 flex flex-col bg-white" style={{ border: `1.5px solid ${BLUE}40`, boxShadow: `0 0 44px ${BLUE}14` }}>
            <p className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: BLUE }}>Pro</p>
            <div className="flex items-baseline gap-1 mt-3">
              <p className="font-display font-bold leading-none" style={{ fontSize: '3rem', color: INK }}>$10</p>
              <p className="text-[14px]" style={{ color: MUTED }}>/month</p>
            </div>
            <ul className="mt-7 space-y-3 flex-1">
              {PRO.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ color: MUTED }}>
                  <span className="shrink-0 mt-0.5" style={{ color: BLUE }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={handleUpgrade} className="mt-8 w-full py-3 rounded-xl text-[15px] font-semibold text-white"
              style={{ background: BLUE, boxShadow: `0 4px 16px ${BLUE}40` }}>
              Upgrade to Pro
            </button>
            <p className="text-[12px] text-center mt-2.5" style={{ color: MUTED }}>Cancel anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
