import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Building2, User, Shield, Users } from "lucide-react";
import { useUserRole } from "../contexts/UserRoleContext";

export function RoleSelector() {
  const { setRole } = useUserRole();

  const handleRoleSelection = (selectedRole: 'landlord' | 'tenant') => {
    setRole(selectedRole);
    // Mark that user has selected a role
    localStorage.setItem('hasSelectedRole', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-full">
              <Building2 className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">ImmoGest CI</h1>
          <p className="text-muted-foreground text-lg">
            Plateforme de gestion immobilière - Résidence Les Palmiers
          </p>
          <p className="text-sm text-muted-foreground">
            Choisissez votre mode d'accès
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Owner/Landlord Option */}
          <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer group">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
                  <Shield className="w-12 h-12 text-slate-700" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Espace Propriétaire</h2>
                <p className="text-muted-foreground text-sm">
                  Gérez vos propriétés, locataires et finances
                </p>
              </div>

              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Gestion des locataires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Suivi de maintenance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Tableau de bord financier</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>Accès mode locataire</span>
                </div>
              </div>

              <Button 
                onClick={() => handleRoleSelection('landlord')}
                className="w-full bg-slate-800 hover:bg-slate-700"
                size="lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                Accéder en tant que Propriétaire
              </Button>
            </div>
          </Card>

          {/* Tenant Option */}
          <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer group">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <User className="w-12 h-12 text-blue-700" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Espace Locataire</h2>
                <p className="text-muted-foreground text-sm">
                  Accédez à vos informations de location
                </p>
              </div>

              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Tableau de bord personnel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Demandes de maintenance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Historique des paiements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>Gestion du profil</span>
                </div>
              </div>

              <Button 
                onClick={() => handleRoleSelection('tenant')}
                className="w-full"
                size="lg"
              >
                <User className="w-4 h-4 mr-2" />
                Accéder en tant que Locataire
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Card className="p-6 bg-muted/30">
            <div className="space-y-3">
              <h3 className="font-semibold">Résidence Les Palmiers</h3>
              <p className="text-sm text-muted-foreground">
                Boulevard Lagunaire, Cocody, Abidjan - Côte d'Ivoire
              </p>
              <div className="flex justify-center space-x-8 text-xs text-muted-foreground">
                <span>• 12 Appartements</span>
                <span>• Gardiennage 24h/24</span>
                <span>• Parking sécurisé</span>
              </div>
            </div>
          </Card>
          
          <p className="text-xs text-muted-foreground">
            Besoin d'aide ? Contactez la gestion au <span className="font-medium">+225 05 67 89 01 23</span>
          </p>
        </div>
      </div>
    </div>
  );
}
