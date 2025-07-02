
const db = require('../db');


async function upsertEarthquake(eq) {
  const query = `
    INSERT INTO public.earthquakes(event_id, occurred_at, latitude, longitude, depth, type, magnitude, location)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (event_id) DO UPDATE SET
      occurred_at = EXCLUDED.occurred_at,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      depth = EXCLUDED.depth,
      type = EXCLUDED.type,
      magnitude = EXCLUDED.magnitude,
      location = EXCLUDED.location;
  `;
  const values = [
    eq.event_id,
    eq.occurred_at instanceof Date ? eq.occurred_at.toISOString() : eq.occurred_at,
    eq.latitude,
    eq.longitude,
    eq.depth,
    eq.type || 'ML',
    eq.magnitude,
    eq.location,
  ];

  try {
    await db.query(query, values);
  } catch (error) {
    console.error('DB kayıt hatası:', error);
  }
}

module.exports = { upsertEarthquake };
