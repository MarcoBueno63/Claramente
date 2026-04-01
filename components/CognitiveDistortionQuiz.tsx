import React, { useState } from 'react';

// Exemplo de perguntas para o quiz de distorções cognitivas
const QUESTIONS = [
  {
    question: '"Se eu falhar uma vez, nunca serei bom o suficiente."',
    options: [
      { label: 'Catastrofização', correct: false },
      { label: 'Pensamento Tudo ou Nada', correct: true },
      { label: 'Personalização', correct: false },
      { label: 'Leitura Mental', correct: false }
    ],
    explanation: 'Pensamento tudo ou nada é ver situações em extremos, sem meio-termo.'
  },
  {
    question: '"Se ela não respondeu minha mensagem, deve estar brava comigo."',
    options: [
      { label: 'Leitura Mental', correct: true },
      { label: 'Catastrofização', correct: false },
      { label: 'Desqualificação do Positivo', correct: false },
      { label: 'Raciocínio Emocional', correct: false }
    ],
    explanation: 'Leitura mental é assumir que sabe o que o outro pensa, sem evidências.'
  },
  // Adicione mais perguntas conforme necessário
];

export default function CognitiveDistortionQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleOption = (idx: number) => {
    setSelected(idx);
    setShowExplanation(true);
    if (QUESTIONS[current].options[idx].correct) {
      setScore(score + 1);
    }
  };

  const next = () => {
    setSelected(null);
    setShowExplanation(false);
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Quiz finalizado!</h2>
        <p>Sua pontuação: {score} de {QUESTIONS.length}</p>
        <p className="mt-2 text-sm text-gray-500">Considere discutir seus resultados com seu psicólogo.</p>
      </div>
    );
  }

  const q = QUESTIONS[current];

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Quiz de Distorções Cognitivas</h2>
      <p className="mb-4">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            className={`w-full py-2 px-4 rounded border ${selected === idx ? (opt.correct ? 'bg-green-200' : 'bg-red-200') : 'bg-gray-100'} ${selected !== null && selected !== idx ? 'opacity-50' : ''}`}
            disabled={selected !== null}
            onClick={() => handleOption(idx)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="mt-4 p-2 bg-blue-50 rounded">
          <p><strong>Explicação:</strong> {q.explanation}</p>
          <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded" onClick={next}>
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
