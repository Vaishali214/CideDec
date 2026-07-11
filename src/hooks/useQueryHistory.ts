import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { QueryHistoryRow, QueryHistoryInsert } from '../lib/database.types';

interface QueryStats {
  totalQueries: number;
  averageScore: number;
  topDomain: string;
  recentQueries: QueryHistoryRow[];
}

export function useQueryHistory() {
  const [loading, setLoading] = useState(false);

  const saveQuery = useCallback(async (data: Omit<QueryHistoryInsert, 'user_id'>) => {
    setLoading(true);
    const { error } = await api.post('/api/history', data);
    setLoading(false);

    if (error) return { error };
    return { error: null };
  }, []);

  const fetchHistory = useCallback(async (
    page = 1,
    limit = 20
  ): Promise<{ data: QueryHistoryRow[]; count: number }> => {
    setLoading(true);
    const { data, error } = await api.get<QueryHistoryRow[]>('/api/history');
    setLoading(false);

    if (error || !data) return { data: [], count: 0 };
    
    // Perform local pagination
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginated = data.slice(from, to);

    return { data: paginated, count: data.length };
  }, []);

  const deleteQuery = useCallback(async (id: string) => {
    const { error } = await api.delete(`/api/history/${id}`);
    return { error };
  }, []);

  const getStats = useCallback(async (): Promise<QueryStats> => {
    const { data, error } = await api.get<QueryHistoryRow[]>('/api/history');

    if (error || !data || data.length === 0) {
      return { totalQueries: 0, averageScore: 0, topDomain: 'general', recentQueries: [] };
    }

    const totalQueries = data.length;
    const averageScore = Math.round(
      data.reduce((s, q) => s + q.score, 0) / totalQueries
    );

    const domainCounts: Record<string, number> = {};
    data.forEach(q => {
      const d = q.domain;
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    });
    const topDomain = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'general';

    return {
      totalQueries,
      averageScore,
      topDomain,
      recentQueries: data.slice(0, 5),
    };
  }, []);

  return { saveQuery, fetchHistory, deleteQuery, getStats, loading };
}
