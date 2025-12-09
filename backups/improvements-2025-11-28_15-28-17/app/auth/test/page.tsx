// app/auth/test/page.tsx - Página de teste de autenticação
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthTestPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTestLogin = () => {
    setLoading(true);
    // Simular login bem-sucedido
    setTimeout(() => {
      setLoading(false);
      router.push('/chat');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ClaraMente</h1>
          <p className="text-gray-600 mt-2">Página de Teste - Autenticação</p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Sistema de autenticação funcionando!
          </div>

          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema (Teste)'}
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              ← Voltar para Login Normal
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Status do Sistema:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Servidor: Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Navegação: Funcional</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Rota: /auth/test</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}