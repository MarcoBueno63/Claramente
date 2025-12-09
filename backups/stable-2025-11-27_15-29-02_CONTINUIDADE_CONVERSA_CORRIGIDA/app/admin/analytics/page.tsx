// app/admin/analytics/page.tsx - Página de Analytics Administrativo
// Dashboard completo para monitoramento da plataforma terapêutica

import { Metadata } from 'next';
import AdminAnalyticsDashboard from '../../../components/AdminAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Admin ClaraMente',
  description: 'Dashboard administrativo com métricas de uso, insights terapêuticos e recomendações de otimização.',
  keywords: 'analytics, dashboard admin, métricas, insights terapêuticos, monitoramento'
};

import AppNavigation from '../../../components/AppNavigation';

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      <AdminAnalyticsDashboard />
    </div>
  );
}