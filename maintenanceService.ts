import { supabase, isSupabaseAvailable } from '../supabase'
import type { Database } from '../database.types'
import { withRetryAndFallback, errorHandler } from '../utils/errorHandler'
import { mockDataStore } from '../store/mockDataStore'

type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row']
type MaintenanceRequestInsert = Database['public']['Tables']['maintenance_requests']['Insert']
type MaintenanceRequestUpdate = Database['public']['Tables']['maintenance_requests']['Update']

export class MaintenanceService {
  static async getMaintenanceRequests(propertyId: string): Promise<(MaintenanceRequest & { unit_number?: string })[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('maintenance_requests')
          .select(`
            *,
            units!inner(unit_number, property_id)
          `)
          .eq('units.property_id', propertyId)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        // Transform the data to include unit_number at the top level
        return data?.map(request => ({
          ...request,
          unit_number: (request as any).units?.unit_number
        })) || []
      },
      () => {
        console.log('Using mock maintenance requests data');
        const allRequests = mockDataStore.getMaintenanceRequests(propertyId);
        return allRequests.map(request => {
          const unit = mockDataStore.getUnit(request.unit_id);
          return {
            ...request,
            unit_number: unit?.unit_number
          };
        });
      }
    );
  }

  static async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | null> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('maintenance_requests')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      },
      () => {
        console.log('Using mock maintenance request data');
        return mockDataStore.getMaintenanceRequest(id);
      }
    );
  }

  static async getMaintenanceRequestsByUnit(unitId: string): Promise<MaintenanceRequest[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('maintenance_requests')
          .select('*')
          .eq('unit_id', unitId)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock maintenance requests by unit data');
        return mockDataStore.getMaintenanceRequests().filter(r => r.unit_id === unitId);
      }
    );
  }

  static async getMaintenanceRequestsByStatus(
    propertyId: string, 
    status: 'pending' | 'in-progress' | 'completed' | 'scheduled'
  ): Promise<(MaintenanceRequest & { unit_number?: string })[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('maintenance_requests')
          .select(`
            *,
            units!inner(unit_number, property_id)
          `)
          .eq('units.property_id', propertyId)
          .eq('status', status)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        return data?.map(request => ({
          ...request,
          unit_number: (request as any).units?.unit_number
        })) || []
      },
      () => {
        console.log('Using mock maintenance requests by status data');
        const allRequests = mockDataStore.getMaintenanceRequests(propertyId);
        return allRequests
          .filter(request => request.status === status)
          .map(request => {
            const unit = mockDataStore.getUnit(request.unit_id);
            return {
              ...request,
              unit_number: unit?.unit_number
            };
          });
      }
    );
  }

  static async createMaintenanceRequest(request: MaintenanceRequestInsert): Promise<MaintenanceRequest | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, creating maintenance request in mock store');
        return mockDataStore.createMaintenanceRequest(request);
      }

      const { data, error } = await supabase!
        .from('maintenance_requests')
        .insert(request)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'maintenance request creation');
      return null
    }
  }

  static async updateMaintenanceRequest(id: string, updates: MaintenanceRequestUpdate): Promise<MaintenanceRequest | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating maintenance request in mock store');
        return mockDataStore.updateMaintenanceRequest(id, updates);
      }

      const { data, error } = await supabase!
        .from('maintenance_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'maintenance request update');
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

      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating maintenance status in mock store');
        const result = mockDataStore.updateMaintenanceRequest(id, updates);
        return result !== null;
      }

      const { error } = await supabase!
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'maintenance status update');
      return false
    }
  }

  static async assignMaintenanceRequest(id: string, assignedTo: string): Promise<boolean> {
    try {
      const updates = { 
        assigned_to: assignedTo,
        status: 'in-progress' as const,
        updated_at: new Date().toISOString()
      };

      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, assigning maintenance request in mock store');
        const result = mockDataStore.updateMaintenanceRequest(id, updates);
        return result !== null;
      }

      const { error } = await supabase!
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'maintenance request assignment');
      return false
    }
  }

  static async scheduleMaintenanceRequest(id: string, scheduledDate: string): Promise<boolean> {
    try {
      const updates = { 
        scheduled_date: scheduledDate,
        status: 'scheduled' as const,
        updated_at: new Date().toISOString()
      };

      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, scheduling maintenance request in mock store');
        const result = mockDataStore.updateMaintenanceRequest(id, updates);
        return result !== null;
      }

      const { error } = await supabase!
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'maintenance request scheduling');
      return false
    }
  }

  static async deleteMaintenanceRequest(id: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, deleting maintenance request from mock store');
        return mockDataStore.deleteMaintenanceRequest(id);
      }

      const { error } = await supabase!
        .from('maintenance_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'maintenance request deletion');
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
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
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
      },
      () => {
        console.log('Using mock maintenance stats data');
        const requests = mockDataStore.getMaintenanceRequests(propertyId);
        return {
          total: requests.length,
          pending: requests.filter(r => r.status === 'pending').length,
          inProgress: requests.filter(r => r.status === 'in-progress').length,
          completed: requests.filter(r => r.status === 'completed').length,
          scheduled: requests.filter(r => r.status === 'scheduled').length
        };
      }
    );
  }
}