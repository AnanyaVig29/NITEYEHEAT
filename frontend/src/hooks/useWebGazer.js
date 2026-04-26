import { useCallback, useEffect, useRef } from 'react';
import webgazer from 'webgazer';

const MIN_EMIT_INTERVAL_MS = 75;
const MAX_VELOCITY_PX_PER_SEC = 2800;
const SMOOTHING_ALPHA = 0.38;
const MIN_MOVEMENT_PX = 1.5;

export function useWebGazer({ onGaze, enabled, onError, privacyMode = true }) {
  const listenerRef = useRef(onGaze);
  const startedRef = useRef(false);
  const smoothPointRef = useRef(null);
  const lastRawPointRef = useRef(null);
  const lastEmittedPointRef = useRef(null);
  const lastEmitAtRef = useRef(0);

  useEffect(() => {
    listenerRef.current = onGaze;
  }, [onGaze]);

  const startTracking = useCallback(async () => {
    if (startedRef.current) return;

    if (!webgazer) {
      const error = new Error('WebGazer missing.');
      onError?.(error);
      throw error;
    }

    try {
      smoothPointRef.current = null;
      lastRawPointRef.current = null;
      lastEmittedPointRef.current = null;
      lastEmitAtRef.current = 0;

      await webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener((data) => {
          if (!data) return;
          const now = Date.now();
          if (now - lastEmitAtRef.current < MIN_EMIT_INTERVAL_MS) return;

          if (!Number.isFinite(data.x) || !Number.isFinite(data.y)) return;

          const maxX = Math.max(1, window.innerWidth - 1);
          const maxY = Math.max(1, window.innerHeight - 1);
          const rawX = Math.min(Math.max(data.x, 0), maxX);
          const rawY = Math.min(Math.max(data.y, 0), maxY);

          const prevRaw = lastRawPointRef.current;
          if (prevRaw) {
            const dt = Math.max(1, now - prevRaw.ts);
            const dist = Math.hypot(rawX - prevRaw.x, rawY - prevRaw.y);
            const velocity = (dist / dt) * 1000;
            if (velocity > MAX_VELOCITY_PX_PER_SEC) {
              return;
            }
          }
          lastRawPointRef.current = { x: rawX, y: rawY, ts: now };

          if (!smoothPointRef.current) {
            smoothPointRef.current = { x: rawX, y: rawY };
          } else {
            const sx = smoothPointRef.current.x + (rawX - smoothPointRef.current.x) * SMOOTHING_ALPHA;
            const sy = smoothPointRef.current.y + (rawY - smoothPointRef.current.y) * SMOOTHING_ALPHA;
            smoothPointRef.current = { x: sx, y: sy };
          }

          const smoothed = smoothPointRef.current;
          const prevEmitted = lastEmittedPointRef.current;
          const shouldEmit =
            !prevEmitted ||
            Math.hypot(smoothed.x - prevEmitted.x, smoothed.y - prevEmitted.y) >= MIN_MOVEMENT_PX;

          if (!shouldEmit) return;

          lastEmitAtRef.current = now;
          lastEmittedPointRef.current = { x: smoothed.x, y: smoothed.y };
          listenerRef.current?.({
            x: smoothed.x,
            y: smoothed.y,
            ts: now,
          });
        })
        .begin();

      if (typeof webgazer.applyKalmanFilter === 'function') {
        webgazer.applyKalmanFilter(true);
      }
      webgazer.showPredictionPoints(true);
      webgazer.showVideoPreview(!privacyMode);
      webgazer.showFaceOverlay(false);
      startedRef.current = true;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [onError, privacyMode]);

  const stopTracking = useCallback(() => {
    if (!webgazer) return;

    try {
      webgazer.clearGazeListener();
      webgazer.end();
    } catch (_err) {
      // No-op if webgazer internals already stopped.
    }

    startedRef.current = false;
    smoothPointRef.current = null;
    lastRawPointRef.current = null;
    lastEmittedPointRef.current = null;
    lastEmitAtRef.current = 0;
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopTracking();
      return;
    }

    startTracking();

    return () => {
      stopTracking();
    };
  }, [enabled, startTracking, stopTracking]);

  return { startTracking, stopTracking };
}
