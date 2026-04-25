import React, { useState } from "react";
import "../styles/EyeMovementPatterns.css";
import GazeTracker from "../components/GazeTracker";

/* ─────── SVG Pattern Illustrations ─────── */

const FPatternVisual = () => (
  <svg width="120" height="100" viewBox="0 0 80 70">
    <defs>
      <linearGradient id="fHeat1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#f87171" />
      </linearGradient>
    </defs>
    <rect x="5" y="10" width="70" height="12" rx="3" fill="url(#fHeat1)" opacity="0.9" />
    <rect x="5" y="30" width="50" height="10" rx="3" fill="#f87171" opacity="0.7" />
    <rect x="5" y="10" width="12" height="50" rx="3" fill="#fca5a5" opacity="0.5" />
    <circle cx="15" cy="16" r="4" fill="#fff" opacity="0.6" />
    <circle cx="40" cy="16" r="3" fill="#fff" opacity="0.4" />
  </svg>
);

const ZPatternVisual = () => (
  <svg width="120" height="100" viewBox="0 0 80 70">
    <path d="M10 15 H70 L10 55 H70" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
    <circle cx="15" cy="15" r="5" fill="#2563eb" />
    <circle cx="65" cy="15" r="5" fill="#2563eb" />
    <circle cx="15" cy="55" r="5" fill="#2563eb" />
    <circle cx="65" cy="55" r="5" fill="#2563eb" />
  </svg>
);

const LayerCakeVisual = () => (
  <svg width="120" height="100" viewBox="0 0 80 70">
    <rect x="5" y="10" width="70" height="8" rx="2" fill="#10b981" opacity="0.9" />
    <rect x="5" y="25" width="70" height="8" rx="2" fill="#34d399" opacity="0.7" />
    <rect x="5" y="40" width="70" height="8" rx="2" fill="#6ee7b7" opacity="0.5" />
    <rect x="5" y="55" width="70" height="8" rx="2" fill="#a7f3d0" opacity="0.3" />
  </svg>
);

const SpottedPatternVisual = () => (
  <svg width="120" height="100" viewBox="0 0 80 70">
    <circle cx="20" cy="20" r="10" fill="#8b5cf6" opacity="0.6" />
    <circle cx="55" cy="25" r="8" fill="#a78bfa" opacity="0.5" />
    <circle cx="35" cy="50" r="12" fill="#c4b5fd" opacity="0.4" />
    <circle cx="60" cy="55" r="7" fill="#ddd6fe" opacity="0.3" />
  </svg>
);

/* ─────── Donut Chart ─────── */

const DonutChart = ({ percent, label, color = "#b46445" }) => {
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="donut-wrapper">
      <svg width={size} height={size} className="donut-svg">
        <circle cx={size/2} cy={size/2} r={radius} className="donut-track" strokeWidth={strokeWidth} />
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          className="donut-fill" 
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="donut-content">
        <span className="donut-percent">{percent}%</span>
        <span className="donut-label">{label}</span>
      </div>
    </div>
  );
};

export default function EyeMovementPatterns() {
  const patterns = [
    { id: "f", title: "F Pattern", desc: "Users scan the top and left side, forming an 'F' shape. Common for text-heavy content.", Visual: FPatternVisual, usage: 65 },
    { id: "z", title: "Z Pattern", desc: "Eyes follow a 'Z' path across the page. Effective for landing pages with clear CTA.", Visual: ZPatternVisual, usage: 42 },
    { id: "cake", title: "Layer Cake", desc: "Scanning headings and skipping body text. Indicates users are looking for specific info.", Visual: LayerCakeVisual, usage: 28 },
    { id: "spot", title: "Spotted Pattern", desc: "Randomly skipping around to find visual cues. Happens when elements are disconnected.", Visual: SpottedPatternVisual, usage: 15 },
  ];

  return (
    <div className="emp-page">
      <div className="emp-header">
        <div>
          <h1 className="page-title emp-title">Eye Movement Patterns</h1>
          <p className="page-subtitle emp-subtitle">Analyze how users visually navigate your interface.</p>
        </div>
        <button className="emp-view-all-btn">View All Patterns</button>
      </div>

      <GazeTracker />

      <div className="emp-patterns-grid">
        {patterns.map((p) => (
          <div className="emp-pattern-card" key={p.id}>
            <p.Visual />
            <h3>{p.title}</h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0" }}>{p.desc}</p>
            <div style={{ width: "100%", marginTop: "auto" }}>
              <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ width: `${p.usage}%`, height: "100%", background: "#b46445" }}></div>
              </div>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{p.usage}% Prevalence</span>
            </div>
          </div>
        ))}
      </div>

      <div className="emp-stats-section">
        <h2 className="emp-section-title">Visual Engagement Overview</h2>
        <div className="emp-stats-grid">
          <div className="emp-stat-card">
            <DonutChart percent={72} label="Attention" color="#10b981" />
            <div className="emp-stat-info">
              <h4>High Engagement</h4>
              <p>72% of users follow recognized scanning patterns.</p>
            </div>
          </div>
          <div className="emp-stat-card">
            <DonutChart percent={45} label="Focus" color="#3b82f6" />
            <div className="emp-stat-info">
              <h4>Average Focus</h4>
              <p>45% dwell time on primary call-to-action areas.</p>
            </div>
          </div>
          <div className="emp-stat-card">
            <DonutChart percent={18} label="Bounce" color="#ef4444" />
            <div className="emp-stat-info">
              <h4>Visual Fatigue</h4>
              <p>18% of users exhibit 'Spotted' patterns (low clarity).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
