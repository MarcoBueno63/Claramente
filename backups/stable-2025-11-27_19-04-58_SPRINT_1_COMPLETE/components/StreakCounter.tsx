"use client";
import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/analytics-service';

interface StreakData {
  current: number;
  best: number;
  type: 'sessions' | 'exercises' | 'monitoring';
  lastActivity: Date;
}

export default function StreakCounter({ userId }: { userId: string }) {
  const [streaks, setStreaks] = useState<{
    sessions: StreakData;
    exercises: StreakData;
    monitoring: StreakData;
  } | null>(null);

  useEffect(() => {
    loadStreaks();
  }, [userId]);

  const loadStreaks = () => {
    // Carregar streaks do localStorage
    const sessionsStreak = localStorage.getItem(`streak_sessions_${userId}`);
    const exercisesStreak = localStorage.getItem(`streak_exercises_${userId}`);
    const monitoringStreak = localStorage.getItem(`streak_monitoring_${userId}`);

    setStreaks({
      sessions: sessionsStreak ? JSON.parse(sessionsStreak) : { current: 0, best: 0, type: 'sessions', lastActivity: new Date() },
      exercises: exercisesStreak ? JSON.parse(exercisesStreak) : { current: 0, best: 0, type: 'exercises', lastActivity: new Date() },
      monitoring: monitoringStreak ? JSON.parse(monitoringStreak) : { current: 0, best: 0, type: 'monitoring', lastActivity: new Date() }
    });
  };

  if (!streaks) return null;

  const StreakCard = ({ data, icon, label, color }: { data: StreakData; icon: string; label: string; color: string }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-white">{data.current}</span>
          <span className="text-sm text-white/80">dias</span>
        </div>
      </div>
      <div className="text-white/90 text-sm font-medium">{label}</div>
      {data.current > 0 && (
        <div className="mt-2 text-xs text-white/70">
          Recorde: {data.best} dias 🏆
        </div>
      )}
      {data.current >= 7 && (
        <div className="mt-1 text-xs text-yellow-300 font-semibold">
          🔥 Você está em chamas!
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StreakCard
        data={streaks.sessions}
        icon="💬"
        label="Streak de Sessões"
        color="from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
      />
      <StreakCard
        data={streaks.exercises}
        icon="💪"
        label="Streak de Exercícios"
        color="from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
      />
      <StreakCard
        data={streaks.monitoring}
        icon="📊"
        label="Streak de Monitoramento"
        color="from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700"
      />
    </div>
  );
}

// Função auxiliar para atualizar streak
export function updateStreak(userId: string, type: 'sessions' | 'exercises' | 'monitoring') {
  const key = `streak_${type}_${userId}`;
  const stored = localStorage.getItem(key);
  
  let streak: StreakData = stored 
    ? JSON.parse(stored) 
    : { current: 0, best: 0, type, lastActivity: new Date() };

  const now = new Date();
  const lastActivity = new Date(streak.lastActivity);
  const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Mesma dia, não incrementar
    return streak.current;
  } else if (daysDiff === 1) {
    // Dia consecutivo, incrementar
    streak.current += 1;
    streak.best = Math.max(streak.best, streak.current);
  } else {
    // Streak quebrada
    streak.current = 1;
  }

  streak.lastActivity = now;
  localStorage.setItem(key, JSON.stringify(streak));
  
  return streak.current;
}
