import { useEffect, useRef } from 'react';
import { startSession, postBatch, endSession } from '../utils/gazeApi';

const BATCH_INTERVAL = 3000; // 3 seconds
const MOVE_SAMPLE_RATE = 200; // 200ms

export default function BehaviorTracker() {
    const sessionIdRef = useRef(null);
    const queueRef = useRef([]);
    const lastMoveRef = useRef(0);
    const clickHistoryRef = useRef([]); // For rage click detection

    useEffect(() => {
        const initSession = async () => {
            try {
                const { sessionId } = await startSession(window.location.href);
                sessionIdRef.current = sessionId;
                console.log('Passive session started:', sessionId);
            } catch (err) {
                console.error('Failed to start passive session:', err);
            }
        };

        initSession();

        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastMoveRef.current > MOVE_SAMPLE_RATE) {
                queueRef.current.push({
                    x: e.clientX + window.scrollX,
                    y: e.clientY + window.scrollY,
                    ts: now,
                    type: 'move'
                });
                lastMoveRef.current = now;
            }
        };

        const handleClick = (e) => {
            const now = Date.now();
            const point = {
                x: e.clientX + window.scrollX,
                y: e.clientY + window.scrollY,
                ts: now,
                type: 'click'
            };
            
            queueRef.current.push(point);

            // Rage click detection: 3 clicks within 500ms in a 50px radius
            clickHistoryRef.current.push(point);
            const recentClicks = clickHistoryRef.current.filter(c => now - c.ts < 500);
            if (recentClicks.length >= 3) {
                const first = recentClicks[0];
                const isRage = recentClicks.every(c => 
                    Math.abs(c.x - first.x) < 50 && Math.abs(c.y - first.y) < 50
                );
                if (isRage) {
                    queueRef.current.push({ ...point, type: 'rage' });
                    console.warn('Rage click detected!');
                }
            }
            // Keep history lean
            if (clickHistoryRef.current.length > 10) clickHistoryRef.current.shift();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        const interval = setInterval(async () => {
            if (sessionIdRef.current && queueRef.current.length > 0) {
                const batch = [...queueRef.current];
                queueRef.current = [];
                try {
                    await postBatch(sessionIdRef.current, batch);
                } catch (err) {
                    // Put back on failure
                    queueRef.current = [...batch, ...queueRef.current];
                }
            }
        }, BATCH_INTERVAL);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            clearInterval(interval);
            if (sessionIdRef.current) {
                endSession(sessionIdRef.current).catch(() => {});
            }
        };
    }, []);

    return null; // This component doesn't render anything
}
