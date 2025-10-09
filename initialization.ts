// Initialisation robuste pour ImmoGest CI
import { ENV } from './env';
import { detectFeatureSupport, logFeatureSupport, getOptimalConfig } from './utils/featureDetection';

let isInitialized = false;

export async function initializeApp() {
  if (isInitialized) return;

  try {
    console.log('🚀 Initializing ImmoGest CI...');
    
    // Check environment
    console.log('Environment:', ENV.APP_ENV);
    
    // Initialize analytics only in browser environment
    if (typeof window !== 'undefined') {
      // Detect feature support
      const support = await detectFeatureSupport();
      const config = getOptimalConfig(support);
      
      // Log feature support in development
      if (ENV.isDev) {
        await logFeatureSupport();
      }
      
      try {
        const { analytics, initWebVitals } = await import('./analytics/analytics');
        
        // Initialize analytics if supported
        if (config.enableAnalytics || ENV.isDev) {
          await analytics.init();
          console.log('✅ Analytics initialized');
        }
        
        // Initialize performance tracking (Web Vitals or ImmoGest CI metrics)
        try {
          await initWebVitals();
        } catch (webVitalsError) {
          console.warn('⚠️ Performance tracking failed, continuing without:', webVitalsError);
        }
        
        // Initialize performance monitoring if supported
        if (config.enableAdvancedPerformance || config.enableBasicPerformance) {
          try {
            const { performanceMonitor } = await import('./performance/monitoring');
            performanceMonitor.init();
            console.log('✅ Performance monitoring initialized');
          } catch (perfError) {
            console.warn('⚠️ Performance monitoring failed, continuing without:', perfError);
          }
        }
        
      } catch (analyticsError) {
        console.warn('⚠️ Analytics initialization failed:', analyticsError);
      }
    }
    
    isInitialized = true;
    console.log('✅ ImmoGest CI initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize ImmoGest CI:', error);
    // Don't throw - allow app to continue without analytics
  }
}

export function getInitializationStatus() {
  return isInitialized;
}