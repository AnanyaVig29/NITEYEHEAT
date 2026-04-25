import React, { useState, useEffect, useRef, useMemo } from "react";
import h337 from "heatmap.js";
import { MousePointer2, Eye, MousePointerClick, ScrollText, Info, Target, Users, Activity, Flame } from "lucide-react";
import "../styles/heatmaps.css";

const HEATMAP_TYPES = [
    { id: "gaze", label: "Gaze Heatmap", icon: Eye, description: "Shows where users look the most based on eye-tracking fixations." },
    { id: "click", label: "Click Heatmap", icon: MousePointerClick, description: "Tracks where users click or tap. Useful for conversion analysis." },
    { id: "scroll", label: "Scroll Heatmap", icon: ScrollText, description: "Shows how far users scroll down. Fades as attention drops off." },
    { id: "move", label: "Move Heatmap", icon: MousePointer2, description: "Tracks mouse movement. A reliable proxy for user attention." },
    { id: "aoi", label: "AOI Heatmap", icon: Target, description: "Focuses on specific sections (buttons, images, text) to show attention in defined regions." },
    { id: "segment", label: "Segment Heatmap", icon: Users, description: "Compares heatmaps for different user groups (e.g., Mobile vs Desktop)." },
    { id: "realtime", label: "Real-time Heatmap", icon: Activity, description: "Shows live user activity as it happens on the interface." },
    { id: "rage", label: "Rage Click Heatmap", icon: Flame, description: "Highlights repeated rapid clicks in a single area, indicating frustration." }
];

