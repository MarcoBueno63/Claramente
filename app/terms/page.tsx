import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Termos de Uso - ClaraMente</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Aceite dos Termos</h2>
              <p>
                Ao utilizar o ClaraMente, você concorda com estes termos de uso. Se não concordar 
                com qualquer parte destes termos, não deve usar nosso serviço.
              </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Ética, Limites e Responsabilidade</h2>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>O uso do ClaraMente é complementar e não substitui acompanhamento presencial ou remoto com profissional de saúde mental.</li>
                <li>Em situações de risco (ideação suicida, automutilação, violência), procure imediatamente um profissional de saúde ou serviço de emergência.</li>
                <li>O usuário é responsável por manter a confidencialidade de seu acesso e resultados.</li>
                <li>O uso da ferramenta implica aceitação destes termos e respeito à privacidade e ética.</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">⚠️ Atenção</h3>
                <p className="text-red-700">Esta ferramenta não realiza diagnóstico, não prescreve tratamentos e não substitui o contato com profissionais habilitados.</p>
              </div>
            </section>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Natureza do Serviço</h2>
              <p className="mb-3">
                O ClaraMente é uma plataforma de apoio em saúde mental baseada em inteligência artificial 
                que utiliza técnicas de Terapia Cognitivo-Comportamental (TCC). 
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Importante</h3>
                <p className="text-yellow-700">
                  O ClaraMente NÃO substitui o acompanhamento psicológico ou psiquiátrico profissional. 
                  É uma ferramenta complementar de apoio.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Elegibilidade</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você deve ter 18 anos ou mais para usar o serviço</li>
                <li>Se menor de 18 anos, necessária supervisão de responsável legal</li>
                <li>Não destinado para situações de emergência ou crise</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Emergências</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">🚨 Em caso de emergência</h3>
                <p className="text-red-700 mb-2">
                  Se você está em crise ou pensando em se machucar, procure ajuda imediatamente:
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• SAMU: 192</li>
                  <li>• CVV (Centro de Valorização da Vida): 188</li>
                  <li>• Procure o hospital mais próximo</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Uso Adequado</h2>
              <p>Você concorda em usar o serviço apenas para:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Apoio em saúde mental através de técnicas de TCC</li>
                <li>Autoconhecimento e desenvolvimento pessoal</li>
                <li>Complement o tratamento psicológico tradicional</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Limitações de Responsabilidade</h2>
              <p className="mb-3">
                O ClaraMente oferece informações e suporte baseados em protocolos de TCC, mas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Não fornece diagnósticos médicos ou psicológicos</li>
                <li>Não prescreve medicamentos</li>
                <li>Não substitui consultas presenciais com profissionais</li>
                <li>A IA pode ter limitações e não é infalível</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Privacidade</h2>
              <p>
                Seus dados são protegidos conforme nossa Política de Privacidade. 
                Utilizamos criptografia e seguimos a LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Cancelamento</h2>
              <p>
                Você pode cancelar sua conta a qualquer momento. Dados serão excluídos 
                conforme solicitado, respeitando períodos legais de retenção.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Alterações nos Termos</h2>
              <p>
                Podemos atualizar estes termos ocasionalmente. Usuários serão notificados 
                sobre mudanças significativas.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Última atualização: 10 de novembro de 2025
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ClaraMente - Tecnologia a serviço da saúde mental
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}