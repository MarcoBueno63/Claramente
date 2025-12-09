// components/TCCProtocols.tsx - Interface para Protocolos Especializados de TCC
// Sistema completo de aplicação de protocolos baseados em evidências

"use client";
import React, { useState, useEffect } from 'react';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { 
  tccProtocolsService, 
  TCCProtocol, 
  TCCPhase,
  ProtocolSession,
  TCCIntervention
} from '../lib/tcc-protocols';

interface ProtocolState {
  activeTab: 'overview' | 'protocols' | 'session' | 'progress' | 'resources';
  selectedProtocol?: TCCProtocol;
  currentSession?: ProtocolSession;
  showSessionInterface?: boolean;
  protocolProgress?: any;
}

export default function TCCProtocols() {
  const userAuth = useAuthenticatedUser();
  const [state, setState] = useState<ProtocolState>({ activeTab: 'overview' });
  const [availableProtocols, setAvailableProtocols] = useState<TCCProtocol[]>([]);
  const [userProtocols, setUserProtocols] = useState<{ protocol: TCCProtocol; progress: any }[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    if (userAuth.user?.id) {
      loadProtocolData();
    }
  }, [userAuth.user?.id]);

  const loadProtocolData = () => {
    // Carregar todos os protocolos disponíveis
    const protocols = tccProtocolsService.getAllProtocols();
    setAvailableProtocols(protocols);

    // Carregar progresso dos protocolos do usuário
    if (userAuth.user?.id) {
      const userProgressData = protocols.map(protocol => {
        const progress = tccProtocolsService.calculateProtocolProgress(userAuth.user!.id, protocol.id);
        return { protocol, progress };
      }).filter(item => item.progress.completedSessions > 0);

      setUserProtocols(userProgressData);
    }
  };

  const startProtocol = (protocol: TCCProtocol) => {
    setState(prev => ({
      ...prev,
      selectedProtocol: protocol,
      activeTab: 'session'
    }));
  };

  const startSession = (protocol: TCCProtocol) => {
    if (!userAuth.user?.id) return;

    const sessions = tccProtocolsService.getProtocolSessions(userAuth.user.id, protocol.id);
    const nextSessionNumber = sessions.length + 1;
    
    // Encontrar a fase da próxima sessão
    const currentPhase = protocol.phases.find(phase => 
      phase.sessions.includes(nextSessionNumber)
    );

    if (currentPhase) {
      const newSession = tccProtocolsService.createProtocolSession(
        protocol.id,
        nextSessionNumber,
        userAuth.user.id,
        currentPhase.id
      );

      setState(prev => ({
        ...prev,
        currentSession: newSession,
        showSessionInterface: true
      }));
    }
  };

  const completeSession = (session: ProtocolSession) => {
    tccProtocolsService.saveProtocolSession(session);
    setState(prev => ({
      ...prev,
      currentSession: undefined,
      showSessionInterface: false
    }));
    loadProtocolData();
  };

  const getProtocolColor = (category: string) => {
    switch (category) {
      case 'anxiety': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'depression': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'ocd': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'phobia': return 'bg-red-50 border-red-200 text-red-800';
      case 'trauma': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'anxiety': return '😰';
      case 'depression': return '😔';
      case 'ocd': return '🔄';
      case 'phobia': return '😱';
      case 'trauma': return '💔';
      default: return '🧠';
    }
  };

  // Interface de sessão ativa
  if (state.showSessionInterface && state.currentSession && state.selectedProtocol) {
    return <SessionInterface 
      session={state.currentSession}
      protocol={state.selectedProtocol}
      onComplete={completeSession}
      onCancel={() => setState(prev => ({ ...prev, showSessionInterface: false, currentSession: undefined }))}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧠 Protocolos TCC Especializados
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Protocolos estruturados baseados em evidências para tratamento de transtornos específicos
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Visão Geral', icon: '📋' },
                { key: 'protocols', label: 'Protocolos', icon: '📚' },
                { key: 'session', label: 'Sessão Atual', icon: '🎯' },
                { key: 'progress', label: 'Progresso', icon: '📈' },
                { key: 'resources', label: 'Recursos', icon: '🛠️' }
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
            {state.activeTab === 'overview' && (
              <OverviewTab 
                userProtocols={userProtocols}
                availableProtocols={availableProtocols}
                onStartProtocol={startProtocol}
              />
            )}

            {state.activeTab === 'protocols' && (
              <ProtocolsTab 
                protocols={availableProtocols}
                onSelectProtocol={(protocol) => setState(prev => ({ ...prev, selectedProtocol: protocol }))}
                selectedProtocol={state.selectedProtocol}
                onStartProtocol={startProtocol}
              />
            )}

            {state.activeTab === 'session' && (
              <SessionTab 
                selectedProtocol={state.selectedProtocol}
                onStartSession={startSession}
                userAuth={userAuth}
              />
            )}

            {state.activeTab === 'progress' && (
              <ProgressTab userProtocols={userProtocols} />
            )}

            {state.activeTab === 'resources' && (
              <ResourcesTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab de Visão Geral
function OverviewTab({ 
  userProtocols, 
  availableProtocols, 
  onStartProtocol 
}: {
  userProtocols: { protocol: TCCProtocol; progress: any }[];
  availableProtocols: TCCProtocol[];
  onStartProtocol: (protocol: TCCProtocol) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Protocolos Ativos */}
      {userProtocols.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Protocolos em Andamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProtocols.map(({ protocol, progress }, index) => (
              <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{protocol.shortName}</h3>
                    <p className="text-sm text-gray-600">{protocol.disorder}</p>
                  </div>
                  <div className="text-2xl">
                    {protocol.category === 'anxiety' ? '😰' :
                     protocol.category === 'depression' ? '😔' :
                     protocol.category === 'ocd' ? '🔄' :
                     protocol.category === 'phobia' ? '😱' : '🧠'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso</span>
                    <span>{progress.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sessões:</span>
                    <span className="ml-2 font-medium">{progress.completedSessions}/{progress.totalSessions}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fase:</span>
                    <span className="ml-2 font-medium text-blue-600">{progress.currentPhase}</span>
                  </div>
                </div>

                <button
                  onClick={() => onStartProtocol(protocol)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continuar Protocolo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protocolos Recomendados */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Protocolos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableProtocols.slice(0, 6).map((protocol, index) => (
            <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  protocol.category === 'anxiety' ? 'bg-yellow-100 text-yellow-800' :
                  protocol.category === 'depression' ? 'bg-blue-100 text-blue-800' :
                  protocol.category === 'ocd' ? 'bg-purple-100 text-purple-800' :
                  protocol.category === 'phobia' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {protocol.category.toUpperCase()}
                </div>
                <div className="text-2xl">
                  {protocol.category === 'anxiety' ? '😰' :
                   protocol.category === 'depression' ? '😔' :
                   protocol.category === 'ocd' ? '🔄' :
                   protocol.category === 'phobia' ? '😱' : '🧠'}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{protocol.shortName}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{protocol.description}</p>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duração:</span>
                  <span>{protocol.duration.sessions} sessões</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Período:</span>
                  <span>{protocol.duration.weeks} semanas</span>
                </div>
              </div>

              <button
                onClick={() => onStartProtocol(protocol)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tab de Protocolos
function ProtocolsTab({ 
  protocols, 
  onSelectProtocol, 
  selectedProtocol, 
  onStartProtocol 
}: {
  protocols: TCCProtocol[];
  onSelectProtocol: (protocol: TCCProtocol) => void;
  selectedProtocol?: TCCProtocol;
  onStartProtocol: (protocol: TCCProtocol) => void;
}) {
  const [filter, setFilter] = useState<string>('all');

  const filteredProtocols = filter === 'all' 
    ? protocols 
    : protocols.filter(p => p.category === filter);

  const categories = [
    { key: 'all', label: 'Todos', count: protocols.length },
    { key: 'anxiety', label: 'Ansiedade', count: protocols.filter(p => p.category === 'anxiety').length },
    { key: 'depression', label: 'Depressão', count: protocols.filter(p => p.category === 'depression').length },
    { key: 'ocd', label: 'TOC', count: protocols.filter(p => p.category === 'ocd').length },
    { key: 'phobia', label: 'Fobias', count: protocols.filter(p => p.category === 'phobia').length }
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setFilter(category.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de Protocolos */}
        <div className="space-y-4">
          {filteredProtocols.map((protocol, index) => (
            <div 
              key={index} 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedProtocol?.id === protocol.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectProtocol(protocol)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {protocol.category === 'anxiety' ? '😰' :
                       protocol.category === 'depression' ? '😔' :
                       protocol.category === 'ocd' ? '🔄' :
                       protocol.category === 'phobia' ? '😱' : '🧠'}
                    </span>
                    <h3 className="font-semibold text-gray-900">{protocol.shortName}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{protocol.description}</p>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>📅 {protocol.duration.sessions} sessões</span>
                    <span>⏱️ {protocol.duration.weeks} semanas</span>
                    <span>🎯 {protocol.phases.length} fases</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  protocol.category === 'anxiety' ? 'bg-yellow-100 text-yellow-800' :
                  protocol.category === 'depression' ? 'bg-blue-100 text-blue-800' :
                  protocol.category === 'ocd' ? 'bg-purple-100 text-purple-800' :
                  protocol.category === 'phobia' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {protocol.category.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detalhes do Protocolo Selecionado */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {selectedProtocol ? (
            <ProtocolDetails protocol={selectedProtocol} onStart={onStartProtocol} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p>Selecione um protocolo para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de Detalhes do Protocolo
function ProtocolDetails({ protocol, onStart }: { protocol: TCCProtocol; onStart: (protocol: TCCProtocol) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{protocol.name}</h2>
        <p className="text-gray-600">{protocol.description}</p>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Duração</h3>
          <p className="text-sm text-gray-600">{protocol.duration.sessions} sessões</p>
          <p className="text-sm text-gray-600">{protocol.duration.weeks} semanas</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Transtorno</h3>
          <p className="text-sm text-gray-600">{protocol.disorder}</p>
        </div>
      </div>

      {/* Fases do Protocolo */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Fases do Tratamento</h3>
        <div className="space-y-3">
          {protocol.phases.map((phase, index) => (
            <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="font-medium text-gray-900">{phase.name}</h4>
                <span className="text-xs text-gray-500">
                  Sessões {phase.sessions.join(', ')}
                </span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {phase.objectives.slice(0, 2).map((objective, idx) => (
                  <li key={idx}>• {objective}</li>
                ))}
                {phase.objectives.length > 2 && (
                  <li className="text-gray-400">... e mais {phase.objectives.length - 2} objetivos</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Intervenções Principais */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Intervenções Principais</h3>
        <div className="flex flex-wrap gap-2">
          {protocol.coreInterventions.map((intervention, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {intervention}
            </span>
          ))}
        </div>
      </div>

      {/* Base de Evidências */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Base de Evidências</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          {protocol.evidenceBase.slice(0, 3).map((evidence, index) => (
            <li key={index}>• {evidence}</li>
          ))}
        </ul>
      </div>

      {/* Botão de Ação */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onStart(protocol)}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Iniciar Protocolo
        </button>
      </div>
    </div>
  );
}

// Tab de Sessão
function SessionTab({ 
  selectedProtocol, 
  onStartSession, 
  userAuth 
}: {
  selectedProtocol?: TCCProtocol;
  onStartSession: (protocol: TCCProtocol) => void;
  userAuth: any;
}) {
  const [nextSession, setNextSession] = useState<any>(null);

  useEffect(() => {
    if (selectedProtocol && userAuth.user?.id) {
      const recommendations = tccProtocolsService.getNextSessionRecommendations(
        userAuth.user.id, 
        selectedProtocol.id
      );
      setNextSession(recommendations);
    }
  }, [selectedProtocol, userAuth.user?.id]);

  if (!selectedProtocol) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum Protocolo Selecionado</h2>
        <p className="text-gray-600 mb-4">Selecione um protocolo na aba "Protocolos" para iniciar uma sessão</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Próxima Sessão - {selectedProtocol.shortName}
        </h2>
        
        {nextSession ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-1">Sessão</h3>
                <p className="text-2xl font-bold text-blue-600">#{nextSession.sessionNumber}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-1">Fase</h3>
                <p className="text-sm font-medium text-green-700">{nextSession.phase.name}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-1">Intervenções</h3>
                <p className="text-2xl font-bold text-purple-600">{nextSession.interventions.length}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Objetivos da Sessão</h3>
              <ul className="space-y-2">
                {nextSession.phase.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Intervenções Planejadas</h3>
              <div className="space-y-3">
                {nextSession.interventions.map((intervention: TCCIntervention, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{intervention.name}</h4>
                      <span className="text-sm text-gray-500">{intervention.duration} min</span>
                    </div>
                    <p className="text-sm text-gray-600">{intervention.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onStartSession(selectedProtocol)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Iniciar Sessão #{nextSession.sessionNumber}
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Carregando informações da próxima sessão...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab de Progresso
function ProgressTab({ userProtocols }: { userProtocols: { protocol: TCCProtocol; progress: any }[] }) {
  if (userProtocols.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📈</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum Progresso Registrado</h2>
        <p className="text-gray-600">Inicie um protocolo para acompanhar seu progresso</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {userProtocols.map(({ protocol, progress }, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{protocol.shortName}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              progress.progressPercentage >= 75 ? 'bg-green-100 text-green-800' :
              progress.progressPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {progress.progressPercentage}% Concluído
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {progress.completedSessions}/{progress.totalSessions}
              </div>
              <div className="text-sm text-gray-600">Sessões</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {progress.averageSymptomReduction}%
              </div>
              <div className="text-sm text-gray-600">Redução Sintomas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {progress.averageSkillAcquisition}%
              </div>
              <div className="text-sm text-gray-600">Aquisição Habilidades</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 mb-1">
                {progress.currentPhase}
              </div>
              <div className="text-sm text-gray-600">Fase Atual</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso Geral</span>
              <span>{progress.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <strong>Próxima Fase:</strong> {
              protocol.phases.find(phase => 
                !phase.sessions.every(s => s <= progress.completedSessions)
              )?.name || 'Protocolo Concluído'
            }
          </div>
        </div>
      ))}
    </div>
  );
}

// Tab de Recursos
function ResourcesTab() {
  const resources = [
    {
      title: 'Manual TCC para Ansiedade',
      description: 'Guia completo para aplicação de técnicas cognitivo-comportamentais',
      type: 'PDF',
      category: 'Ansiedade'
    },
    {
      title: 'Folhas de Registro de Pensamentos',
      description: 'Templates para registro e reestruturação cognitiva',
      type: 'Formulário',
      category: 'Geral'
    },
    {
      title: 'Hierarquia de Exposição - TOC',
      description: 'Template para construção de hierarquias de exposição',
      type: 'Planilha',
      category: 'TOC'
    },
    {
      title: 'Plano de Prevenção de Recaída',
      description: 'Modelo estruturado para prevenção de recaída',
      type: 'Template',
      category: 'Geral'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Materiais e Recursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {resource.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {resource.category}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Referências Bibliográficas</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ul className="space-y-3 text-sm">
            <li>• Beck, A.T., Rush, A.J., Shaw, B.F., & Emery, G. (1979). Cognitive Therapy of Depression. New York: Guilford Press.</li>
            <li>• Foa, E.B., & Kozak, M.J. (1986). Emotional processing of fear: Exposure to corrective information. Psychological Bulletin, 99(1), 20-35.</li>
            <li>• Borkovec, T.D., & Newman, M.G. (1998). Worry and generalized anxiety disorder. In A.S. Bellack & M. Hersen (Eds.), Comprehensive clinical psychology (pp. 439-459).</li>
            <li>• Öst, L.G. (1989). One-session treatment for specific phobias. Behaviour Research and Therapy, 27(1), 1-7.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Interface de Sessão Ativa
function SessionInterface({ 
  session, 
  protocol, 
  onComplete, 
  onCancel 
}: {
  session: ProtocolSession;
  protocol: TCCProtocol;
  onComplete: (session: ProtocolSession) => void;
  onCancel: () => void;
}) {
  const [sessionData, setSessionData] = useState(session);
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextSessionRecommendations = tccProtocolsService.getNextSessionRecommendations(
    session.userId, 
    session.protocolId
  );

  const handleComplete = () => {
    onComplete(sessionData);
  };

  const updateProgress = (field: keyof typeof sessionData.clientProgress, value: number) => {
    setSessionData(prev => ({
      ...prev,
      clientProgress: {
        ...prev.clientProgress,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sessão #{session.sessionNumber} - {protocol.shortName}
              </h1>
              <p className="text-gray-600">
                {nextSessionRecommendations?.phase.name}
              </p>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso da Sessão</span>
              <span>{Math.round((currentStep + 1) / 4 * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep + 1) / 4 * 100}%` }}
              />
            </div>
          </div>

          {/* Session Content */}
          <div className="space-y-8">
            {/* Avaliação de Progresso */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Avaliação do Progresso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redução de Sintomas (0-100%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sessionData.clientProgress.symptomReduction}
                    onChange={(e) => updateProgress('symptomReduction', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {sessionData.clientProgress.symptomReduction}%
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aquisição de Habilidades (0-100%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sessionData.clientProgress.skillAcquisition}
                    onChange={(e) => updateProgress('skillAcquisition', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {sessionData.clientProgress.skillAcquisition}%
                  </div>
                </div>
              </div>
            </div>

            {/* Notas da Sessão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas da Sessão
              </label>
              <textarea
                value={sessionData.sessionNotes}
                onChange={(e) => setSessionData(prev => ({ ...prev, sessionNotes: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Registre observações importantes da sessão..."
              />
            </div>

            {/* Planejamento da Próxima Sessão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planejamento da Próxima Sessão
              </label>
              <textarea
                value={sessionData.nextSessionPlanning.join('\n')}
                onChange={(e) => setSessionData(prev => ({ 
                  ...prev, 
                  nextSessionPlanning: e.target.value.split('\n').filter(line => line.trim())
                }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Uma linha por tópico para a próxima sessão..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Concluir Sessão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}