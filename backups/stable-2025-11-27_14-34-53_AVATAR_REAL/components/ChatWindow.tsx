"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { caseFormulationService } from '../lib/case-formulation';
import { therapeuticExerciseService } from '../lib/therapeutic-exercises';
import SessionTimer from './SessionTimer';
import MessageList from './MessageList';
import AvatarWithLipSync from './AvatarWithLipSync';
import dynamic from 'next/dynamic';

// Carregamento lazy do PsychometricAssessment para melhor performance
const PsychometricAssessment = dynamic(() => import('./PsychometricAssessment'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
});

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  guidance?: string;
  technique?: string;
  intervention?: string;
}

export default function ChatWindow() {
  const userAuth = useAuthenticatedUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sistema de Timer de Sessão (30 minutos)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutos em segundos
  const [sessionActive, setSessionActive] = useState(true);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados da avaliação psicométrica
  const [showAssessment, setShowAssessment] = useState(false);
  const [suggestedScales, setSuggestedScales] = useState<string[]>([]);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  
  // Estado para Case Formulation
  const [hasFormulation, setHasFormulation] = useState<boolean | null>(null);
  const [needsAssessment, setNeedsAssessment] = useState(false);
  
  // Estado para sugestões de exercícios
  const [exerciseSuggestions, setExerciseSuggestions] = useState<any[]>([]);
  
  // Estado para controle do avatar
  const [currentSpeechText, setCurrentSpeechText] = useState<string>('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');
  const [showAvatar, setShowAvatar] = useState(true);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Verificar se existe formulação de caso
  useEffect(() => {
    if (userAuth.user?.id && hasFormulation === null) {
      const formulation = caseFormulationService.loadFormulation(userAuth.user.id);
      setHasFormulation(!!formulation);
      
      // Se não tem formulação e ainda não foi perguntado sobre assessment
      if (!formulation && messages.length === 0) {
        setNeedsAssessment(true);
      }
    }
  }, [userAuth.user?.id, hasFormulation, messages.length]);

  // Inicializar sessão terapêutica e timer
  useEffect(() => {
    if (!sessionStartTime && userAuth.user && !userAuth.loading) {
      setSessionStartTime(new Date());
      
      // Iniciar nova sessão terapêutica
      if (userAuth.canStartNewSession) {
        const therapySession = userAuth.startTherapySession();
        console.log('Nova sessão terapêutica iniciada:', therapySession?.id);
      } else {
        console.log('Limite de sessões grátis atingido para usuário:', userAuth.user.id);
      }
    } else if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, []);

  // Timer de sessão
  useEffect(() => {
    if (!sessionActive || !sessionStartTime) return;

    timerRef.current = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      const remaining = Math.max(0, (30 * 60) - elapsed);
      
      setTimeRemaining(remaining);
      
      // Avisos de tempo
      if (remaining === 5 * 60 && !showTimeWarning) { // 5 minutos restantes
        setShowTimeWarning(true);
        const warningMessage: Message = {
          id: Date.now().toString(),
          content: "⏰ **Aviso:** Restam 5 minutos para nossa sessão. Vamos começar a preparar o fechamento.",
          isUser: false,
          timestamp: new Date(),
          guidance: "Tempo para começar a sintetizar os insights da sessão."
        };
        setMessages(prev => [...prev, warningMessage]);
      }
      
      if (remaining === 0) {
        setSessionActive(false);
        
        // Finalizar sessão terapêutica
        if (userAuth.currentSession) {
          const finalizedSession = userAuth.endCurrentSession();
          if (finalizedSession) {
            console.log('Sessão terapêutica finalizada:', finalizedSession.duration, 'segundos');
          }
        }
        
        const endMessage: Message = {
          id: Date.now().toString(),
          content: "Nossa sessão de hoje chegou ao fim. Foi um prazer te acompanhar! 💙\n\n**Resumo da sessão:** Utilizamos técnicas baseadas em evidência para trabalhar suas questões. Continue praticando as estratégias que exploramos.\n\n**Próximos passos:** Reflita sobre nossos insights e volte quando sentir necessidade.",
          isUser: false,
          timestamp: new Date(),
          guidance: "Sessão finalizada após 30 minutos."
        };
        setMessages(prev => [...prev, endMessage]);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionActive, sessionStartTime, showTimeWarning]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensagem de boas-vindas com sugestão de assessment
  useEffect(() => {
    if (needsAssessment && userAuth.user && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-assessment',
        content: `Olá ${userAuth.user.name || userAuth.user.email}! 👋\n\n**Seja bem-vindo(a) à ClaraMente!**\n\nPara que eu possa oferecer o melhor suporte terapêutico personalizado, gostaria de fazer um breve assessment inicial. Este questionário me ajuda a:\n\n• Entender melhor sua situação atual\n• Identificar suas necessidades específicas\n• Personalizar nossas conversas terapêuticas\n• Criar um plano de tratamento adequado\n\n**Você gostaria de começar com o assessment estruturado?** Leva apenas 10-15 minutos e tornará nossa terapia muito mais eficaz.`,
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          'Sim, vamos fazer o assessment',
          'Prefiro conversar primeiro',
          'Me fale mais sobre o assessment'
        ]
      };
      
      setMessages([welcomeMessage]);
    }
  }, [needsAssessment, userAuth.user, messages.length]);

  // Enviar mensagem otimizada
  const sendMessage = useCallback(async () => {
    const currentMessage = inputMessage.trim();
    if (!currentMessage || loading || !sessionActive) return;

    const userId = userAuth.user?.id || 'anonymous_user';
    
    // Verificar se é resposta para assessment
    if (needsAssessment && (
      currentMessage.toLowerCase().includes('sim') && 
      currentMessage.toLowerCase().includes('assessment')
    )) {
      // Redirecionar para assessment
      window.location.href = '/assessment';
      return;
    }
    
    if (needsAssessment && (
      currentMessage.toLowerCase().includes('me fale mais') ||
      currentMessage.toLowerCase().includes('sobre o assessment')
    )) {
      const infoMessage: Message = {
        id: Date.now().toString() + '-info',
        content: `**Sobre o Assessment Terapêutico:**\n\n🎯 **O que é?**\nUm questionário estruturado baseado em evidências científicas que me ajuda a entender:\n• Seus padrões de pensamento\n• Comportamentos atuais\n• Histórico relevante\n• Recursos pessoais\n• Objetivos terapêuticos\n\n📋 **Como funciona?**\n• 15-20 perguntas cuidadosamente selecionadas\n• Diferentes tipos: escalas, múltipla escolha, descritivas\n• Tempo estimado: 10-15 minutos\n• Totalmente confidencial\n\n🎨 **Benefícios:**\n• Terapia personalizada desde o início\n• Identificação precisa de técnicas mais eficazes\n• Plano de tratamento estruturado\n• Acompanhamento do progresso\n\n**Pronto para começar?**`,
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          'Sim, vamos fazer o assessment',
          'Prefiro conversar primeiro'
        ]
      };
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: currentMessage,
        isUser: true,
        timestamp: new Date()
      }, infoMessage]);
      setInputMessage('');
      return;
    }

    if (needsAssessment && 
        currentMessage.toLowerCase().includes('prefiro conversar')) {
      setNeedsAssessment(false);
      setHasFormulation(false); // Marca como sem formulação mas pode conversar
    }
    
    // Tratar respostas sobre exercícios sugeridos
    if (currentMessage.toLowerCase().includes('fazer exercício agora')) {
      window.location.href = `/exercises`;
      return;
    }
    
    if (currentMessage.toLowerCase().includes('ver biblioteca de exercícios')) {
      window.location.href = `/exercises`;
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    
    // Salvar mensagem na sessão terapêutica (gerenciado internamente pelo hook)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: currentMessage,
          sessionStartTime: sessionStartTime?.toISOString(),
          timeElapsed: sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000) : 0
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || 'Resposta não disponível',
          isUser: false,
          timestamp: new Date(),
          suggestions: data.suggestions || [],
          guidance: data.guidance || null,
          technique: data.technique || null,
          intervention: data.intervention || null
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Ativar avatar para falar a resposta
        setCurrentSpeechText(data.response || '');
        
        // Se houver áudio disponível, usar
        if (data.audioUrl) {
          setCurrentAudioUrl(data.audioUrl);
        }
        
        // Salvar resposta da IA na sessão terapêutica (gerenciado internamente pelo hook)
        
        // Detectar sintomas e sugerir avaliação psicométrica
        detectSymptomsAndSuggestAssessment(userMessage.content, data.response || '');
        
        // Sugerir exercícios terapêuticos relevantes
        suggestTherapeuticExercises(userMessage.content, data.response || '');
        
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.error || 'Erro no servidor. Tente novamente.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [sessionStartTime, sessionActive, inputMessage, loading, userAuth.user]);

  // Detectar sintomas e sugerir avaliações psicométricas
  const detectSymptomsAndSuggestAssessment = useCallback((userMessage: string, assistantResponse: string) => {
    if (assessmentCompleted || showAssessment) return;
    
    // Detectar padrões de sintomas na conversa
    const symptoms = [userMessage, assistantResponse].join(' ').toLowerCase();
    const suggestedScalesForSymptoms: string[] = [];
    
    // Depressão
    if (symptoms.includes('deprim') || symptoms.includes('trist') || symptoms.includes('desanim') || 
        symptoms.includes('desesperanç') || symptoms.includes('vazio') || symptoms.includes('melancol')) {
      suggestedScalesForSymptoms.push('bdi_ii', 'phq_9');
    }
    
    // Ansiedade
    if (symptoms.includes('ansied') || symptoms.includes('nervos') || symptoms.includes('preocup') || 
        symptoms.includes('medo') || symptoms.includes('tensão') || symptoms.includes('pânico')) {
      suggestedScalesForSymptoms.push('bai', 'gad_7');
    }
    
    // Pânico
    if (symptoms.includes('pânic') || symptoms.includes('ataque') || symptoms.includes('taquicard') || 
        symptoms.includes('falta de ar') || symptoms.includes('suor')) {
      suggestedScalesForSymptoms.push('bai');
    }
    
    // Se detectou sintomas significativos e já passou tempo suficiente (10+ mensagens)
    if (suggestedScalesForSymptoms.length > 0 && messages.length >= 10) {
      setSuggestedScales([...new Set(suggestedScalesForSymptoms)]);
      
      // Sugerir avaliação após algumas trocas de mensagem
      setTimeout(() => {
        if (!assessmentCompleted && !showAssessment) {
          const assessmentSuggestion: Message = {
            id: Date.now().toString(),
            content: `Com base em nossa conversa, sugiro uma breve avaliação clínica padronizada. Isso me ajudará a personalizar ainda mais nossa abordagem terapêutica.\n\n**Escalas recomendadas:**\n${getSuggestedScalesDescription(suggestedScalesForSymptoms)}\n\nGostaria de fazer essa avaliação agora? Levará apenas 5-10 minutos.`,
            isUser: false,
            timestamp: new Date(),
            guidance: "Avaliação psicométrica recomendada baseada nos sintomas detectados"
          };
          
          setMessages(prev => [...prev, assessmentSuggestion]);
        }
      }, 2000);
    }
  }, [messages.length, assessmentCompleted, showAssessment]);

  // Sugerir exercícios terapêuticos baseados na conversa
  const suggestTherapeuticExercises = useCallback((userMessage: string, assistantResponse: string) => {
    if (!userAuth.user?.id || exerciseSuggestions.length > 0) return;
    
    // Verificar se há formulação para personalizar sugestões
    const formulation = caseFormulationService.loadFormulation(userAuth.user.id);
    if (!formulation) return;
    
    // Detectar contextos que indicam necessidade de exercícios específicos
    const conversation = [userMessage, assistantResponse].join(' ').toLowerCase();
    
    // Padrões que sugerem necessidade de exercícios específicos
    const exerciseIndicators = [
      {
        patterns: ['pensamentos negativos', 'autocrítica', 'catastrofizando', 'sempre penso o pior'],
        exerciseId: 'thought-record-basic',
        reason: 'Pode ajudar a identificar e questionar pensamentos automáticos'
      },
      {
        patterns: ['ansioso', 'nervoso', 'coração disparado', 'falta de ar'],
        exerciseId: 'breathing-grounding',
        reason: 'Técnica de respiração pode reduzir sintomas de ansiedade imediatamente'
      },
      {
        patterns: ['evito', 'não consigo fazer', 'tenho medo de', 'sempre fujo'],
        exerciseId: 'behavioral-experiment',
        reason: 'Experimentos comportamentais podem testar suas previsões de forma segura'
      },
      {
        patterns: ['sem energia', 'desmotivado', 'não tenho vontade', 'fico só em casa'],
        exerciseId: 'activity-scheduling',
        reason: 'Programar atividades prazerosas pode melhorar o humor gradualmente'
      },
      {
        patterns: ['rumino', 'fico pensando', 'não consigo parar de pensar', 'mente acelerada'],
        exerciseId: 'mindful-observation',
        reason: 'Técnica de mindfulness pode ajudar a sair do ciclo de ruminação'
      }
    ];
    
    // Encontrar exercícios relevantes
    const relevantExercises: string[] = [];
    exerciseIndicators.forEach(indicator => {
      if (indicator.patterns.some(pattern => conversation.includes(pattern))) {
        relevantExercises.push(indicator.exerciseId);
      }
    });
    
    // Se encontrou exercícios relevantes e já teve conversa suficiente (8+ mensagens)
    if (relevantExercises.length > 0 && messages.length >= 8) {
      // Pegar o primeiro exercício mais relevante
      const exerciseId = relevantExercises[0];
      const exercise = therapeuticExerciseService.getExerciseById(exerciseId);
      const indicator = exerciseIndicators.find(ind => ind.exerciseId === exerciseId);
      
      if (exercise && indicator) {
        setTimeout(() => {
          const exerciseSuggestion: Message = {
            id: Date.now().toString() + '_exercise',
            content: `💡 **Sugestão de Exercício Terapêutico**\n\nBaseado em nossa conversa, acredito que o exercício **"${exercise.title}"** pode ser muito útil para você agora.\n\n**Por quê?** ${indicator.reason}\n\n**Sobre o exercício:**\n• Duração: ${exercise.estimatedDuration} minutos\n• Dificuldade: ${exercise.difficulty === 'beginner' ? 'Iniciante' : exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}\n• Aborda: ${exercise.targetIssues.slice(0, 3).join(', ')}\n\n**Descrição:** ${exercise.description}\n\nGostaria de fazer este exercício agora ou prefere ver outras opções na nossa biblioteca de exercícios?`,
            isUser: false,
            timestamp: new Date(),
            suggestions: [
              'Fazer exercício agora',
              'Ver biblioteca de exercícios',
              'Continuar nossa conversa'
            ],
            guidance: `Exercício ${exercise.title} sugerido baseado no contexto da conversa`
          };
          
          setMessages(prev => [...prev, exerciseSuggestion]);
          setExerciseSuggestions([exerciseId]);
        }, 3000); // Aguardar 3 segundos após a resposta da IA
      }
    }
  }, [userAuth.user?.id, exerciseSuggestions.length, messages.length]);
  
  // Descrição das escalas sugeridas
  const getSuggestedScalesDescription = (scales: string[]): string => {
    const descriptions: Record<string, string> = {
      'bdi_ii': '• BDI-II - Inventário de Depressão de Beck (avalia severidade de sintomas depressivos)',
      'bai': '• BAI - Inventário de Ansiedade de Beck (mede intensidade da ansiedade)',
      'gad_7': '• GAD-7 - Escala de Ansiedade Generalizada (triagem para TAG)',
      'phq_9': '• PHQ-9 - Questionário de Saúde do Paciente (triagem para depressão)'
    };
    
    return scales.map(scale => descriptions[scale]).filter(Boolean).join('\n');
  };
  
  // Manipular resposta da avaliação psicométrica
  const handleAssessmentComplete = (results: any) => {
    setShowAssessment(false);
    setAssessmentCompleted(true);
    
    // Criar mensagem com resultados
    const resultsMessage: Message = {
      id: Date.now().toString(),
      content: `**Avaliação Concluída!** 📊\n\n**Resumo dos resultados:**\n\nNível de risco geral: **${getRiskLevelText(results.overallAssessment.riskLevel)}**\n\n${results.overallAssessment.primaryConcerns.length > 0 ? 
        `**Áreas de atenção:** ${results.overallAssessment.primaryConcerns.join(', ')}\n\n` : ''}**Próximos passos:** Vou adaptar nossa conversa com base nesses insights para oferecer um suporte mais direcionado.\n\n${results.overallAssessment.urgentAction ? '⚠️ **Importante:** Recomendo que você considere buscar suporte profissional adicional.' : 'Vamos continuar nossa sessão com essas informações em mente.'}`,
      isUser: false,
      timestamp: new Date(),
      guidance: "Resultados da avaliação psicométrica integrados à sessão"
    };
    
    setMessages(prev => [...prev, resultsMessage]);
  };
  
  const getRiskLevelText = (level: string): string => {
    const levels: Record<string, string> = {
      'low': 'Baixo',
      'medium': 'Moderado', 
      'high': 'Alto',
      'critical': 'Crítico'
    };
    return levels[level] || level;
  };

  // Usar sugestão
  // Pressionar Enter para enviar
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading && inputMessage.trim() && sessionActive) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formatar tempo restante
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Modal de Avaliação Psicométrica */}
      {showAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-5xl max-h-[90vh] overflow-auto">
            <PsychometricAssessment
              suggestedScales={suggestedScales}
              onComplete={handleAssessmentComplete}
              onCancel={() => setShowAssessment(false)}
            />
          </div>
        </div>
      )}
      
      <div className="flex flex-col h-full bg-white rounded-xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-xl">Clara</h1>
            <p className="text-sm text-gray-600">Sua terapeuta TCC virtual</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Botão de Relatório de Progresso */}
          <a
            href="/report"
            className="px-3 py-2 bg-purple-50 text-purple-700 text-sm rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
            title="Ver relatório de progresso"
          >
            📈 Relatórios
          </a>
          
          {/* Botão de Avaliação Psicométrica */}
          {!assessmentCompleted && sessionActive && (
            <button
              onClick={() => setShowAssessment(true)}
              className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              title="Fazer avaliação clínica"
            >
              📊 Avaliação
            </button>
          )}
          
          <div className="text-right">
            <span className={`text-sm font-medium ${sessionActive ? 'text-green-600' : 'text-red-600'}`}>
              {sessionActive ? '● Sessão Ativa' : '● Sessão Finalizada'}
            </span>
            <p className="text-xs text-gray-500">
              {sessionActive ? `Sessão TCC/DBT/ACT | ${formatTime(timeRemaining)} restantes` : 'Sessão completa'}
            </p>
          </div>
          {timeRemaining <= 5 * 60 && sessionActive && (
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg px-3 py-2">
              <div className="flex items-center text-yellow-800">
                <span className="text-sm font-medium">⏰ Finalizando em breve</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status do Usuário */}
      {userAuth.user && !userAuth.loading && (
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userAuth.user.name?.[0]?.toUpperCase() || '👤'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {userAuth.isAuthenticated ? `Olá, ${userAuth.user.name}!` : 'Sessão Anônima'}
                </p>
                <p className="text-xs text-gray-600">
                  {userAuth.isAuthenticated 
                    ? `Sessões realizadas: ${userAuth.user.totalSessions}`
                    : 'Faça login para salvar seu progresso'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-blue-700">
                {userAuth.canStartNewSession 
                  ? `${5 - userAuth.user.freeSessionsUsed} sessões restantes`
                  : 'Limite de sessões atingido'
                }
              </p>
              {userAuth.sessionHistory.length > 0 && (
                <p className="text-xs text-gray-500">
                  Última sessão: {userAuth.sessionHistory[0]?.startTime ? new Date(userAuth.sessionHistory[0].startTime).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {/* Avatar Clara - Fixo no topo */}
        {showAvatar && (
          <div className="sticky top-0 z-10 bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 flex-shrink-0">
                <AvatarWithLipSync 
                  text={currentSpeechText}
                  audioUrl={currentAudioUrl}
                  avatarImage="/clara-real.jpg"
                  onSpeakingComplete={() => {
                    setCurrentSpeechText('');
                    setCurrentAudioUrl('');
                  }}
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Clara - Sua Terapeuta Virtual</h3>
                  <button
                    onClick={() => setShowAvatar(!showAvatar)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                    title="Minimizar avatar"
                  >
                    ➖
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Assistente de Terapia Cognitivo-Comportamental com técnicas baseadas em evidência (TCC, DBT, ACT)
                </p>
                <div className="mt-2 flex gap-2 text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">🧠 TCC</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">🎯 DBT</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">🌱 ACT</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Botão para mostrar avatar quando minimizado */}
        {!showAvatar && (
          <div className="sticky top-0 z-10 mb-4">
            <button
              onClick={() => setShowAvatar(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="text-lg">👁️</span>
              <span className="text-sm font-medium">Mostrar Avatar Clara</span>
            </button>
          </div>
        )}
        
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Olá! Sou a Clara</h2>
              <p className="text-gray-600 mb-4">
                Estou aqui para te ajudar com uma sessão terapêutica de 30 minutos usando técnicas baseadas em evidência (TCC, DBT, ACT).
              </p>
              <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                💡 <strong>Como funciona:</strong> Nossa conversa será adaptada às suas necessidades emocionais em tempo real. Compartilhe o que está sentindo, pensando ou vivenciando - pode ser ansiedade, tristeza, relacionamentos, trabalho ou qualquer preocupação.
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id}>
            <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                message.isUser 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md' 
                  : 'bg-white text-gray-900 rounded-bl-md border border-gray-200 shadow-md'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {message.technique && (
                  <div className="mt-3 text-xs bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                    🧠 <strong>Técnica TCC:</strong> {message.technique}
                  </div>
                )}
                {message.intervention && (
                  <div className="mt-2 text-xs bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                    🎯 <strong>Intervenção:</strong> {message.intervention}
                  </div>
                )}
                
                {/* Botão de Avaliação Psicométrica */}
                {!message.isUser && message.content.includes('avaliação clínica padronizada') && !assessmentCompleted && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setShowAssessment(true)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📊 Fazer Avaliação
                    </button>
                    <button
                      onClick={() => {
                        const declineMessage: Message = {
                          id: Date.now().toString(),
                          content: "Entendo. Podemos fazer a avaliação a qualquer momento se você mudar de ideia. Vamos continuar nossa conversa normalmente.",
                          isUser: false,
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, declineMessage]);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Agora Não
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Guidance */}
            {message.guidance && !message.isUser && (
              <div className="mb-3 ml-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-3 rounded-r-lg text-sm">
                  <div className="text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                    {message.guidance}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions - REMOVIDAS PARA MELHORAR EXPERIÊNCIA */}
            {/* 
            {message.suggestions && message.suggestions.length > 0 && !message.isUser && index === messages.length - 1 && (
              <div className="mb-3 ml-4">
                <p className="text-xs text-gray-500 mb-2">💡 Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      disabled={true}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            */}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 border border-gray-200 shadow-md">
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-medium">Clara está analisando e preparando uma resposta...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={sessionActive ? "Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)" : "Sessão finalizada"}
              className={`w-full resize-none border-2 rounded-xl px-4 py-3 text-sm transition-colors min-h-[50px] max-h-[120px] ${
                !sessionActive
                  ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                  : inputMessage.trim() 
                    ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                    : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
              } text-gray-900`}
              rows={2}
              disabled={loading || !sessionActive}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            {/* Indicador de estado */}
            <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
              Estado: {inputMessage.trim() ? '✅ Pronto para enviar' : '⭕ Digite uma mensagem'} | Loading: {loading ? 'Sim' : 'Não'}
            </div>
          </div>
            <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading || !sessionActive}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[100px] shadow-lg text-sm font-medium ${
              !inputMessage.trim() || loading || !sessionActive
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Enviar</span>
            )}
          </button>
        </div>

        {/* Crisis Help Button */}
        <div className="mt-4 text-center">
          <button className="text-red-600 hover:text-red-700 underline text-sm transition-colors duration-200 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100">
            🆘 Buscar ajuda profissional imediata
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
