import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Search, Plus, Phone, Mail, Calendar, DollarSign, MessageCircle, Eye, AlertCircle, CheckCircle, MoreVertical, Edit, Trash2, Users } from "lucide-react";
import { useUserRole } from "../contexts/UserRoleContext";
import { toast } from "sonner@2.0.3";

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
  emergencyContact?: string;
  deposit?: number;
  notes?: string;
}

interface NewTenantFormData {
  name: string;
  unit: string;
  email: string;
  phone: string;
  rentAmount: string;
  deposit: string;
  leaseStart: string;
  leaseEnd: string;
  emergencyContact: string;
  notes: string;
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

// Available units (units not currently occupied)
const availableUnits = ["5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B"];

export function TenantManagement() {
  const { addTenant, getAllTenants } = useUserRole();
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState<NewTenantFormData>({
    name: "",
    unit: "",
    email: "",
    phone: "",
    rentAmount: "",
    deposit: "",
    leaseStart: "",
    leaseEnd: "",
    emergencyContact: "",
    notes: ""
  });

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'outline';
      case 'late': return 'destructive';
      case 'notice': return 'secondary';
      default: return 'outline';
    }
  };

  const handleContact = (tenant: Tenant) => {
    // Open default email client with pre-filled email
    const subject = encodeURIComponent(`Concernant votre logement ${tenant.unit} - Résidence Les Palmiers`);
    const body = encodeURIComponent(`Bonjour ${tenant.name},\n\nJ'espère que vous allez bien.\n\nCordialement,\nGestion Résidence Les Palmiers`);
    window.open(`mailto:${tenant.email}?subject=${subject}&body=${body}`);
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Le nom complet est requis");
      return false;
    }
    if (!formData.unit) {
      setError("Veuillez sélectionner un logement");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Veuillez entrer un email valide");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Le numéro de téléphone est requis");
      return false;
    }
    if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
      setError("Le montant du loyer doit être supérieur à 0");
      return false;
    }
    if (!formData.leaseStart) {
      setError("La date de début du bail est requise");
      return false;
    }
    if (!formData.leaseEnd) {
      setError("La date de fin du bail est requise");
      return false;
    }
    if (new Date(formData.leaseStart) >= new Date(formData.leaseEnd)) {
      setError("La date de fin doit être postérieure à la date de début");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await addTenant({
        name: formData.name,
        unit: formData.unit,
        email: formData.email,
        phone: formData.phone,
        rentAmount: parseFloat(formData.rentAmount),
        leaseStart: formData.leaseStart,
        leaseEnd: formData.leaseEnd,
        emergencyContact: formData.emergencyContact,
        deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
        notes: formData.notes
      });

      if (success) {
        setSuccess("Locataire ajouté avec succès !");
        // Add to local state
        const newTenant: Tenant = {
          id: tenants.length + 1,
          name: formData.name,
          unit: formData.unit,
          email: formData.email,
          phone: formData.phone,
          rentAmount: parseFloat(formData.rentAmount),
          leaseStart: formData.leaseStart,
          leaseEnd: formData.leaseEnd,
          status: 'active',
          emergencyContact: formData.emergencyContact,
          deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
          notes: formData.notes
        };
        setTenants([...tenants, newTenant]);
        
        // Reset form
        setFormData({
          name: "",
          unit: "",
          email: "",
          phone: "",
          rentAmount: "",
          deposit: "",
          leaseStart: "",
          leaseEnd: "",
          emergencyContact: "",
          notes: ""
        });
        
        // Close dialog after a short delay
        setTimeout(() => {
          setIsAddDialogOpen(false);
          setSuccess("");
        }, 2000);
      } else {
        setError("Un locataire avec cet email existe déjà");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de l'ajout du locataire");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof NewTenantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  const handleUpdateStatus = (tenantId: number, newStatus: 'active' | 'late' | 'notice') => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === tenantId ? { ...tenant, status: newStatus } : tenant
    ));
    
    const statusLabels = {
      'active': 'actif',
      'late': 'en retard de paiement',
      'notice': 'en préavis'
    };
    
    toast.success(`Statut du locataire mis à jour : ${statusLabels[newStatus]}`);
  };

  const handleDeleteTenant = (tenantId: number) => {
    const tenant = tenants.find(t => t.id === tenantId);
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le locataire ${tenant?.name} ?`)) {
      setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
      toast.success(`Locataire ${tenant?.name} supprimé avec succès`);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des Locataires</h1>
          <p className="text-muted-foreground">Gérez vos locataires et contrats de bail</p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Locataire
        </Button>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Locataires</p>
              <p className="text-xl font-semibold">{tenants.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <p className="text-xl font-semibold">{tenants.filter(t => t.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Retard</p>
              <p className="text-xl font-semibold">{tenants.filter(t => t.status === 'late').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Préavis</p>
              <p className="text-xl font-semibold">{tenants.filter(t => t.status === 'notice').length}</p>
            </div>
          </div>
        </Card>
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
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={getStatusColor(tenant.status)}
                  className={tenant.status === 'active' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' : ''}
                >
                  {tenant.status === 'active' ? 'actif' : 
                   tenant.status === 'late' ? 'retard' : 'préavis'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(tenant)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleContact(tenant)}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contacter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUpdateStatus(tenant.id, 'active')}>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Marquer actif
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(tenant.id, 'late')}>
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Marquer en retard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(tenant.id, 'notice')}>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Marquer préavis
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteTenant(tenant.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleContact(tenant)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Contacter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 min-w-0"
                onClick={() => handleViewDetails(tenant)}
              >
                <Eye className="w-4 h-4 mr-1" />
                <span className="truncate">Détails</span>
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

      {/* Tenant Details Dialog */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Locataire</DialogTitle>
            <DialogDescription>
              Informations complètes sur {selectedTenant?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-lg">
                    {selectedTenant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTenant.name}</h3>
                  <p className="text-muted-foreground">Logement {selectedTenant.unit}</p>
                  <Badge 
                    variant={getStatusColor(selectedTenant.status)}
                    className={selectedTenant.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                  >
                    {selectedTenant.status === 'active' ? 'Actif' : 
                     selectedTenant.status === 'late' ? 'Retard de Paiement' : 'Préavis Donné'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Informations de Contact</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedTenant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{selectedTenant.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Informations Financières</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Loyer Mensuel</p>
                        <p className="font-medium">{selectedTenant.rentAmount.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Période du Bail</p>
                        <p className="font-medium">
                          {new Date(selectedTenant.leaseStart).toLocaleDateString()} - {new Date(selectedTenant.leaseEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleContact(selectedTenant)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer Email
                </Button>
                <Button variant="outline" onClick={() => setSelectedTenant(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Tenant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={() => setIsAddDialogOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter Nouveau Locataire</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour ajouter un nouveau locataire à votre propriété.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom Complet</Label>
                  <Input id="name" placeholder="Entrer le nom complet" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="unit">Logement</Label>
                  <Select value={formData.unit} onValueChange={e => handleInputChange("unit", e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner logement" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Entrer l'email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="Entrer le numéro" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">Loyer Mensuel (FCFA)</Label>
                  <Input id="rent" type="number" placeholder="Montant du loyer" value={formData.rentAmount} onChange={e => handleInputChange("rentAmount", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="deposit">Caution (FCFA)</Label>
                  <Input id="deposit" type="number" placeholder="Montant de la caution" value={formData.deposit} onChange={e => handleInputChange("deposit", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leaseStart">Début du Bail</Label>
                  <Input id="leaseStart" type="date" value={formData.leaseStart} onChange={e => handleInputChange("leaseStart", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="leaseEnd">Fin du Bail</Label>
                  <Input id="leaseEnd" type="date" value={formData.leaseEnd} onChange={e => handleInputChange("leaseEnd", e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyContact">Contact d'urgence</Label>
                <Input id="emergencyContact" placeholder="Numéro d'urgence" value={formData.emergencyContact} onChange={e => handleInputChange("emergencyContact", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Notes supplémentaires..." value={formData.notes} onChange={e => handleInputChange("notes", e.target.value)} />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Ajout en cours..." : "Ajouter Locataire"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Error and Success Alerts */}
      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mt-4" variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}