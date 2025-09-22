import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SupabaseStatus } from "./SupabaseStatus";

export function TestSupabase() {
  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Test des Composants UI</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Badge avec Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Badge className="cursor-pointer">
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
            <h3 className="text-lg font-medium mb-2">Statut Supabase</h3>
            <SupabaseStatus />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Button avec Dialog</h3>
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