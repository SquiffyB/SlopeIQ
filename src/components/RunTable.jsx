function fmt(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function RunTable({ timeline = [], peakRunNumber }) {
  if (!timeline.length) return <p className="text-muted text-[14px]">No runs detected in this session.</p>;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-muted-2 text-[11px] uppercase tracking-[0.18em] text-left">
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Vertical</th>
              <th className="px-5 py-3 font-medium">Avg Speed</th>
              <th className="px-5 py-3 font-medium">Top Speed</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((row, i) => {
              const isLift = row._type === 'lift';
              const isPeak = !isLift && row.runNumber === peakRunNumber;
              return (
                <tr key={i} className={`border-t border-line transition-colors ${isLift ? 'opacity-40' : 'hover:bg-white/[0.015]'}`}>
                  <td className="px-5 py-3 font-medium text-muted-2">
                    {isLift ? '↑' : (
                      <span className="flex items-center gap-2">
                        {row.runNumber}
                        {isPeak && <span className="text-[10px] uppercase tracking-wider text-coral bg-coral/10 px-2 py-0.5 rounded-full">Peak</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-2">{isLift ? 'Lift' : 'Run'}</td>
                  <td className="px-5 py-3 text-muted">{fmt(row.durationSec)}</td>
                  <td className="px-5 py-3">{isLift ? '—' : `${row.verticalFt.toLocaleString()} ft`}</td>
                  <td className="px-5 py-3">{isLift ? '—' : `${row.avgSpeedMph} mph`}</td>
                  <td className="px-5 py-3">{isLift ? '—' : `${row.topSpeedMph} mph`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
