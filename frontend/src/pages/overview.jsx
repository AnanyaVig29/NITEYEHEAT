import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/overview.css";
import LiveHeatmapPanel from "../components/LiveHeatmapPanel";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatDuration, formatNumber, formatPercent } from "../utils/liveFormat";
import { 
  Users, 
  Activity, 
  Clock, 
  MousePointer, 
  TrendingUp, 
  Monitor, 
  Smartphone,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

function Overview() {
    const { data, loading, error } = useLiveAnalytics();
    const navigate = useNavigate();
    
    const totals = data?.totals || {};
    const heatmapPoints = (data?.heatmap?.segmented?.gaze || []).slice(-1200);
    const topPages = data?.topPages || [];
    const patterns = data?.patterns || {};
    const deviceStats = data?.deviceStats || { desktop: 0, mobile: 0 };

    const kpiCards = useMemo(() => [
        { 
            label: "Total Sessions", 
            value: formatNumber(totals.sessions || 0), 
            icon: <Activity size={20} />, 
            change: "+12%", 
            positive: true 
        },
        { 
            label: "Gaze Points", 
            value: formatNumber(totals.points || 0), 
            icon: <Eye size={20} />, 
            change: "+5.4%", 
            positive: true 
        },
        { 
            label: "Avg. Duration", 
            value: formatDuration(totals.avgDurationMs || 0), 
            icon: <Clock size={20} />, 
            change: "-2%", 
            positive: false 
        },
        { 
            label: "Bounce Rate", 
            value: formatPercent(totals.bounceRate || 0), 
            icon: <ArrowDownRight size={20} />, 
            change: "-8%", 
            positive: true 
        },
        { 
            label: "Engagement", 
            value: `${totals.engagementScore || 0}%`, 
            icon: <TrendingUp size={20} />, 
            change: "+14%", 
            positive: true 
        }
    ], [totals]);

    if (error) {
        return (
            <div className="overview-container error-state">
                <p>Failed to load analytics: {error}</p>
            </div>
        );
    }

    return (
        <div className="overview-container">
            <header className="overview-header">
                <div className="title-group">
                    <h1>EyeHeat Insights</h1>
                    <p>Real-time gaze tracking and behavior analytics dashboard.</p>
                </div>
                <div className="overview-controls">
                    <button className="control-item">
                        <Monitor size={16} /> {deviceStats.desktop} Desktop
                    </button>
                    <button className="control-item">
                        <Smartphone size={16} /> {deviceStats.mobile} Mobile
                    </button>
                </div>
            </header>

            <div className="kpi-grid">
                {kpiCards.map((card, i) => (
                    <div className="kpi-card" key={i}>
                        <div className="kpi-top">
                            <div className={`kpi-icon ${card.positive ? 'positive' : 'negative'}`}>
                                {card.icon}
                            </div>
                            <span className={`kpi-change ${card.positive ? 'positive' : 'negative'}`}>
                                {card.change} {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </span>
                        </div>
                        <span className="kpi-title">{card.label}</span>
                        <span className="kpi-value">{card.value}</span>
                    </div>
                ))}
            </div>

            <div className="bento-grid">
                <div className="bento-card main">
                    <div className="bento-header">
                        <h3>Attention Map</h3>
                        <div className="pattern-tags">
                            {patterns.f > 50 && <span className="pattern-tag">F-Pattern</span>}
                            {patterns.z > 50 && <span className="pattern-tag">Z-Pattern</span>}
                            {patterns.layerCake > 50 && <span className="pattern-tag">Layer Cake</span>}
                        </div>
                    </div>
                    <div className="heatmap-wrap">
                        <LiveHeatmapPanel points={heatmapPoints} height="100%" type="gaze" />
                    </div>
                </div>

                <div className="bento-card side">
                    <div className="bento-header">
                        <h3>Top Performing Pages</h3>
                    </div>
                    <div className="engagement-list">
                        {topPages.map((page, i) => (
                            <div className="engagement-item" key={i}>
                                <div className="item-info">
                                    <span className="item-path">{page.page}</span>
                                    <span className="item-meta">{formatNumber(page.sessions)} sessions • {formatDuration(page.avgDurationMs)} avg</span>
                                </div>
                                <div className="item-score">
                                    {page.engagementScore}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bento-card wide">
                    <div className="bento-header">
                        <h3>User Behavior Flow</h3>
                    </div>
                    <div className="flow-metrics">
                        <div className="flow-metric">
                            <div className="flow-value">{formatPercent(totals.attentionRetention || 0)}</div>
                            <div className="flow-label">Attention Retention</div>
                        </div>
                        <div className="flow-divider"></div>
                        <div className="flow-metric">
                            <div className="flow-value">{formatNumber(totals.avgPointsPerSession || 0)}</div>
                            <div className="flow-label">Points / Session</div>
                        </div>
                        <div className="flow-divider"></div>
                        <div className="flow-metric">
                            <div className="flow-value">{formatNumber(totals.ttffMs || 0)}ms</div>
                            <div className="flow-label">Time to First Fixation</div>
                        </div>
                    </div>
                </div>

                <div className="bento-card narrow">
                    <div className="bento-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions-grid">
                        <button className="quick-action-btn" onClick={() => navigate("/overview")}>
                            <Activity size={20} /> Real-time
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate("/analytics")}>
                            <Users size={20} /> Segments
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate("/heatmaps")}>
                            <MousePointer size={20} /> Clicks
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate("/reports")}>
                            <TrendingUp size={20} /> Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;
