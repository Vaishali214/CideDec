import express from 'express';

export default function createNotificationsRouter({ dbRun, dbGet, dbAll, randomUUID, authenticateToken, logger }) {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const rows = await dbAll('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]);
      const formatted = rows.map(r => ({ ...r, read: !!r.read }));
      res.json({ data: formatted });
    } catch (err) {
      logger.error('Get notifications error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    const { title, body, type } = req.body;
    const id = randomUUID();
    try {
      await dbRun('INSERT INTO notifications (id, user_id, title, body, type, read) VALUES (?, ?, ?, ?, ?, 0)', [id, req.user.id, title, body || '', type || 'update']);
      const created = await dbGet('SELECT * FROM notifications WHERE id = ?', [id]);
      created.read = !!created.read;
      res.status(201).json({ data: created });
    } catch (err) {
      logger.error('Create notification error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/read-all', authenticateToken, async (req, res) => {
    try {
      await dbRun('UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0', [req.user.id]);
      res.json({ ok: true });
    } catch (err) {
      logger.error('Read all notifications error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
      await dbRun('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      res.json({ ok: true });
    } catch (err) {
      logger.error('Read notification error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
