import { useState, useEffect, Suspense, lazy } from "react";
import { SupabaseAuthProvider, useSupabaseAuth } from "./contexts/SupabaseAuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { AuthLogin } from "./components/auth/AuthLogin";
import { SimpleLoader } from "./components/SimpleLoader";
import { Sidebar } from "./components/Sidebar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SEOHead } from "./components/SEOHead";
import { Toaster } from "./components/ui/sonner";
import { PerformanceDashboard } from "./components/ui/performance-dashboard";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import { initializeApp } from "./lib/initialization";
import { motion, AnimatePresence } from "motion/react";

// Lazy load heavy components to prevent timeout
const PropertyOverview = lazy(() => import("./components/PropertyOverview").then(m => ({ default: m.PropertyOverview })));
const PropertyManagement = lazy(() => import("./components/PropertyManagement").then(m => ({ default: m.PropertyManagement })));
const UnitsInventory = lazy(() => import("./components/UnitsInventory").then(m => ({ default: m.UnitsInventory })));
const TenantManagement = lazy(() => import("./components/TenantManagement").then(m => ({ default: m.TenantManagement })));
const MaintenanceTracker = lazy(() => import("./components/MaintenanceTracker").then(m => ({ default: m.MaintenanceTracker })));
const FinancialDashboard = lazy(() => import("./components/FinancialDashboard").then(m => ({ default: m.FinancialDashboard })));
const PropertySettings = lazy(() => import("./components/PropertySettings").then(m => ({ default: m.PropertySettings })));
const TenantDashboard = lazy(() => import("./components/tenant/TenantDashboard").then(m => ({ default: m.TenantDashboard })));
const TenantMaintenance = lazy(() => import("./components/tenant/TenantMaintenance").then(m => ({ default: m.TenantMaintenance })));
const TenantPayments = lazy(() => import("./components/tenant/TenantPayments").then(m => ({ default: m.TenantPayments })));
const TenantProfile = lazy(() => import("./components/tenant/TenantProfile").then(m => ({ default: m.TenantProfile })));
const ProductionReadyValidator = lazy(() => import("./components/ProductionReadyValidator").then(m => ({ default: m.ProductionReadyValidator })));

type LandlordSection = 'overview' | 'properties' | 'units' | 'tenants' | 'maintenance' | 'finances' | 'settings' | 'validation';
type TenantSection = 'dashboard' | 'maintenance' | 'payments' | 'profile';
type ActiveSection = LandlordSection | TenantSection;

