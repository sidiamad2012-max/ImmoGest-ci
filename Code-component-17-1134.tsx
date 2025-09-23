import { supabase } from '../supabase'
import type { Database } from '../supabase'

type Unit = Database['public']['Tables']['units']['Row']
type UnitInsert = Database['public']['Tables']['units']['Insert']
type UnitUpdate = Database['public']['Tables']['units']['Update']

export class UnitService {
  static async getUnits(propertyId: string): Promise<Unit[]> {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', propertyId)
        .order('unit_number')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching units:', error)
      return []
    }
  }

  static async getUnit(id: string): Promise<Unit | null> {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching unit:', error)
      return null
    }
  }

  static async createUnit(unit: UnitInsert): Promise<Unit | null> {
    try {
      const { data, error } = await supabase
        .from('units')
        .insert(unit)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating unit:', error)
      return null
    }
  }

  static async updateUnit(id: string, updates: UnitUpdate): Promise<Unit | null> {
    try {
      const { data, error } = await supabase
        .from('units')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating unit:', error)
      return null
    }
  }

  static async deleteUnit(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting unit:', error)
      return false
    }
  }

  static async getUnitsByStatus(propertyId: string, status: 'available' | 'occupied' | 'maintenance'): Promise<Unit[]> {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', propertyId)
        .eq('status', status)
        .order('unit_number')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching units by status:', error)
      return []
    }
  }

  static async updateUnitStatus(id: string, status: 'available' | 'occupied' | 'maintenance'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('units')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating unit status:', error)
      return false
    }
  }
}