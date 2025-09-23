import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Zap, Database, Settings, ArrowRight } from 'lucide-react';
import { isSupabaseAvailable } from '../lib/supabase';

export function FunctionalDataBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const isSupabaseConnected = isSupabaseAvailable();

  if (!isVisible || isSupabaseConnected) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Database className="w-3 h-3 mr-1" />
                Mode Démonstration Interactif
              </Badge>
            </div>
            <AlertDescription className="text-blue-900">
              <strong>Données fonctionnelles activées !</strong> Vous pouvez maintenant :
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                <li>Ajouter, modifier et supprimer des logements, locataires et demandes de maintenance</li>
                <li>Créer des transactions financières en temps réel</li>
                <li>Voir les changements s'appliquer immédiatement dans l'interface</li>
                <li>Expérimenter avec toutes les fonctionnalités sans base de données</li>
              </ul>
              <div className="flex items-center mt-3 space-x-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/80 hover:bg-white border-blue-300 text-blue-700"
                  onClick={() => {
                    const element = document.querySelector('[data-section="finances"]');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Tester les Transactions <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
                <span className="text-xs text-blue-600">
                  Les données se réinitialisent au rechargement de la page
                </span>
              </div>
            </AlertDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100/50"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Alert>
  );
}