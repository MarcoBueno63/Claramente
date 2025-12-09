'use client';

import { useHaptics } from '@/hooks/useHaptics';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HapticDemo() {
  const haptics = useHaptics();
  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <button
        onClick={() => {
          haptics.tap();
          setShowDemo(true);
        }}
        className="fixed bottom-20 right-4 z-40 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:bg-purple-700 transition-colors"
      >
        📳 Testar Haptic
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-20 right-4 z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-80 max-h-96 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Feedback Tátil</h3>
        <button
          onClick={() => {
            haptics.tap();
            setShowDemo(false);
          }}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {!haptics.isSupported && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ Seu dispositivo não suporta vibração
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Básico
        </h4>
        <HapticButton onClick={haptics.tap} label="Toque Leve" />
        <HapticButton onClick={haptics.press} label="Toque Médio" />
        <HapticButton onClick={haptics.longPress} label="Toque Forte" />

        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">
          Feedback de Ação
        </h4>
        <HapticButton onClick={haptics.success} label="✅ Sucesso" />
        <HapticButton onClick={haptics.warning} label="⚠️ Aviso" />
        <HapticButton onClick={haptics.error} label="❌ Erro" />

        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">
          Exercícios Terapêuticos
        </h4>
        <HapticButton onClick={haptics.breatheIn} label="🫁 Inspire (4s)" />
        <HapticButton onClick={haptics.breatheOut} label="🫁 Expire (6s)" />
        <HapticButton onClick={haptics.breatheCycle} label="🫁 Ciclo Completo" />
        <HapticButton onClick={haptics.grounding} label="🧘 Grounding" />
        <HapticButton onClick={haptics.calm} label="😌 Acalmar" />

        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">
          Gamificação
        </h4>
        <HapticButton onClick={haptics.celebration} label="🎉 Celebração" />
        <HapticButton onClick={haptics.streak} label="🔥 Streak" />
        <HapticButton onClick={haptics.levelUp} label="⬆️ Level Up" />
      </div>
    </motion.div>
  );
}

function HapticButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors text-left"
    >
      {label}
    </button>
  );
}
