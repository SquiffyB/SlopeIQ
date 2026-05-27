import JSZip from 'jszip';

const M_TO_FT = 3.28084;
const MS_TO_MPH = 2.23694;

function round(n, places = 1) {
  if (!Number.isFinite(n)) return 0;
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

function attr(el, name) { return el.getAttribute(name); }
function num(el, name) {
  const v = el.getAttribute(name);
  return v === null ? null : parseFloat(v);
}

function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseGpsRows(csvText) {
  const rows = [];
  for (const line of csvText.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const p = line.split(',');
    if (p.length < 6) continue;
    const ts = parseFloat(p[0]);
    const speed = parseFloat(p[5]);
    if (!Number.isFinite(ts) || !Number.isFinite(speed)) continue;
    rows.push({ ts, speed });
  }
  return rows;
}

function computeFatigue(gpsRows, runs) {
  if (!gpsRows.length) {
    if (runs.length < 2) return { firstHalfAvgSpeedMph: 0, secondHalfAvgSpeedMph: 0, changePercent: 0, peakRunNumber: runs[0]?.runNumber ?? 1 };
    const mid = Math.floor(runs.length / 2);
    const avg = arr => arr.reduce((s, r) => s + r.avgSpeedMph, 0) / (arr.length || 1);
    const a = avg(runs.slice(0, mid)), b = avg(runs.slice(mid));
    const peak = runs.reduce((best, r) => r.topSpeedMph > best.topSpeedMph ? r : best, runs[0]);
    return { firstHalfAvgSpeedMph: round(a), secondHalfAvgSpeedMph: round(b), changePercent: round(a ? ((b - a) / a) * 100 : 0), peakRunNumber: peak.runNumber };
  }
  const moving = gpsRows.filter(r => r.speed >= 1.0);
  const src = moving.length > 30 ? moving : gpsRows;
  src.sort((a, b) => a.ts - b.ts);
  const half = Math.floor(src.length / 2);
  const avg = arr => arr.reduce((s, r) => s + r.speed, 0) / (arr.length || 1);
  const a = avg(src.slice(0, half)) * MS_TO_MPH;
  const b = avg(src.slice(half)) * MS_TO_MPH;
  const peak = runs.reduce((best, r) => r.topSpeedMph > best.topSpeedMph ? r : best, runs[0] || { runNumber: 1, topSpeedMph: 0 });
  return { firstHalfAvgSpeedMph: round(a), secondHalfAvgSpeedMph: round(b), changePercent: round(a ? ((b - a) / a) * 100 : 0), peakRunNumber: peak.runNumber };
}

export async function parseSlopesFile(file) {
  if (!file?.name.toLowerCase().endsWith('.slopes')) {
    throw new Error("That doesn't look like a .slopes file. Export from Slopes using the Active Times option.");
  }

  let zip;
  try { zip = await JSZip.loadAsync(file); }
  catch { throw new Error("We couldn't open that file. Make sure you export from Slopes using Active Times."); }

  const metaFile = zip.file('Metadata.xml');
  if (!metaFile) throw new Error("Missing Metadata.xml inside the .slopes archive. Re-export from Slopes using Active Times.");

  const metadataXml = await metaFile.async('string');
  const gpsCsv = zip.file('GPS.csv') ? await zip.file('GPS.csv').async('string') : '';

  const doc = new DOMParser().parseFromString(metadataXml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error("Couldn't read session metadata — file may be corrupted.");

  const activity = doc.querySelector('Activity');
  if (!activity) throw new Error("This .slopes file is missing its Activity record.");

  const resort = attr(activity, 'locationName') || 'Unknown Resort';
  const start = parseDate(attr(activity, 'start'));
  const end = parseDate(attr(activity, 'end'));
  const durationSec = num(activity, 'duration') || 0;
  const distanceM = num(activity, 'distance') || 0;
  const verticalM = num(activity, 'vertical') || 0;
  const topSpeedMs = num(activity, 'topSpeed') || 0;
  const runCount = num(activity, 'runCount') || 0;
  const peakAltM = num(activity, 'peakAltitude') || 0;

  const actionEls = Array.from(activity.querySelectorAll('actions > Action'));
  const all = (actionEls.length ? actionEls : Array.from(activity.querySelectorAll('Action')));

  function parseAction(el) {
    return {
      type: attr(el, 'type'),
      actionNumber: parseInt(attr(el, 'numberOfType') || '0', 10),
      start: attr(el, 'start'),
      end: attr(el, 'end'),
      durationSec: num(el, 'duration') || 0,
      verticalFt: round((num(el, 'vertical') || 0) * M_TO_FT, 0),
      avgSpeedMph: round((num(el, 'avgSpeed') || 0) * MS_TO_MPH, 1),
      topSpeedMph: round((num(el, 'topSpeed') || 0) * MS_TO_MPH, 1),
      distanceFt: round((num(el, 'distance') || 0) * M_TO_FT, 0),
    };
  }

  const runs = all.filter(el => attr(el, 'type') === 'Run').map(el => ({ ...parseAction(el), runNumber: parseInt(attr(el, 'numberOfType') || '0', 10) })).sort((a, b) => a.runNumber - b.runNumber);
  const lifts = all.filter(el => attr(el, 'type') === 'Lift').map(el => ({ ...parseAction(el), liftNumber: parseInt(attr(el, 'numberOfType') || '0', 10) })).sort((a, b) => a.liftNumber - b.liftNumber);

  const skiTimeSec = runs.reduce((s, r) => s + r.durationSec, 0);
  const liftTimeSec = lifts.reduce((s, l) => s + l.durationSec, 0);

  const gpsRows = parseGpsRows(gpsCsv);
  const fatigueAnalysis = computeFatigue(gpsRows, runs);

  // Interleaved timeline for run table (runs + lifts sorted by start time)
  const timeline = [...runs.map(r => ({ ...r, _type: 'run' })), ...lifts.map(l => ({ ...l, _type: 'lift' }))].sort((a, b) => {
    const ta = new Date(a.start || 0).getTime();
    const tb = new Date(b.start || 0).getTime();
    return ta - tb;
  });

  return {
    resort,
    date: formatDate(start),
    startISO: start?.toISOString() ?? null,
    endISO: end?.toISOString() ?? null,
    totalVerticalFt: round(verticalM * M_TO_FT, 0),
    totalDistanceMi: round(distanceM * 0.000621371, 1),
    totalRuns: runCount || runs.length,
    topSpeedMph: round(topSpeedMs * MS_TO_MPH, 1),
    totalDurationMin: round(durationSec / 60, 0),
    peakAltitudeFt: round(peakAltM * M_TO_FT, 0),
    skiTimeSec,
    liftTimeSec,
    skiPct: durationSec ? Math.round(skiTimeSec / durationSec * 100) : 0,
    liftPct: durationSec ? Math.round(liftTimeSec / durationSec * 100) : 0,
    runs,
    lifts,
    timeline,
    fatigueAnalysis,
  };
}
