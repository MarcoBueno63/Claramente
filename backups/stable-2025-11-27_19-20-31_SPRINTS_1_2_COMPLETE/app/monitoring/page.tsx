// app/monitoring/page.tsx - Página de Monitoramento Clínico
// Interface completa para acompanhamento de sintomas e escalas clínicas

import { Metadata } from 'next';
import ClinicalMonitoring from '../../components/ClinicalMonitoring';

export const metadata: Metadata = {
  title: 'Monitoramento Clínico | ClaraMente',
  description: 'Acompanhe seu progresso terapêutico através de escalas validadas e métricas personalizadas. PHQ-9, GAD-7 e registro diário de humor.',
  keywords: 'monitoramento clínico, escalas psicológicas, PHQ-9, GAD-7, acompanhamento terapêutico, saúde mental',
  openGraph: {
    title: 'Monitoramento Clínico | ClaraMente',
    description: 'Sistema completo de acompanhamento clínico com escalas validadas',
    type: 'website',
  },
};

export default function MonitoringPage() {
  return <ClinicalMonitoring />;
}