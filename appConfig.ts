// Configuration de l'application ImmoGest CI
export const appConfig = {
  // Mode développement - affiche les composants de test
  isDevelopment: true,
  
  // Affichage des composants de test
  showTestComponents: true,
  
  // Configuration Supabase
  supabase: {
    url: 'https://tyldyultokmmowhjokvh.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    timeout: 3000,
  },
  
  // Configuration de l'application
  app: {
    name: 'ImmoGest CI',
    version: '1.0.0',
    description: 'Système de gestion immobilière pour la Côte d\'Ivoire',
    currency: 'FCFA',
    locale: 'fr-CI',
  },
  
  // Configuration mobile
  mobile: {
    enablePullToRefresh: true,
    optimizeForTouch: true,
    maxCardWidthOnMobile: '100%',
  },
  
  // Fonctionnalités
  features: {
    propertyManagement: true,
    tenantManagement: true,
    maintenanceTracking: true,
    financialDashboard: true,
    mobileMoneyIntegration: true,
    realTimeNotifications: true,
  }
};

// Helper pour vérifier si on est en mode développement
export const isDev = () => appConfig.isDevelopment;

// Helper pour vérifier si les composants de test doivent être affichés
export const showTests = () => appConfig.showTestComponents && appConfig.isDevelopment;