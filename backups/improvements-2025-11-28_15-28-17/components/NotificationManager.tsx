// NotificationManager.tsx
// Sistema de Notificações Inteligentes - Claramente
// Gerencia push notifications, lembretes e celebrações

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface NotificationPermission {
  status: 'default' | 'granted' | 'denied';
  supported: boolean;
}

interface NotificationSettings {
  sessionReminders: boolean;
  streakCelebrations: boolean;
  weeklyCheckIns: boolean;
  insightAlerts: boolean;
  reminderTimes: number[]; // Array de horas [9, 14, 19]
  quietHours: { start: number; end: number }; // {start: 22, end: 8}
  enabled: boolean;
}

interface UserPattern {
  preferredHours: number[];
  averageSessionDuration: number;
  streakCount: number;
  lastSessionTime: Date;
  totalSessions: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  sessionReminders: true,
  streakCelebrations: true,
  weeklyCheckIns: true,
  insightAlerts: true,
  reminderTimes: [9, 14, 19],
  quietHours: { start: 22, end: 8 },
  enabled: false
};

export default function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>({
    status: 'default',
    supported: false
  });
  
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isRegistering, setIsRegistering] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState<Date | null>(null);
  const swRegistration = useRef<ServiceWorkerRegistration | null>(null);

  // ===== INICIALIZAÇÃO =====

  useEffect(() => {
    initializeNotificationSystem();
    loadUserSettings();
  }, []);

  const initializeNotificationSystem = async () => {
    // Verificar suporte a notificações
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    
    if (!supported) {
      console.warn('[NotifManager] Push notifications não suportadas');
      return;
    }

    // Registrar Service Worker
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      swRegistration.current = registration;
      console.log('[NotifManager] Service Worker registrado:', registration);
      
      // Verificar permissão atual
      const currentPermission = Notification.permission;
      setPermission({
        status: currentPermission,
        supported: true
      });
      
      // Se já temos permissão, habilitar notificações
      if (currentPermission === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
      }
      
    } catch (error) {
      console.error('[NotifManager] Erro ao registrar SW:', error);
    }
  };

  const loadUserSettings = () => {
    try {
      const saved = localStorage.getItem('claramente-notification-settings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.error('[NotifManager] Erro ao carregar configurações:', error);
    }
  };

  // ===== GERENCIAMENTO DE PERMISSÕES =====

  const requestPermission = async () => {
    if (!permission.supported) {
      alert('Push notifications não são suportadas neste navegador');
      return false;
    }

    setIsRegistering(true);
    
    try {
      const result = await Notification.requestPermission();
      
      setPermission(prev => ({ ...prev, status: result }));
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        saveSettings({ ...settings, enabled: true });
        console.log('[NotifManager] Permissão concedida! ✅');
        
        // Mostrar notificação de boas-vindas
        await showWelcomeNotification();
        return true;
      } else {
        console.warn('[NotifManager] Permissão negada');
        return false;
      }
    } catch (error) {
      console.error('[NotifManager] Erro ao solicitar permissão:', error);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const showWelcomeNotification = async () => {
    if (!swRegistration.current) return;
    
    try {
      const options: NotificationOptions = {
        body: 'Notificações ativadas! Vamos juntos nessa jornada de autoconhecimento.',
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png',
        tag: 'welcome',
        requireInteraction: false
      };

      // Adicionar actions se suportado
      if ('actions' in Notification.prototype) {
        (options as any).actions = [
          { action: 'start', title: '🚀 Começar agora' }
        ];
      }

      await swRegistration.current.showNotification('Claramente 🧠', options);
    } catch (error) {
      console.error('[NotifManager] Erro ao mostrar notificação de boas-vindas:', error);
    }
  };

  // ===== CONFIGURAÇÕES =====

  const saveSettings = (newSettings: NotificationSettings) => {
    try {
      localStorage.setItem('claramente-notification-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('[NotifManager] Erro ao salvar configurações:', error);
    }
  };

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...settings, ...updates };
    saveSettings(newSettings);
  };

  // ===== NOTIFICAÇÕES INTELIGENTES =====

  const sendMessageToSW = (type: string, data: any = {}) => {
    if (!swRegistration.current) {
      console.warn('[NotifManager] Service Worker não registrado');
      return;
    }

    swRegistration.current.active?.postMessage({ type, data });
  };

  const scheduleSessionReminder = useCallback((delayMinutes = 30) => {
    if (!settings.enabled || !settings.sessionReminders) return;

    const now = new Date();
    const currentHour = now.getHours();
    
    // Verificar quiet hours
    const { start: quietStart, end: quietEnd } = settings.quietHours;
    const isQuietTime = (currentHour >= quietStart) || (currentHour <= quietEnd);
    
    if (isQuietTime) {
      console.log('[NotifManager] Horário silencioso - lembrete não agendado');
      return;
    }

    console.log(`[NotifManager] Agendando lembrete em ${delayMinutes} minutos`);
    
    sendMessageToSW('SCHEDULE_REMINDER', {
      delay: delayMinutes * 60 * 1000,
      scheduledFor: new Date(Date.now() + delayMinutes * 60 * 1000)
    });
    
    setLastNotificationTime(new Date());
  }, [settings]);

  const celebrateStreak = useCallback((streakDays: number) => {
    if (!settings.enabled || !settings.streakCelebrations) return;

    console.log(`[NotifManager] Celebrando streak de ${streakDays} dias!`);
    
    sendMessageToSW('CELEBRATE_STREAK', {
      days: streakDays,
      message: getStreakMessage(streakDays)
    });
  }, [settings]);

  const sendWeeklyCheckIn = useCallback(() => {
    if (!settings.enabled || !settings.weeklyCheckIns) return;

    console.log('[NotifManager] Enviando check-in semanal');
    
    sendMessageToSW('WEEKLY_CHECKIN', {
      week: getWeekNumber(),
      previousCheckin: getLastCheckInData()
    });
  }, [settings]);

  const notifyNewInsight = useCallback((insightType: string, description: string) => {
    if (!settings.enabled || !settings.insightAlerts) return;

    console.log('[NotifManager] Novo insight disponível:', insightType);
    
    sendMessageToSW('NEW_INSIGHT', {
      type: insightType,
      description: description,
      timestamp: Date.now()
    });
  }, [settings]);

  // ===== UTILITÁRIOS =====

  const getStreakMessage = (days: number): string => {
    if (days === 1) return 'Primeiro dia de jornada! 🌱';
    if (days === 7) return 'Uma semana inteira de autoconhecimento! 🌟';
    if (days === 30) return 'Um mês de crescimento pessoal! 🏆';
    if (days === 100) return 'Centenário de reflexão! 🎯';
    if (days % 10 === 0) return `${days} dias de dedicação incrível! 💎`;
    return `${days} dias de evolução contínua! ✨`;
  };

  const getWeekNumber = (): number => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getLastCheckInData = () => {
    try {
      const saved = localStorage.getItem('claramente-last-checkin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const formatLastNotification = (): string => {
    if (!lastNotificationTime) return 'Nunca';
    
    const now = new Date();
    const diff = now.getTime() - lastNotificationTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'agora mesmo';
  };

  // ===== API PÚBLICA =====

  const publicAPI = {
    requestPermission,
    scheduleSessionReminder,
    celebrateStreak,
    sendWeeklyCheckIn,
    notifyNewInsight,
    updateSettings,
    settings,
    permission,
    isEnabled: settings.enabled && permission.status === 'granted',
    lastNotification: formatLastNotification()
  };

  return publicAPI;
}

// ===== HOOKS PERSONALIZADOS =====

export function useNotifications() {
  const notificationManager = NotificationManager();
  
  // Auto-agendar lembretes baseado em padrões de uso
  useEffect(() => {
    if (!notificationManager.isEnabled) return;

    const scheduleNextReminder = () => {
      // Lógica inteligente para próximo lembrete
      const userPattern = getUserPattern();
      const nextReminderTime = calculateOptimalReminderTime(userPattern);
      
      if (nextReminderTime) {
        const delayMinutes = Math.floor(
          (nextReminderTime.getTime() - Date.now()) / (1000 * 60)
        );
        
        if (delayMinutes > 0 && delayMinutes <= 24 * 60) {
          notificationManager.scheduleSessionReminder(delayMinutes);
        }
      }
    };

    // Agendar no mount e a cada hora
    scheduleNextReminder();
    const interval = setInterval(scheduleNextReminder, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [notificationManager.isEnabled]);

  return notificationManager;
}

// ===== FUNCÕES AUXILIARES =====

function getUserPattern(): UserPattern {
  try {
    const saved = localStorage.getItem('claramente-user-pattern');
    return saved ? JSON.parse(saved) : {
      preferredHours: [9, 14, 19],
      averageSessionDuration: 20,
      streakCount: 0,
      lastSessionTime: new Date(),
      totalSessions: 0
    };
  } catch {
    return {
      preferredHours: [9, 14, 19],
      averageSessionDuration: 20,
      streakCount: 0,
      lastSessionTime: new Date(),
      totalSessions: 0
    };
  }
}

function calculateOptimalReminderTime(pattern: UserPattern): Date | null {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Encontrar próximo horário preferencial
  const nextHour = pattern.preferredHours.find(hour => hour > currentHour);
  
  if (nextHour) {
    const nextReminder = new Date();
    nextReminder.setHours(nextHour, 0, 0, 0);
    return nextReminder;
  }
  
  // Se não há horário hoje, primeiro horário de amanhã
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(pattern.preferredHours[0], 0, 0, 0);
  return tomorrow;
}

export type { NotificationSettings, UserPattern };