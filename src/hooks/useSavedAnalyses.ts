import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { SavedAnalysisRow, SavedAnalysisInsert } from '../lib/database.types';

export function useSavedAnalyses(userId: string | undefined) {
  const [analyses, setAnalyses] = useState<SavedAnalysisRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await api.get<{ data: SavedAnalysisRow[] }>('/api/saved');
    setLoading(false);
    if (data) setAnalyses((data as any).data ?? []);
  }, [userId]);

  const saveAnalysis = useCallback(async (input: Omit<SavedAnalysisInsert, 'user_id'>) => {
    if (!userId) return { error: 'Not authenticated' };
    const { data, error } = await api.post<{ data: SavedAnalysisRow }>('/api/saved', input);
    if (!error && data) {
      setAnalyses(prev => [(data as any).data as SavedAnalysisRow, ...prev]);
    }
    return { error: error ?? null };
  }, [userId]);

  const toggleFavorite = useCallback(async (id: string) => {
    const analysis = analyses.find(a => a.id === id);
    if (!analysis) return;
    await api.put(`/api/saved/${id}/favorite`, { is_favorite: !analysis.is_favorite });
    setAnalyses(prev =>
      prev.map(a => a.id === id ? { ...a, is_favorite: !a.is_favorite } : a)
    );
  }, [analyses]);

  const deleteAnalysis = useCallback(async (id: string) => {
    await api.delete(`/api/saved/${id}`);
    setAnalyses(prev => prev.filter(a => a.id !== id));
  }, []);

  return { analyses, loading, fetchSaved, saveAnalysis, toggleFavorite, deleteAnalysis };
}
