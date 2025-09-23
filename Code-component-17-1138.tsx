import { supabase } from '../supabase'
import type { Database } from '../supabase'

type Tenant = Database['public']['Tables']['tenants']['Row']
type TenantInsert = Database['public']['Tables']['tenants']['Insert']
type TenantUpdate = Database['public']['Tables']['tenants']['Update']

export class TenantService {
  static async getTenants(propertyId: string): Promise<(Tenant & { unit_number?: string })[]> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          units!inner(unit_number, property_id)
        `)
        .eq('units.property_id', propertyId)

      if (error) throw error
      
      // Transform the data to include unit_number at the top level
      const transformedData = data?.map(tenant => ({
        ...tenant,
        unit_number: (tenant as any).units?.unit_number
      })) || []

      return transformedData
    } catch (error) {
      console.error('Error fetching tenants:', error)
      return []
    }
  }

  static async getTenant(id: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tenant:', error)
      return null
    }
  }

  static async getTenantByUnit(unitId: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('unit_id', unitId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tenant by unit:', error)
      return null
    }
  }

  static async createTenant(tenant: TenantInsert): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert(tenant)
        .select()
        .single()

      if (error) throw error

      // Update unit status to occupied if unit_id is provided
      if (tenant.unit_id) {
        await supabase
          .from('units')
          .update({ status: 'occupied' })
          .eq('id', tenant.unit_id)
      }

      return data
    } catch (error) {
      console.error('Error creating tenant:', error)
      return null
    }
  }

  static async updateTenant(id: string, updates: TenantUpdate): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating tenant:', error)
      return null
    }
  }

  static async deleteTenant(id: string): Promise<boolean> {
    try {
      // Get tenant info first to update unit status
      const tenant = await this.getTenant(id)
      
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update unit status to available if unit was assigned
      if (tenant?.unit_id) {
        await supabase
          .from('units')
          .update({ status: 'available' })
          .eq('id', tenant.unit_id)
      }

      return true
    } catch (error) {
      console.error('Error deleting tenant:', error)
      return false
    }
  }

  static async assignTenantToUnit(tenantId: string, unitId: string): Promise<boolean> {
    try {
      // Get current tenant to update previous unit
      const currentTenant = await this.getTenant(tenantId)
      
      // Update tenant with new unit
      const { error: tenantError } = await supabase
        .from('tenants')
        .update({ unit_id: unitId, updated_at: new Date().toISOString() })
        .eq('id', tenantId)

      if (tenantError) throw tenantError

      // Update previous unit to available
      if (currentTenant?.unit_id) {
        await supabase
          .from('units')
          .update({ status: 'available' })
          .eq('id', currentTenant.unit_id)
      }

      // Update new unit to occupied
      await supabase
        .from('units')
        .update({ status: 'occupied' })
        .eq('id', unitId)

      return true
    } catch (error) {
      console.error('Error assigning tenant to unit:', error)
      return false
    }
  }

  static async removeTenantFromUnit(tenantId: string): Promise<boolean> {
    try {
      const tenant = await this.getTenant(tenantId)
      
      const { error } = await supabase
        .from('tenants')
        .update({ unit_id: null, updated_at: new Date().toISOString() })
        .eq('id', tenantId)

      if (error) throw error

      // Update unit to available
      if (tenant?.unit_id) {
        await supabase
          .from('units')
          .update({ status: 'available' })
          .eq('id', tenant.unit_id)
      }

      return true
    } catch (error) {
      console.error('Error removing tenant from unit:', error)
      return false
    }
  }
}