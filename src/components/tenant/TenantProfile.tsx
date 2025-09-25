import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { User, Mail, Phone, Home, Calendar, DollarSign, Shield, LogOut, AlertCircle } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";

export function TenantProfile() {
  const { userData, logout } = useUserRole();
  const tenantData = userData.tenant;

  const handleLogout = () => {
    logout();
  };

  const leaseEndDate = new Date(tenantData.leaseEnd);
  const today = new Date();
  const daysUntilLeaseEnd = Math.ceil((leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isLeaseExpiringSoon = daysUntilLeaseEnd <= 60 && daysUntilLeaseEnd > 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et paramètres</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>
      </div>

      {/* Lease Status Alert */}
      {isLeaseExpiringSoon && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Votre bail expire dans {daysUntilLeaseEnd} jours. Veuillez contacter la gestion pour le renouvellement.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Informations Personnelles</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom Complet</Label>
                  <Input id="name" value={tenantData.name} readOnly />
                </div>
                <div>
                  <Label htmlFor="apartment">Logement</Label>
                  <Input id="apartment" value={tenantData.apartment} readOnly />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Adresse Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" value={tenantData.email} className="pl-10" readOnly />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Numéro de Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" value={tenantData.phone} className="pl-10" readOnly />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="emergency">Contact d'Urgence</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="emergency" value={tenantData.emergencyContact} className="pl-10" readOnly />
                </div>
              </div>
            </div>
          </Card>

          {/* Lease Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Home className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Informations du Bail</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loyer Mensuel</p>
                    <p className="text-lg font-semibold">{tenantData.rentAmount.toLocaleString()} FCFA</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Début du Bail</p>
                    <p className="font-medium">{new Date(tenantData.leaseStart).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant={daysUntilLeaseEnd <= 60 ? "destructive" : "outline"}>
                    {daysUntilLeaseEnd > 0 ? `${daysUntilLeaseEnd} jours restants` : 'Bail expiré'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fin du Bail</p>
                    <p className="font-medium">{new Date(tenantData.leaseEnd).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Security */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Sécurité du Compte</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Mot de Passe</p>
                  <p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Notifications Email</p>
                  <p className="text-sm text-muted-foreground">Recevoir les mises à jour par email</p>
                </div>
                <Badge variant="outline">Activé</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Home className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Ma Résidence</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nom de la propriété</p>
                <p className="font-medium">Résidence Les Palmiers</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">Boulevard Lagunaire, Cocody, Abidjan</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Mon logement</p>
                <p className="font-medium">Appartement {tenantData.apartment}</p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Contact Gestion</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Propriétaire</p>
                <p className="font-medium">Sidibe Sita</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">+225 05 67 89 01 23</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">sidibe.sita@email.com</p>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Phone className="w-4 h-4 mr-2" />
                Contacter
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Changer l'email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Changer le téléphone
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}