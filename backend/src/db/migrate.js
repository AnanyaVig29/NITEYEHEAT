const db = require('./database');

try {
  console.log('Starting migration...');
  
  // Check if columns already exist to avoid errors
  const tableInfoGaze = db.prepare('PRAGMA table_info(gaze_points)').all();
  const hasType = tableInfoGaze.some(col => col.name === 'type');
  
  if (!hasType) {
    db.prepare("ALTER TABLE gaze_points ADD COLUMN type TEXT DEFAULT 'gaze'").run();
    console.log('Added type to gaze_points');
  }

  const tableInfoSessions = db.prepare('PRAGMA table_info(sessions)').all();
  const hasDevice = tableInfoSessions.some(col => col.name === 'device');
  const hasUserType = tableInfoSessions.some(col => col.name === 'user_type');

  if (!hasDevice) {
    db.prepare("ALTER TABLE sessions ADD COLUMN device TEXT DEFAULT 'desktop'").run();
    console.log('Added device to sessions');
  }

  if (!hasUserType) {
    db.prepare("ALTER TABLE sessions ADD COLUMN user_type TEXT DEFAULT 'new'").run();
    console.log('Added user_type to sessions');
  }

  // Create event_log table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS event_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      ts INTEGER NOT NULL,
      metadata TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_event_session ON event_log(session_id);
    CREATE INDEX IF NOT EXISTS idx_event_type ON event_log(type);
  `);
  console.log('Ensured event_log table exists');

  console.log('Migration completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
