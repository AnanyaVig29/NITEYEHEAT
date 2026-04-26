const express = require('express');
const {
  listSessions,
  getSessionPoints,
  exportSessionCsv,
  exportSessionJson,
  getSessionSummary,
} = require('../controllers/sessionController');

const router = express.Router();

router.get('/', listSessions);
router.get('/:id/json', exportSessionJson);
router.get('/:id/csv', exportSessionCsv);
router.get('/:id/summary', getSessionSummary);
router.get('/:id', getSessionPoints);

module.exports = router;
