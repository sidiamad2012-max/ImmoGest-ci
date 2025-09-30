import React from "react";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Calendar, TrendingUp, Users, Home, Plus, Wrench, CreditCard } from "lucide-react";
import { FunctionalDataBanner } from "./FunctionalDataBanner";
import { dataService } from "../lib/services/dataService";

export function PropertyOverview() {
  const [stats, setStats] = useState({
    totalUnits: 0,
    occupiedUnits: 0,
    availableUnits: 0,
    maintenanceUnits: 0,
    monthlyRevenue: 0,
    totalTenants: 0,
    pendingMaintenance: 0,
    inProgressMaintenance: 0,
    scheduledMaintenance: 0,
    completedMaintenance: 0
  });
  
  const [property, setProperty] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropertyData();
  }, []);

  const loadPropertyData = async () => {
    try {
      const properties = await dataService.getProperties();
      if (properties.length > 0) {
        const firstProperty = properties[0];
        setProperty(firstProperty);
        
        const propertyStats = await dataService.getPropertyStats(firstProperty.id);
        setStats(propertyStats);
        
        // Charger quelques activités récentes basées sur les transactions et maintenances
        const transactions = await dataService.getTransactions(firstProperty.id);
        const maintenanceRequests = await dataService.getMaintenanceRequests(firstProperty.id);
        
        const activities = [
          ...transactions.slice(0, 2).map(t => ({
            id: `tx-${t.id}`,
            title: t.description,
            time: new Date(t.date).toLocaleDateString('fr-FR'),
            status: t.type === 'income' ? 'success' : 'expense'
          })),
          ...maintenanceRequests.filter(r => r.status === 'completed').slice(0, 1).map(r => ({
            id: `maint-${r.id}`,
            title: `Réparation terminée: ${r.title}`,
            time: r.completed_date ? new Date(r.completed_date).toLocaleDateString('fr-FR') : 'Récemment',
            status: 'completed'
          }))
        ];
        
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const occupancyRate = stats.totalUnits > 0 ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0;

  const upcomingTasks = [
    { id: 1, task: "Inspection mensuelle", date: "15 Déc 2024", priority: "medium" },
    { id: 2, task: "Renouvellement bail", date: "18 Déc 2024", priority: "high" },
  ];

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
      <FunctionalDataBanner />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>{property?.name || 'Propriété'}</h1>
          <p className="text-muted-foreground">{property?.address || 'Adresse non disponible'}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Propriété Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Logements</p>
              <p className="text-2xl font-semibold">{stats.totalUnits}</p>
            </div>
            <Home className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Logements Occupés</p>
              <p className="text-2xl font-semibold">{stats.occupiedUnits}</p>
              <p className="text-xs text-green-600">sur {stats.totalUnits} total</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenus Mensuels</p>
              <p className="text-2xl font-semibold">{stats.monthlyRevenue.toLocaleString()} FCFA</p>
            </div>
            <div className="w-8 h-8 text-purple-600 flex items-center justify-center">💰</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux d'Occupation</p>
              <p className="text-2xl font-semibold">{occupancyRate}%</p>
              <Progress value={occupancyRate} className="h-1.5 mt-2" />
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Activités Récentes</h3>
            <Button variant="ghost" size="sm">
              Voir Tout
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'completed' ? 'bg-blue-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="default">
                  {activity.status === 'completed' ? 'terminé' : 
                   activity.status === 'success' ? 'succès' : 
                   activity.status === 'expense' ? 'dépense' : 'en attente'}
                </Badge>
              </div>
            )) : (
              <div className="text-center text-muted-foreground text-sm">
                Aucune activité récente
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Tâches À Venir</h3>
            <Button variant="ghost" size="sm">
              Ajouter Tâche
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm">{task.task}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{task.date}</p>
                  </div>
                </div>
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                  {task.priority === 'high' ? 'élevée' : 'moyenne'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <Plus className="w-6 h-6" />
            <span className="text-sm">Ajouter Logement</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <Users className="w-6 h-6" />
            <span className="text-sm">Gérer Locataires</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <CreditCard className="w-6 h-6" />
            <span className="text-sm">Transactions</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
            <Wrench className="w-6 h-6" />
            <span className="text-sm">Maintenance</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
