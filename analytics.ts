// Google Analytics 4 et Web Vitals pour ImmoGest CI
import { ENV } from '../env';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  properties?: Record<string, any>;
}

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class Analytics {
  private initialized = false;
  private debug = ENV.isDev;

  async init() {
    if (this.initialized) return;

    const GA_ID = ENV.GA_MEASUREMENT_ID;
    
    try {
      // Load Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', GA_ID, {
        page_title: 'ImmoGest CI',
        page_location: window.location.href,
        custom_map: {
          'custom_dimension_1': 'user_role',
          'custom_dimension_2': 'property_count'
        }
      });

      this.initialized = true;
      this.log('Analytics initialized');
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    if (!this.initialized) return;

    try {
      window.gtag('config', ENV.GA_MEASUREMENT_ID, {
        page_title: title || `ImmoGest CI - ${page}`,
        page_location: window.location.href
      });
      
      this.log('Page view tracked:', page);
    } catch (error) {
      console.error('Page view tracking failed:', error);
    }
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized) return;

    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_dimension_1: event.properties?.userRole,
        custom_dimension_2: event.properties?.propertyCount
      });

      this.log('Event tracked:', event);
    } catch (error) {
      console.error('Event tracking failed:', error);
    }
  }

  // Track user interactions spécifiques à ImmoGest CI
  trackUserAction(action: string, details?: Record<string, any>) {
    this.trackEvent({
      action,
      category: 'User Interaction',
      label: details?.section,
      properties: details
    });
  }

  // Track business metrics
  trackBusinessMetric(metric: string, value: number, userRole?: string) {
    this.trackEvent({
      action: metric,
      category: 'Business Metrics',
      value,
      properties: { userRole }
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.trackEvent({
      action: 'javascript_error',
      category: 'Errors',
      label: context || error.message,
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        context
      }
    });
  }

  // Track performance metrics
  trackPerformance(metric: WebVitalsMetric) {
    this.trackEvent({
      action: metric.name,
      category: 'Web Vitals',
      value: Math.round(metric.value),
      properties: {
        rating: metric.rating,
        metric_id: metric.id
      }
    });
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[Analytics]', ...args);
    }
  }
}

export const analytics = new Analytics();

// ImmoGest CI Performance monitoring with smart fallbacks
export async function initWebVitals() {
  try {
    // Try to import web-vitals
    const webVitalsModule = await import('web-vitals').catch(() => null);
    
    if (webVitalsModule && typeof webVitalsModule.getCLS === 'function') {
      // Full Web Vitals available
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitalsModule;
      
      const sendToAnalytics = (metric: WebVitalsMetric) => {
        analytics.trackPerformance(metric);
      };

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getLCP(sendToAnalytics);
      getFCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
      
      console.log('✅ Web Vitals monitoring initialized');
      return;
    }

    // Use ImmoGest CI custom metrics instead
    console.log('📊 Using ImmoGest CI custom performance metrics');
    await initImmoMetrics();
    
  } catch (error) {
    console.log('📊 Initializing ImmoGest CI performance tracking');
    await initImmoMetrics();
  }
}

// Initialize ImmoGest CI custom metrics
async function initImmoMetrics() {
  try {
    const { immoMetrics } = await import('../performance/immoMetrics');
    immoMetrics.init();
    console.log('✅ ImmoGest CI performance metrics initialized');
  } catch (error) {
    console.warn('⚠️ Performance metrics initialization failed:', error);
  }
}

// Specific tracking functions for ImmoGest CI
export const trackImmoGestEvents = {
  // Authentication
  login: (role: string) => analytics.trackUserAction('login', { userRole: role }),
  logout: () => analytics.trackUserAction('logout'),
  
  // Property management
  propertyCreated: () => analytics.trackUserAction('property_created', { section: 'properties' }),
  propertyUpdated: () => analytics.trackUserAction('property_updated', { section: 'properties' }),
  
  // Tenant management
  tenantAdded: () => analytics.trackUserAction('tenant_added', { section: 'tenants' }),
  tenantUpdated: () => analytics.trackUserAction('tenant_updated', { section: 'tenants' }),
  
  // Maintenance
  maintenanceRequested: (priority: string) => analytics.trackUserAction('maintenance_requested', { priority }),
  maintenanceCompleted: () => analytics.trackUserAction('maintenance_completed'),
  
  // Payments
  paymentRecorded: (amount: number, method: string) => analytics.trackBusinessMetric('payment_recorded', amount, method),
  
  // Mobile usage
  mobileMenuUsed: () => analytics.trackUserAction('mobile_menu_used', { device: 'mobile' }),
  
  // Feature usage
  featureUsed: (feature: string, section: string) => analytics.trackUserAction('feature_used', { feature, section })
};