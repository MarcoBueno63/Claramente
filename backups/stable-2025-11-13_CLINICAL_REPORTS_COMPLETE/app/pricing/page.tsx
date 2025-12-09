"use client";
import React, { useState } from "react";
import PaywallModal from "../../components/PaywallModal";
import { getUser } from "../../lib/auth";

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(plan: string) {
    setLoading(true);
    const user = getUser();
    // Aqui você pode chamar o endpoint de pagamento
    const res = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, plan })
    });
    await res.json(); // Consume response
    setLoading(false);
    setShowModal(true);
    // Em produção, redirecionar para checkout real
    // window.location.href = "/checkout"
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Planos ClaraMente</h1>
      <p className="mb-4 text-gray-700">Escolha o plano ideal para você e continue seu progresso emocional.</p>    
      <ul className="mb-6">
        <li className="mb-2">Mensal: 4 sessões, R$ 49/mês <button className="ml-2 bg-indigo-600 text-white px-2 py-1 rounded" disabled={loading} onClick={() => handleSubscribe("mensal")}>Assinar</button></li>
        <li className="mb-2">Semestral: 24 sessões, R$ 249/semestre <button className="ml-2 bg-indigo-600 text-white px-2 py-1 rounded" disabled={loading} onClick={() => handleSubscribe("semestral")}>Assinar</button></li>
        <li className="mb-2">Anual: 48 sessões, R$ 499/ano <button className="ml-2 bg-indigo-600 text-white px-2 py-1 rounded" disabled={loading} onClick={() => handleSubscribe("anual")}>Assinar</button></li>
      </ul>
      <PaywallModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}