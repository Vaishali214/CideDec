import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { logger } from './utils/logger.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDbFile = process.env.NODE_ENV === 'production' ? '/data/database.sqlite' : 'database.sqlite';
const dbPath = path.resolve(__dirname, process.env.DATABASE_FILE || defaultDbFile);

// Ensure the parent directory of the database file exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

logger.info(`Connecting to SQLite database at: ${dbPath}`);
const db = new sqlite3.Database(dbPath);

// Enable foreign key support
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  // 1. users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. profiles
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      avatar_url TEXT,
      plan TEXT NOT NULL DEFAULT 'Free' CHECK(plan IN ('Free', 'Pro', 'Enterprise')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. discovery_answers
  db.run(`
    CREATE TABLE IF NOT EXISTS discovery_answers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 4. search_history
  db.run(`
    CREATE TABLE IF NOT EXISTS search_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      query TEXT NOT NULL,
      domain TEXT NOT NULL DEFAULT 'general',
      score INTEGER NOT NULL DEFAULT 0,
      confidence INTEGER NOT NULL DEFAULT 0,
      theme TEXT NOT NULL DEFAULT 'neutral',
      result_summary TEXT NOT NULL DEFAULT '{}',
      intelligence TEXT NOT NULL DEFAULT '{}',
      decision_dna TEXT NOT NULL DEFAULT '{}',
      ai_vs_human TEXT NOT NULL DEFAULT '{}',
      timeline TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 5. chat_sessions
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT 'New Chat',
      context_domain TEXT DEFAULT 'general',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 6. chat_messages
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      metadata TEXT NOT NULL DEFAULT '{}',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    )
  `);

  // 7. user_settings
  db.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      email_notifications INTEGER NOT NULL DEFAULT 1,
      push_notifications INTEGER NOT NULL DEFAULT 0,
      theme_preference TEXT NOT NULL DEFAULT 'light' CHECK(theme_preference IN ('light', 'dark', 'system')),
      language TEXT NOT NULL DEFAULT 'en',
      display_preferences TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 8. gamification
  db.run(`
    CREATE TABLE IF NOT EXISTS gamification (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      total_queries INTEGER NOT NULL DEFAULT 0,
      level TEXT NOT NULL DEFAULT 'beginner',
      badges TEXT NOT NULL DEFAULT '[]',
      streak INTEGER NOT NULL DEFAULT 0,
      last_query_date TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 9. ats_reports
  db.run(`
    CREATE TABLE IF NOT EXISTS ats_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      analysis_json TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 10. notifications
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'update' CHECK(type IN ('insight', 'alert', 'update', 'success')),
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 11. saved_analyses
  db.run(`
    CREATE TABLE IF NOT EXISTS saved_analyses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      query TEXT NOT NULL,
      domain TEXT NOT NULL DEFAULT 'general',
      full_result TEXT DEFAULT '{}',
      notes TEXT DEFAULT '',
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 12. refresh_tokens
  db.run(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // Indices for Query Optimization
  db.run(`CREATE INDEX IF NOT EXISTS idx_qh_user ON search_history(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_analyses(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_profile_user ON profiles(id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_ats_user ON ats_reports(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id)`);
});

// Promise wrapper helpers
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// SQL Transaction helper wrapper
export function dbTransact(callback) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) return reject(err);
        
        callback()
          .then(() => {
            db.run('COMMIT', (commitErr) => {
              if (commitErr) reject(commitErr);
              else resolve();
            });
          })
          .catch((cbErr) => {
            db.run('ROLLBACK', () => {
              reject(cbErr);
            });
          });
      });
    });
  });
}

export { db };
