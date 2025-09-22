import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Search, Plus, Calendar, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  unit: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'scheduled';
  reportedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  reportedBy: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 1,
    title: "Fuite robinet cuisine",
    description: "Eau qui goutte du robinet de cuisine, réparation ou remplacement nécessaire",
    unit: "2A",
    category: "plumbing",
    priority: "medium",
    status: "in-progress",
    reportedDate: "2024-12-10",
    scheduledDate: "2024-12-14",
    reportedBy: "Awa Traoré",
    assignedTo: "Plomberie Express CI",
    estimatedCost: 90000
  },
  {
    id: 2,
    title: "Climatisation ne refroidit pas",
    description: "Climatiseur du salon ne maintient pas la température",
    unit: "4B",
    category: "hvac",
    priority: "high",
    status: "scheduled",
    reportedDate: "2024-12-11",
    scheduledDate: "2024-12-15",
    reportedBy: "Kouadio Michel",
    assignedTo: "Froid Service Abidjan",
    estimatedCost: 180000
  },
  {
    id: 3,
    title: "Broyeur à déchets en panne",
    description: "Broyeur de cuisine fait du bruit mais ne fonctionne plus",
    unit: "1C",
    category: "appliance",
    priority: "low",
    status: "pending",
    reportedDate: "2024-12-12",
    reportedBy: "Fatou Bamba"
  },
  {
    id: 4,
    title: "Prise salle de bain ne fonctionne pas",
    description: "Prise GFCI de la salle de bain principale sans courant",
    unit: "3A",
    category: "electrical",
    priority: "urgent",
    status: "completed",
    reportedDate: "2024-12-08",
    completedDate: "2024-12-09",
    reportedBy: "Jean-Baptiste Yao",
    assignedTo: "Électricité Moderne CI",
    actualCost: 51000
  }
];

export function MaintenanceTracker() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'scheduled': return 'outline';
      case 'pending': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing': return '🔧';
      case 'electrical': return '⚡';
      case 'hvac': return '❄️';
      case 'appliance': return '📱';
      default: return '🔨';
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Suivi Maintenance</h1>
          <p className="text-muted-foreground">Suivez et gérez les demandes de maintenance</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer Demande de Maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Description brève du problème" />
                </div>
                <div>
                  <Label htmlFor="unit">Logement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner logement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1A">Logement 1A</SelectItem>
                      <SelectItem value="1B">Logement 1B</SelectItem>
                      <SelectItem value="2A">Logement 2A</SelectItem>
                      <SelectItem value="2B">Logement 2B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plomberie</SelectItem>
                      <SelectItem value="electrical">Électricité</SelectItem>
                      <SelectItem value="hvac">Climatisation</SelectItem>
                      <SelectItem value="appliance">Électroménager</SelectItem>
                      <SelectItem value="general">Général</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description détaillée du problème..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reportedBy">Signalé Par</Label>
                  <Input id="reportedBy" placeholder="Nom du locataire" />
                </div>
                <div>
                  <Label htmlFor="estimatedCost">Coût Estimé (FCFA)</Label>
                  <Input id="estimatedCost" type="number" placeholder="Entrer le coût estimé" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Annuler</Button>
                <Button>Créer Demande</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Demandes</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">En Attente</p>
              <p className="text-xl font-semibold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">En Cours</p>
              <p className="text-xl font-semibold">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-xl font-semibold">{stats.completed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher demandes de maintenance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous Statuts</SelectItem>
            <SelectItem value="pending">En Attente</SelectItem>
            <SelectItem value="scheduled">Planifié</SelectItem>
            <SelectItem value="in-progress">En Cours</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes Priorités</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Élevée</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getCategoryIcon(request.category)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{request.title}</h3>
                      <Badge variant="outline" className="text-xs">Logement {request.unit}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Signalé par {request.reportedBy}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(request.reportedDate).toLocaleDateString()}</span>
                      </div>
                      {request.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigné à {request.assignedTo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex space-x-2">
                  <Badge variant={getStatusColor(request.status)}>
                    {request.status === 'pending' ? 'en attente' :
                     request.status === 'in-progress' ? 'en cours' :
                     request.status === 'scheduled' ? 'planifié' :
                     request.status === 'completed' ? 'terminé' : request.status}
                  </Badge>
                  <Badge variant={getPriorityColor(request.priority)}>
                    {request.priority === 'urgent' ? 'urgente' :
                     request.priority === 'high' ? 'élevée' :
                     request.priority === 'medium' ? 'moyenne' :
                     request.priority === 'low' ? 'faible' : request.priority}
                  </Badge>
                </div>
                {(request.estimatedCost || request.actualCost) && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {request.actualCost ? 'Coût: ' : 'Est: '}
                    </span>
                    <span className="font-semibold">
                      {(request.actualCost || request.estimatedCost)?.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                <Button variant="outline" size="sm">
                  Voir Détails
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune demande de maintenance trouvée correspondant à vos critères.</p>
        </div>
      )}
    </div>
  );
}