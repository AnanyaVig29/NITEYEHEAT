import { useEffect, useRef, useState } from 'react';

/**
 * DwellIndicator
 *
 * Renders a growing circular progress ring at the position of the element
 * currently being dwelled upon. The ring fills over `dwellMs` milliseconds
 * and pulses before triggering.
 *
 * @param {HTMLElement|null} target     - The element being dwelt on
 * @param {number}           dwellSince - Timestamp when dwell started (ms)
 * @param {number}           dwellMs    - Total dwell duration in ms (default 1200)
 * @param {boolean}          active     - Whether gaze tracking is active
 */
export default function DwellIndicator({ target, dwellSince, dwellMs = 1200, active }) {
  const rafRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active || !target || !dwellSince) {
      setPos(null);
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const elapsed = Date.now() - dwellSince;
      const pct = Math.min(1, elapsed / dwellMs);

      setPos({ x: cx, y: cy });
      setProgress(pct);

      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, dwellMs, dwellSince, target]);

  if (!pos || !active) return null;

  const SIZE = 56;
  const R = 22;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - progress);
  const opacity = 0.5 + progress * 0.5;
  const scale = 1 + progress * 0.15;
  const hue = 120 * progress; // green to red-ish as progress increases

  return (
    <div
      className="dwell-indicator"
      style={{
        position: 'fixed',
        left: pos.x - SIZE / 2,
        top: pos.y - SIZE / 2,
        width: SIZE,
        height: SIZE,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `scale(${scale})`,
        transition: 'transform 0.05s linear',
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={`hsla(${hue}, 85%, 60%, ${opacity})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.1s ease' }}
        />
        {/* Center dot */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={4}
          fill={`hsla(${hue}, 85%, 65%, ${opacity})`}
        />
      </svg>
    </div>
  );
}
