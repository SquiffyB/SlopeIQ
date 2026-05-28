import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-line">
      <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="SlopeIQ">
          <img src="/logo.svg" alt="SlopeIQ" className="h-7" />
        </Link>
        <nav className="hidden sm:flex items-center gap-7">
          {[
            { to: '/how-it-works', label: 'How it Works' },
            { to: '/pricing', label: 'Pricing' },
            { to: '/about', label: 'About' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-[14px] font-medium transition-colors ${pathname === to ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard/debrief" className="btn-primary text-[14px] px-5 py-2.5">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-[14px] px-5 py-2.5">Log in</Link>
              <Link to="/signup" className="btn-primary text-[14px] px-5 py-2.5">Get started free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
