import RunBreakdown from './RunBreakdown.jsx';
import PerformanceTrends from './PerformanceTrends.jsx';
import FatigueAnalysis from './FatigueAnalysis.jsx';
import CoachingOutput from './CoachingOutput.jsx';

function StatCard({ label, value, unit }) {
  return (
    <div className="card p-5">
      <p className="eyebrow">{label}</p>
      <p className="font-serif text-[36px] sm:text-[44px] text-coral mt-2 leading-none">
        {value}
        {unit && (
          <span className="text-muted-2 text-[14px] sm:text-[16px] ml-1 align-baseline">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function formatHrs(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

export default function ResultsDashboard({ session, coaching }) {
  return (
    <section id="results" className="relative">
      <div className="max-w-[1080px] mx-auto px-6 py-16">
        {/* Session header */}
        <div className="text-center mb-10 stagger">
          <p className="eyebrow">Session overview</p>
          <h2 className="font-serif text-[34px] sm:text-[42px] mt-3 text-ink">
            {session.resort}
          </h2>
          {session.date && (
            <p className="text-muted text-[15px] mt-2">{session.date}</p>
          )}
        </div>

        {/* Stat bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger">
          <StatCard
            label="Total Vertical"
            value={session.totalVerticalFt.toLocaleString()}
            unit="ft"
          />
          <StatCard
            label="Runs Completed"
            value={session.totalRuns}
          />
          <StatCard
            label="Top Speed"
            value={session.topSpeedMph}
            unit="mph"
          />
          <StatCard
            label="Time on Mountain"
            value={formatHrs(session.totalDurationMin)}
          />
        </div>

        {/* Run breakdown */}
        <div className="mt-16">
          <p className="eyebrow">Run by run</p>
          <h3 className="font-serif text-[28px] mt-3 mb-6 text-ink">
            Every run, by the numbers
          </h3>
          <RunBreakdown
            runs={session.runs}
            peakRunNumber={session.fatigueAnalysis.peakRunNumber}
          />
        </div>

        {/* Performance trends */}
        <div className="mt-16">
          <p className="eyebrow">Performance trends</p>
          <h3 className="font-serif text-[28px] mt-3 mb-6 text-ink">
            How you trended across the day
          </h3>
          <PerformanceTrends runs={session.runs} />
        </div>

        {/* Fatigue */}
        <div className="mt-16">
          <p className="eyebrow">Fatigue analysis</p>
          <h3 className="font-serif text-[28px] mt-3 mb-6 text-ink">
            First half vs. second half
          </h3>
          <FatigueAnalysis
            fatigue={session.fatigueAnalysis}
            runs={session.runs}
          />
        </div>

        {/* Coaching */}
        <div className="mt-16">
          <p className="eyebrow">Your debrief</p>
          <h3 className="font-serif text-[28px] mt-3 mb-6 text-ink">
            Here's what your data shows
          </h3>
          {coaching?.loading ? (
            <div className="card p-8 text-center text-muted text-[14px]">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-muted/40 border-t-muted animate-spin mr-2 align-middle" />
              Coaching observations are loading...
            </div>
          ) : (
            <CoachingOutput
              observations={coaching?.observations}
              note={coaching?.note}
            />
          )}
        </div>
      </div>
    </section>
  );
}
