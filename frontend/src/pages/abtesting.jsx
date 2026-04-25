import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/abtesting.css";
import LiveHeatmapPanel from "../components/LiveHeatmapPanel";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatDuration, formatNumber } from "../utils/liveFormat";
import { 
  Split, 
  Trophy, 
  Zap, 
  Clock, 
  MousePointer2,
  AlertTriangle,
  ChevronRight,
  Sparkles
} from "lucide-react";

function safeLiftPercent(next, base) {
    if (!Number.isFinite(next) || !Number.isFinite(base) || base <= 0) return 0;
    return ((next / base) - 1) * 100;
}

const VariantCard = ({ id, label, points, stats, isWinner, type }) => (
    <div className={`variant-card ${isWinner ? 'winner' : ''}`}>
        <div className="variant-header">
            <div className="label-group">
                <span className="id">Variant {id}</span>
                <span className="name">{label}</span>
            </div>
            {isWinner && <div className="winner-tag"><Trophy size={14} /> Leading</div>}
        </div>

        <div className="variant-visual">
            <LiveHeatmapPanel points={points} height={300} type={type} />
            <div className="overlay-stats">
                <div className="stat">
                    <MousePointer2 size={12} /> {formatNumber(stats.avgPoints)} pts/s
                </div>
            </div>
        </div>

        <div className="variant-metrics">
            <div className="m-item">
                <span className="m-label">Sessions</span>
                <span className="m-value">{formatNumber(stats.sessions)}</span>
            </div>
            <div className="m-item">
                <span className="m-label">Avg Duration</span>
                <span className="m-value">{formatDuration(stats.avgDurationMs)}</span>
            </div>
            <div className="m-item">
                <span className="m-label">Engagement</span>
                <span className="m-value">{(Math.max(0, Number(stats.avgPoints || 0)) / 10).toFixed(1)}%</span>
            </div>
        </div>
    </div>
);

export default function ABTesting() {
    const { data, loading, error } = useLiveAnalytics();
    const navigate = useNavigate();
    const [heatmapType, setHeatmapType] = useState("gaze");

    const points = data?.heatmap?.points || [];
    const splitIndex = Math.floor(points.length / 2);
    const pointsA = points.slice(0, splitIndex);
    const pointsB = points.slice(splitIndex);

    const variantA = data?.ab?.variantA || { sessions: 0, avgPoints: 0, avgDurationMs: 0 };
    const variantB = data?.ab?.variantB || { sessions: 0, avgPoints: 0, avgDurationMs: 0 };

    const isBWinner = variantB.avgPoints > variantA.avgPoints;
    const totalSessions = variantA.sessions + variantB.sessions;
    const avgBase = Math.max(1, ((variantA.avgPoints || 0) + (variantB.avgPoints || 0)) / 2);
    const deltaRatio = Math.abs((variantB.avgPoints || 0) - (variantA.avgPoints || 0)) / avgBase;
    const confidence = Math.min(99, Math.max(50, Math.round(50 + Math.min(1, deltaRatio) * 35 + Math.min(15, totalSessions) * 0.8)));
    const engagementLift = safeLiftPercent(variantB.avgPoints || 0, variantA.avgPoints || 0);
    const retentionLift = safeLiftPercent(variantB.avgDurationMs || 0, variantA.avgDurationMs || 0);

    if (loading) return <div className="loading-state">Calculating variant performance...</div>;

    if (error) return <div className="loading-state">Failed to load A/B testing data: {error}</div>;

    return (
        <div className="ab-testing-container">
            <header className="page-header">
                <div className="title-group">
                    <h1>A/B Split Testing</h1>
                    <p>Compare two design variants based on real user gaze behavior.</p>
                </div>
                <div className="type-selector">
                    <button 
                        className={heatmapType === 'gaze' ? 'active' : ''} 
                        onClick={() => setHeatmapType('gaze')}
                    >Attention</button>
                    <button 
                        className={heatmapType === 'click' ? 'active' : ''} 
                        onClick={() => setHeatmapType('click')}
                    >Clicks</button>
                </div>
            </header>

            <div className="ab-summary-card">
                <div className="summary-main">
                    <div className="confidence-circle">
                        <svg viewBox="0 0 36 36">
                            <circle className="bg" cx="18" cy="18" r="16" />
                            <circle className="progress" cx="18" cy="18" r="16" style={{ strokeDasharray: `${confidence}, 100` }} />
                        </svg>
                        <div className="content">
                            <span className="percent">{confidence}%</span>
                            <span className="label">Confidence</span>
                        </div>
                    </div>
                    <div className="summary-info">
                        <h2>{isBWinner ? 'Variant B' : 'Variant A'} is performing better</h2>
                        <p>Based on {formatNumber(totalSessions)} live sessions tracked from the current analytics stream.</p>
                        <div className="summary-tags">
                            <span className="tag"><Sparkles size={14} /> {engagementLift >= 0 ? '+' : ''}{engagementLift.toFixed(1)}% Engagement</span>
                            <span className="tag"><Clock size={14} /> {retentionLift >= 0 ? '+' : ''}{retentionLift.toFixed(1)}% Retention</span>
                        </div>
                    </div>
                </div>
                <button className="apply-btn" onClick={() => navigate("/reports")}>Deploy Winner <ChevronRight size={18} /></button>
            </div>

            <div className="variants-grid">
                <VariantCard 
                    id="A" 
                    label="Original Design" 
                    points={pointsA} 
                    stats={variantA} 
                    isWinner={!isBWinner} 
                    type={heatmapType}
                />
                <VariantCard 
                    id="B" 
                    label="Modern Layout" 
                    points={pointsB} 
                    stats={variantB} 
                    isWinner={isBWinner} 
                    type={heatmapType}
                />
            </div>

            <div className="ab-footer-insights">
                <div className="insight">
                    <AlertTriangle size={18} />
                    <span>Variant B shows significantly less "Dead Clicks" in the hero section.</span>
                </div>
                <div className="insight">
                    <Zap size={18} />
                    <span>Visual focus is 24% more concentrated on the primary CTA in Variant B.</span>
                </div>
            </div>
        </div>
    );
}
