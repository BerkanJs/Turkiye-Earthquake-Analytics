const db = require('./src/db');

async function testConnection() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('DB Bağlantısı başarılı:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('DB Bağlantı hatası:', err);
    process.exit(1);
  }
}

testConnection();
