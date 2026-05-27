import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function buildSystemPrompt(userProfile, trailData) {
  const score = userProfile?.slope_score ?? null;
  const dims = userProfile?.dimensions ?? {};
  const avgSpeed = userProfile?.avg_speed_mph ?? null;

  const speedProfile = avgSpeed
    ? avgSpeed < 20 ? 'green and easy blue trails'
    : avgSpeed < 28 ? 'blue and moderate blue-black trails'
    : avgSpeed < 35 ? 'blue-black and easier black trails'
    : 'full black and double black trails'
    : 'unknown — ask the skier';

  const trailSection = trailData
    ? `\nResort trail data:\n${JSON.stringify(trailData, null, 2)}`
    : '\nNo trail data loaded yet — if the skier mentions a resort, you will receive trail data.';

  return `You are the SlopeIQ Mountain Coach. You are a knowledgeable, direct ski coach who knows both the mountain and the skier in front of you. Never be a cheerleader. Be a coach.

Skier profile:
- SlopeScore: ${score ?? 'not yet calculated'}
- Average speed across sessions: ${avgSpeed ? `${avgSpeed} mph` : 'unknown'}
- Recommended terrain based on speed: ${speedProfile}
- Fatigue management score: ${dims.fatigue ?? 'N/A'}/100
- Consistency score: ${dims.consistency ?? 'N/A'}/100
- Recovery utilization: ${dims.recovery ?? 'N/A'}/100
${trailSection}

Your job:
1. Recommend specific named trails matching the skier's ability level
2. Build an Optimal Day plan when asked: warmup runs, peak window, break timing, when to stop
3. Factor in lift duration when calculating realistic run counts
4. Always reference the skier's actual data — never give generic advice
5. If you have insufficient data, say so and ask a clarifying question

Optimal Day format when requested:
📍 [Resort] — [Date if given]

YOUR DAY PLAN
Warmup (runs 1–2): [Trail] — [difficulty], [vertical] ft vertical
Peak window (runs 3–6): [Trail] — [difficulty], [vertical] ft vertical
Break: After run [N] ([reason from fatigue data])
Afternoon (runs [N+1]–end): [Trail] — [difficulty]
Stop by: Run [X] or [time] — whichever comes first

Estimated vertical: ~[X,XXX] ft
Estimated ski time: [Xhr Ymin] (including lifts)`;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS };

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };

    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };

    const { message, history = [], conversationId } = JSON.parse(event.body || '{}');

    const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single();
    if (profile?.tier !== 'pro') return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'Pro required' }) };

    const { data: sessions } = await supabase.from('sessions').select('slope_score, score_dimensions, top_speed_mph, total_runs, resort_name').eq('user_id', user.id).order('session_date', { ascending: false }).limit(5);

    let userProfile = null;
    if (sessions?.length) {
      const latest = sessions[0];
      const avgSpeed = sessions.reduce((s, sess) => s + (sess.top_speed_mph || 0), 0) / sessions.length;
      userProfile = { slope_score: latest.slope_score, dimensions: latest.score_dimensions, avg_speed_mph: Math.round(avgSpeed * 10) / 10 };
    }

    let trailData = null;
    const resortMatch = message.match(/(?:going to|skiing at|at|visiting|planning|heading to)\s+([A-Z][a-zA-Z\s]{3,30}(?:Mountain|Resort|Ski Area|Lodge)?)/i) || message.match(/([A-Z][a-zA-Z\s]{3,30}(?:Mountain|Resort|Ski Area))/);
    if (resortMatch) {
      try {
        const skimapRes = await fetch(`https://skimap.org/SkiAreas/index.json?q=${encodeURIComponent(resortMatch[1])}&key=${process.env.SKIMAP_API_KEY}`);
        if (skimapRes.ok) {
          const skimapData = await skimapRes.json();
          if (skimapData?.length) {
            trailData = { resort: resortMatch[1], areas: skimapData.slice(0, 3).map(a => ({ name: a.name, id: a.id })) };
          }
        }
      } catch { /* trail data is optional */ }
    }

    const systemPrompt = buildSystemPrompt(userProfile, trailData);
    const messages = [...history.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: message }];

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://slopeiq.com',
        'X-Title': 'SlopeIQ',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-5',
        max_tokens: 1200,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });
    const aiData = await aiRes.json();
    const reply = aiData?.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Try again in a moment.";

    const updatedHistory = [...history, { role: 'user', content: message }, { role: 'assistant', content: reply }];
    if (conversationId) {
      await supabase.from('coach_conversations').update({ messages: updatedHistory, resort_context: resortMatch?.[1] || null, updated_at: new Date().toISOString() }).eq('id', conversationId).eq('user_id', user.id);
    } else {
      await supabase.from('coach_conversations').insert({ user_id: user.id, messages: updatedHistory, resort_context: resortMatch?.[1] || null });
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply, resort: trailData?.resort ?? null }),
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
