const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'http://www.koeri.boun.edu.tr/scripts/lst7.asp';

function parseDateTR(dateStr) {
  const [datePart, timePart] = dateStr.trim().split(' ');
  const [yyyy, mm, dd] = datePart.split('.');
  return new Date(`${yyyy}-${mm}-${dd}T${timePart}`);
}

async function fetchEarthquakes() {
  try {
    const { data: html } = await axios.get(URL);
    const $ = cheerio.load(html);
    const preText = $('pre').text();

  
    const lines = preText.split('\n').slice(6);

    const earthquakes = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.trim().split(/\s+/);
      if (parts.length < 9) continue;

      const dateStr = parts[0].replace(/\./g, '-') + 'T' + parts[1];

      earthquakes.push({
        occurred_at: parseDateTR(parts[0] + ' ' + parts[1]),
        latitude: parseFloat(parts[2]),
        longitude: parseFloat(parts[3]),
        depth: parseFloat(parts[4]),
        type: 'ML',
        magnitude: parseFloat(parts[6]) || null,
        location: parts.slice(8).join(' '),
        event_id: `${dateStr}_${parts[2]}_${parts[3]}`
      });
    }

    return earthquakes;
  } catch (error) {
    console.error('Deprem verisi çekme hatası:', error);
    return [];
  }
}

const { upsertEarthquake } = require('./dbService');

async function updateEarthquakes() {
  const earthquakes = await fetchEarthquakes();
  let successCount = 0;
  for (const eq of earthquakes) {
    try {
      await upsertEarthquake(eq);
      successCount++;
      console.log(`Başarıyla kaydedildi: ${eq.event_id}`);
    } catch (error) {
      console.error(`DB kayıt hatası (event_id: ${eq.event_id}):`, error);
    }
  }
  console.log(`${successCount} / ${earthquakes.length} deprem verisi başarıyla güncellendi.`);
}

module.exports = { fetchEarthquakes, updateEarthquakes };
