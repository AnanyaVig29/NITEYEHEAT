import React, { useMemo } from "react";
import "../styles/EyeMovementPatterns.css";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatPercent } from "../utils/liveFormat";
import { 
  Scan, 
  Layers, 
  Target, 
  MousePointer2,
  Info
} from "lucide-react";

const PatternCard = ({ id, title, desc, usage, icon: Icon }) => (
    <div className="pattern-card">
        <div className="pattern-header">
            <div className="pattern-icon">
                <Icon size={20} />
            </div>
            <div className="pattern-usage">{formatPercent(usage)}</div>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="pattern-visualizer">
            <div className={`pattern-bg ${id}`}>
                <div className="pattern-path"></div>
            </div>
        </div>
    </div>
);

export default function EyeTracking() {
    const { data, loading, error } = useLiveAnalytics();
    const patterns = data?.patterns || { f: 0, z: 0, layerCake: 0, spotted: 0 };
    const totals = data?.totals || {};
    const scrollDepth = data?.scrollDepth || [0, 0, 0, 0];

    const scanDepth = Math.round((Number(scrollDepth[2] || 0) + Number(scrollDepth[3] || 0)) / 2);
    const fixationDurationMs = totals.points
        ? Math.round((totals.avgDurationMs || 0) / Math.max(1, totals.points))
        : 0;
    const saccadePerSecond = totals.avgDurationMs
        ? ((totals.avgPointsPerSession || 0) / Math.max(1, (totals.avgDurationMs || 0) / 1000)).toFixed(2)
        : "0.00";

    const patternData = [
        { id: "f", title: "F-Pattern", icon: Scan, desc: "Scanning top horizontal, then lower horizontal, then left vertical.", usage: patterns.f },
        { id: "z", title: "Z-Pattern", icon: MousePointer2, desc: "Scanning from top-left to top-right, then diagonal to bottom-left.", usage: patterns.z },
        { id: "cake", title: "Layer Cake", icon: Layers, desc: "Scanning headings and subheadings while skipping body text.", usage: patterns.layerCake },
        { id: "spot", title: "Spotted", icon: Target, desc: "Skipping most text and looking for specific words or links.", usage: patterns.spotted },
    ];

    if (loading) return <div className="loading-state">Analyzing gaze patterns...</div>;

    if (error) return <div className="loading-state">Failed to load pattern analytics: {error}</div>;

    return (
        <div className="eye-tracking-container">
            <header className="page-header">
                <div className="title-group">
                    <h1>Movement Patterns</h1>
                    <p>Behavioral archetypes based on fixation sequences.</p>
                </div>
            </header>

            <div className="patterns-grid">
                {patternData.map((p) => (
                    <PatternCard key={p.id} {...p} />
                ))}
            </div>

            <div className="insights-section">
                <div className="insight-card main">
                    <h3><Info size={18} /> Optimization Insight</h3>
                    <p>
                        Current data shows a high prevalence of the <strong>{patterns.f > patterns.z ? 'F-Pattern' : 'Z-Pattern'}</strong>. 
                        To optimize conversion, place critical CTA buttons along the {patterns.f > patterns.z ? 'left vertical axis' : 'diagonal scanning path'}.
                    </p>
                </div>
                
                <div className="insight-stats">
                    <div className="stat-item">
                        <span className="label">Scan Depth</span>
                        <span className="value">{formatPercent(scanDepth)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Fixation Duration</span>
                        <span className="value">{fixationDurationMs}ms</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Saccades / Sec</span>
                        <span className="value">{saccadePerSecond}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
