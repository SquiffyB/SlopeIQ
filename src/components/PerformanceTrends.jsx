function BarChart({ runs, valueKey, label, unit, accent }) {
  if (!runs.length) return null;
  const values = runs.map(r => r[valueKey]);
  const max = Math.max(...values);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;

  const w = 560;
  const h = 160;
  const padX = 28;
  const padY = 24;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const barW = innerW / runs.length;

  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="text-ink text-[15px] font-medium">{label}</h4>
        <p className="text-muted-2 text-[12px]">
          avg {avg.toFixed(1)} {unit}
        </p>
      </div>
      <div className="table-scroll">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full min-w-[420px]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${label} chart`}
        >
          {/* Avg line */}
          <line
            x1={padX}
            x2={w - padX}
            y1={padY + innerH - (avg / max) * innerH}
            y2={padY + innerH - (avg / max) * innerH}
            stroke="rgba(255,255,255,0.18)"
            strokeDasharray="3 4"
          />
          {runs.map((r, i) => {
            const v = r[valueKey];
            const barH = max === 0 ? 0 : (v / max) * innerH;
            const x = padX + i * barW + barW * 0.18;
            const y = padY + innerH - barH;
            const bw = barW * 0.64;
            const isFar = Math.abs(v - avg) / (avg || 1) > 0.18;
            return (
              <g key={r.runNumber}>
                <rect
                  x={x}
                  y={y}
                  width={bw}
                  height={Math.max(barH, 2)}
                  rx="3"
                  fill={isFar ? accent : 'rgba(240,240,238,0.55)'}
                />
                <text
                  x={x + bw / 2}
                  y={h - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5d5d6b"
                >
                  {r.runNumber}
                </text>
                <text
                  x={x + bw / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={isFar ? '#e8634a' : '#8a8a9a'}
                >
                  {Math.round(v)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-muted-2 text-[11px] mt-2">
        Highlighted bars sit more than 18% from the session average.
      </p>
    </div>
  );
}

export default function PerformanceTrends({ runs }) {
  if (!runs.length) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <BarChart
        runs={runs}
        valueKey="avgSpeedMph"
        label="Avg speed by run"
        unit="mph"
        accent="#e8634a"
      />
      <BarChart
        runs={runs}
        valueKey="verticalFt"
        label="Vertical by run"
        unit="ft"
        accent="#4ecdc4"
      />
    </div>
  );
}
