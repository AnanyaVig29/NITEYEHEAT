import { useState } from 'react';

async function downloadCsv(sessionId) {
  try {
    const { resolveApiBase } = await import('../utils/gazeApi');
  } catch (_) {
    // fallback handled below
  }
  // Direct fetch using the resolved base from parent (passed via prop)
  const res = await fetch(`/api/sessions/${sessionId}/csv`);
  if (!res.ok) throw new Error('CSV export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `session-${sessionId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SessionControls({
  status,
  trackingActive,
  calibrated,
  sessionId,
  pointCount,
  privacyMode,
  scanningEnabled,
  blinkCount,
  onStart,
  onStop,
  onRefreshSessions,
  onRecalibrate,
  onStartWebcam,
  onTogglePrivacyMode,
  onToggleScanning,
  onExportCsv,
}) {
  const [csvExporting, setCsvExporting] = useState(false);

  const handleCsvExport = async () => {
    if (!sessionId) return;
    setCsvExporting(true);
    try {
      if (onExportCsv) {
        await onExportCsv(sessionId);
      } else {
        await downloadCsv(sessionId);
      }
    } catch (err) {
      console.error('CSV export error:', err);
    } finally {
      setCsvExporting(false);
    }
  };

  return (
    <div className="tracker-panel">
      <div className="tracker-grid">
        <div>
          <h3>Live Eye Tracking Session</h3>
          <p>Status: <strong>{status}</strong></p>
          <p>Calibrated: <strong>{calibrated ? 'Yes' : 'No'}</strong></p>
          <p>Privacy mode: <strong>{privacyMode ? 'On' : 'Off'}</strong></p>
          <p>Gaze scanning: <strong>{scanningEnabled ? 'On' : 'Off'}</strong></p>
          <p>Points in memory: <strong>{pointCount}</strong></p>
          <p>Session ID: <strong>{sessionId ? sessionId.slice(0, 12) + '...' : 'Not started'}</strong></p>
          {blinkCount > 0 && <p>Blinks detected: <strong>{blinkCount}</strong></p>}
        </div>
        <div className="tracker-actions">
          <button
            id="btn-start-webcam"
            type="button"
            onClick={onStartWebcam}
            disabled={trackingActive}
            style={{ backgroundColor: '#10b981', color: '#fff' }}
          >
            Start Webcam
          </button>

          <button
            id="btn-toggle-privacy"
            type="button"
            onClick={onTogglePrivacyMode}
            style={{ backgroundColor: '#111827', color: '#fff' }}
          >
            {privacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
          </button>

          <button
            id="btn-start-tracking"
            type="button"
            onClick={onStart}
            disabled={trackingActive}
            style={{ backgroundColor: '#10b981', color: '#fff' }}
          >
            Start Tracking
          </button>

          <button
            id="btn-recalibrate"
            type="button"
            onClick={onRecalibrate}
            disabled={!trackingActive}
            style={{ backgroundColor: '#00ffff', color: '#000' }}
          >
            Recalibrate
          </button>

          <button
            id="btn-toggle-scanning"
            type="button"
            onClick={onToggleScanning}
            disabled={!calibrated}
            style={{ backgroundColor: scanningEnabled ? '#7c3aed' : '#4b5563', color: '#fff' }}
            title="Toggle gaze-scroll & dwell-click"
          >
            {scanningEnabled ? 'Disable Gaze Scan' : 'Enable Gaze Scan'}
          </button>

          <button
            id="btn-stop-tracking"
            type="button"
            onClick={onStop}
            disabled={!trackingActive}
            className="stop-btn"
            style={{ backgroundColor: '#ef4444', color: '#fff' }}
          >
            Stop Tracking
          </button>

          {sessionId && (
            <button
              id="btn-export-csv"
              type="button"
              onClick={handleCsvExport}
              disabled={csvExporting}
              style={{ backgroundColor: '#0ea5e9', color: '#fff' }}
              title="Download session as CSV"
            >
              {csvExporting ? 'Exporting…' : '⬇ Export CSV'}
            </button>
          )}

          <button
            id="btn-refresh-sessions"
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
