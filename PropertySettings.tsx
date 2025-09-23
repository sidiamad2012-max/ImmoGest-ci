import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Building2, Bell, Shield, CreditCard, Users, Mail } from "lucide-react";

export function PropertySettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres de la Propriété</h1>
        <p className="text-muted-foreground">Gérez les informations de votre propriété et les préférences de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Informations de la Propriété</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyName">Nom de la Propriété</Label>
                  <Input id="propertyName" defaultValue="Résidence Les Palmiers" />
                </div>
                <div>
                  <Label htmlFor="propertyType">Type de Propriété</Label>
                  <Select defaultValue="apartment">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Complexe d'Appartements</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="house">Maison Individuelle</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" defaultValue="Boulevard Lagunaire, Cocody, Abidjan, Côte d'Ivoire" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalUnits">Nombre d'Unités</Label>
                  <Input id="totalUnits" type="number" defaultValue="12" />
                </div>
                <div className="flex flex-col justify-start">
                  <Label htmlFor="yearBuilt">Année de Construction</Label>
                  <Input id="yearBuilt" type="number" defaultValue="2018" className="h-10" />
                </div>
                <div>
                  <Label htmlFor="squareFootage">Superficie (m²)</Label>
                  <Input id="squareFootage" type="number" defaultValue="850" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description de la Propriété</Label>
                <Textarea 
                  id="description" 
                  defaultValue="Résidence moderne avec équipements mis à jour, proche du centre-ville et des transports en commun à Abidjan."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Paramètres de Notification</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications Email</p>
                  <p className="text-sm text-muted-foreground">Recevoir les mises à jour par email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Demandes de Maintenance</p>
                  <p className="text-sm text-muted-foreground">Être notifié des nouvelles demandes de maintenance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Retards de Paiement</p>
                  <p className="text-sm text-muted-foreground">Alerte quand les paiements de loyer sont en retard</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rappels d'Expiration de Bail</p>
                  <p className="text-sm text-muted-foreground">Me rappeler 60 jours avant l'expiration du bail</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rapports Mensuels</p>
                  <p className="text-sm text-muted-foreground">Recevoir les résumés financiers mensuels</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Rental Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Paramètres de Location</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lateFee">Pénalité de Retard (FCFA)</Label>
                  <Input id="lateFee" type="number" defaultValue="25000" />
                </div>
                <div>
                  <Label htmlFor="gracePeriod">Période de Grâce (jours)</Label>
                  <Input id="gracePeriod" type="number" defaultValue="5" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="securityDeposit">Dépôt de Garantie Standard (FCFA)</Label>
                  <Input id="securityDeposit" type="number" defaultValue="600000" />
                </div>
                <div className="flex flex-col pt-1">
                  <Label htmlFor="petDeposit">Dépôt pour Animaux (FCFA)</Label>
                  <Input id="petDeposit" type="number" defaultValue="150000" />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentMethods">Modes de Paiement Acceptés</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Virement Bancaire</Badge>
                  <Badge variant="outline">Mobile Money</Badge>
                  <Badge variant="outline">Espèces</Badge>
                  <Badge variant="outline">Portail en Ligne</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Informations de Contact</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownerName">Propriétaire</Label>
                <Input id="ownerName" defaultValue="Sidibe Sita" />
              </div>
              <div>
                <Label htmlFor="ownerEmail">Email</Label>
                <Input id="ownerEmail" type="email" defaultValue="sidibe.sita@email.com" />
              </div>
              <div>
                <Label htmlFor="ownerPhone">Téléphone</Label>
                <Input id="ownerPhone" defaultValue="+225 07 89 12 34 56" />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Contact d'Urgence</Label>
                <Input id="emergencyContact" defaultValue="+225 05 67 89 01 23" />
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Paramètres du Compte</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentification à Deux Facteurs</p>
                  <p className="text-sm text-muted-foreground">Ajouter une sécurité supplémentaire à votre compte</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sauvegarde Automatique</p>
                  <p className="text-sm text-muted-foreground">Sauvegarder automatiquement les modifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                Changer le Mot de Passe
              </Button>
              <Button variant="outline" className="w-full">
                Télécharger les Données
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Statistiques Rapides</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Compte Créé</span>
                <span className="text-sm">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Locataires</span>
                <span className="text-sm">10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Baux Actifs</span>
                <span className="text-sm">10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Demandes de Maintenance</span>
                <span className="text-sm">4 en attente</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Rétablir les Défauts</Button>
        <Button>Sauvegarder les Modifications</Button>
      </div>
    </div>
  );
}