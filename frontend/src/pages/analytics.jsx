import React from "react";


const clickOverview = [
    { label: "Total Clicks", value: "48,329", change: "+14.2%", positive: true },
    { label: "Unique Clicks", value: "31,204", change: "+9.8%", positive: true },
    { label: "Avg. Clicks/Session", value: "3.8", change: "+5.1%", positive: true },
    { label: "Rage Clicks", value: "1,247", change: "-22.3%", positive: true },
];

const clickedElements = [
    { element: "Get Started Button", clicks: "8,432", percentage: 72, color: "#b46445" },
    { element: "Pricing Tab", clicks: "6,891", percentage: 58, color: "#f59e0b" },
    { element: "Navigation Menu", clicks: "5,623", percentage: 47, color: "#3b82f6" },
    { element: "Contact Form Submit", clicks: "4,102", percentage: 34, color: "#10b981" },
    { element: "Footer Links", clicks: "3,456", percentage: 29, color: "#8b5cf6" },
    { element: "Search Bar", clicks: "2,891", percentage: 24, color: "#ec4899" },
];

const scrollDepth = [
    { depth: "0-25%", users: "100%", width: 100, color: "#10b981" },
    { depth: "25-50%", users: "78%", width: 78, color: "#3b82f6" },
    { depth: "50-75%", users: "52%", width: 52, color: "#f59e0b" },
    { depth: "75-100%", users: "31%", width: 31, color: "#ef4444" },
];

const sectionEngagement = [
    { section: "Hero / Header", avgTime: "4.2s", gazeFixations: 342, clicks: "8,432", attention: 92 },
    { section: "Features Grid", avgTime: "6.8s", gazeFixations: 521, clicks: "3,201", attention: 78 },
    { section: "Pricing Table", avgTime: "8.1s", gazeFixations: 684, clicks: "6,891", attention: 85 },
    { section: "Testimonials", avgTime: "3.5s", gazeFixations: 198, clicks: "1,024", attention: 45 },
    { section: "Contact Form", avgTime: "5.6s", gazeFixations: 412, clicks: "4,102", attention: 68 },
    { section: "Footer", avgTime: "1.2s", gazeFixations: 87, clicks: "3,456", attention: 22 },
];

const topPages = [
    { page: "/", views: "12,842", clicks: "18,320", gazeTime: "4.2s", score: 94 },
    { page: "/features", views: "9,842", clicks: "12,104", gazeTime: "6.8s", score: 87 },
    { page: "/pricing", views: "6,125", clicks: "9,230", gazeTime: "8.1s", score: 82 },
    { page: "/about", views: "3,842", clicks: "4,560", gazeTime: "3.5s", score: 65 },
    { page: "/blog", views: "4,123", clicks: "5,890", gazeTime: "5.1s", score: 71 },
    { page: "/contact", views: "2,156", clicks: "3,102", gazeTime: "5.6s", score: 58 },
];

