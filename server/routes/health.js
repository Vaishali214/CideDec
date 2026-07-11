import express from 'express';
import { db } from '../db.js';

const router = express.Router();
const startupTime = new Date();

// GET /live -> Liveness probe
router.get('/live', (req, res) => {
  res.json({ status: 'live', timestamp: new Date().toISOString() });
});

// GET /ready -> Readiness probe
router.get('/ready', (req, res) => {
  // Check SQLite Database readiness
  db.get('SELECT 1', (err) => {
    if (err) {
      return res.status(503).json({
        status: 'not_ready',
        database: 'disconnected',
        details: err.message,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  });
});

// GET /health -> Deep health statistics
router.get('/health', (req, res) => {
  const uptimeSeconds = Math.floor((new Date().getTime() - startupTime.getTime()) / 1000);
  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'healthy',
    uptime: `${uptimeSeconds}s`,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    system: {
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      nodeVersion: process.version,
      platform: process.platform,
    }
  });
});

export default router;
