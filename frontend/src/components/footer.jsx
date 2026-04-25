import React from "react";
import "../styles/Footer.css";

const UsersIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const TrendingIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const TargetIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const LayoutIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b46445" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="3" x2="21" y1="9" y2="9" />
        <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
);

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-features">
                <div className="footer-feature-item">
                    <div className="footer-icon">
                        <UsersIcon />
                    </div>
                    <div className="footer-feature-text">
                        <strong>Understand your users</strong>
                        <span>like never before.</span>
                    </div>
                </div>

                <div className="footer-feature-item">
                    <div className="footer-icon">
                        <TrendingIcon />
                    </div>
                    <div className="footer-feature-text">
                        <strong>Increase Engagement</strong>
                        <span>Make data-driven design decisions.</span>
                    </div>
                </div>

                <div className="footer-feature-item">
                    <div className="footer-icon">
                        <TargetIcon />
                    </div>
                    <div className="footer-feature-text">
                        <strong>Improve Conversions</strong>
                        <span>Optimize what users see and focus on.</span>
                    </div>
                </div>

                <div className="footer-feature-item">
                    <div className="footer-icon">
                        <LayoutIcon />
                    </div>
                    <div className="footer-feature-text">
                        <strong>Better User Experience</strong>
                        <span>Create effortless and engaging experiences.</span>
                    </div>
                </div>

                <div className="footer-cta">
                    <p className="footer-cta-text">Ready to see what your users see?</p>
                    <button className="footer-cta-btn">
                        Start Your Free Analysis <span>&rarr;</span>
                    </button>
                </div>
            </div>

            <div className="footer-bottom">
                <span>&copy; 2026 EyeHeat Project</span>
            </div>
        </footer>
    );
}

export default Footer;
