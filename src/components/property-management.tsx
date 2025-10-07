"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Building2, Plus, Edit, Trash2, MapPin, Calendar, Square } from "lucide-react";
import { dataService } from "../lib/services/dataService";
import { toast } from "sonner@2.0.3";
import { TestPropertyAdd } from "./TestPropertyAdd";
import { showTests } from "../lib/config/appConfig";

interface Property {
  id: string;
  name: string;
  address: string;
  property_type: string;
  total_units: number;
  year_built: number;
  square_footage: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    property_type: "apartment",
    total_units: "",
    year_built: "",
    square_footage: "",
    description: ""
  });

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
    
    // Listen for quick action events
    const handleOpenPropertyDialog = () => {
      resetForm();
      setDialogOpen(true);
    };
    
    window.addEventListener('openPropertyDialog', handleOpenPropertyDialog);
    
    return () => {
      window.removeEventListener('openPropertyDialog', handleOpenPropertyDialog);
    };
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await dataService.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error("Erreur lors du chargement des propriétés");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.total_units) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const propertyData = {
        name: formData.name,
        address: formData.address,
        property_type: formData.property_type,
        total_units: parseInt(formData.total_units),
        year_built: formData.year_built ? parseInt(formData.year_built) : new Date().getFullYear(),
        square_footage: formData.square_footage ? parseInt(formData.square_footage) : 0,
        description: formData.description,
        owner_id: 'current-user' // This should come from auth context
      };

      if (editingProperty) {
        // Update existing property
        await dataService.updateProperty(editingProperty.id, propertyData);
        toast.success("Propriété mise à jour avec succès");
      } else {
        // Create new property
        await dataService.createProperty(propertyData);
        toast.success("Propriété créée avec succès");
      }

      // Reset form and close dialog
      resetForm();
      setDialogOpen(false);
      loadProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error("Erreur lors de la sauvegarde de la propriété");
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address: property.address,
      property_type: property.property_type,
      total_units: property.total_units.toString(),
      year_built: property.year_built.toString(),
      square_footage: property.square_footage.toString(),
      description: property.description || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.")) {
      return;
    }

    try {
      await dataService.deleteProperty(propertyId);
      toast.success("Propriété supprimée avec succès");
      loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error("Erreur lors de la suppression de la propriété");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      property_type: "apartment",
      total_units: "",
      year_built: "",
      square_footage: "",
      description: ""
    });
    setEditingProperty(null);
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: "Complexe d'Appartements",
      condo: "Condominium",
      house: "Maison Individuelle",
      duplex: "Duplex",
      commercial: "Commercial"
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 sm:h-8 bg-muted rounded w-1/2 sm:w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted h-40 sm:h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Test Component - Seulement en mode développement */}
      {showTests() && <TestPropertyAdd />}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Gestion des Propriétés</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gérez votre portefeuille immobilier</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="w-full sm:w-auto h-10 sm:h-9 touch-manipulation"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ajouter Propriété</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingProperty ? "Modifier Propriété" : "Ajouter Nouvelle Propriété"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingProperty 
                  ? "Modifiez les informations de votre propriété."
                  : "Ajoutez une nouvelle propriété à votre portefeuille."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 px-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Nom de la Propriété *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Résidence Les Palmiers"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Ex: Boulevard Lagunaire, Cocody, Abidjan"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="property_type">Type de Propriété</Label>
                  <Select 
                    value={formData.property_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Complexe d'Appartements</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="house">Maison Individuelle</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="total_units">Nombre d'Unités *</Label>
                  <Input
                    id="total_units"
                    type="number"
                    min="1"
                    value={formData.total_units}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_units: e.target.value }))}
                    placeholder="12"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="year_built">Année de Construction</Label>
                  <Input
                    id="year_built"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year_built}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_built: e.target.value }))}
                    placeholder="2018"
                  />
                </div>
                
                <div>
                  <Label htmlFor="square_footage">Superficie (m²)</Label>
                  <Input
                    id="square_footage"
                    type="number"
                    min="1"
                    value={formData.square_footage}
                    onChange={(e) => setFormData(prev => ({ ...prev, square_footage: e.target.value }))}
                    placeholder="850"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de la propriété..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {editingProperty ? "Mettre à jour" : "Créer Propriété"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {properties.length === 0 ? (
        <Card className="p-6 sm:p-12 text-center">
          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Aucune propriété</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
            Commencez par ajouter votre première propriété à gérer.
          </p>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Propriété
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg line-clamp-1 pr-2">{property.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {getPropertyTypeLabel(property.property_type)}
                    </Badge>
                  </div>
                  <div className="flex space-x-1 ml-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(property)}
                      className="p-1 sm:p-2"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                      className="p-1 sm:p-2"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 p-4 sm:p-6">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{property.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-semibold">{property.total_units}</p>
                    <p className="text-xs text-muted-foreground">Unités</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-semibold">{property.square_footage}</p>
                    <p className="text-xs text-muted-foreground">m²</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">Construit en {property.year_built}</span>
                  </div>
                </div>
                
                {property.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 pt-2">
                    {property.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyManagement;
