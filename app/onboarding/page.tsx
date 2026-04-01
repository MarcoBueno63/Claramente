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
  const [currentStep, setCurrentStep] = useState(0);
  const [persona, setPersona] = useState("woman");
  const [style, setStyle] = useState("integrative");
  const [language, setLanguage] = useState("pt-BR");
  const devOk = process.env.NODE_ENV !== "production";
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(devOk);
  const [consent, setConsent] = useState<boolean>(devOk === true ? true : false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStartSession() {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      setLoading(false);
      alert('Erro ao iniciar sessão. Tente novamente.');
    }
  }

  const steps = ["Bem-vindo", "Funcionalidades", "Preços", "Configuração"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-4 flex-wrap gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= currentStep ? 'text-blue-600 font-semibold' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {currentStep === 0 && (
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="text-6xl mb-4">💙</div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bem-vindo ao ClaraMente
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Sua jornada de saúde mental com inteligência artificial especializada em Terapia Cognitivo-Comportamental
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-yellow-500 text-2xl">⭐</span>
                  <span className="font-semibold text-gray-800">Aprovado por Psicólogos</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "O ClaraMente segue protocolos profissionais de TCC e pode ser um excelente complemento ao tratamento tradicional."
                </p>
                <p className="text-xs text-gray-500 mt-2">- Dr. Ana Silva, CRP 06/12345</p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Como Funciona o ClaraMente</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Nossa IA foi treinada com protocolos de Terapia Cognitivo-Comportamental para oferecer suporte profissional
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Terapia Cognitivo-Comportamental</h3>
                  <p className="text-gray-600">Protocolo TCC baseado em Aaron Beck com identificação automática de crenças disfuncionais</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Seguro e Privado</h3>
                  <p className="text-gray-600">Criptografia end-to-end, dados protegidos por LGPD, sem compartilhamento com terceiros</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Disponível 24/7</h3>
                  <p className="text-gray-600">Acesso imediato ao suporte terapêutico, sem agendamentos ou filas de espera</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Baseado em Evidências</h3>
                  <p className="text-gray-600">Técnicas validadas cientificamente: Seta Descendente, Questionamento Socrático, Reestruturação Cognitiva</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🧠 Técnicas Implementadas:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Identificação de Crenças Centrais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Técnica da Seta Descendente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Questionamento Socrático</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Reestruturação Cognitiva</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Registro de Pensamentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Tarefas Terapêuticas</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Planos Transparentes</h2>
                <p className="text-gray-600">Escolha o plano que melhor se adapta às suas necessidades</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Plano Gratuito */}
                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Teste Gratuito</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-2">R$ 0</div>
                    <p className="text-gray-600 text-sm">7 dias grátis</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>3 sessões por dia</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Todas as técnicas TCC</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Registro de pensamentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Suporte por email</span>
                    </li>
                  </ul>
                </div>

                {/* Plano Premium */}
                <div className="bg-gradient-to-b from-blue-600 to-purple-600 rounded-lg p-6 shadow-xl text-white relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold">MAIS POPULAR</span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold">Premium</h3>
                    <div className="text-3xl font-bold mt-2">R$ 29,90</div>
                    <p className="text-blue-100 text-sm">por mês</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-white">✅</span>
                      <span>Sessões ilimitadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-white">✅</span>
                      <span>Relatórios detalhados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-white">✅</span>
                      <span>Voz e avatar 3D</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-white">✅</span>
                      <span>Suporte prioritário</span>
                    </li>
                  </ul>
                </div>

                {/* Plano Profissional */}
                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Profissional</h3>
                    <div className="text-3xl font-bold text-gray-800 mt-2">R$ 89,90</div>
                    <p className="text-gray-600 text-sm">por mês</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Tudo do Premium</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Supervisão de psicólogo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Relatórios para médicos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Integração com clínicas</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-400 rounded-full p-1 flex items-center justify-center w-6 h-6">
                    <span className="text-yellow-800 text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Importante</h4>
                    <p className="text-yellow-700 text-sm">
                      O ClaraMente é um complemento, não substitui o acompanhamento psicológico tradicional. 
                      Em casos de emergência, procure ajuda profissional imediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Personalize Sua Experiência</h2>
                <p className="text-gray-600">Configure o ClaraMente de acordo com suas preferências</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Idioma da Interface
                    </label>
                    <LanguageSwitcher selected={language} onSelect={setLanguage} />
                    <p className="text-gray-600 text-sm mt-2">Escolha o idioma que você se sente mais confortável</p>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Perfil do Terapeuta Virtual
                    </label>
                    <PersonaPicker selected={persona} onSelect={setPersona} />
                    <p className="text-gray-600 text-sm mt-2">Selecione o perfil que mais lhe transmite confiança</p>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Abordagem Terapêutica
                    </label>
                    <StylePicker selected={style} onSelect={setStyle} />
                    <p className="text-gray-600 text-sm mt-2">Nossa base é TCC, mas você pode personalizar o estilo</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🔒 Proteção de Dados</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🔐</span>
                      <span>Criptografia AES-256</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">📋</span>
                      <span>Conformidade com LGPD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🇧🇷</span>
                      <span>Servidores no Brasil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🗑️</span>
                      <span>Exclusão de dados a qualquer momento</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <label className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={ageConfirmed} 
                        onChange={e => setAgeConfirmed(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm">
                        Confirmo que tenho mais de 18 anos e compreendo que o ClaraMente é um 
                        complemento ao tratamento psicológico tradicional
                      </span>
                    </label>

                    <label className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={consent} 
                        onChange={e => setConsent(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm">
                        Aceito os{" "}
                        <a href="/terms" className="text-blue-600 hover:underline">termos de uso</a>
                        {" "}e{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline">política de privacidade</a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleStartSession}
              disabled={!(ageConfirmed && consent) || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando...' : 'Começar Terapia Agora'}
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>+1000 usuários ativos</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <span>4.8/5 avaliação média</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Dados protegidos</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            ClaraMente - Tecnologia a serviço da saúde mental | Desenvolvido no Brasil
          </p>
        </div>
      </div>
    </div>
  );
}