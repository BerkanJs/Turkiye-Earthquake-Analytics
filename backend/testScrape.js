const axios = require('axios');
const cheerio = require('cheerio');

const KANDILLI_URL = 'http://www.koeri.boun.edu.tr/scripts/lst7.asp';

async function fetchKandilliEarthquakes() {
  try {
    const { data: html } = await axios.get(KANDILLI_URL);

    const $ = cheerio.load(html);
    const preText = $('pre').text();

    // Metni satırlara böl, ilk birkaç başlık satırını atla (6 satır civarı)
    const lines = preText.split('\n').slice(6);

    const earthquakes = [];

    for (const line of lines) {
      // Boş satırları atla
      if (!line.trim()) continue;

      // Satırları boşluklarla parçala
      const parts = line.trim().split(/\s+/);
      if (parts.length < 9) continue;

      // Tarih ve saat birleştir ve ISO formatına çevir (2025.07.02 -> 2025-07-02)
      const dateStr = parts[0].replace(/\./g, '-') + 'T' + parts[1];

      earthquakes.push({
        occurred_at: new Date(dateStr),
        latitude: parseFloat(parts[2]),
        longitude: parseFloat(parts[3]),
        depth: parseFloat(parts[4]),
        magnitude: parseFloat(parts[6]) || null,
        location: parts.slice(8).join(' '),
        event_id: `${dateStr}_${parts[2]}_${parts[3]}`
      });
    }

    return earthquakes;
  } catch (error) {
    console.error('Kandilli verisi çekme hatası:', error);
    return [];
  }
}

(async () => {
  const eqs = await fetchKandilliEarthquakes();
  console.log(eqs);
})();
