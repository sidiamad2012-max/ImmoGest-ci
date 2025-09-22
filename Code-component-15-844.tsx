import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, User, Shield } from "lucide-react";
import { useUserRole } from "../contexts/UserRoleContext";

export function TenantLogin() {
  const { role, setRole, login } = useUserRole();
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

  const demoCredentials = [
    { email: "awa.traore@email.com", name: "Awa Traoré", apartment: "1A" },
    { email: "k.michel@email.com", name: "Kouadio Michel", apartment: "2B" },
    { email: "fatou.bamba@email.com", name: "Fatou Bamba", apartment: "3C" }
  ];

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("tenant123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Résidence Les Palmiers</h1>
          <p className="text-muted-foreground">Espace locataire - Connexion</p>
        </div>

        {/* Role Selector */}
        <Card className="p-4">
          <div className="flex space-x-2">
            <Button
              variant={role === 'tenant' ? 'default' : 'outline'}
              onClick={() => setRole('tenant')}
              className="flex-1"
              size="sm"
            >
              <User className="w-4 h-4 mr-2" />
              Locataire
            </Button>
            <Button
              variant={role === 'landlord' ? 'default' : 'outline'}
              onClick={() => setRole('landlord')}
              className="flex-1"
              size="sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Propriétaire
            </Button>
          </div>
        </Card>

        {/* Login Form */}
        <Card className="p-6">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Card>

        {/* Demo Accounts */}
        {role === 'tenant' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 text-center">Comptes de démonstration</h3>
            <div className="space-y-2">
              {demoCredentials.map((demo, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleQuickLogin(demo.email)}
                >
                  <User className="w-3 h-3 mr-2" />
                  {demo.name} - {demo.apartment}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Mot de passe: <code className="bg-muted px-1 rounded">tenant123</code>
            </p>
          </Card>
        )}

        {role === 'landlord' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 text-center">Compte propriétaire</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  setEmail("sidibe.sita@email.com");
                  setPassword("landlord123");
                }}
              >
                <Shield className="w-3 h-3 mr-2" />
                Sidibe Sita - Propriétaire
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Mot de passe: <code className="bg-muted px-1 rounded">landlord123</code>
            </p>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Besoin d'aide ? Contactez la gestion au</p>
          <p className="font-medium">+225 05 67 89 01 23</p>
        </div>
      </div>
    </div>
  );
}