import { useCallback } from 'react';
import { api } from '../lib/api';
import type { Profile, UserSettingsRow } from '../lib/database.types';

export function useProfile(userId: string | undefined) {

  const fetchProfile = useCallback(async (): Promise<Profile | null> => {
    if (!userId) return null;
    const { data, error } = await api.get<Profile>(`/api/profiles/${userId}`);
    if (error) return null;
    return data;
  }, [userId]);

  const updateProfile = useCallback(async (
    updates: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'username'>>
  ) => {
    if (!userId) return { error: 'Not authenticated' };
    const { data, error } = await api.put<Profile>(`/api/profiles/${userId}`, updates);
    return { error: error || null, data };
  }, [userId]);

  const fetchSettings = useCallback(async (): Promise<UserSettingsRow | null> => {
    if (!userId) return null;
    const { data, error } = await api.get<UserSettingsRow>('/api/settings');
    if (error) return null;
    
    // SQLite returns numbers for booleans, let's map them
    if (data) {
      return {
        ...data,
        email_notifications: !!data.email_notifications,
        push_notifications: !!data.push_notifications,
      } as any;
    }
    return null;
  }, [userId]);

  const updateSettings = useCallback(async (
    updates: Partial<Omit<UserSettingsRow, 'id' | 'user_id'>>
  ) => {
    if (!userId) return;
    await api.put('/api/settings', updates);
  }, [userId]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!userId) return { url: null, error: 'Not authenticated' };

    try {
      // For local SQLite setup, store avatar as a base64 Data URL!
      // This is simple, requires zero file storage folders, and is extremely portable.
      const url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { error } = await updateProfile({ avatar_url: url });
      if (error) return { url: null, error };

      return { url, error: null };
    } catch (err: any) {
      return { url: null, error: err.message || 'File read failed' };
    }
  }, [userId, updateProfile]);

  return { fetchProfile, updateProfile, fetchSettings, updateSettings, uploadAvatar };
}
