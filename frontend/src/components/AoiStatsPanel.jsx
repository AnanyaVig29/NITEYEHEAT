import { useMemo } from 'react';

const ZONE_COLORS = {
  topLeft:     { active: '#5A8DEE', label: 'Top Left' },
  topRight:    { active: '#34C759', label: 'Top Right' },
  bottomLeft:  { active: '#FF9500', label: 'Bottom Left' },
  bottomRight: { active: '#FF3B30', label: 'Bottom Right' },
};

/**
 * AoiStatsPanel
 *
 * Visualises Areas of Interest from the quadrant-based AOI stats computed
 * by the backend (deriveAoiStats). Shows:
 *   - A 2×2 heatmap grid with attention intensity per quadrant
 *   - Fill bars for each quadrant's share of total gaze
 *   - Missed zones highlighted in red
 *   - Attention score gauge
 *   - Time to first fixation
 *
 * @param {object} aoiStats - { quadrants, attentionScore, missedZones, timeToFirstFixationMs }
 */
export default function AoiStatsPanel({ aoiStats }) {
  if (!aoiStats) return null;

  const { quadrants = {}, attentionScore = 0, missedZones = [], timeToFirstFixationMs } = aoiStats;

  const totalHits = useMemo(
    () => Math.max(1, Object.values(quadrants).reduce((s, v) => s + v, 0)),
    [quadrants]
  );

  const scoreColor = attentionScore >= 75 ? '#34C759' : attentionScore >= 45 ? '#FF9500' : '#FF3B30';

  return (
    <div className="aoi-panel">
      <div className="aoi-panel__header">
        <span className="aoi-panel__title">AOI Analysis</span>
        <div className="aoi-panel__score" style={{ '--score-color': scoreColor }}>
          <svg viewBox="0 0 36 36" className="aoi-gauge">
            <circle className="aoi-gauge__track" cx="18" cy="18" r="15.9" />
            <circle
              className="aoi-gauge__fill"
              cx="18" cy="18" r="15.9"
              style={{
                strokeDasharray: `${attentionScore} ${100 - attentionScore}`,
                stroke: scoreColor,
              }}
            />
          </svg>
          <span className="aoi-gauge__label">{attentionScore}%</span>
          <span className="aoi-gauge__sub">Focus</span>
        </div>
      </div>

      {/* 2×2 heatmap grid */}
      <div className="aoi-grid">
        {Object.entries(ZONE_COLORS).map(([key, meta]) => {
          const count = quadrants[key] || 0;
          const pct = Math.round((count / totalHits) * 100);
          const isMissed = missedZones.includes(key);
          const opacity = isMissed ? 0.12 : Math.max(0.15, pct / 100);
          return (
            <div
              key={key}
              className={`aoi-cell ${isMissed ? 'aoi-cell--missed' : ''}`}
              title={`${meta.label}: ${pct}%`}
              style={{ '--cell-bg': meta.active, '--cell-opacity': opacity }}
            >
              <span className="aoi-cell__label">{meta.label}</span>
              <span className="aoi-cell__pct">{pct}%</span>
              {isMissed && <span className="aoi-cell__alert">⚠ Blind zone</span>}
            </div>
          );
        })}
      </div>

      {/* Bar breakdown */}
      <div className="aoi-bars">
        {Object.entries(ZONE_COLORS).map(([key, meta]) => {
          const count = quadrants[key] || 0;
          const pct = Math.round((count / totalHits) * 100);
          const isMissed = missedZones.includes(key);
          return (
            <div key={key} className="aoi-bar-row">
              <span className="aoi-bar-row__name" style={{ color: isMissed ? '#FF3B30' : 'var(--text-primary)' }}>
                {meta.label}
              </span>
              <div className="aoi-bar-row__track">
                <div
                  className="aoi-bar-row__fill"
                  style={{ width: `${pct}%`, background: isMissed ? '#FF3B30' : meta.active }}
                />
              </div>
              <span className="aoi-bar-row__pct">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Meta stats */}
      <div className="aoi-meta">
        {timeToFirstFixationMs != null && (
          <div className="aoi-meta__item">
            <span className="aoi-meta__key">Time to first fixation</span>
            <span className="aoi-meta__val">{timeToFirstFixationMs}ms</span>
          </div>
        )}
        {missedZones.length > 0 && (
          <div className="aoi-meta__item aoi-meta__item--warn">
            <span className="aoi-meta__key">⚠ Missed zones</span>
            <span className="aoi-meta__val">{missedZones.map(z => ZONE_COLORS[z]?.label || z).join(', ')}</span>
          </div>
        )}
        {missedZones.length === 0 && (
          <div className="aoi-meta__item aoi-meta__item--ok">
            <span className="aoi-meta__key">✓ Full coverage</span>
            <span className="aoi-meta__val">All zones reached</span>
          </div>
        )}
      </div>
    </div>
  );
}
