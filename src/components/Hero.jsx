export default function Hero({ onUploadClick }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="hero-orb animate-orb" aria-hidden="true" />

      <svg
        className="absolute right-[-120px] bottom-[-80px] opacity-[0.08] pointer-events-none"
        width="380"
        height="380"
        viewBox="0 0 380 380"
        aria-hidden="true"
      >
        <circle cx="190" cy="190" r="180" stroke="#f0f0ee" strokeWidth="1" fill="none" />
        <circle cx="190" cy="190" r="140" stroke="#f0f0ee" strokeWidth="1" fill="none" />
        <circle cx="190" cy="190" r="100" stroke="#f0f0ee" strokeWidth="1" fill="none" />
        <circle cx="190" cy="190" r="60" stroke="#f0f0ee" strokeWidth="1" fill="none" />
      </svg>

      <div className="relative max-w-[860px] mx-auto px-6 pt-24 pb-28 sm:pt-32 sm:pb-36 text-center stagger">
        <p className="eyebrow">AI Coaching for Skiers</p>
        <h1 className="font-serif text-[44px] sm:text-[64px] leading-[1.05] mt-5 text-ink">
          Understand every run.
          <br />
          <span className="italic text-coral/95">Ski better next time.</span>
        </h1>
        <p className="mt-6 text-muted text-[17px] sm:text-[18px] leading-relaxed max-w-[580px] mx-auto">
          Upload your Slopes session file and get data-first coaching on your
          vertical, speed, fatigue, and consistency.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <button type="button" onClick={onUploadClick} className="btn-primary">
            Upload your .slopes file
          </button>
          <p className="text-muted-2 text-[13px]">
            Free. No account required. Works with any Slopes export.
          </p>
        </div>
      </div>
    </section>
  );
}
