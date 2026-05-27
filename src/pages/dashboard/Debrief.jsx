import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { parseSlopesFile } from '../../lib/parseSlopesFile';
import { supabase } from '../../lib/supabase';
import SlopeScoreDisplay from '../../components/SlopeScoreDisplay';
import RunTable from '../../components/RunTable';
import CoachingCard from '../../components/CoachingCard';
import UpgradePrompt from '../../components/UpgradePrompt';

function StatCard({ label, value, unit }) {
  return (
    <div className="card p-5 hover:-translate-y-0.5 transition-transform duration-200">
      <p className="eyebrow">{label}</p>
      <p className="font-serif text-[36px] sm:text-[42px] text-coral mt-2 leading-none">
        {value}
        {unit && <span className="text-muted-2 text-[14px] ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function fmt(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

export default function Debrief() {
  const { user, profile, getToken, refreshProfile } = useAuth();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | analyzing | results
  const [session, setSession] = useState(null);
  const [slopeScore, setSlopeScore] = useState(null);
  const [observations, setObservations] = useState([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const isPro = profile?.tier === 'pro';
  const canUpload = isPro || !profile?.free_session_used;

  function handleFile(f) {
    if (!f) return;
    setError('');
    setFile(f);
    setPhase('idle');
    setSession(null);
  }

  async function analyze() {
    if (!file) return;
    setError('');
    setPhase('analyzing');
    try {
      const parsed = await parseSlopesFile(file);
      setSession(parsed);

      const token = await getToken();
      const res = await fetch('/.netlify/functions/analyze-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ sessionData: parsed }),
      });

      if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
      const data = await res.json();

      setSlopeScore(data.slopeScore);
      setObservations(data.observations || []);
      if (!data.isPro) setNote('Upgrade to Pro for AI coaching observations tailored to your session.');
      setPhase('results');
      await refreshProfile();

      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setPhase('idle');
    }
  }

  if (!canUpload && phase === 'idle') {
    return <UpgradePrompt feature="Unlimited session uploads" />;
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-16">
      {/* Upload zone */}
      {(phase === 'idle' || phase === 'analyzing') && (
        <div className="relative">
          <div className="cta-orb animate-orb" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow text-center">Your session</p>
            <h2 className="font-serif text-[40px] text-center mt-3 text-ink">Drop your session in</h2>

            <div
              className={`upload-zone mt-10 p-12 sm:p-16 text-center cursor-pointer ${dragging ? 'dragging' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
              role="button" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
            >
              <input ref={inputRef} type="file" accept=".slopes" className="hidden" onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />

              {!file ? (
                <>
                  <div className="mx-auto w-14 h-14 rounded-full bg-coral/10 border border-coral/25 flex items-center justify-center mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8634a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-ink text-[18px] font-medium">Drop your .slopes file here</p>
                  <p className="text-muted text-[14px] mt-2">or click to browse</p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-teal text-[15px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <p className="text-muted-2 text-[12px]">{(file.size / 1024).toFixed(1)} KB · ready to analyze</p>
                </div>
              )}
            </div>

            {error && <p className="mt-5 text-center text-coral text-[14px]">{error}</p>}

            <div className="mt-8 flex justify-center">
              <button onClick={analyze} disabled={!file || phase === 'analyzing'} className="btn-primary px-10 py-4">
                {phase === 'analyzing' ? (
                  <><span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin mr-2" />Analyzing your session…</>
                ) : 'Analyze session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {phase === 'results' && session && (
        <div id="results" className="space-y-16">
          {/* Session header */}
          <div className="text-center stagger">
            <p className="eyebrow">Session overview</p>
            <h2 className="font-serif text-[40px] mt-3 text-ink">{session.resort}</h2>
            {session.date && <p className="text-muted text-[15px] mt-2">{session.date}</p>}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger">
            <StatCard label="Total Vertical" value={session.totalVerticalFt.toLocaleString()} unit="ft" />
            <StatCard label="Runs" value={session.totalRuns} />
            <StatCard label="Top Speed" value={session.topSpeedMph} unit="mph" />
            <StatCard label="Time on Mountain" value={fmt(session.totalDurationMin)} />
          </div>

          {/* Ski/lift ratio */}
          <div className="card p-6">
            <p className="eyebrow mb-4">Time breakdown</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[13px] mb-2">
                  <span className="text-coral">Skiing {session.skiPct}%</span>
                  <span className="text-muted-2">Lifts {session.liftPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div className="h-full bg-coral rounded-full" style={{ width: `${session.skiPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Run table */}
          <div>
            <p className="eyebrow mb-3">Run by run</p>
            <h3 className="font-serif text-[28px] text-ink mb-5">Every run, by the numbers</h3>
            <RunTable timeline={session.timeline} peakRunNumber={session.fatigueAnalysis?.peakRunNumber} />
          </div>

          {/* SlopeScore */}
          <div>
            <p className="eyebrow mb-3">SlopeScore</p>
            <h3 className="font-serif text-[28px] text-ink mb-8">Your performance this session</h3>
            {slopeScore && (
              <div className="card p-8 sm:p-10 flex flex-col items-center gap-8">
                <SlopeScoreDisplay
                  score={slopeScore.composite}
                  trend={slopeScore.trend}
                  dimensions={slopeScore.dimensions}
                  tier={isPro ? 'pro' : 'free'}
                  size={220}
                />
                {!isPro && (
                  <div className="w-full max-w-sm text-center">
                    <p className="text-muted text-[14px] mb-4">Unlock all 5 dimensions + AI coaching on Pro</p>
                    <UpgradePrompt feature="Full SlopeScore breakdown" compact />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Coaching */}
          {isPro && (
            <div>
              <p className="eyebrow mb-3">Your debrief</p>
              <h3 className="font-serif text-[28px] text-ink mb-6">Here's what your data shows</h3>
              {observations.length > 0 ? (
                <CoachingCard observations={observations} note={note} />
              ) : (
                <div className="card p-8 text-center text-muted text-[14px]">
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-muted/40 border-t-muted animate-spin mr-2 align-middle" />
                  Coaching observations loading…
                </div>
              )}
            </div>
          )}

          {/* Analyze another */}
          <div className="text-center pt-4 border-t border-line">
            <button onClick={() => { setPhase('idle'); setFile(null); setSession(null); setSlopeScore(null); setObservations([]); }} className="btn-ghost px-6 py-3">
              Analyze another session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
