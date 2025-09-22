import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CalendarDays, MapPin, Users, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

export function PropertyOverview() {
  const propertyStats = [
    { label: "Total Logements", value: "12", icon: MapPin, color: "text-blue-600" },
    { label: "Logements Occupés", value: "10", icon: Users, color: "text-green-600" },
    { label: "Revenus Mensuels", value: "11 100 000 FCFA", icon: DollarSign, color: "text-purple-600" },
    { label: "Taux d'Occupation", value: "83%", icon: CheckCircle, color: "text-emerald-600" },
  ];

  const recentActivities = [
    { id: 1, type: "maintenance", title: "Réparation climatisation terminée Logement 5A", time: "Il y a 2 heures", status: "completed" },
    { id: 2, type: "payment", title: "Paiement loyer reçu Logement 3B", time: "Il y a 1 jour", status: "success" },
    { id: 3, type: "tenant", title: "Nouveau bail signé Logement 7C", time: "Il y a 2 jours", status: "success" },
    { id: 4, type: "maintenance", title: "Problème plomberie signalé Logement 2A", time: "Il y a 3 jours", status: "pending" },
  ];

  const upcomingTasks = [
    { id: 1, task: "Réunion renouvellement bail Logement 4B", date: "15 Déc 2024", priority: "high" },
    { id: 2, task: "Inspection mensuelle de la propriété", date: "18 Déc 2024", priority: "medium" },
    { id: 3, task: "Vérification maintenance climatisation", date: "20 Déc 2024", priority: "low" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Aperçu de la Propriété</h1>
          <p className="text-muted-foreground">Résidence Palmiers - Cocody, Abidjan</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline">Exporter Rapport</Button>
          <Button>Ajouter Logement</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {propertyStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Activités Récentes</h3>
            <Button variant="ghost" size="sm">Voir Tout</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' || activity.status === 'success' 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant={
                  activity.status === 'completed' || activity.status === 'success' 
                    ? 'default' 
                    : 'secondary'
                }>
                  {activity.status === 'completed' ? 'terminé' : 
                   activity.status === 'success' ? 'succès' : 'en attente'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tâches À Venir</h3>
            <Button variant="ghost" size="sm">Ajouter Tâche</Button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm">{task.task}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <CalendarDays className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{task.date}</p>
                  </div>
                </div>
                <Badge variant={
                  task.priority === 'high' ? 'destructive' :
                  task.priority === 'medium' ? 'secondary' : 'outline'
                }>
                  {task.priority === 'high' ? 'élevée' :
                   task.priority === 'medium' ? 'moyenne' : 'faible'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Property Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <Users className="w-6 h-6" />
            <span className="text-sm">Ajouter Locataire</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-sm">Signaler Problème</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <DollarSign className="w-6 h-6" />
            <span className="text-sm">Enregistrer Paiement</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <CalendarDays className="w-6 h-6" />
            <span className="text-sm">Programmer Visite</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}