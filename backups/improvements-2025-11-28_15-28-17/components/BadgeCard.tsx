'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge, getBadgeRarityColor, getBadgeRarityLabel } from '@/lib/badges';
import { BadgeWithProgress } from '@/hooks/useBadges';

interface BadgeCardProps {
  badge: BadgeWithProgress;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function BadgeCard({ badge, onClick, size = 'medium' }: BadgeCardProps) {
  const colors = getBadgeRarityColor(badge.rarity);
  const rarityLabel = getBadgeRarityLabel(badge.rarity);

  const sizes = {
    small: {
      card: 'w-20 h-24',
      icon: 'text-3xl',
      name: 'text-xs',
      description: 'hidden',
      progress: 'h-1',
    },
    medium: {
      card: 'w-32 h-40',
      icon: 'text-5xl',
      name: 'text-sm',
      description: 'text-xs',
      progress: 'h-2',
    },
    large: {
      card: 'w-48 h-56',
      icon: 'text-7xl',
      name: 'text-base',
      description: 'text-sm',
      progress: 'h-3',
    },
  };

  const sizeClasses = sizes[size];

  return (
    <motion.div
      whileHover={badge.isUnlocked ? { scale: 1.05, y: -4 } : {}}
      whileTap={badge.isUnlocked ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        ${sizeClasses.card}
        relative rounded-xl border-2 overflow-hidden
        transition-all duration-300 cursor-pointer
        ${badge.isUnlocked ? colors.bg : 'bg-gray-50 dark:bg-gray-800'}
        ${badge.isUnlocked ? colors.border : 'border-gray-200 dark:border-gray-700'}
        ${badge.isUnlocked ? `shadow-lg ${colors.glow}` : 'opacity-60 grayscale'}
      `}
    >
      {/* Rarity indicator */}
      {badge.isUnlocked && (
        <div
          className={`
            absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg
            text-xs font-bold ${colors.bg} ${colors.text} ${colors.border}
            border-l border-b
          `}
        >
          {rarityLabel}
        </div>
      )}

      {/* Lock indicator for locked badges */}
      {!badge.isUnlocked && (
        <div className="absolute top-2 right-2 text-gray-400 dark:text-gray-600">
          🔒
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center h-1/2">
        <div className={sizeClasses.icon}>{badge.icon}</div>
      </div>

      {/* Content */}
      <div className="px-2 pb-2 h-1/2 flex flex-col justify-between">
        <div>
          <h3
            className={`
              ${sizeClasses.name} font-bold text-center
              ${badge.isUnlocked ? colors.text : 'text-gray-500 dark:text-gray-400'}
            `}
          >
            {badge.name}
          </h3>
          
          {size !== 'small' && (
            <p
              className={`
                ${sizeClasses.description} text-center mt-1
                ${badge.isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}
              `}
            >
              {badge.description}
            </p>
          )}
        </div>

        {/* Progress bar for locked badges */}
        {!badge.isUnlocked && badge.progressPercent > 0 && (
          <div className="mt-2">
            <div className={`w-full ${sizeClasses.progress} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${badge.progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              />
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
              {Math.floor(badge.progressPercent)}%
            </p>
          </div>
        )}

        {/* XP reward for unlocked badges */}
        {badge.isUnlocked && size !== 'small' && (
          <div className="mt-2 text-center">
            <span className="text-xs font-bold text-green-600 dark:text-green-400">
              +{badge.xpReward} XP
            </span>
          </div>
        )}
      </div>

      {/* Shine effect for legendary badges */}
      {badge.isUnlocked && badge.rarity === 'legendary' && (
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
}

interface BadgeUnlockedModalProps {
  badge: Badge;
  onDismiss: () => void;
}

export function BadgeUnlockedModal({ badge, onDismiss }: BadgeUnlockedModalProps) {
  const colors = getBadgeRarityColor(badge.rarity);
  const rarityLabel = getBadgeRarityLabel(badge.rarity);

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
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-2xl"
          >
            ✕
          </button>

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
              {badge.icon}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Badge Desbloqueado! 🎉
              </h2>

              <div
                className={`
                  inline-block px-4 py-1 rounded-full mb-4
                  ${colors.bg} ${colors.border} border-2
                `}
              >
                <span className={`text-sm font-bold ${colors.text}`}>
                  {rarityLabel}
                </span>
              </div>

              <h3 className={`text-2xl font-bold mb-2 ${colors.text}`}>
                {badge.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {badge.description}
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    +{badge.xpReward}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
                </div>
              </div>

              <button
                onClick={onDismiss}
                className={`
                  px-8 py-3 rounded-xl font-bold
                  ${colors.bg} ${colors.border} ${colors.text}
                  border-2 hover:scale-105 active:scale-95
                  transition-transform shadow-lg
                `}
              >
                Incrível! 🚀
              </button>
            </motion.div>
          </div>

          {/* Glow effect for legendary */}
          {badge.rarity === 'legendary' && (
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 blur-xl"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
