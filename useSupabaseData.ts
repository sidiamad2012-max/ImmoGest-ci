import { useState, useEffect } from 'react';
import { isSupabaseAvailable } from '../supabase';

/**
 * Hook personnalisé pour gérer les données Supabase avec fallback
 * @param fetchFn - Fonction qui récupère les données
 * @param fallbackData - Données de fallback si Supabase n'est pas disponible
 * @param deps - Dépendances pour déclencher un nouveau fetch
 */
export function useSupabaseData<T>(
  fetchFn: () => Promise<T>,
  fallbackData: T,
  deps: any[] = []
) {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isSupabaseAvailable()) {
          console.log('Supabase not available, using fallback data');
          setData(fallbackData);
          return;
        }

        const result = await fetchFn();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setData(fallbackData); // Use fallback data on error
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return {
    data,
    loading,
    error,
    isSupabaseAvailable: isSupabaseAvailable(),
    refetch: () => {
      // Re-trigger the effect by updating a dependency
      setLoading(true);
    }
  };
}

/**
 * Hook pour les mutations Supabase avec fallback
 */
export function useSupabaseMutation<TInput, TOutput>(
  mutateFn: (input: TInput) => Promise<TOutput>,
  fallbackFn?: (input: TInput) => Promise<TOutput>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: TInput): Promise<TOutput | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseAvailable() && fallbackFn) {
        console.log('Supabase not available, using fallback mutation');
        return await fallbackFn(input);
      } else if (!isSupabaseAvailable()) {
        console.log('Supabase not available and no fallback provided');
        return null;
      }

      return await mutateFn(input);
    } catch (err) {
      console.error('Error in mutation:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      // Try fallback on error
      if (fallbackFn) {
        try {
          return await fallbackFn(input);
        } catch (fallbackErr) {
          console.error('Fallback mutation also failed:', fallbackErr);
        }
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
    isSupabaseAvailable: isSupabaseAvailable()
  };
}