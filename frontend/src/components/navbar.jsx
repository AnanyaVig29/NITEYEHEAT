import React from "react";
import { NavLink } from "react-router-dom";

// Simple SVG Icons
const EyeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const HeatmapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 0-5 3-5 9 0 4.5 5 7 5 11 0-4 5-6.5 5-11 0-6-5-9-5-9z" />
        <path d="M12 22c-2.5 0-3.5-2-3.5-2 0 0 1-1 3.5-3.5C14.5 19 15.5 21 15.5 21s-1 1-3.5 1z" />
    </svg>
);

const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const VideoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="m9 8 6 4-6 4Z" />
    </svg>
);

const ChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10" />
        <line x1="12" x2="12" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
);

const TestingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14s2-2 5-2 5 2 5 2" />
        <path d="M14 14s2-2 5-2 5 2 5 2" />
        <circle cx="8" cy="8" r="3" />
        <circle cx="19" cy="8" r="3" />
    </svg>
);

const ReportIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13h8" />
        <path d="M8 17h8" />
        <path d="M8 9h2" />
    </svg>
);

const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

function Navbar({ isOpen, toggleNav }) {
    return (
        <nav className={`navbar ${isOpen ? "open" : "closed"}`}>
            <div className="navbar-header">
                <button className="nav-close-btn" onClick={toggleNav} aria-label="Toggle Navigation">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
                <div className="logo-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" fill="#4a3b32" />
                    </svg>
                </div>
                <span className="logo-text">EyeHeat</span>
            </div>

            <div className="nav-menu">
                <NavLink to="/overview" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <HomeIcon /> <span>Overview</span>
                </NavLink>

                <NavLink to="/heatmaps" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <HeatmapIcon /> <span>Heatmaps</span>
                </NavLink>

                <NavLink to="/sessions" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <VideoIcon /> <span>Session Recordings</span>
                </NavLink>

                <NavLink to="/eye-movement-patterns" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <EyeIcon /> <span>Eye Tracking</span>
                </NavLink>

                <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <ChartIcon /> <span>Analytics</span>
                </NavLink>

                <NavLink to="/ab-testing" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <TestingIcon /> <span>A/B Testing</span>
                </NavLink>

                <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <ReportIcon /> <span>Reports</span>
                </NavLink>

                <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <BellIcon /> <span>Alerts</span>
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                    <SettingsIcon /> <span>Settings</span>
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
