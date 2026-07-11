// Client-side local storage database fallback engine.
// Mocks the backend server REST API when localhost:3001 is offline or unreachable.

function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'uuid_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// LocalStorage keys
const keys = {
  users: 'cidedec_mock_users',
  profiles: 'cidedec_mock_profiles',
  settings: 'cidedec_mock_settings',
  gamification: 'cidedec_mock_gamification',
  notifications: 'cidedec_mock_notifications',
  history: 'cidedec_mock_history',
  saved: 'cidedec_mock_saved',
  chats: 'cidedec_mock_chats',
  messages: 'cidedec_mock_messages',
  discovery: 'cidedec_mock_discovery',
  ats: 'cidedec_mock_ats',
};

function getList<T>(key: string): T[] {
  const item = localStorage.getItem(key);
  if (!item) return [];
  try {
    return JSON.parse(item);
  } catch {
    return [];
  }
}

function setList<T>(key: string, list: T[]): void {
  localStorage.setItem(key, JSON.stringify(list));
}

// Helper to extract userId from mock token
function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  if (token.startsWith('mock_token_')) {
    return token.replace('mock_token_', '');
  }
  return null;
}

export class MockApiService {
  private getActiveUserId(): string | null {
    const token = localStorage.getItem('cidedec_token');
    return getUserIdFromToken(token);
  }

