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

export default function CalibrationOverlay({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= POINTS.length) {
      const timer = setTimeout(() => onComplete?.(), 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      // Find the screen position
      const point = POINTS[currentIndex];
      const el = document.getElementById(`cal-dot-${point.id}`);
      if (el && window.webgazer?.recordScreenPosition) {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Record multiple times to simulate clicks
        for (let i = 0; i < 5; i++) {
          window.webgazer.recordScreenPosition(x, y, 'click');
        }
      }
      setCurrentIndex((prev) => prev + 1);
    }, 1500); // 1.5s per dot

    return () => clearTimeout(timer);
  }, [currentIndex, onComplete]);

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
            style={{ 
              left: p.x, 
              top: p.y,
              transform: isCurrent ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)',
              background: isCurrent ? '#f59e0b' : (isDone ? '#10b981' : '#b46445'),
              opacity: (isCurrent || isDone) ? 1 : 0.5,
              transition: 'all 0.3s ease'
            }}
          >
            {isCurrent && <span style={{fontSize: '12px', marginTop: '40px', display: 'block', width: '100px', textAlign: 'center', marginLeft: '-35px'}}>Focus Here</span>}
          </div>
        );
      })}

      <div className="calibration-message">
        <p>Follow the orange dot. Keep your head still.</p>
        <p>{currentIndex >= POINTS.length ? 'Calibration complete.' : `Calibrating point ${currentIndex + 1} of 9...`}</p>
      </div>
    </div>
  );
}
