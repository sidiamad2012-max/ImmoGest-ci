import { supabase, isSupabaseAvailable } from '../supabase';
import { mockDataStore } from '../store/mockDataStore';
import type { Database } from '../database.types';
import { handleSupabaseError } from '../utils/errorHandler';

type Property = Database['public']['Tables']['properties']['Row'];
type Unit = Database['public']['Tables']['units']['Row'];
type Tenant = Database['public']['Tables']['tenants']['Row'];
type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type UnitInsert = Database['public']['Tables']['units']['Insert'];
type TenantInsert = Database['public']['Tables']['tenants']['Insert'];
type MaintenanceRequestInsert = Database['public']['Tables']['maintenance_requests']['Insert'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

class DataService {
  private useSupabase = isSupabaseAvailable();

  constructor() {
    console.log('DataService initialized with:', this.useSupabase ? 'Supabase' : 'Mock data');
    if (this.useSupabase) {
      this.testSupabaseConnection();
    }
  }

  // Test Supabase connection and log detailed information
  private async testSupabaseConnection() {
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase
        .from('properties')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase connection test failed:', error);
        console.log('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        // Force fallback to mock data
        this.useSupabase = false;
      } else {
        console.log('Supabase connection successful!', data);
      }
    } catch (error) {
      console.error('Supabase connection test error:', error);
      this.useSupabase = false;
    }
  }

  // Helper method to handle Supabase errors consistently
  private handleError(operation: string, error: any) {
    console.warn(`Erreur Supabase lors de ${operation}:`, error);
    
    // Log detailed error information
    if (error.code) {
      console.log('Error code:', error.code);
      if (error.code === 'PGRST205') {
        console.log('⚠️  Table not found - this usually means:');
        console.log('1. Tables haven\'t been created yet');
        console.log('2. API schema cache needs refresh');
        console.log('3. Check your Supabase dashboard Table Editor');
      }
    }
    
    // Return to mock data for this request
    return null;
  }

  // Property methods
  async getProperties(): Promise<Property[]> {
    if (!this.useSupabase) {
      return mockDataStore.getProperties();
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.handleError('getProperties', error);
        return mockDataStore.getProperties();
      }
      
      console.log('Properties loaded from Supabase:', data?.length || 0);
      return data || [];
    } catch (error) {
      this.handleError('getProperties', error);
      return mockDataStore.getProperties();
    }
  }

  async getProperty(id: string): Promise<Property | null> {
    if (!this.useSupabase) {
      return mockDataStore.getProperty(id);
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.handleError('getProperty', error);
        return mockDataStore.getProperty(id);
      }
      return data;
    } catch (error) {
      this.handleError('getProperty', error);
      return mockDataStore.getProperty(id);
    }
  }

  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    if (!this.useSupabase) {
      return mockDataStore.createProperty(property);
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([property as PropertyInsert])
        .select()
        .single();

      if (error) {
        this.handleError('createProperty', error);
        return mockDataStore.createProperty(property);
      }
      return data;
    } catch (error) {
      this.handleError('createProperty', error);
      return mockDataStore.createProperty(property);
    }
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    if (!this.useSupabase) {
      return mockDataStore.updateProperty(id, updates);
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError('updateProperty', error);
        return mockDataStore.updateProperty(id, updates);
      }
      return data;
    } catch (error) {
      this.handleError('updateProperty', error);
      return mockDataStore.updateProperty(id, updates);
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      return mockDataStore.deleteProperty(id);
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError('deleteProperty', error);
        return mockDataStore.deleteProperty(id);
      }
      return true;
    } catch (error) {
      this.handleError('deleteProperty', error);
      return mockDataStore.deleteProperty(id);
    }
  }

  // Unit methods
  async getUnits(propertyId?: string): Promise<Unit[]> {
    if (!this.useSupabase) {
      return mockDataStore.getUnits(propertyId);
    }

    try {
      let query = supabase.from('units').select('*');
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('unit_number');

      if (error) {
        this.handleError('getUnits', error);
        return mockDataStore.getUnits(propertyId);
      }
      
      console.log('Units loaded from Supabase:', data?.length || 0);
      return data || [];
    } catch (error) {
      this.handleError('getUnits', error);
      return mockDataStore.getUnits(propertyId);
    }
  }

  async getUnit(id: string): Promise<Unit | null> {
    if (!this.useSupabase) {
      return mockDataStore.getUnit(id);
    }

    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.handleError('getUnit', error);
        return mockDataStore.getUnit(id);
      }
      return data;
    } catch (error) {
      this.handleError('getUnit', error);
      return mockDataStore.getUnit(id);
    }
  }

  async createUnit(unit: Omit<Unit, 'id' | 'created_at' | 'updated_at'>): Promise<Unit> {
    if (!this.useSupabase) {
      return mockDataStore.createUnit(unit);
    }

    try {
      const { data, error } = await supabase
        .from('units')
        .insert([unit as UnitInsert])
        .select()
        .single();

      if (error) {
        this.handleError('createUnit', error);
        return mockDataStore.createUnit(unit);
      }
      return data;
    } catch (error) {
      this.handleError('createUnit', error);
      return mockDataStore.createUnit(unit);
    }
  }

  async updateUnit(id: string, updates: Partial<Unit>): Promise<Unit | null> {
    if (!this.useSupabase) {
      return mockDataStore.updateUnit(id, updates);
    }

    try {
      const { data, error } = await supabase
        .from('units')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError('updateUnit', error);
        return mockDataStore.updateUnit(id, updates);
      }
      return data;
    } catch (error) {
      this.handleError('updateUnit', error);
      return mockDataStore.updateUnit(id, updates);
    }
  }

  async deleteUnit(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      return mockDataStore.deleteUnit(id);
    }

    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError('deleteUnit', error);
        return mockDataStore.deleteUnit(id);
      }
      return true;
    } catch (error) {
      this.handleError('deleteUnit', error);
      return mockDataStore.deleteUnit(id);
    }
  }

  // Tenant methods
  async getTenants(): Promise<Tenant[]> {
    if (!this.useSupabase) {
      return mockDataStore.getTenants();
    }

    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

      if (error) {
        this.handleError('getTenants', error);
        return mockDataStore.getTenants();
      }
      
      console.log('Tenants loaded from Supabase:', data?.length || 0);
      return data || [];
    } catch (error) {
      this.handleError('getTenants', error);
      return mockDataStore.getTenants();
    }
  }

  async getTenant(id: string): Promise<Tenant | null> {
    if (!this.useSupabase) {
      return mockDataStore.getTenant(id);
    }

    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.handleError('getTenant', error);
        return mockDataStore.getTenant(id);
      }
      return data;
    } catch (error) {
      this.handleError('getTenant', error);
      return mockDataStore.getTenant(id);
    }
  }

  async getTenantByUnit(unitId: string): Promise<Tenant | null> {
    if (!this.useSupabase) {
      return mockDataStore.getTenantByUnit(unitId);
    }

    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('unit_id', unitId)
        .single();

      if (error && error.code !== 'PGRST116') {
        this.handleError('getTenantByUnit', error);
        return mockDataStore.getTenantByUnit(unitId);
      }
      return data || null;
    } catch (error) {
      this.handleError('getTenantByUnit', error);
      return mockDataStore.getTenantByUnit(unitId);
    }
  }

  async createTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
    if (!this.useSupabase) {
      return mockDataStore.createTenant(tenant);
    }

    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([tenant as TenantInsert])
        .select()
        .single();

      if (error) {
        this.handleError('createTenant', error);
        return mockDataStore.createTenant(tenant);
      }

      // Update unit status if unit_id is provided
      if (tenant.unit_id) {
        await this.updateUnit(tenant.unit_id, { status: 'occupied' });
      }

      return data;
    } catch (error) {
      this.handleError('createTenant', error);
      return mockDataStore.createTenant(tenant);
    }
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    if (!this.useSupabase) {
      return mockDataStore.updateTenant(id, updates);
    }

    try {
      // Get current tenant for unit management
      const currentTenant = await this.getTenant(id);
      if (!currentTenant) return null;

      // Handle unit changes
      if (updates.unit_id !== undefined) {
        // Free up previous unit
        if (currentTenant.unit_id) {
          await this.updateUnit(currentTenant.unit_id, { status: 'available' });
        }
        // Occupy new unit
        if (updates.unit_id) {
          await this.updateUnit(updates.unit_id, { status: 'occupied' });
        }
      }

      const { data, error } = await supabase
        .from('tenants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError('updateTenant', error);
        return mockDataStore.updateTenant(id, updates);
      }
      return data;
    } catch (error) {
      this.handleError('updateTenant', error);
      return mockDataStore.updateTenant(id, updates);
    }
  }

  async deleteTenant(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      return mockDataStore.deleteTenant(id);
    }

    try {
      // Get tenant to free up unit
      const tenant = await this.getTenant(id);
      
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError('deleteTenant', error);
        return mockDataStore.deleteTenant(id);
      }

      // Free up unit
      if (tenant?.unit_id) {
        await this.updateUnit(tenant.unit_id, { status: 'available' });
      }

      return true;
    } catch (error) {
      this.handleError('deleteTenant', error);
      return mockDataStore.deleteTenant(id);
    }
  }

  // Maintenance Request methods
  async getMaintenanceRequests(propertyId?: string): Promise<MaintenanceRequest[]> {
    if (!this.useSupabase) {
      return mockDataStore.getMaintenanceRequests(propertyId);
    }

    try {
      if (propertyId) {
        // Get units for the property first, then filter maintenance requests
        const units = await this.getUnits(propertyId);
        const unitIds = units.map(u => u.id);
        
        if (unitIds.length === 0) return [];

        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .in('unit_id', unitIds)
          .order('reported_date', { ascending: false });

        if (error) {
          this.handleError('getMaintenanceRequests', error);
          return mockDataStore.getMaintenanceRequests(propertyId);
        }
        return data || [];
      } else {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('reported_date', { ascending: false });

        if (error) {
          this.handleError('getMaintenanceRequests', error);
          return mockDataStore.getMaintenanceRequests(propertyId);
        }
        return data || [];
      }
    } catch (error) {
      this.handleError('getMaintenanceRequests', error);
      return mockDataStore.getMaintenanceRequests(propertyId);
    }
  }

  async createMaintenanceRequest(request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceRequest> {
    if (!this.useSupabase) {
      return mockDataStore.createMaintenanceRequest(request);
    }

    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([request as MaintenanceRequestInsert])
        .select()
        .single();

      if (error) {
        this.handleError('createMaintenanceRequest', error);
        return mockDataStore.createMaintenanceRequest(request);
      }
      return data;
    } catch (error) {
      this.handleError('createMaintenanceRequest', error);
      return mockDataStore.createMaintenanceRequest(request);
    }
  }

  async updateMaintenanceRequest(id: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | null> {
    if (!this.useSupabase) {
      return mockDataStore.updateMaintenanceRequest(id, updates);
    }

    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError('updateMaintenanceRequest', error);
        return mockDataStore.updateMaintenanceRequest(id, updates);
      }
      return data;
    } catch (error) {
      this.handleError('updateMaintenanceRequest', error);
      return mockDataStore.updateMaintenanceRequest(id, updates);
    }
  }

  // Transaction methods
  async getTransactions(propertyId?: string): Promise<Transaction[]> {
    if (!this.useSupabase) {
      return mockDataStore.getTransactions(propertyId);
    }

    try {
      let query = supabase.from('transactions').select('*');
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        this.handleError('getTransactions', error);
        return mockDataStore.getTransactions(propertyId);
      }
      
      console.log('Transactions loaded from Supabase:', data?.length || 0);
      return data || [];
    } catch (error) {
      this.handleError('getTransactions', error);
      return mockDataStore.getTransactions(propertyId);
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    if (!this.useSupabase) {
      return mockDataStore.createTransaction(transaction);
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction as TransactionInsert])
        .select()
        .single();

      if (error) {
        this.handleError('createTransaction', error);
        return mockDataStore.createTransaction(transaction);
      }
      return data;
    } catch (error) {
      this.handleError('createTransaction', error);
      return mockDataStore.createTransaction(transaction);
    }
  }

  // Helper methods
  async getUnitWithDetails(unitId: string) {
    if (!this.useSupabase) {
      return mockDataStore.getUnitWithDetails(unitId);
    }

    try {
      const unit = await this.getUnit(unitId);
      if (!unit) return null;

      const tenant = await this.getTenantByUnit(unitId);
      const maintenanceRequests = await this.getMaintenanceRequests();
      const unitMaintenanceRequests = maintenanceRequests.filter(r => r.unit_id === unitId);

      return {
        ...unit,
        tenant,
        maintenanceRequests: unitMaintenanceRequests
      };
    } catch (error) {
      this.handleError('getUnitWithDetails', error);
      return mockDataStore.getUnitWithDetails(unitId);
    }
  }

  async getPropertyStats(propertyId: string) {
    if (!this.useSupabase) {
      return mockDataStore.getPropertyStats(propertyId);
    }

    try {
      const units = await this.getUnits(propertyId);
      const tenants = await this.getTenants();
      const propertyTenants = tenants.filter(t => {
        if (!t.unit_id) return false;
        const unit = units.find(u => u.id === t.unit_id);
        return unit?.property_id === propertyId;
      });
      const maintenanceRequests = await this.getMaintenanceRequests(propertyId);

      return {
        totalUnits: units.length,
        occupiedUnits: units.filter(u => u.status === 'occupied').length,
        availableUnits: units.filter(u => u.status === 'available').length,
        maintenanceUnits: units.filter(u => u.status === 'maintenance').length,
        totalTenants: propertyTenants.length,
        pendingMaintenance: maintenanceRequests.filter(r => r.status === 'pending').length,
        inProgressMaintenance: maintenanceRequests.filter(r => r.status === 'in-progress').length,
        scheduledMaintenance: maintenanceRequests.filter(r => r.status === 'scheduled').length,
        completedMaintenance: maintenanceRequests.filter(r => r.status === 'completed').length,
        monthlyRevenue: propertyTenants.reduce((sum, t) => sum + t.rent_amount, 0)
      };
    } catch (error) {
      this.handleError('getPropertyStats', error);
      return mockDataStore.getPropertyStats(propertyId);
    }
  }

  // Method to check connection status
  getConnectionStatus() {
    return {
      isSupabaseConnected: this.useSupabase,
      connectionType: this.useSupabase ? 'Supabase Database' : 'Mock Data Store'
    };
  }

  // Method to test Supabase connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.useSupabase) {
      return {
        success: false,
        message: 'Supabase non configuré - utilisation des données mock'
      };
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.log('Connection test error details:', error);
        throw error;
      }

      return {
        success: true,
        message: `Connexion Supabase réussie! Base de données accessible.`
      };
    } catch (error: any) {
      let message = `Erreur de connexion Supabase: ${error.message}`;
      
      if (error.code === 'PGRST205') {
        message += '\n\n🔧 Solutions possibles:\n1. Créer les tables avec le script SQL\n2. Redémarrer l\'API Supabase\n3. Vérifier les permissions RLS';
      }
      
      return {
        success: false,
        message
      };
    }
  }

  // Force refresh connection status
  async refreshConnection(): Promise<void> {
    console.log('Refreshing Supabase connection...');
    this.useSupabase = isSupabaseAvailable();
    if (this.useSupabase) {
      await this.testSupabaseConnection();
    }
  }
}

// Create and export a singleton instance
export const dataService = new DataService();