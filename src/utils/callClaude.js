const SYSTEM_PROMPT = `You are SlopeIQ, a data-first ski performance coach. Your tone is recreational and encouraging — like a knowledgeable friend who skis, not a drill sergeant. You give short, specific observations grounded in numbers. Never give generic advice. Always reference actual data points from the session. Return exactly 4–5 coaching observations as a JSON array with this shape: [{"label": "Speed Consistency", "observation": "Your avg speed held within 3 mph across 6 of 7 runs — strong pacing."}]. Return only valid JSON, no preamble.`;

function stripCodeFences(text) {
  if (!text) return text;
  return text
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

function extractJsonArray(text) {
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Coaching response was not valid JSON.');
  }
}

function fallbackCoaching(sessionData) {
  const runs = sessionData.runs || [];
  const peak = runs.reduce(
    (best, r) => (!best || r.topSpeedMph > best.topSpeedMph ? r : best),
    null
  );
  const slowest = runs.reduce(
    (worst, r) => (!worst || r.avgSpeedMph < worst.avgSpeedMph ? r : worst),
    null
  );
  const fa = sessionData.fatigueAnalysis || {};
  const obs = [];

  if (peak) {
    obs.push({
      label: 'Best run',
      observation: `Run ${peak.runNumber} was your peak — top speed of ${peak.topSpeedMph} mph and ${peak.verticalFt} ft of vertical.`
    });
  }
  if (fa.changePercent != null) {
    const pct = Math.abs(fa.changePercent);
    if (pct < 4) {
      obs.push({
        label: 'Fatigue pattern',
        observation: `Your first-half average (${fa.firstHalfAvgSpeedMph} mph) and second-half average (${fa.secondHalfAvgSpeedMph} mph) were within ${pct}% — consistent energy throughout.`
      });
    } else if (fa.changePercent < 0) {
      obs.push({
        label: 'Fatigue pattern',
        observation: `Your speed dropped ${pct}% in the second half (${fa.firstHalfAvgSpeedMph} → ${fa.secondHalfAvgSpeedMph} mph). Worth noting next time you plan a long session.`
      });
    } else {
      obs.push({
        label: 'Building momentum',
        observation: `You actually got ${pct}% faster in the second half — strong finish energy.`
      });
    }
  }
  if (slowest && peak && slowest.runNumber !== peak.runNumber) {
    obs.push({
      label: 'Speed range',
      observation: `Your slowest run (Run ${slowest.runNumber}, ${slowest.avgSpeedMph} mph avg) and fastest (Run ${peak.runNumber}, ${peak.avgSpeedMph} mph avg) show a wide range — could be terrain or pacing.`
    });
  }
  obs.push({
    label: 'Session totals',
    observation: `${sessionData.totalVerticalFt} ft of vertical across ${runs.length} runs at ${sessionData.resort}. Solid day on the mountain.`
  });
  return obs.slice(0, 5);
}

export async function getCoaching(sessionData, apiKey) {
  if (!apiKey) {
    return {
      observations: fallbackCoaching(sessionData),
      source: 'local',
      note: 'No Anthropic API key provided — showing rule-based observations. Add a key to get AI coaching.'
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Here is my ski session data: ${JSON.stringify(
              sessionData
            )}. Give me 4–5 coaching observations.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Claude API returned ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text ?? '';
    const observations = extractJsonArray(text);
    return { observations, source: 'claude' };
  } catch (err) {
    return {
      observations: fallbackCoaching(sessionData),
      source: 'local',
      note: `Couldn't reach Claude (${err.message}). Showing rule-based observations instead.`
    };
  }
}
