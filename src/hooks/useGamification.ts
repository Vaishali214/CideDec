import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { GamificationRow } from '../lib/database.types';

type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface GamificationState {
  score: number;
  level: UserLevel;
  totalQueries: number;
  badges: string[];
  streak: number;
}

export function useGamification(userId: string | undefined) {
  const [state, setState] = useState<GamificationState>({
    score: 0, level: 'beginner', totalQueries: 0, badges: [], streak: 0,
  });

  const fetchGamification = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await api.get<GamificationRow>('/api/gamification');

    if (!error && data) {
      setState({
        score: data.total_score,
        level: data.level as UserLevel,
        totalQueries: data.total_queries,
        badges: Array.isArray(data.badges) ? data.badges : JSON.parse(data.badges || '[]'),
        streak: data.streak,
      });
    }
  }, [userId]);

  const updateAfterQuery = useCallback(async (queryScore: number) => {
    if (!userId) return;

    const { data: current, error } = await api.get<GamificationRow>('/api/gamification');

    if (error || !current) return;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = current.last_query_date;

    const newTotalScore = current.total_score + queryScore;
    const newTotalQueries = current.total_queries + 1;
    const avg = newTotalScore / newTotalQueries;

    // Streak logic
    let newStreak = current.streak;
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      newStreak = lastDate === yesterday ? current.streak + 1 : 1;
    }

    // Level
    const newLevel: UserLevel =
      avg >= 80 ? 'expert' :
      avg >= 65 ? 'advanced' :
      avg >= 45 ? 'intermediate' : 'beginner';

    // Badges
    const currentBadges = Array.isArray(current.badges) 
      ? current.badges 
      : JSON.parse(current.badges || '[]');
      
    const newBadges = [...currentBadges];
    if (newTotalQueries >= 1  && !newBadges.includes('First Search'))     newBadges.push('First Search');
    if (newTotalQueries >= 5  && !newBadges.includes('Explorer'))         newBadges.push('Explorer');
    if (newTotalQueries >= 10 && !newBadges.includes('Analyst'))          newBadges.push('Analyst');
    if (avg >= 70             && !newBadges.includes('Precision Thinker')) newBadges.push('Precision Thinker');
    if (avg >= 85             && !newBadges.includes('Domain Expert'))     newBadges.push('Domain Expert');
    if (newTotalScore >= 500  && !newBadges.includes('Power User'))       newBadges.push('Power User');
    if (newStreak >= 7        && !newBadges.includes('Week Warrior'))      newBadges.push('Week Warrior');

    const updatePayload = {
      total_score: newTotalScore,
      total_queries: newTotalQueries,
      level: newLevel,
      badges: newBadges,
      streak: Math.min(newStreak, 30),
      last_query_date: today,
    };

    await api.put('/api/gamification', updatePayload);

    setState({
      score: newTotalScore,
      level: newLevel,
      totalQueries: newTotalQueries,
      badges: newBadges,
      streak: Math.min(newStreak, 30),
    });
  }, [userId]);

  return { ...state, fetchGamification, updateAfterQuery };
}
