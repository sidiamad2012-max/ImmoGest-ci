import { toast } from 'sonner@2.0.3';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = {
  handleTimeout: (error: any) => {
    if (error?.message?.includes('timeout') || error?.code === 'TIMEOUT') {
      console.warn('Request timeout - using fallback data');
      toast.warning('Connexion lente détectée - utilisation des données locales');
      return true;
    }
    return false;
  },

  handleConnectionError: (error: any) => {
    if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
      console.warn('Network error - using fallback data');
      toast.warning('Problème de connexion - utilisation des données locales');
      return true;
    }
    return false;
  },

  handleSupabaseError: (error: any) => {
    if (error?.message?.includes('Invalid API key') || error?.code === 'UNAUTHORIZED') {
      console.warn('Supabase authentication error - using mock data');
      toast.info('Service de base de données non configuré - utilisation des données de démonstration');
      return true;
    }
    return false;
  },

  handle: (error: any, context?: string) => {
    console.error(`Error in ${context || 'application'}:`, error);

    if (errorHandler.handleTimeout(error)) return true;
    if (errorHandler.handleConnectionError(error)) return true;
    if (errorHandler.handleSupabaseError(error)) return true;

    toast.error(`Erreur ${context ? `dans ${context}` : 'inattendue'}`);
    return false;
  }
};

export const withTimeout = function<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new AppError(timeoutMessage, 'TIMEOUT')), timeoutMs);
    })
  ]);
};

export const withRetryAndFallback = async function<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => T,
  retries: number = 2,
  timeoutMs: number = 5000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await withTimeout(primaryFn(), timeoutMs);
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries) {
        console.log('All attempts failed, using fallback');
        errorHandler.handle(error, 'data fetch');
        return fallbackFn();
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  return fallbackFn();
};