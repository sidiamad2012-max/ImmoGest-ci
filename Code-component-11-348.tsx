import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { User, Home, Calendar, Phone, Mail, CreditCard } from "lucide-react";
import { useUserRole } from "../../contexts/UserRoleContext";

export function TenantProfile() {
  const { userData } = useUserRole();
  const tenantData = userData.tenant;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mon Profil</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Locataire Actif
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground text-2xl font-bold">
                {tenantData.initials}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{tenantData.name}</h2>
            <p className="text-muted-foreground">{tenantData.apartment}</p>
            <Badge className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
              Résidence Les Palmiers
            </Badge>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Début du bail</p>
                <p className="text-sm text-muted-foreground">1er Janvier 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <CreditCard className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Loyer mensuel</p>
                <p className="text-sm text-muted-foreground">
                  {tenantData.rentAmount.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Informations Personnelles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input id="fullName" defaultValue={tenantData.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={tenantData.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" defaultValue={tenantData.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact d'urgence</Label>
              <Input id="emergencyContact" defaultValue="+225 01 23 45 67 89" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Profession</Label>
              <Input id="occupation" defaultValue="Enseignante" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workplace">Lieu de travail</Label>
              <Input id="workplace" defaultValue="École Primaire Cocody" />
            </div>
          </div>
          
          <Button className="mt-6">
            Mettre à jour les informations
          </Button>
        </Card>
      </div>

      {/* Lease Information */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Home className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Informations du Bail</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Appartement</Label>
              <p className="text-lg font-semibold">{tenantData.apartment}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Type de logement</Label>
              <p>Appartement 2 chambres</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Surface</Label>
              <p>75 m²</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Début du bail</Label>
              <p>1er Janvier 2024</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Fin du bail</Label>
              <p>31 Décembre 2024</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Dépôt de garantie</Label>
              <p>360,000 FCFA</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Loyer mensuel</Label>
              <p className="text-lg font-semibold text-green-600">
                {tenantData.rentAmount.toLocaleString()} FCFA
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Charges incluses</Label>
              <p>Eau, Électricité, Internet</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                Actif
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Property Information */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Home className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Informations de la Propriété</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Adresse</h4>
            <p>Résidence Les Palmiers</p>
            <p>Quartier Cocody</p>
            <p>Abidjan, Côte d'Ivoire</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Contact Propriétaire</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Sidibe Sita</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>+225 07 89 12 34 56</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>sidibe.sita@email.com</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}