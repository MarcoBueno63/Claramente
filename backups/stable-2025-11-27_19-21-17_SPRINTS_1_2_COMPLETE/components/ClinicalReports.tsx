"use client";
import React, { useState, useEffect } from 'react';
import { 
  ClinicalReportsService, 
  ProgressReport, 
  SessionData, 
  AssessmentResult,
  createProgressReport,
  createSessionReport,
  createAssessmentReport,
  createAnalyticsDashboard
} from '../lib/clinical-reports';

interface ClinicalReportsProps {
  patientId: string;
}

export default function ClinicalReports({ patientId }: ClinicalReportsProps) {
  const [activeTab, setActiveTab] = useState<'progress' | 'session' | 'assessment' | 'analytics'>('progress');
  const [loading, setLoading] = useState(false);
  const [progressReport, setProgressReport] = useState<ProgressReport | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const reportsService = ClinicalReportsService.getInstance();

  useEffect(() => {
    if (activeTab === 'progress') {
      generateProgressReport();
    } else if (activeTab === 'analytics') {
      generateAnalyticsData();
    }
  }, [activeTab, patientId, selectedPeriod]);

  const generateProgressReport = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Últimos 3 meses
      
      const report = await createProgressReport(patientId, startDate, endDate);
      setProgressReport(report);
    } catch (error) {
      console.error('Erro ao gerar relatório de progresso:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await reportsService.generateAnalyticsDashboard(patientId, selectedPeriod);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Erro ao gerar dados analíticos:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ 
    tab, 
    icon, 
    label, 
    isActive 
  }: { 
    tab: string; 
    icon: string; 
    label: string; 
    isActive: boolean; 
  }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  const ProgressReportView = () => (
    <div className="space-y-6">
      {/* Header do Relatório */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">📊 Relatório de Progresso</h2>
        <p className="text-blue-100">
          Análise abrangente do desenvolvimento terapêutico
        </p>
        {progressReport && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span>📅 {progressReport.startDate.toLocaleDateString()} - {progressReport.endDate.toLocaleDateString()}</span>
            <span>🗓️ {progressReport.totalSessions} sessões</span>
            <span>✅ {progressReport.completedExercises} exercícios</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Gerando relatório...</p>
          </div>
        </div>
      ) : progressReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progresso dos Objetivos */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎯 Progresso dos Objetivos
            </h3>
            <div className="space-y-4">
              {progressReport.goalProgress.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{goal.goal}</span>
                    <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {goal.progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    goal.status === 'Atingido' ? 'bg-green-100 text-green-800' :
                    goal.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evolução das Avaliações */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📈 Evolução das Avaliações
            </h3>
            <div className="space-y-4">
              {Object.entries(progressReport.assessmentProgress.improvement).map(([type, improvement]) => (
                <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{type}</span>
                  <span className={`font-bold ${
                    improvement > 0 ? 'text-green-600' : 
                    improvement < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                    {improvement > 0 ? ' ⬆️' : improvement < 0 ? ' ⬇️' : ' ➡️'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo e Recomendações */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📋 Resumo e Recomendações
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-blue-900 mb-2">Resumo Geral</h4>
                <p className="text-gray-700">{progressReport.summary}</p>
              </div>
              
              {progressReport.recommendations.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-medium text-amber-900 mb-3">Recomendações</h4>
                  <ul className="space-y-2">
                    {progressReport.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-amber-600 mt-1">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Nenhum dado disponível para o período selecionado
        </div>
      )}
    </div>
  );

  const SessionReportView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">🗣️ Relatórios de Sessão</h2>
        <p className="text-green-100">
          Análise detalhada de sessões individuais
        </p>
      </div>

      {/* Mock de relatório de sessão */}
      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Sessão #12 - 12/11/2025</h3>
          <p className="text-sm text-gray-600">Duração: 50 minutos | Humor: 7/10 | Ansiedade: 4/10</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Tópicos Principais */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              🔍 Tópicos Principais
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Ansiedade Social', 'Relacionamento', 'Autoestima'].map((topic) => (
                <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Estado Emocional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                😊 Estado Emocional
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Humor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                    <span className="text-sm font-medium">7/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ansiedade</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <span className="text-sm font-medium">4/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Intervenções Utilizadas */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                🛠️ Intervenções Utilizadas
              </h4>
              <ul className="space-y-2">
                {['Reestruturação Cognitiva', 'Relaxamento Progressivo', 'Análise de Situações'].map((intervention) => (
                  <li key={intervention} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">{intervention}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Plano para Próxima Sessão */}
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-medium text-purple-900 mb-3">📅 Plano para Próxima Sessão</h4>
            <ul className="space-y-2">
              {[
                'Revisar exercícios de exposição gradual',
                'Trabalhar autoafirmações positivas',
                'Introduzir técnicas de mindfulness'
              ].map((plan, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-purple-600 mt-1">•</span>
                  {plan}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const AssessmentReportView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">📊 Relatórios de Avaliação</h2>
        <p className="text-purple-100">
          Análise compilada de todos os instrumentos de avaliação
        </p>
      </div>

      {/* Tendência Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'PHQ-9 (Depressão)', trend: 'Melhora', value: '12 → 7', color: 'green' },
          { title: 'GAD-7 (Ansiedade)', trend: 'Estável', value: '8 → 8', color: 'yellow' },
          { title: 'Beck (Autoestima)', trend: 'Melhora', value: '15 → 21', color: 'green' }
        ].map((assessment) => (
          <div key={assessment.title} className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="font-semibold text-gray-800 mb-2">{assessment.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                assessment.color === 'green' ? 'bg-green-100 text-green-800' :
                assessment.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {assessment.trend}
              </span>
              <span className={`text-lg ${
                assessment.color === 'green' ? '⬆️' :
                assessment.color === 'yellow' ? '➡️' : '⬇️'
              }`}>
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{assessment.value}</p>
            <p className="text-sm text-gray-600 mt-1">Últimos 3 meses</p>
          </div>
        ))}
      </div>

      {/* Análise Detalhada */}
      <div className="bg-white rounded-xl shadow-md border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">📈 Análise Temporal</h3>
        </div>
        <div className="p-6">
          {/* Gráfico simulado */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end gap-2 h-full">
              {[12, 11, 10, 9, 8, 7].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8 mb-2"
                    style={{ height: `${(value / 15) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600">Mês {index + 1}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600">Gráfico de Evolução</p>
                <p className="text-sm text-gray-500">PHQ-9: Tendência de Melhora</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          💡 Recomendações Baseadas nas Avaliações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
              ✅ Pontos Fortes
            </h4>
            <ul className="space-y-2">
              {[
                'Melhoria consistente no humor',
                'Redução dos sintomas depressivos',
                'Maior engajamento no tratamento'
              ].map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
              ⚠️ Áreas de Atenção
            </h4>
            <ul className="space-y-2">
              {[
                'Níveis de ansiedade mantidos elevados',
                'Necessidade de foco em técnicas específicas',
                'Monitoramento contínuo recomendado'
              ].map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-amber-600 mt-1">•</span>
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">📊 Dashboard Analítico</h2>
            <p className="text-indigo-100">
              Métricas e insights do tratamento
            </p>
          </div>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
          </select>
        </div>
      </div>

      {/* Métricas Principais */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🗓️</span>
              <span className="text-sm text-green-600 font-medium">+{analyticsData.sessionMetrics.frequency.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{analyticsData.sessionMetrics.frequency.reduce((a: number, b: number) => a + b, 0)}</h3>
            <p className="text-sm text-gray-600">Sessões Realizadas</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm text-green-600 font-medium">+{(Object.values(analyticsData.exerciseCompletion) as number[]).reduce((a, b) => a + b, 0) - 30}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{(Object.values(analyticsData.exerciseCompletion) as number[]).reduce((a, b) => a + b, 0)}</h3>
            <p className="text-sm text-gray-600">Exercícios Completados</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">😊</span>
              <span className="text-sm text-green-600 font-medium">+{(analyticsData.sessionMetrics.mood.reduce((a: number, b: number) => a + b, 0) / analyticsData.sessionMetrics.mood.length - 5).toFixed(1)}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{(analyticsData.sessionMetrics.mood.reduce((a: number, b: number) => a + b, 0) / analyticsData.sessionMetrics.mood.length).toFixed(1)}/10</h3>
            <p className="text-sm text-gray-600">Humor Médio</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📈</span>
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">87%</h3>
            <p className="text-sm text-gray-600">Aderência</p>
          </div>
        </div>
      )}

      {/* Gráficos de Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📈 Evolução do Humor
          </h3>
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600">Gráfico de Linha</p>
              <p className="text-sm text-gray-500">Tendência: Melhora Gradual</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🎯 Conclusão de Exercícios
          </h3>
          <div className="space-y-3">
            {analyticsData && Object.entries(analyticsData.exerciseCompletion).map(([name, completed]: [string, any]) => {
              const total = Math.round(completed * 1.3); // Estimativa do total proposto
              return (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{name}</span>
                    <span>{completed}/{total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            💡 Insights Inteligentes
          </h3>
          <div className="space-y-3">
            {analyticsData && analyticsData.insights.map((insight: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-lg">💡</span>
                <span className="text-sm text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🚨 Alertas e Recomendações
          </h3>
          <div className="space-y-3">
            {analyticsData && analyticsData.alerts.map((alert: any, index: number) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                alert.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                'bg-amber-50 border border-amber-200'
              }`}>
                <span className="text-lg">
                  {alert.type === 'success' ? '✅' : alert.type === 'info' ? 'ℹ️' : '⚠️'}
                </span>
                <span className={`text-sm ${
                  alert.type === 'success' ? 'text-green-800' :
                  alert.type === 'info' ? 'text-blue-800' :
                  'text-amber-800'
                }`}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📋 Relatórios Clínicos
          </h1>
          <p className="text-gray-600">
            Sistema completo de análise e acompanhamento terapêutico
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton 
            tab="progress" 
            icon="📊" 
            label="Progresso Geral" 
            isActive={activeTab === 'progress'} 
          />
          <TabButton 
            tab="session" 
            icon="🗣️" 
            label="Relatórios de Sessão" 
            isActive={activeTab === 'session'} 
          />
          <TabButton 
            tab="assessment" 
            icon="📋" 
            label="Avaliações" 
            isActive={activeTab === 'assessment'} 
          />
          <TabButton 
            tab="analytics" 
            icon="📈" 
            label="Analytics" 
            isActive={activeTab === 'analytics'} 
          />
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === 'progress' && <ProgressReportView />}
          {activeTab === 'session' && <SessionReportView />}
          {activeTab === 'assessment' && <AssessmentReportView />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </div>

        {/* Export Options */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors flex items-center gap-2">
            📄 Exportar PDF
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors flex items-center gap-2">
            📊 Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
}