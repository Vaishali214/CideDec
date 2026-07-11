import express from 'express';

export default function createSavedRouter({ dbRun, dbGet, dbAll, randomUUID, authenticateToken, logger }) {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const savedRows = await dbAll('SELECT * FROM saved_analyses WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
      const parsedSaved = savedRows.map(r => ({
        ...r,
        full_result: JSON.parse(r.full_result),
        is_favorite: !!r.is_favorite
      }));
      res.json({ data: parsedSaved });
    } catch (err) {
      logger.error('Get saved error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    const { title, query, domain, full_result, notes, is_favorite } = req.body;
    const id = randomUUID();
    try {
      await dbRun(
        `INSERT INTO saved_analyses (id, user_id, title, query, domain, full_result, notes, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, req.user.id, title, query, domain || 'general', JSON.stringify(full_result || {}), notes || '', is_favorite ? 1 : 0]
      );
      const created = await dbGet('SELECT * FROM saved_analyses WHERE id = ?', [id]);
      created.full_result = JSON.parse(created.full_result);
      created.is_favorite = !!created.is_favorite;
      // Auto-notification: analysis saved
      await dbRun('INSERT INTO notifications (id, user_id, title, body, type) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), req.user.id, `Analysis Saved: ${title || query || 'Career Analysis'}`, `Your career intelligence report has been saved to your profile.`, 'success']
      );
      res.status(201).json({ data: created });
    } catch (err) {
      logger.error('Create saved error:', err);
      res.status(500).json({ error: err.message });
    }
  });


  router.put('/:id/favorite', authenticateToken, async (req, res) => {
    const { is_favorite } = req.body;
    try {
      await dbRun('UPDATE saved_analyses SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [is_favorite ? 1 : 0, req.params.id, req.user.id]);
      res.json({ ok: true });
    } catch (err) {
      logger.error('Update saved favorite error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      await dbRun('DELETE FROM saved_analyses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      res.json({ ok: true });
    } catch (err) {
      logger.error('Delete saved error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
