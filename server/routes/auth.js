import express from 'express';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username must be alphanumeric or underscore'),
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signinSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});

export default function createAuthRouter({ dbRun, dbGet, dbTransact, bcrypt, jwt, randomUUID, JWT_SECRET, authenticateToken, logger, auditLogger, authLimiter }) {
  const router = express.Router();

  // Helper to generate access & refresh tokens
  const generateTokens = async (userId, email) => {
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '15m' }); // Short-lived Access Token
    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    // Store in DB
    await dbRun(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
      [refreshToken, userId, expiresAt]
    );

    return { token, refreshToken };
  };

  // POST /signup
  router.post('/signup', authLimiter, async (req, res) => {
    // 1. Zod input validation
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { username, email, fullName, password } = parsed.data;

    try {
      const existingUser = await dbGet('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      const userId = randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);

      await dbTransact(async () => {
        await dbRun('INSERT INTO users (id, email, password_hash, username) VALUES (?, ?, ?, ?)', [userId, email, passwordHash, username]);
        await dbRun('INSERT INTO profiles (id, username, full_name, email, plan) VALUES (?, ?, ?, ?, ?)', [userId, username, fullName, email, 'Free']);
        await dbRun('INSERT INTO user_settings (id, user_id, email_notifications, push_notifications, theme_preference, language) VALUES (?, ?, ?, ?, ?, ?)', [randomUUID(), userId, 1, 0, 'light', 'en']);
        await dbRun('INSERT INTO gamification (id, user_id, total_score, total_queries, level, badges, streak) VALUES (?, ?, ?, ?, ?, ?, ?)', [randomUUID(), userId, 0, 0, 'beginner', JSON.stringify([]), 0]);
        await dbRun('INSERT INTO notifications (id, user_id, title, body, type, read) VALUES (?, ?, ?, ?, ?, ?)', [randomUUID(), userId, 'Welcome to CideDec!', 'Start exploring decisions with AI-powered intelligence.', 'success', 0]);
      });

      const { token, refreshToken } = await generateTokens(userId, email);
      const profile = await dbGet('SELECT * FROM profiles WHERE id = ?', [userId]);
      auditLogger.log('SIGNUP', userId, req.ip, { email, username });

      res.status(201).json({ ok: true, token, refreshToken, user: { id: userId, email }, profile });
    } catch (err) {
      logger.error('Signup error:', err);
      res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
  });

  // POST /signin
  router.post('/signin', authLimiter, async (req, res) => {
    // 1. Zod input validation
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password } = parsed.data;

    try {
      const user = await dbGet('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const { token, refreshToken } = await generateTokens(user.id, user.email);
      const profile = await dbGet('SELECT * FROM profiles WHERE id = ?', [user.id]);
      auditLogger.log('SIGNIN', user.id, req.ip, { email });

      res.json({ ok: true, token, refreshToken, user: { id: user.id, email: user.email }, profile });
    } catch (err) {
      logger.error('Signin error:', err);
      res.status(500).json({ error: 'Login failed: ' + err.message });
    }
  });

  // POST /refresh
  router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
      const storedToken = await dbGet('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
      if (!storedToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      if (new Date(storedToken.expires_at) < new Date()) {
        await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
        return res.status(403).json({ error: 'Expired refresh token' });
      }

      const user = await dbGet('SELECT * FROM users WHERE id = ?', [storedToken.user_id]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Rotate tokens (delete old refresh token, generate new tokens)
      await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      const tokens = await generateTokens(user.id, user.email);
      const profile = await dbGet('SELECT * FROM profiles WHERE id = ?', [user.id]);

      res.json({ ok: true, ...tokens, user: { id: user.id, email: user.email }, profile });
    } catch (err) {
      logger.error('Token refresh error:', err);
      res.status(500).json({ error: 'Failed to refresh token: ' + err.message });
    }
  });

  // POST /logout
  router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    try {
      if (refreshToken) {
        await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      }
      res.json({ ok: true });
    } catch (err) {
      logger.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // GET /me
  router.get('/me', authenticateToken, async (req, res) => {
    try {
      const profile = await dbGet('SELECT * FROM profiles WHERE id = ?', [req.user.id]);
      res.json({ user: req.user, profile });
    } catch (err) {
      logger.error('Auth me error:', err);
      res.status(500).json({ error: 'Failed to retrieve profile: ' + err.message });
    }
  });

  return router;
}
