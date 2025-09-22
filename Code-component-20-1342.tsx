import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function SimpleTest() {
  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Test Simple</h1>
        <p className="mb-4">Application ImmoGest CI - Mode Test</p>
        <Button onClick={() => console.log('Test button clicked')}>
          Test Button
        </Button>
      </Card>
    </div>
  );
}