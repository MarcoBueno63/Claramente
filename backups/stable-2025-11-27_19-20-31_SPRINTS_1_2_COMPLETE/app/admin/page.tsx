// app/admin/page.tsx - Página Principal de Administração
// Portal de acesso para todas as ferramentas administrativas

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Painel Administrativo - ClaraMente',
  description: 'Portal administrativo para gerenciamento da plataforma terapêutica ClaraMente.',
  keywords: 'admin, painel administrativo, gerenciamento, plataforma terapêutica'
};

interface AdminCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'red';
  badge?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, href, icon, color, badge }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-900',
    green: 'bg-green-50 border-green-200 hover:border-green-300 text-green-900',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-900',
    red: 'bg-red-50 border-red-200 hover:border-red-300 text-red-900'
  };

  return (
    <Link href={href}>
      <div className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer relative ${colorClasses[color]}`}>
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              {badge}
            </span>
          </div>
        )}
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="opacity-80 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

import AppNavigation from '../../components/AppNavigation';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-white text-2xl font-bold">🛠️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Centro de controle da plataforma terapêutica ClaraMente
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Sistema operacional • {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            title="Analytics Dashboard"
            description="Métricas em tempo real, insights terapêuticos, análise de conversações e recomendações de otimização da plataforma."
            href="/admin/analytics"
            icon="📊"
            color="blue"
            badge="NOVO"
          />
          
          <AdminCard
            title="Gerenciamento de Usuários"
            description="Visualizar usuários cadastrados, sessões ativas, histórico terapêutico e gerenciamento de permissões."
            href="/admin/users"
            icon="👥"
            color="green"
          />
          
          <AdminCard
            title="Moderação de Conteúdo"
            description="Análise de conversações com alto risco, alertas de segurança e ferramentas de intervenção preventiva."
            href="/admin/moderation"
            icon="🛡️"
            color="red"
          />
          
          <AdminCard
            title="Configurações do Sistema"
            description="Parâmetros da IA, protocolos terapêuticos, limites de uso e configurações técnicas da plataforma."
            href="/admin/settings"
            icon="⚙️"
            color="purple"
          />
          
          <AdminCard
            title="Relatórios Clínicos"
            description="Exportação de dados anonimizados, relatórios de eficácia terapêutica e análises estatísticas."
            href="/admin/reports"
            icon="📋"
            color="green"
          />
          
          <AdminCard
            title="Monitoramento Técnico"
            description="Status da infraestrutura, logs de erro, performance da API e métricas de sistema."
            href="/admin/monitoring"
            icon="🔧"
            color="blue"
          />
        </div>

        {/* Métricas Rápidas */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Métricas de Hoje
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-gray-600">Usuários Ativos</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">Sessões Hoje</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-purple-600">23min</div>
              <div className="text-sm text-gray-600">Duração Média</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-yellow-600">94%</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>

        {/* Alertas e Notificações */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Alertas e Notificações
          </h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-800">
                    3 sessões com alto risco detectadas hoje
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    Recomenda-se revisão manual e possível encaminhamento profissional.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-green-400 text-xl mr-3">✅</span>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Sistema funcionando normalmente
                  </h4>
                  <p className="text-green-700 text-sm">
                    Todas as APIs operacionais, tempo de resposta &lt; 200ms.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-blue-400 text-xl mr-3">📈</span>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Crescimento de 15% em novos usuários esta semana
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Tendência positiva, considerar otimização de recursos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ClaraMente Admin Dashboard • Versão 2.1 • 
            <Link href="/" className="text-blue-600 hover:underline ml-1">
              Voltar ao App
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}