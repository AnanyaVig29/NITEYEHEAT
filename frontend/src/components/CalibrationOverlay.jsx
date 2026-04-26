import { useEffect, useState } from 'react';

const POINTS = [
  { id: 0, x: '10%', y: '10%' },
  { id: 1, x: '50%', y: '10%' },
  { id: 2, x: '90%', y: '10%' },
  { id: 3, x: '10%', y: '50%' },
  { id: 4, x: '50%', y: '50%' },
  { id: 5, x: '90%', y: '50%' },
  { id: 6, x: '10%', y: '90%' },
  { id: 7, x: '50%', y: '90%' },
  { id: 8, x: '90%', y: '90%' },
];

export default function CalibrationOverlay({ onComplete, onQuickRecalibrate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clicksOnCurrent, setClicksOnCurrent] = useState(0);
  const REQUIRED_CLICKS = 5;

  useEffect(() => {
    if (currentIndex >= POINTS.length) {
      const timer = setTimeout(() => onComplete?.(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

  const handleDotClick = () => {
    if (currentIndex >= POINTS.length) return;
    const point = POINTS[currentIndex];
    const el = document.getElementById(`cal-dot-${point.id}`);
    if (!el || !window.webgazer?.recordScreenPosition) return;

    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    window.webgazer.recordScreenPosition(x, y, 'click');

    setClicksOnCurrent((prev) => {
      const next = prev + 1;
      if (next >= REQUIRED_CLICKS) {
        setCurrentIndex((idx) => idx + 1);
        return 0;
      }
      return next;
    });
  };

  const handleQuickDot = () => {
    if (!window.webgazer?.recordScreenPosition) return;
    const x = Math.round(window.innerWidth / 2);
    const y = Math.round(window.innerHeight / 2);
    window.webgazer.recordScreenPosition(x, y, 'click');
    onQuickRecalibrate?.();
  };

  return (
    <div className="calibration-overlay">
      {POINTS.map((p, i) => {
        const isCurrent = i === currentIndex;
        const isDone = i < currentIndex;

        return (
          <div
            key={p.id}
            id={`cal-dot-${p.id}`}
            className={`calibration-dot ${isDone ? 'done' : ''}`}
            onClick={isCurrent ? handleDotClick : undefined}
            style={{ 
              left: p.x, 
              top: p.y,
              transform: isCurrent ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)',
              background: isCurrent ? '#f59e0b' : (isDone ? '#10b981' : '#b46445'),
              opacity: (isCurrent || isDone) ? 1 : 0.5,
              transition: 'all 0.3s ease',
              cursor: isCurrent ? 'pointer' : 'default'
            }}
          >
            {isCurrent && (
              <span style={{fontSize: '12px', marginTop: '40px', display: 'block', width: '120px', textAlign: 'center', marginLeft: '-45px'}}>
                Click Here ({clicksOnCurrent}/{REQUIRED_CLICKS})
              </span>
            )}
          </div>
        );
      })}

      <div className="calibration-message">
        <p>Look at the orange dot and click it 5 times. Keep your head still.</p>
        <p>{currentIndex >= POINTS.length ? 'Calibration complete.' : `Calibrating point ${currentIndex + 1} of 9...`}</p>
        <button type="button" onClick={handleQuickDot} style={{ marginTop: '12px' }}>
          Quick recalibrate center
        </button>
      </div>
    </div>
  );
}