  public handleRequest(
    method: string,
    path: string,
    body: any
  ): { data: any | null; error: string | null } {
    // Mock API fallback - silent in production

    const userId = this.getActiveUserId();

    // ════════════════ AUTHENTICATION ROUTES ════════════════

    if (path === '/auth/signup' && method === 'POST') {
      const { username, email, fullName, password } = body;
      if (!username || !email || !fullName || !password) {
        return { data: null, error: 'All fields are required' };
      }

      const users = getList<any>(keys.users);
      if (users.some(u => u.email === email || u.username === username)) {
        return { data: null, error: 'Username or email already exists' };
      }

      const newUserId = uuid();
      const newUser = { 
        id: newUserId, 
        email, 
        username, 
        password_hash: 'mock_hash',
        pending_sync: true,
        plain_password: password
      };
      users.push(newUser);
      setList(keys.users, users);

      // Create profile
      const profiles = getList<any>(keys.profiles);
      const newProfile = {
        id: newUserId,
        username,
        full_name: fullName,
        email,
        avatar_url: null,
        plan: 'Free',
        pending_sync: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      profiles.push(newProfile);
      setList(keys.profiles, profiles);

      // Create settings
      const settings = getList<any>(keys.settings);
      settings.push({
        id: uuid(),
        user_id: newUserId,
        email_notifications: 1,
        push_notifications: 0,
        theme_preference: 'light',
        language: 'en',
        display_preferences: '{}',
        updated_at: new Date().toISOString(),
      });
      setList(keys.settings, settings);

      // Create gamification
      const gamification = getList<any>(keys.gamification);
      gamification.push({
        id: uuid(),
        user_id: newUserId,
        total_score: 0,
        total_queries: 0,
        level: 'beginner',
        badges: JSON.stringify([]),
        streak: 0,
        last_query_date: null,
        updated_at: new Date().toISOString(),
      });
      setList(keys.gamification, gamification);

      // Welcome notification
      const notifications = getList<any>(keys.notifications);
      notifications.push({
        id: uuid(),
        user_id: newUserId,
        title: 'Welcome to CideDec!',
        body: 'Start exploring decisions with AI-powered intelligence. Try searching for "3-year ROI forecast" or "How to become a doctor".',
        type: 'success',
        read: 0,
        created_at: new Date().toISOString(),
      });
      setList(keys.notifications, notifications);

      const token = `mock_token_${newUserId}`;
      return {
        data: {
          ok: true,
          token,
          user: { id: newUserId, email },
          profile: newProfile,
        },
        error: null,
      };
    }

    if (path === '/auth/signin' && method === 'POST') {
      const { email, password } = body;
      if (!email || !password) {
        return { data: null, error: 'Email/username and password are required' };
      }

      const users = getList<any>(keys.users);
      const user = users.find(u => u.email === email || u.username === email);
      if (!user) {
        return { data: null, error: 'Invalid credentials' };
      }

      // Password matches simulated mock login
      const profiles = getList<any>(keys.profiles);
      const profile = profiles.find(p => p.id === user.id) || null;
      const token = `mock_token_${user.id}`;

      return {
        data: {
          ok: true,
          token,
          user: { id: user.id, email: user.email },
          profile,
        },
        error: null,
      };
    }

    if (path === '/auth/me' && method === 'GET') {
      if (!userId) {
        return { data: null, error: 'Access token missing' };
      }
      const users = getList<any>(keys.users);
      const user = users.find(u => u.id === userId);
      if (!user) {
        return { data: null, error: 'Session expired' };
      }
      const profiles = getList<any>(keys.profiles);
      const profile = profiles.find(p => p.id === userId) || null;

      return {
        data: {
          user: { id: userId, email: user.email },
          profile,
        },
        error: null,
      };
    }

    // Ensure user is validated for protected routes
    if (!userId) {
      return { data: null, error: 'Access token missing or invalid' };
    }

    // ════════════════ PROFILE & SETTINGS ROUTES ════════════════

    if (path.startsWith('/api/profiles/') && method === 'GET') {
      const targetId = path.split('/api/profiles/')[1];
      const profiles = getList<any>(keys.profiles);
      const profile = profiles.find(p => p.id === targetId) || null;
      return { data: profile, error: null };
    }

    if (path.startsWith('/api/profiles/') && method === 'PUT') {
      const targetId = path.split('/api/profiles/')[1];
      if (userId !== targetId) return { data: null, error: 'Forbidden' };

      const { full_name, avatar_url, username } = body;
      const profiles = getList<any>(keys.profiles);
      const idx = profiles.findIndex(p => p.id === targetId);

      if (idx !== -1) {
        if (full_name !== undefined) profiles[idx].full_name = full_name;
        if (avatar_url !== undefined) profiles[idx].avatar_url = avatar_url;
        if (username !== undefined) profiles[idx].username = username;
        profiles[idx].updated_at = new Date().toISOString();
        setList(keys.profiles, profiles);
        return { data: profiles[idx], error: null };
      }
      return { data: null, error: 'Profile not found' };
    }

    if (path === '/api/settings' && method === 'GET') {
      const settingsList = getList<any>(keys.settings);
      let settings = settingsList.find(s => s.user_id === userId);
      if (!settings) {
        settings = {
          id: uuid(),
          user_id: userId,
          email_notifications: 1,
          push_notifications: 0,
          theme_preference: 'light',
          language: 'en',
          display_preferences: '{}',
          updated_at: new Date().toISOString(),
        };
        settingsList.push(settings);
        setList(keys.settings, settingsList);
      }
      return { data: settings, error: null };
    }

    if (path === '/api/settings' && method === 'PUT') {
      const { email_notifications, push_notifications, theme_preference, language, display_preferences } = body;
      const settingsList = getList<any>(keys.settings);
      const idx = settingsList.findIndex(s => s.user_id === userId);

      if (idx !== -1) {
        if (email_notifications !== undefined) settingsList[idx].email_notifications = email_notifications ? 1 : 0;
        if (push_notifications !== undefined) settingsList[idx].push_notifications = push_notifications ? 1 : 0;
        if (theme_preference !== undefined) settingsList[idx].theme_preference = theme_preference;
        if (language !== undefined) settingsList[idx].language = language;
        if (display_preferences !== undefined) settingsList[idx].display_preferences = JSON.stringify(display_preferences);
        settingsList[idx].updated_at = new Date().toISOString();
        setList(keys.settings, settingsList);
        return { data: settingsList[idx], error: null };
      }
      return { data: null, error: 'Settings not found' };
    }

    // ════════════════ GAMIFICATION ROUTES ════════════════

    if (path === '/api/gamification' && method === 'GET') {
      const gamifications = getList<any>(keys.gamification);
      let g = gamifications.find(g => g.user_id === userId);
      if (!g) {
        g = {
          id: uuid(),
          user_id: userId,
          total_score: 0,
          total_queries: 0,
          level: 'beginner',
          badges: JSON.stringify([]),
          streak: 0,
          last_query_date: null,
          updated_at: new Date().toISOString(),
        };
        gamifications.push(g);
        setList(keys.gamification, gamifications);
      }
      return { data: g, error: null };
    }

    if (path === '/api/gamification' && method === 'PUT') {
      const { total_score, total_queries, level, badges, streak, last_query_date } = body;
      const gamifications = getList<any>(keys.gamification);
      const idx = gamifications.findIndex(g => g.user_id === userId);

      if (idx !== -1) {
        if (total_score !== undefined) gamifications[idx].total_score = total_score;
        if (total_queries !== undefined) gamifications[idx].total_queries = total_queries;
        if (level !== undefined) gamifications[idx].level = level;
        if (badges !== undefined) gamifications[idx].badges = typeof badges === 'string' ? badges : JSON.stringify(badges);
        if (streak !== undefined) gamifications[idx].streak = streak;
        if (last_query_date !== undefined) gamifications[idx].last_query_date = last_query_date;
        gamifications[idx].updated_at = new Date().toISOString();
        setList(keys.gamification, gamifications);
        return { data: gamifications[idx], error: null };
      }
      return { data: null, error: 'Gamification row not found' };
    }

    // ════════════════ NOTIFICATIONS ROUTES ════════════════

    if (path === '/api/notifications' && method === 'GET') {
      const list = getList<any>(keys.notifications)
        .filter(n => n.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20);
      const formatted = list.map(r => ({ ...r, read: !!r.read }));
      return { data: formatted, error: null };
    }

    if (path === '/api/notifications' && method === 'POST') {
      const { title, body: notifBody, type } = body;
      const notifications = getList<any>(keys.notifications);
      const id = uuid();
      const newNotif = {
        id,
        user_id: userId,
        title,
        body: notifBody || '',
        type: type || 'update',
        read: 0,
        created_at: new Date().toISOString(),
      };
      notifications.push(newNotif);
      setList(keys.notifications, notifications);
      return { data: { ...newNotif, read: false }, error: null };
    }

    if (path === '/api/notifications/read-all' && method === 'PUT') {
      const notifications = getList<any>(keys.notifications);
      notifications.forEach(n => {
        if (n.user_id === userId) n.read = 1;
      });
      setList(keys.notifications, notifications);
      return { data: { ok: true }, error: null };
    }

    if (path.startsWith('/api/notifications/') && path.endsWith('/read') && method === 'PUT') {
      const id = path.split('/api/notifications/')[1].split('/read')[0];
      const notifications = getList<any>(keys.notifications);
      const idx = notifications.findIndex(n => n.id === id && n.user_id === userId);
      if (idx !== -1) {
        notifications[idx].read = 1;
        setList(keys.notifications, notifications);
        return { data: { ok: true }, error: null };
      }
      return { data: null, error: 'Notification not found' };
    }

    // ════════════════ SEARCH HISTORY ROUTES ════════════════

    if (path === '/api/history' && method === 'GET') {
      const list = getList<any>(keys.history)
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      const parsed = list.map(r => ({
        ...r,
        result_summary: typeof r.result_summary === 'string' ? JSON.parse(r.result_summary) : r.result_summary,
        intelligence: typeof r.intelligence === 'string' ? JSON.parse(r.intelligence) : r.intelligence,
        decision_dna: typeof r.decision_dna === 'string' ? JSON.parse(r.decision_dna) : r.decision_dna,
        ai_vs_human: typeof r.ai_vs_human === 'string' ? JSON.parse(r.ai_vs_human) : r.ai_vs_human,
        timeline: typeof r.timeline === 'string' ? JSON.parse(r.timeline) : r.timeline
      }));
      return { data: parsed, error: null };
    }

    if (path === '/api/history' && method === 'POST') {
      const history = getList<any>(keys.history);
      const id = uuid();
      const newHistory = {
        id,
        user_id: userId,
        query: body.query,
        domain: body.domain || 'general',
        score: body.score || 0,
        confidence: body.confidence || 0,
        theme: body.theme || 'neutral',
        result_summary: typeof body.result_summary === 'string' ? body.result_summary : JSON.stringify(body.result_summary || {}),
        intelligence: typeof body.intelligence === 'string' ? body.intelligence : JSON.stringify(body.intelligence || {}),
        decision_dna: typeof body.decision_dna === 'string' ? body.decision_dna : JSON.stringify(body.decision_dna || {}),
        ai_vs_human: typeof body.ai_vs_human === 'string' ? body.ai_vs_human : JSON.stringify(body.ai_vs_human || {}),
        timeline: typeof body.timeline === 'string' ? body.timeline : JSON.stringify(body.timeline || []),
        created_at: new Date().toISOString()
      };
      history.push(newHistory);
      setList(keys.history, history);
      return { data: newHistory, error: null };
    }

    if (path.startsWith('/api/history/') && method === 'DELETE') {
      const id = path.split('/api/history/')[1];
      const history = getList<any>(keys.history);
      const filtered = history.filter(h => !(h.id === id && h.user_id === userId));
      setList(keys.history, filtered);
      return { data: { ok: true }, error: null };
    }

    // ════════════════ SAVED ANALYSES (BOOKMARKS) ════════════════

    if (path === '/api/saved' && method === 'GET') {
      const saved = getList<any>(keys.saved)
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const parsed = saved.map(r => ({
        ...r,
        full_result: typeof r.full_result === 'string' ? JSON.parse(r.full_result) : r.full_result,
        is_favorite: !!r.is_favorite
      }));
      return { data: parsed, error: null };
    }

    if (path === '/api/saved' && method === 'POST') {
      const saved = getList<any>(keys.saved);
      const id = uuid();
      const newSaved = {
        id,
        user_id: userId,
        title: body.title,
        query: body.query,
        domain: body.domain || 'general',
        full_result: typeof body.full_result === 'string' ? body.full_result : JSON.stringify(body.full_result || {}),
        notes: body.notes || '',
        is_favorite: body.is_favorite ? 1 : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      saved.push(newSaved);
      setList(keys.saved, saved);
      return { data: { ...newSaved, full_result: JSON.parse(newSaved.full_result), is_favorite: !!newSaved.is_favorite }, error: null };
    }

    if (path.startsWith('/api/saved/') && path.endsWith('/favorite') && method === 'PUT') {
      const id = path.split('/api/saved/')[1].split('/favorite')[0];
      const saved = getList<any>(keys.saved);
      const idx = saved.findIndex(s => s.id === id && s.user_id === userId);
      if (idx !== -1) {
        saved[idx].is_favorite = body.is_favorite ? 1 : 0;
        saved[idx].updated_at = new Date().toISOString();
        setList(keys.saved, saved);
        return { data: { ok: true }, error: null };
      }
      return { data: null, error: 'Saved item not found' };
    }

    if (path.startsWith('/api/saved/') && method === 'DELETE') {
      const id = path.split('/api/saved/')[1];
      const saved = getList<any>(keys.saved);
      const filtered = saved.filter(s => !(s.id === id && s.user_id === userId));
      setList(keys.saved, filtered);
      return { data: { ok: true }, error: null };
    }

    // ════════════════ CHAT SESSIONS & MESSAGES ════════════════

    if (path === '/api/chats' && method === 'GET') {
      const chats = getList<any>(keys.chats)
        .filter(c => c.user_id === userId)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      return { data: chats, error: null };
    }

    if (path === '/api/chats' && method === 'POST') {
      const chats = getList<any>(keys.chats);
      const id = uuid();
      const newChat = {
        id,
        user_id: userId,
        title: body.title || 'New Chat',
        context_domain: body.context_domain || 'general',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      chats.push(newChat);
      setList(keys.chats, chats);
      return { data: newChat, error: null };
    }

    if (path.startsWith('/api/chats/') && method === 'DELETE') {
      const id = path.split('/api/chats/')[1];
      const chats = getList<any>(keys.chats);
      const filtered = chats.filter(c => !(c.id === id && c.user_id === userId));
      setList(keys.chats, filtered);

      // Cascading delete messages
      const messages = getList<any>(keys.messages);
      const filteredMessages = messages.filter(m => m.session_id !== id);
      setList(keys.messages, filteredMessages);

      return { data: { ok: true }, error: null };
    }

    if (path.startsWith('/api/chats/') && path.endsWith('/messages') && method === 'GET') {
      const sessionId = path.split('/api/chats/')[1].split('/messages')[0];
      const chats = getList<any>(keys.chats);
      const session = chats.find(c => c.id === sessionId && c.user_id === userId);
      if (!session) return { data: null, error: 'Chat session not found' };

      const messages = getList<any>(keys.messages)
        .filter(m => m.session_id === sessionId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      const parsed = messages.map(r => ({
        ...r,
        metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata
      }));
      return { data: parsed, error: null };
    }

    if (path.startsWith('/api/chats/') && path.endsWith('/messages') && method === 'POST') {
      const sessionId = path.split('/api/chats/')[1].split('/messages')[0];
      const chats = getList<any>(keys.chats);
      const sessionIdx = chats.findIndex(c => c.id === sessionId && c.user_id === userId);
      if (sessionIdx === -1) return { data: null, error: 'Chat session not found' };

      const messages = getList<any>(keys.messages);
      const id = uuid();
      const newMessage = {
        id,
        session_id: sessionId,
        role: body.role,
        content: body.content,
        metadata: typeof body.metadata === 'string' ? body.metadata : JSON.stringify(body.metadata || {}),
        created_at: new Date().toISOString()
      };
      messages.push(newMessage);
      setList(keys.messages, messages);

      let updatedTitle = chats[sessionIdx].title;
      if (chats[sessionIdx].title === 'New Chat' && body.role === 'user') {
        updatedTitle = body.content.length > 50 ? body.content.slice(0, 50) + '...' : body.content;
        chats[sessionIdx].title = updatedTitle;
      }
      chats[sessionIdx].updated_at = new Date().toISOString();
      setList(keys.chats, chats);

      return {
        data: {
          data: { ...newMessage, metadata: JSON.parse(newMessage.metadata) },
          sessionTitle: updatedTitle
        },
        error: null,
      };
    }

    // ════════════════ DISCOVERY & ATS REPORTS ════════════════

    if (path === '/api/discovery' && method === 'GET') {
      const list = getList<any>(keys.discovery)
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const parsed = list.map(r => ({
        ...r,
        answers: typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : r.answers_json
      }));
      return { data: parsed, error: null };
    }

    if (path === '/api/discovery' && method === 'POST') {
      const list = getList<any>(keys.discovery);
      const id = uuid();
      const newDisc = {
        id,
        user_id: userId,
        answers_json: typeof body.answers === 'string' ? body.answers : JSON.stringify(body.answers || {}),
        created_at: new Date().toISOString()
      };
      list.push(newDisc);
      setList(keys.discovery, list);
      return { data: { ...newDisc, answers: JSON.parse(newDisc.answers_json) }, error: null };
    }

    if (path === '/api/ats' && method === 'GET') {
      const list = getList<any>(keys.ats)
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const parsed = list.map(r => ({
        ...r,
        analysis: typeof r.analysis_json === 'string' ? JSON.parse(r.analysis_json) : r.analysis_json
      }));
      return { data: parsed, error: null };
    }

    if (path === '/api/ats' && method === 'POST') {
      const list = getList<any>(keys.ats);
      const id = uuid();
      const newATS = {
        id,
        user_id: userId,
        file_name: body.file_name,
        score: body.score || 0,
        analysis_json: typeof body.analysis === 'string' ? body.analysis : JSON.stringify(body.analysis || {}),
        created_at: new Date().toISOString()
      };
      list.push(newATS);
      setList(keys.ats, list);
      return { data: { ...newATS, analysis: JSON.parse(newATS.analysis_json) }, error: null };
    }

    return { data: null, error: `Route not mocked: ${method} ${path}` };
  }
}

export const mockApi = new MockApiService();
