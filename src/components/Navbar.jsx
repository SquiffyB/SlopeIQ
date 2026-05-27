import Logo from './Logo.jsx';

export default function Navbar({ onUploadClick }) {
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-line">
      <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center" aria-label="SlopeIQ home">
          <Logo />
        </a>
        <nav className="flex items-center gap-5">
          <a href="#how-it-works" className="btn-ghost hidden sm:inline-flex">
            How it works
          </a>
          <button
            type="button"
            onClick={onUploadClick}
            className="btn-primary text-[14px] px-5 py-2.5"
          >
            Upload your session
          </button>
        </nav>
      </div>
    </header>
  );
}
