import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import FloatingNav from './components/FloatingNav';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmailConfirmation from './pages/EmailConfirmation';

// On navigation: scroll to the hash target (section) if present, else to the top.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo(0, 0);
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <FloatingNav />
      {children}
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MarketingLayout><Landing /></MarketingLayout>} />
      <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/emailconfirmation" element={<EmailConfirmation />} />
      {/* One-page site: these legacy paths jump to the matching section */}
      <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
      <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
      <Route path="/about" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
