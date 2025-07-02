const express = require('express');
const router = express.Router();
const earthquakeController = require('../controllers/earthquakeController');

router.get('/son', earthquakeController.getLastEarthquakes);
router.post('/update', earthquakeController.updateEarthquakeData);

module.exports = router;
