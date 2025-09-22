import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Home, Users, DollarSign, Calendar, Search, Filter, Plus, Edit, Eye, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface Unit {
  id: string;
  unitNumber: string;
  floor: string;
  type: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  description: string;
  amenities: string[];
  furnished: boolean;
  status: 'available' | 'occupied' | 'maintenance';
  tenant?: {
    name: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  };
  lastInspection?: string;
  nextInspection?: string;
}

export function UnitsInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | null>(null);

  // Mock data - dans une vraie application, cela viendrait d'une API
  const units: Unit[] = [
    {
      id: "1",
      unitNumber: "1A",
      floor: "rdc",
      type: "f2",
      surface: 65,
      bedrooms: 2,
      bathrooms: 1,
      rent: 180000,
      deposit: 360000,
      description: "Appartement lumineux avec balcon donnant sur jardin",
      amenities: ["wifi", "parking", "security"],
      furnished: false,
      status: "occupied",
      tenant: {
        name: "Awa Traoré",
        email: "awa.traore@email.com",
        phone: "+225 07 12 34 56 78",
        leaseStart: "2024-01-15",
        leaseEnd: "2025-01-14"
      },
      lastInspection: "2024-11-01",
      nextInspection: "2025-02-01"
    },
    {
      id: "2",
      unitNumber: "1B",
      floor: "rdc",
      type: "f1",
      surface: 45,
      bedrooms: 1,
      bathrooms: 1,
      rent: 120000,
      deposit: 240000,
      description: "Studio moderne avec kitchenette équipée",
      amenities: ["wifi", "ac", "security"],
      furnished: true,
      status: "available",
      lastInspection: "2024-11-15",
      nextInspection: "2025-01-15"
    },
    {
      id: "3",
      unitNumber: "2A",
      floor: "1",
      type: "f3",
      surface: 85,
      bedrooms: 3,
      bathrooms: 2,
      rent: 250000,
      deposit: 500000,
      description: "Grand appartement familial avec terrasse",
      amenities: ["wifi", "parking", "security", "balcony", "ac"],
      furnished: false,
      status: "occupied",
      tenant: {
        name: "Kouadio Michel",
        email: "kouadio.michel@email.com",
        phone: "+225 05 98 76 54 32",
        leaseStart: "2024-03-01",
        leaseEnd: "2025-02-28"
      },
      lastInspection: "2024-10-20",
      nextInspection: "2025-01-20"
    },
    {
      id: "4",
      unitNumber: "2B",
      floor: "1",
      type: "f2",
      surface: 70,
      bedrooms: 2,
      bathrooms: 1,
      rent: 190000,
      deposit: 380000,
      description: "Appartement avec vue dégagée",
      amenities: ["wifi", "elevator", "security"],
      furnished: false,
      status: "maintenance",
      lastInspection: "2024-11-10",
      nextInspection: "2024-12-20"
    },
    {
      id: "5",
      unitNumber: "3A",
      floor: "2",
      type: "studio",
      surface: 35,
      bedrooms: 0,
      bathrooms: 1,
      rent: 95000,
      deposit: 190000,
      description: "Studio cosy parfait pour étudiant",
      amenities: ["wifi", "security"],
      furnished: true,
      status: "available",
      lastInspection: "2024-11-05",
      nextInspection: "2025-02-05"
    },
    {
      id: "6",
      unitNumber: "3B",
      floor: "2",
      type: "f4",
      surface: 110,
      bedrooms: 4,
      bathrooms: 3,
      rent: 350000,
      deposit: 700000,
      description: "Appartement de standing avec suite parentale",
      amenities: ["wifi", "parking", "security", "balcony", "ac", "generator"],
      furnished: false,
      status: "occupied",
      tenant: {
        name: "Fatou Bamba",
        email: "fatou.bamba@email.com",
        phone: "+225 01 23 45 67 89",
        leaseStart: "2024-06-01",
        leaseEnd: "2025-05-31"
      },
      lastInspection: "2024-11-12",
      nextInspection: "2025-02-12"
    }
  ];

  const amenitiesLabels: Record<string, string> = {
    wifi: "Wi-Fi",
    parking: "Parking",
    security: "Sécurité 24h/24",
    balcony: "Balcon",
    ac: "Climatisation",
    generator: "Générateur",
    elevator: "Ascenseur",
    garage: "Garage",
    pool: "Piscine",
    garden: "Jardin"
  };

  const typeLabels: Record<string, string> = {
    studio: "Studio",
    f1: "F1 (1 chambre)",
    f2: "F2 (2 chambres)",
    f3: "F3 (3 chambres)",
    f4: "F4 (4 chambres)",
    duplex: "Duplex"
  };

  const statusLabels: Record<string, string> = {
    available: "Disponible",
    occupied: "Occupé",
    maintenance: "Maintenance"
  };

  const statusColors: Record<string, string> = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-blue-100 text-blue-800",
    maintenance: "bg-orange-100 text-orange-800"
  };

  // Filtrage des unités
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (unit.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = filterStatus === "all" || unit.status === filterStatus;
    const matchesType = filterType === "all" || unit.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setDialogType('view');
  };

  const handleEditUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setDialogType('edit');
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedUnit(null);
  };

  // Statistiques rapides
  const stats = {
    total: units.length,
    available: units.filter(u => u.status === 'available').length,
    occupied: units.filter(u => u.status === 'occupied').length,
    maintenance: units.filter(u => u.status === 'maintenance').length,
    totalRent: units.filter(u => u.status === 'occupied').reduce((sum, u) => sum + u.rent, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventaire des Logements</h1>
          <p className="text-muted-foreground">Résidence Palmiers - Gestion complète des unités</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => toast.success("Rapport d'inventaire généré !")}>
            Exporter Inventaire
          </Button>
          <Button onClick={() => toast.success("Redirection vers ajout de logement...")}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Logement
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Logements</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <p className="text-xl font-semibold">{stats.available}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Occupés</p>
              <p className="text-xl font-semibold">{stats.occupied}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-xl font-semibold">{stats.maintenance}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Revenus Actuels</p>
              <p className="text-xl font-semibold">{stats.totalRent.toLocaleString()} FCFA</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et Recherche */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par numéro, description ou locataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="occupied">Occupé</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="f1">F1</SelectItem>
                <SelectItem value="f2">F2</SelectItem>
                <SelectItem value="f3">F3</SelectItem>
                <SelectItem value="f4">F4</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Liste des Logements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <Card key={unit.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">Logement {unit.unitNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  {unit.floor === 'rdc' ? 'Rez-de-chaussée' : `${unit.floor}${unit.floor === '1' ? 'er' : 'e'} étage`}
                </p>
              </div>
              <Badge className={statusColors[unit.status]}>
                {statusLabels[unit.status]}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm font-medium">{typeLabels[unit.type]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Surface:</span>
                <span className="text-sm font-medium">{unit.surface} m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loyer:</span>
                <span className="text-sm font-medium">{unit.rent.toLocaleString()} FCFA</span>
              </div>
              {unit.tenant && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Locataire:</span>
                  <span className="text-sm font-medium">{unit.tenant.name}</span>
                </div>
              )}
            </div>

            {unit.amenities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Équipements:</p>
                <div className="flex flex-wrap gap-1">
                  {unit.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenitiesLabels[amenity] || amenity}
                    </Badge>
                  ))}
                  {unit.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{unit.amenities.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleViewUnit(unit)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEditUnit(unit)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun logement trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche ou filtres.
          </p>
        </div>
      )}

      {/* Dialog de visualisation */}
      <Dialog open={dialogType === 'view'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Logement {selectedUnit?.unitNumber}</DialogTitle>
            <DialogDescription>
              Informations complètes sur le logement
            </DialogDescription>
          </DialogHeader>
          {selectedUnit && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de logement</Label>
                  <p className="text-sm">{typeLabels[selectedUnit.type]}</p>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Badge className={statusColors[selectedUnit.status]}>
                    {statusLabels[selectedUnit.status]}
                  </Badge>
                </div>
                <div>
                  <Label>Surface</Label>
                  <p className="text-sm">{selectedUnit.surface} m²</p>
                </div>
                <div>
                  <Label>Étage</Label>
                  <p className="text-sm">
                    {selectedUnit.floor === 'rdc' ? 'Rez-de-chaussée' : `${selectedUnit.floor}${selectedUnit.floor === '1' ? 'er' : 'e'} étage`}
                  </p>
                </div>
                <div>
                  <Label>Chambres</Label>
                  <p className="text-sm">{selectedUnit.bedrooms} chambre{selectedUnit.bedrooms > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <Label>Salles de bain</Label>
                  <p className="text-sm">{selectedUnit.bathrooms} salle{selectedUnit.bathrooms > 1 ? 's' : ''} de bain</p>
                </div>
                <div>
                  <Label>Loyer mensuel</Label>
                  <p className="text-sm">{selectedUnit.rent.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <Label>Caution</Label>
                  <p className="text-sm">{selectedUnit.deposit.toLocaleString()} FCFA</p>
                </div>
              </div>

              {selectedUnit.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedUnit.description}</p>
                </div>
              )}

              {selectedUnit.amenities.length > 0 && (
                <div>
                  <Label>Équipements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUnit.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenitiesLabels[amenity] || amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedUnit.tenant && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <Label>Informations Locataire</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Nom</p>
                      <p className="text-sm">{selectedUnit.tenant.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{selectedUnit.tenant.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm">{selectedUnit.tenant.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bail</p>
                      <p className="text-sm">
                        {new Date(selectedUnit.tenant.leaseStart).toLocaleDateString()} - {new Date(selectedUnit.tenant.leaseEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dernière inspection</Label>
                  <p className="text-sm">{selectedUnit.lastInspection ? new Date(selectedUnit.lastInspection).toLocaleDateString() : 'Aucune'}</p>
                </div>
                <div>
                  <Label>Prochaine inspection</Label>
                  <p className="text-sm">{selectedUnit.nextInspection ? new Date(selectedUnit.nextInspection).toLocaleDateString() : 'Non programmée'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={dialogType === 'edit'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le Logement {selectedUnit?.unitNumber}</DialogTitle>
            <DialogDescription>
              Mise à jour des informations du logement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fonctionnalité de modification en cours de développement...
            </p>
            <Button onClick={closeDialog}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}