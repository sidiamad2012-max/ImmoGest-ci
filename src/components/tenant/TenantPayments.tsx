import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { CreditCard, Download, Calendar, Receipt, CheckCircle, Copy, Phone, AlertCircle } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";
import { useState } from "react";

export function TenantPayments() {
  const { userData } = useUserRole();
  const tenantData = userData.tenant;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Select method, 2: Payment details, 3: Confirmation

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

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentStep(2);
  };

  const handlePaymentSubmit = () => {
    setPaymentStep(3);
  };

  const handlePaymentComplete = () => {
    setPaymentDialogOpen(false);
    setPaymentStep(1);
    setSelectedPaymentMethod("");
    // Here you would typically update the payment status
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderPaymentDialog = () => {
    if (paymentStep === 1) {
      return (
        <div className="space-y-4">
          <h4 className="font-semibold">Choisissez votre méthode de paiement</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start"
              onClick={() => handlePaymentMethodSelect("mobile_money")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">MM</span>
                </div>
                <div>
                  <p className="font-semibold">Mobile Money</p>
                  <p className="text-sm text-muted-foreground">Orange Money, MTN Money, Moov Money</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start"
              onClick={() => handlePaymentMethodSelect("bank_transfer")}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-10 h-10 text-blue-600" />
                <div>
                  <p className="font-semibold">Virement Bancaire</p>
                  <p className="text-sm text-muted-foreground">Virement direct vers le compte du propriétaire</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start"
              onClick={() => handlePaymentMethodSelect("cash")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">€</span>
                </div>
                <div>
                  <p className="font-semibold">Paiement en Espèces</p>
                  <p className="text-sm text-muted-foreground">Remise en main propre au propriétaire</p>
                </div>
              </div>
            </Button>
          </div>
        </div>
      );
    }

    if (paymentStep === 2) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaymentStep(1)}
            >
              ← Retour
            </Button>
            <h4 className="font-semibold">Détails du paiement</h4>
          </div>

          {selectedPaymentMethod === "mobile_money" && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Paiement Mobile Money</h5>
                <p className="text-sm text-green-700">
                  Suivez les instructions pour effectuer votre paiement via Mobile Money
                </p>
              </div>
              
              <div>
                <Label>Opérateur Mobile Money</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre opérateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orange">Orange Money</SelectItem>
                    <SelectItem value="mtn">MTN Money</SelectItem>
                    <SelectItem value="moov">Moov Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Numéro de destination</Label>
                <div className="flex items-center space-x-2">
                  <Input value="+225 07 89 12 34 56" readOnly />
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("+225 07 89 12 34 56")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Montant à envoyer</Label>
                <Input value={`${upcomingPayment.amount.toLocaleString()} FCFA`} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Votre numéro de téléphone</Label>
                <Input placeholder="+225 XX XX XX XX XX" />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Tapez *144# sur votre téléphone et suivez les instructions pour envoyer l'argent.
                </p>
              </div>
            </div>
          )}

          {selectedPaymentMethod === "bank_transfer" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">Virement Bancaire</h5>
                <p className="text-sm text-blue-700">
                  Effectuez un virement vers le compte bancaire du propriétaire
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Nom du bénéficiaire:</span>
                  <span className="font-medium">Résidence Les Palmiers</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Numéro de compte:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">CI001234567890</span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard("CI001234567890")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Banque:</span>
                  <span className="font-medium">Société Générale Côte d'Ivoire</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Montant:</span>
                  <span className="font-medium">{upcomingPayment.amount.toLocaleString()} FCFA</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Référence:</span>
                  <span className="font-medium">LOYER-{tenantData.apartment}-JAN2025</span>
                </div>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  N'oubliez pas d'inclure la référence dans votre virement pour un traitement rapide.
                </p>
              </div>
            </div>
          )}

          {selectedPaymentMethod === "cash" && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-2">Paiement en Espèces</h5>
                <p className="text-sm text-gray-700">
                  Contactez le propriétaire pour convenir d'un rendez-vous
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Contact propriétaire:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">+225 05 67 89 01 23</span>
                    <Button size="sm" variant="outline" onClick={() => window.open("tel:+22505678901 23")}>
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Montant exact:</span>
                  <span className="font-medium">{upcomingPayment.amount.toLocaleString()} FCFA</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Adresse:</span>
                  <span className="font-medium">Boulevard Lagunaire, Cocody</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Demandez un reçu lors du paiement en espèces.
                </p>
              </div>
            </div>
          )}

          <Separator />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPaymentStep(1)}>
              Retour
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Confirmer le paiement
            </Button>
          </div>
        </div>
      );
    }

    if (paymentStep === 3) {
      return (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h4 className="text-lg font-semibold">Instructions de paiement envoyées</h4>
          <p className="text-muted-foreground">
            Vos instructions de paiement ont été confirmées. 
            {selectedPaymentMethod === "mobile_money" && " Effectuez maintenant le transfert Mobile Money."}
            {selectedPaymentMethod === "bank_transfer" && " Effectuez maintenant le virement bancaire."}
            {selectedPaymentMethod === "cash" && " Contactez le propriétaire pour convenir d'un rendez-vous."}
          </p>
          <p className="text-sm text-muted-foreground">
            Votre paiement sera confirmé automatiquement une fois reçu.
          </p>
          <Button onClick={handlePaymentComplete} className="w-full">
            Terminé
          </Button>
        </div>
      );
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
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setPaymentDialogOpen(true)}>
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payer le loyer - {upcomingPayment.month}</DialogTitle>
            <DialogDescription>
              Montant: {upcomingPayment.amount.toLocaleString()} FCFA
            </DialogDescription>
          </DialogHeader>
          {renderPaymentDialog()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
