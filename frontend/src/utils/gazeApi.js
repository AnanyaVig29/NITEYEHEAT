const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const ENV_API_BASE = API_ROOT.endsWith('/api') ? API_ROOT : `${API_ROOT}/api`;
const API_PORT_CANDIDATES = [3001, 3002, 3003, 3004, 3005, 3010];
let resolvedApiBase = '';
let resolvingApiPromise = null;

function getApiCandidates() {
  if (typeof window === 'undefined') {
    return [ENV_API_BASE];
  }

  const host = window.location.hostname || 'localhost';
  const protocol = window.location.protocol || 'http:';
  const hostCandidates = API_PORT_CANDIDATES.map((port) => `${protocol}//${host}:${port}/api`);
  const localhostFallback =
    host === 'localhost'
      ? API_PORT_CANDIDATES.map((port) => `${protocol}//127.0.0.1:${port}/api`)
      : [];

  return [ENV_API_BASE, ...hostCandidates, ...localhostFallback].filter(
    (base, index, arr) => Boolean(base) && arr.indexOf(base) === index
  );
}

async function detectApiBase() {
  const candidates = getApiCandidates();
  for (const base of candidates) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(`${base.replace(/\/api$/, '')}/health`, { cache: 'no-store' });
      if (res.ok) {
        return base;
      }
    } catch (_err) {
      // Try next candidate.
    }
  }
  throw new Error('Backend API not reachable');
}

async function resolveApiBase() {
  if (resolvedApiBase) return resolvedApiBase;
  if (!resolvingApiPromise) {
    resolvingApiPromise = detectApiBase()
      .then((base) => {
        resolvedApiBase = base;
        return base;
      })
      .finally(() => {
        resolvingApiPromise = null;
      });
  }

  return resolvingApiPromise;
}

async function apiFetch(path, options) {
  const base = await resolveApiBase();
  return fetch(`${base}${path}`, options);
}

function detectDevice() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);
  const smallViewport = window.innerWidth <= 900;
  return mobileUA || smallViewport ? 'mobile' : 'desktop';
}

function detectUserType() {
  if (typeof window === 'undefined') return 'new';
  const key = 'eyeheat_visitor_seen';
  const seen = localStorage.getItem(key);
  if (seen) return 'returning';
  localStorage.setItem(key, '1');
  return 'new';
}

export async function startSession(pageUrl, metadata = {}) {
  const payload = {
    pageUrl,
    device: metadata.device || detectDevice(),
    userType: metadata.userType || detectUserType(),
  };

  const res = await apiFetch('/gaze/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to start session');
  }

  return res.json();
}

export async function postBatch(sessionId, points) {
  if (!points.length) return;

  const res = await apiFetch('/gaze/batch', {
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
  const res = await apiFetch('/gaze/end', {
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
  const res = await apiFetch('/sessions');
  if (!res.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return res.json();
}

export async function getLiveStats() {
  const res = await apiFetch('/stats/live');
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
