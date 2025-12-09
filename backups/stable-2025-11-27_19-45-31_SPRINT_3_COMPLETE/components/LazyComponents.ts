// Lazy loading utility para componentes pesados
import dynamic from 'next/dynamic';
import { ComponentLoading } from './LoadingSpinner';

// ⚡ COMPONENTES COM LAZY LOADING PARA PERFORMANCE

// Relatórios Clínicos (componente mais pesado)
export const LazyReports = dynamic(() => import('./ClinicalReports'), {
  loading: ComponentLoading,
  ssr: false
});

// Sistema de Exercícios Terapêuticos
export const LazyExercises = dynamic(() => import('./InteractiveExercises'), {
  loading: ComponentLoading,
  ssr: false
});

// Protocolos TCC
export const LazyProtocols = dynamic(() => import('./TCCProtocols'), {
  loading: ComponentLoading,
  ssr: false
});

// Monitoramento Clínico
export const LazyMonitoring = dynamic(() => import('./ClinicalMonitoring'), {
  loading: ComponentLoading,
  ssr: false
});

// Formulação de Caso
export const LazyFormulation = dynamic(() => import('./CaseFormulationAssessment'), {
  loading: ComponentLoading,
  ssr: false
});

// Dashboard de Analytics (Admin)
export const LazyAnalytics = dynamic(() => import('./AdminAnalyticsDashboard'), {
  loading: ComponentLoading,
  ssr: false
});

// Dashboard de Progresso
export const LazyProgress = dynamic(() => import('./ProgressDashboard'), {
  loading: ComponentLoading,
  ssr: false
});

// Avaliação Psicométrica
export const LazyAssessment = dynamic(() => import('./PsychometricAssessment'), {
  loading: ComponentLoading,
  ssr: false
});