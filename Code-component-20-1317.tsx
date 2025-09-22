import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function TestApp() {
  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-4">ImmoGest CI - Test Application</h1>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Application de gestion immobilière pour la Côte d'Ivoire
          </p>
          <div className="flex space-x-2">
            <Badge variant="default">Fonctionnel</Badge>
            <Badge variant="secondary">Mode Démonstration</Badge>
          </div>
          <Button>
            Démarrer l'application
          </Button>
        </div>
      </Card>
    </div>
  );
}