import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Plus, Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function TenantMaintenance() {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const maintenanceRequests = [
    {
      id: 1,
      title: "Réparation robinet cuisine",
      description: "Le robinet de la cuisine fuit depuis 2 jours",
      priority: "Moyenne",
      status: "En cours",
      dateSubmitted: "28 Nov 2024",
      dateScheduled: "2 Déc 2024",
      category: "Plomberie"
    },
    {
      id: 2,
      title: "Problème électrique salon",
      description: "Une prise électrique ne fonctionne plus dans le salon",
      priority: "Haute",
      status: "Programmé",
      dateSubmitted: "25 Nov 2024",
      dateScheduled: "30 Nov 2024",
      category: "Électricité"
    },
    {
      id: 3,
      title: "Réparation porte d'entrée",
      description: "La serrure de la porte d'entrée est difficile à tourner",
      priority: "Faible",
      status: "Terminé",
      dateSubmitted: "20 Nov 2024",
      dateCompleted: "22 Nov 2024",
      category: "Menuiserie"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En cours":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      case "Programmé":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200"><AlertTriangle className="w-3 h-3 mr-1" />Programmé</Badge>;
      case "Terminé":
        return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Haute":
        return <Badge variant="destructive">Haute</Badge>;
      case "Moyenne":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Moyenne</Badge>;
      case "Faible":
        return <Badge variant="outline">Faible</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Demandes de Maintenance</h1>
        <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle Demande de Maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la demande</Label>
                <Input id="title" placeholder="Ex: Réparation robinet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="">Sélectionner une catégorie</option>
                  <option value="plomberie">Plomberie</option>
                  <option value="electricite">Électricité</option>
                  <option value="menuiserie">Menuiserie</option>
                  <option value="peinture">Peinture</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <select className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="faible">Faible</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez le problème en détail..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => setShowNewRequest(false)}>
                  Soumettre la demande
                </Button>
                <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Demandes actives</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Terminées ce mois</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Wrench className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">24h</p>
              <p className="text-sm text-muted-foreground">Temps de réponse moyen</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance Requests */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Mes Demandes</h3>
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{request.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{request.category}</Badge>
                    {getPriorityBadge(request.priority)}
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(request.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Soumise le: {request.dateSubmitted}</span>
                {request.dateScheduled && request.status !== "Terminé" && (
                  <span>Programmée: {request.dateScheduled}</span>
                )}
                {request.dateCompleted && (
                  <span>Terminée le: {request.dateCompleted}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}