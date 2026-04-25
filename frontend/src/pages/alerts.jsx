import React from "react";
import "../styles/alerts.css";

const WarningIcon = ({ color = "#f59e0b" }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

const AlertCircleIcon = ({ color = "#ef4444" }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
);

const MessageIcon = ({ color = "#ef4444" }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const ZapIcon = ({ color = "#f59e0b" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const CheckCircleIcon = ({ color = "#10b981" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const TrendDownIcon = ({ color = "#ef4444" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
    </svg>
);

const insights = [
    {
        severity: "High Impact",
        severityColor: "#ef4444",
        icon: <WarningIcon color="#ef4444" />,
        iconBg: "#fef2f2",
        text: "The pricing section has high attention but low engagement. Consider improving CTA visibility.",
    },
    {
        severity: "Medium Impact",
        severityColor: "#f59e0b",
        icon: <WarningIcon color="#f59e0b" />,
        iconBg: "#fffbeb",
        text: "Users are not scrolling much on mobile devices. Try shorter content or better mobile layout.",
    },
    {
        severity: "High Impact",
        severityColor: "#ef4444",
        icon: <MessageIcon color="#ef4444" />,
        iconBg: "#fef2f2",
        text: "The contact form is getting attention but has high drop-off rate.",
    },
];

const alerts = [
    {
        icon: <TrendDownIcon color="#ef4444" />,
        iconBg: "#fef2f2",
        title: "High Bounce Rate",
        desc: "The bounce rate on /pricing page is 35.4%",
        time: "2h ago",
    },
    {
        icon: <ZapIcon color="#f59e0b" />,
        iconBg: "#fffbeb",
        title: "Low Scroll Depth",
        desc: "Users are not scrolling past 50% on mobile",
        time: "5h ago",
    },
    {
        icon: <AlertCircleIcon color="#ef4444" />,
        iconBg: "#fef2f2",
        title: "Tracking Issue",
        desc: "Some pages are missing tracking code",
        time: "1d ago",
    },
    {
        icon: <CheckCircleIcon color="#10b981" />,
        iconBg: "#ecfdf5",
        title: "Great Performance",
        desc: "New CTA button test is performing well!",
        time: "2d ago",
    },
];

function Alerts() {
    return (
        <div className="alerts-container">
            <h1 className="page-title alerts-title">Alerts</h1>
            <p className="page-subtitle">Track important insights and issues in one place.</p>
            <div className="alerts-grid">
                {/* AI Insights & Recommendations */}
                <div className="alerts-card">
                    <h2 className="alerts-card-title">AI Insights &amp; Recommendations</h2>

                    <div className="insights-list">
                        {insights.map((item, index) => (
                            <div className="insight-item" key={index}>
                                <div className="insight-icon" style={{ background: item.iconBg }}>
                                    {item.icon}
                                </div>
                                <div className="insight-content">
                                    <span className="insight-severity" style={{ color: item.severityColor }}>
                                        • {item.severity}
                                    </span>
                                    <p className="insight-text">{item.text}</p>
                                </div>
                                <button className="view-details-btn">View Details</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="alerts-card">
                    <div className="alerts-card-header">
                        <h2 className="alerts-card-title">Alerts</h2>
                        <a href="#" className="alerts-view-all">View All Alerts</a>
                    </div>

                    <div className="alert-list">
                        {alerts.map((alert, index) => (
                            <div className="alert-item" key={index}>
                                <div className="alert-icon" style={{ background: alert.iconBg }}>
                                    {alert.icon}
                                </div>
                                <div className="alert-content">
                                    <span className="alert-title">{alert.title}</span>
                                    <span className="alert-desc">{alert.desc}</span>
                                </div>
                                <span className="alert-time">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* UI/UX Improvement Suggestions */}
            <div className="ux-section">
                <h2 className="ux-section-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                    UI/UX Improvement Suggestions
                </h2>
                <p className="ux-section-subtitle">Based on eye tracking patterns and user behavior analysis</p>

                <div className="ux-cards-grid">

                    <div className="ux-card priority-high">
                        <div className="ux-card-badge high">Critical</div>
                        <h3 className="ux-card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            CTA Button Visibility
                        </h3>
                        <p className="ux-card-desc">
                            Eye tracking shows users look at the hero section but miss the primary CTA button. 
                            Only 18% of gaze fixations land on the button area.
                        </p>
                        <div className="ux-card-suggestions">
                            <span className="suggestion-label">Suggestions:</span>
                            <ul>
                                <li>Increase button size by 30% and use a contrasting color</li>
                                <li>Add whitespace around the CTA to draw attention</li>
                                <li>Use directional cues (arrows, images looking at CTA)</li>
                            </ul>
                        </div>
                        <div className="ux-card-metrics">
                            <div className="metric">
                                <span className="metric-value">18%</span>
                                <span className="metric-label">Gaze fixation</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">2.1s</span>
                                <span className="metric-label">Avg. time to notice</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">4.3%</span>
                                <span className="metric-label">Click-through rate</span>
                            </div>
                        </div>
                    </div>

                    <div className="ux-card priority-medium">
                        <div className="ux-card-badge medium">Important</div>
                        <h3 className="ux-card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <line x1="3" x2="21" y1="9" y2="9" />
                                <line x1="9" x2="9" y1="21" y2="9" />
                            </svg>
                            Navigation Layout
                        </h3>
                        <p className="ux-card-desc">
                            Heatmap data reveals users scan the top navigation in an F-pattern but 
                            frequently miss the last 2 menu items. Dropdown menus receive very low attention.
                        </p>
                        <div className="ux-card-suggestions">
                            <span className="suggestion-label">Suggestions:</span>
                            <ul>
                                <li>Reduce navigation items to 5-6 max</li>
                                <li>Group related items under mega menus</li>
                                <li>Highlight the most important links with visual weight</li>
                            </ul>
                        </div>
                        <div className="ux-card-metrics">
                            <div className="metric">
                                <span className="metric-value">72%</span>
                                <span className="metric-label">F-pattern match</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">0.8s</span>
                                <span className="metric-label">Avg. nav scan time</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">12%</span>
                                <span className="metric-label">Dropdown usage</span>
                            </div>
                        </div>
                    </div>

                    <div className="ux-card priority-medium">
                        <div className="ux-card-badge medium">Important</div>
                        <h3 className="ux-card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M16 13H8" />
                                <path d="M16 17H8" />
                            </svg>
                            Content Hierarchy
                        </h3>
                        <p className="ux-card-desc">
                            Users spend 65% of viewing time above the fold. Key information like pricing 
                            and testimonials placed below fold receive minimal eye fixations.
                        </p>
                        <div className="ux-card-suggestions">
                            <span className="suggestion-label">Suggestions:</span>
                            <ul>
                                <li>Move social proof (testimonials) above the fold</li>
                                <li>Add scroll indicators to encourage exploration</li>
                                <li>Use visual anchors to guide eye flow downward</li>
                            </ul>
                        </div>
                        <div className="ux-card-metrics">
                            <div className="metric">
                                <span className="metric-value">65%</span>
                                <span className="metric-label">Above-fold time</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">35%</span>
                                <span className="metric-label">Scroll depth</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">8%</span>
                                <span className="metric-label">Below-fold clicks</span>
                            </div>
                        </div>
                    </div>

                    <div className="ux-card priority-low">
                        <div className="ux-card-badge low">Suggestion</div>
                        <h3 className="ux-card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            Form Design &amp; UX
                        </h3>
                        <p className="ux-card-desc">
                            Eye tracking shows users hesitate at the contact form. Gaze patterns indicate 
                            confusion — users look back and forth between fields. Drop-off is 48% at form start.
                        </p>
                        <div className="ux-card-suggestions">
                            <span className="suggestion-label">Suggestions:</span>
                            <ul>
                                <li>Reduce form fields from 8 to 4 essential ones</li>
                                <li>Add inline validation and progress indicators</li>
                                <li>Use autofill and smart defaults to reduce effort</li>
                            </ul>
                        </div>
                        <div className="ux-card-metrics">
                            <div className="metric">
                                <span className="metric-value">48%</span>
                                <span className="metric-label">Form drop-off</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">3.2s</span>
                                <span className="metric-label">Avg. hesitation</span>
                            </div>
                            <div className="metric">
                                <span className="metric-value">6</span>
                                <span className="metric-label">Back-glances</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Alerts;
