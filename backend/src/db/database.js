const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../eyeheat.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

function createDatabase() {
  try {
    const BetterSqlite3 = require('better-sqlite3');
    return new BetterSqlite3(DB_PATH);
  } catch (error) {
    // Some local environments keep a stale native module build.
    // Fallback keeps the API online on supported Node versions.
    if (error && error.code === 'ERR_DLOPEN_FAILED') {
      console.warn(
        '[db] better-sqlite3 failed to load; falling back to node:sqlite. ' +
          'Run `npm rebuild better-sqlite3` in `backend` to restore native driver performance.'
      );
      const { DatabaseSync } = require('node:sqlite');
      return new DatabaseSync(DB_PATH);
    }
    throw error;
  }
}

const db = createDatabase();

// WAL improves read/write behavior when sessions and reports overlap.
if (typeof db.pragma === 'function') {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
} else {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
}

db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));

function getTableColumns(tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all();
}

function ensureColumn(tableName, columnName, alterSql) {
  const columns = getTableColumns(tableName);
  const exists = columns.some((col) => col.name === columnName);
  if (!exists) {
    db.exec(alterSql);
  }
}

// Keep existing DB files forward-compatible with newer schema.
ensureColumn('sessions', 'device', "ALTER TABLE sessions ADD COLUMN device TEXT DEFAULT 'desktop'");
ensureColumn('sessions', 'user_type', "ALTER TABLE sessions ADD COLUMN user_type TEXT DEFAULT 'new'");
ensureColumn('gaze_points', 'type', "ALTER TABLE gaze_points ADD COLUMN type TEXT DEFAULT 'gaze'");

module.exports = db;
