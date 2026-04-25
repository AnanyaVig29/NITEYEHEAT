import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/Navbar.css";
import "./App.css";
import "./styles/Overview.css";
import "./styles/Analytics.css";
import "./styles/Alerts.css";
import "./styles/Reports.css";
import "./styles/ABTesting.css";
import "./styles/EyeMovementPatterns.css";
import "./styles/Login.css";
import "./styles/Settings.css";

// Import pages
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import ABTesting from "./pages/ABTesting";
import EyeMovementPatterns from "./pages/EyeMovementPatterns";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(() => window.innerWidth > 1024);
  const location = useLocation();

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsNavOpen(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`app-container ${isNavOpen && !isLoginPage ? "nav-open" : "nav-closed"}`}>
      {/* MOBILE BACKDROP */}
      {isNavOpen && !isLoginPage && <div className="nav-backdrop" onClick={toggleNav}></div>}

      {!isNavOpen && !isLoginPage && (
        <button className="nav-open-btn" onClick={toggleNav} aria-label="Open Navigation">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {!isLoginPage && <Navbar isOpen={isNavOpen} toggleNav={toggleNav} />}

      <main className="main-content" style={isLoginPage ? { marginLeft: 0 } : {}}>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/overview" replace /> : <Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ab-testing" element={<ABTesting />} />
            <Route path="/eye-movement-patterns" element={<EyeMovementPatterns />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
