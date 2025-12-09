'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EmotionCategory,
  EMOTION_LABELS,
  getPhrasesByCategory,
  QUICK_STARTERS,
  EXERCISE_SHORTCUTS,
} from '../lib/emotionalPhrases';
import { useHaptics } from '../hooks/useHaptics';

interface EmotionalKeyboardProps {
  onSelectPhrase: (phrase: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

/**
 * Teclado emocional customizado
 * Facilita expressão rápida de sentimentos e necessidades terapêuticas
 * Organizado por categorias emocionais com sugestões contextualizadas
 */
export default function EmotionalKeyboard({
  onSelectPhrase,
  isOpen: controlledIsOpen,
  onToggle,
}: EmotionalKeyboardProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | 'quick' | 'exercises'>('quick');
  const { selection } = useHaptics();

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const handleSelectPhrase = (text: string) => {
    selection();
    onSelectPhrase(text);
    if (!controlledIsOpen) {
      setInternalIsOpen(false);
    }
  };

  const handleCategoryChange = (category: EmotionCategory | 'quick' | 'exercises') => {
    selection();
    setSelectedCategory(category);
  };

  const categories: Array<{ id: EmotionCategory | 'quick' | 'exercises'; label: string; emoji: string; color: string }> = [
    { id: 'quick', label: 'Início Rápido', emoji: '⚡', color: '#a855f7' },
    { id: 'exercises', label: 'Exercícios', emoji: '🧘', color: '#06b6d4' },
    ...Object.entries(EMOTION_LABELS).map(([id, data]) => ({
      id: id as EmotionCategory,
      ...data,
    })),
  ];

  const getCurrentPhrases = () => {
    if (selectedCategory === 'quick') return QUICK_STARTERS;
    if (selectedCategory === 'exercises') return EXERCISE_SHORTCUTS;
    return getPhrasesByCategory(selectedCategory as EmotionCategory);
  };

  const currentPhrases = getCurrentPhrases();

  return (
    <>
      {/* Botão flutuante para abrir o teclado */}
      {!isOpen && (
        <motion.button
          onClick={toggleOpen}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
          aria-label="Abrir teclado emocional"
          role="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          💬
        </motion.button>
      )}

      {/* Panel do teclado */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col"
            role="dialog"
            aria-label="Teclado emocional"
            aria-modal="false"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                💬 Teclado Emocional
              </h3>
              <button
                onClick={toggleOpen}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                aria-label="Fechar teclado emocional"
              >
                ✕
              </button>
            </div>

            {/* Categorias */}
            <div
              className="flex gap-2 p-3 overflow-x-auto bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
              role="tablist"
              aria-label="Categorias emocionais"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  role="tab"
                  aria-selected={selectedCategory === category.id}
                  aria-controls={`${category.id}-panel`}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-white dark:bg-gray-700 shadow-md scale-105'
                      : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                  style={{
                    borderBottom: selectedCategory === category.id ? `3px solid ${category.color}` : 'none',
                  }}
                >
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Frases */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-2"
              role="tabpanel"
              id={`${selectedCategory}-panel`}
              aria-labelledby={`${selectedCategory}-tab`}
            >
              {currentPhrases.map((phrase) => (
                <motion.button
                  key={phrase.id}
                  onClick={() => handleSelectPhrase(phrase.text)}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Selecionar frase: ${phrase.text}`}
                  role="button"
                >
                  <p className="text-gray-900 dark:text-white font-medium">
                    {phrase.text}
                  </p>
                  {phrase.therapeuticContext && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      🎯 {phrase.therapeuticContext}
                    </p>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer com dica */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                💡 Toque em uma frase para inseri-la na conversa
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
