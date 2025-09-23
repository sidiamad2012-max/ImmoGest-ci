import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import { useUserRole } from "../contexts/UserRoleContext";

export function OwnerLogin() {
  const { login } = useUserRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setEmail("sidibe.sita@email.com");
    setPassword("landlord123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-800 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">ImmoGest CI</h1>
          <p className="text-muted-foreground">Espace propriétaire</p>
        </div>

        {/* Login Form */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Shield className="w-6 h-6 text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold">Accès Propriétaire</h2>
            <p className="text-sm text-muted-foreground">Connectez-vous pour gérer vos propriétés</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Card>

        {/* Demo Account */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3 text-center">Compte de démonstration</h3>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={handleQuickLogin}
          >
            <Shield className="w-3 h-3 mr-2" />
            Sidibe Sita - Propriétaire
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Mot de passe: <code className="bg-muted px-1 rounded">landlord123</code>
          </p>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Support technique disponible</p>
          <p className="font-medium">+225 05 67 89 01 23</p>
        </div>
      </div>
    </div>
  );
}