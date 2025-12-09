"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import ChatWindow from "../../components/ChatWindow";
import { AuthGuard } from "../../components/AuthGuard";

export default function ChatPage() {
  const { data: session } = useSession();

  const handleSessionExpire = () => {
    alert("Sessão encerrada! Redirecionando...");
  };

  return (
    <AuthGuard>
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
                {session?.user?.email && (
                  <div className="text-sm text-gray-600">
                    👤 {session.user.email}
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
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
    </AuthGuard>
  );
}