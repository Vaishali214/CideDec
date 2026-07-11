import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.resolve(__dirname, '../logs');

const auditFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const auditLoggerInstance = winston.createLogger({
  level: 'info',
  format: auditFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10
    })
  ]
});

export const auditLogger = {
  log: (action, userId, ip, details = {}) => {
    auditLoggerInstance.info({
      action,
      userId: userId || 'anonymous',
      ip: ip || 'unknown',
      details,
    });
  }
};

export default auditLogger;