const Heatmaps = () => {
    const [activeType, setActiveType] = useState("gaze");
    const containerRef = useRef(null);
    const heatmapInstance = useRef(null);

    // Mock data generators
    const generateMockData = (type, width, height) => {
        const points = [];
        const count = type === "move" ? 150 : 60;

        if (type === "gaze") {
            // Focus on Hero title and CTA
            for (let i = 0; i < 40; i++) {
                points.push({ x: width * 0.4 + Math.random() * 100, y: height * 0.3 + Math.random() * 50, value: 8 });
                points.push({ x: width * 0.15 + Math.random() * 80, y: height * 0.7 + Math.random() * 40, value: 10 });
            }
            // Some scattered fixations
            for (let i = 0; i < 30; i++) {
                points.push({ x: Math.random() * width, y: Math.random() * height, value: Math.random() * 5 });
            }
        } else if (type === "click") {
            // Clicks on buttons and nav
            const targets = [
                { x: width * 0.15, y: height * 0.75 }, // Hero Button
                { x: width * 0.8, y: height * 0.1 },  // Nav Link 1
                { x: width * 0.9, y: height * 0.1 },  // Nav Link 2
                { x: width * 0.2, y: height * 0.5 },  // Grid Item 1
            ];
            targets.forEach(t => {
                for (let i = 0; i < 15; i++) {
                    points.push({ x: t.x + (Math.random() - 0.5) * 40, y: t.y + (Math.random() - 0.5) * 40, value: 10 });
                }
            });
        } else if (type === "move") {
            // Denser, more visible movement pattern
            let x = width * 0.1;
            let y = height * 0.2;
            for (let i = 0; i < 300; i++) {
                x += (Math.random() - 0.4) * 30; // Slightly more forward bias
                y += (Math.random() - 0.5) * 20;
                // Boundary check with bounce-back
                if (x > width) x = width - 10;
                if (x < 0) x = 10;
                if (y > height) y = height - 10;
                if (y < 0) y = 10;
                points.push({ x, y, value: 5 }); // Increased value for visibility
            }
        } else if (type === "aoi") {
            // Targeted boxes
            const regions = [
                { x: width * 0.1, y: height * 0.6, w: width * 0.3, h: height * 0.2 },
                { x: width * 0.7, y: height * 0.05, w: width * 0.25, h: height * 0.1 },
                { x: width * 0.05, y: height * 0.4, w: width * 0.35, h: height * 0.3 }
            ];
            regions.forEach(r => {
                for (let i = 0; i < 60; i++) {
                    points.push({ 
                        x: r.x + Math.random() * r.w, 
                        y: r.y + Math.random() * r.h, 
                        value: 6 
                    });
                }
            });
        } else if (type === "segment") {
            // Percentage-based segments to avoid cropping
            // Segment A: (New)
            for (let i = 0; i < 60; i++) {
                points.push({ 
                    x: width * 0.1 + Math.random() * (width * 0.3), 
                    y: height * 0.2 + Math.random() * (height * 0.4), 
                    value: 7 
                });
            }
            // Segment B: (Returning)
            for (let i = 0; i < 60; i++) {
                points.push({ 
                    x: width * 0.6 + Math.random() * (width * 0.3), 
                    y: height * 0.4 + Math.random() * (height * 0.4), 
                    value: 9 
                });
            }
        } else if (type === "rage") {
            // Intense cluster in one spot
            const spot = { x: width * 0.15, y: height * 0.75 };
            for (let i = 0; i < 100; i++) {
                points.push({ 
                    x: spot.x + (Math.random() - 0.5) * 20, 
                    y: spot.y + (Math.random() - 0.5) * 20, 
                    value: 20 
                });
            }
        }
        return points;
    };

    const initHeatmap = () => {
        if (!containerRef.current) return;

        // Clear previous
        containerRef.current.innerHTML = "";

        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;

        if (width === 0 || height === 0) {
            // Retry after a short delay if dimensions are not ready
            setTimeout(initHeatmap, 100);
            return;
        }

        const config = {
            container: containerRef.current,
            radius: activeType === "click" ? 30 : 50,
            maxOpacity: 0.7,
            minOpacity: 0,
            blur: 0.9,
        };

        // Custom gradients
        if (activeType === "gaze") {
            config.gradient = { '.3': 'blue', '.6': 'yellow', '.9': 'red' };
        } else if (activeType === "move") {
            config.gradient = { '.4': 'purple', '.7': 'blue', '.95': 'cyan' };
        } else if (activeType === "click") {
            config.gradient = { '.5': 'green', '.8': 'yellow', '.95': 'orange' };
        } else if (activeType === "rage") {
            config.gradient = { '.1': 'orange', '.5': 'red', '.9': 'black' };
            config.radius = 20;
        } else if (activeType === "aoi") {
            config.gradient = { '.4': 'lime', '.8': 'yellow', '.95': 'white' };
        } else if (activeType === "segment") {
            config.gradient = { '.2': 'blue', '.5': 'purple', '.8': 'red' };
        } else if (activeType === "realtime") {
            config.gradient = { '.3': 'cyan', '.6': 'lime', '.9': 'white' };
        }

        heatmapInstance.current = h337.create(config);

        if (activeType !== "scroll" && activeType !== "realtime") {
            const data = generateMockData(activeType, width, height);
            heatmapInstance.current.setData({
                max: activeType === "move" ? 2 : 10,
                data: data
            });
        }
    };

    // Real-time animation effect
    useEffect(() => {
        let interval;
        if (activeType === "realtime" && heatmapInstance.current) {
            interval = setInterval(() => {
                const width = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;
                heatmapInstance.current.addData({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    value: Math.random() * 5
                });
            }, 500);
        }
        return () => clearInterval(interval);
    }, [activeType]);

    useEffect(() => {
        initHeatmap();

        window.addEventListener('resize', initHeatmap);
        return () => window.removeEventListener('resize', initHeatmap);
    }, [activeType]);

    const activeInfo = useMemo(() => HEATMAP_TYPES.find(t => t.id === activeType), [activeType]);

    return (
        <div className="heatmaps-container">
            <header className="heatmaps-header">
                <div className="title-group">
                    <h1>Heatmap Analytics</h1>
                    <p style={{ marginTop: '0.5rem' }}>Visualize user engagement and interaction patterns</p>
                </div>
                <div className="heatmap-selector">
                    {HEATMAP_TYPES.map((type) => (
                        <button
                            key={type.id}
                            className={`selector-btn ${activeType === type.id ? "active" : ""}`}
                            onClick={() => setActiveType(type.id)}
                        >
                            <type.icon size={18} />
                            <span>{type.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </header >

            <div className="heatmap-main-layout">
                <div className="heatmap-viewer-card">
                    <div className="mock-page-content">
                        <div className="mock-nav">
                            <div className="mock-logo"></div>
                            <div className="mock-links">
                                <div className="mock-link"></div>
                                <div className="mock-link"></div>
                                <div className="mock-link"></div>
                            </div>
                        </div>
                        <div className="mock-hero">
                            <div className="mock-title"></div>
                            <div className="mock-subtitle"></div>
                            <div className="mock-btn"></div>
                        </div>
                        <div className="mock-grid">
                            <div className="mock-item"></div>
                            <div className="mock-item"></div>
                            <div className="mock-item"></div>
                        </div>
                    </div>

                    <div className="heatmap-overlay-container" ref={containerRef}>
                        {activeType === "scroll" && (
                            <div className="scroll-heatmap-gradient">
                                <div className="scroll-line" data-label="100% Visibility"></div>
                                <div className="scroll-line" data-label="75% Reach"></div>
                                <div className="scroll-line" data-label="50% Average Fold"></div>
                                <div className="scroll-line" data-label="25% Drop-off"></div>
                            </div>
                        )}
                        {activeType === "aoi" && (
                            <div className="aoi-overlay">
                                <div className="aoi-box" style={{top: '60%', left: '10%', width: '30%', height: '25%'}}><span>Hero Section</span></div>
                                <div className="aoi-box" style={{top: '5%', left: '70%', width: '25%', height: '10%'}}><span>Nav Menu</span></div>
                                <div className="aoi-box" style={{top: '40%', left: '5%', width: '35%', height: '35%'}}><span>Features</span></div>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="heatmap-sidebar">
                    <div className="info-card">
                        <h3><Info size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {activeInfo.label}</h3>
                        <p>{activeInfo.description}</p>

                        <div className="legend">
                            {activeType === "gaze" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'red' }}></div> <span>High Attention</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'yellow' }}></div> <span>Moderate</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'blue' }}></div> <span>Low/Scanning</span></div>
                                </>
                            )}
                            {activeType === "scroll" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'rgba(220, 38, 38, 0.6)' }}></div> <span>Hot (Above the fold)</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'rgba(37, 99, 235, 0.2)' }}></div> <span>Cold (Bottom of page)</span></div>
                                </>
                            )}
                            {activeType === "click" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'orange' }}></div> <span>Frequent Clicks</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'green' }}></div> <span>Single Interactions</span></div>
                                </>
                            )}
                            {activeType === "move" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'cyan' }}></div> <span>Path Velocity</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'purple' }}></div> <span>Dwell Areas</span></div>
                                </>
                            )}
                            {activeType === "aoi" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'white' }}></div> <span>Focus Point</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'lime' }}></div> <span>Peripheral</span></div>
                                </>
                            )}
                            {activeType === "segment" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'red' }}></div> <span>Returning Users</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'blue' }}></div> <span>New Users</span></div>
                                </>
                            )}
                            {activeType === "realtime" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'cyan' }}></div> <span>Live Interaction</span></div>
                                    <div className="pulse-dot"></div> <span style={{fontSize: '0.8rem', opacity: 0.6}}>Broadcasting Live</span>
                                </>
                            )}
                            {activeType === "rage" && (
                                <>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'black' }}></div> <span>Rage Intensity</span></div>
                                    <div className="legend-item"><div className="color-box" style={{ background: 'red' }}></div> <span>High Friction</span></div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="info-card" style={{ background: 'rgba(180, 100, 69, 0.1)', borderColor: 'rgba(180, 100, 69, 0.3)' }}>
                        <h3 style={{ color: '#4a3b32' }}>System Insight</h3>
                        <p style={{ color: '#5a4b42' }}>
                            {activeType === "gaze" && "The user's gaze is concentrated on the primary value proposition. Consider moving key features into the red zone."}
                            {activeType === "click" && "Navigation links have high engagement. Footer links are rarely clicked, suggesting poor scroll depth."}
                            {activeType === "scroll" && "Majority of users stop after the hero section. Recommend placing critical info higher up."}
                            {activeType === "move" && "Mouse movement indicates users are searching for specific information in the grid layout."}
                            {activeType === "aoi" && "High dwell time in the 'Features' block, but low clicks. Content may be too complex or button is hidden."}
                            {activeType === "segment" && "Returning users (Red) navigate directly to the dashboard, while New users (Blue) spend more time in the hero section."}
                            {activeType === "realtime" && "Currently observing active engagement on the feature grid. 12 users active now."}
                            {activeType === "rage" && "Extreme rage clicking detected on the hero CTA. Check for broken links or slow response times."}
                        </p>
                    </div>
                </aside>
            </div>
        </div >
    );
};

export default Heatmaps;
