// Service Worker para Push Notifications
// Sistema Claramente - Notificações Inteligentes

const CACHE_NAME = 'claramente-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker ativado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// ===== SISTEMA DE NOTIFICAÇÕES =====

// Listener para Push Events
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  
  let notificationData = {
    title: 'Claramente 🧠',
    body: 'Hora da sua sessão de autoconhecimento!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: 'session-reminder',
    renotify: true,
    requireInteraction: true,
    actions: [
      {
        action: 'start',
        title: '🚀 Iniciar Sessão',
        icon: '/icon-start.png'
      },
      {
        action: 'delay',
        title: '⏰ Lembrar em 15min',
        icon: '/icon-delay.png'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now(),
      type: 'session-reminder'
    }
  };

  // Parse dos dados se enviados pelo servidor
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.log('[SW] Erro ao parsear dados push:', error);
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    notificationData
  );

  event.waitUntil(promiseChain);
});

// Listener para cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event.notification.tag);
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'start') {
    // Abrir app e iniciar sessão
    event.waitUntil(
      clients.openWindow('/?start=true')
    );
  } else if (action === 'delay') {
    // Agendar nova notificação em 15 minutos
    console.log('[SW] Agendando lembrete em 15 minutos');
    setTimeout(() => {
      self.registration.showNotification(
        'Claramente 🧠 - Lembrete',
        {
          body: 'Sua pausa de 15 minutos acabou. Que tal começar agora?',
          icon: '/icon-192x192.png',
          tag: 'delayed-reminder',
          requireInteraction: true,
          data: { url: '/', type: 'delayed-reminder' }
        }
      );
    }, 15 * 60 * 1000); // 15 minutos
  } else {
    // Clique no corpo da notificação - apenas abrir app
    event.waitUntil(
      clients.openWindow(notificationData.url || '/')
    );
  }
});

// ===== NOTIFICAÇÕES INTELIGENTES =====

// Tipos de notificações suportadas
const NOTIFICATION_TYPES = {
  SESSION_REMINDER: 'session-reminder',
  STREAK_CELEBRATION: 'streak-celebration',
  WEEKLY_CHECK_IN: 'weekly-checkin',
  INSIGHT_READY: 'insight-ready',
  EXERCISE_SUGGESTION: 'exercise-suggestion',
  PROGRESS_MILESTONE: 'progress-milestone'
};

// Templates de notificações
const NOTIFICATION_TEMPLATES = {
  [NOTIFICATION_TYPES.SESSION_REMINDER]: {
    title: 'Claramente 🧠',
    body: 'Sua mente está esperando por um momento de clareza',
    icon: '/icon-brain.png',
    actions: [
      { action: 'start', title: '🚀 Vamos lá!' },
      { action: 'delay', title: '⏰ Depois' }
    ]
  },
  
  [NOTIFICATION_TYPES.STREAK_CELEBRATION]: {
    title: 'Parabéns! 🎉',
    body: 'Você manteve sua sequência de {days} dias!',
    icon: '/icon-celebration.png',
    actions: [
      { action: 'continue', title: '💪 Continuar' },
      { action: 'share', title: '🎊 Compartilhar' }
    ]
  },
  
  [NOTIFICATION_TYPES.WEEKLY_CHECK_IN]: {
    title: 'Check-in Semanal 📊',
    body: 'Como você está se sentindo esta semana?',
    icon: '/icon-checkin.png',
    actions: [
      { action: 'checkin', title: '💭 Avaliar Humor' },
      { action: 'later', title: '⏰ Mais tarde' }
    ]
  },
  
  [NOTIFICATION_TYPES.INSIGHT_READY]: {
    title: 'Insight Descoberto! 💡',
    body: 'Identificamos um padrão interessante no seu processo',
    icon: '/icon-insight.png',
    actions: [
      { action: 'view', title: '👀 Ver Insight' },
      { action: 'save', title: '📖 Salvar para depois' }
    ]
  }
};

// Função para criar notificação inteligente
function createSmartNotification(type, data = {}) {
  const template = NOTIFICATION_TEMPLATES[type];
  if (!template) {
    console.error('[SW] Tipo de notificação desconhecido:', type);
    return null;
  }

  // Substituir placeholders no template
  let body = template.body;
  Object.keys(data).forEach(key => {
    body = body.replace(`{${key}}`, data[key]);
  });

  return {
    title: template.title,
    body: body,
    icon: template.icon,
    badge: '/icon-96x96.png',
    tag: type,
    renotify: true,
    requireInteraction: type === NOTIFICATION_TYPES.SESSION_REMINDER,
    actions: template.actions,
    data: {
      url: '/',
      type: type,
      timestamp: Date.now(),
      ...data
    }
  };
}

// ===== AGENDAMENTO INTELIGENTE =====

// Função para calcular próximo lembrete baseado em padrões de uso
function calculateNextReminder(userPattern) {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Horários preferenciais padrão
  const defaultTimes = [9, 14, 19]; // 9h, 14h, 19h
  
  // Se temos padrão do usuário, usar horários personalizados
  const preferredTimes = userPattern?.preferredHours || defaultTimes;
  
  // Encontrar próximo horário preferencial
  let nextHour = preferredTimes.find(hour => hour > currentHour);
  
  // Se não há horário hoje, usar primeiro horário de amanhã
  if (!nextHour) {
    nextHour = preferredTimes[0];
    now.setDate(now.getDate() + 1);
  }
  
  now.setHours(nextHour, 0, 0, 0);
  return now;
}

// Message handler para comandos do app principal
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SCHEDULE_REMINDER':
      scheduleNotification(NOTIFICATION_TYPES.SESSION_REMINDER, data);
      break;
      
    case 'CELEBRATE_STREAK':
      showNotification(NOTIFICATION_TYPES.STREAK_CELEBRATION, data);
      break;
      
    case 'WEEKLY_CHECKIN':
      showNotification(NOTIFICATION_TYPES.WEEKLY_CHECK_IN, data);
      break;
      
    case 'NEW_INSIGHT':
      showNotification(NOTIFICATION_TYPES.INSIGHT_READY, data);
      break;
      
    default:
      console.log('[SW] Comando desconhecido:', type);
  }
});

// Função para agendar notificação
function scheduleNotification(type, data) {
  const notification = createSmartNotification(type, data);
  if (!notification) return;
  
  // Por enquanto, mostrar imediatamente (em produção usaríamos agendamento real)
  setTimeout(() => {
    self.registration.showNotification(notification.title, notification);
  }, data.delay || 0);
}

// Função para mostrar notificação imediatamente
function showNotification(type, data) {
  const notification = createSmartNotification(type, data);
  if (!notification) return;
  
  self.registration.showNotification(notification.title, notification);
}

console.log('[SW] Service Worker do Sistema Claramente carregado! 🧠✨');