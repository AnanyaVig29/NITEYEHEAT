const db = require('../db/database');
const { logEvent, countEvents } = require('../db/eventLog');

// Simple TTL cache — prevents hammering SQLite on rapid 3s polls
const CACHE_TTL_MS = 1500;
let statsCache = null;
let statsCachedAt = 0;

function getPathFromUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '/';

  try {
    const parsed = new URL(rawUrl);
    return parsed.pathname || '/';
  } catch (_err) {
    if (rawUrl.startsWith('/')) return rawUrl;
    return '/';
  }
}

function toPct(value) {
  return Number(value.toFixed(1));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function deriveAoiStats(points) {
  if (!points.length) {
    return {
      quadrants: {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
      },
      attentionScore: 0,
      missedZones: [],
      timeToFirstFixationMs: null,
    };
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const xMid = minX + (maxX - minX) / 2;
  const yMid = minY + (maxY - minY) / 2;

  const quadrants = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  };

  let firstFixationAt = null;
  let currentRun = 1;
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    const key = p.x <= xMid ? (p.y <= yMid ? 'topLeft' : 'bottomLeft') : p.y <= yMid ? 'topRight' : 'bottomRight';
    quadrants[key] += 1;

    if (i > 0) {
      const prev = points[i - 1];
      const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
      if (dist <= 20) {
        currentRun += 1;
        if (currentRun >= 3 && firstFixationAt === null) {
          firstFixationAt = p.ts - points[0].ts;
        }
      } else {
        currentRun = 1;
      }
    }
  }

  const total = points.length;
  const activeZones = Object.values(quadrants).filter((count) => count > 0).length;
  const spreadRatio = activeZones / 4;
  const attentionScore = clamp(Math.round(((firstFixationAt ? 100 - Math.min(firstFixationAt / 20, 100) : 50) + spreadRatio * 100) / 2), 0, 100);

  const missedZones = Object.entries(quadrants)
    .filter(([, count]) => count === 0)
    .map(([label]) => label);

  return {
    quadrants,
    attentionScore,
    missedZones,
    timeToFirstFixationMs: firstFixationAt,
  };
}

