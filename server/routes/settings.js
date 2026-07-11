import express from 'express';

export default function createSettingsRouter({ dbRun, dbGet, authenticateToken, logger }) {
  const router = express.Router();

  router.get('/', authenticateToken, async (req, res) => {
    try {
      const settings = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [req.user.id]);
      res.json({ data: settings });
    } catch (err) {
      logger.error('Get settings error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/', authenticateToken, async (req, res) => {
    const { email_notifications, push_notifications, theme_preference, language, display_preferences } = req.body;
    try {
      await dbRun(
        `UPDATE user_settings SET email_notifications = COALESCE(?, email_notifications), push_notifications = COALESCE(?, push_notifications), theme_preference = COALESCE(?, theme_preference), language = COALESCE(?, language), display_preferences = COALESCE(?, display_preferences), updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [
          email_notifications !== undefined ? (email_notifications ? 1 : 0) : null,
          push_notifications !== undefined ? (push_notifications ? 1 : 0) : null,
          theme_preference, language,
          display_preferences ? JSON.stringify(display_preferences) : null,
          req.user.id
        ]
      );
      const updated = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [req.user.id]);
      res.json({ data: updated });
    } catch (err) {
      logger.error('Update settings error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
