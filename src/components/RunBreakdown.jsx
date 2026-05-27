function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function RunBreakdown({ runs, peakRunNumber }) {
  if (!runs.length) {
    return (
      <p className="text-muted text-[14px]">No runs were detected in this session.</p>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="table-scroll">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-left text-muted-2 text-[11px] uppercase tracking-[0.18em]">
              <th className="px-5 py-3 font-medium">Run</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Vertical</th>
              <th className="px-5 py-3 font-medium">Avg Speed</th>
              <th className="px-5 py-3 font-medium">Top Speed</th>
              <th className="px-5 py-3 font-medium">Effort</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(r => {
              const effort = r.topSpeedMph > 0 ? Math.round((r.avgSpeedMph / r.topSpeedMph) * 100) : 0;
              const isPeak = r.runNumber === peakRunNumber;
              return (
                <tr
                  key={r.runNumber}
                  className="border-t border-line text-ink/90 hover:bg-white/[0.015] transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium">
                    <span className="inline-flex items-center gap-2">
                      {r.runNumber}
                      {isPeak && (
                        <span className="text-[10px] uppercase tracking-wider text-coral bg-coral/10 px-2 py-0.5 rounded-full">
                          Peak
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{formatDuration(r.durationSec)}</td>
                  <td className="px-5 py-3.5">{r.verticalFt.toLocaleString()} ft</td>
                  <td className="px-5 py-3.5">{r.avgSpeedMph} mph</td>
                  <td className="px-5 py-3.5">{r.topSpeedMph} mph</td>
                  <td className="px-5 py-3.5 text-muted">{effort}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
