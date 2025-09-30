import React from "react";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SupabaseStatus } from "./SupabaseStatus";
import { dataService } from "../lib/services/dataService";
import { AlertCircle, CheckCircle, Database, Zap } from "lucide-react";

export function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<{
    isSupabaseConnected: boolean;
    connectionType: string;
  } | null>(null);
  
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [dataStats, setDataStats] = useState<any>(null);

  useEffect(() => {
    // Vérifier le statut de connexion au montage
    const status = dataService.getConnectionStatus();
    setConnectionStatus(status);
    
    // Charger quelques statistiques basiques
    loadDataStats();
  }, []);

  const loadDataStats = async () => {
    try {
      const properties = await dataService.getProperties();
      const units = await dataService.getUnits();
      const tenants = await dataService.getTenants();
      const maintenanceRequests = await dataService.getMaintenanceRequests();
      const transactions = await dataService.getTransactions();

      setDataStats({
        properties: properties.length,
        units: units.length,
        tenants: tenants.length,
        maintenanceRequests: maintenanceRequests.length,
        transactions: transactions.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await dataService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Erreur lors du test: ${error}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshConnection = async () => {
    setIsLoading(true);
    try {
      await dataService.refreshConnection();
      const result = await dataService.testConnection();
      setTestResult(result);
      
      // Refresh data stats after reconnection
      if (result.success) {
        await loadDataStats();
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Erreur lors du refresh: ${error}`
      });
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-6 h-6" />
        <h1>Base de Données - ImmoGest CI</h1>
      </div>

      {/* Statut de Connexion */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Statut de Connexion</h2>
          <div className="flex gap-2">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? "Test en cours..." : "Tester Connexion"}
            </Button>
            <Button 
              onClick={refreshConnection} 
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? "Refresh..." : "Actualiser"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {connectionStatus && (
            <div className="flex items-center gap-2">
              {connectionStatus.isSupabaseConnected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="font-medium">{connectionStatus.connectionType}</span>
              <Badge variant={connectionStatus.isSupabaseConnected ? "default" : "secondary"}>
                {connectionStatus.isSupabaseConnected ? "Connecté" : "Mode Local"}
              </Badge>
            </div>
          )}
          
          {testResult && (
            <div className={`p-3 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{testResult.message}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Statistiques des Données */}
      <Card className="p-6">
        <h2 className="mb-4">Données Disponibles</h2>
        
        {dataStats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dataStats.properties}</div>
              <div className="text-sm text-muted-foreground">Propriétés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dataStats.units}</div>
              <div className="text-sm text-muted-foreground">Logements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dataStats.tenants}</div>
              <div className="text-sm text-muted-foreground">Locataires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{dataStats.maintenanceRequests}</div>
              <div className="text-sm text-muted-foreground">Maintenances</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{dataStats.transactions}</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Chargement des statistiques...
          </div>
        )}
      </Card>

      {/* Configuration Supabase */}
      <Card className="p-6">
        <h2 className="mb-4">Configuration Supabase</h2>
        <SupabaseStatus />
      </Card>

      {/* Test des Composants UI */}
      <Card className="p-6">
        <h2 className="mb-4">Test des Composants UI</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="mb-2">Badge avec Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Badge className="cursor-pointer" variant="outline">
                  <Zap className="w-3 h-3 mr-1" />
                  Test Badge Trigger
                </Badge>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Test Dialog</DialogTitle>
                </DialogHeader>
                <p>Ce dialog est déclenché par un Badge.</p>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <h3 className="mb-2">Button avec Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Ouvrir Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Test Dialog avec Button</DialogTitle>
                </DialogHeader>
                <p>Ce dialog est déclenché par un Button.</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </div>
  );
}
