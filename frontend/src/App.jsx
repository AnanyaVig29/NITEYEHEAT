import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "./styles/navbar.css";
import "./App.css";
import "./styles/footer.css";
import "./styles/analytics.css";
import "./styles/abtesting.css";

// Import pages
import Overview from "./pages/overview";
// import Heatmaps from "./pages/Heatmaps";
// import Sessions from "./pages/Sessions";
// import EyeTracking from "./pages/EyeTracking";
import Analytics from "./pages/analytics";
import Reports from "./pages/reports";
import Alerts from "./pages/alerts";
import ABTesting from "./pages/abtesting";
import EyeMovementPatterns from "./pages/EyeMovementPatterns";
// import Settings from "./pages/Settings";

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ab-testing" element={<ABTesting />} />
          <Route path="/eye-movement-patterns" element={<EyeMovementPatterns />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
          {/* <Route path="/heatmaps" element={<Heatmaps />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

export default App;
