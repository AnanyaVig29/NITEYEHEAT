import { useCallback, useEffect, useRef } from 'react';

/**
 * useBlinkDetector
 *
 * Detects blinks by monitoring the eye aspect ratio (EAR) from WebGazer's
 * face mesh. A blink is detected when the EAR drops below a threshold for
 * at least 2 consecutive frames, then rises again.
 *
 * @param {object} options
 * @param {function} options.onBlink - Called each time a blink is confirmed
 * @param {boolean} options.enabled  - Whether detection is active
 * @param {number}  options.earThreshold - EAR threshold (default 0.22)
 */
export function useBlinkDetector({ onBlink, enabled = false, earThreshold = 0.22 }) {
  const onBlinkRef = useRef(onBlink);
  const belowThresholdCountRef = useRef(0);
  const blinkInProgressRef = useRef(false);
  const frameCallbackRef = useRef(null);

  useEffect(() => {
    onBlinkRef.current = onBlink;
  }, [onBlink]);

  /**
   * Calculate Eye Aspect Ratio from 6 landmark points.
   * EAR = (|p2-p6| + |p3-p5|) / (2 * |p1-p4|)
   * Points: p1=corner, p2,p3=upper lid, p4=opposite corner, p5,p6=lower lid
   */
  const calcEAR = useCallback((eye) => {
    if (!eye || eye.length < 6) return 1;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const vertical1 = dist(eye[1], eye[5]);
    const vertical2 = dist(eye[2], eye[4]);
    const horizontal = dist(eye[0], eye[3]);
    return (vertical1 + vertical2) / (2.0 * Math.max(horizontal, 1));
  }, []);

  const checkFrame = useCallback(() => {
    if (!enabled) return;

    try {
      // WebGazer exposes the current face mesh via getCurrentPrediction
      const wg = window.webgazer;
      if (!wg || typeof wg.getCurrentPrediction !== 'function') return;

      const pred = wg.getCurrentPrediction();
      if (!pred) return;

      // TFFacemesh provides landmarks — extract eye points
      // Left eye: landmarks 33, 160, 158, 133, 153, 144
      // Right eye: landmarks 263, 387, 385, 362, 380, 373
      const lm = pred.positions || pred.landmarks;
      if (!lm || lm.length < 400) return;

      const leftEye = [
        [lm[33][0], lm[33][1]],
        [lm[160][0], lm[160][1]],
        [lm[158][0], lm[158][1]],
        [lm[133][0], lm[133][1]],
        [lm[153][0], lm[153][1]],
        [lm[144][0], lm[144][1]],
      ];

      const rightEye = [
        [lm[263][0], lm[263][1]],
        [lm[387][0], lm[387][1]],
        [lm[385][0], lm[385][1]],
        [lm[362][0], lm[362][1]],
        [lm[380][0], lm[380][1]],
        [lm[373][0], lm[373][1]],
      ];

      const ear = (calcEAR(leftEye) + calcEAR(rightEye)) / 2;

      if (ear < earThreshold) {
        belowThresholdCountRef.current += 1;
        blinkInProgressRef.current = true;
      } else if (blinkInProgressRef.current && belowThresholdCountRef.current >= 2) {
        // Eyes have re-opened after being closed for >=2 frames — confirmed blink
        onBlinkRef.current?.();
        belowThresholdCountRef.current = 0;
        blinkInProgressRef.current = false;
      } else {
        belowThresholdCountRef.current = 0;
        blinkInProgressRef.current = false;
      }
    } catch (_err) {
      // Non-blocking — face mesh may not be ready yet
    }
  }, [calcEAR, earThreshold, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (frameCallbackRef.current) {
        clearInterval(frameCallbackRef.current);
        frameCallbackRef.current = null;
      }
      return;
    }

    // Poll at ~30fps (every 33ms) — matches typical WebGazer prediction rate
    frameCallbackRef.current = setInterval(checkFrame, 33);

    return () => {
      if (frameCallbackRef.current) {
        clearInterval(frameCallbackRef.current);
        frameCallbackRef.current = null;
      }
    };
  }, [checkFrame, enabled]);

  return null;
}
