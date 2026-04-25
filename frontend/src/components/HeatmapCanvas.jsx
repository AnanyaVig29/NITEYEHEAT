import { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

export default function HeatmapCanvas({ getPoints, active }) {
  const containerRef = useRef(null);
  const heatmapRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    heatmapRef.current = h337.create({
      container: containerRef.current,
      radius: 45,
      maxOpacity: 0.65,
      minOpacity: 0.05,
      blur: 0.85,
      gradient: {
        0.2: '#2563eb',
        0.4: '#16a34a',
        0.7: '#f59e0b',
        1.0: '#dc2626',
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

    const draw = () => {
      const points = getPoints().map((p) => ({
        x: Math.round(p.x),
        y: Math.round(p.y),
        value: 1,
      }));

      if (points.length > 0) {
        heatmapRef.current.setData({
          max: 6,
          data: points,
        });
      }
    };

    rafRef.current = setInterval(draw, 500); // Draw every 500ms

    return () => {
      clearInterval(rafRef.current);
    };
  }, [active, getPoints]);

  return <div ref={containerRef} className="heatmap-layer" />;
}
