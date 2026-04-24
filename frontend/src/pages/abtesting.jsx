import React from "react";
import "../styles/abtesting.css";

function ABTesting() {
    return (
        <div className="abtesting-container">
            {/* Header */}
            <div className="abtesting-header">
                <div>
                    <h1 className="abtesting-title">A/B Testing (Eye Tracking)</h1>
                    <p className="abtesting-subtitle">Comparing layout variations using user attention & gaze data, not just clicks.</p>
                </div>
                <select className="test-selector">
                    <option>Landing Page CTA Test</option>
                    <option>Pricing Table Layout</option>
                    <option>Form Design Comparison</option>
                </select>
            </div>

            {/* Winner Banner */}
            <div className="winner-banner">
                <div className="winner-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <div className="winner-info">
                    <h3 className="winner-title">Winner: Version B (Button near headline)</h3>
                    <p className="winner-desc">
                        Eye tracking reveals users in Version B noticed the primary CTA 3.2 seconds faster.
                        In Version A, the CTA fell into a cold zone, meaning users didn't even <strong>see</strong> it before scrolling away.
                    </p>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="ab-comparison-grid">

                {/* VERSION A */}
                <div className="version-card">
                    <div className="version-header">
                        <div className="version-title">Version A</div>
                        <span className="version-badge">Original</span>
                    </div>

                    {/* Mock Heatmap Visual */}
                    <div className="heatmap-visual">
                        <div className="heatmap-mockup">
                            {/* Mock UI Structure */}
                            <div className="mock-nav"></div>
                            <div className="mock-hero">
                                {/* Button is missing here in Version A */}
                            </div>
                            <div className="mock-content">
                                <div className="mock-line" style={{ width: "90%" }}></div>
                                <div className="mock-line" style={{ width: "80%" }}></div>
                                <div className="mock-line" style={{ width: "85%" }}></div>
                                <div className="mock-line" style={{ width: "60%" }}></div>
                                {/* Button at bottom in Version A */}
                                <div className="mock-btn" style={{ marginTop: "20px" }}></div>
                            </div>

                            {/* Simulated Heatmap Blobs (Focus on hero, miss bottom) */}
                            <div className="heat-blob heat-red" style={{ top: "40px", left: "60px", width: "120px", height: "80px" }}></div>
                            <div className="heat-blob heat-yellow" style={{ top: "50px", left: "150px", width: "90px", height: "60px" }}></div>
                            <div className="heat-blob heat-green" style={{ top: "120px", left: "40px", width: "140px", height: "40px" }}></div>

                            {/* Scan Path */}
                            <svg className="gaze-path">
                                <path d="M 100 80 Q 150 70 200 90 T 120 140" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="100" cy="80" r="4" fill="#3b82f6" />
                                <circle cx="200" cy="90" r="4" fill="#3b82f6" />
                                <circle cx="120" cy="140" r="4" fill="#3b82f6" />
                            </svg>
                        </div>
                    </div>

                    <div className="version-metrics">
                        <div className="metric-box">
                            <span className="metric-name">Time to First Fixation (TTFF)</span>
                            <span className="metric-value">6.8s</span>
                            <span className="metric-context">On CTA Button</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">Fixation Duration</span>
                            <span className="metric-value">0.4s</span>
                            <span className="metric-context">Avg time looking at CTA</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">Heatmap Intensity</span>
                            <span className="metric-value">Low</span>
                            <span className="metric-context">Bottom page placement</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">Conversion Rate</span>
                            <span className="metric-value">2.1%</span>
                            <span className="metric-context">Standard clicks</span>
                        </div>
                    </div>
                </div>

                {/* VERSION B */}
                <div className="version-card">
                    <div className="version-header winner">
                        <div className="version-title">
                            Version B
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <span className="version-badge success">Winner</span>
                    </div>

                    {/* Mock Heatmap Visual */}
                    <div className="heatmap-visual">
                        <div className="heatmap-mockup">
                            {/* Mock UI Structure */}
                            <div className="mock-nav"></div>
                            <div className="mock-hero" style={{ flexDirection: "column", gap: "10px" }}>
                                {/* Button near headline in Version B */}
                                <div className="mock-line" style={{ width: "60%", background: "#cbd5e1" }}></div>
                                <div className="mock-btn"></div>
                            </div>
                            <div className="mock-content">
                                <div className="mock-line" style={{ width: "90%" }}></div>
                                <div className="mock-line" style={{ width: "80%" }}></div>
                                <div className="mock-line" style={{ width: "85%" }}></div>
                                <div className="mock-line" style={{ width: "60%" }}></div>
                            </div>

                            {/* Simulated Heatmap Blobs (Focus on hero + button) */}
                            <div className="heat-blob heat-red" style={{ top: "35px", left: "60px", width: "160px", height: "90px" }}></div>
                            <div className="heat-blob heat-red" style={{ top: "70px", left: "100px", width: "100px", height: "60px" }}></div> {/* Intense focus on CTA */}
                            <div className="heat-blob heat-green" style={{ top: "150px", left: "40px", width: "140px", height: "40px" }}></div>

                            {/* Scan Path */}
                            <svg className="gaze-path">
                                <path d="M 80 50 Q 140 60 140 90" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="80" cy="50" r="4" fill="#3b82f6" />
                                <circle cx="140" cy="90" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" /> {/* Strong fixation on CTA */}
                            </svg>
                        </div>
                    </div>

                    <div className="version-metrics">
                        <div className="metric-box highlight">
                            <span className="metric-name">Time to First Fixation (TTFF)</span>
                            <span className="metric-value">1.2s</span>
                            <span className="metric-context">On CTA Button</span>
                        </div>
                        <div className="metric-box highlight">
                            <span className="metric-name">Fixation Duration</span>
                            <span className="metric-value">2.8s</span>
                            <span className="metric-context">Avg time looking at CTA</span>
                        </div>
                        <div className="metric-box highlight">
                            <span className="metric-name">Heatmap Intensity</span>
                            <span className="metric-value">High</span>
                            <span className="metric-context">Hot spot detected</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">Conversion Rate</span>
                            <span className="metric-value">6.4%</span>
                            <span className="metric-context">Standard clicks</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Insights Section */}
            <div className="ab-insights">
                <h3 className="insights-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Why Eye Tracking Proved Version B Better
                </h3>
                <div className="insights-grid">
                    <div className="insight-card win">
                        <h4>Attention Before Action</h4>
                        <p>Clicks only tell half the story. Version A failed not because the button didn't work, but because users never scrolled down far enough to see it. Version B placed the CTA directly in the user's natural gaze path.</p>
                    </div>
                    <div className="insight-card warn">
                        <h4>Scan Path Efficiency</h4>
                        <p>The gaze plot for Version B shows a direct, effortless scan from the headline to the button. Version A required visual searching, causing cognitive load and drop-offs.</p>
                    </div>
                    <div className="insight-card win">
                        <h4>Fixation Depth</h4>
                        <p>Users stared at the CTA in Version B for 2.8s (a high fixation duration), indicating they were actively reading and processing the offer before clicking.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ABTesting;
