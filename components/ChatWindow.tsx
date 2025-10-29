import React from "react";

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded shadow p-4">
      {/* Header: timer, progresso, idioma, perfil */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-indigo-600 text-lg">ClaraMente</span>
        <span className="text-sm text-gray-500">Sessão TCC (30 min)</span>
      </div>
      {/* Chat bubbles */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {/* Mensagens do usuário e IA */}
        {/* ... */}
      </div>
      {/* Campo de mensagem */}
      <div className="mt-4 flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Digite sua mensagem..." />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Enviar</button>
      </div>
      {/* Botão de crise */}
      <div className="mt-2 text-right">
        <button className="text-red-600 underline text-sm">Buscar ajuda profissional</button>
      </div>
    </div>
  );
}
