import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  Flame, 
  Video, 
  Eye, 
  BarChart3, 
  Split, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Navbar({ isOpen, toggleNav }) {
    const navigate = useNavigate();
    const collapseOnMobile = () => {
        if (window.innerWidth <= 1024 && isOpen) {
            toggleNav();
        }
    };

    const handleSignOut = () => {
        // Simple mock sign out
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className={`navbar ${isOpen ? "open" : "closed"}`}>
            <div className="navbar-header">
                <div className="logo-group">
                    <div className="logo-icon">
                        <Eye size={24} color="#3b82f6" />
                    </div>
                    <span className="logo-text">EyeHeat</span>
                </div>
                <button className="nav-toggle-btn" onClick={toggleNav}>
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <div className="nav-menu">
                <div className="nav-section">
                    <span className="section-title">Core</span>
                    <NavLink to="/overview" end onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Home size={20} /> <span>Overview</span>
                    </NavLink>
                    <NavLink to="/heatmaps" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Flame size={20} /> <span>Heatmaps</span>
                    </NavLink>
                    <NavLink to="/sessions" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Video size={20} /> <span>Recordings</span>
                    </NavLink>
                </div>

                <div className="nav-section">
                    <span className="section-title">Behavior</span>
                    <NavLink to="/eye-movement-patterns" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Eye size={20} /> <span>Eye Tracking</span>
                    </NavLink>
                    <NavLink to="/analytics" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <BarChart3 size={20} /> <span>Analytics</span>
                    </NavLink>
                    <NavLink to="/ab-testing" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Split size={20} /> <span>A/B Testing</span>
                    </NavLink>
                </div>

                <div className="nav-section">
                    <span className="section-title">System</span>
                    <NavLink to="/reports" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <FileText size={20} /> <span>Reports</span>
                    </NavLink>
                    <NavLink to="/alerts" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Bell size={20} /> <span>Alerts</span>
                    </NavLink>
                    <NavLink to="/settings" onClick={collapseOnMobile} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        <Settings size={20} /> <span>Settings</span>
                    </NavLink>
                </div>
            </div>

            <div className="navbar-footer">
                <button className="nav-item sign-out" onClick={handleSignOut}>
                    <LogOut size={20} /> <span>Sign Out</span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
