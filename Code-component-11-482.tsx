import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CreditCard, Download, Calendar, Receipt } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";

export function TenantPayments() {
  const { userData } = useUserRole();
  const tenantData = userData.tenant;

  const paymentHistory = [
    {
      id: 1,
      month: "Décembre 2024",
      amount: 180000,
      dueDate: "2024-12-01",
      paidDate: "2024-12-01",
      status: "Payé",
      method: "Virement bancaire"
    },
    {
      id: 2,
      month: "Novembre 2024",
      amount: 180000,
      dueDate: "2024-11-01",
      paidDate: "2024-11-02",
      status: "Payé",
      method: "Mobile Money"
    },
    {
      id: 3,
      month: "Octobre 2024",
      amount: 180000,
      dueDate: "2024-10-01",
      paidDate: "2024-09-30",
      status: "Payé",
      method: "Espèces"
    },
    {
      id: 4,
      month: "Septembre 2024",
      amount: 180000,
      dueDate: "2024-09-01",
      paidDate: "2024-09-03",
      status: "Payé (Retard)",
      method: "Virement bancaire",
      lateFee: 5000
    }
  ];

  const upcomingPayment = {
    month: "Janvier 2025",
    amount: 180000,
    dueDate: "2025-01-01",
    daysUntilDue: 20
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payé":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Payé</Badge>;
      case "Payé (Retard)":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Payé (Retard)</Badge>;
      case "En retard":
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes Paiements</h1>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Télécharger reçus
        </Button>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Loyer Mensuel</h3>
          </div>
          <p className="text-2xl font-bold">{tenantData.rentAmount.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground">{tenantData.apartment}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold">Prochain Paiement</h3>
          </div>
          <p className="text-xl font-bold">{upcomingPayment.dueDate}</p>
          <p className="text-sm text-muted-foreground">
            Dans {upcomingPayment.daysUntilDue} jours
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Receipt className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold">Total Payé 2024</h3>
          </div>
          <p className="text-2xl font-bold">2,165,000 FCFA</p>
          <p className="text-sm text-green-600">12 paiements effectués</p>
        </Card>
      </div>

      {/* Upcoming Payment */}
      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-orange-900">
              Paiement à Venir - {upcomingPayment.month}
            </h3>
            <p className="text-orange-700">
              Montant: {upcomingPayment.amount.toLocaleString()} FCFA
            </p>
            <p className="text-sm text-orange-600">
              Échéance: {upcomingPayment.dueDate} (dans {upcomingPayment.daysUntilDue} jours)
            </p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Payer maintenant
          </Button>
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historique des Paiements</h3>
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold">{payment.month}</h4>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <span>Échéance: {payment.dueDate}</span>
                  <span>Payé le: {payment.paidDate}</span>
                  <span>Méthode: {payment.method}</span>
                </div>
                {payment.lateFee && (
                  <p className="text-sm text-orange-600 mt-1">
                    Frais de retard: {payment.lateFee.toLocaleString()} FCFA
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-bold">
                  {payment.amount.toLocaleString()} FCFA
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Download className="w-3 h-3 mr-1" />
                  Reçu
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Moyens de Paiement Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold">Virement Bancaire</h4>
            <p className="text-sm text-muted-foreground">
              Compte: CI001234567890
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">MM</span>
            </div>
            <h4 className="font-semibold">Mobile Money</h4>
            <p className="text-sm text-muted-foreground">
              Orange Money / MTN
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">€</span>
            </div>
            <h4 className="font-semibold">Espèces</h4>
            <p className="text-sm text-muted-foreground">
              En personne uniquement
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}