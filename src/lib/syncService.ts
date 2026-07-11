import { api } from './api';

// Silent logger for sync service — no console output in production
const syncLog = {
  info: (msg: string) => { if (import.meta.env.DEV) console.info(msg); },
  warn: (msg: string) => { if (import.meta.env.DEV) console.warn(msg); },
  error: (msg: string, err?: unknown) => { if (import.meta.env.DEV) console.error(msg, err); },
};

export async function syncPendingAccounts() {
  let mockUsers: any[] = [];
  try {
    mockUsers = JSON.parse(localStorage.getItem('cidedec_mock_users') || '[]');
  } catch {
    return;
  }

  // Filter users that were created offline and are pending synchronization
  const pendingUsers = mockUsers.filter((u: any) => u.pending_sync === true);
  if (pendingUsers.length === 0) return;

  syncLog.info(`[Sync Service] Found ${pendingUsers.length} pending account(s) to synchronize.`);

  for (const user of pendingUsers) {
    let mockProfiles: any[] = [];
    try {
      mockProfiles = JSON.parse(localStorage.getItem('cidedec_mock_profiles') || '[]');
    } catch {
      continue;
    }

    const profile = mockProfiles.find((p: any) => p.id === user.id);
    const fullName = profile ? profile.full_name : (user.username || 'User');

    try {
      const { data, error } = await api.post<{ ok: boolean; token: string; user: any; profile: any }>('/auth/signup', {
        username: user.username,
        email: user.email,
        fullName,
        password: user.plain_password || 'default_offline_pass'
      });

      const isConflict = error && (
        error.includes('already exists') ||
        error.includes('duplicate') ||
        error.includes('exists')
      );

      if (!error && data) {
        syncLog.info(`[Sync Service] Successfully synchronized user ${user.email} to server.`);

        user.pending_sync = false;
        delete user.plain_password;
        if (profile) profile.pending_sync = false;

        const updatedUsers = mockUsers.map((u: any) => u.id === user.id ? user : u);
        const updatedProfiles = mockProfiles.map((p: any) => p.id === user.id ? profile : p);
        localStorage.setItem('cidedec_mock_users', JSON.stringify(updatedUsers));
        localStorage.setItem('cidedec_mock_profiles', JSON.stringify(updatedProfiles));
      } else if (isConflict) {
        syncLog.warn(`[Sync Service] User ${user.email} already exists. Clearing pending state.`);

        user.pending_sync = false;
        delete user.plain_password;
        if (profile) profile.pending_sync = false;

        const updatedUsers = mockUsers.map((u: any) => u.id === user.id ? user : u);
        const updatedProfiles = mockProfiles.map((p: any) => p.id === user.id ? profile : p);
        localStorage.setItem('cidedec_mock_users', JSON.stringify(updatedUsers));
        localStorage.setItem('cidedec_mock_profiles', JSON.stringify(updatedProfiles));
      } else {
        syncLog.error(`[Sync Service] Failed to synchronize user ${user.email}:`, error);
      }
    } catch (e) {
      syncLog.error(`[Sync Service] Network error during synchronization of ${user.email}:`, e);
    }
  }
}
