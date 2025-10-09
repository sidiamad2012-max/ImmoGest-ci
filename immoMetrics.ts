// Système de métriques personnalisé pour ImmoGest CI
// Optimisé pour les besoins spécifiques de gestion immobilière

import { analytics } from '../analytics/analytics';
import { ENV } from '../env';

interface ImmoPerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: string;
  metadata?: Record<string, any>;
}

interface UserActionMetric {
  action: string;
  duration: number;
  success: boolean;
  context: string;
  timestamp: number;
}

class ImmoMetricsCollector {
  private metrics: ImmoPerformanceMetric[] = [];
  private userActions: UserActionMetric[] = [];
  private initialized = false;
  private pageLoadStart = 0;

  init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    this.pageLoadStart = performance.now();
    this.setupBasicMetrics();
    this.setupUserInteractionTracking();
    this.setupBusinessMetrics();
    
    this.initialized = true;
    console.log('✅ ImmoGest CI Metrics initialized');
  }

  private setupBasicMetrics() {
    // Page Load Performance
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.pageLoadStart;
      this.recordMetric('page_load', loadTime, 'performance');
      
      // DOM timing
      if (window.performance && window.performance.timing) {
        const timing = performance.timing;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        this.recordMetric('dom_ready', domReady, 'performance');
      }
    });

    // First paint metrics using Performance Observer
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
              this.recordMetric('first_paint', entry.startTime, 'performance');
            }
            if (entry.name === 'first-contentful-paint') {
              this.recordMetric('first_contentful_paint', entry.startTime, 'performance');
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Paint observer failed:', error);
      }
    }
  }

  private setupUserInteractionTracking() {
    // Track property management actions
    this.trackPropertyActions();
    this.trackTenantActions();
    this.trackMaintenanceActions();
    this.trackFinancialActions();
    this.trackNavigationSpeed();
  }

  private trackPropertyActions() {
    // Track property creation time
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.textContent?.includes('Ajouter propriété') || 
          target.closest('[data-action="add-property"]')) {
        this.startUserAction('property_creation', 'properties');
      }
    });

    // Track property form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      if (form.id?.includes('property') || form.closest('[data-context="property"]')) {
        this.completeUserAction('property_creation', true, 'properties');
      }
    });
  }

  private trackTenantActions() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.textContent?.includes('Ajouter locataire') || 
          target.closest('[data-action="add-tenant"]')) {
        this.startUserAction('tenant_onboarding', 'tenants');
      }
    });
  }

  private trackMaintenanceActions() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.textContent?.includes('Signaler') || 
          target.textContent?.includes('maintenance') ||
          target.closest('[data-action="maintenance"]')) {
        this.startUserAction('maintenance_request', 'maintenance');
      }
    });
  }

  private trackFinancialActions() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.textContent?.includes('Enregistrer paiement') || 
          target.closest('[data-action="payment"]')) {
        this.startUserAction('payment_recording', 'finances');
      }
    });
  }

  private trackNavigationSpeed() {
    // Track section navigation performance
    const sectionLoadTimes = new Map<string, number>();
    
    const trackSectionLoad = (section: string) => {
      const startTime = performance.now();
      sectionLoadTimes.set(section, startTime);
      
      // Use MutationObserver to detect when content is rendered
      const observer = new MutationObserver((mutations) => {
        const hasContent = mutations.some(mutation => 
          mutation.addedNodes.length > 0 && 
          mutation.target.textContent?.length > 100
        );
        
        if (hasContent) {
          const loadTime = performance.now() - startTime;
          this.recordMetric('section_navigation', loadTime, section);
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Fallback timeout
      setTimeout(() => observer.disconnect(), 5000);
    };

    // Track when sections change
    let currentUrl = window.location.href;
    new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        const section = this.extractSectionFromUrl(currentUrl);
        if (section) trackSectionLoad(section);
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  private extractSectionFromUrl(url: string): string {
    // Extract section from URL or current state
    if (url.includes('properties')) return 'properties';
    if (url.includes('tenants')) return 'tenants';
    if (url.includes('maintenance')) return 'maintenance';
    if (url.includes('finances')) return 'finances';
    return 'overview';
  }

  private setupBusinessMetrics() {
    // Track business-specific performance metrics
    this.trackDataLoadingPerformance();
    this.trackMobileUsagePatterns();
    this.trackErrorRecovery();
  }

  private trackDataLoadingPerformance() {
    // Monitor API response times
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        const url = args[0]?.toString() || '';
        let context = 'api';
        if (url.includes('properties')) context = 'properties_api';
        if (url.includes('tenants')) context = 'tenants_api';
        if (url.includes('maintenance')) context = 'maintenance_api';
        
        this.recordMetric('api_response_time', duration, context, {
          url: url.split('?')[0], // Remove query params
          status: response.status,
          success: response.ok
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordMetric('api_response_time', duration, 'api_error', {
          url: args[0]?.toString() || '',
          error: true
        });
        throw error;
      }
    };
  }

  private trackMobileUsagePatterns() {
    if (window.innerWidth <= 768) {
      // Track mobile-specific metrics
      document.addEventListener('touchstart', () => {
        this.recordMetric('mobile_interaction', 1, 'mobile');
      }, { once: true });

      // Track scroll performance on mobile
      let scrollStart = 0;
      document.addEventListener('touchstart', () => {
        scrollStart = performance.now();
      });

      document.addEventListener('touchend', () => {
        if (scrollStart > 0) {
          const scrollDuration = performance.now() - scrollStart;
          this.recordMetric('mobile_scroll_performance', scrollDuration, 'mobile');
          scrollStart = 0;
        }
      });
    }
  }

  private trackErrorRecovery() {
    // Track how quickly users recover from errors
    window.addEventListener('error', () => {
      this.recordMetric('javascript_error', 1, 'error');
    });

    // Track successful actions after errors
    let errorOccurred = false;
    window.addEventListener('error', () => { errorOccurred = true; });
    
    document.addEventListener('click', () => {
      if (errorOccurred) {
        this.recordMetric('error_recovery', 1, 'resilience');
        errorOccurred = false;
      }
    });
  }

  // Public methods for tracking specific actions
  recordMetric(name: string, value: number, context?: string, metadata?: Record<string, any>) {
    const metric: ImmoPerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      context,
      metadata
    };

    this.metrics.push(metric);

    // Send to analytics if available
    analytics.trackEvent({
      action: name,
      category: 'ImmoGest Performance',
      value: Math.round(value),
      label: context,
      properties: { context, ...metadata }
    });

    // Log in development
    if (ENV.isDev) {
      console.log(`📊 ${name}: ${Math.round(value)}ms`, { context, metadata });
    }
  }

  startUserAction(action: string, context: string) {
    const actionData = {
      action,
      startTime: performance.now(),
      context,
      timestamp: Date.now()
    };
    
    // Store in sessionStorage for persistence across navigation
    sessionStorage.setItem(`immo_action_${action}`, JSON.stringify(actionData));
  }

  completeUserAction(action: string, success: boolean, context: string) {
    const stored = sessionStorage.getItem(`immo_action_${action}`);
    if (!stored) return;

    const actionData = JSON.parse(stored);
    const duration = performance.now() - actionData.startTime;

    const userAction: UserActionMetric = {
      action,
      duration,
      success,
      context,
      timestamp: Date.now()
    };

    this.userActions.push(userAction);

    // Send to analytics
    analytics.trackEvent({
      action: `user_action_${action}`,
      category: 'User Experience',
      value: Math.round(duration),
      label: success ? 'success' : 'failure',
      properties: { context, success, duration }
    });

    // Cleanup
    sessionStorage.removeItem(`immo_action_${action}`);

    // Log in development
    if (ENV.isDev) {
      console.log(`👤 ${action}: ${Math.round(duration)}ms (${success ? 'success' : 'failure'})`, { context });
    }
  }

  // Get performance summary for dashboards
  getPerformanceSummary() {
    const recentMetrics = this.metrics.filter(m => 
      Date.now() - m.timestamp < 300000 // Last 5 minutes
    );

    const summary = {
      pageLoad: this.getAverageMetric('page_load'),
      apiResponseTime: this.getAverageMetric('api_response_time'),
      userActions: this.userActions.length,
      successRate: this.getSuccessRate(),
      topSlowMetrics: this.getTopSlowMetrics()
    };

    return summary;
  }

  private getAverageMetric(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  private getSuccessRate(): number {
    const recentActions = this.userActions.filter(a => 
      Date.now() - a.timestamp < 300000
    );
    if (recentActions.length === 0) return 100;
    const successful = recentActions.filter(a => a.success).length;
    return (successful / recentActions.length) * 100;
  }

  private getTopSlowMetrics(): Array<{name: string, avgTime: number, context: string}> {
    const metricGroups = new Map<string, number[]>();
    
    this.metrics.forEach(m => {
      const key = `${m.name}_${m.context}`;
      if (!metricGroups.has(key)) metricGroups.set(key, []);
      metricGroups.get(key)!.push(m.value);
    });

    return Array.from(metricGroups.entries())
      .map(([key, values]) => {
        const [name, context] = key.split('_');
        const avgTime = values.reduce((sum, v) => sum + v, 0) / values.length;
        return { name, avgTime, context };
      })
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5);
  }

  // Cleanup method
  cleanup() {
    this.metrics = [];
    this.userActions = [];
  }
}

// Export singleton instance
export const immoMetrics = new ImmoMetricsCollector();

// Helper functions for easy usage in components
export const trackImmoAction = {
  propertyCreation: () => immoMetrics.startUserAction('property_creation', 'properties'),
  tenantOnboarding: () => immoMetrics.startUserAction('tenant_onboarding', 'tenants'),
  maintenanceRequest: () => immoMetrics.startUserAction('maintenance_request', 'maintenance'),
  paymentRecording: () => immoMetrics.startUserAction('payment_recording', 'finances'),
  
  completePropertyCreation: (success: boolean) => 
    immoMetrics.completeUserAction('property_creation', success, 'properties'),
  completeTenantOnboarding: (success: boolean) => 
    immoMetrics.completeUserAction('tenant_onboarding', success, 'tenants'),
  completeMaintenanceRequest: (success: boolean) => 
    immoMetrics.completeUserAction('maintenance_request', success, 'maintenance'),
  completePaymentRecording: (success: boolean) => 
    immoMetrics.completeUserAction('payment_recording', success, 'finances'),
};