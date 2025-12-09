"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClinicalReports from '../../components/ClinicalReports';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function ReportsPage() {
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
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        router.push('/auth/signin');
      }
    } else {
      router.push('/auth/signin');
    }
    
    setLoading(false);
  }, [router]);

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

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/chat')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Voltar ao Chat
              </button>
              <h1 className="text-2xl font-bold text-gray-900">ClaraMente</h1>
              <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
                Relatórios Clínicos
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                👤 {user.email}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('isAuthenticated');
                  router.push('/auth/signin');
                }}
                className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Content */}
      <ClinicalReports patientId={user.id} />
    </div>
  );
}