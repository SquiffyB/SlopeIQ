export default function Logo({ size = 28, showWordmark = true }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <img src="/logo.svg" alt="SlopeIQ logo" width={size} height={size} style={{ display: 'block' }} />
      {showWordmark && (
        <span className="text-ink text-[17px] font-medium tracking-tight">
          slopeiq
        </span>
      )}
    </div>
  );
}
