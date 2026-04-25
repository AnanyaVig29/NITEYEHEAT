import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import "./styles/navbar.css";
import "./App.css";
import "./styles/overview.css";
import "./styles/analytics.css";
import "./styles/alerts.css";
import "./styles/reports.css";
import "./styles/abtesting.css";
import "./styles/EyeMovementPatterns.css";
import "./styles/Login.css";
import "./styles/heatmaps.css";
import "./styles/Settings.css";


// Import pages
import Overview from "./pages/overview";
import Analytics from "./pages/analytics";
import Reports from "./pages/reports";
import Alerts from "./pages/alerts";
import ABTesting from "./pages/abtesting";
import EyeMovementPatterns from "./pages/EyeMovementPatterns";
import Login from "./pages/Login";
import Heatmaps from "./pages/heatmaps";
import Settings from "./pages/Settings";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

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

      <Navbar isOpen={isNavOpen} toggleNav={toggleNav} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ab-testing" element={<ABTesting />} />
          <Route path="/eye-movement-patterns" element={<EyeMovementPatterns />} />
          <Route path="/heatmaps" element={<Heatmaps />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
