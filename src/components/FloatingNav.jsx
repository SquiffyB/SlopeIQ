import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/pricing',      label: 'Pricing'      },
  { to: '/about',        label: 'About'         },
];

/* The SVG displacement filter creates the liquid-glass waviness in
   whatever is visible through the backdrop. Scale is intentionally
   small (3) — just enough to read as "glass", not a funhouse mirror. */
function NavGlassFilter() {
  return (
    <svg className="hidden absolute" aria-hidden="true">
      <defs>
        <filter
          id="nav-liquid"
          x="-10%" y="-50%"
          width="120%" height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.9"
            numOctaves="1"
            seed="3"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="0.8" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feComposite in="displaced" in2="displaced" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export default function FloatingNav() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Colours switch based on scroll position:
     – Over the dark hero image → light/transparent glass, white text
     – Scrolled into the light page  → opaque white glass, dark text  */
  const overHero = !scrolled;

  return (
    <>
      <NavGlassFilter />

      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[820px] relative">

          {/* ── Liquid-glass backdrop ── */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              backdropFilter: 'blur(22px) saturate(180%) url("#nav-liquid")',
              WebkitBackdropFilter: 'blur(22px) saturate(180%)',
            }}
          />

          {/* ── Glass surface ── */}
          <div
            className="relative flex items-center justify-between h-[52px] px-3 rounded-full transition-all duration-500"
            style={{
              background: overHero
                ? 'rgba(255,255,255,0.18)'
                : 'rgba(248,251,255,0.88)',
              boxShadow: overHero
                ? [
                    '0 0 0 1px rgba(255,255,255,0.35)',
                    '0 0 0 1.5px rgba(0,0,0,0.06)',
                    '0 8px 40px rgba(0,0,0,0.22)',
                    'inset 0 1.5px 0 rgba(255,255,255,0.55)',
                    'inset 0 -1px 0 rgba(0,0,0,0.08)',
                  ].join(', ')
                : [
                    '0 0 0 1px rgba(0,0,0,0.10)',
                    '0 0 0 2.5px rgba(255,255,255,0.80)',
                    '0 8px 32px rgba(0,0,0,0.13)',
                    '0 2px 8px rgba(0,0,0,0.07)',
                    'inset 0 1.5px 0 rgba(255,255,255,1)',
                    'inset 0 -1px 0 rgba(0,0,0,0.06)',
                  ].join(', '),
            }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center pl-1.5 shrink-0" aria-label="SlopeIQ">
              <img
                src="/logo.svg"
                alt="SlopeIQ"
                className={`h-[22px] transition-all duration-500 ${overHero ? 'brightness-0 invert' : ''}`}
              />
            </Link>

            {/* Nav links — hidden on mobile */}
            <nav className="hidden sm:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={[
                    'px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300',
                    pathname === to
                      ? overHero
                        ? 'bg-white/25 text-white'
                        : 'bg-black/[0.06] text-ink'
                      : overHero
                        ? 'text-white/80 hover:text-white hover:bg-white/18'
                        : 'text-muted hover:text-ink hover:bg-black/[0.05]',
                  ].join(' ')}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center gap-2 pr-1.5 shrink-0">
              {user ? (
                <Link
                  to="/dashboard/debrief"
                  className={[
                    'text-[13px] font-semibold px-4 py-[7px] rounded-full transition-all duration-300',
                    overHero
                      ? 'bg-white text-ink hover:bg-white/90'
                      : 'bg-ink text-white hover:bg-ink/85',
                  ].join(' ')}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={[
                      'text-[13px] font-medium transition-colors duration-300 px-3 hidden sm:block',
                      overHero ? 'text-white/80 hover:text-white' : 'text-muted hover:text-ink',
                    ].join(' ')}
                  >
                    Log in
                  </Link>

                  {/* "Get started" — pill with inner glass rim */}
                  <Link
                    to="/signup"
                    className={[
                      'relative text-[13px] font-semibold px-4 py-[7px] rounded-full transition-all duration-300 overflow-hidden',
                      overHero
                        ? 'bg-white text-ink hover:bg-white/90'
                        : 'bg-ink text-white hover:bg-ink/85',
                    ].join(' ')}
                    style={{
                      boxShadow: overHero
                        ? 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.08)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.25)',
                    }}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
