import React from "react";
import { Building2, Users, Wrench, DollarSign, Settings, X, Home, CreditCard, User, ToggleLeft, ToggleRight, LogOut, ArrowLeft, MapPin } from "lucide-react";
import { useUserRole } from "../contexts/UserRoleContext";
import { SupabaseStatus } from '../components/SupabaseStatus';

type LandlordSection = 'overview' | 'units' | 'tenants' | 'maintenance' | 'finances' | 'settings';
type TenantSection = 'dashboard' | 'maintenance' | 'payments' | 'profile';
type ActiveSection = LandlordSection | TenantSection;

interface SidebarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const landlordNavigationItems = [
  { id: 'overview' as const, label: 'Aperçu Propriété', icon: Building2 },
  { id: 'units' as const, label: 'Inventaire Logements', icon: MapPin },
  { id: 'tenants' as const, label: 'Gestion Locataires', icon: Users },
  { id: 'maintenance' as const, label: 'Maintenance', icon: Wrench },
  { id: 'finances' as const, label: 'Finances', icon: DollarSign },
  { id: 'settings' as const, label: 'Paramètres', icon: Settings },
];

const tenantNavigationItems = [
  { id: 'dashboard' as const, label: 'Mon Tableau de Bord', icon: Home },
  { id: 'maintenance' as const, label: 'Maintenance', icon: Wrench },
  { id: 'payments' as const, label: 'Mes Paiements', icon: CreditCard },
  { id: 'profile' as const, label: 'Mon Profil', icon: User },
];

export function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }: SidebarProps) {
  const { role, setRole, userData, logout, canSwitchRole } = useUserRole();
  const currentUser = userData[role];
  const navigationItems = role === 'landlord' ? landlordNavigationItems : tenantNavigationItems;

  const handleRoleToggle = () => {
    const newRole = role === 'landlord' ? 'tenant' : 'landlord';
    setRole(newRole);
    // The activeSection will be updated by the useEffect in App.tsx
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleBackToRoleSelector = () => {
    localStorage.removeItem('hasSelectedRole');
    logout(); // This will trigger the role selector to show
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-xl font-semibold">ImmoGest CI</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-accent rounded-md lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle - only for development/testing and if canSwitchRole is true */}
        {canSwitchRole && (
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mode:</span>
              <button
                onClick={handleRoleToggle}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md transition-colors"
              >
                {role === 'landlord' ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Propriétaire</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Locataire</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as ActiveSection);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border space-y-3">
          {/* Supabase Status */}
          <div className="flex justify-center">
            <SupabaseStatus />
          </div>

          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm">{getInitials(currentUser.name)}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {role === 'landlord' ? 'Propriétaire' : 'Locataire'}
              </p>
            </div>
          </div>
          
          {/* Back to role selector - only for owners */}
          {canSwitchRole && (
            <button
              onClick={handleBackToRoleSelector}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Changer de mode</span>
            </button>
          )}
          
          {/* Logout button - always show for tenants, also show for owners */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Se déconnecter</span>
          </button>
        </div>
      </div>
    </>
  );
}
