import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/',             label: 'Home'         },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing',      label: 'Pricing'      },
];

export default function FloatingNav() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 40);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[58px] px-6 sm:px-10 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(13,14,20,0.07)' : '1px solid transparent',
      }}
    >
      <Link to="/" className="flex items-center shrink-0" aria-label="SlopeIQ">
        <img src="/logo.svg" alt="SlopeIQ" className="h-10" />
      </Link>

      <nav className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={[
              'px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200',
              pathname === to
                ? 'bg-ink/[0.07] text-ink font-semibold'
                : 'text-muted hover:text-ink hover:bg-ink/[0.05]',
            ].join(' ')}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 shrink-0">
        {user ? (
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-all"
            style={{ background: '#1B76DC', boxShadow: '0 2px 10px rgba(27,118,220,0.35)' }}
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            className="text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-all"
            style={{ background: '#1B76DC', boxShadow: '0 2px 10px rgba(27,118,220,0.35)' }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
