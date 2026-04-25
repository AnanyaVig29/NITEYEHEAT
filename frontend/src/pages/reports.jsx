import React from "react";
import "../styles/reports.css";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatDuration, formatNumber } from "../utils/liveFormat";
import { 
  FileText, 
  Download, 
  Clock, 
  MapPin, 
  Monitor, 
  Smartphone,
  ChevronRight,
  Filter
} from "lucide-react";

function Reports() {
  const { data, loading, error } = useLiveAnalytics();
  const recentSessions = data?.recentSessions || [];
  const topPages = data?.topPages || [];

  return (
    <div className="reports-container">
      <header className="reports-header">
        <div className="title-group">
          <h1 className="reports-title">Session Reports</h1>
          <p className="page-subtitle">Detailed behavior analysis and session logs.</p>
        </div>
        <div className="reports-actions">
          <button className="control-item"><Filter size={16} /> Filter</button>
          <button className="control-item primary">
            <Download size={16} /> Export All
          </button>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      <div className="reports-grid">
        <div className="reports-card sessions-list-card">
          <div className="reports-card-header">
            <h2 className="reports-card-title"><Clock size={18} /> Recent Sessions</h2>
          </div>

          <div className="reports-list">
            {recentSessions.length ? (
              recentSessions.map((session) => (
                <div className="report-item session-row" key={session.id}>
                  <div className="session-device-icon">
                    {session.device === 'mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                  </div>
                  <div className="report-info">
                    <span className="report-title">{session.pageUrl || "/"}</span>
                    <div className="report-meta">
                      <span className="report-date">{new Date(session.createdAt).toLocaleTimeString()}</span>
                      <span className="divider">•</span>
                      <span className="report-user-type">{session.userType} user</span>
                    </div>
                  </div>
                  <div className="session-stats">
                    <span className="pts">{formatNumber(session.pointCount)} pts</span>
                    <span className="dur">{formatDuration(session.durationMs)}</span>
                  </div>
                  <ChevronRight size={16} className="arrow" />
                </div>
              ))
            ) : (
              <div className="empty-state">No recent sessions found.</div>
            )}
          </div>
        </div>

        <div className="reports-card behavior-flow-card">
          <div className="reports-card-header">
            <h2 className="reports-card-title"><MapPin size={18} /> User Behavior Flow</h2>
          </div>
          
          <div className="flow-container">
            {topPages.map((page, idx) => (
              <div key={idx} className="flow-step">
                <div className="step-number">{idx + 1}</div>
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-path">{page.page}</span>
                    <span className="step-sessions">{formatNumber(page.sessions)} sessions</span>
                  </div>
                  <div className="step-bar-container">
                    <div className="step-bar" style={{ width: `${page.engagementScore}%` }}></div>
                  </div>
                  <div className="step-footer">
                    <span>{formatDuration(page.avgDurationMs)} avg. time</span>
                    <span>{page.engagementScore}% engagement</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="activity-overview-section">
        <h2 className="section-title">Activity Overview</h2>
        <div className="activity-grid">
            {[
                { label: 'Avg Session Depth', value: '4.2 pages', sub: 'Top 10% users' },
                { label: 'Time to Interactive', value: '1.8s', sub: '95th percentile' },
                { label: 'Conversion Rate', value: '3.4%', sub: 'Last 24 hours' },
                { label: 'Rage Click Freq', value: '0.2 / ses', sub: 'Low priority' },
            ].map((stat, i) => (
                <div className="activity-kpi-card" key={i}>
                    <span className="kpi-label">{stat.label}</span>
                    <span className="kpi-value">{stat.value}</span>
                    <span className="kpi-sub">{stat.sub}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
