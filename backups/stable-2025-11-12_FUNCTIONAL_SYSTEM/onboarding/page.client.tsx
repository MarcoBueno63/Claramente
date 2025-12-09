"use client";
import React, { useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import { getUser, setUser } from "../../lib/auth";
import { startSession } from "../../lib/api";
import PersonaPicker from "../../components/PersonaPicker";
import StylePicker from "../../components/StylePicker";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function OnboardingPage() {
  const t = useTranslations('common');
  const [persona, setPersona] = useState("woman");
  const [style, setStyle] = useState("integrative");
  const [language, setLanguage] = useState("pt-BR");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStartSession() {
    setLoading(true);
    const user = getUser();
    const session = await startSession({
      userId: user.id,
      language,
      persona,
      style,
    });
    setUser({ ...user, lastSessionId: session.id });
    setLoading(false);
    router.push("/chat");
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">{t('welcome')}</h1>
      <p className="mb-4 text-gray-700">{t('tagline')}</p>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">{t('language')}</label>
        <LanguageSwitcher selected={language} onSelect={setLanguage} />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">{t('choosePersona')}</label>
        <PersonaPicker selected={persona} onSelect={setPersona} />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">{t('chooseStyle')}</label>
        <StylePicker selected={style} onSelect={setStyle} />
      </div>
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} />
          <span>{t('ageConfirm')}</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
          <span>{t('consent')}</span>
        </label>
      </div>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full font-bold"
        disabled={!(ageConfirmed && consent) || loading}
        onClick={handleStartSession}
      >
        {loading ? t('loading') : t('startSession')}
      </button>
    </div>
  );
}
