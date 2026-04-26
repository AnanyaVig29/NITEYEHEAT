import { useEffect, useMemo, useState } from 'react';

function buildPath(points) {
  if (!points.length) return '';
  return points.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(' ');
}

export default function SaccadePathCanvas({ getPoints, active }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setTick((value) => value + 1), 350);
    return () => clearInterval(timer);
  }, [active]);

  const points = useMemo(() => {
    const recent = getPoints().slice(-80);
    return recent.map((p, index) => ({ ...p, index }));
  }, [getPoints, tick]);

  const path = useMemo(() => buildPath(points), [points]);

  if (!active || !points.length) return null;

  return (
    <svg className="saccade-path-layer" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} preserveAspectRatio="none">
      <polyline
        points={path}
        fill="none"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p) => (
        <circle key={`${p.ts}-${p.index}`} cx={Math.round(p.x)} cy={Math.round(p.y)} r="3" fill="rgba(255, 214, 10, 0.95)" />
      ))}
    </svg>
  );
}