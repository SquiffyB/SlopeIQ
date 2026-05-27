export default function Logo({ size = 28, showWordmark = true }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-label="SlopeIQ logo"
      >
        <path
          d="M22 10c-1.6-1.4-3.6-2-5.6-1.8-2.4.3-4 1.9-4 3.7 0 1.7 1.3 2.6 3.7 3.1l2.2.5c1.3.3 1.9.8 1.9 1.5 0 .9-1 1.5-2.5 1.5-2 0-3.5-.8-4.5-2"
          stroke="#e8634a"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="22.2" cy="20.5" r="1.6" fill="#e8634a" />
      </svg>
      {showWordmark && (
        <span className="text-ink text-[17px] font-medium tracking-tight">
          slopeiq
        </span>
      )}
    </div>
  );
}
