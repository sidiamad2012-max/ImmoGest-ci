import { supabase } from '../supabase'
import type { Database } from '../supabase'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export class PropertyService {
  static async getProperty(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching property:', error)
      return null
    }
  }

  static async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', ownerId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching properties:', error)
      return []
    }
  }

  static async createProperty(property: PropertyInsert): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating property:', error)
      return null
    }
  }

  static async updateProperty(id: string, updates: PropertyUpdate): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating property:', error)
      return null
    }
  }

  static async deleteProperty(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting property:', error)
      return false
    }
  }
}