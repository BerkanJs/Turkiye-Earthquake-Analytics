// src/server.js  (dosya yolunu isteğe göre ayarla)
require('dotenv').config();          // .env en başta okunmalı
const express = require('express');
const cors = require('cors');

const earthquakeRoutes = require('./routes/earthquakeRoutes');
const { startScheduledJob } = require('./cron/updateEarthquakesCron');

const app = express();
const PORT = process.env.PORT || 5000;

/* ----------  CORS yapılandırması  ---------- */
const whitelist = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
// Örn. .env içinde CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || whitelist.length === 0 || whitelist.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* ----------  Yerleşik Express orta katmanları  ---------- */
app.use(express.json({ limit: '1mb' }));   // olası büyük payload’ları sınırla
app.use('/api/deprem', earthquakeRoutes);

/* ----------  Sunucuyu başlat  ---------- */
app.listen(PORT, () => {
  console.log(`  Backend ${PORT} portunda çalışıyor (NODE_ENV=${process.env.NODE_ENV}).`);
  startScheduledJob();           // cron job’u sadece 1 instance’da tetikle
});

/* ----------  Küresel hata yakalama  ---------- */
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled promise rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error(' Uncaught exception:', err);
  process.exit(1);               // Docker konteyneri yeniden başlatır
});
