function toXY(cx, cy, r, deg) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx, cy, r, startDeg, endDeg) {
  if (Math.abs(endDeg - startDeg) < 0.01) return '';
  const s = toXY(cx, cy, r, startDeg);
  const e = toXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

const DIMENSIONS = [
  { key: 'consistency', label: 'Consistency' },
  { key: 'fatigue', label: 'Fatigue Mgmt' },
  { key: 'vertical', label: 'Vertical Efficiency' },
  { key: 'progression', label: 'Progression' },
  { key: 'recovery', label: 'Recovery Utilization' },
];

export default function SlopeScoreDisplay({ score = 0, trend = null, dimensions = null, tier = 'free', size = 200 }) {
  const cx = size / 2, cy = size / 2 + 10;
  const r = size * 0.36;
  const sw = size * 0.07;
  const START = 135, SWEEP = 270;
  const fillEnd = START + SWEEP * (Math.max(0, Math.min(100, score)) / 100);
  const trackPath = arc(cx, cy, r, START, START + SWEEP);
  const fillPath = score > 0 ? arc(cx, cy, r, START, fillEnd) : '';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3898EC" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path d={trackPath} fill="none" stroke="rgba(31,32,37,0.08)" strokeWidth={sw} strokeLinecap="round" />
          {/* Fill */}
          {fillPath && <path d={fillPath} fill="none" stroke="url(#scoreGrad)" strokeWidth={sw} strokeLinecap="round" />}
          {/* Score */}
          <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.22} fontFamily="Inter, sans-serif" fill="#1F2025" fontWeight="700">
            {score}
          </text>
          <text x={cx} y={cy + size * 0.14} textAnchor="middle" fontSize={size * 0.07} fill="#94A3B8" fontFamily="Inter, sans-serif" letterSpacing="0.1em">
            SLOPESCORE
          </text>
          {trend !== null && (
            <text x={cx} y={cy + size * 0.24} textAnchor="middle" fontSize={size * 0.07} fill={trend >= 0 ? '#3898EC' : '#EF4444'} fontFamily="Inter, sans-serif">
              {trend >= 0 ? '+' : ''}{trend} this month
            </text>
          )}
        </svg>
      </div>

      {dimensions && (
        <div className="w-full space-y-3 max-w-sm">
          {DIMENSIONS.map((dim, i) => {
            const val = dimensions[dim.key] ?? 0;
            const locked = tier === 'free' && i > 1;
            return (
              <div key={dim.key} className="relative">
                {locked ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-muted-2 w-36 shrink-0">{dim.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-ink/5 relative overflow-hidden">
                      <div className="absolute inset-0 backdrop-blur-sm" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-coral bg-coral/10 px-2 py-0.5 rounded-full shrink-0">Pro</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-muted w-36 shrink-0">{dim.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-ink/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-coral to-teal transition-all duration-700" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-[13px] text-ink font-medium w-8 text-right shrink-0">{val}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
