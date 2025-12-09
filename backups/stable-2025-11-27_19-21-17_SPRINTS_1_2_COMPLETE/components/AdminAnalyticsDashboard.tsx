// components/AdminAnalyticsDashboard.tsx - Dashboard Analytics para Administradores
// Interface completa para monitoramento e otimização da plataforma terapêutica

"use client";
import React, { useState, useEffect } from 'react';
import { analyticsService, PlatformMetrics, ConversationAnalytics, TherapeuticInsights } from '../lib/analytics-service';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-70">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="mr-1">
                {trend.isPositive ? '↗️' : '↘️'}
              </span>
              <span className="font-medium">{Math.abs(trend.value)}%</span>
              <span className="ml-1 opacity-70">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, actions }) => (
  <div className="bg-white rounded-lg border shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {actions}
    </div>
    {children}
  </div>
);

export default function AdminAnalyticsDashboard() {
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [conversationAnalytics, setConversationAnalytics] = useState<ConversationAnalytics | null>(null);
  const [therapeuticInsights, setTherapeuticInsights] = useState<TherapeuticInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = analyticsService.exportAnalyticsData();
      setPlatformMetrics(data.platform);
      setConversationAnalytics(data.conversations);
      setTherapeuticInsights(data.insights);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitoramento e insights da plataforma terapêutica ClaraMente
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Última atualização: {lastRefresh.toLocaleString('pt-BR')}
          </p>
        </div>
        
        <button
          onClick={loadAnalytics}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Atualizar</span>
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Usuários Totais"
          value={formatNumber(platformMetrics?.totalUsers || 0)}
          subtitle={`${platformMetrics?.activeUsers || 0} ativos (30d)`}
          icon="👥"
          color="blue"
        />
        
        <MetricCard
          title="Sessões Realizadas"
          value={formatNumber(platformMetrics?.totalSessions || 0)}
          subtitle={`${(platformMetrics?.averageSessionsPerUser || 0).toFixed(1)} por usuário`}
          icon="💬"
          color="green"
        />
        
        <MetricCard
          title="Duração Média"
          value={formatDuration(platformMetrics?.averageSessionDuration || 0)}
          subtitle="Por sessão"
          icon="⏱️"
          color="purple"
        />
        
        <MetricCard
          title="Taxa de Sucesso"
          value={`${(platformMetrics?.successfulSessionsRate || 0).toFixed(1)}%`}
          subtitle="Sessões com melhoria"
          icon="🎯"
          color="green"
        />
      </div>

      {/* Métricas de Crescimento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Novos Usuários Hoje"
          value={platformMetrics?.newUsersToday || 0}
          icon="🌟"
          color="yellow"
        />
        
        <MetricCard
          title="Esta Semana"
          value={platformMetrics?.newUsersThisWeek || 0}
          icon="📅"
          color="indigo"
        />
        
        <MetricCard
          title="Este Mês"
          value={platformMetrics?.newUsersThisMonth || 0}
          icon="📊"
          color="purple"
        />
        
        <MetricCard
          title="Taxa de Retenção"
          value={`${(platformMetrics?.userRetentionRate || 0).toFixed(1)}%`}
          subtitle="Usuários que voltaram"
          icon="🔄"
          color={platformMetrics && platformMetrics.userRetentionRate > 50 ? "green" : "yellow"}
        />
      </div>

      {/* Análise de Conversações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emoções Mais Trabalhadas */}
        <ChartCard title="🎭 Emoções Mais Trabalhadas">
          <div className="space-y-4">
            {conversationAnalytics?.topEmotions.slice(0, 6).map((emotion, index) => (
              <div key={emotion.emotion} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-800">
                    {index + 1}
                  </div>
                  <span className="font-medium capitalize">{emotion.emotion}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (emotion.frequency / Math.max(...conversationAnalytics.topEmotions.map(e => e.frequency))) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {emotion.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Técnicas Mais Eficazes */}
        <ChartCard title="🧠 Técnicas Terapêuticas">
          <div className="space-y-4">
            {conversationAnalytics?.techniqueEffectiveness.slice(0, 6).map((technique, index) => (
              <div key={technique.technique} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">{technique.technique}</span>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-600 font-bold">
                      +{technique.averageMoodImprovement.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({technique.usageFrequency}x)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (technique.averageMoodImprovement + 5) * 10)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Distribuição de Riscos e Horários de Pico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribuição de Níveis de Risco */}
        <ChartCard title="⚠️ Distribuição de Níveis de Risco">
          <div className="space-y-4">
            {conversationAnalytics && Object.entries(conversationAnalytics.riskLevelDistribution).map(([level, count]) => {
              const colors = {
                minimal: 'bg-green-500',
                moderate: 'bg-yellow-500', 
                high: 'bg-orange-500',
                critical: 'bg-red-500'
              };
              
              const labels = {
                minimal: 'Mínimo',
                moderate: 'Moderado',
                high: 'Alto',
                critical: 'Crítico'
              };
              
              const total = Object.values(conversationAnalytics.riskLevelDistribution).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${colors[level as keyof typeof colors]}`}></div>
                    <span className="font-medium">{labels[level as keyof typeof labels]}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[level as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-16 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Horários de Pico */}
        <ChartCard title="🕐 Horários de Maior Atividade">
          <div className="space-y-3">
            {conversationAnalytics?.peakHours.slice(0, 8).map((hourData) => (
              <div key={hourData.hour} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-12 text-sm font-medium">
                    {hourData.hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                <div className="flex items-center space-x-3 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (hourData.sessionCount / Math.max(...conversationAnalytics.peakHours.map(h => h.sessionCount))) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">
                    {hourData.sessionCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Insights e Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recomendações */}
        <ChartCard title="💡 Recomendações de Melhoria">
          <div className="space-y-4">
            {therapeuticInsights?.recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                <p className="text-xs text-green-600 font-medium">
                  📈 Impacto esperado: {rec.expectedImpact}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Benchmarks da Indústria */}
        <ChartCard title="📊 Performance vs Indústria">
          <div className="space-y-6">
            {therapeuticInsights?.benchmarks && Object.entries({
              'Duração da Sessão': {
                our: platformMetrics?.averageSessionDuration || 0,
                industry: therapeuticInsights.benchmarks.industryAverageSessionDuration,
                performance: therapeuticInsights.benchmarks.ourPerformanceVsIndustry.sessionDuration,
                format: (val: number) => formatDuration(val)
              },
              'Taxa de Retenção': {
                our: platformMetrics?.userRetentionRate || 0,
                industry: therapeuticInsights.benchmarks.industryRetentionRate,
                performance: therapeuticInsights.benchmarks.ourPerformanceVsIndustry.retention,
                format: (val: number) => `${val.toFixed(1)}%`
              }
            }).map(([metric, data]) => (
              <div key={metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{metric}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    data.performance === 'above' ? 'bg-green-100 text-green-800' :
                    data.performance === 'below' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {data.performance === 'above' ? 'Acima' : 
                     data.performance === 'below' ? 'Abaixo' : 'Na Média'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nossa Performance:</span>
                    <div className="font-semibold text-blue-600">{data.format(data.our)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Média da Indústria:</span>
                    <div className="font-semibold text-gray-700">{data.format(data.industry)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Footer com Export */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Dashboard Analytics ClaraMente - Dados atualizados automaticamente
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          📊 Exportar Relatório
        </button>
      </div>
    </div>
  );
}