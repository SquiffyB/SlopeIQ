import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-[1080px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted-2">
        <Link to="/">
          <img src="/logo.svg" alt="SlopeIQ" className="h-6" />
        </Link>
        <p>SlopeIQ is not affiliated with the Slopes app.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-muted transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-muted transition-colors">Terms of Service</Link>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="text-center text-muted-2 text-[11px] py-4">© 2025 SlopeIQ</p>
      </div>
    </footer>
  );
}
