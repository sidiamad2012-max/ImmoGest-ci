import { SupabaseAuthProvider, useSupabaseAuth } from "./contexts/SupabaseAuthContext";
import { AuthTest } from "./components/AuthTest";
import { AuthLogin } from "./components/auth/AuthLogin";
import { SimpleLoader } from "./components/SimpleLoader";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { isAuthenticated, loading } = useSupabaseAuth();

  // Afficher le loader pendant l'initialisation
  if (loading) {
    return <SimpleLoader message="Initialisation..." />;
  }

  // Si pas authentifié, afficher la page de login
  if (!isAuthenticated) {
    return <AuthLogin />;
  }

  // Si authentifié, afficher le test d'authentification
  return <AuthTest />;
}

export default function AppSimple() {
  return (
    <div className="min-h-screen bg-background">
      <SupabaseAuthProvider>
        <AppContent />
        <Toaster />
      </SupabaseAuthProvider>
    </div>
  );
}