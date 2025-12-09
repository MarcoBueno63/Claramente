'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadges, BadgeWithProgress } from '@/hooks/useBadges';
import BadgeCard, { BadgeUnlockedModal } from './BadgeCard';
import { BadgeCategory, calculateBadgeProgress } from '@/lib/badges';

interface BadgeGalleryProps {
  userId: string;
  variant?: 'full' | 'compact';
}

export default function BadgeGallery({ userId, variant = 'full' }: BadgeGalleryProps) {
  const {
    badges,
    isLoading,
    newlyUnlocked,
    dismissNewBadge,
    getUnlockedBadges,
    getLockedBadges,
    getNextBadges,
  } = useBadges(userId);

  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithProgress | null>(null);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const unlockedBadges = getUnlockedBadges();
    return calculateBadgeProgress(unlockedBadges);
  }, [getUnlockedBadges]);

  // Filtrar badges
  const filteredBadges = useMemo(() => {
    let filtered = badges;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    // Filtrar por status
    if (showOnlyUnlocked) {
      filtered = filtered.filter(b => b.isUnlocked);
    }

    return filtered;
  }, [badges, selectedCategory, showOnlyUnlocked]);

  // Próximos badges
  const nextBadges = useMemo(() => getNextBadges(3), [getNextBadges]);

  const categories: { id: BadgeCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: <span className="text-base">🏆</span> },
    { id: 'progress', label: 'Progresso', icon: <span className="text-base">🎯</span> },
    { id: 'streaks', label: 'Streaks', icon: <span className="text-base">🔥</span> },
    { id: 'exercises', label: 'Exercícios', icon: <span className="text-base">💪</span> },
    { id: 'emotions', label: 'Emoções', icon: <span className="text-base">🎭</span> },
    { id: 'special', label: 'Especiais', icon: <span className="text-base">⭐</span> },
  ];

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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Conquistas
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stats.unlocked}/{stats.total} desbloqueados
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600"
              />
            </div>
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
              {Math.floor(stats.percentage)}% completo
            </p>
          </div>

          {/* Next badges to unlock */}
          {nextBadges.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Próximos Objetivos
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {nextBadges.map(badge => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    size="small"
                    onClick={() => setSelectedBadge(badge)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de detalhes do badge */}
        {selectedBadge && (
          <BadgeDetailsModal
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        )}

        {/* Modal de badge desbloqueado */}
        {newlyUnlocked && (
          <BadgeUnlockedModal badge={newlyUnlocked} onDismiss={dismissNewBadge} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Header com estatísticas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-3xl">🏆</span>
              Galeria de Badges
            </h2>
          </div>

          {/* Estatísticas gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.unlocked}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Desbloqueados</div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {stats.total}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total</div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {Math.floor(stats.percentage)}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Completo</div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">
                {stats.total - stats.unlocked}
              </div>
              <div className="text-sm text-pink-600 dark:text-pink-400">Restantes</div>
            </div>
          </div>

          {/* Barra de progresso geral */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm
                  flex items-center gap-2 transition-all
                  ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {cat.icon}
                {cat.label}
                {cat.id !== 'all' && (
                  <span className="text-xs opacity-75">
                    ({stats.byCategory[cat.id as BadgeCategory]?.unlocked || 0}/
                    {stats.byCategory[cat.id as BadgeCategory]?.total || 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Toggle desbloqueados */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                flex items-center gap-2 transition-all
                ${
                  showOnlyUnlocked
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <span className="text-base">{showOnlyUnlocked ? '🏅' : '🔒'}</span>
              {showOnlyUnlocked ? 'Apenas Desbloqueados' : 'Mostrar Todos'}
            </button>
          </div>
        </div>

        {/* Grid de badges */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredBadges.map(badge => (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <BadgeCard
                  badge={badge}
                  size="medium"
                  onClick={() => setSelectedBadge(badge)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum badge encontrado com os filtros selecionados
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalhes do badge */}
      {selectedBadge && (
        <BadgeDetailsModal
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}

      {/* Modal de badge desbloqueado */}
      {newlyUnlocked && (
        <BadgeUnlockedModal badge={newlyUnlocked} onDismiss={dismissNewBadge} />
      )}
    </>
  );
}

function BadgeDetailsModal({
  badge,
  onClose,
}: {
  badge: BadgeWithProgress;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="text-8xl mb-4">{badge.icon}</div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            {badge.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{badge.description}</p>

          {badge.isUnlocked ? (
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                Desbloqueado! ✓
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                +{badge.xpReward} XP obtidos
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Progresso</div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${badge.progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                />
              </div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {Math.floor(badge.progressPercent)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Recompensa: +{badge.xpReward} XP
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
