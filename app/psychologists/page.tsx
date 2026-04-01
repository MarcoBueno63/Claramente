"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from "react";
import { getUser } from "../../lib/auth";
import { getPsychologists } from "../../lib/api";

type Psychologist = {
  id: string;
  name: string;
  specialty: string;
  approach: string;
  gender: string;
  location: string;
  price: number;
  rating: number;
  experience: number;
};

export default function PsychologistsPage() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    async function fetchData() {
      const data: Psychologist[] = await getPsychologists();
      setPsychologists(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleLead(psychologistId: string) {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, psychologistId })
    });
    alert("Indicação enviada! O profissional receberá seu contato.");
  }

  if (loading) return <div className="p-6">Carregando profissionais...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Psicólogos Parceiros</h1>
      <ul>
        {psychologists.map((p) => (
          <li key={p.id} className="mb-4 border-b pb-4">
            <div className="font-bold text-lg">{p.name} ({p.specialty})</div>
            <div className="text-sm text-gray-600">{p.location} | {p.approach} | {p.gender}</div>
            <div className="text-sm">Preço: R$ {p.price} | Avaliação: {p.rating} | Experiência: {p.experience} anos</div>
            <button className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => handleLead(p.id)}>
              Indicar/Agendar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
