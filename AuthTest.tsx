import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function AuthTest() {
  const { user, role, isAuthenticated, loading, signIn, signOut } = useSupabaseAuth();

  const testSignInLandlord = async () => {
    await signIn('landlord@test.com', '123456');
  };

  const testSignInTenant = async () => {
    await signIn('tenant@test.com', '123456');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Chargement...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test d'Authentification</CardTitle>
          <CardDescription>
            Testez l'authentification mock de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Vous n'êtes pas connecté</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={testSignInLandlord} className="w-full">
                  📊 Se connecter en tant que Propriétaire
                </Button>
                
                <Button onClick={testSignInTenant} variant="outline" className="w-full">
                  🏠 Se connecter en tant que Locataire
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                <p><strong>Mode Mock activé</strong></p>
                <p>• Email propriétaire : landlord@test.com</p>
                <p>• Email locataire : tenant@test.com</p>
                <p>• Mot de passe : n'importe quoi</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800">✅ Connecté avec succès !</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Email :</strong> {user?.email}</p>
                  <p><strong>Rôle :</strong> {role === 'landlord' ? 'Propriétaire' : 'Locataire'}</p>
                  <p><strong>Nom :</strong> {user?.metadata?.name}</p>
                  <p><strong>ID :</strong> {user?.id}</p>
                </div>
              </div>
              
              <Button onClick={handleSignOut} variant="destructive" className="w-full">
                🚪 Se déconnecter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 État de l'Application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Chargement :</span>
              <span className={`ml-2 ${loading ? 'text-orange-600' : 'text-green-600'}`}>
                {loading ? 'En cours...' : 'Terminé'}
              </span>
            </div>
            <div>
              <span className="font-medium">Authentifié :</span>
              <span className={`ml-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated ? 'Oui' : 'Non'}
              </span>
            </div>
            <div>
              <span className="font-medium">Rôle :</span>
              <span className="ml-2">{role || 'Aucun'}</span>
            </div>
            <div>
              <span className="font-medium">Mode :</span>
              <span className="ml-2 text-blue-600">Mock</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}