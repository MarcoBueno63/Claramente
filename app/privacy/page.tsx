
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Política de Privacidade - ClaraMente</h1>
          <div className="space-y-6 text-gray-700">
            <section>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">🔒 Compromisso com sua Privacidade</h3>
                <p className="text-blue-700">
                  No ClaraMente, levamos sua privacidade a sério. Esta política explica como 
                  coletamos, usamos e protegemos suas informações pessoais.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Informações que Coletamos</h2>
              <h3 className="font-semibold text-gray-700 mb-2">Dados Fornecidos por Você:</h3>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Informações de registro (email, idade)</li>
                <li>Preferências de configuração (idioma, estilo de terapia)</li>
                <li>Mensagens enviadas durante as sessões de terapia</li>
                <li>Respostas a questionários e avaliações</li>
              </ul>
              <h3 className="font-semibold text-gray-700 mb-2">Dados Técnicos:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Endereço IP (anonimizado)</li>
                <li>Informações do navegador e dispositivo</li>
                <li>Dados de uso da plataforma (tempo de sessão, frequência)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Como Usamos suas Informações</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Prestação do Serviço:</strong> Para fornecer suporte terapêutico personalizado</li>
                <li><strong>Melhoria da IA:</strong> Para aprimorar algoritmos de TCC (dados anonimizados)</li>
                <li><strong>Segurança:</strong> Para detectar e prevenir uso inadequado</li>
                <li><strong>Comunicação:</strong> Para enviar atualizações importantes sobre o serviço</li>
                <li><strong>Relatórios:</strong> Para gerar insights sobre seu progresso (apenas para você)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Direitos do Usuário</h2>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Você pode exportar, compartilhar ou solicitar a exclusão de seus dados a qualquer momento.</li>
                <li>Seus dados não são compartilhados com terceiros sem consentimento explícito.</li>
                <li>Utilizamos práticas de segurança para proteger suas informações.</li>
                <li>Você pode revisar e alterar suas preferências de privacidade a qualquer momento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Limites e Responsabilidade</h2>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>O ClaraMente é uma ferramenta de apoio, não substitui acompanhamento profissional.</li>
                <li>Em caso de risco, procure imediatamente um serviço de saúde.</li>
                <li>Não coletamos dados sensíveis além do necessário para funcionamento e segurança.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Proteção de Dados</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">🔐 Criptografia</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• AES-256 para dados armazenados</li>
                    <li>• TLS 1.3 para transmissão</li>
                    <li>• Chaves rotacionadas regularmente</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">🇧🇷 Dados no Brasil</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Servidores em território nacional</li>
                    <li>• Conformidade total com LGPD</li>
                    <li>• Backup seguro e redundante</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Compartilhamento de Informações</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">🚫 O que NÃO fazemos</h3>
                <ul className="text-red-700 space-y-1">
                  <li>• Não vendemos seus dados para terceiros</li>
                  <li>• Não compartilhamos dados sensíveis sem consentimento</li>
                  <li>• Não utilizamos dados para publicidade de terceiros</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}