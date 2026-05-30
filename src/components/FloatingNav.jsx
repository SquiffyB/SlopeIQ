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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className="pointer-events-auto w-full max-w-[800px] flex items-center justify-between h-[52px] px-3 rounded-full transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(248,250,255,0.60)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          boxShadow: scrolled
            ? [
                '0 0 0 1px rgba(9,12,20,0.09)',
                '0 8px 32px rgba(9,12,20,0.10)',
                '0 2px 8px rgba(9,12,20,0.06)',
                'inset 0 1px 0 rgba(255,255,255,1)',
              ].join(', ')
            : [
                '0 0 0 1px rgba(9,12,20,0.06)',
                '0 4px 20px rgba(9,12,20,0.07)',
                'inset 0 1px 0 rgba(255,255,255,0.8)',
              ].join(', '),
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center pl-1.5 shrink-0" aria-label="SlopeIQ">
          <img src="/logo.svg" alt="SlopeIQ" className="h-[22px]" />
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={[
                'px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200',
                pathname === to
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-muted hover:text-ink hover:bg-black/[0.05]',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2 pr-1.5 shrink-0">
          {user ? (
            <Link
              to="/dashboard/debrief"
              className="text-[13px] font-semibold px-4 py-[7px] rounded-full bg-ink text-white hover:bg-ink/85 transition-all duration-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-[13px] font-medium text-muted hover:text-ink transition-colors duration-200 px-3"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-[13px] font-semibold px-4 py-[7px] rounded-full bg-accent text-white hover:bg-accent-dim transition-all duration-200"
                style={{ boxShadow: '0 2px 12px rgba(0,87,255,0.28)' }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
