import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { dataService } from "../lib/services/dataService";
import { toast } from "sonner@2.0.3";

export function TestPropertyAdd() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const testAddProperty = async () => {
    setLoading(true);
    try {
      const testProperty = {
        name: "Résidence Test Mobile",
        address: "Test Street, Cocody, Abidjan",
        property_type: "apartment",
        total_units: 8,
        year_built: 2023,
        square_footage: 600,
        description: "Propriété de test pour validation mobile",
        owner_id: "test-owner"
      };

      console.log("Creating test property:", testProperty);
      const result = await dataService.createProperty(testProperty);
      console.log("Property created:", result);
      
      toast.success("✅ Propriété de test créée avec succès!");
      
      // Load all properties to verify
      const allProperties = await dataService.getProperties();
      setProperties(allProperties);
      
    } catch (error) {
      console.error("Error creating test property:", error);
      toast.error("❌ Erreur lors de la création de la propriété de test");
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const allProperties = await dataService.getProperties();
      setProperties(allProperties);
      toast.success(`${allProperties.length} propriétés chargées`);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Erreur lors du chargement des propriétés");
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>🧪 Test Ajout de Propriété</CardTitle>
        <CardDescription>
          Test de validation de la fonctionnalité d'ajout de propriétés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={testAddProperty} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Ajout en cours..." : "🏢 Ajouter Propriété Test"}
          </Button>
          <Button 
            onClick={loadProperties} 
            variant="outline"
            className="flex-1"
          >
            📋 Charger Propriétés ({properties.length})
          </Button>
        </div>
        
        {properties.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Propriétés existantes:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {properties.map((prop, index) => (
                <div key={prop.id || index} className="text-sm p-2 bg-muted rounded">
                  <div className="font-medium">{prop.name}</div>
                  <div className="text-muted-foreground text-xs">{prop.address}</div>
                  <div className="text-xs">
                    {prop.total_units} unités • {prop.property_type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}