import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/alerts.css";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatDuration, formatPercent } from "../utils/liveFormat";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  TrendingDown, 
  MousePointerClick,
  ArrowRight,
  Zap
} from "lucide-react";

const SeverityIcon = ({ severity }) => {
    switch (severity.toLowerCase()) {
        case 'high':
        case 'critical':
            return <AlertCircle size={20} color="#f43f5e" />;
        case 'medium':
        case 'warning':
            return <AlertTriangle size={20} color="#fbbf24" />;
        default:
            return <Info size={20} color="#3b82f6" />;
    }
};

export default function Alerts() {
    const { data, loading } = useLiveAnalytics();
    const navigate = useNavigate();
    const alerts = data?.alerts || [];
    const recommendations = data?.recommendations || [];
    const totals = data?.totals || {};
    const attentionRetention = Math.max(0, Math.min(100, Number(totals.attentionRetention || 0)));
    const bounceRate = Math.max(0, Math.min(100, Number(totals.bounceRate || 0)));
    const focusScore = Math.max(0, Math.min(100, Number(totals.engagementScore || 0)));

    if (loading) return <div className="loading-state">Scanning live data for anomalies...</div>;

    return (
        <div className="alerts-container">
            <header className="page-header">
                <div className="title-group">
                    <h1>Alerts & Insights</h1>
                    <p>Automated detection of user friction and performance drops.</p>
                </div>
            </header>

            <div className="alerts-bento">
                <div className="alerts-main-section">
                    <div className="section-header">
                        <h3><Zap size={18} /> Active Alerts</h3>
                    </div>
                    <div className="alert-list">
                        {alerts.map((alert, i) => (
                            <div className={`alert-card ${alert.severity}`} key={i}>
                                <div className="alert-icon">
                                    <SeverityIcon severity={alert.severity} />
                                </div>
                                <div className="alert-content">
                                    <div className="alert-top">
                                        <h4>{alert.title}</h4>
                                        <span className={`severity-badge ${alert.severity}`}>{alert.severity}</span>
                                    </div>
                                    <p>{alert.desc}</p>
                                    <div className="alert-actions">
                                        <button className="action-btn secondary" onClick={() => navigate("/sessions")}>View Sessions</button>
                                        <button className="action-btn primary" onClick={() => navigate("/reports")}>Fix Issue</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="insights-sidebar">
                    <div className="section-header">
                        <h3><Lightbulb size={18} /> AI Recommendations</h3>
                    </div>
                    <div className="recommendation-list">
                        {recommendations.map((rec, i) => (
                            <div className="rec-card" key={i}>
                                <div className="rec-header">
                                    <span className="rec-tag">Optimization</span>
                                    <span className="rec-score">8.4 Impact</span>
                                </div>
                                <h4>{rec.title}</h4>
                                <p>{rec.summary}</p>
                                <button className="learn-more" onClick={() => navigate("/reports")}>Learn more <ArrowRight size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="kpi-health-section">
                <h3>Vitals Health</h3>
                <div className="health-grid">
                    <div className="health-card">
                        <div className="health-header">
                            <span className="label">Attention Retention</span>
                            <TrendingDown size={16} color="#f43f5e" />
                        </div>
                        <span className="value">{formatPercent(attentionRetention)}</span>
                        <div className="health-bar-bg">
                            <div className="health-bar-fill" style={{ width: `${attentionRetention}%`, background: '#f43f5e' }}></div>
                        </div>
                    </div>

                    <div className="health-card">
                        <div className="health-header">
                            <span className="label">Focus Score</span>
                            <Zap size={16} color="#3b82f6" />
                        </div>
                        <span className="value">{focusScore}/100</span>
                        <div className="health-bar-bg">
                            <div className="health-bar-fill" style={{ width: `${focusScore}%`, background: '#3b82f6' }}></div>
                        </div>
                    </div>

                    <div className="health-card">
                        <div className="health-header">
                            <span className="label">Dead Click Ratio</span>
                            <MousePointerClick size={16} color="#fbbf24" />
                        </div>
                        <span className="value">{formatPercent(bounceRate / 2)}</span>
                        <div className="health-bar-bg">
                            <div className="health-bar-fill" style={{ width: `${bounceRate / 2}%`, background: '#fbbf24' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
