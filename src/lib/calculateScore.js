function clamp(n) {
  return Math.round(Math.max(0, Math.min(100, n)));
}

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function stdDev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function pearson(xs, ys) {
  const n = xs.length;
  if (n < 2) return 0;
  const mx = mean(xs), my = mean(ys);
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const dx = Math.sqrt(xs.reduce((s, x) => s + Math.pow(x - mx, 2), 0));
  const dy = Math.sqrt(ys.reduce((s, y) => s + Math.pow(y - my, 2), 0));
  if (dx === 0 || dy === 0) return 0;
  return num / (dx * dy);
}

function consistencyScore(runs) {
  if (runs.length < 2) return 50;
  const speeds = runs.map(r => r.avgSpeedMph);
  const m = mean(speeds);
  if (m === 0) return 50;
  const score = 100 - (stdDev(speeds) / m) * 100;
  return clamp(score);
}

function fatigueScore(runs) {
  if (runs.length < 2) return 70;
  const mid = Math.floor(runs.length / 2);
  const a = mean(runs.slice(0, mid).map(r => r.avgSpeedMph));
  const b = mean(runs.slice(mid).map(r => r.avgSpeedMph));
  if (a === 0) return 70;
  const drop = ((a - b) / a) * 100;
  if (drop < 5) return 100;
  if (drop < 10) return 80;
  if (drop < 20) return 60;
  if (drop < 30) return 40;
  return 20;
}

function verticalEfficiencyScore(runs) {
  const skiTimeSec = runs.reduce((s, r) => s + r.durationSec, 0);
  const totalVert = runs.reduce((s, r) => s + r.verticalFt, 0);
  if (skiTimeSec === 0) return 50;
  const rate = totalVert / (skiTimeSec / 60); // ft per minute
  if (rate >= 300) return 100;
  if (rate >= 250) return 85;
  if (rate >= 200) return 70;
  if (rate >= 150) return 50;
  if (rate >= 100) return 30;
  return 20;
}

function progressionScore(history) {
  if (!history || history.length < 2) return 50;
  const recent = history.slice(-5);
  if (recent.length < 2) return 50;
  const speeds = recent.map(s => {
    const runs = s.runs_json || [];
    return mean(runs.map(r => r.avgSpeedMph || 0));
  });
  const first = speeds[0], last = speeds[speeds.length - 1];
  if (first === 0) return 50;
  const change = ((last - first) / first) * 100;
  if (change > 10) return 100;
  if (change > 5) return 80;
  if (change > 0) return 65;
  if (change > -5) return 50;
  if (change > -10) return 35;
  return 20;
}

function recoveryScore(runs, lifts) {
  if (runs.length < 2 || !lifts.length) return 50;
  const pairs = [];
  for (let i = 1; i < runs.length; i++) {
    const prevLift = lifts.find(l => {
      const liftStart = new Date(l.start).getTime();
      const runEnd = new Date(runs[i - 1].end).getTime();
      const runStart = new Date(runs[i].start).getTime();
      return liftStart >= runEnd && liftStart <= runStart;
    });
    if (prevLift) {
      pairs.push({ rest: prevLift.durationSec, perf: runs[i].avgSpeedMph });
    }
  }
  if (pairs.length < 2) return 50;
  const corr = pearson(pairs.map(p => p.rest), pairs.map(p => p.perf));
  return clamp(50 + corr * 50);
}

export function calculateSlopeScore(sessionData, history = []) {
  const { runs = [], lifts = [] } = sessionData;

  const consistency = consistencyScore(runs);
  const fatigue = fatigueScore(runs);
  const vertical = verticalEfficiencyScore(runs);
  const progression = progressionScore(history);
  const recovery = recoveryScore(runs, lifts);

  const composite = clamp(
    consistency * 0.20 +
    fatigue * 0.25 +
    vertical * 0.20 +
    progression * 0.20 +
    recovery * 0.15
  );

  let trend = null;
  if (history.length > 0) {
    const prev = history[0]?.slope_score;
    if (prev != null) trend = composite - prev;
  }

  return {
    composite,
    trend: trend !== null ? Math.round(trend) : null,
    dimensions: { consistency, fatigue, vertical, progression, recovery }
  };
}
