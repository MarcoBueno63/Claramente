"use client";
export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, setUser } from "../../lib/auth";
import { startSession } from "../../lib/api";
import PersonaPicker from "../../components/PersonaPicker";
import StylePicker from "../../components/StylePicker";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function OnboardingPage() {
  const [persona, setPersona] = useState("woman");
  const [style, setStyle] = useState("integrative");
  const [language, setLanguage] = useState("pt-BR");
  // For faster local development, default the confirmations to true when
  // running in non-production. In production both must be checked by the user.
  const devOk = process.env.NODE_ENV !== "production";
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(devOk);
  const [consent, setConsent] = useState<boolean>(devOk === true ? true : false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStartSession() {
    setLoading(true);
    try {
      const user = getUser();
      console.log('Iniciando sessão para usuário:', user);
      
      const session = await startSession({
        userId: user.id,
        language,
        persona,
        style,
      });
      
      console.log('Sessão iniciada:', session);
      
      // Salva dados do usuário/sessão se necessário
      setUser({ ...user, lastSessionId: session.id });
      setLoading(false);
      router.push("/chat");
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      setLoading(false);
      alert('Erro ao iniciar sessão. Tente novamente.');
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Bem-vindo ao ClaraMente</h1>
      <p className="mb-4 text-gray-700">Sua jornada de saúde mental com inteligência artificial</p>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Idioma</label>
        <LanguageSwitcher selected={language} onSelect={setLanguage} />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Escolha o perfil do terapeuta</label>
        <PersonaPicker selected={persona} onSelect={setPersona} />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Estilo de terapia</label>
        <StylePicker selected={style} onSelect={setStyle} />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} />        
          <span>Confirmo que tenho mais de 18 anos</span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
          <span>Aceito os termos de uso e política de privacidade</span>
        </label>
      </div>
      
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!(ageConfirmed && consent) || loading}
        onClick={handleStartSession}
      >
        {loading ? 'Carregando...' : 'Iniciar Sessão'}
      </button>
    </div>
  );
}