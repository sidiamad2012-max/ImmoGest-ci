import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'landlord' | 'tenant';

interface LandlordData {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
}

interface TenantData {
  name: string;
  email: string;
  phone: string;
  apartment: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  emergencyContact: string;
  status: 'active' | 'late' | 'notice';
  deposit?: number;
  notes?: string;
}

interface UserData {
  landlord: LandlordData;
  tenant: TenantData;
}

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userData: UserData;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (userData: SignUpData) => Promise<boolean>;
  canSwitchRole: boolean;
  userType: 'owner' | 'tenant';
  addTenant: (tenantData: NewTenantData) => Promise<boolean>;
  getAllTenants: () => Tenant[];
  updateTenantStatus: (tenantId: number, status: 'active' | 'late' | 'notice') => void;
  deleteTenant: (tenantId: number) => void;
}

interface Tenant {
  id: number;
  name: string;
  unit: string;
  email: string;
  phone: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'late' | 'notice';
  emergencyContact?: string;
  deposit?: number;
  notes?: string;
}

interface NewTenantData {
  name: string;
  unit: string;
  email: string;
  phone: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  emergencyContact?: string;
  deposit?: number;
  notes?: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  apartment: string;
  emergencyContact: string;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

// Mock tenant credentials - in production, this would come from a secure backend
const mockTenantCredentials = [
  { email: "awa.traore@email.com", password: "tenant123", tenantData: {
    name: "Awa Traoré",
    email: "awa.traore@email.com",
    phone: "+225 07 12 34 56 78",
    apartment: "1A",
    rentAmount: 180000,
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    emergencyContact: "+225 05 67 89 01 23",
    status: 'active' as const
  }},
  { email: "k.michel@email.com", password: "tenant123", tenantData: {
    name: "Kouadio Michel",
    email: "k.michel@email.com",
    phone: "+225 05 98 76 54 32",
    apartment: "2B",
    rentAmount: 180000,
    leaseStart: "2024-03-15",
    leaseEnd: "2025-03-14",
    emergencyContact: "+225 05 67 89 01 23",
    status: 'active' as const
  }},
  { email: "fatou.bamba@email.com", password: "tenant123", tenantData: {
    name: "Fatou Bamba",
    email: "fatou.bamba@email.com",
    phone: "+225 01 45 67 89 01",
    apartment: "3C",
    rentAmount: 180000,
    leaseStart: "2024-06-01",
    leaseEnd: "2025-05-31",
    emergencyContact: "+225 05 67 89 01 23",
    status: 'active' as const
  }}
];

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('landlord'); // Start with landlord by default
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'owner' | 'tenant'>('owner'); // Track actual user type
  const [currentTenantData, setCurrentTenantData] = useState<TenantData>({
    name: "Awa Traoré",
    email: "awa.traore@email.com",
    phone: "+225 07 12 34 56 78",
    apartment: "1A",
    rentAmount: 180000,
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    emergencyContact: "+225 05 67 89 01 23"
  });

  const userData: UserData = {
    landlord: {
      name: "Sidibe Sita",
      email: "sidibe.sita@email.com",
      phone: "+225 07 89 12 34 56",
      propertyName: "Résidence Les Palmiers"
    },
    tenant: currentTenantData
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (role === 'landlord') {
      // For landlord, we'll use a simple check (in production, this would be secure)
      if (email === "sidibe.sita@email.com" && password === "landlord123") {
        setIsAuthenticated(true);
        setUserType('owner');
        return true;
      }
    } else {
      // For tenants, check against mock credentials
      const tenant = mockTenantCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (tenant) {
        setCurrentTenantData(tenant.tenantData);
        setIsAuthenticated(true);
        setUserType('tenant');
        setRole('tenant'); // Force tenant role for actual tenants
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType('owner');
    setRole('landlord'); // Reset to landlord mode
    // Reset to default tenant data
    setCurrentTenantData({
      name: "Awa Traoré",
      email: "awa.traore@email.com",
      phone: "+225 07 12 34 56 78",
      apartment: "1A",
      rentAmount: 180000,
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      emergencyContact: "+225 05 67 89 01 23"
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    // Allow owners to switch between modes, but lock tenants to tenant mode
    if (userType === 'owner') {
      setRole(newRole);
    } else if (userType === 'tenant' && newRole === 'tenant') {
      setRole(newRole);
    }
    // Tenants cannot access landlord mode
  };

  const signUp = async (userData: SignUpData): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if tenant with this email already exists
    const existingTenant = mockTenantCredentials.find(
      cred => cred.email === userData.email
    );
    
    if (!existingTenant) {
      // Add new tenant to mock data
      mockTenantCredentials.push({
        email: userData.email,
        password: userData.password,
        tenantData: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          apartment: userData.apartment,
          rentAmount: 180000,
          leaseStart: "2024-01-01",
          leaseEnd: "2024-12-31",
          emergencyContact: userData.emergencyContact,
          status: 'active' as const
        }
      });
      return true;
    }
    
    return false;
  };

  const addTenant = async (tenantData: NewTenantData): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if tenant with this email already exists
    const existingTenant = mockTenantCredentials.find(
      cred => cred.email === tenantData.email
    );
    
    if (!existingTenant) {
      // Add new tenant to mock data
      mockTenantCredentials.push({
        email: tenantData.email,
        password: 'tenant123', // Default password
        tenantData: {
          name: tenantData.name,
          email: tenantData.email,
          phone: tenantData.phone,
          apartment: tenantData.unit,
          rentAmount: tenantData.rentAmount,
          leaseStart: tenantData.leaseStart,
          leaseEnd: tenantData.leaseEnd,
          emergencyContact: tenantData.emergencyContact || '',
          status: 'active' as const,
          deposit: tenantData.deposit,
          notes: tenantData.notes
        }
      });
      return true;
    }
    
    return false;
  };

  const getAllTenants = (): Tenant[] => {
    return mockTenantCredentials.map((cred, index) => ({
      id: index + 1,
      name: cred.tenantData.name,
      unit: cred.tenantData.apartment,
      email: cred.tenantData.email,
      phone: cred.tenantData.phone,
      rentAmount: cred.tenantData.rentAmount,
      leaseStart: cred.tenantData.leaseStart,
      leaseEnd: cred.tenantData.leaseEnd,
      status: cred.tenantData.status,
      emergencyContact: cred.tenantData.emergencyContact,
      deposit: cred.tenantData.deposit,
      notes: cred.tenantData.notes
    }));
  };

  const updateTenantStatus = (tenantId: number, status: 'active' | 'late' | 'notice') => {
    const tenant = mockTenantCredentials.find(
      cred => cred.email === getAllTenants()[tenantId - 1].email
    );
    
    if (tenant) {
      tenant.tenantData.status = status;
    }
  };

  const deleteTenant = (tenantId: number) => {
    const tenant = mockTenantCredentials.find(
      cred => cred.email === getAllTenants()[tenantId - 1].email
    );
    
    if (tenant) {
      mockTenantCredentials.splice(tenantId - 1, 1);
    }
  };

  const value = {
    role,
    setRole: handleRoleChange,
    userData,
    isAuthenticated,
    login,
    logout,
    signUp,
    canSwitchRole: userType === 'owner', // Only owners can switch roles
    userType,
    addTenant,
    getAllTenants,
    updateTenantStatus,
    deleteTenant
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}