import React, { useState } from "react";
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
  { id: 'segment', label: 'Segment', icon: <Users size={18} />, desc: 'Compare mobile vs desktop or new vs returning users.' },
  { id: 'realtime', label: 'Real-Time', icon: <Zap size={18} />, desc: 'Shows live user activity as it happens.' },
  { id: 'comparative', label: 'Comparative', icon: <Copy size={18} />, desc: 'A/B testing view to compare two designs.' },
  { id: 'rage', label: 'Rage Click', icon: <AlertCircle size={18} />, desc: 'Highlights repeated rapid clicks in one area.' },
];

const Heatmaps = () => {
  const [activeType, setActiveType] = useState('gaze');
  const { data, loading, error } = useLiveAnalytics();
  
  const sourcePoints = data?.heatmap?.segmented?.[activeType] || data?.heatmap?.points || [];
  const points = sourcePoints.slice(-1200);
  const totals = data?.totals || {};
  const currentType = HEATMAP_TYPES.find(t => t.id === activeType) || HEATMAP_TYPES[0];

  if (loading && !data) {
    return <div className="loading-state">Initializing Heatmap Engine...</div>;
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
          <LiveHeatmapPanel points={points} height="100%" type={activeType} />
          
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
            <h3><Info size={18} style={{ verticalAlign: "middle", marginRight: "8px" }} /> {currentType.label} Insights</h3>
            <p style={{ marginBottom: '1.5rem' }}>{currentType.desc}</p>
            
            <div className="stats-mini-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="stat-box">
                <span style={{ fontSize: '12px', color: '#64748b' }}>Sessions</span>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{formatNumber(data?.heatmap?.sessionCount || 0)}</div>
              </div>
              <div className="stat-box">
                <span style={{ fontSize: '12px', color: '#64748b' }}>Data Points</span>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{formatNumber(points.length)}</div>
              </div>
            </div>

            <div className="legend" style={{ marginTop: '2rem' }}>
              <div className="legend-item">
                <div className="color-box" style={{ background: '#ef4444' }}></div>
                <span>Highest {activeType === 'rage' ? 'Frustration' : 'Attention'}</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: '#f59e0b' }}></div>
                <span>Medium Engagement</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: '#3b82f6' }}></div>
                <span>Low Interest</span>
              </div>
            </div>
          </div>

          <div className="info-card" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <h3 style={{ color: '#3b82f6' }}>Segment Filter</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="control-item" style={{ flex: 1, fontSize: '12px' }}>Desktop</button>
              <button className="control-item" style={{ flex: 1, fontSize: '12px' }}>Mobile</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Heatmaps;
