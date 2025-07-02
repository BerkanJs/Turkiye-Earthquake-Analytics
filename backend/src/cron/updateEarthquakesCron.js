const cron = require('node-cron');
const { updateEarthquakes } = require('../services/scrapeService');

function startScheduledJob() {

  cron.schedule('*/5 * * * *', async () => {
    console.log('Deprem verileri güncelleniyor (cron)...');
    try {
      await updateEarthquakes();
      console.log('Deprem verileri başarıyla güncellendi (cron).');
    } catch (err) {
      console.error('Cron ile veri güncelleme hatası:', err);
    }
  });
}

module.exports = { startScheduledJob };
