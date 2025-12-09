"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getUser } from "../lib/auth";
import { therapyStorage, SessionData, UserProfile } from "../lib/storage";
import { BreathingExercise, MoodTracker, MindfulnessTimer, MuscleRelaxation, MoodEntry } from './InteractiveExercises';
import ClinicalExercisesComponent from './ClinicalExercises';
import { DSM5_PROTOCOLS } from '@/lib/dsm5-protocols';
import { ClinicalExercisePrescription } from '@/lib/clinical-exercises';
import { gamificationSystem, Achievement, UserLevel, Challenge, SupportMessage } from "../lib/gamification";
import { useNotifications } from './NotificationManager';
import NotificationSettings from './NotificationSettings';
import { getAnalytics, SessionAnalytics } from '../lib/analytics';
import AnalyticsDashboard from './AnalyticsDashboard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tccContext?: {
    technique?: string;
    category?: string;
    emotionalTone?: 'positive' | 'neutral' | 'negative' | 'mixed';
    topicsDiscussed?: string[];
    conversational?: boolean;
    responseTime?: number;
    coreBeliefs?: Array<{
      domain: string;
      type: string;
      centralBelief: string;
      confidence: number;
    }>;
    intermediateBeliefs?: Array<{
      type: string;
      category: string;
      rule?: string;
      attitude?: string;
      intervention: string;
    }>;
    interventionType?: string;
  };
}

interface ThoughtRecord {
  id: string;
  situation: string;
  emotion: string;
  intensity: number;
  automaticThought: string;
  alternativeThought?: string;
  timestamp: Date;
}

interface BeliefProfile {
  coreBeliefs: Array<{
    domain: string;
    type: string;
    centralBelief: string;
    confidence: number;
    identifiedAt: Date;
  }>;
  intermediateBeliefs: Array<{
    type: string;
    category: string;
    rule?: string;
    attitude?: string;
    intervention: string;
    identifiedAt: Date;
  }>;
}

interface TherapeuticTask {
  id: string;
  type: 'thought_record' | 'behavioral_experiment' | 'mood_tracking' | 'homework';
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'exercises' | 'progress' | 'achievements' | 'settings' | 'profile' | 'clinical' | 'beliefs' | 'tasks' | 'analytics'>('chat');
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([]);
  const [beliefProfile, setBeliefProfile] = useState<BeliefProfile>({
    coreBeliefs: [],
    intermediateBeliefs: []
  });
  const [therapeuticTasks, setTherapeuticTasks] = useState<TherapeuticTask[]>([]);
  const [sessionNotes, setSessionNotes] = useState("");
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Sistema de Timer de Sessão (30 minutos)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(30 * 60); // 30 minutos em segundos
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [sessionWarningShown, setSessionWarningShown] = useState<boolean>(false);
  const [sessionTimerInterval, setSessionTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Sistema de Notificações
  const notifications = useNotifications();
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  
  // Sistema de Analytics
  const analytics = getAnalytics();
  const [currentAnalyticsSession, setCurrentAnalyticsSession] = useState<SessionAnalytics | null>(null);
  
  // Gamificação
  const [gamificationData, setGamificationData] = useState<{
    points: number;
    level: UserLevel;
    achievements: Achievement[];
    activeChallenges: Challenge[];
    streak: number;
    stats: any;
  } | null>(null);
  const [supportMessage, setSupportMessage] = useState<SupportMessage | null>(null);
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = getUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Funções do Timer de Sessão
  const startSessionTimer = () => {
    const startTime = new Date();
    setSessionStartTime(startTime);
    setSessionActive(true);
    setSessionTimeRemaining(30 * 60); // 30 minutos
    setSessionWarningShown(false);
    
    // Iniciar sessão de analytics
    const analyticsSession = analytics.startSession(user?.id || 'guest');
    setCurrentAnalyticsSession(analyticsSession);
    console.log('[Analytics] Sessão iniciada:', analyticsSession.sessionId);
    
    // Agendar próximo lembrete para depois da sessão
    if (notifications.isEnabled) {
      notifications.scheduleSessionReminder(45); // 45 minutos (sessão + pausa)
    }
    
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedTime = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = (30 * 60) - elapsedTime;
      
      setSessionTimeRemaining(remaining);
      
      // Aviso aos 5 minutos restantes
      if (remaining <= 300 && !sessionWarningShown) {
        setSessionWarningShown(true);
        const warningMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⏰ **Aviso de Tempo**: Restam 5 minutos para o final da sessão. Vamos começar a encerrar e fazer um resumo do que trabalhamos hoje.',
          timestamp: new Date(),
          tccContext: {
            technique: 'session_management',
            category: 'time_warning'
          }
        };
        setMessages(prev => [...prev, warningMessage]);
        
        // Rastrear mensagem de aviso
        analytics.trackMessage(warningMessage.content, warningMessage.role, warningMessage.tccContext);
      }
      
      // Encerrar sessão automaticamente
      if (remaining <= 0) {
        endSession();
      }
    }, 1000);
    
    setSessionTimerInterval(interval);
  };

  const endSession = () => {
    if (sessionTimerInterval) {
      clearInterval(sessionTimerInterval);
      setSessionTimerInterval(null);
    }
    
    setSessionActive(false);
    
    // Calcular estatísticas da sessão para notificações inteligentes
    const sessionDuration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 60000) : 30;
    const techniqueCount = messages.filter(m => m.tccContext?.technique).length;
    const recordCount = thoughtRecords.length;
    
    const endMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🕐 **Sessão Encerrada** 

