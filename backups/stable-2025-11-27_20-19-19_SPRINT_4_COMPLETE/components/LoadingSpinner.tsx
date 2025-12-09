'use client';

import { memo } from 'react';

// 🎯 LOADING COMPONENT OTIMIZADO SEM FRAMER-MOTION
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  theme?: 'light' | 'dark';
}

const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  message = 'Carregando...',
  fullScreen = false,
  theme = 'light'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const themeClasses = {
    light: 'border-blue-200 border-t-blue-600',
    dark: 'border-gray-600 border-t-gray-200'
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className={`
          ${sizeClasses[size]} 
          ${themeClasses[theme]}
          rounded-full animate-spin mx-auto mb-3
        `} />
        {message && (
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
});

// 🚀 LOADING PRESETS PARA DIFERENTES CENÁRIOS
export const ComponentLoading = () => (
  <LoadingSpinner message="Carregando componente..." />
);

export const PageLoading = () => (
  <LoadingSpinner 
    size="lg" 
    message="Preparando página..." 
    fullScreen 
  />
);

export const DataLoading = () => (
  <LoadingSpinner 
    size="sm" 
    message="Carregando dados..." 
  />
);

export default LoadingSpinner;