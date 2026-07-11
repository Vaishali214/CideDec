import express from 'express';

export default function createChatsRouter({ dbRun, dbGet, dbAll, randomUUID, authenticateToken, logger }) {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const rows = await dbAll('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
      res.json({ data: rows });
    } catch (err) {
      logger.error('Get chats error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    const { title, context_domain } = req.body;
    const id = randomUUID();
    try {
      await dbRun('INSERT INTO chat_sessions (id, user_id, title, context_domain) VALUES (?, ?, ?, ?)', [id, req.user.id, title || 'New Chat', context_domain || 'general']);
      const created = await dbGet('SELECT * FROM chat_sessions WHERE id = ?', [id]);
      res.status(201).json({ data: created });
    } catch (err) {
      logger.error('Create chat error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      await dbRun('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      res.json({ ok: true });
    } catch (err) {
      logger.error('Delete chat error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:sessionId/messages', authenticateToken, async (req, res) => {
    try {
      const session = await dbGet('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', [req.params.sessionId, req.user.id]);
      if (!session) return res.status(404).json({ error: 'Chat session not found' });
      const rows = await dbAll('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC', [req.params.sessionId]);
      const parsed = rows.map(r => ({ ...r, metadata: JSON.parse(r.metadata) }));
      res.json({ data: parsed });
    } catch (err) {
      logger.error('Get chat messages error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/:sessionId/messages', authenticateToken, async (req, res) => {
    const { role, content, metadata } = req.body;
    const id = randomUUID();
    try {
      const session = await dbGet('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', [req.params.sessionId, req.user.id]);
      if (!session) return res.status(404).json({ error: 'Chat session not found' });

      await dbRun('INSERT INTO chat_messages (id, session_id, role, content, metadata) VALUES (?, ?, ?, ?, ?)', [id, req.params.sessionId, role, content, JSON.stringify(metadata || {})]);

      let updatedTitle = session.title;
      if (session.title === 'New Chat' && role === 'user') {
        updatedTitle = content.length > 50 ? content.slice(0, 50) + '...' : content;
        await dbRun('UPDATE chat_sessions SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [updatedTitle, req.params.sessionId]);
      } else {
        await dbRun('UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.sessionId]);
      }

      const created = await dbGet('SELECT * FROM chat_messages WHERE id = ?', [id]);
      created.metadata = JSON.parse(created.metadata);
      res.status(201).json({ data: created, sessionTitle: updatedTitle });
    } catch (err) {
      logger.error('Create chat message error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
