import React from "react";
import "../styles/reports.css";

const DocIcon = ({ color }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M9 15h6" />
    </svg>
);

const PdfIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
    </svg>
);

const reports = [
    { title: "Executive Summary", date: "May 12 - May 18, 2024", color: "#ef4444", bg: "#fef2f2" },
    { title: "Heatmap Analysis", date: "May 12 - May 18, 2024", color: "#6366f1", bg: "#eef2ff" },
    { title: "User Behavior Report", date: "May 12 - May 18, 2024", color: "#10b981", bg: "#ecfdf5" },
    { title: "A/B Test Results", date: "May 12 - May 18, 2024", color: "#f59e0b", bg: "#fffbeb" },
];

const flowNodes = [
    { path: "/", users: "12,842" },
    { path: "/features", users: "9,842" },
    { path: "/pricing", users: "6,125" },
    { path: "/contact", users: "2,156" },
];

const branchNodes = [
    { path: "/about", users: "3,842", connectFrom: 1 },
    { path: "/blog", users: "4,123", connectFrom: 2 },
];

function Reports() {
    return (
        <div className="reports-container">
            <h1 className="reports-title">Reports</h1>

            <div className="reports-grid">
                {/* Reports List Card */}
                <div className="reports-card">
                    <div className="reports-card-header">
                        <h2 className="reports-card-title">Reports</h2>
                        <a href="#" className="reports-view-all">View All Reports</a>
                    </div>

                    <div className="reports-list">
                        {reports.map((report, index) => (
                            <div className="report-item" key={index}>
                                <div className="report-icon" style={{ background: report.bg }}>
                                    <DocIcon color={report.color} />
                                </div>
                                <div className="report-info">
                                    <span className="report-title">{report.title}</span>
                                    <span className="report-date">{report.date}</span>
                                </div>
                                <button className="report-pdf-btn">
                                    <PdfIcon /> PDF
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="create-report-btn">Create Custom Report</button>
                </div>

                {/* User Behavior Flow Card */}
                <div className="reports-card flow-card">
                    <h2 className="reports-card-title">User Behavior Flow</h2>
                    <p className="flow-subtitle">See the journey users take on your website</p>

                    <div className="flow-diagram">
                        {/* Main flow row */}
                        <div className="flow-main-row">
                            {flowNodes.map((node, index) => (
                                <React.Fragment key={index}>
                                    <div className="flow-node">
                                        <span className="flow-path">{node.path}</span>
                                        <span className="flow-users">{node.users} users</span>
                                    </div>
                                    {index < flowNodes.length - 1 && (
                                        <div className="flow-arrow">
                                            <ArrowRightIcon />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Connector lines */}
                        <div className="flow-connectors">
                            <div className="connector-line connector-1">
                                <ArrowDownIcon />
                                <ArrowUpIcon />
                            </div>
                            <div className="connector-line connector-2">
                                <ArrowUpIcon />
                                <ArrowDownIcon />
                            </div>
                        </div>

                        {/* Branch row */}
                        <div className="flow-branch-row">
                            {branchNodes.map((node, index) => (
                                <div className="flow-node branch-node" key={index}>
                                    <span className="flow-path">{node.path}</span>
                                    <span className="flow-users">{node.users} users</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;
