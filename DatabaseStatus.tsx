import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertTriangle, CheckCircle, Database, ExternalLink } from "lucide-react";
import { dataService } from "../lib/services/dataService";

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    isSupabaseConnected: boolean;
    connectionType: string;
  } | null>(null);
  
  const [showBanner, setShowBanner] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const connectionStatus = dataService.getConnectionStatus();
    setStatus(connectionStatus);
    
    // Show banner if using mock data
    if (!connectionStatus.isSupabaseConnected) {
      setShowBanner(true);
    }
  };

  const testConnection = async () => {
    setIsChecking(true);
    try {
      await dataService.refreshConnection();
      await checkStatus();
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!showBanner || status?.isSupabaseConnected) {
    return null;
  }

  return (
    <Card className="mx-6 mt-6 p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-yellow-800">Base de données non connectée</h3>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
              Mode Mock
            </Badge>
          </div>
          
          <p className="text-sm text-yellow-700 mb-3">
            Votre application utilise des données de démonstration. Pour utiliser la base de données réelle, 
            créez les tables Supabase.
          </p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline"
              onClick={testConnection}
              disabled={isChecking}
              className="bg-white"
            >
              <Database className="w-4 h-4 mr-1" />
              {isChecking ? "Test en cours..." : "Tester Connexion"}
            </Button>
            
            <Button 
              size="sm" 
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Ouvrir Supabase
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowBanner(false)}
              className="text-yellow-700 hover:text-yellow-800"
            >
              Masquer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}