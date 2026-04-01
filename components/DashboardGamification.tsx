import React, { useState } from 'react';
import CognitiveDistortionQuiz from './CognitiveDistortionQuiz';
import { BreathingExercise, MoodTracker, MindfulnessTimer, MuscleRelaxation } from './InteractiveExercises';
import MemoryGame from './MemoryGame';
import AttentionGame from './AttentionGame';
import LogicGame from './LogicGame';
import CreativityGame from './CreativityGame';
import GameResultsReport from './GameResultsReport';

const initialAchievements = [
  { id: 1, label: 'Primeiro Registro de Humor', unlocked: false },
  { id: 2, label: 'Completou 5 ciclos de respiração', unlocked: false },
  { id: 3, label: 'Primeiro Quiz de Distorções', unlocked: false },
  { id: 4, label: 'Sessão de Mindfulness concluída', unlocked: false },
  { id: 5, label: 'Relaxamento Muscular completo', unlocked: false }
];

export default function DashboardGamification() {
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showMindfulness, setShowMindfulness] = useState(false);
  const [showRelax, setShowRelax] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showAttention, setShowAttention] = useState(false);
  const [showLogic, setShowLogic] = useState(false);
  const [showCreativity, setShowCreativity] = useState(false);

  // Funções para registrar conquistas e pontos
  const unlock = (id: number, pts: number) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
    setPoints(p => p + pts);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🎮 Painel de Gamificação</h2>

      {/* Relatório de Desempenho */}
      <GameResultsReport />

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Pontos: <span className="text-blue-600">{points}</span></div>
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-blue-100 rounded" onClick={() => setShowMood(v => !v)}>📊 Humor</button>
          <button className="px-2 py-1 bg-blue-100 rounded" onClick={() => setShowBreathing(v => !v)}>🫁 Respiração</button>
          <button className="px-2 py-1 bg-blue-100 rounded" onClick={() => setShowQuiz(v => !v)}>🧠 Quiz</button>
          <button className="px-2 py-1 bg-blue-100 rounded" onClick={() => setShowMindfulness(v => !v)}>🧘 Mindfulness</button>
          <button className="px-2 py-1 bg-blue-100 rounded" onClick={() => setShowRelax(v => !v)}>💪 Relaxamento</button>
          <button className="px-2 py-1 bg-yellow-100 rounded" onClick={() => setShowMemory(v => !v)}>🧠 Memória</button>
          <button className="px-2 py-1 bg-yellow-100 rounded" onClick={() => setShowAttention(v => !v)}>🎯 Atenção</button>
          <button className="px-2 py-1 bg-pink-100 rounded" onClick={() => setShowLogic(v => !v)}>🧩 Lógica</button>
          <button className="px-2 py-1 bg-pink-100 rounded" onClick={() => setShowCreativity(v => !v)}>🎨 Criatividade</button>
        </div>
            {/* Jogos Cognitivos */}
            {showMemory && (
              <div className="mb-6">
                <MemoryGame />
              </div>
            )}
            {showAttention && (
              <div className="mb-6">
                <AttentionGame />
              </div>
            )}
            {showLogic && (
              <div className="mb-6">
                <LogicGame />
              </div>
            )}
            {showCreativity && (
              <div className="mb-6">
                <CreativityGame />
              </div>
            )}
      </div>

      {/* Conquistas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🏆 Conquistas</h3>
        <ul className="grid grid-cols-2 gap-2">
          {achievements.map(a => (
            <li key={a.id} className={`p-2 rounded border ${a.unlocked ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'}`}>
              {a.unlocked ? '✅' : '🔒'} {a.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Exercícios/Jogos */}
      {showMood && (
        <div className="mb-6">
          <MoodTracker onSave={() => unlock(1, 10)} />
        </div>
      )}
      {showBreathing && (
        <div className="mb-6">
          <BreathingExercise onComplete={() => unlock(2, 15)} />
        </div>
      )}
      {showQuiz && (
        <div className="mb-6">
          <CognitiveDistortionQuiz />
          <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded" onClick={() => unlock(3, 20)}>
            Marcar Quiz como Concluído
          </button>
        </div>
      )}
      {showMindfulness && (
        <div className="mb-6">
          <MindfulnessTimer onComplete={() => unlock(4, 15)} />
        </div>
      )}
      {showRelax && (
        <div className="mb-6">
          <MuscleRelaxation onComplete={() => unlock(5, 15)} />
        </div>
      )}
    </div>
  );
}
