import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CalibrationOverlay from './CalibrationOverlay';
import HeatmapCanvas from './HeatmapCanvas';
import SessionControls from './SessionControls';
import AoiStatsPanel from './AoiStatsPanel';
import DwellIndicator from './DwellIndicator';
import { useWebGazer } from '../hooks/useWebGazer';
import { useGazeBuffer } from '../hooks/useGazeBuffer';
import { useBlinkDetector } from '../hooks/useBlinkDetector';
import {
  endSession,
  getSessions,
  startBatchInterval,
  startSession,
  postBatch,
  getLiveStats,
  logCalibrationQuality,
  logDwellClick,
  logBlinkEvent,
} from '../utils/gazeApi';
import SaccadePathCanvas from './SaccadePathCanvas';

const DWELL_MS = 1200;

export default function GazeTracker() {
  const [trackingActive, setTrackingActive] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [status, setStatus] = useState('idle');
  const [sessionId, setSessionId] = useState('');
  const [savedPoints, setSavedPoints] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [pointCount, setPointCount] = useState(0);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [attentionScore, setAttentionScore] = useState(0);
  const [aoiStats, setAoiStats] = useState(null);
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);

  // ── Refs ─────────────────────────────────────────────────────────────
  // All dwell & scroll state uses refs to avoid stale closures in callbacks
  const dwellCandidateRef = useRef(null);
  const dwellSinceRef = useRef(0);
  const scrollTimerRef = useRef(null);
  const batchTimerRef = useRef(null);
  const lastGazePointRef = useRef(null);
  const uploadQueueRef = useRef([]);
  const sessionIdRef = useRef('');
  const scanningEnabledRef = useRef(true);
  const calibratedRef = useRef(false);
  const trackingActiveRef = useRef(false);

  // ── Dwell candidate state for DwellIndicator (display only) ──────────
  const [dwellDisplayTarget, setDwellDisplayTarget] = useState(null);
  const [dwellDisplaySince, setDwellDisplaySince] = useState(0);

  const renderBuffer = useGazeBuffer(2000);

  // Keep refs in sync with state
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { scanningEnabledRef.current = scanningEnabled; }, [scanningEnabled]);
  useEffect(() => { calibratedRef.current = calibrated; }, [calibrated]);
  useEffect(() => { trackingActiveRef.current = trackingActive; }, [trackingActive]);

  // ── Gaze handler ─────────────────────────────────────────────────────
  const handleGaze = useCallback(
    (point) => {
      renderBuffer.push(point);
      uploadQueueRef.current.push(point);
      lastGazePointRef.current = point;
    },
    [renderBuffer]
  );

  useWebGazer({
    onGaze: handleGaze,
    enabled: trackingActive,
    privacyMode,
    onError: (err) => {
      setError(err?.message || 'WebGazer failed to initialize');
      setTrackingActive(false);
      setStatus('error');
    },
  });

  // ── Blink detection ───────────────────────────────────────────────────
  useBlinkDetector({
    enabled: trackingActive && calibrated,
    onBlink: useCallback(() => {
      setBlinkCount((c) => c + 1);
      logBlinkEvent(sessionIdRef.current);
      // TODO: wire blink actions here (e.g., back/refresh gesture)
    }, []),
  });

  // ── Point count sync ─────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (trackingActive) {
      interval = setInterval(() => {
        setPointCount(renderBuffer.getSize());
      }, 500);
    }
    return () => clearInterval(interval);
  }, [trackingActive, renderBuffer]);

  // ── Gaze scrolling + dwell click (ref-based, no stale closures) ──────
  const clearScrollTimer = useCallback(() => {
    if (scrollTimerRef.current) {
      clearInterval(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  const handlePagePointInteraction = useCallback((point) => {
    if (!scanningEnabledRef.current || !trackingActiveRef.current || !calibratedRef.current) return;

    const now = Date.now();

    // ── Gaze scrolling ───────────────────────────────────────────────
    const nearBottom = point.y > window.innerHeight * 0.9;
    const nearTop = point.y < window.innerHeight * 0.1;

    if (nearBottom || nearTop) {
      if (!scrollTimerRef.current) {
        scrollTimerRef.current = setInterval(() => {
          window.scrollBy({ top: nearBottom ? 120 : -120, behavior: 'smooth' });
        }, 220);
      }
    } else {
      clearScrollTimer();
    }

    // ── Dwell-clicking ───────────────────────────────────────────────
    const element = document.elementFromPoint(point.x, point.y);
    const isClickable =
      element && ['BUTTON', 'A', 'INPUT', 'LABEL', 'SELECT'].includes(element.tagName);

    if (isClickable) {
      if (dwellCandidateRef.current !== element) {
        // New element — reset dwell
        dwellCandidateRef.current = element;
        dwellSinceRef.current = now;
        setDwellDisplayTarget(element);
        setDwellDisplaySince(now);
      } else if (now - dwellSinceRef.current > DWELL_MS) {
        // Dwell completed — trigger click
        element.click();
        logDwellClick(
          sessionIdRef.current,
          element.tagName + (element.id ? `#${element.id}` : ''),
          Math.round(point.x),
          Math.round(point.y)
        );
        // Reset
        dwellCandidateRef.current = null;
        dwellSinceRef.current = 0;
        setDwellDisplayTarget(null);
        setDwellDisplaySince(0);
      }
    } else {
      if (dwellCandidateRef.current) {
        dwellCandidateRef.current = null;
        dwellSinceRef.current = 0;
        setDwellDisplayTarget(null);
        setDwellDisplaySince(0);
      }
    }
  }, [clearScrollTimer]);

  // ── Ticker for gaze interaction loop ─────────────────────────────────
  useEffect(() => {
    if (!trackingActive || !calibrated) return undefined;

    const interval = setInterval(() => {
      const point = lastGazePointRef.current;
      if (point) handlePagePointInteraction(point);
    }, 250);

    return () => {
      clearInterval(interval);
      clearScrollTimer();
    };
  }, [calibrated, clearScrollTimer, handlePagePointInteraction, trackingActive]);

  // ── Session management ───────────────────────────────────────────────
  const refreshSessions = useCallback(async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch sessions');
    }
  }, []);

  const clearBatchTimer = useCallback(() => {
    if (batchTimerRef.current) {
      clearInterval(batchTimerRef.current);
      batchTimerRef.current = null;
    }
  }, []);

  const stopTracking = useCallback(async () => {
    setTrackingActive(false);
    setShowCalibration(false);
    setCalibrated(false);
    setStatus('stopped');
    setDwellDisplayTarget(null);
    setDwellDisplaySince(0);

    clearBatchTimer();
    clearScrollTimer();
    dwellCandidateRef.current = null;
    dwellSinceRef.current = 0;

    const sid = sessionIdRef.current;
    if (sid) {
      try {
        const pending = uploadQueueRef.current;
        if (pending.length) {
          await postBatch(sid, pending);
          setSavedPoints((prev) => prev + pending.length);
        }
        await endSession(sid);
      } catch (_err) {
        // Ignore stop errors to keep UI responsive.
      }
    }

    setSessionId('');
    renderBuffer.clear();
    uploadQueueRef.current = [];
    refreshSessions();
  }, [clearBatchTimer, clearScrollTimer, refreshSessions, renderBuffer]);

  const startTrackingSession = useCallback(async () => {
    try {
      setError('');
      setStatus('initializing');
      renderBuffer.clear();
      uploadQueueRef.current = [];
      setSavedPoints(0);
      setBlinkCount(0);
      setCalibrated(false);
      setShowCalibration(true);
      setTrackingActive(true);
    } catch (err) {
      setError(err?.message || 'Failed to start tracking');
      setStatus('error');
      setTrackingActive(false);
    }
  }, [renderBuffer]);

  const handleRecalibrate = useCallback(() => {
    setCalibrated(false);
    setShowCalibration(true);
  }, []);

  const handleStartWebcam = useCallback(async () => {
    setTrackingActive(true);
    setStatus('webcam_active');
  }, []);

  const handleTogglePrivacyMode = useCallback(() => {
    setPrivacyMode((prev) => !prev);
  }, []);

  const handleToggleScanning = useCallback(() => {
    setScanningEnabled((prev) => !prev);
  }, []);

  const handleCalibrationComplete = useCallback(async (quality = 'good') => {
    try {
      const started = await startSession(window.location.href);
      setSessionId(started.sessionId);
      sessionIdRef.current = started.sessionId;
      setCalibrated(true);
      setShowCalibration(false);
      setStatus('tracking');
      logCalibrationQuality(started.sessionId, quality, 9);
    } catch (err) {
      setError(err?.message || 'Failed to create backend session');
      setStatus('error');
    }
  }, []);

  // ── Batch upload interval ─────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || !trackingActive || !calibrated) {
      clearBatchTimer();
      return;
    }

    batchTimerRef.current = startBatchInterval(
      sessionId,
      () => [...uploadQueueRef.current],
      () => { uploadQueueRef.current = []; },
      (saved) => {
        setSavedPoints((prev) => prev + saved);
      }
    );

    return () => clearBatchTimer();
  }, [calibrated, clearBatchTimer, sessionId, trackingActive]);

  // ── Live analytics sync ───────────────────────────────────────────────
  useEffect(() => {
    if (!trackingActive || !calibrated) return undefined;

    const syncAnalytics = async () => {
      try {
        const data = await getLiveStats();
        setAttentionScore(Number(data?.aoiStats?.attentionScore ?? data?.totals?.engagementScore ?? 0));
        setAoiStats(data?.aoiStats || null);
      } catch (_err) {
        // Non-blocking analytics sync.
      }
    };

    syncAnalytics();
    const interval = setInterval(syncAnalytics, 3000);
    return () => clearInterval(interval);
  }, [calibrated, trackingActive]);

  // ── Initial session list ──────────────────────────────────────────────
  useEffect(() => { refreshSessions(); }, [refreshSessions]);

  useEffect(() => () => { clearBatchTimer(); }, [clearBatchTimer]);

  const latestSessions = useMemo(() => sessions.slice(0, 5), [sessions]);

  return (
    <section className="emp-tracker-section">
      <SessionControls
        status={status}
        trackingActive={trackingActive}
        calibrated={calibrated}
        sessionId={sessionId}
        pointCount={pointCount}
        privacyMode={privacyMode}
        scanningEnabled={scanningEnabled}
        blinkCount={blinkCount}
        onStart={startTrackingSession}
        onStop={stopTracking}
        onRefreshSessions={refreshSessions}
        onRecalibrate={handleRecalibrate}
        onStartWebcam={handleStartWebcam}
        onTogglePrivacyMode={handleTogglePrivacyMode}
        onToggleScanning={handleToggleScanning}
      />

      {error ? <p className="tracker-error">{error}</p> : null}

      <div className="tracker-saved">Saved points: <strong>{savedPoints}</strong></div>
      <div className="tracker-saved">
        Attention score: <strong>{attentionScore}%</strong>
        {blinkCount > 0 && <span style={{ marginLeft: 12, color: 'var(--chart-teal)' }}>👁 Blinks: {blinkCount}</span>}
      </div>

      {/* AOI Stats Panel */}
      {aoiStats && (
        <AoiStatsPanel aoiStats={aoiStats} />
      )}

      <div className="session-list-card">
        <h4>Recent Sessions</h4>
        <ul>
          {latestSessions.length ? (
            latestSessions.map((s) => (
              <li key={s.id}>
                <span>{s.id.slice(0, 8)}...</span>
                <span>{s.pointCount} pts</span>
                {s.fixationCount > 0 && <span>{s.fixationCount} fix</span>}
              </li>
            ))
          ) : (
            <li>No sessions yet</li>
          )}
        </ul>
      </div>

      {showCalibration ? (
        <CalibrationOverlay onComplete={handleCalibrationComplete} />
      ) : null}

      {trackingActive && calibrated ? (
        <>
          <SaccadePathCanvas getPoints={renderBuffer.getAll} active={trackingActive && calibrated} />
          <HeatmapCanvas getPoints={renderBuffer.getFixations} active={trackingActive && calibrated} scaleToViewport />
          <DwellIndicator
            target={dwellDisplayTarget}
            dwellSince={dwellDisplaySince}
            dwellMs={DWELL_MS}
            active={trackingActive && calibrated}
          />
        </>
      ) : null}
    </section>
  );
}
