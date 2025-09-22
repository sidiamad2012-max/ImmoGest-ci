import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Home, CreditCard, AlertCircle, Calendar, Phone, Mail } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";
import { useNavigation } from "../../contexts/NavigationContext";

export function TenantDashboard() {
  const { userData } = useUserRole();
  const { setActiveSection } = useNavigation();
  const tenantData = userData.tenant;

  const handleViewPaymentHistory = () => {
    setActiveSection('payments');
  };

  const handlePayNow = () => {
    setActiveSection('payments');
  };

  const handleNewMaintenanceRequest = () => {
    setActiveSection('maintenance');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mon Tableau de Bord</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Locataire Actif
        </Badge>
      </div>

      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900">
              Bienvenue, {tenantData.name}
            </h2>
            <p className="text-blue-700">{tenantData.apartment} - Résidence Les Palmiers</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Rent Status */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Statut du Loyer</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Loyer mensuel</p>
            <p className="text-2xl font-bold text-green-600">
              {tenantData.rentAmount.toLocaleString()} FCFA
            </p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Payé - Décembre 2024
            </Badge>
          </div>
          <Button 
            className="w-full min-w-0 py-3 px-6 h-auto text-center whitespace-normal" 
            variant="outline"
            onClick={handleViewPaymentHistory}
          >
            Voir l'historique des paiements
          </Button>
        </Card>

        {/* Next Payment */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Prochain Paiement</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Échéance</p>
            <p className="text-xl font-bold">1er Janvier 2025</p>
            <p className="text-sm text-orange-600">Dans 20 jours</p>
          </div>
          <Button 
            className="w-full mt-4"
            onClick={handlePayNow}
          >
            Payer maintenant
          </Button>
        </Card>

        {/* Maintenance Requests */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Maintenance</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Demandes actives</p>
            <p className="text-2xl font-bold">1</p>
            <p className="text-sm text-blue-600">Réparation robinet - En cours</p>
          </div>
          <Button 
            className="w-full mt-4" 
            variant="outline"
            onClick={handleNewMaintenanceRequest}
          >
            Nouvelle demande
          </Button>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activités Récentes</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-4 h-4 text-green-600" />
              <div>
                <p className="font-medium">Paiement de loyer effectué</p>
                <p className="text-sm text-muted-foreground">1er Décembre 2024</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Confirmé
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <div>
                <p className="font-medium">Demande de maintenance soumise</p>
                <p className="text-sm text-muted-foreground">28 Novembre 2024</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              En cours
            </Badge>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Propriétaire</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <Phone className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-medium">Sidibe Sita</p>
              <p className="text-sm text-muted-foreground">+225 07 89 12 34 56</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <Mail className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">sidibe.sita@email.com</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}