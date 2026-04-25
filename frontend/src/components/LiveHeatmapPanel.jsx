import { useEffect, useRef, useMemo } from 'react';

function normalizePoints(points, width, height) {
  if (!points.length) return [];
  const sourceW = Math.max(1, window.innerWidth || width);
  const sourceH = Math.max(1, window.innerHeight || height);

  return points.map((p) => ({
    x: Math.round((Math.min(Math.max(p.x, 0), sourceW - 1) / sourceW) * Math.max(1, width - 1)),
    y: Math.round((Math.min(Math.max(p.y, 0), sourceH - 1) / sourceH) * Math.max(1, height - 1)),
    ts: p.ts,
  }));
}

const createPalette = (colors) => {
  if (typeof document === 'undefined') return new Uint8ClampedArray(1024);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 1;

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  colors.forEach(({ pos, color }) => gradient.addColorStop(pos, color));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  return ctx.getImageData(0, 0, 256, 1).data;
};

const PALETTE_DEFINITIONS = {
  gaze: [
    { pos: 0.1, color: 'rgba(37, 99, 235, 0.2)' },
    { pos: 0.4, color: 'rgba(22, 163, 74, 0.4)' },
    { pos: 0.7, color: 'rgba(245, 158, 11, 0.7)' },
    { pos: 1.0, color: 'rgba(220, 38, 38, 0.9)' }
  ],
  click: [
    { pos: 0.2, color: 'rgba(180, 100, 69, 0.2)' },
    { pos: 1.0, color: 'rgba(180, 100, 69, 0.9)' }
  ],
  rage: [
    { pos: 0.1, color: '#ef4444' },
    { pos: 1.0, color: '#000000' }
  ]
};

export default function LiveHeatmapPanel({ points = [], height = 400, type = 'gaze' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const memoizedPalette = useMemo(() => {
    const def = PALETTE_DEFINITIONS[type] || PALETTE_DEFINITIONS.gaze;
    return createPalette(def);
  }, [type]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { clientWidth, clientHeight } = containerRef.current;
    const safeWidth = Math.max(320, clientWidth || 0);
    const safeHeight = Math.max(240, clientHeight || 0);

    canvas.width = safeWidth;
    canvas.height = safeHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!points.length) return;

    const dataPoints = normalizePoints(points, safeWidth, safeHeight);

    if (type === 'scroll') {
      // Scroll heatmap: horizontal gradient bands
      const gradient = ctx.createLinearGradient(0, 0, 0, safeHeight);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, safeWidth, safeHeight);
      return;
    }

    if (type === 'move') {
      // Move heatmap: connected lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 2;
      dataPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      
      dataPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      });
      return;
    }

    // 1. Draw points using shadow blur to create the alpha map
    const radius = type === 'click' || type === 'rage' ? 15 : 35;
    const alphaBase = type === 'rage' ? 0.2 : 0.08;
    
    dataPoints.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(0, 0, 0, ${alphaBase})`;
      ctx.fill();
    });

    // 2. Colorize the alpha map
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 0) {
        const intensity = Math.min(255, alpha * 3.5);
        const offset = Math.floor(intensity) * 4;

        data[i] = memoizedPalette[offset];
        data[i + 1] = memoizedPalette[offset + 1];
        data[i + 2] = memoizedPalette[offset + 2];
        data[i + 3] = Math.min(255, alpha * 1.8);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [points, height, type, memoizedPalette]);

  return (
    <div
      ref={containerRef}
      className="heatmap-panel-container"
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.9
        }}
      />
      {!points.length ? (
        <div className="heatmap-empty-state">
          No {type} data available for this segment.
        </div>
      ) : null}
      
      <div className="heatmap-type-indicator">
        {type.toUpperCase()} MODE
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .heatmap-empty-state {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: rgba(148, 163, 184, 0.5);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .heatmap-type-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
        }
      `}} />
    </div>
  );
}
