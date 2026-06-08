import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Landing page for the Supabase email-confirmation redirect.
// Supabase verifies the token server-side before redirecting here, so this page
// just reports success (or surfaces an error passed back in the URL).
function readUrlError() {
  const q = new URLSearchParams(window.location.search);
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const get = (k) => q.get(k) || h.get(k);
  const desc = get('error_description');
  const code = get('error') || get('error_code');
  if (!code && !desc) return null;
  return desc ? decodeURIComponent(desc.replace(/\+/g, ' ')) : 'This confirmation link is invalid or has expired.';
}

export default function EmailConfirmation() {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(readUrlError());
    // Tidy the URL so tokens/params aren't left in the address bar.
    window.history.replaceState({}, document.title, '/emailconfirmation');
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <Link to="/" className="mb-10">
        <img src="/logo.svg" alt="SlopeIQ" className="h-16" />
      </Link>

      <div className="card p-8 w-full max-w-[420px] shadow-sm text-center">
        {!error ? (
          <>
            <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-[26px] font-semibold text-ink tracking-tight">You're all set</h1>
            <p className="text-muted text-[15px] leading-relaxed mt-3">
              Your email is confirmed. Head back to the <span className="text-ink font-medium">SlopeIQ app</span> and sign in to start importing your sessions.
            </p>
            <Link to="/login" className="btn-primary w-full py-3 mt-7 inline-block text-[15px]">
              Sign in on the web
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h1 className="text-[26px] font-semibold text-ink tracking-tight">Confirmation failed</h1>
            <p className="text-muted text-[15px] leading-relaxed mt-3">{error}</p>
            <Link to="/signup" className="btn-primary w-full py-3 mt-7 inline-block text-[15px]">
              Back to sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
