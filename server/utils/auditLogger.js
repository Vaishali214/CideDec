import winston from 'winston';

const auditFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [
  new winston.transports.Console()
];

export const auditLoggerInstance = winston.createLogger({
  level: 'info',
  format: auditFormat,
  transports
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