import { createContext, useContext, ReactNode } from 'react';

type LandlordSection = 'overview' | 'units' | 'tenants' | 'maintenance' | 'finances' | 'settings';
type TenantSection = 'dashboard' | 'maintenance' | 'payments' | 'profile';
type ActiveSection = LandlordSection | TenantSection;

interface NavigationContextType {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ 
  children, 
  activeSection, 
  setActiveSection 
}: {
  children: ReactNode;
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}) {
  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}