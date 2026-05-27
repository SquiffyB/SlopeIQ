const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS };

  try {
    const { resort } = JSON.parse(event.body || '{}');
    if (!resort) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing resort' }) };

    const searchUrl = `https://skimap.org/SkiAreas/index.json?q=${encodeURIComponent(resort)}&key=${process.env.SKIMAP_API_KEY}`;
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error(`Skimap returned ${res.status}`);

    const areas = await res.json();
    if (!areas?.length) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ found: false }) };

    const top = areas[0];
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ found: true, resort: { id: top.id, name: top.name, country: top.country, region: top.region } }),
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
