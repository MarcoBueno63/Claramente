// AnalyticsDashboard.tsx
// Dashboard Visual de Analytics - Claramente
// Gráficos interativos, métricas de progresso e insights comportamentais

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getAnalytics, SessionAnalytics, UserBehaviorPattern, TherapeuticInsight } from '../lib/analytics';

interface AnalyticsDashboardProps {
  userId: string;
}

interface ChartData {
  labels: string[];
  data: number[];
  colors: string[];
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const analytics = getAnalytics();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [behaviorPattern, setBehaviorPattern] = useState<UserBehaviorPattern | null>(null);
  const [insights, setInsights] = useState<TherapeuticInsight[]>([]);
  const [sessions, setSessions] = useState<SessionAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [userId, timeframe]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Carregar dados
      const pattern = analytics.generateBehaviorPattern(userId, timeframe);
      const userInsights = analytics.getUserInsights(userId);
      const userSessions = analytics.getUserSessions(userId);

      setBehaviorPattern(pattern);
      setInsights(userInsights.filter(i => !i.acknowledged));
      setSessions(userSessions);
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dados processados para os gráficos
  const chartData = useMemo(() => {
    if (!behaviorPattern || !sessions.length) return null;

    // Gráfico de Humor ao Longo do Tempo
    const moodChart: ChartData = {
      labels: behaviorPattern.metrics.emotionalTrend.map(e => 
        new Date(e.date).toLocaleDateString('pt-BR', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      data: behaviorPattern.metrics.emotionalTrend.map(e => e.mood),
      colors: behaviorPattern.metrics.emotionalTrend.map(e => {
        if (e.mood >= 8) return '#10b981'; // Verde
        if (e.mood >= 6) return '#f59e0b'; // Amarelo
        if (e.mood >= 4) return '#ef4444'; // Vermelho
        return '#6b7280'; // Cinza
      })
    };

    // Gráfico de Atividade por Hora
    const activityChart: ChartData = {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      data: Array.from({ length: 24 }, (_, hour) => {
        return sessions.filter(s => 
          new Date(s.startTime).getHours() === hour
        ).length;
      }),
      colors: Array.from({ length: 24 }, (_, hour) => 
        behaviorPattern.metrics.mostActiveHours.includes(hour) ? '#3b82f6' : '#e5e7eb'
      )
    };

    // Gráfico de Tópicos Discutidos
    const topicsChart: ChartData = {
      labels: behaviorPattern.metrics.mostDiscussedTopics.map(t => t.topic),
      data: behaviorPattern.metrics.mostDiscussedTopics.map(t => t.frequency),
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    };

    return {
      mood: moodChart,
      activity: activityChart,
      topics: topicsChart
    };
  }, [behaviorPattern, sessions]);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };

  const getMoodEmoji = (mood: number): string => {
    if (mood >= 8) return '😄';
    if (mood >= 6) return '😊';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getInsightIcon = (type: TherapeuticInsight['type']): string => {
    switch (type) {
      case 'pattern_detection': return '🔍';
      case 'trigger_identification': return '⚠️';
      case 'progress_milestone': return '🎯';
      case 'concern_alert': return '🚨';
      default: return '💡';
    }
  };

  const getSeverityColor = (severity: TherapeuticInsight['severity']): string => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Analisando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!behaviorPattern || !sessions.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Dados Insuficientes
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Continue usando o Claramente para gerar insights e análises personalizadas sobre seu progresso.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📊 Analytics</h2>
          <p className="text-gray-600">Análise do seu progresso terapêutico</p>
        </div>
        
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period === 'daily' ? 'Hoje' : period === 'weekly' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Sessões</p>
              <p className="text-2xl font-bold text-blue-800">
                {behaviorPattern.metrics.totalSessions}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Sequência</p>
              <p className="text-2xl font-bold text-green-800">
                {behaviorPattern.metrics.streakCurrent}
              </p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Tempo Médio</p>
              <p className="text-2xl font-bold text-purple-800">
                {formatDuration(behaviorPattern.metrics.avgSessionDuration)}
              </p>
            </div>
            <div className="text-2xl">⏱️</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Progresso</p>
              <p className="text-2xl font-bold text-yellow-800">
                {behaviorPattern.metrics.progressionRate > 0 ? '+' : ''}
                {behaviorPattern.metrics.progressionRate.toFixed(1)}
              </p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Humor */}
      {chartData?.mood && chartData.mood.data.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📈 Evolução do Humor
          </h3>
          <div className="h-48 flex items-end space-x-2">
            {chartData.mood.data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${(value / 10) * 100}%`,
                    backgroundColor: chartData.mood.colors[index]
                  }}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {chartData.mood.labels[index]}
                </span>
                <span className="text-lg">
                  {getMoodEmoji(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Gráficos Menores */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Atividade por Horário */}
        {chartData?.activity && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ⏰ Atividade por Horário
            </h3>
            <div className="h-32 flex items-end space-x-1">
              {chartData.activity.data.map((value, index) => {
                const maxValue = Math.max(...chartData.activity.data);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
                        backgroundColor: chartData.activity.colors[index]
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-1">
                      {index % 4 === 0 ? `${index}h` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
              Horários mais ativos: {behaviorPattern.metrics.mostActiveHours.map(h => `${h}h`).join(', ')}
            </div>
          </div>
        )}

        {/* Tópicos Mais Discutidos */}
        {chartData?.topics && chartData.topics.data.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🗣️ Tópicos Discutidos
            </h3>
            <div className="space-y-3">
              {chartData.topics.labels.map((label, index) => {
                const value = chartData.topics.data[index];
                const maxValue = Math.max(...chartData.topics.data);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 capitalize">{label}</span>
                      <span className="text-gray-500">{value}x</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(value / maxValue) * 100}%`,
                          backgroundColor: chartData.topics.colors[index % chartData.topics.colors.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Insights Pendentes */}
      {insights.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Insights Recentes
          </h3>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(insight.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm mb-2">{insight.description}</p>
                    {insight.recommendations.length > 0 && (
                      <div className="text-sm">
                        <strong>Recomendações:</strong>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {insight.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      analytics.acknowledgeInsight(insight.id);
                      loadAnalyticsData();
                    }}
                    className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                  >
                    ✓ OK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exportar Dados */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">📁 Exportar Dados</h3>
            <p className="text-sm text-gray-600">
              Baixe seus dados para análise externa ou compartilhamento com terapeuta
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const data = analytics.exportData(userId, 'json');
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `claramente-dados-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              📄 JSON
            </button>
            <button
              onClick={() => {
                const data = analytics.exportData(userId, 'csv');
                const blob = new Blob([data], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `claramente-sessoes-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
            >
              📊 CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}