import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'landlord' | 'tenant';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  metadata?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signUpLandlord: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signUpTenant: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration pour détecter si on doit utiliser le mode mock
const USE_MOCK_MODE = true; // Forcer le mode mock pour éviter les erreurs Supabase

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized]);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      if (USE_MOCK_MODE) {
        console.log('🔄 Mode mock forcé - Supabase désactivé');
        setupMockAuth();
        return;
      }

      // Code Supabase désactivé pour éviter les erreurs
      // const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      // Fallback automatique vers le mode mock
      setupMockAuth();
      
    } catch (error) {
      console.error('Erreur initialisation auth:', error);
      setupMockAuth();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const setupMockAuth = () => {
    // Mode mock pour le développement
    console.log('🔄 Mode authentification mock activé');
    
    // Vérifier s'il y a une session mock sauvegardée
    const mockSession = localStorage.getItem('immogest_mock_session');
    if (mockSession) {
      try {
        const session = JSON.parse(mockSession);
        if (session.user && session.role) {
          setUser(session.user);
          setRole(session.role);
          setIsAuthenticated(true);
          console.log('📱 Session mock restaurée:', session.role);
          return;
        }
      } catch (error) {
        console.error('Erreur restoration session mock:', error);
        localStorage.removeItem('immogest_mock_session');
      }
    }
    
    // Pas de session sauvegardée
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  const loadUserProfile = async (userId: string) => {
    // Fonction désactivée en mode mock
    console.log('loadUserProfile désactivé en mode mock');
    return;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (USE_MOCK_MODE) {
        return handleMockSignIn(email);
      }

      // Code Supabase désactivé
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password
      // });
      
      // Fallback vers l'authentification mock
      return handleMockSignIn(email);
      
    } catch (error) {
      console.error('Erreur connexion:', error);
      return handleMockSignIn(email);
    } finally {
      setLoading(false);
    }
  };

  const handleMockSignIn = (email: string) => {
    // Authentification mock basée sur l'email
    const mockRole: UserRole = email.includes('landlord') || email.includes('proprietaire') 
      ? 'landlord' 
      : 'tenant';
    
    const mockUser: AuthUser = {
      id: `mock-${Date.now()}`,
      email: email,
      role: mockRole,
      metadata: {
        name: mockRole === 'landlord' ? 'Propriétaire Demo' : 'Locataire Demo',
        property_name: mockRole === 'landlord' ? 'Résidence Demo' : undefined,
        apartment: mockRole === 'tenant' ? 'A1' : undefined
      }
    };

    setUser(mockUser);
    setRole(mockRole);
    setIsAuthenticated(true);

    // Sauvegarder la session mock
    localStorage.setItem('immogest_mock_session', JSON.stringify({
      user: mockUser,
      role: mockRole
    }));

    console.log('✅ Connexion mock réussie:', mockRole);
    return { error: null };
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (USE_MOCK_MODE) {
        // Mode mock - nettoyage direct
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('immogest_mock_session');
        console.log('✅ Déconnexion mock réussie');
        return;
      }

      // Code Supabase désactivé
      // await supabase.auth.signOut();
      
      // Nettoyer l'état local
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('immogest_mock_session');
      
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('immogest_mock_session');
    } finally {
      setLoading(false);
    }
  };

  const signUpLandlord = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      // Pour le développement, créer directement un utilisateur mock
      console.log('📝 Inscription propriétaire (mode mock)');
      
      const mockUser: AuthUser = {
        id: `landlord-${Date.now()}`,
        email: email,
        role: 'landlord',
        metadata: {
          name: userData.name,
          property_name: userData.propertyName,
          phone: userData.phone
        }
      };

      setUser(mockUser);
      setRole('landlord');
      setIsAuthenticated(true);

      localStorage.setItem('immogest_mock_session', JSON.stringify({
        user: mockUser,
        role: 'landlord'
      }));

      return { error: null };
    } catch (error) {
      console.error('Erreur inscription propriétaire:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUpTenant = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      // Pour le développement, créer directement un utilisateur mock
      console.log('📝 Inscription locataire (mode mock)');
      
      const mockUser: AuthUser = {
        id: `tenant-${Date.now()}`,
        email: email,
        role: 'tenant',
        metadata: {
          name: userData.name,
          apartment: userData.apartment,
          phone: userData.phone,
          emergency_contact: userData.emergencyContact,
          status: 'approved' // Approuvé automatiquement en mode mock
        }
      };

      setUser(mockUser);
      setRole('tenant');
      setIsAuthenticated(true);

      localStorage.setItem('immogest_mock_session', JSON.stringify({
        user: mockUser,
        role: 'tenant'
      }));

      return { error: null };
    } catch (error) {
      console.error('Erreur inscription locataire:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Réinitialisation mot de passe (mode mock)');
      return { error: null };
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const updatedUser = { 
        ...user, 
        metadata: { ...user.metadata, ...updates } 
      };
      
      setUser(updatedUser);
      
      // Mettre à jour la session mock
      localStorage.setItem('immogest_mock_session', JSON.stringify({
        user: updatedUser,
        role: role
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return { error };
    }
  };

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    signIn,
    signOut,
    signUpLandlord,
    signUpTenant,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}