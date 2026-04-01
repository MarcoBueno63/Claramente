import React, { useState } from 'react';
import { getUser } from '../lib/auth';

const PROMPTS = [
  'Invente uma história curta usando as palavras: sol, bicicleta, cachorro.',
  'Desenhe mentalmente um objeto que não existe e descreva-o em 2 frases.',
  'Crie um slogan para um produto imaginário de saúde mental.',
  'Liste 3 usos criativos para um guarda-chuva.'
  // Adicione mais prompts criativos
];

export default function CreativityGame() {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    setResponses([...responses, input]);
    setInput('');
    if (current + 1 < PROMPTS.length) setCurrent(current + 1);
    else setFinished(true);
  };

  const restart = () => {
    setCurrent(0);
    setInput('');
    setResponses([]);
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
        game: 'creativity',
        score: responses.length,
        details: { responses },
        timestamp: new Date().toISOString()
      })
    });
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Jogo de Criatividade finalizado!</h2>
        <p>Veja suas respostas abaixo e compartilhe com seu terapeuta:</p>
        <ul className="mt-2 text-left list-disc list-inside">
          {responses.map((resp, idx) => (
            <li key={idx}>{PROMPTS[idx]} <br /><span className="text-blue-600">{resp}</span></li>
          ))}
        </ul>
        <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded" onClick={restart}>Jogar Novamente</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">🎨 Jogo de Criatividade</h2>
      <p className="mb-4">{PROMPTS[current]}</p>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Digite sua resposta aqui..."
      />
      <button
        className="w-full px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleNext}
        disabled={!input.trim()}
      >
        Próximo
      </button>
    </div>
  );
}
