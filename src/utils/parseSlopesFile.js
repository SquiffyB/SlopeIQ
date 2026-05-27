import JSZip from 'jszip';

const M_TO_FT = 3.28084;
const MS_TO_MPH = 2.23694;

function round(n, places = 1) {
  if (!Number.isFinite(n)) return 0;
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

function attr(el, name) {
  return el.getAttribute(name);
}

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
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function parseGpsRows(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(',');
    if (parts.length < 6) continue;
    const ts = parseFloat(parts[0]);
    const speed = parseFloat(parts[5]);
    if (!Number.isFinite(ts) || !Number.isFinite(speed)) continue;
    rows.push({ ts, speed });
  }
  return rows;
}

function computeFatigue(gpsRows, runs) {
  if (!gpsRows.length) {
    // Fallback: use first-half/second-half of runs by avgSpeed
    if (runs.length < 2) {
      return {
        firstHalfAvgSpeedMph: 0,
        secondHalfAvgSpeedMph: 0,
        changePercent: 0,
        peakRunNumber: runs[0]?.runNumber ?? 1
      };
    }
    const mid = Math.floor(runs.length / 2);
    const firstHalf = runs.slice(0, mid);
    const secondHalf = runs.slice(mid);
    const avg = arr => arr.reduce((s, r) => s + r.avgSpeedMph, 0) / (arr.length || 1);
    const a = avg(firstHalf);
    const b = avg(secondHalf);
    const peak = runs.reduce((best, r) => (r.topSpeedMph > best.topSpeedMph ? r : best), runs[0]);
    return {
      firstHalfAvgSpeedMph: round(a, 1),
      secondHalfAvgSpeedMph: round(b, 1),
      changePercent: round(a === 0 ? 0 : ((b - a) / a) * 100, 1),
      peakRunNumber: peak.runNumber
    };
  }

  // Use moving GPS only — filter out lift/idle by min speed threshold (>= 1 m/s ~ 2.2 mph)
  const moving = gpsRows.filter(r => r.speed >= 1.0);
  const source = moving.length > 30 ? moving : gpsRows;

  source.sort((a, b) => a.ts - b.ts);
  const half = Math.floor(source.length / 2);
  const first = source.slice(0, half);
  const second = source.slice(half);
  const avg = arr => arr.reduce((s, r) => s + r.speed, 0) / (arr.length || 1);
  const a = avg(first) * MS_TO_MPH;
  const b = avg(second) * MS_TO_MPH;

  const peak = runs.reduce(
    (best, r) => (r.topSpeedMph > best.topSpeedMph ? r : best),
    runs[0] || { runNumber: 1, topSpeedMph: 0 }
  );

  return {
    firstHalfAvgSpeedMph: round(a, 1),
    secondHalfAvgSpeedMph: round(b, 1),
    changePercent: a === 0 ? 0 : round(((b - a) / a) * 100, 1),
    peakRunNumber: peak.runNumber
  };
}

export async function parseSlopesFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.slopes')) {
    throw new Error(
      "This doesn't look like a .slopes file. Make sure you export from Slopes using the Active Times option."
    );
  }

  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (err) {
    throw new Error(
      "We couldn't open that file. Make sure you export from Slopes using the Active Times option."
    );
  }

  const metaFile = zip.file('Metadata.xml');
  if (!metaFile) {
    throw new Error(
      "Missing Metadata.xml inside the .slopes archive. Re-export from Slopes using Active Times."
    );
  }

  const metadataXml = await metaFile.async('string');
  const gpsFile = zip.file('GPS.csv');
  const gpsCsv = gpsFile ? await gpsFile.async('string') : '';

  const doc = new DOMParser().parseFromString(metadataXml, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) {
    throw new Error("We couldn't read the session metadata. The file may be corrupted.");
  }

  const activity = doc.querySelector('Activity');
  if (!activity) {
    throw new Error("This .slopes file is missing its Activity record.");
  }

  const resort = attr(activity, 'locationName') || 'Unknown resort';
  const start = parseDate(attr(activity, 'start'));
  const end = parseDate(attr(activity, 'end'));
  const durationSec = num(activity, 'duration') || 0;
  const distanceM = num(activity, 'distance') || 0;
  const verticalM = num(activity, 'vertical') || 0;
  const topSpeedMs = num(activity, 'topSpeed') || 0;
  const runCount = num(activity, 'runCount') || 0;
  const peakAltitudeM = num(activity, 'peakAltitude') || 0;

  const actionEls = Array.from(activity.querySelectorAll('actions > Action'));
  // Some exports nest actions directly under Activity
  const fallback = actionEls.length === 0 ? Array.from(activity.querySelectorAll('Action')) : actionEls;

  const runs = fallback
    .filter(el => attr(el, 'type') === 'Run')
    .map(el => ({
      runNumber: parseInt(attr(el, 'numberOfType') || '0', 10),
      start: attr(el, 'start'),
      end: attr(el, 'end'),
      durationSec: num(el, 'duration') || 0,
      distanceFt: round((num(el, 'distance') || 0) * M_TO_FT, 0),
      verticalFt: round((num(el, 'vertical') || 0) * M_TO_FT, 0),
      avgSpeedMph: round((num(el, 'avgSpeed') || 0) * MS_TO_MPH, 1),
      topSpeedMph: round((num(el, 'topSpeed') || 0) * MS_TO_MPH, 1),
      maxAltFt: round((num(el, 'maxAlt') || 0) * M_TO_FT, 0),
      minAltFt: round((num(el, 'minAlt') || 0) * M_TO_FT, 0)
    }))
    .sort((a, b) => a.runNumber - b.runNumber);

  const gpsRows = parseGpsRows(gpsCsv);
  const fatigueAnalysis = computeFatigue(gpsRows, runs);

  return {
    resort,
    date: formatDate(start),
    startISO: start ? start.toISOString() : null,
    endISO: end ? end.toISOString() : null,
    totalVerticalFt: round(verticalM * M_TO_FT, 0),
    totalDistanceFt: round(distanceM * M_TO_FT, 0),
    totalRuns: runCount || runs.length,
    topSpeedMph: round(topSpeedMs * MS_TO_MPH, 1),
    totalDurationMin: round(durationSec / 60, 0),
    peakAltitudeFt: round(peakAltitudeM * M_TO_FT, 0),
    runs,
    fatigueAnalysis
  };
}
