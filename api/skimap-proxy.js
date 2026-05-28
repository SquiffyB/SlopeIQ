const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { resort } = req.body || {};
    if (!resort) return res.status(400).json({ error: 'Missing resort' });

    const searchUrl = `https://skimap.org/SkiAreas/index.json?q=${encodeURIComponent(resort)}&key=${process.env.SKIMAP_API_KEY}`;
    const skimapRes = await fetch(searchUrl);
    if (!skimapRes.ok) throw new Error(`Skimap returned ${skimapRes.status}`);

    const areas = await skimapRes.json();
    if (!areas?.length) return res.status(200).json({ found: false });

    const top = areas[0];
    return res.status(200).json({ found: true, resort: { id: top.id, name: top.name, country: top.country, region: top.region } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
