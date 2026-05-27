import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import UpgradePrompt from '../../components/UpgradePrompt';
import SlopeScoreDisplay from '../../components/SlopeScoreDisplay';

function SessionRow({ session }) {
  const date = session.session_date ? new Date(session.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  return (
    <div className="card p-5 hover:bg-elevated transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <p className="text-ink font-medium truncate">{session.resort_name || 'Unknown Resort'}</p>
            {session.slope_score != null && (
              <span className="text-[11px] text-coral bg-coral/10 border border-coral/20 rounded-full px-2 py-0.5 shrink-0">
                {session.slope_score}
              </span>
            )}
          </div>
          <p className="text-muted-2 text-[13px] mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-6 shrink-0 text-right">
          <div>
            <p className="text-ink text-[16px] font-medium">{session.total_vertical_ft ? Math.round(session.total_vertical_ft).toLocaleString() : '—'} ft</p>
            <p className="text-muted-2 text-[11px]">vertical</p>
          </div>
          <div>
            <p className="text-ink text-[16px] font-medium">{session.total_runs ?? '—'}</p>
            <p className="text-muted-2 text-[11px]">runs</p>
          </div>
          <div>
            <p className="text-ink text-[16px] font-medium">{session.top_speed_mph ? `${session.top_speed_mph} mph` : '—'}</p>
            <p className="text-muted-2 text-[11px]">top speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[13px]">
      <p className="text-muted-2">{label}</p>
      <p className="text-coral font-medium">{payload[0].value}</p>
    </div>
  );
};

export default function History() {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPro = profile?.tier === 'pro';

  useEffect(() => {
    if (!user || !isPro) { setLoading(false); return; }
    supabase.from('sessions').select('*').eq('user_id', user.id).order('session_date', { ascending: false }).then(({ data }) => {
      setSessions(data || []);
      setLoading(false);
    });
  }, [user, isPro]);

  if (!isPro) return <UpgradePrompt feature="Session history" />;

  const chartData = [...sessions].reverse().map(s => ({
    date: s.session_date ? new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
    score: s.slope_score,
  })).filter(d => d.score != null);

  const latestScore = sessions[0]?.slope_score;
  const latestDims = sessions[0]?.score_dimensions;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-16 space-y-12">
      <div>
        <p className="eyebrow">History</p>
        <h1 className="font-serif text-[40px] mt-3 text-ink">Your session archive</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <span className="inline-block w-5 h-5 rounded-full border-2 border-muted/30 border-t-muted animate-spin mr-3" />
          Loading…
        </div>
      ) : sessions.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-ink font-medium mb-2">No sessions yet</p>
          <p className="text-muted text-[14px]">Upload your first session from the Debrief tab.</p>
        </div>
      ) : (
        <>
          {/* SlopeScore trend */}
          {chartData.length >= 2 && (
            <div>
              <p className="eyebrow mb-5">SlopeScore over time</p>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
                <div className="card p-6">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" tick={{ fill: '#5d5d6b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#5d5d6b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
                      <Line type="monotone" dataKey="score" stroke="#e8634a" strokeWidth={2} dot={{ fill: '#e8634a', r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {latestScore != null && (
                  <div className="card p-6 flex flex-col items-center">
                    <p className="eyebrow mb-4">Latest score</p>
                    <SlopeScoreDisplay score={latestScore} dimensions={latestDims} tier="pro" size={160} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session list */}
          <div>
            <p className="eyebrow mb-5">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
            <div className="space-y-3">
              {sessions.map(s => <SessionRow key={s.id} session={s} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
