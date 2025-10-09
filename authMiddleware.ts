import { authService } from '../auth/supabaseAuth';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  role: 'landlord' | 'tenant' | null;
  loading: boolean;
}

export class AuthMiddleware {
  private static instance: AuthMiddleware;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    role: null,
    loading: true
  };

  private constructor() {}

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  // Initialiser l'état d'authentification
  async initialize(): Promise<AuthState> {
    try {
      const user = await authService.getCurrentUser();
      
      if (user) {
        const { data: profile } = await authService.getUserProfile(user.id);
        
        this.authState = {
          isAuthenticated: true,
          user: profile,
          role: profile?.role || null,
          loading: false
        };
      } else {
        this.authState = {
          isAuthenticated: false,
          user: null,
          role: null,
          loading: false
        };
      }
    } catch (error) {
      console.error('Erreur initialisation auth:', error);
      this.authState = {
        isAuthenticated: false,
        user: null,
        role: null,
        loading: false
      };
    }

    return this.authState;
  }

  // Vérifier si l'utilisateur est autorisé à accéder à une ressource
  isAuthorized(requiredRole?: 'landlord' | 'tenant', resourceOwnerId?: string): boolean {
    if (!this.authState.isAuthenticated) {
      return false;
    }

    // Vérification du rôle si requis
    if (requiredRole && this.authState.role !== requiredRole) {
      return false;
    }

    // Vérification de la propriété de la ressource si requis
    if (resourceOwnerId && this.authState.user?.id !== resourceOwnerId) {
      return false;
    }

    return true;
  }

  // Vérifier si l'utilisateur peut accéder aux données d'un locataire
  canAccessTenantData(tenantId: string): boolean {
    if (!this.authState.isAuthenticated) return false;

    // Le locataire peut accéder à ses propres données
    if (this.authState.role === 'tenant' && this.authState.user?.id === tenantId) {
      return true;
    }

    // Le propriétaire peut accéder aux données de ses locataires
    if (this.authState.role === 'landlord') {
      // Cette vérification devrait être faite côté serveur en vérifiant la relation
      // propriétaire-locataire dans la base de données
      return true;
    }

    return false;
  }

  // Vérifier si l'utilisateur peut modifier des données de propriété
  canModifyProperty(propertyId: string): boolean {
    if (!this.authState.isAuthenticated) return false;

    // Seuls les propriétaires peuvent modifier les propriétés
    if (this.authState.role !== 'landlord') return false;

    // Vérification supplémentaire côté serveur nécessaire
    return true;
  }

  // Nettoyer les données sensibles avant envoi au client
  sanitizeUserData(userData: any): any {
    if (!userData) return null;

    const {
      password,
      reset_token,
      email_verified,
      ...sanitizedData
    } = userData;

    return sanitizedData;
  }

  // Valider les permissions pour les opérations CRUD
  validatePermissions(operation: 'create' | 'read' | 'update' | 'delete', resource: string, data?: any): boolean {
    if (!this.authState.isAuthenticated) return false;

    switch (resource) {
      case 'property':
        return this.authState.role === 'landlord';
      
      case 'unit':
        if (operation === 'read') {
          return true; // Lecture autorisée selon les politiques RLS
        }
        return this.authState.role === 'landlord';
      
      case 'tenant':
        if (operation === 'read' && this.authState.role === 'tenant') {
          return data?.id === this.authState.user?.id;
        }
        return this.authState.role === 'landlord';
      
      case 'maintenance':
        if (operation === 'create' || operation === 'read') {
          return true; // Création et lecture autorisées selon les politiques RLS
        }
        return this.authState.role === 'landlord';
      
      case 'transaction':
        return this.authState.role === 'landlord';
      
      default:
        return false;
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  updateAuthState(newState: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...newState };
  }
}

export const authMiddleware = AuthMiddleware.getInstance();