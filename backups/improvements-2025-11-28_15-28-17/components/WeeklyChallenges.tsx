'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChallenges } from '@/hooks/useChallenges';
import { useXP } from '@/hooks/useXP';
import { useBadges } from '@/hooks/useBadges';
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/lib/challenges';

interface WeeklyChallengesProps {
  userId: string;
  variant?: 'full' | 'compact';
}

export default function WeeklyChallenges({ userId, variant = 'full' }: WeeklyChallengesProps) {
  const {
    challenges,
    isLoading,
    completedChallenge,
    dismissCompletedChallenge,
    getActiveChallenges,
    getCompletedChallenges,
  } = useChallenges(userId);

  const { addXP } = useXP(userId);
  const { updateSpecialFlag } = useBadges(userId);

  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly'>('daily');
  const [showCompleted, setShowCompleted] = useState(false);

  const activeChallenges = getActiveChallenges();
  const completedChallenges = getCompletedChallenges();

  const displayChallenges = showCompleted
    ? completedChallenges[selectedTab]
    : activeChallenges[selectedTab];

  const handleClaimReward = (challenge: Challenge) => {
    // Adicionar XP
    addXP(`Desafio: ${challenge.title}`, challenge.rewards.xp);

    // Se tem badge especial, marcar como desbloqueado
    if (challenge.rewards.badgeId) {
      updateSpecialFlag(`challenge_${challenge.rewards.badgeId}`, true);
    }

    dismissCompletedChallenge();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Desafios Ativos
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {activeChallenges.daily.length + activeChallenges.weekly.length} ativos
            </div>
          </div>

          {/* Próximos a expirar */}
          <div className="space-y-2">
            {[...activeChallenges.daily, ...activeChallenges.weekly]
              .slice(0, 3)
              .map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  size="small"
                />
              ))}
          </div>
        </div>

        {/* Modal de desafio completado */}
        {completedChallenge && (
          <ChallengeCompletedModal
            challenge={completedChallenge}
            onClaim={() => handleClaimReward(completedChallenge)}
            onDismiss={dismissCompletedChallenge}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              Desafios
            </h2>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {activeChallenges.daily.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Diários Ativos</div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {activeChallenges.weekly.length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Semanais Ativos</div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {completedChallenges.daily.length + completedChallenges.weekly.length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Completados</div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {completedChallenges.daily.length + completedChallenges.weekly.length > 0
                  ? Math.floor(
                      ((completedChallenges.daily.length + completedChallenges.weekly.length) /
                        (challenges.daily.length + challenges.weekly.length)) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Taxa de Conclusão</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('daily')}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all
                ${
                  selectedTab === 'daily'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              ☀️ Diários ({challenges.daily.length})
            </button>
            <button
              onClick={() => setSelectedTab('weekly')}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all
                ${
                  selectedTab === 'weekly'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              📅 Semanais ({challenges.weekly.length})
            </button>
          </div>

          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`
              ml-auto px-4 py-2 rounded-lg font-medium text-sm
              flex items-center gap-2 transition-all
              ${
                showCompleted
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <span className="text-base">{showCompleted ? '✓' : '⏳'}</span>
            {showCompleted ? 'Completados' : 'Ativos'}
          </button>
        </div>

        {/* Challenge Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {displayChallenges.map(challenge => (
              <motion.div
                key={challenge.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ChallengeCard
                  challenge={challenge}
                  onClaim={challenge.isCompleted ? () => handleClaimReward(challenge) : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {displayChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{showCompleted ? '🎉' : '🎯'}</div>
            <p className="text-gray-600 dark:text-gray-400">
              {showCompleted
                ? 'Nenhum desafio completado ainda. Continue praticando!'
                : 'Todos os desafios foram completados! Volte amanhã para novos desafios.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de desafio completado */}
      {completedChallenge && (
        <ChallengeCompletedModal
          challenge={completedChallenge}
          onClaim={() => handleClaimReward(completedChallenge)}
          onDismiss={dismissCompletedChallenge}
        />
      )}
    </>
  );
}

function ChallengeCompletedModal({
  challenge,
  onClaim,
  onDismiss,
}: {
  challenge: Challenge;
  onClaim: () => void;
  onDismiss: () => void;
}) {
  const colors = getChallengeDifficultyColor(challenge.difficulty);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            relative max-w-md w-full rounded-2xl border-4
            ${colors.bg} ${colors.border}
            p-8 shadow-2xl
          `}
        >
          {/* Confetti animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
                className={`absolute w-2 h-2 ${
                  i % 4 === 0
                    ? 'bg-yellow-400'
                    : i % 4 === 1
                    ? 'bg-pink-400'
                    : i % 4 === 2
                    ? 'bg-blue-400'
                    : 'bg-purple-400'
                } rounded-full`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="text-8xl mb-4"
            >
              {challenge.icon}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Desafio Completo! 🎉
              </h2>

              <h3 className={`text-2xl font-bold mb-2 ${colors.text}`}>
                {challenge.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {challenge.description}
              </p>

              {/* Rewards */}
              <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recompensas</div>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      +{challenge.rewards.xp}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
                  </div>

                  {challenge.rewards.badgeId && (
                    <div className="text-center">
                      <div className="text-3xl">🏆</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Badge Especial</div>
                    </div>
                  )}

                  {challenge.rewards.specialReward && (
                    <div className="text-center">
                      <div className="text-3xl">🎁</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {challenge.rewards.specialReward}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClaim}
                className={`
                  w-full px-8 py-3 rounded-xl font-bold
                  ${colors.badge} text-white
                  hover:scale-105 active:scale-95
                  transition-transform shadow-lg
                `}
              >
                🎁 Resgatar Recompensas
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getChallengeDifficultyColor(difficulty: string) {
  // Re-import from lib (inline for modal component)
  const colors = {
    easy: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-400 dark:border-green-600',
      text: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-500',
    },
    medium: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-400 dark:border-blue-600',
      text: 'text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-500',
    },
    hard: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-400 dark:border-purple-600',
      text: 'text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-500',
    },
    expert: {
      bg: 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
      border: 'border-orange-400 dark:border-orange-600',
      text: 'text-orange-700 dark:text-orange-300',
      badge: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
  };

  return colors[difficulty as keyof typeof colors] || colors.easy;
}
