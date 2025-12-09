// app/dashboard/page.tsx - Página do Dashboard do Usuário
// Mostra progresso terapêutico, métricas e histórico personalizado

import { Metadata } from 'next';
import UserProgressDashboard from '../../components/UserProgressDashboard';

export const metadata: Metadata = {
  title: 'Meu Progresso - ClaraMente',
  description: 'Acompanhe seu progresso terapêutico, métricas de bem-estar e histórico de sessões.',
  keywords: 'progresso terapêutico, dashboard, bem-estar mental, métricas, terapia online'
};

import AppNavigation from '../../components/AppNavigation';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      <UserProgressDashboard />
    </div>
  );
}