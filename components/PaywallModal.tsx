import React from "react";

export default function PaywallModal({ show, onClose }: { show: boolean; onClose: () => void; }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-2 text-indigo-600">Continue seu progresso</h2>
        <p className="mb-4 text-gray-700">Você já usou suas 2 sessões gratuitas. Desbloqueie esta sessão para continuar.</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full mb-2">Ir para pagamento</button>
        <button className="text-gray-500 underline w-full" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
