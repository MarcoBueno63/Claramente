'use client';

import { useLeaderboard, type Milestone } from '@/hooks/useLeaderboard';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface PersonalLeaderboardProps {
  userId: string;
  variant?: 'full' | 'compact';
}

export default function PersonalLeaderboard({ userId, variant = 'full' }: PersonalLeaderboardProps) {
  const {
    personalStats,
    privacySettings,
    trendData,
    isLoading,
    updatePrivacySettings,
    platformAverages,
    percentiles,
    milestones,
    nextMilestone,
    growthStats,
  } = useLeaderboard(userId);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // ================================
  // VARIANTE COMPACTA
  // ================================

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meu Progresso</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nível {personalStats.currentLevel} • {personalStats.totalXP.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{personalStats.badgesUnlocked}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Badges Desbloqueados</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-3 border border-cyan-200 dark:border-cyan-800">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{personalStats.challengesCompleted}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Desafios Completados</div>
          </div>
        </div>

        {/* Current Streak */}
        {personalStats.currentStreak > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {personalStats.currentStreak} dias
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Streak Atual</div>
                </div>
              </div>
              {personalStats.longestStreak > personalStats.currentStreak && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {personalStats.longestStreak}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Recorde</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================================
  // VARIANTE COMPLETA
  // ================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Privacidade */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            📊
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Progresso Pessoal</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Acompanhe sua jornada de crescimento
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <span>🔒</span>
          <span>Privacidade</span>
        </button>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Total */}
        <StatCard
          icon="⭐"
          value={personalStats.totalXP.toLocaleString()}
          label="XP Total"
          gradient="from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          border="border-yellow-200 dark:border-yellow-800"
          showComparison={privacySettings.showComparison}
          platformAvg={platformAverages?.avgXP}
          percentile={percentiles?.xpPercentile}
        />

        {/* Nível Atual */}
        <StatCard
          icon="🎖️"
          value={personalStats.currentLevel.toString()}
          label="Nível Atual"
          gradient="from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
          border="border-purple-200 dark:border-purple-800"
          showComparison={privacySettings.showComparison}
          platformAvg={platformAverages?.avgLevel}
        />

        {/* Badges */}
        <StatCard
          icon="🏆"
          value={`${personalStats.badgesUnlocked}/${personalStats.totalBadges}`}
          label="Badges"
          gradient="from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20"
          border="border-cyan-200 dark:border-cyan-800"
          showComparison={privacySettings.showComparison}
          platformAvg={platformAverages?.avgBadges}
          percentile={percentiles?.badgesPercentile}
        />

        {/* Desafios */}
        <StatCard
          icon="🎯"
          value={personalStats.challengesCompleted.toString()}
          label="Desafios"
          gradient="from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          border="border-green-200 dark:border-green-800"
          showComparison={privacySettings.showComparison}
          platformAvg={platformAverages?.avgChallenges}
          percentile={percentiles?.challengesPercentile}
        />
      </div>

      {/* Streak e Atividade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔥</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Streak Atual</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dias consecutivos</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {personalStats.currentStreak}
              </span>
              <span className="text-xl text-gray-600 dark:text-gray-400">dias</span>
            </div>

            {personalStats.longestStreak > personalStats.currentStreak && (
              <div className="flex items-center justify-between pt-3 border-t border-red-200 dark:border-red-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Seu recorde:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {personalStats.longestStreak} dias 🏆
                </span>
              </div>
            )}

            {privacySettings.showComparison && platformAverages && (
              <div className="flex items-center justify-between pt-3 border-t border-red-200 dark:border-red-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Média da plataforma:</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {platformAverages.avgStreak} dias
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Atividade Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📈</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Atividade</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessões e exercícios</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sessões completadas:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {personalStats.sessionsCompleted}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Exercícios feitos:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {personalStats.exercisesCompleted}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Emoções identificadas:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {personalStats.emotionsIdentified}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Crescimento Semanal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Crescimento Médio Semanal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Baseado em {growthStats.accountAgeWeeks} semanas de jornada
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {growthStats.xpPerWeek}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">XP/semana</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {growthStats.sessionsPerWeek}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Sessões/semana</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {growthStats.exercisesPerWeek}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Exercícios/semana</div>
          </div>
        </div>
      </div>

      {/* Próximo Marco */}
      {nextMilestone && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-indigo-300 dark:border-indigo-700 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{nextMilestone.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Próximo Marco</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Continue assim!</p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="font-bold text-gray-900 dark:text-white mb-1">{nextMilestone.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{nextMilestone.description}</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Requisito: {nextMilestone.requirement}
            </div>
          </div>
        </div>
      )}

      {/* Marcos Alcançados */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🏅</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Marcos Conquistados</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {milestones.filter(m => m.achieved).length} de {milestones.length} marcos alcançados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.filter(m => m.achieved).map((milestone) => (
            <motion.button
              key={milestone.id}
              onClick={() => setSelectedMilestone(milestone)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800 text-left transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{milestone.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {milestone.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {milestone.requirement}
                  </div>
                </div>
                <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
              </div>
            </motion.button>
          ))}
        </div>

        {milestones.filter(m => m.achieved).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm">Complete desafios para conquistar marcos!</div>
          </div>
        )}
      </div>

      {/* Modal de Privacidade */}
      <AnimatePresence>
        {showPrivacyModal && (
          <PrivacyModal
            settings={privacySettings}
            onUpdate={updatePrivacySettings}
            onClose={() => setShowPrivacyModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Modal de Detalhes do Marco */}
      <AnimatePresence>
        {selectedMilestone && (
          <MilestoneDetailModal
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ================================
// COMPONENTE: STAT CARD
// ================================

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  gradient: string;
  border: string;
  showComparison?: boolean;
  platformAvg?: number;
  percentile?: number;
}

function StatCard({ icon, value, label, gradient, border, showComparison, platformAvg, percentile }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border ${border} shadow-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{icon}</span>
        <div className="flex-1">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        </div>
      </div>

      {showComparison && platformAvg !== undefined && (
        <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Média plataforma:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {platformAvg.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {percentile !== undefined && percentile > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Você está no top:</span>
            <span className="font-bold text-gray-900 dark:text-white">{100 - percentile}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ================================
// MODAL: PRIVACIDADE
// ================================

interface PrivacyModalProps {
  settings: {
    showComparison: boolean;
    showPercentiles: boolean;
    shareData: boolean;
  };
  onUpdate: (settings: any) => void;
  onClose: () => void;
}

function PrivacyModal({ settings, onUpdate, onClose }: PrivacyModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Privacidade</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Controle seus dados pessoais</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Toggle: Comparação com Plataforma */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setLocalSettings({ ...localSettings, showComparison: !localSettings.showComparison })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                localSettings.showComparison ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.showComparison ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Mostrar Comparações</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Exibir estatísticas médias da plataforma (anônimas)
              </div>
            </div>
          </div>

          {/* Toggle: Percentis */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setLocalSettings({ ...localSettings, showPercentiles: !localSettings.showPercentiles })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                localSettings.showPercentiles ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.showPercentiles ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Mostrar Posição Percentil</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Ver em que percentil você está comparado à plataforma
              </div>
            </div>
          </div>

          {/* Toggle: Compartilhar Dados */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setLocalSettings({ ...localSettings, shareData: !localSettings.shareData })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                localSettings.shareData ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.shareData ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Contribuir com Dados</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Seus dados ajudam a melhorar as estatísticas (sempre anônimos)
              </div>
            </div>
          </div>
        </div>

        {/* Aviso de Privacidade */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</span>
            <div className="text-xs text-blue-900 dark:text-blue-200">
              <strong>Sua privacidade é prioridade.</strong> Nunca compartilhamos informações pessoais identificáveis.
              Todas as estatísticas da plataforma são agregadas e completamente anônimas.
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ================================
// MODAL: DETALHES DO MARCO
// ================================

interface MilestoneDetailModalProps {
  milestone: Milestone;
  onClose: () => void;
}

function MilestoneDetailModal({ milestone, onClose }: MilestoneDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-8xl mb-4"
          >
            {milestone.icon}
          </motion.div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{milestone.description}</p>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Requisito</div>
            <div className="font-bold text-gray-900 dark:text-white">{milestone.requirement}</div>
          </div>

          {milestone.achievedDate && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mb-6">
              Conquistado em {new Date(milestone.achievedDate).toLocaleDateString('pt-BR')}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
