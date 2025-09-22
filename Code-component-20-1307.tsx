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
  SUPABASE_URL: getEnvironmentVariable('REACT_APP_SUPABASE_URL', 'https://placeholder.supabase.co'),
  SUPABASE_ANON_KEY: getEnvironmentVariable('REACT_APP_SUPABASE_ANON_KEY', 'placeholder-key'),
  NODE_ENV: getEnvironmentVariable('NODE_ENV', 'development'),
  isDevelopment: getEnvironmentVariable('NODE_ENV', 'development') === 'development',
  isProduction: getEnvironmentVariable('NODE_ENV', 'development') === 'production',
};