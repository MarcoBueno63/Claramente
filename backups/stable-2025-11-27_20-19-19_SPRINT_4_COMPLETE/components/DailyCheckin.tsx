"use client";
import { useState, useEffect } from 'react';

interface DailyCheckinProps {
  userId: string;
  onComplete: (mood: number, note: string) => void;
}

const MOOD_OPTIONS = [
  { emoji: '😢', label: 'Muito mal', value: 1, color: 'text-red-500' },
  { emoji: '😟', label: 'Mal', value: 2, color: 'text-orange-500' },
  { emoji: '😐', label: 'Neutro', value: 3, color: 'text-yellow-500' },
  { emoji: '🙂', label: 'Bem', value: 4, color: 'text-lime-500' },
  { emoji: '😄', label: 'Muito bem', value: 5, color: 'text-green-500' },
];

export default function DailyCheckin({ userId, onComplete }: DailyCheckinProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [weeklyData, setWeeklyData] = useState<number[]>([]);

  useEffect(() => {
    checkIfShouldShow();
    loadWeeklyData();
  }, [userId]);

  const checkIfShouldShow = () => {
    const lastCheckinKey = `daily-checkin-${userId}`;
    const lastCheckin = localStorage.getItem(lastCheckinKey);
    const today = new Date().toDateString();

    if (lastCheckin !== today) {
      setIsOpen(true);
    }
  };

  const loadWeeklyData = () => {
    const weekKey = `weekly-moods-${userId}`;
    const stored = localStorage.getItem(weekKey);
    if (stored) {
      setWeeklyData(JSON.parse(stored));
    }
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;

    // Salvar check-in de hoje
    const today = new Date().toDateString();
    localStorage.setItem(`daily-checkin-${userId}`, today);

    // Salvar humor do dia
    const moodKey = `mood-${userId}-${today}`;
    localStorage.setItem(moodKey, JSON.stringify({ mood: selectedMood, note, date: today }));

    // Atualizar dados semanais
    const newWeeklyData = [...weeklyData.slice(-6), selectedMood];
    localStorage.setItem(`weekly-moods-${userId}`, JSON.stringify(newWeeklyData));

    onComplete(selectedMood, note);
    setIsOpen(false);
  };

  const handleSkip = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`daily-checkin-${userId}`, today);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const averageMood = weeklyData.length > 0
    ? (weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length).toFixed(1)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Como você está hoje? 💙
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Registre seu humor diário para acompanhar seu progresso
          </p>
        </div>

        {/* Mood Selector */}
        <div className="flex justify-between gap-2 mb-6">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                selectedMood === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 scale-105'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <span className="text-4xl mb-1">{option.emoji}</span>
              <span className={`text-xs font-medium ${option.color}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Optional Note */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            O que está acontecendo? (opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva como você está se sentindo..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white"
            rows={3}
          />
        </div>

        {/* Weekly Trend */}
        {weeklyData.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tendência Semanal
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                Média: {averageMood}/5
              </span>
            </div>
            <div className="flex items-end justify-between gap-1 h-16">
              {weeklyData.map((mood, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(mood / 5) * 100}%` }}
                  title={`Dia ${index + 1}: ${mood}/5`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Pular Hoje
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedMood === null}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMood !== null
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
