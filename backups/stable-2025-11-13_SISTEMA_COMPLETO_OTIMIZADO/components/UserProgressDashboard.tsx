// components/UserProgressDashboard.tsx - Dashboard de Progresso do Usuário
// Exibe métricas, sessões passadas e insights terapêuticos

"use client";
import React, { useState } from 'react';
import { useAuthenticatedUser, useUserProgress } from '../hooks/useAuthenticatedUser';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default function UserProgressDashboard() {
  const userAuth = useAuthenticatedUser();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const { progress, loading: progressLoading } = useUserProgress(userAuth.user?.id, selectedPeriod);

  if (userAuth.loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userAuth.user) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Login Necessário
          </h2>
          <p className="text-gray-600 mb-6">
            Faça login para visualizar seu progresso terapêutico, histórico de sessões e insights personalizados.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const periodLabels = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias',
    'all': 'Todo o período'
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatMoodChange = (change: number): { text: string; color: 'green' | 'red' | 'yellow' } => {
    if (change > 0.5) return { text: `+${change.toFixed(1)}`, color: 'green' };
    if (change < -0.5) return { text: change.toFixed(1), color: 'red' };
    return { text: 'Estável', color: 'yellow' };
  };

  const moodChange = formatMoodChange(progress?.moodImprovement || 0);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {userAuth.user.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Veja como está sua jornada terapêutica
          </p>
        </div>
        
        <div className="flex space-x-2">
          {Object.entries(periodLabels).map(([period, label]) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard
          title="Sessões Realizadas"
          value={progress?.totalSessions || 0}
          subtitle={`${userAuth.sessionHistory.length} no total`}
          icon="💬"
          color="blue"
        />
        
        <ProgressCard
          title="Tempo de Terapia"
          value={formatDuration(progress?.averageSessionDuration || 0)}
          subtitle="Duração média"
          icon="⏱️"
          color="green"
        />
        
        <ProgressCard
          title="Melhoria do Humor"
          value={moodChange.text}
          subtitle="Escala 1-10"
          icon="😊"
          color={moodChange.color}
        />
        
        <ProgressCard
          title="Sessões Restantes"
          value={userAuth.canStartNewSession ? 5 - userAuth.user.freeSessionsUsed : 0}
          subtitle="Plano gratuito"
          icon="🎯"
          color={userAuth.canStartNewSession ? 'purple' : 'red'}
        />
      </div>

      {/* Emoções Mais Trabalhadas */}
      {progress && progress.dominantEmotions.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎭 Emoções Mais Trabalhadas
          </h2>
          <div className="space-y-3">
            {progress.dominantEmotions.slice(0, 5).map((emotion, index) => (
              <div key={emotion.emotion} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                    {index + 1}
                  </div>
                  <span className="font-medium capitalize">{emotion.emotion}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (emotion.frequency / Math.max(...progress.dominantEmotions.map(e => e.frequency))) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {emotion.frequency}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Técnicas Mais Eficazes */}
      {progress && progress.mostEffectiveTechniques.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧠 Técnicas Mais Eficazes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {progress.mostEffectiveTechniques.map((technique, index) => (
              <div key={technique} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-green-800">{technique}</span>
                </div>
                <p className="text-sm text-green-700">
                  Técnica que mostrou bons resultados em suas sessões
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Sessões Recentes */}
      {userAuth.sessionHistory.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📅 Sessões Recentes
          </h2>
          <div className="space-y-4">
            {userAuth.sessionHistory.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {session.messages.length}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(session.startTime).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDuration(session.duration)} • {session.messages.length} mensagens
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {session.moodBefore && session.moodAfter && (
                      <p className="text-sm font-medium">
                        Humor: {session.moodBefore} → {session.moodAfter}
                        <span className={`ml-2 ${
                          session.moodAfter > session.moodBefore ? 'text-green-600' : 
                          session.moodAfter < session.moodBefore ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {session.moodAfter > session.moodBefore ? '↗️' : 
                           session.moodAfter < session.moodBefore ? '↘️' : '➡️'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                
                {session.emotionsIdentified.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {session.emotionsIdentified.slice(0, 3).map((emotion) => (
                      <span
                        key={emotion}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {emotion}
                      </span>
                    ))}
                    {session.emotionsIdentified.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{session.emotionsIdentified.length - 3} mais
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!userAuth.canStartNewSession && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Continue sua jornada! 🌟
              </h3>
              <p className="opacity-90">
                Você usou todas as sessões gratuitas. Considere nosso plano premium para continuar.
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Ver Planos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}