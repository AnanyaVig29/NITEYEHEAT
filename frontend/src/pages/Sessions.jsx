import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sessions.css";
import { useLiveAnalytics } from "../hooks/useLiveAnalytics";
import { formatDuration, formatNumber } from "../utils/liveFormat";
import { downloadSessionJson } from "../utils/gazeApi";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Clock, 
  Eye, 
  MousePointer, 
  AlertCircle,
  Calendar,
  Monitor,
  Smartphone,
    Maximize2,
    Download
} from "lucide-react";

const SessionPlayer = ({ session, onClose }) => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const timelineEvents = [
        { time: '0:05', type: 'scroll', label: 'Scrolled to Features' },
        { time: '0:12', type: 'click', label: 'Clicked CTA' },
        { time: '0:25', type: 'rage', label: 'Rage click detected', important: true },
        { time: '0:40', type: 'exit', label: 'Session ended' },
    ];

    const handleViewHeatmap = () => {
        navigate(`/heatmaps?sessionId=${session.id}`);
    };

    return (
        <div className="session-player-overlay">
            <div className="player-container">
                <header className="player-header">
                    <div className="session-info">
                        <h3>Session {session.id.slice(0, 8)}</h3>
                        <span>{new Date(session.createdAt).toLocaleString()} • {session.device}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </header>

                <div className="player-main">
                    <div className="video-viewport">
                        <div className="mock-browser-ui">
                            <div className="url-bar">{session.pageUrl || "/"}</div>
                        </div>
                        <div className="recording-content">
                            <div className="player-placeholder">
                                <Eye size={48} opacity={0.2} />
                                <p>Replaying session data...</p>
                            </div>
                            
                            <div className="mock-cursor" style={{ 
                                left: `${20 + progress * 0.5}%`, 
                                top: `${30 + Math.sin(progress * 0.1) * 20}%` 
                            }}>
                                <MousePointer size={16} fill="var(--accent-primary)" />
                            </div>
                        </div>

                        <div className="player-controls">
                            <div className="progress-bar-container" onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setProgress(((e.clientX - rect.left) / rect.width) * 100);
                            }}>
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                {timelineEvents.map((ev, i) => (
                                    <div key={i} className={`event-marker ${ev.important ? 'important' : ''}`} style={{ left: `${(i + 1) * 20}%` }}>
                                        <div className="marker-tooltip">{ev.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="controls-row">
                                <div className="left-controls">
                                    <button><SkipBack size={20} /></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)}>
                                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                    </button>
                                    <button><SkipForward size={20} /></button>
                                    <span className="time-display">
                                        {formatDuration((progress / 100) * session.durationMs)} / {formatDuration(session.durationMs)}
                                    </span>
                                </div>
                                <div className="right-controls">
                                    <button title="View Heatmap" onClick={handleViewHeatmap}><Flame size={20} /></button>
                                    <button><Maximize2 size={20} /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="event-timeline">
                        <h4>Event Timeline</h4>
                        <div className="timeline-list">
                            {timelineEvents.map((ev, i) => (
                                <div key={i} className={`timeline-item ${ev.important ? 'important' : ''}`}>
                                    <span className="ev-time">{ev.time}</span>
                                    <div className="ev-dot"></div>
                                    <span className="ev-label">{ev.label}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const Flame = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
);

export default function Sessions() {
    const { data, loading } = useLiveAnalytics();
    const [selectedSession, setSelectedSession] = useState(null);
    const [showFrustratedOnly, setShowFrustratedOnly] = useState(false);
    const [useLast24h, setUseLast24h] = useState(true);
    const [exportingSessionId, setExportingSessionId] = useState('');
    const recentSessions = data?.recentSessions || [];
    const now = Date.now();
    const filteredSessions = recentSessions.filter((s) => {
        const inWindow = !useLast24h || (now - Number(s.createdAt || 0) <= 24 * 60 * 60 * 1000);
        const frustrated = !showFrustratedOnly || Number(s.pointCount || 0) <= 20;
        return inWindow && frustrated;
    });

    const handleExportJson = async (session) => {
        try {
            setExportingSessionId(session.id);
            const blob = await downloadSessionJson(session.id);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `session-${session.id}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setExportingSessionId('');
        }
    };

    if (loading) return <div className="loading-state">Loading recordings...</div>;

    return (
        <div className="sessions-page">
            <header className="page-header">
                <div className="title-group">
                    <h1>User Journeys</h1>
                    <p>Replay user journeys and identify friction points.</p>
                </div>
                <div className="header-filters">
                    <button className="control-item" onClick={() => setUseLast24h((prev) => !prev)}>
                        <Calendar size={16} /> {useLast24h ? "Last 24h" : "All Time"}
                    </button>
                    <button className="control-item" onClick={() => setShowFrustratedOnly((prev) => !prev)}>
                        <AlertCircle size={16} /> {showFrustratedOnly ? "All Sessions" : "Frustrated Only"}
                    </button>
                </div>
            </header>

            <div className="sessions-list-container">
                <div className="list-header">
                    <span>User / Session</span>
                    <span>Activity</span>
                    <span>Engagement</span>
                    <span>Device</span>
                    <span>Time</span>
                    <span></span>
                </div>
                <div className="sessions-list">
                    {filteredSessions.map((s) => (
                        <div className="session-row" key={s.id} onClick={() => setSelectedSession(s)}>
                            <div className="user-cell">
                                <div className="user-avatar">
                                    {s.id.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="user-meta">
                                    <span className="session-id">#{s.id.slice(0, 8)}</span>
                                    <span className="user-type">{s.userType}</span>
                                </div>
                            </div>
                            <div className="activity-cell">
                                <span className="pts">{formatNumber(s.pointCount)} points</span>
                                <span className="page-url">{s.pageUrl || "/"}</span>
                            </div>
                            <div className="engagement-cell">
                                <div className="engagement-bar">
                                    <div className="bar-fill" style={{ width: `${s.engagementScore ?? 50}%` }}></div>
                                </div>
                                <span className="dur">{formatDuration(s.durationMs)}</span>
                                {s.fixationCount > 0 && (
                                  <span title="Fixations" style={{ fontSize: '11px', color: 'var(--chart-teal)', marginTop: 2 }}>
                                    {s.fixationCount} fixations
                                  </span>
                                )}
                            </div>
                            <div className="device-cell">
                                {s.device === 'mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                            </div>
                            <div className="time-cell">
                                {new Date(s.createdAt).toLocaleTimeString()}
                            </div>
                            <div className="action-cell">
                                <button
                                    className="play-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSession(s);
                                    }}
                                >
                                    <Play size={16} fill="currentColor" />
                                </button>
                                <button
                                    className="play-btn"
                                    title="Export JSON"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExportJson(s);
                                    }}
                                    disabled={exportingSessionId === s.id}
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {!filteredSessions.length && (
                        <div className="session-row">
                            <div className="empty-row">No sessions match these filters.</div>
                        </div>
                    )}
                </div>
            </div>

            {selectedSession && (
                <SessionPlayer 
                    session={selectedSession} 
                    onClose={() => setSelectedSession(null)} 
                />
            )}
        </div>
    );
}
