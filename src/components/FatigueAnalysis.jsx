export default function FatigueAnalysis({ fatigue, runs }) {
  const peak = runs.find(r => r.runNumber === fatigue.peakRunNumber) || runs[0];
  const dropped = fatigue.changePercent < 0;
  const consistent = Math.abs(fatigue.changePercent) < 4;
  const pct = Math.abs(fatigue.changePercent);

  const message = consistent
    ? 'Consistent energy throughout your session.'
    : dropped
      ? `Your average speed dropped ${pct}% in the second half.`
      : `You actually picked up ${pct}% in the second half.`;

  return (
    <div className="card p-6 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="eyebrow">First half avg</p>
          <p className="font-serif text-[36px] text-ink mt-2 leading-none">
            {fatigue.firstHalfAvgSpeedMph}
            <span className="text-muted-2 text-[16px] ml-1">mph</span>
          </p>
        </div>
        <div>
          <p className="eyebrow">Second half avg</p>
          <p className="font-serif text-[36px] text-ink mt-2 leading-none">
            {fatigue.secondHalfAvgSpeedMph}
            <span className="text-muted-2 text-[16px] ml-1">mph</span>
          </p>
        </div>
        <div>
          <p className="eyebrow">Best run</p>
          <p className="font-serif text-[36px] text-ink mt-2 leading-none">
            #{peak?.runNumber ?? '–'}
            {peak && (
              <span className="text-muted-2 text-[14px] ml-2">
                {peak.topSpeedMph} mph top
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="divider my-7" />

      <p className="text-ink text-[16px] leading-relaxed">
        <span className={consistent ? 'text-teal' : dropped ? 'text-coral' : 'text-teal'}>
          {message}
        </span>{' '}
        <span className="text-muted">
          {consistent
            ? `Pacing held within a tight band — strong endurance for this length of session.`
            : dropped
              ? `Worth noting when you plan your next long day on the mountain.`
              : `Strong finish energy — you saved your best for later.`}
        </span>
      </p>
    </div>
  );
}
