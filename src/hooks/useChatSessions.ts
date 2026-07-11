import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { ChatSessionRow, ChatMessageRow } from '../lib/database.types';

export function useChatSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<ChatSessionRow[]>([]);
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!userId) return;
    const { data } = await api.get<{ data: ChatSessionRow[] }>('/api/chats');
    if (data) setSessions((data as any).data ?? []);
  }, [userId]);

  const createSession = useCallback(async (domain = 'general') => {
    if (!userId) return null;
    const { data } = await api.post<{ data: ChatSessionRow }>('/api/chats', {
      title: 'New Chat',
      context_domain: domain,
    });
    if (!data) return null;
    const session = (data as any).data as ChatSessionRow;
    setSessions(prev => [session, ...prev]);
    setActiveSession(session.id);
    setMessages([]);
    return session;
  }, [userId]);

  const fetchMessages = useCallback(async (sessionId: string) => {
    const { data } = await api.get<{ data: ChatMessageRow[] }>(`/api/chats/${sessionId}/messages`);
    if (data) {
      setMessages((data as any).data ?? []);
      setActiveSession(sessionId);
    }
  }, []);

  const sendMessage = useCallback(async (sessionId: string, content: string) => {
    const { data } = await api.post<{ data: ChatMessageRow; sessionTitle: string }>(
      `/api/chats/${sessionId}/messages`,
      { role: 'user', content }
    );
    if (data) {
      const msg = (data as any).data as ChatMessageRow;
      setMessages(prev => [...prev, msg]);
      const newTitle = (data as any).sessionTitle;
      if (newTitle) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));
      }
      return msg;
    }
    return null;
  }, []);

  const saveAssistantMessage = useCallback(async (
    sessionId: string,
    content: string,
    metadata: Record<string, unknown> = {}
  ) => {
    const { data } = await api.post<{ data: ChatMessageRow }>(
      `/api/chats/${sessionId}/messages`,
      { role: 'assistant', content, metadata }
    );
    if (data) {
      setMessages(prev => [...prev, (data as any).data as ChatMessageRow]);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    await api.delete(`/api/chats/${sessionId}`);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
  }, [activeSession]);

  return {
    sessions, messages, activeSession,
    fetchSessions, createSession, fetchMessages,
    sendMessage, saveAssistantMessage, setActiveSession,
    deleteSession,
  };
}
