import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function clamp(n) { return Math.round(Math.max(0, Math.min(100, n))); }
function mean(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function stdDev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / arr.length);
}

function calculateSlopeScore(sessionData, history) {
  const runs = sessionData.runs || [];
  if (!runs.length) return { composite: 50, dimensions: { consistency: 50, fatigue: 50, vertical: 50, progression: 50, recovery: 50 }, trend: null };

  const speeds = runs.map(r => r.avgSpeedMph);
  const m = mean(speeds);
  const consistency = clamp(m ? 100 - (stdDev(speeds) / m) * 100 : 50);

  const mid = Math.floor(runs.length / 2);
  const a = mean(runs.slice(0, mid).map(r => r.avgSpeedMph));
  const b = mean(runs.slice(mid).map(r => r.avgSpeedMph));
  const drop = a ? ((a - b) / a) * 100 : 0;
  const fatigue = drop < 5 ? 100 : drop < 10 ? 80 : drop < 20 ? 60 : drop < 30 ? 40 : 20;

  const skiMin = runs.reduce((s, r) => s + r.durationSec, 0) / 60;
  const vert = runs.reduce((s, r) => s + r.verticalFt, 0);
  const rate = skiMin ? vert / skiMin : 0;
  const vertical = rate >= 300 ? 100 : rate >= 250 ? 85 : rate >= 200 ? 70 : rate >= 150 ? 50 : rate >= 100 ? 30 : 20;

  let progression = 50;
  if (history && history.length >= 2) {
    const recent = history.slice(0, 5);
    const hSpeeds = recent.map(s => mean((s.runs_json || []).map(r => r.avgSpeedMph || 0)));
    const change = hSpeeds[0] ? ((hSpeeds[hSpeeds.length - 1] - hSpeeds[0]) / hSpeeds[0]) * 100 : 0;
    progression = change > 10 ? 100 : change > 5 ? 80 : change > 0 ? 65 : change > -5 ? 50 : change > -10 ? 35 : 20;
  }

  const recovery = 50;
  const composite = clamp(consistency * 0.20 + fatigue * 0.25 + vertical * 0.20 + progression * 0.20 + recovery * 0.15);
  const prev = history?.[0]?.slope_score;
  const trend = prev != null ? composite - prev : null;

  return { composite, trend: trend !== null ? Math.round(trend) : null, dimensions: { consistency, fatigue, vertical, progression, recovery } };
}

const SYSTEM_PROMPT = `You are SlopeIQ, a data-first ski performance coach. Your observations must be analytical and specific — never state the obvious, never give generic advice, never use filler phrases like "Great job!" or "Keep it up!". Every observation must surface a pattern, threshold, or actionable insight grounded in the skier's actual numbers.

You must cover exactly these 7 categories in this order. Return a JSON array only — no preamble, no markdown:
[
  {"label": "Warmup Pattern", "observation": "..."},
  {"label": "Fatigue Window", "observation": "..."},
  {"label": "Consistency vs. Peak", "observation": "..."},
  {"label": "Effort Efficiency", "observation": "..."},
  {"label": "Rest Sensitivity", "observation": "..."},
  {"label": "Vertical Rate", "observation": "..."},
  {"label": "Cross-Session Insight", "observation": "..."}
]

For each observation: 1–3 sentences. Reference actual data points (mph, ft, run numbers, percentages). Cross-Session Insight requires 2+ sessions to be meaningful — if only one session exists, note what to watch for next time.`;

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');

    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');
    const { data: { user } } = token ? await supabase.auth.getUser(token) : { data: { user: null } };

    const { sessionData } = req.body || {};
    if (!sessionData) return res.status(400).json({ error: 'Missing sessionData' });

    let history = [];
    if (user) {
      const { data } = await supabase.from('sessions').select('slope_score, runs_json, session_date').eq('user_id', user.id).order('session_date', { ascending: false }).limit(10);
      history = data || [];
    }

    const slopeScore = calculateSlopeScore(sessionData, history);
    const isPro = user ? (await supabase.from('profiles').select('tier').eq('id', user.id).single()).data?.tier === 'pro' : false;

    let observations = [];
    if (isPro) {
      const prompt = `Here is my ski session data:\n${JSON.stringify(sessionData, null, 2)}\n\nSession history (${history.length} prior sessions): ${history.length > 0 ? 'available' : 'none yet'}\n\nGenerate coaching observations.`;
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://slopeiq.com',
          'X-Title': 'SlopeIQ',
        },
        body: JSON.stringify({ model: 'anthropic/claude-sonnet-4-5', max_tokens: 1500, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }] }),
      });
      const data = await aiRes.json();
      const text = data?.choices?.[0]?.message?.content || '';
      try {
        const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        observations = JSON.parse(cleaned);
      } catch { observations = []; }
    }

    if (user) {
      await supabase.from('sessions').insert({
        user_id: user.id,
        resort_name: sessionData.resort,
        session_date: sessionData.startISO ? sessionData.startISO.split('T')[0] : null,
        duration_seconds: Math.round((sessionData.totalDurationMin || 0) * 60),
        total_vertical_ft: sessionData.totalVerticalFt,
        total_runs: sessionData.totalRuns,
        top_speed_mph: sessionData.topSpeedMph,
        ski_time_seconds: sessionData.skiTimeSec,
        lift_time_seconds: sessionData.liftTimeSec,
        runs_json: sessionData.runs,
        slope_score: slopeScore.composite,
        score_dimensions: slopeScore.dimensions,
        coaching_observations: observations,
      });
      if (!isPro) {
        await supabase.from('profiles').update({ free_session_used: true }).eq('id', user.id);
      }
    }

    return res.status(200).json({ slopeScore, observations, isPro });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
