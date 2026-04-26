import { useCallback, useRef } from 'react';

const DEFAULT_MAX_POINTS = 2000;
const FIXATION_RADIUS_PX = 20;
const FIXATION_MIN_LEN = 3;

export function useGazeBuffer(maxPoints = DEFAULT_MAX_POINTS) {
  const bufferRef = useRef([]);

  const push = useCallback(
    (point) => {
      bufferRef.current.push(point);
      if (bufferRef.current.length > maxPoints) {
        bufferRef.current.shift();
      }
    },
    [maxPoints]
  );

  const getAll = useCallback(() => [...bufferRef.current], []);

  const clear = useCallback(() => {
    bufferRef.current = [];
  }, []);

  const getSize = useCallback(() => bufferRef.current.length, []);

  /**
   * Returns cluster-reduced fixation points.
   * Consecutive raw points within FIXATION_RADIUS_PX are merged into a
   * single centroid point, filtering saccade noise for heatmap rendering.
   */
  const getFixations = useCallback(() => {
    const pts = bufferRef.current;
    if (pts.length === 0) return [];

    const fixations = [];
    let clusterStart = 0;

    for (let i = 1; i <= pts.length; i++) {
      const endOfBuffer = i === pts.length;
      const dist = endOfBuffer
        ? Infinity
        : Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);

      if (dist > FIXATION_RADIUS_PX || endOfBuffer) {
        const cluster = pts.slice(clusterStart, i);
        if (cluster.length >= FIXATION_MIN_LEN) {
          const cx = cluster.reduce((s, p) => s + p.x, 0) / cluster.length;
          const cy = cluster.reduce((s, p) => s + p.y, 0) / cluster.length;
          fixations.push({ x: cx, y: cy, ts: cluster[0].ts, duration: cluster.length });
        }
        clusterStart = i;
      }
    }

    return fixations;
  }, []);

  return { push, getAll, clear, getSize, getFixations };
}

