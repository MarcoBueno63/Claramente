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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">ClaraMente</h1>
                <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
                  Sessão TCC Ativa
                </span>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <span className="text-sm text-gray-600">
                    👤 {user.email}
                  </span>
                )}
                <button
                  onClick={() => router.push('/reports')}
                  className="text-sm text-gray-600 hover:text-gray-800 bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded-lg transition-colors"
                >
                  📊 Relatórios
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  Sair
                </button>
                <div className="text-sm text-gray-600 font-mono bg-white rounded-lg px-3 py-2 border">
                  ⏰ 30:00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto h-[calc(100vh-140px)]">
            <ChatWindow />
          </div>
        </div>
      </div>
  );
}