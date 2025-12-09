// components/ClinicalMonitoring.tsx - Interface do Sistema de Monitoramento Clínico
// Dashboard completo para tracking de sintomas, humor e progresso terapêutico

"use client";
import React, { useState, useEffect } from 'react';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { 
  clinicalMonitoringService, 
  ClinicalScale, 
  AssessmentResponse,
  MoodEntry,
  ProgressMetrics,
  ScaleQuestion
} from '../lib/clinical-monitoring';

interface MonitoringState {
  activeTab: 'dashboard' | 'assessments' | 'mood' | 'progress' | 'alerts';
  selectedScale?: ClinicalScale;
  assessmentInProgress?: {
    scaleId: string;
    currentQuestionIndex: number;
    responses: Record<string, number>;
    startTime: Date;
  };
  showResults?: AssessmentResponse;
}

export default function ClinicalMonitoring() {
  const userAuth = useAuthenticatedUser();
  const [state, setState] = useState<MonitoringState>({ activeTab: 'dashboard' });
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const [recentAssessments, setRecentAssessments] = useState<AssessmentResponse[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [alerts, setAlerts] = useState<any>(null);

  // Carregar dados iniciais
  useEffect(() => {
    if (userAuth.user?.id) {
      loadDashboardData();
    }
  }, [userAuth.user?.id]);

  const loadDashboardData = () => {
    if (!userAuth.user?.id) return;

    const metrics = clinicalMonitoringService.calculateProgressMetrics(userAuth.user.id);
    const assessments = clinicalMonitoringService.getAssessmentHistory(userAuth.user.id).slice(0, 10);
    const mood = clinicalMonitoringService.getMoodEntries(userAuth.user.id, 14);
    const alertsData = clinicalMonitoringService.detectAlerts(userAuth.user.id);

    setProgressMetrics(metrics);
    setRecentAssessments(assessments);
    setMoodEntries(mood);
    setAlerts(alertsData);
  };

  const startAssessment = (scale: ClinicalScale) => {
    setState(prev => ({
      ...prev,
      selectedScale: scale,
      assessmentInProgress: {
        scaleId: scale.id,
        currentQuestionIndex: 0,
        responses: {},
        startTime: new Date()
      }
    }));
  };

  const answerQuestion = (questionId: string, answer: number) => {
    setState(prev => ({
      ...prev,
      assessmentInProgress: prev.assessmentInProgress ? {
        ...prev.assessmentInProgress,
        responses: {
          ...prev.assessmentInProgress.responses,
          [questionId]: answer
        }
      } : undefined
    }));
  };

  const nextQuestion = () => {
    if (!state.selectedScale || !state.assessmentInProgress) return;

    const nextIndex = state.assessmentInProgress.currentQuestionIndex + 1;
    
    if (nextIndex >= state.selectedScale.questions.length) {
      completeAssessment();
    } else {
      setState(prev => ({
        ...prev,
        assessmentInProgress: prev.assessmentInProgress ? {
          ...prev.assessmentInProgress,
          currentQuestionIndex: nextIndex
        } : undefined
      }));
    }
  };

  const completeAssessment = () => {
    if (!state.selectedScale || !state.assessmentInProgress || !userAuth.user?.id) return;

    const { totalScore, subscaleScores, interpretation } = clinicalMonitoringService.calculateScore(
      state.selectedScale.id,
      state.assessmentInProgress.responses
    );

    const response: AssessmentResponse = {
      userId: userAuth.user.id,
      scaleId: state.selectedScale.id,
      sessionId: userAuth.currentSession?.id,
      completedAt: new Date(),
      responses: state.assessmentInProgress.responses,
      totalScore,
      subscaleScores,
      severity: interpretation.severity,
      interpretation,
      timeToComplete: Math.floor((Date.now() - state.assessmentInProgress.startTime.getTime()) / 1000),
      context: 'progress'
    };

    clinicalMonitoringService.saveAssessmentResponse(response);
    
    setState(prev => ({
      ...prev,
      showResults: response,
      assessmentInProgress: undefined,
      selectedScale: undefined
    }));

    loadDashboardData();
  };

  const saveMoodEntry = (moodData: Partial<MoodEntry>) => {
    if (!userAuth.user?.id) return;

    const entry: MoodEntry = {
      userId: userAuth.user.id,
      date: new Date(),
      overallMood: moodData.overallMood || 5,
      anxiety: moodData.anxiety || 5,
      depression: moodData.depression || 5,
      energy: moodData.energy || 5,
      sleep: moodData.sleep || 5,
      socialConnection: moodData.socialConnection || 5,
      tags: moodData.tags || [],
      notes: moodData.notes,
      activities: moodData.activities,
      triggers: moodData.triggers,
      copingStrategies: moodData.copingStrategies
    };

    clinicalMonitoringService.saveMoodEntry(entry);
    loadDashboardData();
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'urgent': return 'bg-red-100 border-red-400 text-red-800';
      case 'concern': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'watch': return 'bg-blue-100 border-blue-400 text-blue-800';
      default: return 'bg-green-100 border-green-400 text-green-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'very_severe':
      case 'severe': return 'text-red-600 bg-red-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'mild': return 'text-blue-600 bg-blue-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  // Se está mostrando resultados
  if (state.showResults) {
    return <AssessmentResults 
      result={state.showResults} 
      onClose={() => setState(prev => ({ ...prev, showResults: undefined }))} 
    />;
  }

  // Se tem avaliação em progresso
  if (state.assessmentInProgress && state.selectedScale) {
    return <AssessmentInterface 
      scale={state.selectedScale}
      progress={state.assessmentInProgress}
      onAnswer={answerQuestion}
      onNext={nextQuestion}
      onCancel={() => setState(prev => ({ ...prev, assessmentInProgress: undefined, selectedScale: undefined }))}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Monitoramento Clínico
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe seu progresso terapêutico através de escalas validadas e métricas personalizadas
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'dashboard', label: 'Visão Geral', icon: '📊' },
                { key: 'assessments', label: 'Avaliações', icon: '📋' },
                { key: 'mood', label: 'Humor Diário', icon: '😊' },
                { key: 'progress', label: 'Progresso', icon: '📈' },
                { key: 'alerts', label: 'Alertas', icon: '⚠️' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setState(prev => ({ ...prev, activeTab: tab.key as any }))}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    state.activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {state.activeTab === 'dashboard' && (
              <DashboardTab 
                metrics={progressMetrics}
                recentAssessments={recentAssessments}
                moodEntries={moodEntries}
                alerts={alerts}
                onStartAssessment={startAssessment}
              />
            )}

            {state.activeTab === 'assessments' && (
              <AssessmentsTab onStartAssessment={startAssessment} />
            )}

            {state.activeTab === 'mood' && (
              <MoodTab 
                moodEntries={moodEntries}
                onSaveMood={saveMoodEntry}
              />
            )}

            {state.activeTab === 'progress' && (
              <ProgressTab metrics={progressMetrics} />
            )}

            {state.activeTab === 'alerts' && (
              <AlertsTab alerts={alerts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab do Dashboard
function DashboardTab({ 
  metrics, 
  recentAssessments, 
  moodEntries, 
  alerts, 
  onStartAssessment 
}: {
  metrics: ProgressMetrics | null;
  recentAssessments: AssessmentResponse[];
  moodEntries: MoodEntry[];
  alerts: any;
  onStartAssessment: (scale: ClinicalScale) => void;
}) {
  const scales = [
    clinicalMonitoringService.getScale('phq_9'),
    clinicalMonitoringService.getScale('gad_7'),
    clinicalMonitoringService.getScale('daily_mood')
  ].filter(Boolean) as ClinicalScale[];

  return (
    <div className="space-y-8">
      {/* Alertas */}
      {alerts && alerts.level !== 'none' && (
        <div className={`p-4 rounded-lg border-2 ${
          alerts.level === 'urgent' ? 'bg-red-50 border-red-200' :
          alerts.level === 'concern' ? 'bg-yellow-50 border-yellow-200' : 
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">
              {alerts.level === 'urgent' ? '🚨' : alerts.level === 'concern' ? '⚠️' : 'ℹ️'}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">
                {alerts.level === 'urgent' ? 'Atenção Urgente Necessária' :
                 alerts.level === 'concern' ? 'Acompanhamento Recomendado' : 'Monitoramento'}
              </h3>
              {alerts.alerts.length > 0 && (
                <ul className="mt-2 text-sm space-y-1">
                  {alerts.alerts.map((alert: string, index: number) => (
                    <li key={index}>• {alert}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scales.map(scale => (
            <button
              key={scale.id}
              onClick={() => onStartAssessment(scale)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {scale.category === 'depression' ? '😔' :
                   scale.category === 'anxiety' ? '😰' :
                   scale.category === 'mood' ? '😊' : '📊'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{scale.shortName}</h3>
                  <p className="text-sm text-gray-600">~{scale.estimatedDuration} min</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Métricas Recentes */}
      {recentAssessments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimas Avaliações</h2>
          <div className="space-y-3">
            {recentAssessments.slice(0, 5).map((assessment, index) => {
              const scale = clinicalMonitoringService.getScale(assessment.scaleId);
              return (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{scale?.shortName}</h3>
                      <p className="text-sm text-gray-600">
                        {assessment.completedAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {assessment.totalScore}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        assessment.interpretation.severity === 'severe' || assessment.interpretation.severity === 'very_severe' ? 'bg-red-100 text-red-800' :
                        assessment.interpretation.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        assessment.interpretation.severity === 'mild' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assessment.interpretation.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Humor Recente */}
      {moodEntries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Humor Recente</h2>
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {(['overallMood', 'anxiety', 'energy', 'sleep', 'socialConnection'] as const).map(metric => (
                <div key={metric}>
                  <div className="text-2xl font-bold text-blue-600">
                    {typeof moodEntries[0]?.[metric] === 'number' ? moodEntries[0][metric] : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {metric === 'overallMood' ? 'Humor' :
                     metric === 'anxiety' ? 'Ansiedade' :
                     metric === 'energy' ? 'Energia' :
                     metric === 'sleep' ? 'Sono' : 'Social'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab de Avaliações
function AssessmentsTab({ onStartAssessment }: { onStartAssessment: (scale: ClinicalScale) => void }) {
  const scales = [
    clinicalMonitoringService.getScale('phq_9'),
    clinicalMonitoringService.getScale('gad_7'),
    clinicalMonitoringService.getScale('daily_mood')
  ].filter(Boolean) as ClinicalScale[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Escalas Clínicas Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scales.map(scale => (
            <div key={scale.id} className="bg-white p-6 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{scale.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{scale.description}</p>
                </div>
                <div className="text-3xl">
                  {scale.category === 'depression' ? '😔' :
                   scale.category === 'anxiety' ? '😰' :
                   scale.category === 'mood' ? '😊' : '📊'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duração:</span>
                  <span>{scale.estimatedDuration} minutos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequência:</span>
                  <span className="capitalize">
                    {scale.administrationFrequency === 'weekly' ? 'Semanal' :
                     scale.administrationFrequency === 'daily' ? 'Diário' :
                     scale.administrationFrequency === 'monthly' ? 'Mensal' : 'Conforme necessário'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Perguntas:</span>
                  <span>{scale.questions.length} itens</span>
                </div>
              </div>

              <button
                onClick={() => onStartAssessment(scale)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Iniciar Avaliação
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tab de Humor
function MoodTab({ 
  moodEntries, 
  onSaveMood 
}: { 
  moodEntries: MoodEntry[];
  onSaveMood: (mood: Partial<MoodEntry>) => void;
}) {
  const [todayMood, setTodayMood] = useState<Partial<MoodEntry>>({
    overallMood: 5,
    anxiety: 5,
    energy: 5,
    sleep: 5,
    socialConnection: 5,
    tags: [],
    notes: ''
  });

  const today = new Date().toDateString();
  const hasEntryToday = moodEntries.some(entry => entry.date.toDateString() === today);

  const handleSave = () => {
    onSaveMood(todayMood);
    // Reset form ou mostrar confirmação
  };

  return (
    <div className="space-y-8">
      {/* Entrada de Hoje */}
      {!hasEntryToday && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Como você está se sentindo hoje?</h2>
          
          <div className="space-y-6">
            {([
              { key: 'overallMood', label: 'Humor Geral', icon: '😊' },
              { key: 'anxiety', label: 'Ansiedade', icon: '😰' },
              { key: 'energy', label: 'Energia', icon: '⚡' },
              { key: 'sleep', label: 'Qualidade do Sono', icon: '😴' },
              { key: 'socialConnection', label: 'Conexão Social', icon: '👥' }
            ] as const).map(metric => {
              const currentValue = typeof todayMood[metric.key] === 'number' ? todayMood[metric.key] : 5;
              return (
                <div key={metric.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="mr-2">{metric.icon}</span>
                    {metric.label}
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentValue}
                      onChange={(e) => setTodayMood(prev => ({
                        ...prev,
                        [metric.key]: parseInt(e.target.value)
                      }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">10</span>
                    <div className="w-8 text-center font-semibold text-blue-600">
                      {currentValue}
                    </div>
                  </div>
                </div>
              );
            })}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={todayMood.notes || ''}
                onChange={(e) => setTodayMood(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Como foi seu dia? O que influenciou seu humor?"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Salvar Entrada de Hoje
            </button>
          </div>
        </div>
      )}

      {/* Histórico */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Humor</h2>
        {moodEntries.length > 0 ? (
          <div className="space-y-3">
            {moodEntries.slice(0, 14).map((entry, index) => (
              <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    {entry.date.toLocaleDateString('pt-BR')}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      Humor: {entry.overallMood}/10
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">😰 Ansiedade:</span>
                    <span className="ml-2 font-medium">{entry.anxiety}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-600">⚡ Energia:</span>
                    <span className="ml-2 font-medium">{entry.energy}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-600">😴 Sono:</span>
                    <span className="ml-2 font-medium">{entry.sleep}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-600">👥 Social:</span>
                    <span className="ml-2 font-medium">{entry.socialConnection}/10</span>
                  </div>
                </div>

                {entry.notes && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma entrada de humor ainda.</p>
            <p className="text-sm">Comece registrando como você se sente hoje!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab de Progresso
function ProgressTab({ metrics }: { metrics: ProgressMetrics | null }) {
  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Dados insuficientes para análise de progresso.</p>
        <p className="text-sm text-gray-400">Complete algumas avaliações para ver seu progresso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendências das Escalas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.assessmentScores.map((score, index) => {
            const scale = clinicalMonitoringService.getScale(score.scaleId);
            return (
              <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">{scale?.shortName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pontuação Atual:</span>
                    <span className="font-medium">{score.current}</span>
                  </div>
                  {score.baseline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Baseline:</span>
                      <span className="font-medium">{score.baseline}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mudança:</span>
                    <span className={`font-medium ${
                      score.change > 0 ? 'text-red-600' : score.change < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {score.change > 0 ? '+' : ''}{score.change.toFixed(1)}
                      {score.baseline && ` (${score.percentChange.toFixed(1)}%)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tendência:</span>
                    <span className={`font-medium ${
                      score.trend === 'improving' ? 'text-green-600' : 
                      score.trend === 'worsening' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {score.trend === 'improving' ? '📈 Melhorando' :
                       score.trend === 'worsening' ? '📉 Piorando' : '➡️ Estável'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendências de Humor</h2>
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(metrics.moodTrends).map(([key, trend]) => (
              <div key={key} className="text-center">
                <h3 className="font-medium text-gray-900 mb-2 capitalize">
                  {key === 'overallMood' ? 'Humor Geral' :
                   key === 'anxiety' ? 'Ansiedade' :
                   key === 'depression' ? 'Depressão' : 'Energia'}
                </h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {trend.current.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Média: {trend.average.toFixed(1)}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  trend.trend === 'improving' ? 'bg-green-100 text-green-800' :
                  trend.trend === 'worsening' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {trend.trend === 'improving' ? '↗️ Melhor' :
                   trend.trend === 'worsening' ? '↘️ Pior' : '→ Estável'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab de Alertas
function AlertsTab({ alerts }: { alerts: any }) {
  if (!alerts || alerts.level === 'none') {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-green-800 mb-2">Tudo Bem!</h2>
        <p className="text-green-600">Não há alertas clínicos no momento.</p>
        <p className="text-sm text-gray-500 mt-2">Continue monitorando regularmente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg border-2 ${
        alerts.level === 'urgent' ? 'bg-red-50 border-red-200' :
        alerts.level === 'concern' ? 'bg-yellow-50 border-yellow-200' : 
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="text-4xl">
            {alerts.level === 'urgent' ? '🚨' : alerts.level === 'concern' ? '⚠️' : 'ℹ️'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {alerts.level === 'urgent' ? 'Atenção Urgente Necessária' :
               alerts.level === 'concern' ? 'Acompanhamento Recomendado' : 'Informações Importantes'}
            </h2>
            
            {alerts.alerts && alerts.alerts.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Alertas Identificados:</h3>
                <ul className="space-y-1">
                  {alerts.alerts.map((alert: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {alerts.recommendations && alerts.recommendations.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Recomendações:</h3>
                <ul className="space-y-1">
                  {alerts.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {alerts.level === 'urgent' && (
        <div className="bg-white p-6 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-3">⚡ Ação Imediata Recomendada</h3>
          <div className="space-y-3 text-sm">
            <p className="text-red-800">
              Os resultados das suas avaliações indicam que você pode se beneficiar de apoio profissional imediato.
            </p>
            <div className="space-y-2">
              <p><strong>📞 Recursos de Emergência:</strong></p>
              <ul className="ml-4 space-y-1 text-red-700">
                <li>• CVV: 188 (24h, gratuito)</li>
                <li>• SAMU: 192</li>
                <li>• Emergência: 190/193</li>
              </ul>
            </div>
            <p className="text-red-800">
              <strong>Lembre-se:</strong> Esta plataforma não substitui o acompanhamento profissional. 
              Por favor, considere buscar ajuda de um psicólogo ou psiquiatra.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Interface de Avaliação
function AssessmentInterface({
  scale,
  progress,
  onAnswer,
  onNext,
  onCancel
}: {
  scale: ClinicalScale;
  progress: any;
  onAnswer: (questionId: string, answer: number) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const currentQuestion = scale.questions[progress.currentQuestionIndex];
  const progressPercent = ((progress.currentQuestionIndex + 1) / scale.questions.length) * 100;
  const currentAnswer = progress.responses[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{scale.shortName}</h1>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pergunta {progress.currentQuestionIndex + 1} de {scale.questions.length}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>
            
            {currentQuestion.helpText && (
              <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded">
                💡 {currentQuestion.helpText}
              </p>
            )}

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={currentQuestion.scores[index]}
                    checked={currentAnswer === currentQuestion.scores[index]}
                    onChange={(e) => onAnswer(currentQuestion.id, parseInt(e.target.value))}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={onNext}
              disabled={currentAnswer === undefined}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {progress.currentQuestionIndex === scale.questions.length - 1 ? 'Finalizar' : 'Próxima'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Resultados da Avaliação
function AssessmentResults({ 
  result, 
  onClose 
}: { 
  result: AssessmentResponse; 
  onClose: () => void;
}) {
  const scale = clinicalMonitoringService.getScale(result.scaleId);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">📊</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultado da Avaliação</h1>
            <p className="text-gray-600">{scale?.name}</p>
          </div>

          <div className="space-y-6">
            {/* Pontuação */}
            <div className="text-center bg-gray-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result.totalScore}
              </div>
              <div className="text-lg text-gray-600">
                de {scale?.scoring.maxScore} pontos
              </div>
            </div>

            {/* Interpretação */}
            <div className={`p-6 rounded-lg border-2 ${
              result.interpretation.severity === 'severe' || result.interpretation.severity === 'very_severe' ? 'bg-red-50 border-red-200' :
              result.interpretation.severity === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
              result.interpretation.severity === 'mild' ? 'bg-blue-50 border-blue-200' :
              'bg-green-50 border-green-200'
            }`}>
              <h3 className="font-semibold text-gray-900 mb-3">
                Nível: {result.interpretation.label}
              </h3>
              <p className="text-gray-700 mb-4">
                {result.interpretation.description}
              </p>
              
              {result.interpretation.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recomendações:</h4>
                  <ul className="space-y-1">
                    {result.interpretation.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Subescalas se houver */}
            {result.subscaleScores && Object.keys(result.subscaleScores).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Detalhamento por Área</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.subscaleScores).map(([area, score]) => (
                    <div key={area} className="text-center">
                      <div className="text-xl font-bold text-blue-600">{score}</div>
                      <div className="text-sm text-gray-600">{area}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}