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
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Proteção de Dados</h2>
              
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
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Compartilhamento de Informações</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">🚫 O que NÃO fazemos</h3>
                <ul className="text-red-700 space-y-1">
                  <li>• Não vendemos seus dados para terceiros</li>
                  <li>• Não compartilhamos informações pessoais para marketing</li>
                  <li>• Não usamos dados para fins não relacionados à terapia</li>
                </ul>
              </div>

              <h3 className="font-semibold text-gray-700 mb-2">Compartilhamento Limitado:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Provedores de Serviço:</strong> Apenas parceiros necessários (hosting, backup) com contratos rígidos</li>
                <li><strong>Emergências:</strong> Apenas se houver risco iminente à vida (conforme lei)</li>
                <li><strong>Ordem Legal:</strong> Quando exigido por autoridades competentes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Seus Direitos (LGPD)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Direitos Básicos:</h3>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Acesso aos seus dados</li>
                    <li>Correção de informações</li>
                    <li>Exclusão de dados</li>
                    <li>Portabilidade</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Como Exercer:</h3>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Através do painel de controle</li>
                    <li>Email: privacidade@claramente.ai</li>
                    <li>Resposta em até 15 dias</li>
                    <li>Gratuito (1ª solicitação/ano)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Retenção de Dados</h2>
              <div className="space-y-3">
                <div>
                  <strong>Dados da Conta:</strong> Mantidos enquanto a conta estiver ativa
                </div>
                <div>
                  <strong>Sessões de Terapia:</strong> 5 anos após última sessão (para continuidade do tratamento)
                </div>
                <div>
                  <strong>Dados Técnicos:</strong> 2 anos para melhorias do serviço
                </div>
                <div>
                  <strong>Após Exclusão:</strong> Dados anonimizados podem ser mantidos para pesquisa
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Cookies e Tecnologias</h2>
              <p className="mb-3">Usamos cookies essenciais para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter sua sessão ativa</li>
                <li>Lembrar suas preferências</li>
                <li>Melhorar segurança da plataforma</li>
                <li>Analisar uso da plataforma (dados agregados)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Menores de Idade</h2>
              <p>
                O serviço é destinado a maiores de 18 anos. Menores podem usar apenas 
                com supervisão de responsável legal que aceite estes termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta política. Mudanças significativas serão comunicadas 
                com 30 dias de antecedência via email e notificação na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contato</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold mb-2">Data Protection Officer (DPO):</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Email:</strong> privacidade@claramente.ai</li>
                  <li><strong>Telefone:</strong> (11) 3000-0000</li>
                  <li><strong>Endereço:</strong> Rua da Tecnologia, 123 - São Paulo, SP</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Última atualização: 10 de novembro de 2025
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ClaraMente LTDA - CNPJ: 12.345.678/0001-00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}