import React, { useState } from "react";
import { 
    Eye, 
    Flame, 
    Clock, 
    Target, 
    Navigation, 
    Layers, 
    Brain, 
    LayoutTemplate, 
    MonitorSmartphone,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    BarChart3
} from "lucide-react";
import "../styles/analytics.css";

const ANALYTICS_SECTIONS = [
    { 
        id: "gaze", 
        label: "Gaze-Based Analytics", 
        icon: Eye, 
        description: "The foundation of eye tracking: Fixations, Saccades, and Scanpaths.",
        metrics: [
            { label: "Fixations", value: "12.8k", sub: "Where users stop and focus", status: "stable" },
            { label: "Saccades", value: "8.3k", sub: "Quick eye movements between points", status: "rising" },
            { label: "Scanpaths", value: "142", sub: "Full journeys of eye movement", status: "stable" }
        ]
    },
    { 
        id: "heatmap", 
        label: "Heatmap Analytics", 
        icon: Flame, 
        description: "Visual representation of attention, clicks, and scroll depth.",
        metrics: [
            { label: "Attention", value: "84%", sub: "Red = most viewed areas", status: "rising" },
            { label: "Clicks", value: "2.4k", sub: "Where users actually click", status: "stable" },
            { label: "Scroll", value: "62%", sub: "Average page depth reached", status: "falling" }
        ]
    },
    { 
        id: "time", 
        label: "Time-Based Analytics", 
        icon: Clock, 
        description: "Focus on duration and engagement metrics like TTFF and Dwell Time.",
        metrics: [
            { label: "TTFF", value: "340ms", sub: "Time to First Fixation", status: "good" },
            { label: "Dwell Time", value: "3.2s", sub: "Avg time spent on elements", status: "rising" },
            { label: "Total View", value: "24m", sub: "Total viewing time", status: "stable" }
        ]
    },
    { 
        id: "aoi", 
        label: "Area of Interest (AOI)", 
        icon: Target, 
        description: "Metrics for defined sections like buttons, images, and text blocks.",
        metrics: [
            { label: "AOI Count", value: "6", sub: "Defined focus regions", status: "stable" },
            { label: "Avg Focus", value: "4.1s", sub: "Time spent per section", status: "rising" },
            { label: "Entry Pt", value: "Hero", sub: "Most common landing zone", status: "fixed" }
        ]
    },
    { 
        id: "nav", 
        label: "Navigation & Behavior", 
        icon: Navigation, 
        description: "Pattern detection (F/Z patterns) and visual journey mapping.",
        metrics: [
            { label: "F-Pattern", value: "72%", sub: "Reading behavior alignment", status: "stable" },
            { label: "Drop-off", value: "14%", sub: "Ignored area percentage", status: "falling" },
            { label: "Landings", value: "Top-L", sub: "Where eyes land first", status: "fixed" }
        ]
    },
    { 
        id: "comp", 
        label: "Comparative Analytics", 
        icon: Layers, 
        description: "A/B testing results and cross-version performance comparison.",
        metrics: [
            { label: "Winner", value: "Ver B", sub: "Top performing version", status: "rising" },
            { label: "Lift", value: "+18%", sub: "Improvement in attention", status: "rising" },
            { label: "Confidence", value: "95%", sub: "Statistical significance", status: "good" }
        ]
    },
    { 
        id: "cognitive", 
        label: "Cognitive Load", 
        icon: Brain, 
        description: "Measures mental effort through pupil dilation and scanning patterns.",
        metrics: [
            { label: "Effort", value: "Low", sub: "Pupil dilation index", status: "good" },
            { label: "Confuse", value: "12%", sub: "Repeated scanning detected", status: "falling" },
            { label: "Smooth", value: "88%", sub: "Visual flow effectiveness", status: "stable" }
        ]
    },
    { 
        id: "ux", 
        label: "UI/UX Performance", 
        icon: LayoutTemplate, 
        description: "Visual hierarchy effectiveness and CTA visibility scores.",
        metrics: [
            { label: "CTA Score", value: "9.2", sub: "Visibility effectiveness", status: "rising" },
            { label: "Hierarchy", value: "Optimal", sub: "Visual flow score", status: "good" },
            { label: "Engage", value: "High", sub: "Content engagement score", status: "rising" }
        ]
    },
    { 
        id: "device", 
        label: "Device & Context", 
        icon: MonitorSmartphone, 
        description: "Behavioral changes across Desktop, Mobile, and Tablet.",
        metrics: [
            { label: "Mobile Focus", value: "Top-C", sub: "Primary mobile landing", status: "stable" },
            { label: "Screen Gap", value: "8%", sub: "Pattern diff between devices", status: "falling" },
            { label: "Res Impact", value: "Med", sub: "Resolution based differences", status: "stable" }
        ]
    }
];

