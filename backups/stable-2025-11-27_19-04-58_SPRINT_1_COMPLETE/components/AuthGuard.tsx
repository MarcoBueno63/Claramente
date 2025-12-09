'use client';

import { ReactNode } from 'react';

// 🔧 AUTH GUARD SIMPLIFICADO SEM NEXT-AUTH
// Implementação mock para manter funcionalidade durante otimização

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // 🚀 MOCK: Em produção, integrar com sistema de auth escolhido
  const isAuthenticated = true; // Temporário para testes
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para acessar esta área.
            </p>
            <button 
              onClick={() => window.location.href = '/auth/signin'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}