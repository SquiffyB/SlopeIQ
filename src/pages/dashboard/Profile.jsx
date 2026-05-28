import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user, profile, getToken, signOut, refreshProfile } = useAuth();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const isPro = profile?.tier === 'pro';

  useEffect(() => {
    if (params.get('upgraded') === 'true') {
      setMsg('Welcome to Pro! Your account has been upgraded.');
      refreshProfile();
    }
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priceId: 'price_monthly_placeholder' }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      setMsg(`Checkout failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-16 space-y-8">
      <div>
        <p className="eyebrow">Account</p>
        <h1 className="font-serif text-[40px] mt-3 text-ink">Your profile</h1>
      </div>

      {msg && (
        <div className="card p-4 border-teal/30 text-teal text-[14px]">{msg}</div>
      )}

      {/* Account info */}
      <div className="card p-7 space-y-5">
        <div>
          <p className="eyebrow mb-1">Email</p>
          <p className="text-ink text-[16px]">{user?.email}</p>
        </div>
        <div>
          <p className="eyebrow mb-2">Plan</p>
          <div className="flex items-center gap-3">
            <span className={`text-[13px] font-medium px-3 py-1 rounded-full border ${isPro ? 'text-teal border-teal/30 bg-teal/10' : 'text-muted border-line bg-surface'}`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
            {profile?.free_session_used && !isPro && (
              <span className="text-muted-2 text-[13px]">Free session used</span>
            )}
          </div>
        </div>
      </div>

      {/* Plan management */}
      {!isPro ? (
        <div className="card p-7">
          <h3 className="text-ink font-semibold text-[18px] mb-2">Upgrade to Pro</h3>
          <p className="text-muted text-[15px] mb-5">Unlimited uploads, AI coaching, Mountain Coach, SlopeScore history, and more.</p>
          <button onClick={handleUpgrade} disabled={loading} className="btn-primary px-6 py-3">
            {loading ? 'Redirecting…' : 'Upgrade to Pro — $10/month'}
          </button>
          <p className="text-muted-2 text-[12px] mt-3">Annual plan available ($100/yr) — <Link to="/pricing" className="hover:text-muted underline">see pricing</Link></p>
        </div>
      ) : (
        <div className="card p-7">
          <h3 className="text-ink font-semibold text-[18px] mb-2">Pro subscription</h3>
          <p className="text-muted text-[15px] mb-5">Manage your subscription, update payment details, or cancel at any time.</p>
          <p className="text-muted-2 text-[13px]">To manage your subscription, contact support or visit your Stripe customer portal.</p>
        </div>
      )}

      {/* Sign out */}
      <div className="card p-7">
        <h3 className="text-ink font-semibold text-[18px] mb-2">Sign out</h3>
        <p className="text-muted text-[15px] mb-5">Sign out of your SlopeIQ account on this device.</p>
        <button onClick={signOut} className="btn-ghost px-6 py-3 border border-line">Sign out</button>
      </div>
    </div>
  );
}
