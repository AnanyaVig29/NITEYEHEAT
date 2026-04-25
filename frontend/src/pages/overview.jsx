import React, { useMemo } from "react";
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="kpi-icon" style={{ color: card.positive ? '#3b82f6' : '#f43f5e' }}>
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
                    <div style={{ flex: 1, position: 'relative' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>{formatPercent(totals.attentionRetention || 0)}</div>
                            <div style={{ fontSize: 12 }}>Attention Retention</div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>{formatNumber(totals.avgPointsPerSession || 0)}</div>
                            <div style={{ fontSize: 12 }}>Points / Session</div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>{formatNumber(totals.ttffMs || 0)}ms</div>
                            <div style={{ fontSize: 12 }}>Time to First Fixation</div>
                        </div>
                    </div>
                </div>

                <div className="bento-card narrow">
                    <div className="bento-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <button className="control-item" style={{ height: 80, flexDirection: 'column', gap: 8 }}>
                            <Activity size={20} /> Real-time
                        </button>
                        <button className="control-item" style={{ height: 80, flexDirection: 'column', gap: 8 }}>
                            <Users size={20} /> Segments
                        </button>
                        <button className="control-item" style={{ height: 80, flexDirection: 'column', gap: 8 }}>
                            <MousePointer size={20} /> Clicks
                        </button>
                        <button className="control-item" style={{ height: 80, flexDirection: 'column', gap: 8 }}>
                            <TrendingUp size={20} /> Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;