function Analytics() {
    return (
        <div className="analytics-container">
            <h1 className="analytics-title">Analytics</h1>

            {/* Click Overview KPIs */}
            <div className="analytics-kpi-grid">
                {clickOverview.map((item, i) => (
                    <div className="analytics-kpi" key={i}>
                        <span className="analytics-kpi-label">{item.label}</span>
                        <div className="analytics-kpi-row">
                            <span className="analytics-kpi-value">{item.value}</span>
                            <span className={`analytics-kpi-change ${item.positive ? "positive" : "negative"}`}>
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bento Grid */}
            <div className="analytics-bento">

                {/* Clicked Elements */}
                <div className="analytics-card card-clicked-elements">
                    <h2 className="analytics-card-title">Most Clicked Elements</h2>
                    <div className="clicked-list">
                        {clickedElements.map((el, i) => (
                            <div className="clicked-item" key={i}>
                                <div className="clicked-info">
                                    <span className="clicked-rank">#{i + 1}</span>
                                    <span className="clicked-name">{el.element}</span>
                                    <span className="clicked-count">{el.clicks}</span>
                                </div>
                                <div className="clicked-bar-bg">
                                    <div
                                        className="clicked-bar-fill"
                                        style={{ width: `${el.percentage}%`, background: el.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Depth Pie Chart */}
                <div className="analytics-card card-scroll-depth">
                    <h2 className="analytics-card-title">Scroll Depth Analysis</h2>
                    <p className="analytics-card-subtitle">Distribution of user scroll depths</p>
                    
                    <div className="scroll-pie-container">
                        <svg viewBox="0 0 36 36" className="scroll-pie-chart">
                            <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="6"></circle>
                            {/* 75-100% (31%) */}
                            <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray="31 69" strokeDashoffset="25"></circle>
                            {/* 50-75% (21%) */}
                            <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="21 79" strokeDashoffset="-6"></circle>
                            {/* 25-50% (26%) */}
                            <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="26 74" strokeDashoffset="-27"></circle>
                            {/* 0-25% (22%) */}
                            <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="22 78" strokeDashoffset="-53"></circle>
                            <text x="18" y="18" className="pie-center-text" dominantBaseline="middle" textAnchor="middle">Scroll</text>
                        </svg>
                        
                        <div className="scroll-pie-legend">
                            <div className="legend-item"><span className="legend-color" style={{background: "#ef4444"}}></span> 75-100% (Footer & Contact) - 31%</div>
                            <div className="legend-item"><span className="legend-color" style={{background: "#f59e0b"}}></span> 50-75% (Testimonials) - 21%</div>
                            <div className="legend-item"><span className="legend-color" style={{background: "#3b82f6"}}></span> 25-50% (Pricing Table) - 26%</div>
                            <div className="legend-item"><span className="legend-color" style={{background: "#10b981"}}></span> 0-25% (Hero & Features) - 22%</div>
                        </div>
                    </div>
                </div>

                {/* Section Engagement Line Chart */}
                <div className="analytics-card card-section-engagement">
                    <h2 className="analytics-card-title">Section Engagement Trend</h2>
                    <p className="analytics-card-subtitle">Attention score progression through the page sections</p>
                    <div className="line-chart-container">
                        <svg className="line-chart" viewBox="0 0 600 200" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="200" x2="600" y2="200" stroke="#f1f5f9" strokeWidth="1" />
                            
                            {/* Data Line (Attention Score mapped to Y: 200 - (score * 1.8)) */}
                            {/* Points: 
                                Hero: 92 -> Y: 34 
                                Features: 78 -> Y: 60 
                                Pricing: 85 -> Y: 47 
                                Testimonials: 45 -> Y: 119
                                Contact: 68 -> Y: 78
                                Footer: 22 -> Y: 160
                            */}
                            <path 
                                d="M 50 34 L 150 60 L 250 47 L 350 119 L 450 78 L 550 160" 
                                fill="none" 
                                stroke="#b46445" 
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            
                            {/* Area under the curve */}
                            <path 
                                d="M 50 200 L 50 34 L 150 60 L 250 47 L 350 119 L 450 78 L 550 160 L 550 200 Z" 
                                fill="url(#lineGradient)" 
                                opacity="0.3"
                            />
                            
                            {/* Data Points */}
                            <circle cx="50" cy="34" r="6" fill="#fff" stroke="#b46445" strokeWidth="3" />
                            <circle cx="150" cy="60" r="6" fill="#fff" stroke="#b46445" strokeWidth="3" />
                            <circle cx="250" cy="47" r="6" fill="#fff" stroke="#b46445" strokeWidth="3" />
                            <circle cx="350" cy="119" r="6" fill="#fff" stroke="#b46445" strokeWidth="3" />
                            <circle cx="450" cy="78" r="6" fill="#fff" stroke="#b46445" strokeWidth="3" />
                            <circle cx="550" cy="160" r="6" fill="#fff" stroke="#b46445" strokeWidth="3" />

                            <defs>
                                <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#b46445" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#b46445" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* X Axis Labels */}
                        <div className="line-chart-labels">
                            <span>Hero</span>
                            <span>Features</span>
                            <span>Pricing</span>
                            <span>Tests</span>
                            <span>Contact</span>
                            <span>Footer</span>
                        </div>
                    </div>
                </div>

                {/* Top Pages */}
                <div className="analytics-card card-top-pages">
                    <h2 className="analytics-card-title">Top Pages (Eye Tracking + Clicks)</h2>
                    <p className="analytics-card-subtitle">Pages ranked by combined user engagement</p>
                    <div className="top-pages-list">
                        {topPages.map((page, i) => (
                            <div className="top-page-item" key={i}>
                                <div className="top-page-rank">
                                    <span className={`rank-badge ${i < 3 ? "top" : ""}`}>{i + 1}</span>
                                </div>
                                <div className="top-page-info">
                                    <span className="top-page-path">{page.page}</span>
                                    <div className="top-page-stats">
                                        <span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            {page.views}
                                        </span>
                                        <span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" /></svg>
                                            {page.clicks}
                                        </span>
                                        <span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            {page.gazeTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="top-page-score">
                                    <svg className="score-ring" viewBox="0 0 36 36">
                                        <path
                                            className="score-ring-bg"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="score-ring-fill"
                                            strokeDasharray={`${page.score}, 100`}
                                            style={{ stroke: page.score >= 80 ? "#10b981" : page.score >= 60 ? "#f59e0b" : "#ef4444" }}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <text x="18" y="20.35" className="score-text">{page.score}</text>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Analytics;
