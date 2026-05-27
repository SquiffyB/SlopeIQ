import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard/debrief');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="hero-orb animate-orb opacity-40" aria-hidden="true" />
      <Link to="/" className="mb-10">
        <img src="/logo.svg" alt="SlopeIQ" className="h-8" />
      </Link>
      <div className="card p-8 w-full max-w-[400px] relative z-10">
        <h1 className="font-serif text-[28px] text-ink text-center">Welcome back</h1>
        <p className="text-muted text-[14px] text-center mt-2">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-[13px] text-muted-2 mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-coral/40 transition-colors" />
          </div>
          <div>
            <label className="text-[13px] text-muted-2 mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-coral/40 transition-colors" />
          </div>
          {error && <p className="text-coral text-[13px]">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-muted-2 text-[13px] text-center mt-6">
          Don't have an account? <Link to="/signup" className="text-ink hover:text-coral transition-colors">Get started free</Link>
        </p>
      </div>
    </div>
  );
}
