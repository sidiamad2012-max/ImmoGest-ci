// Configuration de l'application
export const appConfig = {
  // Mode développement
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Configuration Supabase
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    isConfigured: Boolean(
      process.env.REACT_APP_SUPABASE_URL && 
      process.env.REACT_APP_SUPABASE_ANON_KEY &&
      process.env.REACT_APP_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
      process.env.REACT_APP_SUPABASE_ANON_KEY !== 'placeholder-key'
    )
  },
  
  // Configuration de l'application
  app: {
    name: 'ImmoGest CI',
    version: '1.0.0',
    description: 'Système de gestion immobilière pour la Côte d\'Ivoire',
    defaultProperty: {
      name: 'Résidence Les Palmiers',
      address: 'Boulevard Lagunaire, Cocody, Abidjan, Côte d\'Ivoire'
    }
  },
  
  // Configuration des timeouts
  timeouts: {
    apiRequest: 10000, // 10 secondes
    dataFetch: 5000,   // 5 secondes
    retry: 3           // 3 tentatives
  },
  
  // Configuration des notifications
  notifications: {
    showConnectionStatus: true,
    showDataSourceWarnings: true,
    autoHideDelay: 5000 // 5 secondes
  }
};

// Helper functions
export const isSupabaseConfigured = () => appConfig.supabase.isConfigured;
export const isDevelopmentMode = () => appConfig.isDevelopment;
export const shouldShowMockDataWarning = () => 
  appConfig.isDevelopment && !appConfig.supabase.isConfigured;