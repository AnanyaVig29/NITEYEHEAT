import React, { useState } from "react";
import "../styles/overview.css";

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const TrendUpIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const TrendDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
    </svg>
);

function Overview() {
    const [selectedEmail, setSelectedEmail] = useState("example.com");
    const [selectedDate, setSelectedDate] = useState("May 12 - May 18, 2024");
    const [selectedUser, setSelectedUser] = useState("All Users");

    const [showEmailDropdown, setShowEmailDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const emails = ["example.com", "website.io", "mysite.dev", "analytics.org"];
    const dates = [
        "May 12 - May 18, 2024",
        "May 5 - May 11, 2024",
        "Apr 28 - May 4, 2024",
        "Apr 21 - Apr 27, 2024",
    ];
    const users = ["All Users", "New Users", "Returning Users", "Premium Users"];

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1 className="overview-title">Overview</h1>
                <div className="overview-controls">
                    <div className="control-dropdown">
                        <button
                            className="control-item"
                            onClick={() => {
                                setShowEmailDropdown(!showEmailDropdown);
                                setShowDateDropdown(false);
                                setShowUserDropdown(false);
                            }}
                        >
                            <span>{selectedEmail}</span>
                            <ChevronDownIcon />
                        </button>
                        {showEmailDropdown && (
                            <div className="dropdown-menu">
                                {emails.map((email) => (
                                    <div
                                        key={email}
                                        className={`dropdown-item ${selectedEmail === email ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedEmail(email);
                                            setShowEmailDropdown(false);
                                        }}
                                    >
                                        {email}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="control-dropdown">
                        <button
                            className="control-item"
                            onClick={() => {
                                setShowDateDropdown(!showDateDropdown);
                                setShowEmailDropdown(false);
                                setShowUserDropdown(false);
                            }}
                        >
                            <CalendarIcon />
                            <span>{selectedDate}</span>
                            <ChevronDownIcon />
                        </button>
                        {showDateDropdown && (
                            <div className="dropdown-menu">
                                {dates.map((date) => (
                                    <div
                                        key={date}
                                        className={`dropdown-item ${selectedDate === date ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setShowDateDropdown(false);
                                        }}
                                    >
                                        {date}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="control-dropdown">
                        <button
                            className="control-item"
                            onClick={() => {
                                setShowUserDropdown(!showUserDropdown);
                                setShowEmailDropdown(false);
                                setShowDateDropdown(false);
                            }}
                        >
                            <UserIcon />
                            <span>{selectedUser}</span>
                            <ChevronDownIcon />
                        </button>
                        {showUserDropdown && (
                            <div className="dropdown-menu">
                                {users.map((user) => (
                                    <div
                                        key={user}
                                        className={`dropdown-item ${selectedUser === user ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowUserDropdown(false);
                                        }}
                                    >
                                        {user}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <span className="kpi-title">Total Sessions</span>
                    <div className="kpi-value-row">
                        <span className="kpi-value">12,842</span>
                        <span className="kpi-change positive"><TrendUpIcon /> 12.5%</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Total Users</span>
                    <div className="kpi-value-row">
                        <span className="kpi-value">8,396</span>
                        <span className="kpi-change positive"><TrendUpIcon /> 8.2%</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Avg. Time on Site</span>
                    <div className="kpi-value-row">
                        <span className="kpi-value">3m 24s</span>
                        <span className="kpi-change positive"><TrendUpIcon /> 15.1%</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Bounce Rate</span>
                    <div className="kpi-value-row">
                        <span className="kpi-value">32.6%</span>
                        <span className="kpi-change negative"><TrendDownIcon /> 4.3%</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Page Views</span>
                    <div className="kpi-value-row">
                        <span className="kpi-value">28,765</span>
                        <span className="kpi-change positive"><TrendUpIcon /> 10.3%</span>
                    </div>
                </div>
            </div>

            <div className="bento-grid">
                <div className="bento-card">
                    <div className="bento-header">Heatmap Overview</div>
                    <div className="heatmap-content">
                        <div className="heatmap-image-wrapper">
                            <div className="mock-website">
                                <div className="mock-nav">
                                    <div className="mock-nav-logo"></div>
                                    <div className="mock-nav-item" style={{ width: '30px' }}></div>
                                    <div className="mock-nav-item" style={{ width: '40px', marginLeft: '10px' }}></div>
                                    <div className="mock-nav-item" style={{ width: '60px', marginLeft: '10px' }}></div>
                                </div>
                                <div className="mock-hero">
                                    <div className="mock-title"></div>
                                    <div className="mock-title" style={{ width: '45%' }}></div>
                                    <div className="mock-subtitle" style={{ marginTop: '20px' }}></div>
                                    <div className="mock-subtitle" style={{ width: '30%' }}></div>
                                    <div className="mock-button"></div>
                                </div>
                            </div>
                            <div className="heatmap-overlay"></div>
                        </div>
                        <div className="heatmap-footer">
                            <div className="heatmap-scale">
                                <span>Low Attention</span>
                                <div className="scale-bar"></div>
                                <span>High Attention</span>
                            </div>
                            <button className="btn-outline">View Full Heatmap</button>
                        </div>
                    </div>
                </div>

                <div className="bento-card">
                    <div className="bento-header">User Engagement</div>
                    <div className="engagement-grid">

                        <div className="engagement-chart-card">
                            <h4>Avg. Time on Page</h4>
                            <div className="value">3m 24s</div>
                            <svg className="mini-chart" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,20 L10,18 L20,25 L30,15 L40,22 L50,10 L60,18 L70,5 L80,12 L90,8 L100,2" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                <path d="M0,20 L10,18 L20,25 L30,15 L40,22 L50,10 L60,18 L70,5 L80,12 L90,8 L100,2 L100,30 L0,30 Z" fill="url(#blue-grad)" stroke="none" />
                            </svg>
                        </div>

                        <div className="engagement-chart-card">
                            <h4>Pages per Session</h4>
                            <div className="value">4.2</div>
                            <svg className="mini-chart" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0,18 L15,15 L25,22 L40,12 L55,18 L65,8 L80,15 L90,5 L100,10" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                <path d="M0,18 L15,15 L25,22 L40,12 L55,18 L65,8 L80,15 L90,5 L100,10 L100,30 L0,30 Z" fill="url(#blue-grad)" stroke="none" />
                            </svg>
                        </div>

                        <div className="engagement-chart-card">
                            <h4>Bounce Rate</h4>
                            <div className="value">32.6%</div>
                            <svg className="mini-chart" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="red-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,10 L10,15 L20,8 L30,20 L40,15 L50,25 L60,18 L70,22 L80,10 L90,15 L100,8" fill="none" stroke="#ef4444" strokeWidth="2" />
                                <path d="M0,10 L10,15 L20,8 L30,20 L40,15 L50,25 L60,18 L70,22 L80,10 L90,15 L100,8 L100,30 L0,30 Z" fill="url(#red-grad)" stroke="none" />
                            </svg>
                        </div>

                        <div className="engagement-chart-card">
                            <h4>Return Visitors</h4>
                            <div className="value">24.5%</div>
                            <svg className="mini-chart" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,15 L60,5 L70,12 L80,8 L90,15 L100,10" fill="none" stroke="#10b981" strokeWidth="2" />
                                <path d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,15 L60,5 L70,12 L80,8 L90,15 L100,10 L100,30 L0,30 Z" fill="url(#green-grad)" stroke="none" />
                            </svg>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default Overview;
