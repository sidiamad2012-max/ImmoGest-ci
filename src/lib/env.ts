// Configuration environment-safe pour éviter les erreurs avec process.env
export const getEnvironmentVariable = (key: string, defaultValue: string = ''): string => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Browser environment - check for injected variables
      return (window as any)[key] || defaultValue;
    }
    
    // Node.js environment - check process.env
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    
    return defaultValue;
  } catch (error) {
    console.warn(`Could not access environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Environment configuration
export const env = {
  SUPABASE_URL: getEnvironmentVariable('REACT_APP_SUPABASE_URL', 'https://tyldyultokmmowhjokvh.supabase.co'),
  SUPABASE_ANON_KEY: getEnvironmentVariable('REACT_APP_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bGR5dWx0b2ttbW93aGpva3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDQ2MDcsImV4cCI6MjA3MzU4MDYwN30.ntBC_UgZ7I73J8n5-vkLnby5k8KYy1ksz7t5efBZxzI'),
  NODE_ENV: getEnvironmentVariable('NODE_ENV', 'development'),
  isDevelopment: getEnvironmentVariable('NODE_ENV', 'development') === 'development',
  isProduction: getEnvironmentVariable('NODE_ENV', 'development') === 'production',
};