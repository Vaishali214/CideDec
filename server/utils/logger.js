import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logDir =
  process.env.NODE_ENV === 'production'
    ? '/data/logs'
    : path.resolve(__dirname, '../logs');

// Automatically create log directory
fs.mkdirSync(logDir, { recursive: true });

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    const reqIdStr = requestId ? ` [ReqID: ${requestId}]` : '';
    const metaStr = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : '';
    return `${timestamp} [${level.toUpperCase()}]${reqIdStr}: ${message}${metaStr}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  })
];

// File logs only if directory is writable
try {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  );
} catch (err) {
  console.warn('⚠ File logging disabled:', err.message);
}

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports
});

export default logger;