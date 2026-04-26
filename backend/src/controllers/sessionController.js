const db = require('../db/database');
const { getSessionEventCounts, getEvents, countEvents } = require('../db/eventLog');

function listSessions(_req, res) {
  const rows = db
    .prepare(
      `SELECT
         id,
         page_url AS pageUrl,
         created_at AS createdAt,
         ended_at AS endedAt,
         point_count AS pointCount,
         device,
         user_type AS userType
       FROM sessions
       ORDER BY created_at DESC`
    )
    .all();

  const sessionIds = rows.map(r => r.id);
  const eventCounts = getSessionEventCounts(sessionIds);

  const sessions = rows.map((row) => {
    const durationMs = row.endedAt ? Math.max(0, row.endedAt - row.createdAt) : null;
    const counts = eventCounts.get(row.id) || { fixation: 0, dwell: 0, calibration: 0, blink: 0 };
    const engagementScore = Math.min(
      100,
      Math.round(
        ((row.pointCount || 0) * 0.4 + counts.fixation * 2 + counts.dwell * 3) /
          Math.max(1, (durationMs || 1) / 10000)
      )
    );
    return {
      ...row,
      durationMs,
      fixationCount: counts.fixation,
      dwellCount: counts.dwell,
      blinkCount: counts.blink,
      engagementScore: Math.min(100, engagementScore),
    };
  });

  return res.json(sessions);
}

function getSessionPoints(req, res) {
  const { id } = req.params;

  const session = db
    .prepare(
      `SELECT
         id,
         page_url AS pageUrl,
         created_at AS createdAt,
         ended_at AS endedAt,
         point_count AS pointCount
       FROM sessions
       WHERE id = ?`
    )
    .get(id);

  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }

  const points = db
    .prepare(
      `SELECT
         x,
         y,
         ts
       FROM gaze_points
       WHERE session_id = ?
       ORDER BY ts ASC`
    )
    .all(id);

  return res.json({
    session,
    points,
  });
}

function exportSessionCsv(req, res) {
  const { id } = req.params;

  const session = db.prepare('SELECT id FROM sessions WHERE id = ?').get(id);

  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }

  const points = db
    .prepare(
      `SELECT
         x,
         y,
         ts
       FROM gaze_points
       WHERE session_id = ?
       ORDER BY ts ASC`
    )
    .all(id);

  const csvRows = ['x,y,ts'];
  for (const p of points) {
    csvRows.push(`${p.x},${p.y},${p.ts}`);
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="session-${id}.csv"`);

  return res.send(csvRows.join('\n'));
}

function exportSessionJson(req, res) {
  const { id } = req.params;

  const session = db
    .prepare(
      `SELECT
         id,
         page_url AS pageUrl,
         created_at AS createdAt,
         ended_at AS endedAt,
         point_count AS pointCount,
         device,
         user_type AS userType
       FROM sessions
       WHERE id = ?`
    )
    .get(id);

  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }

  const points = db
    .prepare(
      `SELECT
         x,
         y,
         ts,
         type
       FROM gaze_points
       WHERE session_id = ?
       ORDER BY ts ASC`
    )
    .all(id);

  const payload = {
    session: {
      ...session,
      durationMs: session.endedAt ? Math.max(0, session.endedAt - session.createdAt) : null,
    },
    points,
    exportedAt: Date.now(),
  };

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="session-${id}.json"`);

  return res.send(JSON.stringify(payload, null, 2));
}

function getSessionSummary(req, res) {
  const { id } = req.params;

  const session = db
    .prepare(
      `SELECT
         id,
         page_url AS pageUrl,
         created_at AS createdAt,
         ended_at AS endedAt,
         point_count AS pointCount,
         device,
         user_type AS userType
       FROM sessions
       WHERE id = ?`
    )
    .get(id);

  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }

  const points = db
    .prepare('SELECT x, y, ts FROM gaze_points WHERE session_id = ? ORDER BY ts ASC')
    .all(id);

  const fixationCount = countEvents(id, 'fixation');
  const dwellCount = countEvents(id, 'dwell');
  const blinkCount = countEvents(id, 'blink');
  const calibrationEvents = getEvents(id, 'calibration');

  const durationMs = session.endedAt ? Math.max(0, session.endedAt - session.createdAt) : null;

  // Quadrant breakdown from gaze points
  let quadrants = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
  if (points.length) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const xMid = (Math.min(...xs) + Math.max(...xs)) / 2;
    const yMid = (Math.min(...ys) + Math.max(...ys)) / 2;
    for (const p of points) {
      const key = p.x <= xMid ? (p.y <= yMid ? 'topLeft' : 'bottomLeft') : (p.y <= yMid ? 'topRight' : 'bottomRight');
      quadrants[key] += 1;
    }
  }

  const total = points.length || 1;
  const missedZones = Object.entries(quadrants).filter(([, c]) => c === 0).map(([k]) => k);
  const attentionScore = Math.min(100, Math.round(
    ((Object.values(quadrants).filter(c => c > 0).length / 4) * 100 +
    (fixationCount * 2)) / 2
  ));

  return res.json({
    session: { ...session, durationMs },
    pointCount: points.length,
    fixationCount,
    dwellCount,
    blinkCount,
    calibrationQuality: calibrationEvents.length > 0
      ? (calibrationEvents[calibrationEvents.length - 1].metadata
          ? JSON.parse(calibrationEvents[calibrationEvents.length - 1].metadata).quality || 'good'
          : 'good')
      : 'uncalibrated',
    aoiStats: { quadrants, missedZones, attentionScore },
  });
}

module.exports = {
  listSessions,
  getSessionPoints,
  exportSessionCsv,
  exportSessionJson,
  getSessionSummary,
};
