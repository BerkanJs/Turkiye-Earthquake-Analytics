const express=require('express');
const earthquakeRoutes=require('./routes/earthquakeRoutes');
const { startScheduledJob } = require('./cron/updateEarthquakesCron');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port =process.env.PORT||5000;
app.use(cors());
app.use(express.json());
app.use('/api/deprem',earthquakeRoutes);

app.listen(port,()=>{
    console.log(`Server ${port} portunda çalışıyor.`);
    startScheduledJob();  

});
