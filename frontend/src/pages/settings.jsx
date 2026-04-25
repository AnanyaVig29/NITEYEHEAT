import React, { useState } from "react";
import "../styles/settings.css";

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    theme: "light",
    autoSave: true,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your preferences and account settings</p>
      </div>

      <div className="settings-grid">
        {/* General Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <SettingsIcon />
            <h2 className="settings-card-title">General Settings</h2>
          </div>
          <div className="settings-option">
            <div className="option-label">
              <span className="option-title">Theme</span>
              <span className="option-description">Choose your preferred appearance</span>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="settings-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="settings-option">
            <div className="option-label">
              <span className="option-title">Auto Save</span>
              <span className="option-description">Automatically save changes</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={() => handleToggle("autoSave")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <div className="settings-card-header">
            <BellIcon />
            <h2 className="settings-card-title">Notifications</h2>
          </div>
          <div className="settings-option">
            <div className="option-label">
              <span className="option-title">Push Notifications</span>
              <span className="option-description">Receive browser notifications</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-option">
            <div className="option-label">
              <span className="option-title">Email Alerts</span>
              <span className="option-description">Receive alerts via email</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => handleToggle("emailAlerts")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <div className="settings-card-header">
            <LockIcon />
            <h2 className="settings-card-title">Security</h2>
          </div>
          <div className="settings-option">
            <button className="btn-primary">Change Password</button>
          </div>
          <div className="settings-option">
            <button className="btn-secondary">Enable Two-Factor Authentication</button>
          </div>
          <div className="settings-option">
            <button className="btn-danger">Sign Out All Sessions</button>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-save">Save Changes</button>
        <button className="btn-cancel">Cancel</button>
      </div>
    </div>
  );
}

export default Settings;
