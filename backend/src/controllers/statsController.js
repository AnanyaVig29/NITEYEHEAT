const db = require('../db/database');

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

function derivePatternDistribution(points) {
  if (!points.length) {
    return {
      f: 0,
      z: 0,
      layerCake: 0,
      spotted: 0,
    };
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const xRange = Math.max(1, maxX - minX);
  const yRange = Math.max(1, maxY - minY);

  let leftHits = 0;
  let topHits = 0;
  let rowBandHits = 0;

  const grid = new Set();

  for (const p of points) {
    const nx = (p.x - minX) / xRange;
    const ny = (p.y - minY) / yRange;

    if (nx < 0.35) leftHits += 1;
    if (ny < 0.35) topHits += 1;

    const yBand = Math.floor(ny * 5);
    if (yBand === 0 || yBand === 1 || yBand === 3) rowBandHits += 1;

    const gx = clamp(Math.floor(nx * 4), 0, 3);
    const gy = clamp(Math.floor(ny * 4), 0, 3);
    grid.add(`${gx}:${gy}`);
  }

  const total = points.length;
  const leftRatio = leftHits / total;
  const topRatio = topHits / total;
  const rowBandRatio = rowBandHits / total;
  const spreadRatio = grid.size / 16;

  const f = clamp(Math.round((leftRatio * 0.55 + topRatio * 0.45) * 100), 0, 100);
  const layerCake = clamp(Math.round(rowBandRatio * 100), 0, 100);
  const spotted = clamp(Math.round(spreadRatio * 100), 0, 100);
  const z = clamp(Math.round((100 - Math.abs(f - 60) - Math.abs(layerCake - 50) + spotted) / 2), 0, 100);

  return {
    f,
    z,
    layerCake,
    spotted,
  };
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
         type
       FROM gaze_points
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
    rage: recentPoints.filter(p => p.type === 'rage'),
    scroll: recentPoints, // Scroll uses all points for depth
  };

  const scrollDepth = deriveScrollDepth(recentPoints);
  const sectionEngagement = deriveSectionEngagement(recentPoints);
  const topElements = deriveTopElements(recentPoints);
  const patterns = derivePatternDistribution(recentPoints);

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

  return res.json({
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
      sessionCount: recentSessions.length,
    },
    topPages,
    topElements,
    sectionEngagement,
    scrollDepth,
    patterns,
    alerts,
    recommendations,
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
  });
}

module.exports = {
  getLiveStats,
};
