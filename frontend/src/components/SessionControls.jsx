export default function SessionControls({
  status,
  trackingActive,
  calibrated,
  sessionId,
  pointCount,
  onStart,
  onStop,
  onRefreshSessions,
  onRecalibrate,
  onStartWebcam,
}) {
  return (
    <div className="tracker-panel">
      <div className="tracker-grid">
        <div>
          <h3>Live Eye Tracking Session</h3>
          <p>Status: <strong>{status}</strong></p>
          <p>Calibrated: <strong>{calibrated ? 'Yes' : 'No'}</strong></p>
          <p>Points in memory: <strong>{pointCount}</strong></p>
          <p>Session ID: <strong>{sessionId || 'Not started'}</strong></p>
        </div>
        <div className="tracker-actions">
          <button 
            type="button" 
            onClick={onStartWebcam} 
            disabled={trackingActive}
            style={{ backgroundColor: '#10b981', color: '#fff' }}
          >
            Start Webcam
          </button>
          <button 
            type="button" 
            onClick={onStart} 
            disabled={trackingActive || !calibrated}
            style={{ backgroundColor: '#10b981', color: '#fff' }}
          >
            Start Tracking
          </button>
          <button 
            type="button" 
            onClick={onRecalibrate} 
            disabled={!trackingActive}
            style={{ backgroundColor: '#00ffff', color: '#000' }}
          >
            Recalibrate
          </button>
          <button 
            type="button" 
            onClick={onStop} 
            disabled={!trackingActive} 
            className="stop-btn"
            style={{ backgroundColor: '#ef4444', color: '#fff' }}
          >
            Stop Tracking
          </button>
          <button 
            type="button" 
            onClick={onRefreshSessions}
            style={{ backgroundColor: '#64748b', color: '#fff' }}
          >
            Refresh Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
