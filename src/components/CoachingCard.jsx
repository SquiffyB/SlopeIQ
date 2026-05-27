export default function CoachingCard({ observations = [], note = null }) {
  if (!observations.length) return null;
  return (
    <div className="space-y-3">
      {observations.map((o, i) => (
        <div key={i} className="card p-5 sm:p-6 hover:bg-elevated transition-colors duration-200">
          <div className="flex items-baseline gap-4">
            <span className="text-coral font-medium text-[12px] tracking-[0.18em] uppercase shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h4 className="text-ink text-[16px] font-semibold">{o.label}</h4>
              <p className="text-muted text-[15px] mt-1.5 leading-relaxed">{o.observation}</p>
            </div>
          </div>
        </div>
      ))}
      {note && <p className="text-muted-2 text-[12px] text-center pt-1">{note}</p>}
    </div>
  );
}
