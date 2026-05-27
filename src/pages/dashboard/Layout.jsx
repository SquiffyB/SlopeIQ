import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const isPro = profile?.tier === 'pro';

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-line">
        <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center">
            <img src="/logo.svg" alt="SlopeIQ" className="h-8" />
          </NavLink>

          <nav className="hidden sm:flex items-center gap-6">
            {[
              { to: '/dashboard/debrief', label: 'Debrief' },
              { to: '/dashboard/coach', label: 'Coach', proOnly: true },
              { to: '/dashboard/history', label: 'History', proOnly: true },
            ].map(({ to, label, proOnly }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[14px] transition-colors flex items-center gap-1.5 ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
                }
              >
                {label}
                {proOnly && !isPro && (
                  <span className="text-[9px] uppercase tracking-wider text-muted-2 bg-surface border border-line rounded-full px-1.5 py-0.5">Pro</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className={`text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full border ${isPro ? 'text-teal border-teal/30 bg-teal/10' : 'text-muted-2 border-line bg-surface'}`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
            <NavLink to="/dashboard/profile">
              <div className="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-[13px] text-muted hover:border-coral/30 transition-colors">
                {user?.email?.[0]?.toUpperCase() ?? '?'}
              </div>
            </NavLink>
            <button onClick={handleSignOut} className="text-[13px] text-muted-2 hover:text-muted transition-colors hidden sm:block">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
