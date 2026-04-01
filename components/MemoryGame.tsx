import React, { useState, useEffect } from 'react';
import { getUser } from '../lib/auth';

const symbols = ['🍎','🍌','🍇','🍉','🍒','🍋','🍓','🍍'];
const getShuffledCards = () => {
  const cards = [...symbols, ...symbols].map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

export default function MemoryGame() {
  const [cards, setCards] = useState(getShuffledCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setTimeout(() => {
        const [i, j] = flipped;
        if (cards[i].symbol === cards[j].symbol) {
          const newCards = cards.map((c, idx) => idx === i || idx === j ? { ...c, matched: true } : c);
          setCards(newCards);
          setMatchedCount(matchedCount + 1);
          if (matchedCount + 1 === symbols.length) {
            setFinished(true);
            // Envia resultado para API
            const user = getUser();
            fetch('/api/game-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                game: 'memory',
                score: moves + 1,
                details: { moves: moves + 1 },
                timestamp: new Date().toISOString()
              })
            });
          }
        } else {
          setCards(cards.map((c, idx) => idx === i || idx === j ? { ...c, flipped: false } : c));
        }
        setFlipped([]);
        setMoves(moves + 1);
      }, 800);
    }
  }, [flipped, cards, matchedCount, moves]);

  const handleFlip = (idx: number) => {
    if (flipped.length < 2 && !cards[idx].flipped && !cards[idx].matched) {
      setCards(cards.map((c, i) => i === idx ? { ...c, flipped: true } : c));
      setFlipped([...flipped, idx]);
    }
  };

  const restart = () => {
    setCards(getShuffledCards());
    setFlipped([]);
    setMatchedCount(0);
    setMoves(0);
    setFinished(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4 text-center">🧠 Jogo da Memória</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            className={`w-16 h-16 text-2xl rounded border flex items-center justify-center transition-all duration-200 ${card.flipped || card.matched ? 'bg-blue-200' : 'bg-gray-200'}`}
            onClick={() => handleFlip(idx)}
            disabled={card.flipped || card.matched || flipped.length === 2}
          >
            {card.flipped || card.matched ? card.symbol : '?'}
          </button>
        ))}
      </div>
      <div className="text-center mb-2">Movimentos: {moves}</div>
      {finished && (
        <div className="text-center mt-4">
          <div className="text-green-600 font-bold">Parabéns! Você completou o jogo!</div>
          <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded" onClick={restart}>Jogar Novamente</button>
        </div>
      )}
    </div>
  );
}
