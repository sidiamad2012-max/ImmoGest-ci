import { supabase } from '../supabase'
import type { Database } from '../supabase'

type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row']
type MaintenanceRequestInsert = Database['public']['Tables']['maintenance_requests']['Insert']
type MaintenanceRequestUpdate = Database['public']['Tables']['maintenance_requests']['Update']

export class MaintenanceService {
  static async getMaintenanceRequests(propertyId: string): Promise<(MaintenanceRequest & { unit_number?: string })[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          units!inner(unit_number, property_id)
        `)
        .eq('units.property_id', propertyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data to include unit_number at the top level
      const transformedData = data?.map(request => ({
        ...request,
        unit_number: (request as any).units?.unit_number
      })) || []

      return transformedData
    } catch (error) {
      console.error('Error fetching maintenance requests:', error)
      return []
    }
  }

  static async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | null> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching maintenance request:', error)
      return null
    }
  }

  static async getMaintenanceRequestsByUnit(unitId: string): Promise<MaintenanceRequest[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('unit_id', unitId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching maintenance requests by unit:', error)
      return []
    }
  }

  static async getMaintenanceRequestsByStatus(
    propertyId: string, 
    status: 'pending' | 'in-progress' | 'completed' | 'scheduled'
  ): Promise<(MaintenanceRequest & { unit_number?: string })[]> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          units!inner(unit_number, property_id)
        `)
        .eq('units.property_id', propertyId)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const transformedData = data?.map(request => ({
        ...request,
        unit_number: (request as any).units?.unit_number
      })) || []

      return transformedData
    } catch (error) {
      console.error('Error fetching maintenance requests by status:', error)
      return []
    }
  }

  static async createMaintenanceRequest(request: MaintenanceRequestInsert): Promise<MaintenanceRequest | null> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(request)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating maintenance request:', error)
      return null
    }
  }

  static async updateMaintenanceRequest(id: string, updates: MaintenanceRequestUpdate): Promise<MaintenanceRequest | null> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating maintenance request:', error)
      return null
    }
  }

  static async updateMaintenanceStatus(
    id: string, 
    status: 'pending' | 'in-progress' | 'completed' | 'scheduled',
    additionalUpdates?: Partial<MaintenanceRequestUpdate>
  ): Promise<boolean> {
    try {
      const updates: MaintenanceRequestUpdate = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalUpdates
      }

      // Set completion date if status is completed
      if (status === 'completed') {
        updates.completed_date = new Date().toISOString()
      }

      const { error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating maintenance status:', error)
      return false
    }
  }

  static async assignMaintenanceRequest(id: string, assignedTo: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          assigned_to: assignedTo,
          status: 'in-progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning maintenance request:', error)
      return false
    }
  }

  static async scheduleMaintenanceRequest(id: string, scheduledDate: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          scheduled_date: scheduledDate,
          status: 'scheduled',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error scheduling maintenance request:', error)
      return false
    }
  }

  static async deleteMaintenanceRequest(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting maintenance request:', error)
      return false
    }
  }

  static async getMaintenanceStats(propertyId: string): Promise<{
    total: number
    pending: number
    inProgress: number
    completed: number
    scheduled: number
  }> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          status,
          units!inner(property_id)
        `)
        .eq('units.property_id', propertyId)

      if (error) throw error

      const stats = {
        total: data?.length || 0,
        pending: data?.filter(r => r.status === 'pending').length || 0,
        inProgress: data?.filter(r => r.status === 'in-progress').length || 0,
        completed: data?.filter(r => r.status === 'completed').length || 0,
        scheduled: data?.filter(r => r.status === 'scheduled').length || 0
      }

      return stats
    } catch (error) {
      console.error('Error fetching maintenance stats:', error)
      return { total: 0, pending: 0, inProgress: 0, completed: 0, scheduled: 0 }
    }
  }
}