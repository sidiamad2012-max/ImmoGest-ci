import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Home, Users, DollarSign, Calendar, Search, Filter, Plus, Edit, Eye, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { dataService } from "../lib/services/dataService";
import type { Database } from "../lib/database.types";

type Unit = Database['public']['Tables']['units']['Row'];
type Tenant = Database['public']['Tables']['tenants']['Row'];

interface UnitWithTenant extends Unit {
  tenant?: Tenant;
  lastInspection?: string;
  nextInspection?: string;
}

export function UnitsInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedUnit, setSelectedUnit] = useState<UnitWithTenant | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'add' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState<UnitWithTenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding new unit
  const [unitForm, setUnitForm] = useState({
    unitNumber: "",
    floor: "",
    type: "",
    surface: "",
    bedrooms: "",
    bathrooms: "",
    rent: "",
    deposit: "",
    description: "",
    amenities: [] as string[],
    furnished: false
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const properties = await dataService.getProperties();
      if (properties.length > 0) {
        const propertyId = properties[0].id;
        const unitsData = await dataService.getUnits(propertyId);
        
        // Enrichir les unités avec les informations des locataires
        const enrichedUnits = await Promise.all(
          unitsData.map(async (unit) => {
            const tenant = await dataService.getTenantByUnit(unit.id);
            return {
              ...unit,
              tenant: tenant || undefined,
              lastInspection: "2024-11-01", // À remplacer par de vraies données
              nextInspection: "2025-02-01" // À remplacer par de vraies données
            };
          })
        );
        
        setUnits(enrichedUnits);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des unités:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

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
    const matchesSearch = unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (unit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                         (unit.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = filterStatus === "all" || unit.status === filterStatus;
    const matchesType = filterType === "all" || unit.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewUnit = (unit: UnitWithTenant) => {
    setSelectedUnit(unit);
    setDialogType('view');
  };

  const handleEditUnit = (unit: UnitWithTenant) => {
    setSelectedUnit(unit);
    setDialogType('edit');
  };

  const handleAddUnit = () => {
    setDialogType('add');
  };

  const handleUnitSubmit = async () => {
    if (!unitForm.unitNumber || !unitForm.type || !unitForm.surface) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      const properties = await dataService.getProperties();
      if (properties.length === 0) {
        toast.error("Aucune propriété disponible");
        return;
      }

      const unitData = {
        property_id: properties[0].id,
        unit_number: unitForm.unitNumber,
        floor: unitForm.floor,
        type: unitForm.type,
        surface: parseFloat(unitForm.surface),
        bedrooms: parseInt(unitForm.bedrooms) || 0,
        bathrooms: parseInt(unitForm.bathrooms) || 1,
        rent: parseFloat(unitForm.rent) || 0,
        deposit: parseFloat(unitForm.deposit) || 0,
        description: unitForm.description,
        amenities: unitForm.amenities,
        furnished: unitForm.furnished,
        status: 'available' as const
      };

      await dataService.createUnit(unitData);
      toast.success(`Logement ${unitForm.unitNumber} ajouté avec succès !`);
      
      setUnitForm({
        unitNumber: "",
        floor: "",
        type: "",
        surface: "",
        bedrooms: "",
        bathrooms: "",
        rent: "",
        deposit: "",
        description: "",
        amenities: [],
        furnished: false
      });
      setDialogType(null);
      await loadUnits(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error("Erreur lors de l'ajout du logement");
    } finally {
      setIsLoading(false);
    }
  };

  const availableAmenities = [
    { value: "wifi", label: "Wi-Fi" },
    { value: "garage", label: "Garage" },
    { value: "pool", label: "Piscine" },
    { value: "security", label: "Sécurité 24h/24" },
    { value: "garden", label: "Jardin" },
    { value: "balcony", label: "Balcon" },
    { value: "elevator", label: "Ascenseur" },
    { value: "parking", label: "Parking" },
    { value: "ac", label: "Climatisation" },
    { value: "generator", label: "Générateur" }
  ];

  const addAmenity = (amenity: string) => {
    if (!unitForm.amenities.includes(amenity)) {
      setUnitForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setUnitForm(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Inventaire des Logements</h1>
          <p className="text-muted-foreground">Résidence Palmiers - Gestion complète des unités</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => toast.success("Rapport d'inventaire généré !")}>
            Exporter Inventaire
          </Button>
          <Button onClick={handleAddUnit}>
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
                <h3 className="font-semibold text-lg">Logement {unit.unit_number}</h3>
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
                <span className="text-sm font-medium">{typeLabels[unit.type] || unit.type}</span>
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
          <h3>Aucun logement trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche ou filtres.
          </p>
        </div>
      )}

      {/* Dialog de visualisation */}
      <Dialog open={dialogType === 'view'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Logement {selectedUnit?.unit_number}</DialogTitle>
            <DialogDescription>
              Informations complètes sur le logement
            </DialogDescription>
          </DialogHeader>
          {selectedUnit && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de logement</Label>
                  <p className="text-sm">{typeLabels[selectedUnit.type] || selectedUnit.type}</p>
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
                        {new Date(selectedUnit.tenant.lease_start).toLocaleDateString()} - {new Date(selectedUnit.tenant.lease_end).toLocaleDateString()}
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

      {/* Dialog d'ajout */}
      <Dialog open={dialogType === 'add'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Ajouter Nouveau Logement</DialogTitle>
            <DialogDescription>
              Ajout d'un nouveau logement à votre propriété.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Informations de base</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Numéro de Logement</Label>
                  <Input 
                    placeholder="Ex: 6A, 7B, etc." 
                    value={unitForm.unitNumber} 
                    onChange={(e) => setUnitForm(prev => ({ ...prev, unitNumber: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label>Étage</Label>
                  <Select value={unitForm.floor} onValueChange={(value) => setUnitForm(prev => ({ ...prev, floor: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner étage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rdc">Rez-de-chaussée</SelectItem>
                      <SelectItem value="etage_1">1er étage</SelectItem>
                      <SelectItem value="etage_2">2e étage</SelectItem>
                      <SelectItem value="etage_3">3e étage</SelectItem>
                      <SelectItem value="etage_4">4e étage</SelectItem>
                      <SelectItem value="etage_5">5e étage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type de Logement</Label>
                  <Select value={unitForm.type} onValueChange={(value) => setUnitForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="f1">F1 (1 chambre)</SelectItem>
                      <SelectItem value="f2">F2 (2 chambres)</SelectItem>
                      <SelectItem value="f3">F3 (3 chambres)</SelectItem>
                      <SelectItem value="f4">F4 (4 chambres)</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Physical Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Détails physiques</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Surface (m²)</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 45" 
                    value={unitForm.surface} 
                    onChange={(e) => setUnitForm(prev => ({ ...prev, surface: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label>Chambres</Label>
                  <Select value={unitForm.bedrooms} onValueChange={(value) => setUnitForm(prev => ({ ...prev, bedrooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Studio (0)</SelectItem>
                      <SelectItem value="1">1 chambre</SelectItem>
                      <SelectItem value="2">2 chambres</SelectItem>
                      <SelectItem value="3">3 chambres</SelectItem>
                      <SelectItem value="4">4 chambres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Salles de bain</Label>
                  <Select value={unitForm.bathrooms} onValueChange={(value) => setUnitForm(prev => ({ ...prev, bathrooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 salle de bain</SelectItem>
                      <SelectItem value="2">2 salles de bain</SelectItem>
                      <SelectItem value="3">3 salles de bain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="furnished"
                    checked={unitForm.furnished}
                    onChange={(e) => setUnitForm(prev => ({ ...prev, furnished: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="furnished">Meublé</Label>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Informations financières</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loyer mensuel (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 180000" 
                    value={unitForm.rent} 
                    onChange={(e) => setUnitForm(prev => ({ ...prev, rent: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label>Caution (FCFA)</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 360000" 
                    value={unitForm.deposit} 
                    onChange={(e) => setUnitForm(prev => ({ ...prev, deposit: e.target.value }))} 
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Description détaillée du logement..."
                value={unitForm.description}
                onChange={(e) => setUnitForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Équipements</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableAmenities.map((amenity) => (
                  <div key={amenity.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={amenity.value}
                      checked={unitForm.amenities.includes(amenity.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          addAmenity(amenity.value);
                        } else {
                          removeAmenity(amenity.value);
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={amenity.value} className="text-sm">{amenity.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={closeDialog}>
                Annuler
              </Button>
              <Button onClick={handleUnitSubmit} disabled={isLoading}>
                {isLoading ? "Ajout..." : "Ajouter Logement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
