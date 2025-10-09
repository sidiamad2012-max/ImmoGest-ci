// Feature detection utilities pour ImmoGest CI
// Détecte les fonctionnalités disponibles pour activer/désactiver des features

export interface FeatureSupport {
  webVitals: boolean;
  performanceAPI: boolean;
  performanceObserver: boolean;
  analytics: boolean;
  localStorage: boolean;
  serviceWorker: boolean;
  intersection: boolean;
}

// Détecte si Web Vitals est disponible
export async function detectWebVitals(): Promise<boolean> {
  try {
    const webVitals = await import('web-vitals').catch(() => null);
    return webVitals !== null && typeof webVitals.getCLS === 'function';
  } catch {
    return false;
  }
}

// Détecte le support Performance API
export function detectPerformanceAPI(): boolean {
  return (
    typeof window !== 'undefined' &&
    'performance' in window &&
    'timing' in window.performance
  );
}

// Détecte le support Performance Observer
export function detectPerformanceObserver(): boolean {
  return (
    typeof window !== 'undefined' &&
    'PerformanceObserver' in window
  );
}

// Détecte le support localStorage
export function detectLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window;
  } catch {
    return false;
  }
}

// Détecte le support Service Worker
export function detectServiceWorker(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    window.location.protocol === 'https:'
  );
}

// Détecte le support Intersection Observer
export function detectIntersectionObserver(): boolean {
  return (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window
  );
}

// Fonction principale de détection des features
export async function detectFeatureSupport(): Promise<FeatureSupport> {
  const [webVitals] = await Promise.all([
    detectWebVitals()
  ]);

  return {
    webVitals,
    performanceAPI: detectPerformanceAPI(),
    performanceObserver: detectPerformanceObserver(),
    analytics: typeof window !== 'undefined' && 'gtag' in window,
    localStorage: detectLocalStorage(),
    serviceWorker: detectServiceWorker(),
    intersection: detectIntersectionObserver()
  };
}

// Utilitaire pour logger le support des features
export async function logFeatureSupport(): Promise<void> {
  if (typeof window === 'undefined') return;

  const support = await detectFeatureSupport();
  
  console.group('🔍 ImmoGest CI - Feature Detection');
  console.log('📊 Web Vitals:', support.webVitals ? '✅' : '❌');
  console.log('⚡ Performance API:', support.performanceAPI ? '✅' : '❌');
  console.log('👀 Performance Observer:', support.performanceObserver ? '✅' : '❌');
  console.log('📈 Analytics:', support.analytics ? '✅' : '❌');
  console.log('💾 Local Storage:', support.localStorage ? '✅' : '❌');
  console.log('🔧 Service Worker:', support.serviceWorker ? '✅' : '❌');
  console.log('👁️ Intersection Observer:', support.intersection ? '✅' : '❌');
  console.groupEnd();
}

// Configurations conditionnelles basées sur le support
export function getOptimalConfig(support: FeatureSupport) {
  return {
    enableWebVitals: support.webVitals,
    enableAdvancedPerformance: support.performanceObserver,
    enableBasicPerformance: support.performanceAPI,
    enableOfflineSupport: support.serviceWorker && support.localStorage,
    enableLazyLoading: support.intersection,
    enableAnalytics: support.analytics
  };
}