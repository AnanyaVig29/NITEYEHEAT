import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
//import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/navbar.css";
import "./App.css";
import "./styles/overview.css";
import "./styles/analytics.css";
import "./styles/alerts.css";
import "./styles/reports.css";
import "./styles/abtesting.css";
import "./styles/EyeMovementPatterns.css";
import "./styles/heatmaps.css";
//import "./styles/Login.css";
import "./styles/settings.css";

// Import pages
import Overview from "./pages/overview";
import Analytics from "./pages/analytics";
import Reports from "./pages/reports";
import Alerts from "./pages/alerts";
import ABTesting from "./pages/abtesting";
import EyeMovementPatterns from "./pages/EyeMovementPatterns";
import Heatmaps from "./pages/heatmaps";
import Sessions from "./pages/Sessions";
//import Login from "./pages/Login";
import Settings from "./pages/settings";
import BehaviorTracker from "./components/BehaviorTracker";

import "./styles/sessions.css";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(() => window.innerWidth > 1024);
  // const location = useLocation();

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsNavOpen(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Login disabled for now ---
  // const token = localStorage.getItem("token");
  // const isLoggedIn = !!token;
  // const isLoginPage = location.pathname === "/login";

  return (
    <div className={`app-container ${isNavOpen ? "nav-open" : "nav-closed"}`}>
      {/* MOBILE BACKDROP */}
      {isNavOpen && <div className="nav-backdrop" onClick={toggleNav}></div>}

      {!isNavOpen && (
        <button className="nav-open-btn" onClick={toggleNav} aria-label="Open Navigation">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      <BehaviorTracker />
      <Navbar isOpen={isNavOpen} toggleNav={toggleNav} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          {/* <Route path="/login" element={<Login />} /> */}

          {/* All routes open (login disabled) */}
          <Route path="/overview" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/heatmaps" element={<Heatmaps />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/ab-testing" element={<ABTesting />} />
          <Route path="/eye-movement-patterns" element={<EyeMovementPatterns />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

