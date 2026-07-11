import express from 'express';

export default function createGamificationRouter({ dbRun, dbGet, authenticateToken, logger }) {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const gami = await dbGet('SELECT * FROM gamification WHERE user_id = ?', [req.user.id]);
      if (gami) gami.badges = JSON.parse(gami.badges);
      res.json({ data: gami });
    } catch (err) {
      logger.error('Get gamification error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/', authenticateToken, async (req, res) => {
    const { total_score, total_queries, level, badges, streak, last_query_date } = req.body;
    try {
      await dbRun(
        `UPDATE gamification SET total_score = COALESCE(?, total_score), total_queries = COALESCE(?, total_queries), level = COALESCE(?, level), badges = COALESCE(?, badges), streak = COALESCE(?, streak), last_query_date = COALESCE(?, last_query_date), updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [total_score, total_queries, level, badges ? JSON.stringify(badges) : null, streak, last_query_date, req.user.id]
      );
      const updated = await dbGet('SELECT * FROM gamification WHERE user_id = ?', [req.user.id]);
      if (updated) updated.badges = JSON.parse(updated.badges);
      res.json({ data: updated });
    } catch (err) {
      logger.error('Update gamification error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
