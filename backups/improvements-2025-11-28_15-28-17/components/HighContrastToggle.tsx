'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHighContrast, CONTRAST_CONFIGS } from '../hooks/useHighContrast';

/**
 * Componente de controle de alto contraste
 * Oferece alternância rápida entre modo normal e alto contraste
 * Botão fixo + painel com preview e informações de acessibilidade
 */
export default function HighContrastToggle() {
  const {
    contrastMode,
    isHighContrast,
    toggleContrast,
    isClient,
  } = useHighContrast();
  
  const [showPanel, setShowPanel] = useState(false);

  if (!isClient) return null;

  const currentConfig = CONTRAST_CONFIGS[contrastMode];

  return (
    <>
      {/* Botão rápido de alternância */}
      <motion.button
        onClick={toggleContrast}
        className="fixed top-32 right-4 z-40 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
        title={isHighContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-6 h-6">
          {isHighContrast ? (
            // Ícone de alto contraste ativo (metade preto/metade branco)
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
              <div className="w-full h-1/2 bg-black"></div>
              <div className="w-full h-1/2 bg-white"></div>
            </div>
          ) : (
            // Ícone normal (círculo gradiente)
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
          )}
        </div>
      </motion.button>

      {/* Botão para abrir painel detalhado */}
      <motion.button
        onClick={() => setShowPanel(true)}
        className="fixed top-44 right-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
        whileHover={{ scale: 1.05 }}
      >
        ⚙️ Contraste
      </motion.button>

      {/* Painel detalhado */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Modo de Contraste
                </h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modo atual */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Modo Atual:
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {currentConfig.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentConfig.description}
                </p>
              </div>

              {/* Opções de modo */}
              <div className="space-y-3 mb-6">
                {Object.values(CONTRAST_CONFIGS).map((config) => (
                  <button
                    key={config.mode}
                    onClick={() => {
                      if (config.mode === 'high') {
                        toggleContrast();
                      } else if (isHighContrast) {
                        toggleContrast();
                      }
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      contrastMode === config.mode
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {/* Preview das cores */}
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: config.colors.background }}
                          ></div>
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: config.colors.foreground }}
                          ></div>
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: config.colors.primary }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {config.label}
                        </span>
                      </div>
                      {contrastMode === config.mode && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
                      {config.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Preview de texto */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Preview de Texto:
                </p>
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: currentConfig.colors.background,
                    color: currentConfig.colors.foreground,
                  }}
                >
                  <p className="text-base mb-2">
                    Este é um exemplo de texto no modo {currentConfig.label}.
                  </p>
                  <p className="text-sm" style={{ color: currentConfig.colors.primary }}>
                    Texto destacado em cor primária.
                  </p>
                </div>
              </div>

              {/* Informações de acessibilidade */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">
                  ♿ Informações de Acessibilidade
                </p>
                <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                  <li>• Modo Normal: WCAG AA (contraste 4.5:1)</li>
                  <li>• Alto Contraste: WCAG AAA (contraste 21:1)</li>
                  <li>• Recomendado para baixa visão</li>
                  <li>• Funciona com leitores de tela</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
