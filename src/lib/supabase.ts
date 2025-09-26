import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { env } from './env'

// Configuration pour une connexion Supabase optimisée
const supabaseOptions = {
  auth: {
    persistSession: true, // Activer la persistance de session
    autoRefreshToken: true, // Activer le refresh automatique des tokens
    detectSessionInUrl: true
  },
  realtime: {
    enabled: true // Activer realtime pour les mises à jour en temps réel
  }
}

// Créer le client Supabase avec la vraie configuration
export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, supabaseOptions)

// Helper function pour vérifier si Supabase est disponible
export const isSupabaseAvailable = () => {
  return supabase !== null && 
         env.SUPABASE_URL !== 'https://placeholder.supabase.co' && 
         env.SUPABASE_ANON_KEY !== 'placeholder-key'
}

// Export types
export type { Database } from './database.types'