Nossa sessão de 30 minutos chegou ao fim. 

📝 **Resumo da Sessão:**
• Tempo total: ${sessionDuration} minutos
• Técnicas aplicadas: ${techniqueCount}
• Registros criados: ${recordCount}

🎯 **Próximos Passos:**
• Pratique as técnicas que trabalhamos
• Complete as tarefas terapêuticas sugeridas
• Retorne quando quiser continuar seu processo

**Ótimo trabalho hoje!** 👏`,
      timestamp: new Date(),
      tccContext: {
        technique: 'session_closure',
        category: 'summary'
      }
    };
    
    setMessages(prev => [...prev, endMessage]);
    
    // Finalizar sessão de analytics
    if (currentAnalyticsSession) {
      // Rastrear pensamentos registrados na sessão
      analytics.trackThoughtRecord();
      
      // Finalizar sessão de analytics
      const completedSession = analytics.endSession();
      if (completedSession) {
        console.log('[Analytics] Sessão concluída:', completedSession.sessionId, 
                   `${completedSession.duration}min, ${completedSession.messageCount} mensagens`);
      }
      setCurrentAnalyticsSession(null);
    }
    
    // Salvar sessão como concluída
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        messages: [...messages, endMessage],
        endedAt: new Date(),
        duration: sessionDuration
      };
      therapyStorage.saveSession(updatedSession);
    }
    
    // Atualizar gamificação e triggerar notificações de conquistas
    if (gamificationData) {
      gamificationSystem.updateStats(user?.id || 'guest', 'complete_session', 1);
      
      // Triggerar celebrações simples de streak
      if (notifications.isEnabled) {
        const storedStreak = localStorage.getItem('claramente-streak');
        const currentStreak = storedStreak ? parseInt(storedStreak) + 1 : 1;
        localStorage.setItem('claramente-streak', currentStreak.toString());
        
        // Celebrar marcos de streak
        if ([1, 3, 7, 14, 30, 60, 100].includes(currentStreak)) {
          notifications.celebrateStreak(currentStreak);
        }
      }
    }
    
    // Salvar padrão de uso para lembretes inteligentes
    if (notifications.isEnabled) {
      const userPattern = JSON.parse(localStorage.getItem('claramente-user-pattern') || '{}');
      const currentHour = new Date().getHours();
      
      const updatedPattern = {
        ...userPattern,
        lastSessionTime: new Date(),
        totalSessions: (userPattern.totalSessions || 0) + 1,
        averageSessionDuration: ((userPattern.averageSessionDuration || 20) + sessionDuration) / 2,
        preferredHours: updatePreferredHours(userPattern.preferredHours || [9, 14, 19], currentHour)
      };
      
      localStorage.setItem('claramente-user-pattern', JSON.stringify(updatedPattern));
    }
  };
  
  // Função auxiliar para atualizar horários preferenciais
  const updatePreferredHours = (currentHours: number[], newHour: number): number[] => {
    const hours = [...currentHours];
    if (!hours.includes(newHour)) {
      hours.push(newHour);
      return hours.sort((a, b) => a - b).slice(0, 5); // Manter até 5 horários
    }
    return hours;
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Carregar ou criar sessão
    const loadSession = () => {
      const existingSession = therapyStorage.getCurrentSession();
      const profile = therapyStorage.getUserProfile(user?.id || 'guest') || therapyStorage.createUserProfile(user?.id || 'guest');
      
      // Carregar dados de gamificação
      const gamData = gamificationSystem.loadUserData(user?.id || 'guest');
      setGamificationData(gamData);
      
      if (existingSession && existingSession.userId === (user?.id || 'guest')) {
        // Carregar sessão existente
        setCurrentSession(existingSession);
        setMessages(existingSession.messages);
        setBeliefProfile(existingSession.beliefProfile);
        setThoughtRecords(existingSession.thoughtRecords);
        setTherapeuticTasks(existingSession.therapeuticTasks);
        setSessionNotes(existingSession.sessionNotes);
      } else {
        // Criar nova sessão
        const newSession = therapyStorage.createNewSession(user?.id || 'guest');
        setCurrentSession(newSession);
        
        // Mensagem de boas-vindas
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Olá! Sou Clara, sua assistente de Terapia Cognitivo-Comportamental. 

🧠 **Como funciono:**
• Identifico padrões de pensamentos automáticos
• Analiso crenças centrais e intermediárias  
• Aplico técnicas baseadas em Aaron Beck
• Sugiro tarefas terapêuticas personalizadas

🏆 **Seu progresso:** Nível ${gamData.level.level} (${gamData.level.title}) | ${gamData.points} pontos

📝 **Vamos começar:** Compartilhe comigo como você está se sentindo hoje ou alguma situação que está te preocupando.

*Lembre-se: Sou um complemento ao tratamento profissional, não um substituto.*`,
          timestamp: new Date(),
          tccContext: {
            technique: 'welcome_assessment',
            category: 'initial_contact'
          }
        };

        const updatedSession = {
          ...newSession,
          messages: [welcomeMessage]
        };
        
        setMessages([welcomeMessage]);
        setCurrentSession(updatedSession);
        therapyStorage.saveSession(updatedSession);
        
        // Atualizar estatísticas de sessão
        gamificationSystem.updateStats(user?.id || 'guest', 'complete_session', 1);
      }
      
      setUserProfile(profile);
    };

    loadSession();
  }, [user?.id]);

  // Auto-save da sessão
  useEffect(() => {
    if (currentSession) {
      const updatedSession: SessionData = {
        ...currentSession,
        lastActivity: new Date(),
        messages,
        beliefProfile,
        thoughtRecords,
        therapeuticTasks,
        sessionNotes,
        emotionalProgress: currentSession.emotionalProgress
      };
      
      setCurrentSession(updatedSession);
      therapyStorage.saveSession(updatedSession);
      
      // Atualizar métricas de progresso
      therapyStorage.updateProgressMetrics(user?.id || 'guest', updatedSession);
    }
  }, [messages, beliefProfile, thoughtRecords, therapeuticTasks, sessionNotes]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup do timer quando componente for desmontado
  useEffect(() => {
    return () => {
      if (sessionTimerInterval) {
        clearInterval(sessionTimerInterval);
      }
    };
  }, [sessionTimerInterval]);

  const updateBeliefProfile = useCallback((tccContext: any) => {
    if (tccContext?.coreBeliefs?.length > 0) {
      setBeliefProfile(prev => ({
        ...prev,
        coreBeliefs: [...prev.coreBeliefs, ...tccContext.coreBeliefs.map((belief: any) => ({
          ...belief,
          identifiedAt: new Date()
        }))]
      }));
    }

    if (tccContext?.intermediateBeliefs?.length > 0) {
      setBeliefProfile(prev => ({
        ...prev,
        intermediateBeliefs: [...prev.intermediateBeliefs, ...tccContext.intermediateBeliefs.map((belief: any) => ({
          ...belief,
          identifiedAt: new Date()
        }))]
      }));
    }
  }, []);

  const generateTherapeuticTask = useCallback((message: string, tccContext: any) => {
    const tasks: TherapeuticTask[] = [];

    if (tccContext?.technique === 'thought_record') {
      tasks.push({
        id: Date.now().toString(),
        type: 'thought_record',
        title: 'Registro de Pensamentos',
        description: 'Identifique uma situação que causou emoções negativas e registre os pensamentos automáticos.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completed: false,
        createdAt: new Date()
      });
    }

    if (tccContext?.coreBeliefs?.length > 0) {
      tasks.push({
        id: (Date.now() + 1).toString(),
        type: 'behavioral_experiment',
        title: 'Experimento Comportamental',
        description: 'Teste a validade de suas crenças através de experiências controladas do dia a dia.',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        completed: false,
        createdAt: new Date()
      });
    }

    if (tasks.length > 0) {
      setTherapeuticTasks(prev => [...prev, ...tasks]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Iniciar timer na primeira mensagem do usuário (excluindo mensagem de boas-vindas)
    if (!sessionActive && messages.length <= 1) {
      startSessionTimer();
    }
    
    // Verificar se sessão ainda está ativa
    if (sessionActive && sessionTimeRemaining <= 0) {
      const timeUpMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⏰ O tempo da sessão acabou. Para continuar, inicie uma nova sessão.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, timeUpMessage]);
      return;
    }

    const responseTime = Date.now() - lastMessageTime; // Calcular tempo de resposta

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Rastrear mensagem do usuário no analytics
    if (currentAnalyticsSession) {
      analytics.trackMessage(input, 'user');
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          message: input,
          responseTime: responseTime
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        tccContext: data.tccContext
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastMessageTime(Date.now()); // Atualizar tempo para próxima medição

      // Rastrear mensagem do assistente no analytics  
      if (currentAnalyticsSession && data.tccContext) {
        analytics.trackMessage(data.reply, 'assistant', data.tccContext);
      }

      // Atualizar perfil de crenças se houver contexto TCC
      if (data.tccContext) {
        updateBeliefProfile(data.tccContext);
        generateTherapeuticTask(input, data.tccContext);
        
        // Tracking de progresso emocional
        if (data.tccContext.emotionalPatterns && currentSession) {
          const emotionalEntry = {
            timestamp: new Date(),
            emotions: data.tccContext.emotionalPatterns,
            intensity: 5, // Valor padrão - pode ser melhorado com análise de sentimento
            context: input.substring(0, 100)
          };
          
          const updatedSession = {
            ...currentSession,
            emotionalProgress: [...currentSession.emotionalProgress, emotionalEntry]
          };
          
          setCurrentSession(updatedSession);
          therapyStorage.saveSession(updatedSession);
        }
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'self': return 'bg-red-100 text-red-800 border-red-200';
      case 'world': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'future': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderBeliefProfile = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Crenças Centrais Identificadas</h3>
        {beliefProfile.coreBeliefs.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma crença central identificada ainda.</p>
        ) : (
          <div className="space-y-3">
            {beliefProfile.coreBeliefs.map((belief, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getDomainColor(belief.domain)}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm uppercase">{belief.domain}</span>
                  <span className="text-xs opacity-70">
                    {formatTimestamp(belief.identifiedAt)}
                  </span>
                </div>
                <p className="text-sm font-medium">{belief.centralBelief}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs">Confiança:</span>
                  <div className="flex-1 bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-current opacity-60"
                      style={{ width: `${belief.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{Math.round(belief.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Crenças Intermediárias</h3>
        {beliefProfile.intermediateBeliefs.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma crença intermediária identificada ainda.</p>
        ) : (
          <div className="space-y-3">
            {beliefProfile.intermediateBeliefs.map((belief, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-purple-800 font-medium text-sm">{belief.category}</span>
                  <span className="text-xs text-purple-600">
                    {formatTimestamp(belief.identifiedAt)}
                  </span>
                </div>
                <p className="text-sm font-medium text-purple-900">
                  {belief.rule || belief.attitude}
                </p>
                <p className="text-xs text-purple-700 mt-1">{belief.intervention}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderThoughtRecords = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">📝 Registros de Pensamentos</h3>
        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          + Novo Registro
        </button>
      </div>
      
      {thoughtRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum registro de pensamento ainda.</p>
          <p className="text-sm mt-2">Use o chat para identificar pensamentos automáticos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {thoughtRecords.map((record) => (
            <div key={record.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-green-800">Situação: {record.situation}</h4>
                <span className="text-xs text-green-600">{formatTimestamp(record.timestamp)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-green-700">Emoção:</span>
                  <p className="text-green-900">{record.emotion} (Intensidade: {record.intensity}/10)</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Pensamento:</span>
                  <p className="text-green-900">{record.automaticThought}</p>
                </div>
              </div>
              {record.alternativeThought && (
                <div className="mt-2 pt-2 border-t border-green-300">
                  <span className="font-medium text-green-700">Pensamento Alternativo:</span>
                  <p className="text-green-900 text-sm">{record.alternativeThought}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTherapeuticTasks = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">📋 Tarefas Terapêuticas</h3>
      
      {therapeuticTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma tarefa atribuída ainda.</p>
          <p className="text-sm mt-2">Continue conversando para receber tarefas personalizadas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {therapeuticTasks.map((task) => (
            <div key={task.id} className={`p-4 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${task.completed ? 'text-green-600' : 'text-orange-600'}`}>
                    {task.type === 'thought_record' && '📝'}
                    {task.type === 'behavioral_experiment' && '🔬'}
                    {task.type === 'mood_tracking' && '📊'}
                    {task.type === 'homework' && '📚'}
                  </span>
                  <h4 className={`font-medium ${task.completed ? 'text-green-800' : 'text-orange-800'}`}>
                    {task.title}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setTherapeuticTasks(prev => 
                      prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
                    );
                  }}
                  className={`text-xs px-2 py-1 rounded ${
                    task.completed 
                      ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                      : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                  }`}
                >
                  {task.completed ? 'Concluída' : 'Marcar como concluída'}
                </button>
              </div>
              <p className={`text-sm ${task.completed ? 'text-green-700' : 'text-orange-700'}`}>
                {task.description}
              </p>
              {task.dueDate && (
                <p className={`text-xs mt-2 ${task.completed ? 'text-green-600' : 'text-orange-600'}`}>
                  Prazo: {new Intl.DateTimeFormat('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(task.dueDate)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProgressTab = () => {
    if (!userProfile) return <div>Carregando perfil...</div>;
    
    const analytics = therapyStorage.getProgressAnalytics(user?.id || 'guest');
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">📊 Seu Progresso</h3>
        
        {/* Métricas Gerais */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{userProfile.totalSessions}</div>
            <div className="text-xs text-blue-700">Sessões</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(analytics.taskCompletionRate * 100)}%
            </div>
            <div className="text-xs text-green-700">Tarefas Concluídas</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {userProfile.progressMetrics.coreBeliefs.identified}
            </div>
            <div className="text-xs text-purple-700">Crenças Identificadas</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(userProfile.progressMetrics.emotionalRegulation.averageIntensity)}
            </div>
            <div className="text-xs text-orange-700">Intensidade Média</div>
          </div>
        </div>

        {/* Progresso Emocional Recente */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">🎭 Emoções Recentes</h4>
          {analytics.emotionalTrends.slice(-5).length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum dado emocional registrado ainda.</p>
          ) : (
            <div className="space-y-2">
              {analytics.emotionalTrends.slice(-5).reverse().map((trend, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{trend.date}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Intensidade: {trend.intensity}/10
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trend.emotions.map((emotion, i) => (
                      <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evolução de Crenças */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">🧠 Evolução das Crenças</h4>
          {analytics.beliefEvolution.slice(-5).length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma evolução registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {analytics.beliefEvolution.slice(-5).reverse().map((evolution, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm flex justify-between">
                  <span>{evolution.date}</span>
                  <div className="text-xs">
                    <span className="text-red-600">Centrais: {evolution.coreBeliefs}</span>
                    <span className="text-purple-600 ml-2">Intermediárias: {evolution.intermediateBeliefs}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <button
            onClick={() => {
              const data = therapyStorage.exportData(user?.id || 'guest');
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `claramente-progresso-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            📥 Exportar Dados
          </button>
          
          <button
            onClick={() => {
              if (confirm('Isso apagará todos os seus dados. Tem certeza?')) {
                therapyStorage.clearAllData();
                window.location.reload();
              }
            }}
            className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            🗑️ Limpar Dados
          </button>
        </div>
      </div>
    );
  };

  const renderExercisesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">🧘 Exercícios Terapêuticos</h3>
      
      <div className="space-y-4">
        {/* Respiração */}
        <div className="border border-gray-200 rounded-lg p-4">
          <BreathingExercise 
            onComplete={() => {
              const completedTask: TherapeuticTask = {
                id: Date.now().toString(),
                type: 'mood_tracking',
                title: 'Exercício de Respiração Concluído',
                description: 'Você completou 5 ciclos de respiração 4-4-6. Como se sente agora?',
                completed: true,
                createdAt: new Date()
              };
              setTherapeuticTasks(prev => [...prev, completedTask]);
            }}
          />
        </div>

        {/* Registro de Humor */}
        <div className="border border-gray-200 rounded-lg p-4">
          <MoodTracker 
            onSave={(moodEntry) => {
              setMoodEntries(prev => [...prev, moodEntry]);
              
              // Adicionar entrada emocional à sessão
              if (currentSession) {
                const emotionalEntry = {
                  timestamp: new Date(),
                  emotions: [moodEntry.mood],
                  intensity: moodEntry.intensity,
                  context: moodEntry.triggers || 'Registro manual de humor'
                };
                
                const updatedSession = {
                  ...currentSession,
                  emotionalProgress: [...currentSession.emotionalProgress, emotionalEntry]
                };
                
                setCurrentSession(updatedSession);
                therapyStorage.saveSession(updatedSession);
              }
            }}
          />
        </div>

        {/* Mindfulness */}
        <div className="border border-gray-200 rounded-lg p-4">
          <MindfulnessTimer 
            onComplete={() => {
              const completedTask: TherapeuticTask = {
                id: (Date.now() + 1).toString(),
                type: 'mood_tracking',
                title: 'Sessão de Mindfulness Concluída',
                description: 'Você completou uma sessão de meditação mindfulness. Registre suas observações.',
                completed: true,
                createdAt: new Date()
              };
              setTherapeuticTasks(prev => [...prev, completedTask]);
            }}
          />
        </div>

        {/* Relaxamento Muscular */}
        <div className="border border-gray-200 rounded-lg p-4">
          <MuscleRelaxation 
            onComplete={() => {
              const completedTask: TherapeuticTask = {
                id: (Date.now() + 2).toString(),
                type: 'mood_tracking',
                title: 'Relaxamento Muscular Progressivo Concluído',
                description: 'Você trabalhou todos os grupos musculares. Como está sua tensão corporal agora?',
                completed: true,
                createdAt: new Date()
              };
              setTherapeuticTasks(prev => [...prev, completedTask]);
            }}
          />
        </div>

        {/* Histórico de Humor Recente */}
        {moodEntries.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">📈 Histórico de Humor</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {moodEntries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{
                      entry.mood === 'triste' ? '😢' :
                      entry.mood === 'ansioso' ? '😟' :
                      entry.mood === 'irritado' ? '😠' :
                      entry.mood === 'calmo' ? '😌' :
                      entry.mood === 'feliz' ? '😊' :
                      entry.mood === 'cansado' ? '😴' :
                      entry.mood === 'confuso' ? '😕' :
                      entry.mood === 'esperançoso' ? '😇' : '🙂'
                    }</span>
                    <span className="font-medium">{entry.mood}</span>
                    <span className="text-xs text-gray-500">({entry.intensity}/10)</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Intl.DateTimeFormat('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    }).format(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAchievementsTab = () => {
    if (!gamificationData) return <div>Carregando conquistas...</div>;

    const { level, points, achievements, activeChallenges, streak, stats } = gamificationData;

    return (
      <div className="space-y-4">
        {/* Status do Usuário */}
        <div className={`p-4 rounded-lg text-white ${level.badgeColor}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{level.title}</h3>
            <span className="text-sm opacity-90">Nível {level.level}</span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{points} pontos</span>
              <span>{level.level < 10 ? `Próximo nível em breve` : 'Nível máximo!'}</span>
            </div>
          </div>
          <div className="text-xs opacity-80">
            🔥 {streak} dias consecutivos
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">{stats.sessionsCompleted || 0}</div>
            <div className="text-xs text-blue-700">Sessões</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{stats.exercisesCompleted || 0}</div>
            <div className="text-xs text-green-700">Exercícios</div>
          </div>
        </div>

        {/* Conquistas */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">🏆 Suas Conquistas</h4>
          {achievements.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Nenhuma conquista ainda. Continue praticando para desbloquear!
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-2 rounded border text-sm ${
                    achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                    achievement.rarity === 'epic' ? 'bg-purple-50 border-purple-200' :
                    achievement.rarity === 'rare' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 truncate">{achievement.title}</h5>
                      <p className="text-xs text-gray-600 truncate">{achievement.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">+{achievement.points}pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desafios Ativos */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">⚡ Desafios da Semana</h4>
          <div className="space-y-2">
            {activeChallenges.slice(0, 2).map((challenge) => (
              <div key={challenge.id} className="p-2 bg-orange-50 rounded border border-orange-200 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span>{challenge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-orange-800 truncate">{challenge.title}</h5>
                    <p className="text-xs text-orange-600 truncate">{challenge.description}</p>
                  </div>
                  <span className="text-xs bg-orange-200 text-orange-800 px-1 py-0.5 rounded">
                    +{challenge.rewards.points}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-orange-600">
                  <span>👥 {challenge.participants}</span>
                  <span>⏰ {Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderClinicalExercisesTab = () => {
    // Detectar protocolo sugerido baseado no perfil atual
    const currentSymptoms = messages
      .filter(msg => msg.role === 'user')
      .slice(-5) // Últimas 5 mensagens do usuário
      .map(msg => msg.content.toLowerCase())
      .join(' ');

    const symptomMatches = currentSymptoms.match(/ansiedade|depressão|medo|pânico|tristeza|preocupação|obsessão|compulsão|trauma|insônia/g);
    const extractedSymptoms = symptomMatches || [];
    
    let suggestedProtocol = '';
    if (extractedSymptoms.find(s => s === 'ansiedade' || s === 'medo')) {
      suggestedProtocol = 'F41.1'; // TAG
    } else if (extractedSymptoms.find(s => s === 'depressão' || s === 'tristeza')) {
      suggestedProtocol = 'F32.9'; // Depressão Maior
    } else if (extractedSymptoms.find(s => s === 'pânico')) {
      suggestedProtocol = 'F41.0'; // Transtorno de Pânico
    }

    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <ClinicalExercisesComponent
          protocolCode={suggestedProtocol}
          sessionNumber={messages.length}
          patientSymptoms={extractedSymptoms}
          onExerciseComplete={(exerciseId, results) => {
            const completedTask: TherapeuticTask = {
              id: Date.now().toString(),
              title: 'Exercício Clínico DSM-5 Completado',
              description: `Exercício ${exerciseId} concluído - Resultados: ${JSON.stringify(results)}`,
              type: 'behavioral_experiment',
              completed: true,
              createdAt: new Date()
            };
            setTherapeuticTasks(prev => [...prev, completedTask]);
          }}
          onExerciseStart={(exerciseId) => {
            console.log(`Iniciou exercício clínico: ${exerciseId}`);
          }}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 md:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base md:text-lg">🤖</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-sm md:text-base truncate">Clara - Assistente TCC</h2>
                <p className="text-xs md:text-sm opacity-90 hidden sm:block">Terapia Cognitivo-Comportamental</p>
              </div>
            </div>
            
            {/* Timer de Sessão */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {sessionActive ? (
                <div className="text-center">
                  <div className={`text-sm md:text-lg font-mono font-bold ${sessionTimeRemaining <= 300 ? 'text-yellow-300 animate-pulse' : ''}`}>
                    ⏰ {formatTimeRemaining(sessionTimeRemaining)}
                  </div>
                  <div className="text-xs opacity-75 hidden sm:block">
                    {sessionTimeRemaining <= 300 ? 'Finalizando...' : 'Sessão Ativa'}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs opacity-75 hidden sm:block">
                    {messages.length > 1 ? 'Sessão Pausada' : 'Sessão Inicial'}
                  </div>
                  <button 
                    onClick={startSessionTimer}
                    className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                  >
                    <span className="hidden sm:inline">{messages.length > 1 ? 'Retomar' : 'Iniciar'} </span>30min
                  </button>
                </div>
              )}
              
              {sessionActive && (
                <button 
                  onClick={endSession}
                  className="text-xs bg-red-500 bg-opacity-80 hover:bg-opacity-100 px-2 py-1 rounded transition-colors"
                  title="Encerrar sessão"
                >
                  <span className="hidden sm:inline">Finalizar</span>
                  <span className="sm:hidden">🔚</span>
                </button>
              )}
              
              {/* Botão Menu Mobile */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                title="Abrir menu"
              >
                {showMobileMenu ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4 min-h-0">
          {/* Contexto da Conversa - Compacto em mobile */}
          {messages.length > 3 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2 md:p-3 rounded-r-lg mb-3 md:mb-4">
              <div className="flex items-center gap-2 text-blue-800 text-sm">
                <span>📊</span>
                <span className="font-medium hidden sm:inline">Contexto da Conversa:</span>
                <span className="font-medium sm:hidden">Contexto:</span>
              </div>
              <div className="mt-1 text-xs text-blue-700 flex flex-wrap gap-1 md:gap-2">
                {(() => {
                  const lastMessage = messages[messages.length - 1];
                  const topics = lastMessage?.tccContext?.topicsDiscussed || [];
                  const technique = lastMessage?.tccContext?.technique;
                  const tone = lastMessage?.tccContext?.emotionalTone;
                  
                  return (
                    <>
                      {topics.length > 0 && (
                        <span className="bg-blue-100 px-1 md:px-2 py-1 rounded text-xs">
                          📋 <span className="hidden sm:inline">{topics[topics.length - 1]}</span>
                          <span className="sm:hidden">{topics[topics.length - 1].slice(0, 8)}...</span>
                        </span>
                      )}
                      {technique && technique !== 'conversational' && (
                        <span className="bg-green-100 px-1 md:px-2 py-1 rounded text-xs">
                          🔧 <span className="hidden sm:inline">
                            {technique === 'cognitive_restructuring' ? 'Reestruturação' :
                             technique === 'dbt_suggestion' ? 'DBT' :
                             technique === 'act_grief_suggestion' ? 'ACT' :
                             technique}
                          </span>
                          <span className="sm:hidden">
                            {technique === 'cognitive_restructuring' ? 'Reest.' :
                             technique === 'dbt_suggestion' ? 'DBT' :
                             technique === 'act_grief_suggestion' ? 'ACT' :
                             technique.slice(0, 5)}
                          </span>
                        </span>
                      )}
                      {tone && (
                        <span className="bg-yellow-100 px-1 md:px-2 py-1 rounded text-xs">
                          {tone === 'positive' ? '😊' :
                           tone === 'negative' ? '😔' :
                           tone === 'mixed' ? '😐' : '😌'}
                          <span className="hidden sm:inline ml-1">
                            {tone === 'positive' ? 'Positivo' :
                             tone === 'negative' ? 'Negativo' :
                             tone === 'mixed' ? 'Misto' : 'Neutro'}
                          </span>
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-2 md:p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{message.content}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 md:gap-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{formatTimestamp(message.timestamp)}</span>
                  
                  {message.tccContext?.technique && (
                    <span className="px-1 md:px-2 py-0.5 bg-black bg-opacity-10 rounded-full text-xs">
                      <span className="hidden sm:inline">
                        {message.tccContext.technique === 'conversational' ? '💬 Conversa' :
                         message.tccContext.technique === 'cognitive_restructuring' ? '🧠 Reestruturação Cognitiva' :
                         message.tccContext.technique === 'self_compassion' ? '💙 Autocompaixão' :
                         message.tccContext.technique === 'dbt_suggestion' ? '⚡ DBT Sugerido' :
                         message.tccContext.technique === 'act_grief_suggestion' ? '🌊 ACT para Luto' :
                         message.tccContext.technique === 'empathic_support' ? '🤗 Suporte Empático' :
                         message.tccContext.technique}
                      </span>
                      <span className="sm:hidden">
                        {message.tccContext.technique === 'conversational' ? '💬' :
                         message.tccContext.technique === 'cognitive_restructuring' ? '🧠' :
                         message.tccContext.technique === 'self_compassion' ? '💙' :
                         message.tccContext.technique === 'dbt_suggestion' ? '⚡' :
                         message.tccContext.technique === 'act_grief_suggestion' ? '🌊' :
                         message.tccContext.technique === 'empathic_support' ? '🤗' : '🔧'}
                      </span>
                    </span>
                  )}
                  
                  {message.tccContext?.emotionalTone && (
                    <span className="text-xs opacity-75">
                      {message.tccContext.emotionalTone === 'positive' ? '😊' :
                       message.tccContext.emotionalTone === 'negative' ? '😔' :
                       message.tccContext.emotionalTone === 'mixed' ? '😐' : '😌'}
                    </span>
                  )}
                  
                  {message.tccContext?.topicsDiscussed && message.tccContext.topicsDiscussed.length > 0 && (
                    <span className="text-xs opacity-75 hidden sm:inline">
                      📋 {message.tccContext.topicsDiscussed.slice(-1)[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-2 md:p-4 border-t border-gray-200 bg-white">
          {/* Sugestões contextuais - compactas em mobile */}
          {messages.length > 2 && (
            <div className="mb-2 md:mb-3 flex flex-wrap gap-1 md:gap-2 max-h-20 overflow-y-auto">
              {(() => {
                const lastMessage = messages[messages.length - 1];
                const tone = lastMessage?.tccContext?.emotionalTone;
                const technique = lastMessage?.tccContext?.technique;
                
                let suggestions: string[] = [];
                
                if (tone === 'negative') {
                  suggestions = [
                    "Como isso me afeta?",
                    "O que posso fazer?",
                    "Preciso de ajuda"
                  ];
                } else if (tone === 'positive') {
                  suggestions = [
                    "O que me ajudou?",
                    "Como manter isso?",
                    "Quero falar mais"
                  ];
                } else if (technique === 'cognitive_restructuring') {
                  suggestions = [
                    "Tem evidências?",
                    "Pode ser diferente?",
                    "Outro ângulo?"
                  ];
                }
                
                return suggestions.slice(0, window.innerWidth < 768 ? 2 : 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-2 md:px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors touch-manipulation"
                  >
                    💡 <span className="hidden sm:inline">{suggestion}</span>
                    <span className="sm:hidden">{suggestion.length > 15 ? suggestion.slice(0, 15) + '...' : suggestion}</span>
                  </button>
                ));
              })()}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                messages.length === 1 ? "Como você está se sentindo hoje?" :
                messages.length < 3 ? "Me conte mais sobre isso..." :
                sessionTimeRemaining < 300 ? "Vamos encerrar... o que mais é importante?" :
                "Continue compartilhando..."
              }
              className="flex-1 p-3 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 touch-manipulation"
            >
              <span className="hidden sm:inline">Enviar</span>
              <span className="sm:hidden">📤</span>
            </button>
          </div>
        </div>
      </div>

      {/* Painel TCC */}
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'chat', label: '💬', title: 'Chat' },
            { key: 'beliefs', label: '🧠', title: 'Crenças' },
            { key: 'tasks', label: '�', title: 'Tarefas' },
            { key: 'exercises', label: '🧘', title: 'Exercícios' },
            { key: 'achievements', label: '🏆', title: 'Conquistas' },
            { key: 'progress', label: '📊', title: 'Progresso' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              title={tab.title}
            >
              <span className="block text-lg">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">📊 Resumo da Sessão</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                  <div className="text-xs text-blue-700">Mensagens</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{beliefProfile.coreBeliefs.length}</div>
                  <div className="text-xs text-green-700">Crenças</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Anotações da Sessão:</h4>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Adicione suas anotações pessoais..."
                  className="w-full h-24 p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          {activeTab === 'beliefs' && renderBeliefProfile()}
          {activeTab === 'tasks' && renderTherapeuticTasks()}
          {activeTab === 'exercises' && renderExercisesTab()}
          {activeTab === 'clinical' && renderClinicalExercisesTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
          {activeTab === 'progress' && renderProgressTab()}
          {activeTab === 'analytics' && <AnalyticsDashboard userId={user?.id || 'guest'} />}
        </div>
      </div>
      
      {/* Painel TCC - Desktop */}
      <div className="hidden lg:block w-80 border-l border-gray-200 bg-gray-50">
        {/* Resto do painel TCC permanece igual */}
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'chat', label: '💬', title: 'Chat' },
            { key: 'beliefs', label: '🧠', title: 'Crenças' },
            { key: 'tasks', label: '📝', title: 'Tarefas' },
            { key: 'exercises', label: '🧘', title: 'Exercícios' },
            { key: 'achievements', label: '🏆', title: 'Conquistas' },
            { key: 'progress', label: '📊', title: 'Progresso' },
            { key: 'analytics', label: '📈', title: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              title={tab.title}
            >
              <span className="block text-lg">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                  <div className="text-xs text-blue-700">Mensagens</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{thoughtRecords.length}</div>
                  <div className="text-xs text-purple-700">Registros</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{beliefProfile.coreBeliefs.length}</div>
                  <div className="text-xs text-green-700">Crenças</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Anotações da Sessão:</h4>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Adicione suas anotações pessoais..."
                  className="w-full h-24 p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          {activeTab === 'beliefs' && renderBeliefProfile()}
          {activeTab === 'tasks' && renderTherapeuticTasks()}
          {activeTab === 'exercises' && renderExercisesTab()}
          {activeTab === 'clinical' && renderClinicalExercisesTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
          {activeTab === 'progress' && renderProgressTab()}
          {activeTab === 'analytics' && <AnalyticsDashboard userId={user?.id || 'guest'} />}
        </div>
      </div>
      
      {/* Menu Mobile Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header do Mobile Menu */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>
            
            {/* Tabs Mobile */}
            <div className="grid grid-cols-3 gap-2 p-4">
              {[
                { key: 'beliefs', label: '🧠', title: 'Crenças', desc: 'Padrões identificados' },
                { key: 'tasks', label: '📝', title: 'Tarefas', desc: 'Exercícios pendentes' },
                { key: 'exercises', label: '🧘', title: 'Exercícios', desc: 'Prática terapêutica' },
                { key: 'achievements', label: '🏆', title: 'Conquistas', desc: 'Seu progresso' },
                { key: 'progress', label: '📊', title: 'Progresso', desc: 'Estatísticas' },
                { key: 'analytics', label: '📈', title: 'Analytics', desc: 'Análise avançada' },
                { key: 'clinical', label: '🔬', title: 'Clínico', desc: 'Protocolos DSM-5' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as any);
                    setShowMobileMenu(false);
                  }}
                  className="p-3 bg-gray-50 rounded-lg border text-center hover:bg-blue-50 transition-colors touch-manipulation"
                >
                  <div className="text-2xl mb-1">{tab.label}</div>
                  <div className="text-sm font-medium text-gray-700">{tab.title}</div>
                  <div className="text-xs text-gray-500">{tab.desc}</div>
                </button>
              ))}
              
              {/* Botão de Notificações */}
              <button
                onClick={() => {
                  setShowNotificationSettings(true);
                  setShowMobileMenu(false);
                }}
                className="p-3 bg-gray-50 rounded-lg border text-center hover:bg-blue-50 transition-colors touch-manipulation relative"
              >
                <div className="text-2xl mb-1 relative">
                  🔔
                  {notifications.isEnabled && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700">Notificações</div>
                <div className="text-xs text-gray-500">
                  {notifications.isEnabled ? 'Ativas' : 'Configurar'}
                </div>
              </button>
            </div>
            
            {/* Quick Stats Mobile */}
            <div className="p-4 bg-gray-50 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">{messages.length}</div>
                <div className="text-xs text-gray-600">Mensagens</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">{thoughtRecords.length}</div>
                <div className="text-xs text-gray-600">Registros</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{beliefProfile.coreBeliefs.length}</div>
                <div className="text-xs text-gray-600">Crenças</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Configurações de Notificação */}
      <NotificationSettings 
        isVisible={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  );
}