"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getUser } from "../lib/auth";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tccContext?: {
    technique?: string;
    category?: string;
    coreBeliefs?: Array<{
      domain: string;
      type: string;
      centralBelief: string;
      confidence: number;
    }>;
    intermediateBeliefs?: Array<{
      type: string;
      category: string;
      rule?: string;
      attitude?: string;
      intervention: string;
    }>;
    interventionType?: string;
  };
}

interface ThoughtRecord {
  id: string;
  situation: string;
  emotion: string;
  intensity: number;
  automaticThought: string;
  alternativeThought?: string;
  timestamp: Date;
}

interface BeliefProfile {
  coreBeliefs: Array<{
    domain: string;
    type: string;
    centralBelief: string;
    confidence: number;
    identifiedAt: Date;
  }>;
  intermediateBeliefs: Array<{
    type: string;
    category: string;
    rule?: string;
    attitude?: string;
    intervention: string;
    identifiedAt: Date;
  }>;
}

interface TCCTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou a Clara, sua assistente terapêutica especializada em TCC. Este é um espaço seguro para você. Como você está se sentindo hoje?',
      timestamp: new Date(),
      tccContext: { technique: 'initial-assessment', category: 'greeting' }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionTime, setSessionTime] = useState(30 * 60);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([]);
  const [beliefProfile, setBeliefProfile] = useState<BeliefProfile>({
    coreBeliefs: [],
    intermediateBeliefs: []
  });
  const [tccTasks, setTCCTasks] = useState<TCCTask[]>([
    {
      id: '1',
      title: 'Registro de Pensamentos',
      description: 'Observe e anote um pensamento automático que aparecer hoje',
      completed: false,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ]);
  const [showTCCPanel, setShowTCCPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || loading) return;

    const user = getUser();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: currentMessage
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || 'Desculpe, não consegui processar sua mensagem.',
          timestamp: new Date(),
          tccContext: data.tccContext || {}
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Processar crenças identificadas
        if (data.tccContext?.coreBeliefs?.length > 0) {
          const newCoreBeliefs = data.tccContext.coreBeliefs.map((belief: any) => ({
            ...belief,
            identifiedAt: new Date()
          }));
          setBeliefProfile(prev => ({
            ...prev,
            coreBeliefs: [...prev.coreBeliefs, ...newCoreBeliefs]
          }));
        }
        
        if (data.tccContext?.intermediateBeliefs?.length > 0) {
          const newIntermediateBeliefs = data.tccContext.intermediateBeliefs.map((belief: any) => ({
            ...belief,
            identifiedAt: new Date()
          }));
          setBeliefProfile(prev => ({
            ...prev,
            intermediateBeliefs: [...prev.intermediateBeliefs, ...newIntermediateBeliefs]
          }));
        }
        
        // Auto-gerar tarefas TCC baseadas na resposta
        if (data.tccContext?.technique === 'deep-exploration') {
          const newTask: TCCTask = {
            id: Date.now().toString(),
            title: 'Reflexão Terapêutica',
            description: 'Reflita sobre os pontos discutidos na sessão de hoje',
            completed: false,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          };
          setTCCTasks(prev => [...prev, newTask]);
        }
      } else {
        throw new Error(data.error || 'Erro na API');
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [inputMessage, loading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const addThoughtRecord = useCallback((record: Omit<ThoughtRecord, 'id' | 'timestamp'>) => {
    const newRecord: ThoughtRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setThoughtRecords(prev => [...prev, newRecord]);
    
    // Enviar registro como mensagem para análise da IA
    const recordMessage = `Registro de Pensamento: Situação: "${record.situation}", Emoção: ${record.emotion} (${record.intensity}/10), Pensamento: "${record.automaticThought}"`;
    // Aqui seria interessante processar isso automaticamente
  }, []);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTCCTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded shadow p-4 max-w-6xl mx-auto">
      {/* Header TCC */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <span className="font-bold text-indigo-600 text-lg">ClaraMente TCC</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Terapia Cognitivo-Comportamental
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTCCPanel(!showTCCPanel)}
            className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg transition-colors"
          >
            {showTCCPanel ? 'Ocultar' : 'Ferramentas'} TCC
          </button>
          <span className={`text-sm font-medium ${sessionTime < 300 ? 'text-red-500' : 'text-gray-500'}`}>
            Sessão: {formatTime(sessionTime)}
          </span>
          <span className="text-sm text-gray-500">TCC (30 min)</span>
        </div>
      </div>

      <div className="flex gap-4 h-full min-h-0">
        {/* Chat Principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 border-l-4 border-indigo-400'
                }`}>
                  {message.tccContext?.technique && (
                    <div className="text-xs opacity-70 mb-1">
                      TCC: {message.tccContext.technique.replace('_', ' ').toUpperCase()}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border-l-4 border-indigo-400 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500">Clara está refletindo</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mt-4 flex gap-2 items-end">
            <textarea
              className="flex-1 border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Compartilhe seus pensamentos e sentimentos... (Enter para enviar)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              disabled={loading}
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>

        {/* Painel TCC Lateral */}
        {showTCCPanel && (
          <div className="w-80 bg-gray-50 rounded-lg p-4 border-l">
            <h3 className="font-semibold text-gray-800 mb-4">Ferramentas TCC</h3>
            
            {/* Crenças Identificadas */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Perfil de Crenças</h4>
              
              {/* Crenças Centrais */}
              {beliefProfile.coreBeliefs.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-blue-700 mb-1">Crenças Centrais</div>
                  <div className="space-y-1">
                    {beliefProfile.coreBeliefs.slice(-3).map((belief, index) => (
                      <div key={index} className="bg-blue-50 p-2 rounded text-xs border-l-2 border-blue-300">
                        <div className="font-medium text-blue-800">
                          {belief.domain === 'self' ? '🧠' : belief.domain === 'world' ? '🌍' : '🔮'} {belief.centralBelief}
                        </div>
                        <div className="text-blue-600">
                          Confiança: {Math.round(belief.confidence * 100)}% | {belief.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Crenças Intermediárias */}
              {beliefProfile.intermediateBeliefs.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-orange-700 mb-1">Crenças Intermediárias</div>
                  <div className="space-y-1">
                    {beliefProfile.intermediateBeliefs.slice(-2).map((belief, index) => (
                      <div key={index} className="bg-orange-50 p-2 rounded text-xs border-l-2 border-orange-300">
                        <div className="font-medium text-orange-800">
                          {belief.type === 'conditional_rule' ? '⚖️' : '🎯'} {belief.rule || belief.attitude}
                        </div>
                        <div className="text-orange-600">
                          {belief.category} | {belief.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {beliefProfile.coreBeliefs.length === 0 && beliefProfile.intermediateBeliefs.length === 0 && (
                <div className="text-xs text-gray-500 italic">
                  Nenhuma crença identificada ainda. Continue compartilhando para uma análise mais profunda.
                </div>
              )}
            </div>

            {/* Tarefas Terapêuticas */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Tarefas para Casa</h4>
              <div className="space-y-2">
                {tccTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-2 p-2 bg-white rounded border">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registros de Pensamento */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Registro de Pensamentos</h4>
              <div className="text-xs text-gray-600 mb-2">
                Registros hoje: {thoughtRecords.filter(r => 
                  new Date(r.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <button 
                onClick={() => {
                  // Aqui poderia abrir um modal para novo registro
                  const situation = prompt('Descreva a situação:');
                  const emotion = prompt('Que emoção você sentiu?');
                  const intensity = prompt('Intensidade (1-10):');
                  const thought = prompt('Que pensamento passou pela sua cabeça?');
                  
                  if (situation && emotion && intensity && thought) {
                    addThoughtRecord({
                      situation,
                      emotion,
                      intensity: parseInt(intensity),
                      automaticThought: thought
                    });
                  }
                }}
                className="w-full text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors"
              >
                + Novo Registro
              </button>
            </div>

            {/* Resumo da Sessão */}
            <div className="bg-indigo-50 p-3 rounded border">
              <h4 className="font-medium text-indigo-800 mb-2">Resumo da Sessão</h4>
              <div className="text-xs text-indigo-700 space-y-1">
                <div>Mensagens: {messages.length}</div>
                <div>Técnicas aplicadas: {new Set(messages.filter(m => m.tccContext?.technique).map(m => m.tccContext?.technique)).size}</div>
                <div>Crenças centrais: {beliefProfile.coreBeliefs.length}</div>
                <div>Crenças intermediárias: {beliefProfile.intermediateBeliefs.length}</div>
                <div>Tempo restante: {formatTime(sessionTime)}</div>
              </div>
              
              {/* Botão para análise das crenças */}
              {(beliefProfile.coreBeliefs.length > 0 || beliefProfile.intermediateBeliefs.length > 0) && (
                <button 
                  onClick={() => {
                    const analysisText = `Análise das crenças identificadas: ${beliefProfile.coreBeliefs.map(c => c.centralBelief).join(', ')}`;
                    setInputMessage(analysisText);
                  }}
                  className="w-full mt-2 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded transition-colors"
                >
                  Analisar Crenças Identificadas
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          Emergências: 188 (CVV) | 192 (SAMU) | 156 (Disk Saúde Mental)
        </span>
        <button
          className="text-red-600 hover:text-red-700 underline"
          onClick={() => window.open('/psychologists', '_blank')}
        >
          Buscar psicólogo especialista
        </button>
      </div>
    </div>
  );
}
