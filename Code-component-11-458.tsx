import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Search, Plus, Phone, Mail, Calendar, DollarSign } from "lucide-react";

interface Tenant {
  id: number;
  name: string;
  unit: string;
  email: string;
  phone: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'late' | 'notice';
  avatar?: string;
}

const mockTenants: Tenant[] = [
  {
    id: 1,
    name: "Awa Traoré",
    unit: "1A",
    email: "awa.traore@email.com",
    phone: "+225 07 12 34 56 78",
    rentAmount: 720000,
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    status: "active"
  },
  {
    id: 2,
    name: "Kouadio Michel",
    unit: "2B",
    email: "k.michel@email.com",
    phone: "+225 05 98 76 54 32",
    rentAmount: 810000,
    leaseStart: "2024-03-15",
    leaseEnd: "2025-03-14",
    status: "late"
  },
  {
    id: 3,
    name: "Fatou Bamba",
    unit: "3C",
    email: "fatou.bamba@email.com",
    phone: "+225 01 45 67 89 01",
    rentAmount: 690000,
    leaseStart: "2024-06-01",
    leaseEnd: "2025-05-31",
    status: "active"
  },
  {
    id: 4,
    name: "Jean-Baptiste Yao",
    unit: "4A",
    email: "jb.yao@email.com",
    phone: "+225 07 23 45 67 89",
    rentAmount: 840000,
    leaseStart: "2024-02-01",
    leaseEnd: "2024-12-31",
    status: "notice"
  }
];

export function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'late': return 'destructive';
      case 'notice': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Locataires</h1>
          <p className="text-muted-foreground">Gérez vos locataires et contrats de bail</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Locataire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter Nouveau Locataire</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un nouveau locataire à votre propriété.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom Complet</Label>
                  <Input id="name" placeholder="Entrer le nom complet" />
                </div>
                <div>
                  <Label htmlFor="unit">Logement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner logement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5A">5A</SelectItem>
                      <SelectItem value="5B">5B</SelectItem>
                      <SelectItem value="6A">6A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Entrer l'email" />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="Entrer le numéro" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">Loyer Mensuel (FCFA)</Label>
                  <Input id="rent" type="number" placeholder="Montant du loyer" />
                </div>
                <div>
                  <Label htmlFor="deposit">Caution (FCFA)</Label>
                  <Input id="deposit" type="number" placeholder="Montant de la caution" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leaseStart">Début du Bail</Label>
                  <Input id="leaseStart" type="date" />
                </div>
                <div>
                  <Label htmlFor="leaseEnd">Fin du Bail</Label>
                  <Input id="leaseEnd" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Notes supplémentaires..." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Annuler</Button>
                <Button>Ajouter Locataire</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher locataires..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous Statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="late">Retard Paiement</SelectItem>
            <SelectItem value="notice">Préavis Donné</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">
                    {tenant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">Logement {tenant.unit}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(tenant.status)}>
                {tenant.status === 'active' ? 'actif' : 
                 tenant.status === 'late' ? 'retard' : 'préavis'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tenant.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tenant.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tenant.rentAmount.toLocaleString()} FCFA/mois</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                Contacter
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Voir Détails
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun locataire trouvé correspondant à vos critères.</p>
        </div>
      )}
    </div>
  );
}