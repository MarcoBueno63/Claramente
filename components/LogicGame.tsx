import React, { useState } from 'react';
import { getUser } from '../lib/auth';

const QUESTIONS = [
  {
    question: 'Qual número completa a sequência? 2, 4, 6, 8, ?',
    options: ['9', '10', '12', '8'],
    answer: 1
  },
  {
    question: 'Se todos os gatos são animais e alguns animais são pretos, podemos afirmar que:',
    options: [
      'Todos os gatos são pretos',
      'Alguns gatos podem ser pretos',
      'Nenhum gato é preto',
      'Todos os animais são gatos'
    ],
    answer: 1
  },
  // Adicione mais questões de lógica
];

export default function LogicGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleOption = (idx: number) => {
    if (idx === QUESTIONS[current].answer) setScore(score + 1);
    if (current + 1 < QUESTIONS.length) setCurrent(current + 1);
    else setFinished(true);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    // Envia resultado para API
    const user = getUser();
    fetch('/api/game-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        game: 'logic',
        score,
        details: { total: QUESTIONS.length },
        timestamp: new Date().toISOString()
      })
    });
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Jogo de Lógica finalizado!</h2>
        <p>Sua pontuação: {score} de {QUESTIONS.length}</p>
        <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded" onClick={restart}>Jogar Novamente</button>
      </div>
    );
  }

  const q = QUESTIONS[current];

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">🧩 Jogo de Lógica</h2>
      <p className="mb-4">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            className="w-full py-2 px-4 rounded border bg-gray-100 hover:bg-blue-100"
            onClick={() => handleOption(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
