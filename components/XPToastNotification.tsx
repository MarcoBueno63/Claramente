'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export interface XPToast {
  id: string;
  action: string;
  xp: number;
  multiplier?: number;
}

interface XPToastNotificationProps {
  toasts: XPToast[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right';
}

/**
 * Notificações de ganho de XP
 * Toast animado que aparece quando usuário ganha pontos
 */
export default function XPToastNotification({
  toasts,
  onDismiss,
  position = 'top-right',
}: XPToastNotificationProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  // Auto-dismiss após 3 segundos
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, 3000);
      
      return () => clearTimeout(timer);
    });
  }, [toasts, onDismiss]);

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 pointer-events-none`}>
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : 0, y: position.includes('top') ? -50 : 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : 0, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.5 }}
            style={{ zIndex: 50 - index }}
            className="pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-2xl p-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3 min-w-[280px]">
                {/* Ícone animado */}
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                >
                  ✨
                </motion.div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {toast.action}
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{toast.xp} XP
                    {toast.multiplier && toast.multiplier > 1 && (
                      <span className="text-xs ml-1 text-orange-600 dark:text-orange-400">
                        (×{toast.multiplier})
                      </span>
                    )}
                  </p>
                </div>

                {/* Botão fechar */}
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Barra de progresso de auto-dismiss */}
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook para gerenciar toasts de XP
 */
export function useXPToasts() {
  const [toasts, setToasts] = useState<XPToast[]>([]);

  const showToast = (action: string, xp: number, multiplier?: number) => {
    const toast: XPToast = {
      id: Date.now().toString() + Math.random(),
      action,
      xp,
      multiplier,
    };

    setToasts((prev) => [...prev, toast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    dismissToast,
  };
}
