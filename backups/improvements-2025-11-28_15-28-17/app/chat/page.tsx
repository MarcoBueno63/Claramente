"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "../../components/ChatWindow";

interface User {
  id: string;
  email: string;
  name: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (isAuthenticated === 'true' && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('Usuário autenticado carregado:', parsedUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        handleLogout();
      }
    } else {
      console.log('Usuário não autenticado, redirecionando...');
      router.push('/auth/signin');
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    console.log('Logout realizado, redirecionando...');
    router.push('/auth/signin');
  };

  const handleSessionExpire = () => {
    alert("Sessão encerrada! Redirecionando...");
    handleLogout();
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário autenticado, não renderizar nada (redirecionamento já foi acionado)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Header Terapêutico Acolhedor */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 shadow-md border-b-2 border-purple-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">💜</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">ClaraMente</h1>
                    <p className="text-xs font-medium text-purple-700">Seu espaço de acolhimento terapêutico</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-800 bg-purple-200 px-4 py-2 rounded-full border-2 border-purple-300">
                  ✨ Sessão TCC Ativa
                </span>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg border-2 border-purple-200">
                    <span className="text-purple-600">👤</span>
                    <span className="text-sm font-semibold text-gray-900">{user.email}</span>
                  </div>
                )}
                <button
                  onClick={() => router.push('/reports')}
                  className="text-sm font-semibold text-indigo-800 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors border-2 border-indigo-200 shadow-sm"
                >
                  📊 Relatórios
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors border-2 border-gray-300 shadow-sm"
                >
                  🚪 Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto h-[calc(100vh-120px)]">
            <ChatWindow />
          </div>
        </div>
      </div>
  );
}