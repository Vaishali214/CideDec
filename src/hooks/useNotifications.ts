import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { NotificationRow } from '../lib/database.types';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await api.get<NotificationRow[]>('/api/notifications');
    setLoading(false);
    if (!error && data) {
      setNotifications(data);
    }
  }, [userId]);

  const addNotification = useCallback(async (
    data: { title: string; body: string; type: 'insight' | 'alert' | 'update' | 'success' }
  ) => {
    if (!userId) return;

    const { data: inserted, error } = await api.post<NotificationRow>('/api/notifications', data);

    if (!error && inserted) {
      setNotifications(prev => [inserted, ...prev].slice(0, 20));
    }
  }, [userId]);

  const markAllRead = useCallback(async () => {
    if (!userId) return;

    const { error } = await api.put('/api/notifications/read-all');
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [userId]);

  const markRead = useCallback(async (id: string) => {
    const { error } = await api.put(`/api/notifications/${id}/read`);
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  }, []);

  // Fetch on mount + poll every 15 seconds to simulate real-time updates
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [userId, fetchNotifications]);

  return { notifications, unreadCount, addNotification, markAllRead, markRead, loading };
}
