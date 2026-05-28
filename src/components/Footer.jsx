import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#1F2025]">
      <div className="max-w-[1080px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/">
          <img src="/logo.svg" alt="SlopeIQ" className="h-6" />
        </Link>
        <p className="text-[12px] text-white/30">SlopeIQ is not affiliated with the Slopes app.</p>
        <div className="flex items-center gap-5 text-[12px] text-white/30">
          <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          <span>© 2026 SlopeIQ</span>
        </div>
      </div>
    </footer>
  );
}
