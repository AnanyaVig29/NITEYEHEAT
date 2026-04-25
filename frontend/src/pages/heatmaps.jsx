import React, { useMemo, useState } from "react";
import { 
  Info, 
  MousePointer, 
  Eye, 
  ScrollText, 
  Move, 
  Layout, 
  Users, 
  Zap, 
  Copy, 
  AlertCircle 
} from "lucide-react";
import "../styles/heatmaps.css";
import LiveHeatmapPanel from "../components/LiveHeatmapPanel";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatNumber, formatPercent } from "../utils/liveFormat";

const HEATMAP_TYPES = [
  { id: 'gaze', label: 'Attention', icon: <Eye size={18} />, desc: 'Shows where users look the most based on eye-tracking data.' },
  { id: 'click', label: 'Click', icon: <MousePointer size={18} />, desc: 'Tracks where users click/tap on the page.' },
  { id: 'scroll', label: 'Scroll', icon: <ScrollText size={18} />, desc: 'Shows how far users scroll down the page.' },
  { id: 'move', label: 'Move', icon: <Move size={18} />, desc: 'Tracks mouse movement as a proxy for eye movement.' },
  { id: 'aoi', label: 'AOI', icon: <Layout size={18} />, desc: 'Focuses on specific sections like buttons or images.' },
];

const Heatmaps = () => {
  const [activeType, setActiveType] = useState('gaze');
  const { data, loading, error, refresh } = useLiveAnalytics();

  const resolvedType = useMemo(() => {
    if (['aoi'].includes(activeType)) return 'gaze';
    return activeType;
  }, [activeType]);

  const points = (data?.heatmap?.segmented?.[resolvedType] || data?.heatmap?.points || []).slice(-1200);
  const totals = data?.totals || {};
  const currentType = HEATMAP_TYPES.find(t => t.id === activeType) || HEATMAP_TYPES[0];

  if (loading && !data) {
    return <div className="loading-state">Initializing Heatmap Engine...</div>;
  }

  if (error && !data) {
    return (
      <div className="loading-state">
        Failed to load heatmap data: {error}
        <div style={{ marginTop: 12 }}>
          <button className="control-item" onClick={refresh}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="heatmaps-container">
      <header className="heatmaps-header">
        <div className="title-group">
          <h1>Heatmap Analytics</h1>
          <p>Advanced behavior visualization suite.</p>
        </div>
        <div className="heatmap-selector">
          {HEATMAP_TYPES.map((type) => (
            <button
              key={type.id}
              className={`selector-btn ${activeType === type.id ? 'active' : ''}`}
              onClick={() => setActiveType(type.id)}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="heatmap-main-layout">
        <div className="heatmap-viewer-card">
          <LiveHeatmapPanel points={points} height={540} type={resolvedType} />
          
          {activeType === 'aoi' && (
            <div className="aoi-overlay">
              <div className="aoi-box" style={{ top: '10%', left: '10%', width: '20%', height: '10%' }}><span>Nav</span></div>
              <div className="aoi-box" style={{ top: '30%', left: '20%', width: '60%', height: '30%' }}><span>Hero CTA</span></div>
              <div className="aoi-box" style={{ top: '70%', left: '15%', width: '30%', height: '20%' }}><span>Features</span></div>
            </div>
          )}

          {activeType === 'scroll' && (
            <div className="scroll-heatmap-gradient">
              <div className="scroll-line" data-label="75% Reach"></div>
              <div className="scroll-line" data-label="50% Reach"></div>
              <div className="scroll-line" data-label="25% Reach"></div>
            </div>
          )}
        </div>

        <aside className="heatmap-sidebar">
          <div className="info-card">
            <h3 className="info-title"><Info size={18} /> {currentType.label} Insights</h3>
            <p className="info-desc">{currentType.desc}</p>
            
            <div className="stats-mini-grid">
              <div className="stat-box">
                <span className="stat-caption">Sessions</span>
                <div className="stat-value">{formatNumber(data?.heatmap?.sessionCount || 0)}</div>
              </div>
              <div className="stat-box">
                <span className="stat-caption">Data Points</span>
                <div className="stat-value">{formatNumber(points.length)}</div>
              </div>
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="color-box" style={{ background: 'var(--heat-hot)' }}></div>
                <span>Highest Attention</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: 'var(--heat-warm)' }}></div>
                <span>Medium Engagement</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: 'var(--heat-cool)' }}></div>
                <span>Low Interest</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: 'var(--heat-cold)' }}></div>
                <span>Minimal Activity</span>
              </div>
            </div>
          </div>


        </aside>
      </div>
    </div>
  );
};

export default Heatmaps;
