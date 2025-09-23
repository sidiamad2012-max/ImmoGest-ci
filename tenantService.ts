import { supabase, isSupabaseAvailable } from '../supabase'
import type { Database } from '../database.types'
import { withRetryAndFallback, errorHandler } from '../utils/errorHandler'
import { mockDataStore } from '../store/mockDataStore'

type Tenant = Database['public']['Tables']['tenants']['Row']
type TenantInsert = Database['public']['Tables']['tenants']['Insert']
type TenantUpdate = Database['public']['Tables']['tenants']['Update']

export class TenantService {
  static async getTenants(propertyId: string): Promise<(Tenant & { unit_number?: string })[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('tenants')
          .select(`
            *,
            units!inner(unit_number, property_id)
          `)
          .eq('units.property_id', propertyId)

        if (error) throw error
        
        // Transform the data to include unit_number at the top level
        return data?.map(tenant => ({
          ...tenant,
          unit_number: (tenant as any).units?.unit_number
        })) || []
      },
      () => {
        console.log('Using mock tenants data');
        const allTenants = mockDataStore.getTenants();
        const units = mockDataStore.getUnits(propertyId);
        const unitIds = units.map(u => u.id);
        
        return allTenants
          .filter(tenant => !tenant.unit_id || unitIds.includes(tenant.unit_id))
          .map(tenant => {
            const unit = tenant.unit_id ? mockDataStore.getUnit(tenant.unit_id) : null;
            return {
              ...tenant,
              unit_number: unit?.unit_number
            };
          });
      }
    );
  }

  static async getTenant(id: string): Promise<Tenant | null> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('tenants')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      },
      () => {
        console.log('Using mock tenant data');
        return mockDataStore.getTenant(id);
      }
    );
  }

  static async getTenantByUnit(unitId: string): Promise<Tenant | null> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('tenants')
          .select('*')
          .eq('unit_id', unitId)
          .single()

        if (error) throw error
        return data
      },
      () => {
        console.log('Using mock tenant by unit data');
        return mockDataStore.getTenantByUnit(unitId);
      }
    );
  }

  static async createTenant(tenant: TenantInsert): Promise<Tenant | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, creating tenant in mock store');
        return mockDataStore.createTenant(tenant);
      }

      const { data, error } = await supabase!
        .from('tenants')
        .insert(tenant)
        .select()
        .single()

      if (error) throw error

      // Update unit status to occupied if unit_id is provided
      if (tenant.unit_id) {
        await supabase!
          .from('units')
          .update({ status: 'occupied' })
          .eq('id', tenant.unit_id)
      }

      return data
    } catch (error) {
      errorHandler.handle(error, 'tenant creation');
      return null
    }
  }

  static async updateTenant(id: string, updates: TenantUpdate): Promise<Tenant | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating tenant in mock store');
        return mockDataStore.updateTenant(id, updates);
      }

      const { data, error } = await supabase!
        .from('tenants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'tenant update');
      return null
    }
  }

  static async deleteTenant(id: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, deleting tenant from mock store');
        return mockDataStore.deleteTenant(id);
      }

      // Get tenant info first to update unit status
      const tenant = await this.getTenant(id)
      
      const { error } = await supabase!
        .from('tenants')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update unit status to available if unit was assigned
      if (tenant?.unit_id) {
        await supabase!
          .from('units')
          .update({ status: 'available' })
          .eq('id', tenant.unit_id)
      }

      return true
    } catch (error) {
      errorHandler.handle(error, 'tenant deletion');
      return false
    }
  }

  static async assignTenantToUnit(tenantId: string, unitId: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, assigning tenant in mock store');
        const result = mockDataStore.updateTenant(tenantId, { unit_id: unitId });
        return result !== null;
      }

      // Get current tenant to update previous unit
      const currentTenant = await this.getTenant(tenantId)
      
      // Update tenant with new unit
      const { error: tenantError } = await supabase!
        .from('tenants')
        .update({ unit_id: unitId, updated_at: new Date().toISOString() })
        .eq('id', tenantId)

      if (tenantError) throw tenantError

      // Update previous unit to available
      if (currentTenant?.unit_id) {
        await supabase!
          .from('units')
          .update({ status: 'available' })
          .eq('id', currentTenant.unit_id)
      }

      // Update new unit to occupied
      await supabase!
        .from('units')
        .update({ status: 'occupied' })
        .eq('id', unitId)

      return true
    } catch (error) {
      errorHandler.handle(error, 'tenant assignment');
      return false
    }
  }

  static async removeTenantFromUnit(tenantId: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, removing tenant from unit in mock store');
        const result = mockDataStore.updateTenant(tenantId, { unit_id: null });
        return result !== null;
      }

      const tenant = await this.getTenant(tenantId)
      
      const { error } = await supabase!
        .from('tenants')
        .update({ unit_id: null, updated_at: new Date().toISOString() })
        .eq('id', tenantId)

      if (error) throw error

      // Update unit to available
      if (tenant?.unit_id) {
        await supabase!
          .from('units')
          .update({ status: 'available' })
          .eq('id', tenant.unit_id)
      }

      return true
    } catch (error) {
      errorHandler.handle(error, 'tenant removal');
      return false
    }
  }
}