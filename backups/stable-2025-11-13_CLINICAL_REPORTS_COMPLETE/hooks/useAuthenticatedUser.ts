// hooks/useAuthenticatedUser.ts - Hook para gerenciar usuários autenticados
// Integra NextAuth com sistema de persistência e progresso terapêutico

"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { authService, ClaraMenteUser } from '../lib/auth';
import { TherapySession, UserProgress } from '../lib/user-service';

export interface AuthenticatedUserState {
  user: ClaraMenteUser | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  loading: boolean;
  
  // Dados da sessão terapêutica
  currentSession: TherapySession | null;
  sessionHistory: TherapySession[];
  canStartNewSession: boolean;
  
  // Progresso e métricas
  progress: UserProgress | null;
  
  // Ações
  startTherapySession: () => TherapySession | null;
  endCurrentSession: (moodAfter?: number) => TherapySession | null;
  refreshUserData: () => void;
  calculateProgress: (period?: '7d' | '30d' | '90d' | 'all') => UserProgress;
}

export function useAuthenticatedUser(): AuthenticatedUserState {
  const { data: session, status } = useSession();
  
  const [user, setUser] = useState<ClaraMenteUser | null>(null);
  const [currentSession, setCurrentSession] = useState<TherapySession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<TherapySession[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = !!session?.user;
  const isAnonymous = !isAuthenticated && !!user;

  // Inicializar usuário
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      
      try {
        if (session?.user) {
          // Usuário autenticado via NextAuth
          const authenticatedUser = await authService.createOrUpdateUser(session);
          if (authenticatedUser) {
            setUser(authenticatedUser);
            
            // Carregar histórico de sessões
            const history = authService.getUserSessions(authenticatedUser.id, 10);
            setSessionHistory(history);
            
            // Calcular progresso
            const userProgress = authService.calculateProgress(authenticatedUser.id, '30d');
            setProgress(userProgress);
            
            console.log('✅ Usuário autenticado carregado:', {
              name: authenticatedUser.name,
              sessionsTotal: authenticatedUser.totalSessions,
              sessionsRestantes: 5 - authenticatedUser.freeSessionsUsed
            });
          }
        } else if (status === 'unauthenticated') {
          // Modo anônimo - criar usuário temporário
          const anonymousUser: ClaraMenteUser = {
            id: 'anonymous_' + Date.now(),
            locale: 'pt-BR',
            name: 'Usuário Anônimo',
            createdAt: new Date(),
            lastLogin: new Date(),
            freeSessionsUsed: 0,
            totalSessions: 0,
            completedAssessments: 0,
            preferredPersona: 'empática',
            preferredStyle: 'conversacional',
            notificationsEnabled: true,
            currentStreak: 0,
            longestStreak: 0,
            achievementsUnlocked: [],
            dataRetentionDays: 30, // Dados anônimos mantidos por menos tempo
            shareProgressWithTherapist: false
          };
          
          setUser(anonymousUser);
          setSessionHistory([]);
          setProgress(null);
          
          console.log('👤 Usuário anônimo criado:', anonymousUser.id);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      initializeUser();
    }
  }, [session, status]);

  // Funções de ação
  const startTherapySession = (): TherapySession | null => {
    if (!user) {
      console.warn('Tentativa de iniciar sessão sem usuário');
      return null;
    }

    if (!authService.canStartNewSession(user)) {
      console.warn('Usuário atingiu limite de sessões grátis:', user.id);
      return null;
    }

    try {
      const newSession = authService.startTherapySession(user.id);
      setCurrentSession(newSession);
      
      // Atualizar usuário (incrementa totalSessions)
      const updatedUser = authService.getUserById(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      console.log('🎯 Nova sessão terapêutica iniciada:', {
        sessionId: newSession.id,
        userId: user.id,
        startTime: newSession.startTime
      });
      
      return newSession;
    } catch (error) {
      console.error('❌ Erro ao iniciar sessão terapêutica:', error);
      return null;
    }
  };

  const endCurrentSession = (moodAfter?: number): TherapySession | null => {
    if (!currentSession) {
      console.warn('Tentativa de finalizar sessão inexistente');
      return null;
    }

    try {
      const finalizedSession = authService.endTherapySession(currentSession.id, moodAfter);
      
      if (finalizedSession && user) {
        // Usar uma sessão grátis
        const updatedUser = authService.useFreeSessio(user);
        setUser(updatedUser);
        
        // Atualizar histórico
        const updatedHistory = authService.getUserSessions(user.id, 10);
        setSessionHistory(updatedHistory);
        
        // Recalcular progresso
        const updatedProgress = authService.calculateProgress(user.id, '30d');
        setProgress(updatedProgress);
        
        setCurrentSession(null);
        
        console.log('✅ Sessão finalizada com sucesso:', {
          sessionId: finalizedSession.id,
          duration: finalizedSession.duration,
          messages: finalizedSession.messages.length,
          mood: moodAfter ? `${finalizedSession.moodBefore || 'N/A'} → ${moodAfter}` : 'N/A'
        });
        
        return finalizedSession;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao finalizar sessão:', error);
      return null;
    }
  };

  const refreshUserData = (): void => {
    if (!user) return;
    
    try {
      // Recarregar dados do usuário
      const updatedUser = authService.getUserById(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      // Recarregar histórico
      const updatedHistory = authService.getUserSessions(user.id, 10);
      setSessionHistory(updatedHistory);
      
      // Recalcular progresso
      const updatedProgress = authService.calculateProgress(user.id, '30d');
      setProgress(updatedProgress);
      
      console.log('🔄 Dados do usuário atualizados:', user.id);
    } catch (error) {
      console.error('❌ Erro ao atualizar dados do usuário:', error);
    }
  };

  const calculateProgress = (period: '7d' | '30d' | '90d' | 'all' = '30d'): UserProgress => {
    if (!user) {
      return {
        userId: 'unknown',
        period,
        totalSessions: 0,
        averageSessionDuration: 0,
        moodImprovement: 0,
        preferredSessionTimes: [],
        mostDiscussedTopics: [],
        mostEffectiveTechniques: [],
        dominantEmotions: [],
        riskLevelTrend: [],
        milestonesAchieved: []
      };
    }
    
    return authService.calculateProgress(user.id, period);
  };

  return {
    user,
    isAuthenticated,
    isAnonymous,
    loading,
    
    currentSession,
    sessionHistory,
    canStartNewSession: user ? authService.canStartNewSession(user) : false,
    
    progress,
    
    startTherapySession,
    endCurrentSession,
    refreshUserData,
    calculateProgress
  };
}

// Hook complementar para dados de progresso
export function useUserProgress(userId?: string, period: '7d' | '30d' | '90d' | 'all' = '30d') {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId) {
      setProgress(null);
      setLoading(false);
      return;
    }
    
    try {
      const userProgress = authService.calculateProgress(userId, period);
      setProgress(userProgress);
    } catch (error) {
      console.error('Erro ao calcular progresso:', error);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [userId, period]);
  
  return { progress, loading };
}