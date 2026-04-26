const express = require('express');
const { getLiveStats, logCalibrationEvent, logDwellEvent, logBlinkEvent } = require('../controllers/statsController');

const router = express.Router();

router.get('/live', getLiveStats);
router.post('/log/calibration', logCalibrationEvent);
router.post('/log/dwell', logDwellEvent);
router.post('/log/blink', logBlinkEvent);

module.exports = router;

