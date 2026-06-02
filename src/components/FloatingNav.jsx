import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/pricing',      label: 'Pricing'      },
  { to: '/about',        label: 'About'         },
];

export default function FloatingNav() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    const check = () => {
      // Hero is 100vh — switch appearance once past 85% of viewport height
      setOnDark(window.scrollY < window.innerHeight * 0.85);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-[64px] px-6 sm:px-10 pointer-events-none">
      {/* Logo */}
      <Link to="/" className="pointer-events-auto flex items-center shrink-0" aria-label="SlopeIQ">
        <img
          src="/logo.svg"
          alt="SlopeIQ"
          className={`h-[22px] transition-all duration-500 ${onDark ? 'brightness-0 invert' : ''}`}
        />
      </Link>

      {/* Center nav */}
      <nav className="pointer-events-auto hidden sm:flex items-center gap-1">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={[
              'px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300',
              pathname === to
                ? onDark
                  ? 'bg-white/15 text-white'
                  : 'bg-ink/[0.07] text-ink'
                : onDark
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-muted hover:text-ink hover:bg-ink/[0.05]',
            ].join(' ')}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Auth */}
      <div className="pointer-events-auto flex items-center gap-3 shrink-0">
        {user ? (
          <Link
            to="/dashboard/debrief"
            className={`text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-300 ${
              onDark ? 'bg-white text-ink hover:bg-white/90' : 'bg-ink text-white hover:bg-ink/85'
            }`}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className={`hidden sm:block text-[13px] font-medium transition-colors duration-300 ${
                onDark ? 'text-white/70 hover:text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className={`text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-300 ${
                onDark
                  ? 'bg-white text-ink hover:bg-white/90'
                  : 'bg-ink text-white hover:bg-ink/85'
              }`}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
