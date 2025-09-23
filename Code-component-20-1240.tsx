import type { Database } from '../database.types';

type Property = Database['public']['Tables']['properties']['Row'];
type Unit = Database['public']['Tables']['units']['Row'];
type Tenant = Database['public']['Tables']['tenants']['Row'];
type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

// Mock data store - holds all the application data in memory
class MockDataStore {
  private properties: Property[] = [];
  private units: Unit[] = [];
  private tenants: Tenant[] = [];
  private maintenanceRequests: MaintenanceRequest[] = [];
  private transactions: Transaction[] = [];
  private initialized = false;

  // Initialize with default data
  private initialize() {
    if (this.initialized) return;

    // Properties
    this.properties = [
      {
        id: 'mock-property-1',
        name: 'Résidence Les Palmiers',
        address: 'Boulevard Lagunaire, Cocody, Abidjan, Côte d\'Ivoire',
        description: 'Résidence moderne avec équipements mis à jour, proche du centre-ville et des transports en commun à Abidjan.',
        total_units: 12,
        year_built: 2018,
        square_footage: 850,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        owner_id: 'mock-owner-1'
      }
    ];

    // Units
    this.units = [
      {
        id: 'mock-unit-1',
        property_id: 'mock-property-1',
        unit_number: '1A',
        floor: 'rdc',
        type: 'f2',
        surface: 65,
        bedrooms: 2,
        bathrooms: 1,
        rent: 180000,
        deposit: 360000,
        description: 'Appartement lumineux avec balcon donnant sur jardin',
        amenities: ['wifi', 'parking', 'security'],
        furnished: false,
        status: 'occupied',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-unit-2',
        property_id: 'mock-property-1',
        unit_number: '1B',
        floor: 'rdc',
        type: 'f1',
        surface: 45,
        bedrooms: 1,
        bathrooms: 1,
        rent: 120000,
        deposit: 240000,
        description: 'Studio moderne avec kitchenette équipée',
        amenities: ['wifi', 'ac', 'security'],
        furnished: true,
        status: 'available',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-unit-3',
        property_id: 'mock-property-1',
        unit_number: '2A',
        floor: 'etage_1',
        type: 'f3',
        surface: 85,
        bedrooms: 3,
        bathrooms: 2,
        rent: 250000,
        deposit: 500000,
        description: 'Grand appartement familial avec terrasse',
        amenities: ['wifi', 'parking', 'security', 'balcony'],
        furnished: false,
        status: 'occupied',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-unit-4',
        property_id: 'mock-property-1',
        unit_number: '2B',  
        floor: 'etage_1',
        type: 'f2',
        surface: 70,
        bedrooms: 2,
        bathrooms: 1,
        rent: 190000,
        deposit: 380000,
        description: 'Appartement rénové avec vue dégagée',
        amenities: ['wifi', 'ac', 'security'],
        furnished: false,
        status: 'maintenance',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-unit-5',
        property_id: 'mock-property-1',
        unit_number: '3A',
        floor: 'etage_2',
        type: 'f2',
        surface: 68,
        bedrooms: 2,
        bathrooms: 1,
        rent: 185000,
        deposit: 370000,
        description: 'Appartement calme avec beaucoup de lumière',
        amenities: ['wifi', 'parking', 'security'],
        furnished: false,
        status: 'available',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
    ];

    // Tenants
    this.tenants = [
      {
        id: 'mock-tenant-1',
        unit_id: 'mock-unit-1',
        name: 'Awa Traoré',
        email: 'awa.traore@email.com',
        phone: '+225 07 12 34 56 78',
        lease_start: '2024-01-15',
        lease_end: '2025-01-14',
        rent_amount: 180000,
        deposit_amount: 360000,
        emergency_contact: '+225 05 11 22 33 44',
        occupation: 'Professeure',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-tenant-2',
        unit_id: 'mock-unit-3',
        name: 'Kouadio Michel',
        email: 'kouadio.michel@email.com',
        phone: '+225 05 98 76 54 32',
        lease_start: '2024-03-01',
        lease_end: '2025-02-28',
        rent_amount: 250000,
        deposit_amount: 500000,
        emergency_contact: '+225 07 55 66 77 88',
        occupation: 'Ingénieur',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'mock-tenant-3',
        unit_id: null,
        name: 'Aminata Kone',
        email: 'aminata.kone@email.com',
        phone: '+225 01 23 45 67 89',
        lease_start: '2024-06-01',
        lease_end: '2025-05-31',
        rent_amount: 0,
        deposit_amount: 0,
        emergency_contact: '+225 07 99 88 77 66',
        occupation: 'Commercante',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    // Maintenance Requests
    this.maintenanceRequests = [
      {
        id: 'mock-maintenance-1',
        unit_id: 'mock-unit-1',
        title: 'Fuite robinet cuisine',
        description: 'Eau qui goutte du robinet de cuisine, réparation ou remplacement nécessaire',
        category: 'plumbing',
        priority: 'medium',
        status: 'in-progress',
        reported_date: '2024-12-10',
        scheduled_date: '2024-12-18',
        completed_date: null,
        reported_by: 'Awa Traoré',
        assigned_to: 'Plomberie Express CI',
        estimated_cost: 90000,
        actual_cost: null,
        created_at: '2024-12-10T00:00:00Z',
        updated_at: '2024-12-10T00:00:00Z'
      },
      {
        id: 'mock-maintenance-2',
        unit_id: 'mock-unit-3',
        title: 'Climatisation ne refroidit pas',
        description: 'Climatiseur du salon ne maintient pas la température',
        category: 'hvac',
        priority: 'high',
        status: 'scheduled',
        reported_date: '2024-12-11',
        scheduled_date: '2024-12-19',
        completed_date: null,
        reported_by: 'Kouadio Michel',
        assigned_to: 'Froid Service Abidjan',
        estimated_cost: 180000,
        actual_cost: null,
        created_at: '2024-12-11T00:00:00Z',
        updated_at: '2024-12-11T00:00:00Z'
      },
      {
        id: 'mock-maintenance-3',
        unit_id: 'mock-unit-2',
        title: 'Peinture écaillée salle de bain',
        description: 'Peinture qui s\'écaille dans la salle de bain due à l\'humidité',
        category: 'general',
        priority: 'low',
        status: 'pending',
        reported_date: '2024-12-12',
        scheduled_date: null,
        completed_date: null,
        reported_by: 'Propriétaire',
        assigned_to: null,
        estimated_cost: 75000,
        actual_cost: null,
        created_at: '2024-12-12T00:00:00Z',
        updated_at: '2024-12-12T00:00:00Z'
      },
      {
        id: 'mock-maintenance-4',
        unit_id: 'mock-unit-4',
        title: 'Prise électrique défaillante',
        description: 'Prise de courant dans la chambre principale ne fonctionne pas',
        category: 'electrical',
        priority: 'urgent',
        status: 'completed',
        reported_date: '2024-12-08',
        scheduled_date: '2024-12-09',
        completed_date: '2024-12-09',
        reported_by: 'Propriétaire',
        assigned_to: 'Électricité Moderne CI',
        estimated_cost: 50000,
        actual_cost: 45000,
        created_at: '2024-12-08T00:00:00Z',
        updated_at: '2024-12-09T00:00:00Z'
      }
    ];

    // Transactions
    this.transactions = [
      {
        id: 'mock-transaction-1',
        property_id: 'mock-property-1',
        type: 'income',
        description: 'Paiement Loyer - Logement 1A',
        amount: 180000,
        category: 'Loyer',
        tenant_id: 'mock-tenant-1',
        date: '2024-12-01',
        created_at: '2024-12-01T00:00:00Z',
        updated_at: '2024-12-01T00:00:00Z'
      },
      {
        id: 'mock-transaction-2',
        property_id: 'mock-property-1',
        type: 'income',
        description: 'Paiement Loyer - Logement 2A',
        amount: 250000,
        category: 'Loyer',
        tenant_id: 'mock-tenant-2',
        date: '2024-12-01',
        created_at: '2024-12-01T00:00:00Z',
        updated_at: '2024-12-01T00:00:00Z'
      },
      {
        id: 'mock-transaction-3',
        property_id: 'mock-property-1',
        type: 'expense',
        description: 'Réparation Électricité - Logement 2B',
        amount: 45000,
        category: 'Maintenance',
        tenant_id: null,
        date: '2024-12-09',
        created_at: '2024-12-09T00:00:00Z',
        updated_at: '2024-12-09T00:00:00Z'
      },
      {
        id: 'mock-transaction-4',
        property_id: 'mock-property-1',
        type: 'expense',
        description: 'Assurance propriété - Mois de décembre',
        amount: 85000,
        category: 'Assurance',
        tenant_id: null,
        date: '2024-12-05',
        created_at: '2024-12-05T00:00:00Z',
        updated_at: '2024-12-05T00:00:00Z'
      }
    ];

    this.initialized = true;
  }

  // Utility function to generate ID
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Property methods
  getProperties(): Property[] {
    this.initialize();
    return [...this.properties];
  }

  getProperty(id: string): Property | null {
    this.initialize();
    return this.properties.find(p => p.id === id) || null;
  }

  createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Property {
    this.initialize();
    const newProperty: Property = {
      ...property,
      id: this.generateId('property'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    this.initialize();
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.properties[index] = {
      ...this.properties[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.properties[index];
  }

  deleteProperty(id: string): boolean {
    this.initialize();
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.properties.splice(index, 1);
    return true;
  }

  // Unit methods
  getUnits(propertyId?: string): Unit[] {
    this.initialize();
    if (propertyId) {
      return this.units.filter(u => u.property_id === propertyId);
    }
    return [...this.units];
  }

  getUnit(id: string): Unit | null {
    this.initialize();
    return this.units.find(u => u.id === id) || null;
  }

  createUnit(unit: Omit<Unit, 'id' | 'created_at' | 'updated_at'>): Unit {
    this.initialize();
    const newUnit: Unit = {
      ...unit,
      id: this.generateId('unit'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.units.push(newUnit);
    return newUnit;
  }

  updateUnit(id: string, updates: Partial<Unit>): Unit | null {
    this.initialize();
    const index = this.units.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.units[index] = {
      ...this.units[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.units[index];
  }

  deleteUnit(id: string): boolean {
    this.initialize();
    const index = this.units.findIndex(u => u.id === id);
    if (index === -1) return false;

    this.units.splice(index, 1);
    return true;
  }

  // Tenant methods
  getTenants(): Tenant[] {
    this.initialize();
    return [...this.tenants];
  }

  getTenant(id: string): Tenant | null {
    this.initialize();
    return this.tenants.find(t => t.id === id) || null;
  }

  getTenantByUnit(unitId: string): Tenant | null {
    this.initialize();
    return this.tenants.find(t => t.unit_id === unitId) || null;
  }

  createTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Tenant {
    this.initialize();
    const newTenant: Tenant = {
      ...tenant,
      id: this.generateId('tenant'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.tenants.push(newTenant);

    // Update unit status if unit_id is provided
    if (tenant.unit_id) {
      this.updateUnit(tenant.unit_id, { status: 'occupied' });
    }

    return newTenant;
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant | null {
    this.initialize();
    const index = this.tenants.findIndex(t => t.id === id);
    if (index === -1) return null;

    const currentTenant = this.tenants[index];
    
    // Handle unit changes
    if (updates.unit_id !== undefined) {
      // Free up previous unit
      if (currentTenant.unit_id) {
        this.updateUnit(currentTenant.unit_id, { status: 'available' });
      }
      // Occupy new unit
      if (updates.unit_id) {
        this.updateUnit(updates.unit_id, { status: 'occupied' });
      }
    }

    this.tenants[index] = {
      ...currentTenant,
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.tenants[index];
  }

  deleteTenant(id: string): boolean {
    this.initialize();
    const index = this.tenants.findIndex(t => t.id === id);
    if (index === -1) return false;

    const tenant = this.tenants[index];
    // Free up unit
    if (tenant.unit_id) {
      this.updateUnit(tenant.unit_id, { status: 'available' });
    }

    this.tenants.splice(index, 1);
    return true;
  }

  // Maintenance Request methods
  getMaintenanceRequests(propertyId?: string): MaintenanceRequest[] {
    this.initialize();
    if (propertyId) {
      const propertyUnits = this.units.filter(u => u.property_id === propertyId);
      const unitIds = propertyUnits.map(u => u.id);
      return this.maintenanceRequests.filter(r => unitIds.includes(r.unit_id));
    }
    return [...this.maintenanceRequests];
  }

  getMaintenanceRequest(id: string): MaintenanceRequest | null {
    this.initialize();
    return this.maintenanceRequests.find(r => r.id === id) || null;
  }

  createMaintenanceRequest(request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>): MaintenanceRequest {
    this.initialize();
    const newRequest: MaintenanceRequest = {
      ...request,
      id: this.generateId('maintenance'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.maintenanceRequests.push(newRequest);
    return newRequest;
  }

  updateMaintenanceRequest(id: string, updates: Partial<MaintenanceRequest>): MaintenanceRequest | null {
    this.initialize();
    const index = this.maintenanceRequests.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.maintenanceRequests[index] = {
      ...this.maintenanceRequests[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.maintenanceRequests[index];
  }

  deleteMaintenanceRequest(id: string): boolean {
    this.initialize();
    const index = this.maintenanceRequests.findIndex(r => r.id === id);
    if (index === -1) return false;

    this.maintenanceRequests.splice(index, 1);
    return true;
  }

  // Transaction methods
  getTransactions(propertyId?: string): Transaction[] {
    this.initialize();
    if (propertyId) {
      return this.transactions.filter(t => t.property_id === propertyId);
    }
    return [...this.transactions];
  }

  getTransaction(id: string): Transaction | null {
    this.initialize();
    return this.transactions.find(t => t.id === id) || null;
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction {
    this.initialize();
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId('transaction'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    this.initialize();
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.transactions[index] = {
      ...this.transactions[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.transactions[index];
  }

  deleteTransaction(id: string): boolean {
    this.initialize();
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.transactions.splice(index, 1);
    return true;
  }

  // Helper methods
  getUnitWithDetails(unitId: string) {
    this.initialize();
    const unit = this.getUnit(unitId);
    if (!unit) return null;

    const tenant = this.getTenantByUnit(unitId);
    const maintenanceRequests = this.maintenanceRequests.filter(r => r.unit_id === unitId);

    return {
      ...unit,
      tenant,
      maintenanceRequests
    };
  }

  getTenantWithUnit(tenantId: string) {
    this.initialize();
    const tenant = this.getTenant(tenantId);
    if (!tenant) return null;

    const unit = tenant.unit_id ? this.getUnit(tenant.unit_id) : null;

    return {
      ...tenant,
      unit_number: unit?.unit_number || null
    };
  }

  getMaintenanceRequestWithUnit(requestId: string) {
    this.initialize();
    const request = this.getMaintenanceRequest(requestId);
    if (!request) return null;

    const unit = this.getUnit(request.unit_id);

    return {
      ...request,
      unit_number: unit?.unit_number || null
    };
  }

  // Statistics methods
  getPropertyStats(propertyId: string) {
    this.initialize();
    const units = this.getUnits(propertyId);
    const tenants = this.tenants.filter(t => {
      if (!t.unit_id) return false;
      const unit = this.getUnit(t.unit_id);
      return unit?.property_id === propertyId;
    });
    const maintenanceRequests = this.getMaintenanceRequests(propertyId);

    return {
      totalUnits: units.length,
      occupiedUnits: units.filter(u => u.status === 'occupied').length,
      availableUnits: units.filter(u => u.status === 'available').length,
      maintenanceUnits: units.filter(u => u.status === 'maintenance').length,
      totalTenants: tenants.length,
      pendingMaintenance: maintenanceRequests.filter(r => r.status === 'pending').length,
      inProgressMaintenance: maintenanceRequests.filter(r => r.status === 'in-progress').length,
      scheduledMaintenance: maintenanceRequests.filter(r => r.status === 'scheduled').length,
      completedMaintenance: maintenanceRequests.filter(r => r.status === 'completed').length,
      monthlyRevenue: tenants.reduce((sum, t) => sum + t.rent_amount, 0)
    };
  }
}

// Create a singleton instance
export const mockDataStore = new MockDataStore();