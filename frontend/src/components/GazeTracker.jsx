import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CalibrationOverlay from './CalibrationOverlay';
import HeatmapCanvas from './HeatmapCanvas';
import SessionControls from './SessionControls';
import { useWebGazer } from '../hooks/useWebGazer';
import { useGazeBuffer } from '../hooks/useGazeBuffer';
import {
  endSession,
  getSessions,
  startBatchInterval,
  startSession,
  postBatch,
} from '../utils/gazeApi';

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

  const renderBuffer = useGazeBuffer(2000);
  const uploadQueueRef = useRef([]);
  const batchTimerRef = useRef(null);

  const handleGaze = useCallback(
    (point) => {
      renderBuffer.push(point);
      uploadQueueRef.current.push(point);
    },
    [renderBuffer]
  );

  useWebGazer({
    onGaze: handleGaze,
    enabled: trackingActive,
    onError: (err) => {
      setError(err?.message || 'WebGazer failed to initialize');
      setTrackingActive(false);
      setStatus('error');
    },
  });
  // Track point count in state to trigger re-renders periodically
  useEffect(() => {
    let interval;
    if (trackingActive) {
      interval = setInterval(() => {
        setPointCount(renderBuffer.getSize());
      }, 500);
    }
    return () => clearInterval(interval);
  }, [trackingActive, renderBuffer]);

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

    clearBatchTimer();

    if (sessionId) {
      try {
        const pending = uploadQueueRef.current;
        if (pending.length) {
          // Flush the remaining points directly instead of relying on the cleared interval
          await postBatch(sessionId, pending);
          setSavedPoints((prev) => prev + pending.length);
        }
        await endSession(sessionId);
      } catch (_err) {
        // Ignore stop errors to keep UI responsive.
      }
    }

    setSessionId('');
    renderBuffer.clear();
    uploadQueueRef.current = [];
    refreshSessions();
  }, [clearBatchTimer, refreshSessions, renderBuffer, sessionId]);

  const startTrackingSession = useCallback(async () => {
    try {
      setError('');
      setStatus('initializing');
      renderBuffer.clear();
      uploadQueueRef.current = [];
      setSavedPoints(0);
      setCalibrated(false);
      setShowCalibration(true);
      setTrackingActive(true);
    } catch (err) {
      setError(err?.message || 'Failed to start tracking');
      setStatus('error');
      setTrackingActive(false);
    }
  }, [renderBuffer]);

  const handleCalibrationComplete = useCallback(async () => {
    try {
      const started = await startSession(window.location.href);
      setSessionId(started.sessionId);
      setCalibrated(true);
      setShowCalibration(false);
      setStatus('tracking');
    } catch (err) {
      setError(err?.message || 'Failed to create backend session');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !trackingActive || !calibrated) {
      clearBatchTimer();
      return;
    }

    const getQueuePoints = () => [...uploadQueueRef.current];
    const clearQueue = () => {
      uploadQueueRef.current = [];
    };

    batchTimerRef.current = startBatchInterval(
      sessionId,
      getQueuePoints,
      clearQueue,
      (saved) => {
        setSavedPoints((prev) => prev + saved);
      }
    );

    return () => {
      clearBatchTimer();
    };
  }, [calibrated, clearBatchTimer, sessionId, trackingActive]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    return () => {
      clearBatchTimer();
    };
  }, [clearBatchTimer]);

  const latestSessions = useMemo(() => sessions.slice(0, 5), [sessions]);

  return (
    <section className="emp-tracker-section">
      <SessionControls
        status={status}
        trackingActive={trackingActive}
        calibrated={calibrated}
        sessionId={sessionId}
        pointCount={pointCount}
        onStart={startTrackingSession}
        onStop={stopTracking}
        onRefreshSessions={refreshSessions}
      />

      {error ? <p className="tracker-error">{error}</p> : null}

      <div className="tracker-saved">Saved points to backend: <strong>{savedPoints}</strong></div>

      <div className="session-list-card">
        <h4>Recent Sessions</h4>
        <ul>
          {latestSessions.length ? (
            latestSessions.map((s) => (
              <li key={s.id}>
                <span>{s.id.slice(0, 8)}...</span>
                <span>{s.pointCount} pts</span>
              </li>
            ))
          ) : (
            <li>No sessions yet</li>
          )}
        </ul>
      </div>

      {showCalibration ? <CalibrationOverlay onComplete={handleCalibrationComplete} /> : null}
      <HeatmapCanvas getPoints={renderBuffer.getAll} active={trackingActive && calibrated} />
    </section>
  );
}
