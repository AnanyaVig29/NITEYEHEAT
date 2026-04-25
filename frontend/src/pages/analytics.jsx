import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import "../styles/analytics.css";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatDuration, formatNumber, formatPercent } from "../utils/liveFormat";
import { TrendingUp, Users, Clock, MousePointer2 } from "lucide-react";

const COLORS = ['#3b82f6', '#f472b6', '#fbbf24', '#10b981'];

function buildTrendFromSessions(recentSessions = []) {
  if (!Array.isArray(recentSessions) || !recentSessions.length) {
    return [];
  }

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const buckets = new Map(labels.map((label) => [label, { name: label, sessions: 0, points: 0 }]));

  recentSessions.forEach((session) => {
    const ts = Number(session?.createdAt);
    const date = Number.isFinite(ts) ? new Date(ts) : null;
    if (!date || Number.isNaN(date.getTime())) return;

    const label = labels[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const bucket = buckets.get(label);
    if (!bucket) return;

    bucket.sessions += 1;
    bucket.points += Number(session?.pointCount || 0);
  });

  return labels.map((label) => buckets.get(label));
}

const Analytics = () => {
  const { data, loading, error } = useLiveAnalytics();

  const totals = data?.totals || {};
  const topElements = data?.topElements || [];
  const topPages = data?.topPages || [];
  const deviceStats = data?.deviceStats || { desktop: 0, mobile: 0 };
  const trendData = buildTrendFromSessions(data?.recentSessions || []);

  const pieData = [
    { name: 'Desktop', value: deviceStats.desktop || 65 },
    { name: 'Mobile', value: deviceStats.mobile || 35 },
  ];

  const kpis = [
    { label: "Total Gaze Points", value: formatNumber(totals.points || 0), icon: <MousePointer2 size={20} />, color: "#3b82f6" },
    { label: "Active Sessions", value: formatNumber(totals.sessions || 0), icon: <TrendingUp size={20} />, color: "#10b981" },
    { label: "Unique Users", value: formatNumber(totals.users || 0), icon: <Users size={20} />, color: "#f472b6" },
    { label: "Avg Focus Time", value: formatDuration(totals.avgDurationMs || 0), icon: <Clock size={20} />, color: "#fbbf24" },
  ];

  if (loading) return <div className="loading-state">Syncing live analytics...</div>;

  if (error) {
    return <div className="loading-state">Failed to load analytics: {error}</div>;
  }

  return (
    <div className="analytics-container">
      <header className="page-header">
        <div className="title-group">
          <h1>Behavior Analytics</h1>
          <p>Deep-dive into fixation metrics and user segments.</p>
        </div>
      </header>

      <div className="analytics-kpi-grid">
        {kpis.map((kpi, i) => (
          <div className="analytics-kpi" key={i}>
            <div className="kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
              {kpi.icon}
            </div>
            <div className="kpi-info">
              <span className="label">{kpi.label}</span>
              <span className="value">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-bento">
        <div className="analytics-card wide">
          <div className="card-header">
            <h3>Traffic & Gaze Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="points" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSessions)" />
                <Area type="monotone" dataKey="sessions" stroke="#10b981" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3>Device Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {pieData.map((d, i) => (
                <div key={i} className="legend-item">
                  <div className="dot" style={{ background: COLORS[i] }}></div>
                  <span>{d.name}: {d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3>Top Pages by Engagement</h3>
          </div>
          <div className="pages-table">
            {topPages.slice(0, 5).map((page, i) => (
              <div className="page-row" key={i}>
                <span className="path">{page.page}</span>
                <div className="score-group">
                  <div className="mini-bar-bg">
                    <div className="mini-bar-fill" style={{ width: `${page.engagementScore}%` }}></div>
                  </div>
                  <span className="score">{page.engagementScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card wide">
          <div className="card-header">
            <h3>Section Performance</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topElements}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="element" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
