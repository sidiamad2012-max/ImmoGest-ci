import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface SimpleLoaderProps {
  message?: string;
  timeout?: number;
}

export function SimpleLoader({ message = "Chargement...", timeout = 8000 }: SimpleLoaderProps) {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <RefreshCw className="w-8 h-8 mx-auto text-primary" />
          <div className="space-y-2">
            <h2>Chargement en cours...</h2>
            <p className="text-sm text-muted-foreground">
              L'application prend un peu plus de temps que prévu.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Recharger la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
        <div className="space-y-2">
          <h2>{message}</h2>
          <p className="text-sm text-muted-foreground">
            Veuillez patienter quelques instants...
          </p>
        </div>
      </div>
    </div>
  );
}