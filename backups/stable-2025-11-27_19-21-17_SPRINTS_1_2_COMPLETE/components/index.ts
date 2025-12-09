// 🚀 BARREL EXPORTS OTIMIZADOS
// Este arquivo centraliza todos os imports para melhor tree-shaking

// ⚡ COMPONENTES CORE (sempre carregados)
export { default as ChatWindow } from './ChatWindow';
export { default as AppNavigation } from './AppNavigation';
export { default as ClientIntlProvider } from './ClientIntlProvider';
export { default as AvatarPlayer } from './AvatarPlayer';
export { default as SessionTimer } from './SessionTimer';

// 📦 COMPONENTES LAZY (carregados sob demanda)
export {
  LazyReports,
  LazyExercises,
  LazyProtocols,
  LazyMonitoring,
  LazyFormulation,
  LazyAnalytics,
  LazyProgress,
  LazyAssessment,
} from './LazyComponents';