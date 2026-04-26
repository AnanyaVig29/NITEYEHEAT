import { useEffect, useMemo, useRef, useState } from 'react';
import h337 from 'heatmap.js';

export default function HeatmapCanvas({ getPoints, active, scaleToViewport = false }) {
  const containerRef = useRef(null);
  const heatmapRef = useRef(null);
  const rafRef = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    heatmapRef.current = h337.create({
      container: containerRef.current,
      radius: 45,
      maxOpacity: 0.65,
      minOpacity: 0.05,
      blur: 0.85,
      gradient: {
        0.2: '#007AFF', // Cold (Blue)
        0.4: '#34C759', // Cool (Green)
        0.6: '#FFD60A', // Medium (Yellow)
        0.8: '#FF9500', // Warm (Orange)
        1.0: '#FF3B30', // Hot (Red)
      },
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active || !heatmapRef.current) {
      if (rafRef.current) clearInterval(rafRef.current);
      return;
    }

    const draw = () => setTick((value) => value + 1);

    const intervalMs = window.innerWidth <= 900 ? 700 : 450;
    rafRef.current = setInterval(draw, intervalMs);

    return () => {
      clearInterval(rafRef.current);
    };
  }, [active]);

  const heatmapData = useMemo(() => {
    const points = getPoints().map((p) => {
      const x = scaleToViewport ? Math.min(Math.max(p.x, 0), window.innerWidth - 1) : p.x;
      const y = scaleToViewport ? Math.min(Math.max(p.y, 0), window.innerHeight - 1) : p.y;
      return {
        x: Math.round(x),
        y: Math.round(y),
        value: 1,
      };
    });

    return points;
  }, [getPoints, scaleToViewport, tick]);

  useEffect(() => {
    if (!active || !heatmapRef.current || !heatmapData.length) return;
    heatmapRef.current.setData({
      max: 6,
      data: heatmapData,
    });
  }, [active, heatmapData]);

  return <div ref={containerRef} className="heatmap-layer" />;
}
