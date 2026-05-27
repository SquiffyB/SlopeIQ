export default function CoachingOutput({ observations, note }) {
  if (!observations?.length) return null;
  return (
    <div className="stagger space-y-3">
      {observations.map((o, i) => (
        <div key={i} className="card p-5 sm:p-6">
          <div className="flex items-baseline gap-3">
            <span className="text-coral font-medium text-[12px] tracking-[0.18em] uppercase shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h4 className="text-ink text-[16px] font-medium">{o.label}</h4>
              <p className="text-muted text-[15px] mt-1.5 leading-relaxed">
                {o.observation}
              </p>
            </div>
          </div>
        </div>
      ))}
      {note && (
        <p className="text-muted-2 text-[12px] pt-2 text-center">{note}</p>
      )}
    </div>
  );
}
