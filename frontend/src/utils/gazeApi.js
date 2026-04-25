const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const API_BASE = API_ROOT.endsWith('/api') ? API_ROOT : `${API_ROOT}/api`;

export async function startSession(pageUrl) {
  const res = await fetch(`${API_BASE}/gaze/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageUrl }),
  });

  if (!res.ok) {
    throw new Error('Failed to start session');
  }

  return res.json();
}

export async function postBatch(sessionId, points) {
  if (!points.length) return;

  const res = await fetch(`${API_BASE}/gaze/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, points }),
  });

  if (!res.ok) {
    throw new Error('Failed to save gaze batch');
  }

  return res.json();
}

export async function endSession(sessionId) {
  const res = await fetch(`${API_BASE}/gaze/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  if (!res.ok) {
    throw new Error('Failed to end session');
  }

  return res.json();
}

export async function getSessions() {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return res.json();
}

export async function getLiveStats() {
  const res = await fetch(`${API_BASE}/stats/live`);
  if (!res.ok) {
    throw new Error('Failed to fetch live stats');
  }

  return res.json();
}

export function startBatchInterval(sessionId, getPoints, clearBuffer, onSaved) {
  return setInterval(async () => {
    const points = getPoints();
    if (!points.length) return;

    try {
      const result = await postBatch(sessionId, points);
      clearBuffer();
      onSaved?.(result?.saved || points.length);
    } catch (err) {
      console.error('Failed to post gaze batch:', err);
    }
  }, 5000);
}
