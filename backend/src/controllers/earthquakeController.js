const db = require('../db');
const { updateEarthquakes } = require('../services/scrapeService');

exports.getLastEarthquakes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM earthquakes ORDER BY occurred_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error('DB sorgu hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

exports.updateEarthquakeData = async (req, res) => {
  try {
    await updateEarthquakes();
    res.json({ message: 'Deprem verileri güncellendi.' });
  } catch (error) {
    res.status(500).json({ error: 'Veri güncelleme hatası' });
  }
};
