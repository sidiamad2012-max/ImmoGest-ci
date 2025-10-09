// Performance monitoring et optimisations pour ImmoGest CI
import { analytics } from '../analytics/analytics';
import { ENV } from '../env';

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  timeToFirstByte: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export interface UserInteractionMetrics {
  clickLatency: number;
  scrollPerformance: number;
  formSubmissionTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private interactionMetrics: UserInteractionMetrics[] = [];
  private isMonitoring = false;

  init() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.collectBasicMetrics();
    this.setupInteractionTracking();
    this.setupResourceTracking();
    
    console.log('Performance monitoring initialized');
  }

  private collectBasicMetrics() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.metrics = {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          timeToFirstByte: timing.responseStart - timing.navigationStart,
          firstContentfulPaint: this.getMetricValue('first-contentful-paint'),
          largestContentfulPaint: this.getMetricValue('largest-contentful-paint'),
          cumulativeLayoutShift: this.getMetricValue('cumulative-layout-shift'),
          firstInputDelay: this.getMetricValue('first-input-delay')
        };

        this.reportMetrics();
      }, 0);
    });
  }

  private getMetricValue(metricName: string): number | undefined {
    const entries = performance.getEntriesByName(metricName);
    return entries.length > 0 ? entries[0].startTime : undefined;
  }

  private setupInteractionTracking() {
    // Track click responsiveness
    document.addEventListener('click', (e) => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const latency = performance.now() - start;
        this.trackInteraction('click', latency);
      });
    });

    // Track scroll performance
    let scrollStart = 0;
    document.addEventListener('scroll', () => {
      if (scrollStart === 0) {
        scrollStart = performance.now();
      }
    }, { passive: true });

    document.addEventListener('scrollend', () => {
      if (scrollStart > 0) {
        const scrollTime = performance.now() - scrollStart;
        this.trackInteraction('scroll', scrollTime);
        scrollStart = 0;
      }
    });

    // Track form submission performance
    document.addEventListener('submit', (e) => {
      const start = performance.now();
      setTimeout(() => {
        const submissionTime = performance.now() - start;
        this.trackInteraction('form_submit', submissionTime);
      }, 0);
    });
  }

  private trackInteraction(type: string, duration: number) {
    // Only track significant interactions
    if (duration > 16) { // More than one frame
      analytics.trackEvent({
        action: 'interaction_performance',
        category: 'Performance',
        label: type,
        value: Math.round(duration),
        properties: { type, duration }
      });
    }
  }

  private setupResourceTracking() {
    // Track slow resources
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      resources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.startTime;
        
        // Report slow resources (> 2 seconds)
        if (loadTime > 2000) {
          analytics.trackEvent({
            action: 'slow_resource',
            category: 'Performance',
            label: resource.name,
            value: Math.round(loadTime),
            properties: {
              resourceType: resource.initiatorType,
              size: resource.transferSize
            }
          });
        }
      });
    });
  }

  private reportMetrics() {
    if (!this.metrics) return;

    // Report Core Web Vitals to analytics
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        analytics.trackEvent({
          action: key,
          category: 'Core Web Vitals',
          value: Math.round(value),
          properties: { metric: key }
        });
      }
    });

    // Log performance summary
    console.log('Performance Metrics:', this.metrics);
    
    // Report performance grade
    const grade = this.calculatePerformanceGrade();
    analytics.trackEvent({
      action: 'performance_grade',
      category: 'Performance',
      label: grade,
      properties: { grade }
    });
  }

  private calculatePerformanceGrade(): string {
    if (!this.metrics) return 'unknown';

    const { loadTime, largestContentfulPaint, cumulativeLayoutShift, firstInputDelay } = this.metrics;
    
    let score = 100;

    // Penalize slow load times
    if (loadTime > 3000) score -= 20;
    else if (loadTime > 2000) score -= 10;

    // Penalize poor LCP
    if (largestContentfulPaint && largestContentfulPaint > 2500) score -= 20;
    else if (largestContentfulPaint && largestContentfulPaint > 1200) score -= 10;

    // Penalize high CLS
    if (cumulativeLayoutShift && cumulativeLayoutShift > 0.25) score -= 20;
    else if (cumulativeLayoutShift && cumulativeLayoutShift > 0.1) score -= 10;

    // Penalize high FID
    if (firstInputDelay && firstInputDelay > 300) score -= 20;
    else if (firstInputDelay && firstInputDelay > 100) score -= 10;

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  // Public methods for manual tracking
  startTiming(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      analytics.trackEvent({
        action: 'custom_timing',
        category: 'Performance',
        label,
        value: Math.round(duration),
        properties: { customTiming: label }
      });
    };
  }

  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      analytics.trackEvent({
        action: 'memory_usage',
        category: 'Performance',
        value: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        properties: {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      });
    }
  }

  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Performance utilities spécifiques à ImmoGest CI
export const immoPerformance = {
  // Track component mount performance
  trackComponentMount: (componentName: string) => {
    return performanceMonitor.startTiming(`component_mount_${componentName}`);
  },

  // Track API call performance
  trackApiCall: (endpoint: string) => {
    return performanceMonitor.startTiming(`api_call_${endpoint}`);
  },

  // Track property loading performance
  trackPropertyLoad: (propertyCount: number) => {
    const endTiming = performanceMonitor.startTiming('property_load');
    
    return () => {
      endTiming();
      analytics.trackBusinessMetric('properties_loaded', propertyCount);
    };
  },

  // Track search performance
  trackSearchPerformance: (query: string, resultCount: number) => {
    const endTiming = performanceMonitor.startTiming('search_performance');
    
    return () => {
      endTiming();
      analytics.trackEvent({
        action: 'search_completed',
        category: 'Search',
        label: query,
        value: resultCount,
        properties: { query, resultCount }
      });
    };
  },

  // Track form submission performance
  trackFormSubmission: (formType: string) => {
    return performanceMonitor.startTiming(`form_submit_${formType}`);
  },

  // Track mobile performance specifically
  trackMobilePerformance: () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      analytics.trackEvent({
        action: 'mobile_performance_check',
        category: 'Mobile',
        properties: {
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          devicePixelRatio: window.devicePixelRatio,
          connection: (navigator as any).connection?.effectiveType || 'unknown'
        }
      });
    }
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}