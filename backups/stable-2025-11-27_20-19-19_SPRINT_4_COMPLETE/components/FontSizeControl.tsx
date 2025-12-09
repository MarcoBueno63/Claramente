'use client';

import { useFontSize, type FontSize } from '@/hooks/useFontSize';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FontSizeControl() {
  const {
    fontSize,
    fontConfig,
    changeFontSize,
    increaseFontSize,
    decreaseFontSize,
    canIncrease,
    canDecrease,
    isClient,
  } = useFontSize();

  const [showPanel, setShowPanel] = useState(false);

  if (!isClient) return null;

  const sizes: { id: FontSize; label: string; example: string }[] = [
    { id: 'small', label: 'Pequeno', example: 'Aa' },
    { id: 'medium', label: 'Médio', example: 'Aa' },
    { id: 'large', label: 'Grande', example: 'Aa' },
    { id: 'xlarge', label: 'Extra Grande', example: 'Aa' },
  ];

  return (
    <>
      {/* Quick controls - sempre visível */}
      <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={increaseFontSize}
          disabled={!canIncrease}
          aria-label="Aumentar tamanho da fonte"
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center font-bold transition-all duration-200 ${
            canIncrease
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          A+
        </button>
        <button
          onClick={decreaseFontSize}
          disabled={!canDecrease}
          aria-label="Diminuir tamanho da fonte"
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
            canDecrease
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          A-
        </button>
        <button
          onClick={() => setShowPanel(!showPanel)}
          aria-label="Configurações de fonte"
          className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <span className="text-lg">🔤</span>
        </button>
      </div>

      {/* Panel detalhado */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🔤</span>
                  Tamanho da Fonte
                </h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Status atual */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tamanho Atual
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {fontConfig.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {fontConfig.description}
                </p>
              </div>

              {/* Seleção de tamanhos */}
              <div className="space-y-3 mb-6">
                {sizes.map((size) => {
                  const isActive = fontSize === size.id;
                  const sizeScale = {
                    small: 0.875,
                    medium: 1,
                    large: 1.125,
                    xlarge: 1.25,
                  }[size.id];

                  return (
                    <button
                      key={size.id}
                      onClick={() => changeFontSize(size.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`font-bold text-gray-900 dark:text-white transition-all duration-200`}
                          style={{ fontSize: `${sizeScale * 1.5}rem` }}
                        >
                          {size.example}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {size.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Escala: {(sizeScale * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Preview text */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Preview:
                </h3>
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  Este é um exemplo de como o texto ficará com o tamanho selecionado. A leitura deve
                  ser confortável para você.
                </p>
              </div>

              {/* Dicas de acessibilidade */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Dica de Acessibilidade
                </h3>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Ajuste o tamanho da fonte para sua preferência. Você também pode usar os atalhos do
                  teclado: <kbd className="px-1 bg-white dark:bg-gray-800 rounded">Ctrl</kbd> +{' '}
                  <kbd className="px-1 bg-white dark:bg-gray-800 rounded">+</kbd> ou{' '}
                  <kbd className="px-1 bg-white dark:bg-gray-800 rounded">-</kbd> no navegador.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
