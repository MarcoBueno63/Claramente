'use client';

import { useState, useEffect } from 'react';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        
        if (sub) {
          setIsSubscribed(true);
          setSubscription(await convertSubscription(sub));
        }
      } catch (error) {
        console.error('[Notifications] Error checking subscription:', error);
      }
    }
  };

  const convertSubscription = async (sub: globalThis.PushSubscription): Promise<PushSubscription> => {
    const key = sub.getKey('p256dh');
    const token = sub.getKey('auth');
    
    return {
      endpoint: sub.endpoint,
      keys: {
        p256dh: key ? arrayBufferToBase64(key) : '',
        auth: token ? arrayBufferToBase64(token) : '',
      },
    };
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.error('[Notifications] Browser não suporta notificações');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[Notifications] Error requesting permission:', error);
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('[Notifications] Push messaging não suportado');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID public key (você deve gerar isso no servidor)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
      
      if (!vapidPublicKey) {
        console.warn('[Notifications] VAPID key não configurada');
        // Para desenvolvimento, ainda permitir subscribe sem VAPID
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey ? urlBase64ToUint8Array(vapidPublicKey) as any : undefined,
      });

      const convertedSub = await convertSubscription(sub);
      setSubscription(convertedSub);
      setIsSubscribed(true);

      // Salvar subscription no backend
      await saveSubscription(convertedSub);

      return true;
    } catch (error) {
      console.error('[Notifications] Error subscribing:', error);
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();

      if (sub) {
        await sub.unsubscribe();
        setIsSubscribed(false);
        setSubscription(null);

        // Remover subscription do backend
        await removeSubscription(subscription?.endpoint || '');

        return true;
      }
      return false;
    } catch (error) {
      console.error('[Notifications] Error unsubscribing:', error);
      return false;
    }
  };

  const showLocalNotification = async (
    title: string,
    options?: NotificationOptions
  ): Promise<boolean> => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: '/icon-192x192.png',
          badge: '/icon-96x96.png',
          ...options,
        });
      } else {
        new Notification(title, {
          icon: '/icon-192x192.png',
          ...options,
        });
      }
      return true;
    } catch (error) {
      console.error('[Notifications] Error showing notification:', error);
      return false;
    }
  };

  // Tipos de notificações pré-configuradas
  const sendSessionReminder = () => {
    return showLocalNotification('Claramente 🧠', {
      body: 'Hora da sua sessão de autoconhecimento!',
      tag: 'session-reminder',
      requireInteraction: true,
    });
  };

  const sendStreakCelebration = (days: number) => {
    return showLocalNotification(`Parabéns! 🎉`, {
      body: `Você manteve sua sequência de ${days} dias!`,
      tag: 'streak-celebration',
    });
  };

  const sendWeeklyCheckIn = () => {
    return showLocalNotification('Check-in Semanal 📊', {
      body: 'Como você está se sentindo esta semana?',
      tag: 'weekly-checkin',
    });
  };

  const sendInsightReady = () => {
    return showLocalNotification('Insight Descoberto! 💡', {
      body: 'Identificamos um padrão interessante no seu processo',
      tag: 'insight-ready',
    });
  };

  return {
    permission,
    isSubscribed,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    showLocalNotification,
    // Helpers pré-configurados
    sendSessionReminder,
    sendStreakCelebration,
    sendWeeklyCheckIn,
    sendInsightReady,
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function saveSubscription(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });
  } catch (error) {
    console.error('[Notifications] Error saving subscription:', error);
  }
}

async function removeSubscription(endpoint: string): Promise<void> {
  try {
    await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    });
  } catch (error) {
    console.error('[Notifications] Error removing subscription:', error);
  }
}
