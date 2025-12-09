'use client';

import { motion } from 'framer-motion';
import {
  Challenge,
  getChallengeDifficultyColor,
  getChallengeDifficultyLabel,
  getTimeRemaining,
} from '@/lib/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onClaim?: () => void;
  size?: 'small' | 'large';
}

export default function ChallengeCard({ challenge, onClaim, size = 'large' }: ChallengeCardProps) {
  const colors = getChallengeDifficultyColor(challenge.difficulty);
  const difficultyLabel = getChallengeDifficultyLabel(challenge.difficulty);
  const timeRemaining = getTimeRemaining(challenge.endDate);
  const progress = challenge.progress || 0;

  const isSmall = size === 'small';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${colors.bg} rounded-xl border-2 ${colors.border}
        ${challenge.isCompleted ? 'opacity-75' : ''}
        overflow-hidden transition-all duration-300
        ${isSmall ? 'p-3' : 'p-4'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={isSmall ? 'text-2xl' : 'text-4xl'}>{challenge.icon}</div>
          <div className="flex-1">
            <h3 className={`font-bold ${colors.text} ${isSmall ? 'text-sm' : 'text-lg'}`}>
              {challenge.title}
            </h3>
            {!isSmall && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {challenge.description}
              </p>
            )}
          </div>
        </div>

        {/* Difficulty badge */}
        <div
          className={`
            ${colors.badge} text-white text-xs font-bold
            px-2 py-1 rounded-full whitespace-nowrap
          `}
        >
          {difficultyLabel}
        </div>
      </div>

      {/* Requirements */}
      {!isSmall && (
        <div className="mb-3 space-y-1">
          {challenge.requirements.map((req, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300">{req.description}</span>
              <span className={`font-bold ${colors.text}`}>
                {req.current || 0}/{req.target}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${colors.text}`}>
            Progresso
          </span>
          <span className={`text-xs font-bold ${colors.text}`}>
            {Math.floor(progress)}%
          </span>
        </div>
        <div className={`h-${isSmall ? '2' : '3'} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${colors.badge}`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Time remaining */}
          <div className="flex items-center gap-1">
            <span className="text-lg">⏰</span>
            <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400`}>
              {timeRemaining}
            </span>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-1">
            <span className="text-lg">💎</span>
            <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-bold text-green-600 dark:text-green-400`}>
              +{challenge.rewards.xp} XP
            </span>
          </div>
        </div>

        {/* Claim button */}
        {challenge.isCompleted && onClaim && (
          <button
            onClick={onClaim}
            className={`
              ${colors.badge} text-white font-bold
              ${isSmall ? 'text-xs px-3 py-1' : 'text-sm px-4 py-2'}
              rounded-lg hover:scale-105 active:scale-95
              transition-transform shadow-lg
            `}
          >
            🎁 Resgatar
          </button>
        )}

        {challenge.isCompleted && !onClaim && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <span className="text-xl">✓</span>
            <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-bold`}>Completo</span>
          </div>
        )}
      </div>

      {/* Special reward indicator */}
      {challenge.rewards.specialReward && !isSmall && (
        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
              {challenge.rewards.specialReward}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
