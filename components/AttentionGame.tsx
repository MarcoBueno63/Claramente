import React, { useState, useEffect } from 'react';
import { getUser } from '../lib/auth';

const getRandomIndex = (max: number) => Math.floor(Math.random() * max);

export default function AttentionGame() {
  const [target, setTarget] = useState(getRandomIndex(16));
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(3);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (active && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timer === 0) {
      setActive(false);
      // Envia resultado para API
      const user = getUser();
      fetch('/api/game-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          game: 'attention',
          score,
          details: { round, timer },
          timestamp: new Date().toISOString()
        })
      });
    }
  }, [timer, active, score, round]);

  const handleClick = (idx: number) => {
    if (!active) return;
    if (idx === target) {
      setScore(score + 1);
      nextRound();
    } else {
      setActive(false);
    }
  };

  const nextRound = () => {
    setTarget(getRandomIndex(16));
    setRound(round + 1);
    setTimer(Math.max(1, 3 - Math.floor(round / 5)));
    setActive(true);
  };

  const restart = () => {
    setTarget(getRandomIndex(16));
    setScore(0);
    setRound(1);
    setTimer(3);
    setActive(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4 text-center">🎯 Jogo de Atenção</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Array.from({ length: 16 }).map((_, idx) => (
          <button
            key={idx}
            className={`w-12 h-12 rounded border flex items-center justify-center transition-all duration-200 ${idx === target && active ? 'bg-yellow-400' : 'bg-gray-200'}`}
            onClick={() => handleClick(idx)}
            disabled={!active}
          >
            {idx === target && active ? '🎯' : ''}
          </button>
        ))}
      </div>
      <div className="text-center mb-2">Rodada: {round} | Pontuação: {score}</div>
      {!active && (
        <div className="text-center mt-4">
          <div className="text-red-600 font-bold">Fim de jogo! Sua pontuação: {score}</div>
          <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded" onClick={restart}>Jogar Novamente</button>
        </div>
      )}
    </div>
  );
}
