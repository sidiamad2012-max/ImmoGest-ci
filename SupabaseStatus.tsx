import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { isSupabaseAvailable } from '../lib/supabase';
import { Database, Wifi, WifiOff, AlertCircle, Info } from 'lucide-react';

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState(isSupabaseAvailable());
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  useEffect(() => {
    setIsConnected(isSupabaseAvailable());
  }, []);

  const statusColor = isConnected ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  const statusText = isConnected ? 'Base de données connectée' : 'Mode démonstration';
  const statusIcon = isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />;

  return (
    <>
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogTrigger asChild>
          <Badge className={`${statusColor} cursor-pointer flex items-center gap-1`}>
            {statusIcon}
            {statusText}
          </Badge>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Configuration de la Base de Données
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isConnected ? (
              <Alert>
                <Wifi className="w-4 h-4" />
                <AlertDescription>
                  <strong>Connexion active</strong><br />
                  Votre application est connectée à Supabase et utilise des données réelles.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Mode démonstration</strong><br />
                  L'application utilise des données fictives pour la démonstration. 
                  Pour utiliser des données réelles, configurez Supabase.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <h4 className="font-medium">Pour connecter Supabase :</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Créez un projet sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
                <li>Copiez l'URL de votre projet et la clé API publique</li>
                <li>Ajoutez ces variables d'environnement :</li>
              </ol>
              
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                <div>REACT_APP_SUPABASE_URL=your_project_url</div>
                <div>REACT_APP_SUPABASE_ANON_KEY=your_anon_key</div>
              </div>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Structure de base de données requise :</strong><br />
                  Vous devrez créer les tables suivantes dans votre projet Supabase :
                  <code className="block mt-1 text-xs">properties, units, tenants, maintenance_requests, transactions</code>
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                window.open('https://supabase.com/docs/guides/getting-started', '_blank');
                setShowSetupDialog(false);
              }}>
                Guide Supabase
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}