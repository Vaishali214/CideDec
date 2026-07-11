import express from 'express';

export default function createProfilesRouter({ dbRun, dbGet, authenticateToken, logger, auditLogger }) {
  const router = express.Router();

  // GET /:userId
  router.get('/:userId', authenticateToken, async (req, res) => {
    try {
      const profile = await dbGet('SELECT * FROM profiles WHERE id = ?', [req.params.userId]);
      res.json({ data: profile });
    } catch (err) {
      logger.error('Get profile error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /:userId
  router.put('/:userId', authenticateToken, async (req, res) => {
    const { full_name, avatar_url, username } = req.body;
    try {
      if (req.user.id !== req.params.userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      await dbRun(
        `UPDATE profiles SET full_name = COALESCE(?, full_name), avatar_url = COALESCE(?, avatar_url), username = COALESCE(?, username), updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [full_name, avatar_url, username, req.user.id]
      );
      const updated = await dbGet('SELECT * FROM profiles WHERE id = ?', [req.user.id]);
      auditLogger.log('PROFILE_UPDATE', req.user.id, req.ip, { full_name, username });
      res.json({ data: updated });
    } catch (err) {
      logger.error('Update profile error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
