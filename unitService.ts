import { supabase, isSupabaseAvailable } from '../supabase'
import type { Database } from '../database.types'
import { withRetryAndFallback, errorHandler } from '../utils/errorHandler'
import { mockDataStore } from '../store/mockDataStore'

type Unit = Database['public']['Tables']['units']['Row']
type UnitInsert = Database['public']['Tables']['units']['Insert']
type UnitUpdate = Database['public']['Tables']['units']['Update']

export class UnitService {
  static async getUnits(propertyId: string): Promise<Unit[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('units')
          .select('*')
          .eq('property_id', propertyId)
          .order('unit_number')

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock units data');
        return mockDataStore.getUnits(propertyId);
      }
    );
  }

  static async getUnit(id: string): Promise<Unit | null> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('units')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      },
      () => {
        console.log('Using mock unit data');
        return mockDataStore.getUnit(id);
      }
    );
  }

  static async createUnit(unit: UnitInsert): Promise<Unit | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, creating unit in mock store');
        return mockDataStore.createUnit(unit);
      }

      const { data, error } = await supabase!
        .from('units')
        .insert(unit)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'unit creation');
      return null
    }
  }

  static async updateUnit(id: string, updates: UnitUpdate): Promise<Unit | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating unit in mock store');
        return mockDataStore.updateUnit(id, updates);
      }

      const { data, error } = await supabase!
        .from('units')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'unit update');
      return null
    }
  }

  static async deleteUnit(id: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, deleting unit from mock store');
        return mockDataStore.deleteUnit(id);
      }

      const { error } = await supabase!
        .from('units')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'unit deletion');
      return false
    }
  }

  static async getUnitsByStatus(propertyId: string, status: 'available' | 'occupied' | 'maintenance'): Promise<Unit[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('units')
          .select('*')
          .eq('property_id', propertyId)
          .eq('status', status)
          .order('unit_number')

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock units by status data');
        return mockDataStore.getUnits(propertyId).filter(unit => unit.status === status);
      }
    );
  }

  static async updateUnitStatus(id: string, status: 'available' | 'occupied' | 'maintenance'): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating unit status in mock store');
        const result = mockDataStore.updateUnit(id, { status });
        return result !== null;
      }

      const { error } = await supabase!
        .from('units')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'unit status update');
      return false
    }
  }
}