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

  console.log('Migration completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
