// NotificationSettings.tsx
// Interface de Configuração de Notificações - Claramente
// Painel de controle granular para personalização de lembretes

'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from './NotificationManager';

interface NotificationSettingsProps {
  onClose?: () => void;
  isVisible?: boolean;
}

export default function NotificationSettings({ onClose, isVisible = true }: NotificationSettingsProps) {
  const notifications = useNotifications();
  const [tempSettings, setTempSettings] = useState(notifications.settings);

  useEffect(() => {
    setTempSettings(notifications.settings);
  }, [notifications.settings]);

  const handleSave = () => {
    notifications.updateSettings(tempSettings);
    onClose?.();
  };

  const handleReset = () => {
    setTempSettings(notifications.settings);
  };

  const toggleTime = (hour: number) => {
    const times = tempSettings.reminderTimes;
    const newTimes = times.includes(hour)
      ? times.filter(t => t !== hour)
      : [...times, hour].sort((a, b) => a - b);
    
    setTempSettings(prev => ({
      ...prev,
      reminderTimes: newTimes
    }));
  };

  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0') + ':00';
  };

  const getTimeEmoji = (hour: number) => {
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 22) return '🌆';
    return '🌙';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">🔔 Notificações</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Status das Notificações */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Status do Sistema</h3>
              <div className={`w-3 h-3 rounded-full ${
                notifications.isEnabled ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Permissão:</span>
                <span className={`font-medium ${
                  notifications.permission.status === 'granted' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {notifications.permission.status === 'granted' ? 'Concedida' : 
                   notifications.permission.status === 'denied' ? 'Negada' : 'Não solicitada'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Suporte:</span>
                <span className={`font-medium ${
                  notifications.permission.supported ? 'text-green-600' : 'text-red-600'
                }`}>
                  {notifications.permission.supported ? 'Sim' : 'Não'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última notificação:</span>
                <span className="font-medium text-gray-800">
                  {notifications.lastNotification}
                </span>
              </div>
            </div>

            {!notifications.isEnabled && notifications.permission.supported && (
              <button
                onClick={notifications.requestPermission}
                className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🔔 Ativar Notificações
              </button>
            )}
          </div>

          {/* Configurações de Tipos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Tipos de Notificação</h3>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">⏰</span>
                <div>
                  <div className="font-medium">Lembretes de Sessão</div>
                  <div className="text-sm text-gray-600">Momentos ideais para praticar</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tempSettings.sessionReminders}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  sessionReminders: e.target.checked
                }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎉</span>
                <div>
                  <div className="font-medium">Celebrações de Sequência</div>
                  <div className="text-sm text-gray-600">Marcos de consistência</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tempSettings.streakCelebrations}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  streakCelebrations: e.target.checked
                }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="font-medium">Check-ins Semanais</div>
                  <div className="text-sm text-gray-600">Avaliação do progresso</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tempSettings.weeklyCheckIns}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  weeklyCheckIns: e.target.checked
                }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">💡</span>
                <div>
                  <div className="font-medium">Novos Insights</div>
                  <div className="text-sm text-gray-600">Padrões descobertos</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={tempSettings.insightAlerts}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  insightAlerts: e.target.checked
                }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Horários de Lembretes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Horários Preferenciais</h3>
            <p className="text-sm text-gray-600">
              Selecione os momentos do dia que funcionam melhor para você
            </p>
            
            <div className="grid grid-cols-4 gap-2">
              {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(hour => (
                <button
                  key={hour}
                  onClick={() => toggleTime(hour)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    tempSettings.reminderTimes.includes(hour)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div>{getTimeEmoji(hour)}</div>
                  <div className="text-xs">{formatHour(hour)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Horário Silencioso */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Horário Silencioso</h3>
            <p className="text-sm text-gray-600">
              Período sem notificações para descanso
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🌙 Início
                </label>
                <select
                  value={tempSettings.quietHours.start}
                  onChange={(e) => setTempSettings(prev => ({
                    ...prev,
                    quietHours: {
                      ...prev.quietHours,
                      start: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {formatHour(i)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🌅 Fim
                </label>
                <select
                  value={tempSettings.quietHours.end}
                  onChange={(e) => setTempSettings(prev => ({
                    ...prev,
                    quietHours: {
                      ...prev.quietHours,
                      end: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {formatHour(i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Teste de Notificação */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Teste de Notificação</h3>
            <p className="text-sm text-blue-600 mb-3">
              Envie uma notificação de teste para verificar se tudo está funcionando
            </p>
            <button
              onClick={() => notifications.scheduleSessionReminder(0.1)} // 6 segundos
              disabled={!notifications.isEnabled}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🧪 Enviar Notificação Teste
            </button>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleReset}
              className="flex-1 py-2 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              🔄 Resetar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              💾 Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}