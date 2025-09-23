import { supabase, isSupabaseAvailable } from '../supabase'
import type { Database } from '../database.types'
import { withRetryAndFallback, errorHandler } from '../utils/errorHandler'
import { mockDataStore } from '../store/mockDataStore'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export class PropertyService {
  static async getProperty(id: string): Promise<Property | null> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      },
      () => {
        console.log('Using mock property data');
        return mockDataStore.getProperty(id);
      }
    );
  }

  static async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('properties')
          .select('*')
          .eq('owner_id', ownerId)

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock properties data');
        return mockDataStore.getProperties();
      }
    );
  }

  static async createProperty(property: PropertyInsert): Promise<Property | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, creating property in mock store');
        return mockDataStore.createProperty(property);
      }

      const { data, error } = await supabase!
        .from('properties')
        .insert(property)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'property creation');
      return null
    }
  }

  static async updateProperty(id: string, updates: PropertyUpdate): Promise<Property | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating property in mock store');
        return mockDataStore.updateProperty(id, updates);
      }

      const { data, error } = await supabase!
        .from('properties')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'property update');
      return null
    }
  }

  static async deleteProperty(id: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, deleting property from mock store');
        return mockDataStore.deleteProperty(id);
      }

      const { error } = await supabase!
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'property deletion');
      return false
    }
  }
}