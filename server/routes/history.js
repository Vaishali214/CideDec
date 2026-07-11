import express from 'express';

export default function createHistoryRouter({ dbRun, dbGet, dbAll, randomUUID, authenticateToken, logger, auditLogger }) {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const rows = await dbAll('SELECT * FROM search_history WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
      const parsed = rows.map(r => ({
        ...r,
        result_summary: JSON.parse(r.result_summary),
        intelligence: JSON.parse(r.intelligence),
        decision_dna: JSON.parse(r.decision_dna),
        ai_vs_human: JSON.parse(r.ai_vs_human),
        timeline: JSON.parse(r.timeline)
      }));
      res.json({ data: parsed });
    } catch (err) {
      logger.error('Get history error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    const { query, domain, score, confidence, theme, result_summary, intelligence, decision_dna, ai_vs_human, timeline } = req.body;
    const id = randomUUID();
    try {
      await dbRun(
        `INSERT INTO search_history (id, user_id, query, domain, score, confidence, theme, result_summary, intelligence, decision_dna, ai_vs_human, timeline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, req.user.id, query, domain || 'general', score || 0, confidence || 0, theme || 'neutral',
          JSON.stringify(result_summary || {}), JSON.stringify(intelligence || {}), JSON.stringify(decision_dna || {}), JSON.stringify(ai_vs_human || {}), JSON.stringify(timeline || [])]
      );
      const created = await dbGet('SELECT * FROM search_history WHERE id = ?', [id]);
      auditLogger.log('SEARCH_EXECUTED', req.user.id, req.ip, { query, domain });
      // Auto-notification for high-confidence matches
      const scoreVal = Number(score) || 0;
      if (scoreVal >= 85) {
        await dbRun('INSERT INTO notifications (id, user_id, title, body, type) VALUES (?, ?, ?, ?, ?)',
          [randomUUID(), req.user.id, `Strong Career Match: ${query}`, `${scoreVal}% match found. Save this analysis to your profile.`, 'insight']
        );
      }
      res.status(201).json({ data: created });

    } catch (err) {
      logger.error('Create history error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      await dbRun('DELETE FROM search_history WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      res.json({ ok: true });
    } catch (err) {
      logger.error('Delete history error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/stats', authenticateToken, async (req, res) => {
    try {
      const rows = await dbAll('SELECT score, domain, created_at FROM search_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', [req.user.id]);
      res.json({ data: rows });
    } catch (err) {
      logger.error('Get history stats error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
