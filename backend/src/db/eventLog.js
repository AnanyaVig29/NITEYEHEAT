const db = require('./database');

/**
 * Log a structured event for a session.
 * @param {'calibration'|'fixation'|'dwell'|'blink'} type
 * @param {string|null} sessionId
 * @param {object} metadata
 */
function logEvent(type, sessionId, metadata = {}) {
  try {
    db.prepare(
      'INSERT INTO event_log (session_id, type, ts, metadata) VALUES (?, ?, ?, ?)'
    ).run(sessionId || null, type, Date.now(), JSON.stringify(metadata));
  } catch (_err) {
    // Non-blocking — never throw from event logger
  }
}

/**
 * Get events for a session, optionally filtered by type.
 * @param {string} sessionId
 * @param {string|null} type
 */
function getEvents(sessionId, type = null) {
  if (type) {
    return db
      .prepare('SELECT * FROM event_log WHERE session_id = ? AND type = ? ORDER BY ts ASC')
      .all(sessionId, type);
  }
  return db
    .prepare('SELECT * FROM event_log WHERE session_id = ? ORDER BY ts ASC')
    .all(sessionId);
}

/**
 * Count events of a given type for a session.
 * @param {string} sessionId
 * @param {string} type
 */
function countEvents(sessionId, type) {
  const row = db
    .prepare('SELECT COUNT(*) as cnt FROM event_log WHERE session_id = ? AND type = ?')
    .get(sessionId, type);
  return row ? row.cnt : 0;
}

/**
 * Get aggregated event counts per session for a list of session IDs.
 * Returns a Map of sessionId -> { fixation, dwell, calibration, blink }
 */
function getSessionEventCounts(sessionIds) {
  if (!sessionIds.length) return new Map();
  const placeholders = sessionIds.map(() => '?').join(',');
  const rows = db
    .prepare(
      `SELECT session_id, type, COUNT(*) as cnt
       FROM event_log
       WHERE session_id IN (${placeholders})
       GROUP BY session_id, type`
    )
    .all(...sessionIds);

  const result = new Map();
  for (const row of rows) {
    if (!result.has(row.session_id)) {
      result.set(row.session_id, { fixation: 0, dwell: 0, calibration: 0, blink: 0 });
    }
    const bucket = result.get(row.session_id);
    if (bucket[row.type] !== undefined) {
      bucket[row.type] = row.cnt;
    }
  }
  return result;
}

module.exports = { logEvent, getEvents, countEvents, getSessionEventCounts };