function derivePatternDistribution(points) {
  if (!points.length) {
    return { f: 0, z: 0, layerCake: 0, spotted: 0 };
  }

  // Focus on the most recent 1000 points for real-time reactivity
  const activePoints = points.slice(0, 1000);
  const xs = activePoints.map((p) => p.x);
  const ys = activePoints.map((p) => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const xRange = Math.max(1, maxX - minX);
  const yRange = Math.max(1, maxY - minY);

  let leftHits = 0;
  let topHits = 0;
  let middleHits = 0;
  let bottomHits = 0;
  let diagonalHits = 0;

  const grid = new Set();

  for (const p of activePoints) {
    const nx = (p.x - minX) / xRange;
    const ny = (p.y - minY) / yRange;

    if (nx < 0.3) leftHits += 1;
    if (ny < 0.3) topHits += 1;
    if (ny >= 0.4 && ny <= 0.6) middleHits += 1;
    if (ny > 0.7) bottomHits += 1;
    
    // Diagonal for Z-pattern (top-right to bottom-left)
    if (Math.abs((1 - nx) - ny) < 0.2) diagonalHits += 1;

    const gx = clamp(Math.floor(nx * 4), 0, 3);
    const gy = clamp(Math.floor(ny * 4), 0, 3);
    grid.add(`${gx}:${gy}`);
  }

  const total = activePoints.length;
  const leftRatio = leftHits / total;
  const topRatio = topHits / total;
  const midRatio = middleHits / total;
  const botRatio = bottomHits / total;
  const diagRatio = diagonalHits / total;
  const spreadRatio = grid.size / 16;

  // F-Pattern: Heavy top and left vertical
  const f = clamp(Math.round((leftRatio * 0.6 + topRatio * 0.4) * 100), 0, 100);
  
  // Z-Pattern: Top, Diagonal, and Bottom
  const z = clamp(Math.round((topRatio * 0.3 + diagRatio * 0.4 + botRatio * 0.3) * 100), 0, 100);
  
  // Layer Cake: Concentrated horizontal bands (top and middle)
  const layerCake = clamp(Math.round((topRatio * 0.5 + midRatio * 0.5) * 100), 0, 100);
  
  // Spotted: High spread across the grid
  const spotted = clamp(Math.round(spreadRatio * 100), 0, 100);

  return { f, z, layerCake, spotted };
}

function deriveScrollDepth(points) {
  if (!points.length) {
    return [25, 25, 25, 25];
  }

  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = Math.max(1, maxY - minY);

  const buckets = [0, 0, 0, 0];
  for (const p of points) {
    const normalized = (p.y - minY) / range;
    const idx = clamp(Math.floor(normalized * 4), 0, 3);
    buckets[idx] += 1;
  }

  const total = points.length;
  return buckets.map((count) => toPct((count / total) * 100));
}

function deriveSectionEngagement(points) {
  const sections = ['Hero', 'Features', 'Pricing', 'Testimonials', 'Contact', 'Footer'];

  if (!points.length) {
    return sections.map((label) => ({ label, score: 0 }));
  }

  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = Math.max(1, maxY - minY);

  const counts = [0, 0, 0, 0, 0, 0];
  for (const p of points) {
    const normalized = (p.y - minY) / range;
    const idx = clamp(Math.floor(normalized * 6), 0, 5);
    counts[idx] += 1;
  }

  const maxCount = Math.max(1, ...counts);
  return counts.map((count, i) => ({
    label: sections[i],
    score: Math.round((count / maxCount) * 100),
  }));
}

function deriveTopElements(points) {
  if (!points.length) {
    return [];
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const xRange = Math.max(1, maxX - minX);
  const yRange = Math.max(1, maxY - minY);

  const labels = [
    'Header Navigation',
    'Hero CTA',
    'Feature List',
    'Pricing Section',
    'Testimonials',
    'Footer Links',
    'Sidebar Panel',
    'Form Fields',
    'Secondary CTA',
  ];

  const buckets = new Map();
  for (let i = 0; i < labels.length; i += 1) {
    buckets.set(i, 0);
  }

  for (const p of points) {
    const nx = (p.x - minX) / xRange;
    const ny = (p.y - minY) / yRange;
    const gx = clamp(Math.floor(nx * 3), 0, 2);
    const gy = clamp(Math.floor(ny * 3), 0, 2);
    const idx = gy * 3 + gx;
    buckets.set(idx, (buckets.get(idx) || 0) + 1);
  }

  const total = points.length;
  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([idx, count]) => ({
      element: labels[idx],
      views: count,
      percentage: toPct((count / total) * 100),
    }));
}

function getLiveStats(_req, res) {
  // Return cached response if within TTL window
  const now = Date.now();
  if (statsCache && (now - statsCachedAt) < CACHE_TTL_MS) {
    return res.json(statsCache);
  }

  const sessions = db
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

  const allPoints = db
    .prepare(
      `SELECT
         x,
         y,
         ts,
         session_id AS sessionId,
         type,
         COALESCE(s.device, 'desktop') AS device
       FROM gaze_points gp
       LEFT JOIN sessions s ON s.id = gp.session_id
       ORDER BY ts DESC
       LIMIT 5000`
    )
    .all();

  const recentPoints = [...allPoints].reverse();

  const totalSessions = sessions.length;
  const totalPoints = sessions.reduce((sum, s) => sum + (s.pointCount || 0), 0);

  const endedDurations = sessions
    .filter((s) => s.endedAt)
    .map((s) => Math.max(0, s.endedAt - s.createdAt));

  const avgDurationMs = endedDurations.length
    ? Math.round(endedDurations.reduce((sum, d) => sum + d, 0) / endedDurations.length)
    : 0;

  const avgPointsPerSession = totalSessions ? totalPoints / totalSessions : 0;
  const bounceSessions = sessions.filter((s) => (s.pointCount || 0) < 20).length;
  const bounceRate = totalSessions ? toPct((bounceSessions / totalSessions) * 100) : 0;

  const sessionsByPathMap = new Map();
  for (const s of sessions) {
    const path = getPathFromUrl(s.pageUrl);
    if (!sessionsByPathMap.has(path)) {
      sessionsByPathMap.set(path, {
        path,
        sessions: 0,
        points: 0,
        durationTotal: 0,
        durationCount: 0,
      });
    }

    const bucket = sessionsByPathMap.get(path);
    bucket.sessions += 1;
    bucket.points += s.pointCount || 0;

    if (s.endedAt) {
      bucket.durationTotal += Math.max(0, s.endedAt - s.createdAt);
      bucket.durationCount += 1;
    }
  }

  const topPages = [...sessionsByPathMap.values()]
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 6)
    .map((p) => ({
      page: p.path,
      sessions: p.sessions,
      points: p.points,
      avgDurationMs: p.durationCount ? Math.round(p.durationTotal / p.durationCount) : 0,
      engagementScore: clamp(Math.round((p.points / Math.max(1, p.sessions)) * 1.2), 0, 100),
    }));

  const recentSessions = sessions.slice(0, 8).map((s) => ({
    id: s.id,
    pageUrl: s.pageUrl,
    createdAt: s.createdAt,
    endedAt: s.endedAt,
    pointCount: s.pointCount,
    durationMs: s.endedAt ? Math.max(0, s.endedAt - s.createdAt) : 0,
    device: s.device,
    userType: s.userType,
  }));

  const segmentedPoints = {
    gaze: recentPoints.filter(p => p.type === 'gaze' || !p.type),
    click: recentPoints.filter(p => p.type === 'click'),
    move: recentPoints.filter(p => p.type === 'move'),
    scroll: recentPoints, // Scroll uses all points for depth
  };

  const segmentedByDevice = {
    all: segmentedPoints,
    desktop: {
      gaze: segmentedPoints.gaze.filter((p) => p.device !== 'mobile'),
      click: segmentedPoints.click.filter((p) => p.device !== 'mobile'),
      move: segmentedPoints.move.filter((p) => p.device !== 'mobile'),
      scroll: segmentedPoints.scroll.filter((p) => p.device !== 'mobile'),
    },
    mobile: {
      gaze: segmentedPoints.gaze.filter((p) => p.device === 'mobile'),
      click: segmentedPoints.click.filter((p) => p.device === 'mobile'),
      move: segmentedPoints.move.filter((p) => p.device === 'mobile'),
      scroll: segmentedPoints.scroll.filter((p) => p.device === 'mobile'),
    },
  };

  const scrollDepth = deriveScrollDepth(recentPoints);
  const sectionEngagement = deriveSectionEngagement(recentPoints);
  const topElements = deriveTopElements(recentPoints);
  const patterns = derivePatternDistribution(recentPoints);
  const aoiStats = deriveAoiStats(recentPoints);

  const returnVisitors = totalSessions > 1 ? toPct(((totalSessions - 1) / totalSessions) * 100) : 0;
  const attentionRetention = clamp(Math.round(100 - bounceRate), 0, 100);
  const engagementScore = clamp(Math.round((attentionRetention + Math.min(100, avgPointsPerSession)) / 2), 0, 100);

  const alerts = [
    {
      title: 'High Bounce Sessions',
      desc: `${bounceRate}% sessions ended with less than 20 gaze points`,
      severity: bounceRate >= 40 ? 'high' : 'medium',
      value: bounceRate,
    },
    {
      title: 'Average Session Duration',
      desc: `${Math.round(avgDurationMs / 1000)}s across tracked sessions`,
      severity: avgDurationMs < 20000 ? 'medium' : 'low',
      value: avgDurationMs,
    },
    {
      title: 'Live Tracking Volume',
      desc: `${totalPoints} gaze points captured`,
      severity: totalPoints < 300 ? 'medium' : 'low',
      value: totalPoints,
    },
  ];

  const recommendations = [
    {
      title: 'Improve Primary CTA Visibility',
      summary: topElements[0]
        ? `${topElements[0].element} received ${topElements[0].percentage}% of recent attention.`
        : 'Collect more gaze sessions to identify your strongest attention zone.',
    },
    {
      title: 'Optimize Mid-Page Content',
      summary: `Scroll depth (25-50%) is ${scrollDepth[1]}% and (50-75%) is ${scrollDepth[2]}%.`,
    },
    {
      title: 'Reduce Early Drop-Off',
      summary: `${bounceSessions} of ${totalSessions} sessions show low gaze activity.`,
    },
  ];

  const midpoint = Math.max(1, Math.floor(recentSessions.length / 2));
  const variantA = recentSessions.slice(0, midpoint);
  const variantB = recentSessions.slice(midpoint);

  const calcVariant = (rows) => {
    if (!rows.length) {
      return {
        sessions: 0,
        avgPoints: 0,
        avgDurationMs: 0,
      };
    }

    const points = rows.reduce((sum, r) => sum + r.pointCount, 0);
    const duration = rows.reduce((sum, r) => sum + (r.durationMs || 0), 0);

    return {
      sessions: rows.length,
      avgPoints: Math.round(points / rows.length),
      avgDurationMs: Math.round(duration / rows.length),
    };
  };

  const ab = {
    variantA: calcVariant(variantA),
    variantB: calcVariant(variantB),
  };

  const payload = {
    generatedAt: Date.now(),
    totals: {
      sessions: totalSessions,
      users: totalSessions,
      points: totalPoints,
      avgDurationMs,
      avgPointsPerSession: toPct(avgPointsPerSession),
      bounceRate,
      pageViews: totalSessions,
      attentionRetention,
      engagementScore,
      returnVisitors,
      ttffMs: totalPoints ? clamp(Math.round(1200 - avgPointsPerSession * 12), 150, 2000) : 0,
    },
    heatmap: {
      points: recentPoints,
      segmented: segmentedPoints,
      segmentedByDevice,
      sessionCount: recentSessions.length,
    },
    topPages,
    topElements,
    sectionEngagement,
    scrollDepth,
    patterns,
    alerts,
    recommendations,
    aoiStats,
    ab,
    recentSessions,
    deviceStats: {
      desktop: sessions.filter(s => s.device === 'desktop').length,
      mobile: sessions.filter(s => s.device === 'mobile').length,
    },
    userTypeStats: {
      new: sessions.filter(s => s.userType === 'new').length,
      returning: sessions.filter(s => s.userType === 'returning').length,
    }
  };

  // Store in TTL cache
  statsCache = payload;
  statsCachedAt = Date.now();

  return res.json(payload);
}

function logCalibrationEvent(req, res) {
  const { sessionId, quality = 'good', pointsCompleted = 9 } = req.body || {};
  logEvent('calibration', sessionId || null, { quality, pointsCompleted });
  return res.json({ ok: true });
}

function logDwellEvent(req, res) {
  const { sessionId, element, x, y } = req.body || {};
  logEvent('dwell', sessionId || null, { element, x, y });
  return res.json({ ok: true });
}

function logBlinkEvent(req, res) {
  const { sessionId } = req.body || {};
  logEvent('blink', sessionId || null, {});
  return res.json({ ok: true });
}

module.exports = {
  getLiveStats,
  logCalibrationEvent,
  logDwellEvent,
  logBlinkEvent,
};

