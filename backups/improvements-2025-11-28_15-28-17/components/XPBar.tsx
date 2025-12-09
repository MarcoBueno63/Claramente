'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '../hooks/useXP';
import { useState } from 'react';

interface XPBarProps {
  userId: string;
  variant?: 'full' | 'compact' | 'minimal';
  showDetails?: boolean;
}

/**
 * Barra de XP e Níveis
 * Exibe progresso visual do usuário no sistema de gamificação
 */
export default function XPBar({ userId, variant = 'full', showDetails = true }: XPBarProps) {
  const { xpState, isLoading, showLevelUp, newLevel, closeLevelUp } = useXP(userId);
  const [showStats, setShowStats] = useState(false);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded-lg"></div>
    );
  }

  // Variante minimal - apenas barra
  if (variant === 'minimal') {
    return (
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${xpState.xpProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    );
  }

  // Variante compact - barra + nível
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {xpState.level}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {xpState.levelTitle}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {xpState.currentLevelXP}/{xpState.xpToNextLevel} XP
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpState.xpProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Variante full - completa com detalhes
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white dark:ring-gray-800">
              {xpState.level}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Nível {xpState.level}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {xpState.levelTitle}
              </p>
            </div>
          </div>
          
          {showDetails && (
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Ver estatísticas detalhadas"
            >
              <span className="text-2xl">📊</span>
            </button>
          )}
        </div>

        {/* Barra de progresso */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Progresso para o próximo nível
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {Math.floor(xpState.xpProgress)}%
            </span>
          </div>
          
          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpState.xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {xpState.currentLevelXP} XP
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {xpState.xpToNextLevel} XP
            </span>
          </div>
        </div>

        {/* XP Total */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">XP Total</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {xpState.totalXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Ganhos recentes */}
        {showDetails && xpState.recentGains.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: showStats ? 'auto' : 0, opacity: showStats ? 1 : 0 }}
            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ganhos Recentes
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {xpState.recentGains.slice(0, 5).map((gain) => (
                <div
                  key={gain.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {gain.action}
                    {gain.multiplier && gain.multiplier > 1 && (
                      <span className="ml-1 text-green-600 dark:text-green-400">
                        (×{gain.multiplier})
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    +{gain.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Level Up */}
      <AnimatePresence>
        {showLevelUp && newLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeLevelUp}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 100}%`,
                      y: `${50 + (Math.random() - 0.5) * 100}%`,
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      delay: Math.random() * 0.3,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Level Up!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <div className="inline-block w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-4xl shadow-lg ring-4 ring-white dark:ring-gray-800">
                  {newLevel}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6"
              >
                Você alcançou o Nível {newLevel}!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={closeLevelUp}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              >
                Continuar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}