const Analytics = () => {
    const [activeSection, setActiveSection] = useState("gaze");

    const currentSection = ANALYTICS_SECTIONS.find(s => s.id === activeSection);

    return (
        <div className="analytics-hub">
            <aside className="analytics-sidebar">
                <div className="sidebar-header">
                    <BarChart3 size={20} className="text-primary" />
                    <h2>Analytics Hub</h2>
                </div>
                <nav className="sidebar-nav">
                    {ANALYTICS_SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            className={`nav-btn ${activeSection === section.id ? "active" : ""}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <section.icon size={18} />
                            <span>{section.label}</span>
                            {activeSection === section.id && <ChevronRight size={14} className="ml-auto" />}
                        </button>
                    ))}
                </nav>
            </aside>

<<<<<<< HEAD
            <main className="analytics-content">
                <header className="content-header">
                    <div className="header-info">
                        <div className="icon-badge">
                            <currentSection.icon size={24} />
                        </div>
                        <div>
                            <h1>{currentSection.label}</h1>
                            <p>{currentSection.description}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="export-btn">Export Report</button>
                        <button className="time-btn">Last 30 Days</button>
                    </div>
                </header>

                <div className="metrics-grid">
                    {currentSection.metrics.map((metric, i) => (
                        <div className="metric-card" key={i}>
                            <div className="metric-header">
                                <span className="metric-label">{metric.label}</span>
                                <TrendingUp size={16} className={`status-icon ${metric.status}`} />
                            </div>
                            <div className="metric-value">{metric.value}</div>
                            <div className="metric-sub">{metric.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="visualization-area">
                    <div className="viz-card">
                        <div className="viz-header">
                            <h3>Engagement Distribution</h3>
                            <div className="viz-controls">
                                <span>Day</span>
                                <span>Week</span>
                                <span className="active">Month</span>
                            </div>
                        </div>
                        <div className="mock-chart">
                            {/* SVG Chart Placeholder */}
                            <svg width="100%" height="200" viewBox="0 0 800 200">
                                <path 
                                    d="M0,150 Q100,100 200,130 T400,80 T600,120 T800,50" 
                                    fill="none" 
                                    stroke="#b46445" 
                                    strokeWidth="3" 
                                />
                                <path 
                                    d="M0,150 Q100,100 200,130 T400,80 T600,120 T800,50 V200 H0 Z" 
                                    fill="rgba(180, 100, 69, 0.1)" 
                                />
                                <circle cx="400" cy="80" r="4" fill="#b46445" />
                                <text x="410" y="75" fill="#666" fontSize="12">Peak Interest</text>
                            </svg>
                        </div>
                    </div>

                    <div className="insight-card">
                        <div className="insight-header">
                            <AlertCircle size={18} />
                            <h3>Key Insights</h3>
                        </div>
                        <ul className="insight-list">
                            <li>Users are noticing the primary CTA {activeSection === "time" ? "faster than average (340ms)" : "consistently within the first 2 seconds"}.</li>
                            <li>The F-pattern reading style is dominant, suggesting top-left content is critical.</li>
                            <li>Significant drop-off observed after the pricing section on mobile devices.</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
