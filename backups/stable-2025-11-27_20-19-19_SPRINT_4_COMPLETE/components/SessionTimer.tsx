"use client";
import { memo } from 'react';

interface TimerProps {
  timeRemaining: number;
  sessionActive: boolean;
  showWarning: boolean;
}

const SessionTimer = memo(function SessionTimer({ timeRemaining, sessionActive, showWarning }: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionActive) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
        ⏰ Sessão encerrada - Tempo limite atingido
      </div>
    );
  }

  return (
    <div className={`px-3 py-2 rounded-lg text-sm ${
      showWarning 
        ? 'bg-yellow-100 border border-yellow-300 text-yellow-700' 
        : 'bg-green-100 border border-green-300 text-green-700'
    }`}>
      ⏱️ Tempo restante: {formatTime(timeRemaining)}
      {showWarning && " - Sessão encerrará em breve!"}
    </div>
  );
});

export default SessionTimer;