// Optimized loading component with enhanced animations
function ComponentLoader({ children, context }: { children: React.ReactNode, context?: string }) {
  return (
    <Suspense fallback={
      <motion.div 
        className="flex items-center justify-center h-full min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SimpleLoader message="Chargement du composant..." timeout={8000} />
      </motion.div>
    }>
      <AnimatePresence mode="wait">
        <motion.div
          key={context}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}

function AppContent() {
  const { isAuthenticated, loading, role, user } = useSupabaseAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize app (analytics, performance monitoring, etc.)
  useEffect(() => {
    initializeApp();
  }, []);

  // Track authentication events
  useEffect(() => {
    if (isAuthenticated && user && role) {
      import('./lib/analytics/analytics').then(({ trackImmoGestEvents, analytics }) => {
        trackImmoGestEvents.login(role);
        analytics.trackPageView(activeSection as string);
      }).catch(console.warn);
    }
  }, [isAuthenticated, user, role]);

  // Track page navigation
  useEffect(() => {
    if (isAuthenticated) {
      import('./lib/analytics/analytics').then(({ analytics }) => {
        analytics.trackPageView(activeSection as string);
      }).catch(console.warn);
    }
  }, [activeSection, isAuthenticated]);

  // Update default section when role changes
  useEffect(() => {
    if (role === 'tenant') {
      setActiveSection('dashboard');
    } else if (role === 'landlord') {
      setActiveSection('overview');
    }
  }, [role]);

  // Show loader during initialization with shorter timeout
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SimpleLoader message="Chargement de ImmoGest CI..." timeout={8000} />
      </motion.div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SEOHead 
          title="Connexion - ImmoGest CI"
          description="Connectez-vous à votre espace ImmoGest CI. Gestion immobilière moderne pour la Côte d'Ivoire."
        />
        <AuthLogin />
      </motion.div>
    );
  }

  // Optimized function to render main content with lazy loading
  const renderMainContent = () => {
    if (role === 'tenant') {
      switch (activeSection as TenantSection) {
        case 'dashboard':
          return (
            <ComponentLoader context="tenant-dashboard">
              <TenantDashboard />
            </ComponentLoader>
          );
        case 'maintenance':
          return (
            <ComponentLoader context="tenant-maintenance">
              <TenantMaintenance />
            </ComponentLoader>
          );
        case 'payments':
          return (
            <ComponentLoader context="tenant-payments">
              <TenantPayments />
            </ComponentLoader>
          );
        case 'profile':
          return (
            <ComponentLoader context="tenant-profile">
              <TenantProfile />
            </ComponentLoader>
          );
        default:
          return (
            <ComponentLoader context="tenant-dashboard">
              <TenantDashboard />
            </ComponentLoader>
          );
      }
    } else {
      // Landlord mode
      switch (activeSection as LandlordSection) {
        case 'overview':
          return (
            <ComponentLoader context="landlord-overview">
              <PropertyOverview />
            </ComponentLoader>
          );
        case 'properties':
          return (
            <ComponentLoader context="landlord-properties">
              <PropertyManagement />
            </ComponentLoader>
          );
        case 'units':
          return (
            <ComponentLoader context="landlord-units">
              <UnitsInventory />
            </ComponentLoader>
          );
        case 'tenants':
          return (
            <ComponentLoader context="landlord-tenants">
              <TenantManagement />
            </ComponentLoader>
          );
        case 'maintenance':
          return (
            <ComponentLoader context="landlord-maintenance">
              <MaintenanceTracker />
            </ComponentLoader>
          );
        case 'finances':
          return (
            <ComponentLoader context="landlord-finances">
              <FinancialDashboard />
            </ComponentLoader>
          );
        case 'settings':
          return (
            <ComponentLoader context="landlord-settings">
              <PropertySettings />
            </ComponentLoader>
          );
        case 'validation':
          return (
            <ComponentLoader context="landlord-validation">
              <ProductionReadyValidator />
            </ComponentLoader>
          );
        default:
          return (
            <ComponentLoader context="landlord-overview">
              <PropertyOverview />
            </ComponentLoader>
          );
      }
    }
  };

  return (
    <NavigationProvider activeSection={activeSection} setActiveSection={setActiveSection}>
      <SEOHead 
        section={activeSection}
        title={`${role === 'landlord' ? 'Propriétaire' : 'Locataire'} - ImmoGest CI`}
      />
      
      <motion.div 
        className="flex h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sidebar */}
        <ErrorBoundary>
          <Sidebar
            activeSection={activeSection}
            setActiveSection={(section) => {
              setActiveSection(section);
              // Track navigation
              import('./lib/analytics/analytics').then(({ trackImmoGestEvents }) => {
                trackImmoGestEvents.featureUsed(section, role || 'unknown');
              }).catch(console.warn);
            }}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
        </ErrorBoundary>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <motion.div 
            className="flex items-center justify-between p-4 border-b border-border lg:hidden"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-lg font-semibold">ImmoGest CI</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSidebarOpen(true);
                import('./lib/analytics/analytics').then(({ trackImmoGestEvents }) => {
                  trackImmoGestEvents.mobileMenuUsed();
                }).catch(console.warn);
              }}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </motion.div>
          
          {/* Main content with error boundary and optimized loading */}
          <main className="flex-1 overflow-auto">
            <ErrorBoundary>
              {renderMainContent()}
            </ErrorBoundary>
          </main>
        </div>
      </motion.div>
    </NavigationProvider>
  );
}

export default function App() {
  // Ensure viewport meta tag is present for responsivity
  useEffect(() => {
    try {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        document.head.appendChild(viewport);
      } else {
        // Update existing viewport if not optimal
        const currentContent = viewport.getAttribute('content');
        if (!currentContent?.includes('width=device-width') || !currentContent?.includes('initial-scale=1.0')) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
      }
    } catch (error) {
      console.warn('Error setting viewport:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SupabaseAuthProvider>
          <AppContent />
          <Toaster />
          <PerformanceDashboard />
        </SupabaseAuthProvider>
      </div>
    </ErrorBoundary>
  );
}
