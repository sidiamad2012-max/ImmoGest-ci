import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'landlord' | 'tenant';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userData: {
    landlord: {
      name: string;
      initials: string;
      email: string;
      phone: string;
    };
    tenant: {
      name: string;
      initials: string;
      email: string;
      phone: string;
      apartment: string;
      rentAmount: number;
    };
  };
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('landlord');

  const userData = {
    landlord: {
      name: 'Sidibe Sita',
      initials: 'SS',
      email: 'sidibe.sita@email.com',
      phone: '+225 07 89 12 34 56'
    },
    tenant: {
      name: 'Kone Aminata',
      initials: 'KA',
      email: 'kone.aminata@email.com',
      phone: '+225 05 67 89 01 23',
      apartment: 'Appartement 2B',
      rentAmount: 180000
    }
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, userData }}>
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