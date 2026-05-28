import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signUp(email, password);
      navigate('/dashboard/debrief');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <Link to="/" className="mb-10">
        <img src="/logo.svg" alt="SlopeIQ" className="h-7" />
      </Link>
      <div className="card p-8 w-full max-w-[400px] shadow-sm">
        <h1 className="text-[26px] font-semibold text-ink text-center tracking-tight">Create your account</h1>
        <p className="text-muted text-[14px] text-center mt-2">One free session — no credit card required</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-[13px] font-medium text-muted mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-coral/40 focus:ring-2 focus:ring-coral/10 transition-all"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-muted mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-coral/40 focus:ring-2 focus:ring-coral/10 transition-all"
            />
          </div>
          {error && <p className="text-red-500 text-[13px]">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 text-[15px]">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="text-muted-2 text-[12px] text-center mt-5 leading-relaxed">
          By continuing you agree to our{' '}
          <Link to="/terms" className="text-muted hover:text-ink transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-muted hover:text-ink transition-colors">Privacy Policy</Link>.
        </p>
        <p className="text-muted-2 text-[13px] text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-ink font-medium hover:text-coral transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
