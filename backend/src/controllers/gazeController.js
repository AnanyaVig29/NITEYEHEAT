const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { logEvent } = require('../db/eventLog');

function startSession(req, res) {
  const { pageUrl, device = 'desktop', userType = 'new' } = req.body || {};

  if (!pageUrl || typeof pageUrl !== 'string') {
    return res.status(400).json({ error: 'pageUrl is required' });
  }

  const sessionId = uuidv4();
  db.prepare(
    'INSERT INTO sessions (id, page_url, created_at, device, user_type) VALUES (?, ?, ?, ?, ?)'
  ).run(sessionId, pageUrl, Date.now(), device, userType);

  return res.json({ sessionId });
}

function saveBatch(req, res) {
  const { sessionId, points } = req.body || {};

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  if (!Array.isArray(points)) {
    return res.status(400).json({ error: 'points must be an array' });
  }

  if (!points.length) {
    return res.json({ saved: 0 });
  }

  const hasInvalidPoint = points.some(
    (p) =>
      !p ||
      typeof p.x !== 'number' ||
      typeof p.y !== 'number' ||
      typeof p.ts !== 'number'
  );

  if (hasInvalidPoint) {
    return res.status(400).json({
      error: 'each point must include numeric x, y, and ts values',
    });
  }

  const sessionExists = db
    .prepare('SELECT id FROM sessions WHERE id = ?')
    .get(sessionId);

  if (!sessionExists) {
    return res.status(404).json({ error: 'session not found' });
  }

  const insert = db.prepare(
    'INSERT INTO gaze_points (session_id, x, y, ts, type) VALUES (?, ?, ?, ?, ?)'
  );

  const insertMany =
    typeof db.transaction === 'function'
      ? db.transaction((batchPoints) => {
          for (const p of batchPoints) {
            insert.run(sessionId, p.x, p.y, p.ts, p.type || 'gaze');
          }
        })
      : (batchPoints) => {
          db.exec('BEGIN');
          try {
            for (const p of batchPoints) {
              insert.run(sessionId, p.x, p.y, p.ts, p.type || 'gaze');
            }
            db.exec('COMMIT');
          } catch (err) {
            db.exec('ROLLBACK');
            throw err;
          }
        };

  insertMany(points);

  db.prepare(
    'UPDATE sessions SET point_count = point_count + ? WHERE id = ?'
  ).run(points.length, sessionId);

  // Detect fixation clusters and log them as events
  try {
    let clusterStart = 0;
    let clusterLen = 1;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      if (dist <= 20) {
        clusterLen += 1;
        if (clusterLen === 3) {
          // Log a fixation event at the cluster centroid
          const slice = points.slice(clusterStart, i + 1);
          const cx = Math.round(slice.reduce((s, p) => s + p.x, 0) / slice.length);
          const cy = Math.round(slice.reduce((s, p) => s + p.y, 0) / slice.length);
          logEvent('fixation', sessionId, { x: cx, y: cy, length: clusterLen, ts: curr.ts });
        }
      } else {
        clusterStart = i;
        clusterLen = 1;
      }
    }
  } catch (_err) {
    // Non-blocking
  }

  return res.json({ saved: points.length });
}

function endSession(req, res) {
  const { sessionId } = req.body || {};

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const result = db
    .prepare('UPDATE sessions SET ended_at = ? WHERE id = ?')
    .run(Date.now(), sessionId);

  if (!result.changes) {
    return res.status(404).json({ error: 'session not found' });
  }

  return res.json({ ok: true });
}

module.exports = {
  startSession,
  saveBatch,
  endSession,
};
