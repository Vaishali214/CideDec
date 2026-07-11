import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Profile } from '../lib/database.types';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SignUpData {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: true,
  });

  const fetchProfile = useCallback(async (): Promise<{ user: User; profile: Profile } | null> => {
    const token = localStorage.getItem('cidedec_token');
    if (!token) return null;

    const { data, error } = await api.get<{ user: User; profile: Profile }>('/auth/me');
    if (error || !data) {
      localStorage.removeItem('cidedec_token');
      return null;
    }
    return data;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const authData = await fetchProfile();
      if (authData) {
        setState({
          user: authData.user,
          profile: authData.profile,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setState({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    initAuth();
  }, [fetchProfile]);

  const signUp = useCallback(async (data: SignUpData) => {
    const { data: res, error } = await api.post<{ token: string; refreshToken?: string; user: User; profile: Profile }>('/auth/signup', data);

    if (error || !res) {
      return { ok: false, error: error || 'Registration failed' };
    }

    localStorage.setItem('cidedec_token', res.token);
    if (res.refreshToken) {
      localStorage.setItem('cidedec_refresh_token', res.refreshToken);
    }
    setState({
      user: res.user,
      profile: res.profile,
      isAuthenticated: true,
      loading: false,
    });

    return { ok: true, user: res.user };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    let { data: res, error } = await api.post<{ token: string; refreshToken?: string; user: User; profile: Profile }>('/auth/signin', { email, password });

    if (error === 'Invalid credentials' || error?.includes('credentials')) {
      // Check if user was registered locally in mock DB while server was offline and needs sync
      try {
        const mockUsers = JSON.parse(localStorage.getItem('cidedec_mock_users') || '[]');
        const mockUser = mockUsers.find((u: any) => u.email === email || u.username === email);
        if (mockUser && mockUser.pending_sync === true) {
          return {
            ok: false,
            error: 'This account was created offline and has not yet been synchronized. Please connect to the server and sync your account.'
          };
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to check pending sync status on signin:', err);
      }
    }

    if (error || !res) {
      return { ok: false, error: error || 'Login failed' };
    }

    localStorage.setItem('cidedec_token', res.token);
    if (res.refreshToken) {
      localStorage.setItem('cidedec_refresh_token', res.refreshToken);
    }
    setState({
      user: res.user,
      profile: res.profile,
      isAuthenticated: true,
      loading: false,
    });

    return { ok: true, user: res.user };
  }, []);

  const signOut = useCallback(async () => {
    const refreshToken = localStorage.getItem('cidedec_refresh_token');
    api.post('/auth/logout', { refreshToken }).catch(() => {}); // silent fail is fine

    localStorage.removeItem('cidedec_token');
    localStorage.removeItem('cidedec_refresh_token');
    setState({
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: false,
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    const authData = await fetchProfile();
    if (authData) {
      setState(prev => ({
        ...prev,
        user: authData.user,
        profile: authData.profile,
        isAuthenticated: true,
      }));
    }
  }, [fetchProfile]);

  return {
    user: state.user,
    profile: state.profile,
    session: state.isAuthenticated ? { access_token: 'local-token' } : null,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };
}
