import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function backupDatabase() {
  const dbFile = env.DATABASE_FILE || 'database.sqlite';
  const dbPath = path.resolve(__dirname, '../../server', dbFile);
  const backupDir = path.resolve(__dirname, '../../server/backups');

  logger.info(`[Backup] Initiating SQLite database backup for file: ${dbPath}`);

  if (!fs.existsSync(dbPath)) {
    logger.warn(`[Backup] SQLite database file not found at ${dbPath}. Skipping backup.`);
    return;
  }

  // Create backups directory if missing
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    logger.info(`[Backup] Created backups directory at: ${backupDir}`);
  }

  const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
  const backupPath = path.join(backupDir, `database_${timestamp}.sqlite`);

  try {
    fs.copyFileSync(dbPath, backupPath);
    logger.info(`[Backup] SQLite Database successfully backed up to: ${backupPath}`);
    return backupPath;
  } catch (err) {
    logger.error('[Backup] SQLite Database backup operation failed:', err);
    throw err;
  }
}

// Enable running direct from terminal: node server/utils/backup.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  backupDatabase();
}
