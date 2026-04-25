import React, { useState } from "react";
import "../styles/settings.css";
import { 
  User, 
  Eye, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Smartphone, 
  Monitor,
  Camera,
  Save,
  Trash2
} from "lucide-react";

export default function Settings() {
    const [sensitivity, setSensitivity] = useState(75);
    const [mobileSmoothing, setMobileSmoothing] = useState(true);
    const [message, setMessage] = useState("");

    const showMessage = (text) => {
        setMessage(text);
        window.setTimeout(() => setMessage(""), 2000);
    };

    return (
        <div className="settings-container">
            <header className="page-header">
                <div className="title-group">
                    <h1>Settings</h1>
                    <p>Configure your tracking engine and dashboard preferences.</p>
                </div>
                <button
                    className="save-btn"
                    onClick={() =>
                        showMessage(`Saved: Sensitivity ${sensitivity}% | Mobile Smoothing: ${mobileSmoothing ? 'On' : 'Off'}`)
                    }
                >
                    <Save size={18} /> Save Changes
                </button>
            </header>
            {message ? <p className="settings-msg">{message}</p> : null}

            <div className="settings-bento">
                {/* PROFILE SECTION */}
                <div className="settings-card profile">
                    <div className="card-header">
                        <h3><User size={18} /> Account Profile</h3>
                    </div>
                    <div className="profile-content">
                        <div className="avatar-wrapper">
                            <div className="avatar">AV</div>
                            <button className="edit-avatar"><Camera size={14} /></button>
                        </div>
                        <div className="profile-fields">
                            <div className="field">
                                <label>Full Name</label>
                                <input type="text" defaultValue="Ananya Vig" />
                            </div>
                            <div className="field">
                                <label>Email Address</label>
                                <input type="email" defaultValue="ananya@example.com" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRACKING SENSITIVITY */}
                <div className="settings-card tracking">
                    <div className="card-header">
                        <h3><Eye size={18} /> Tracking Sensitivity</h3>
                    </div>
                    <div className="tracking-content">
                        <p className="description">Adjust how aggressively fixation points are clustered into heatmaps.</p>
                        <div className="slider-group">
                            <div className="slider-labels">
                                <span>Smooth</span>
                                <span>{sensitivity}%</span>
                                <span>Granular</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={sensitivity} 
                                onChange={(e) => setSensitivity(Number(e.target.value))} 
                                className="settings-slider"
                            />
                        </div>
                        <div className="tracking-options">
                            <div className="t-option">
                                <span>Mobile Smoothing</span>
                                <label className="switch">
                                    <input type="checkbox" checked={mobileSmoothing} onChange={() => setMobileSmoothing((v) => !v)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* APPEARANCE */}
                <div className="settings-card appearance">
                    <div className="card-header">
                        <h3>{darkMode ? <Moon size={18} /> : <Sun size={18} />} Appearance</h3>
                    </div>
                    <div className="theme-toggle">
                        <button 
                            className={`theme-btn ${!darkMode ? 'active' : ''}`}
                            onClick={() => setDarkMode(false)}
                        >
                            <Sun size={16} /> Light
                        </button>
                        <button 
                            className={`theme-btn ${darkMode ? 'active' : ''}`}
                            onClick={() => setDarkMode(true)}
                        >
                            <Moon size={16} /> Dark
                        </button>
                    </div>
                </div>

                {/* SECURITY */}
                <div className="settings-card security">
                    <div className="card-header">
                        <h3><Shield size={18} /> Security</h3>
                    </div>
                    <div className="security-options">
                        <button className="sec-btn" onClick={() => showMessage("Password reset link sent.")}>Reset Password</button>
                        <button className="sec-btn" onClick={() => showMessage("Two-factor authentication setup started.")}>Two-Factor Auth</button>
                        <button className="sec-btn danger" onClick={() => showMessage("Delete account action requires confirmation flow.")}><Trash2 size={16} /> Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
