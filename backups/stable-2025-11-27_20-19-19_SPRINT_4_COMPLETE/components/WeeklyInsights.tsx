'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';

interface Insight {
  summary: string;
  patterns: Array<{
    title: string;
    description: string;
    type: 'positive' | 'neutral' | 'concern';
    recommendation: string;
  }>;
  moodTrend: {
    direction: 'improving' | 'stable' | 'declining';
    description: string;
  };
  achievements: string[];
  suggestions: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  encouragement: string;
}

export default function WeeklyInsights() {
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const haptics = useHaptics();

  useEffect(() => {
    // Check if we have cached insights from this week
    const cached = localStorage.getItem('weekly-insights');
    const cacheTime = localStorage.getItem('weekly-insights-time');
    
    if (cached && cacheTime) {
      const cacheDate = new Date(cacheTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      // Use cache if less than a week old
      if (cacheDate > weekAgo) {
        setInsights(JSON.parse(cached));
        setLastGenerated(cacheDate);
      }
    }
  }, []);

  const generateInsights = async () => {
    setIsLoading(true);
    haptics.tap();

    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user', // Replace with actual user ID
          period: 'week',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate insights');

      const data = await response.json();
      setInsights(data.insights);
      setLastGenerated(new Date());

      // Cache insights
      localStorage.setItem('weekly-insights', JSON.stringify(data.insights));
      localStorage.setItem('weekly-insights-time', new Date().toISOString());

      haptics.success();
    } catch (error) {
      console.error('[Weekly Insights] Error:', error);
      haptics.error();
    } finally {
      setIsLoading(false);
    }
  };

  if (!showInsights && !insights) {
    return (
      <button
        onClick={() => {
          haptics.tap();
          setShowInsights(true);
          if (!insights) generateInsights();
        }}
        className="fixed bottom-52 right-4 z-40 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <span className="text-2xl">💡</span>
      </button>
    );
  }

  return (
    <>
      {!showInsights && insights && (
        <button
          onClick={() => {
            haptics.tap();
            setShowInsights(true);
          }}
          className="fixed bottom-52 right-4 z-40 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="text-2xl">💡</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </button>
      )}

      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowInsights(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>💡</span>
                    Seus Insights da Semana
                  </h2>
                  <button
                    onClick={() => {
                      haptics.tap();
                      setShowInsights(false);
                    }}
                    className="text-white hover:text-orange-100 text-2xl"
                  >
                    ×
                  </button>
                </div>
                {lastGenerated && (
                  <p className="text-orange-100 text-sm">
                    Gerado em {lastGenerated.toLocaleDateString('pt-BR')} às{' '}
                    {lastGenerated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <LoadingState />
                ) : insights ? (
                  <InsightsContent insights={insights} />
                ) : (
                  <EmptyState onGenerate={generateInsights} />
                )}
              </div>

              {/* Footer */}
              {insights && !isLoading && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={generateInsights}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
                  >
                    🔄 Gerar Novos Insights
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="inline-block text-6xl mb-4"
      >
        💡
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Analisando seus dados...
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Clara está identificando padrões e gerando insights personalizados para você
      </p>
    </div>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Pronto para seus insights?
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Clara vai analisar sua semana e fornecer insights personalizados sobre seus padrões,
        progresso e sugestões de próximos passos.
      </p>
      <button
        onClick={onGenerate}
        className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
      >
        💡 Gerar Insights
      </button>
    </div>
  );
}

function InsightsContent({ insights }: { insights: Insight }) {
  const trendConfig = {
    improving: { icon: '📈', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    stable: { icon: '➡️', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    declining: { icon: '📉', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  };

  const patternConfig = {
    positive: { icon: '✅', color: 'border-green-500 bg-green-50 dark:bg-green-900/20' },
    neutral: { icon: 'ℹ️', color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    concern: { icon: '⚠️', color: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  };

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Alta' },
    medium: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Média' },
    low: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Baixa' },
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>📋</span>
          Resumo da Semana
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{insights.summary}</p>
      </motion.div>

      {/* Mood Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border ${trendConfig[insights.moodTrend.direction].bg}`}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>{trendConfig[insights.moodTrend.direction].icon}</span>
          Tendência de Humor
        </h3>
        <p className={`${trendConfig[insights.moodTrend.direction].color} font-semibold`}>
          {insights.moodTrend.description}
        </p>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>🏆</span>
          Suas Conquistas
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {insights.achievements.map((achievement, index) => (
            <div
              key={index}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
            >
              <p className="text-gray-700 dark:text-gray-300">{achievement}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>🔍</span>
          Padrões Identificados
        </h3>
        <div className="space-y-4">
          {insights.patterns.map((pattern, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl border-2 ${patternConfig[pattern.type].color}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{patternConfig[pattern.type].icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{pattern.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{pattern.description}</p>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Recomendação:</strong> {pattern.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>💭</span>
          Sugestões para a Próxima Semana
        </h3>
        <div className="space-y-3">
          {insights.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-bold text-gray-900 dark:text-white">{suggestion.title}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    priorityConfig[suggestion.priority].color
                  }`}
                >
                  {priorityConfig[suggestion.priority].label}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl"
      >
        <div className="text-4xl mb-3 text-center">💜</div>
        <p className="text-center text-lg leading-relaxed">{insights.encouragement}</p>
      </motion.div>
    </div>
  );
}
