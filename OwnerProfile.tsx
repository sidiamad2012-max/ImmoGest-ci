"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Building2, Settings, Camera, Save, Shield, Bell, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { dataService } from "../lib/services/dataService";

interface OwnerProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  bio?: string;
  avatar?: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    dashboard: {
      compactView: boolean;
      autoRefresh: boolean;
      theme: 'light' | 'dark' | 'auto';
    };
    privacy: {
      publicProfile: boolean;
      showContactInfo: boolean;
    };
  };
  stats: {
    propertiesCount: number;
    unitsCount: number;
    tenantsCount: number;
    totalRevenue: number;
    memberSince: string;
  };
}

export function OwnerProfile() {
  const { user } = useSupabaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<OwnerProfileData>({
    id: user?.id || '',
    name: user?.user_metadata?.full_name || 'Propriétaire',
    email: user?.email || '',
    phone: '+225 01 02 03 04 05',
    address: 'Abidjan, Côte d\'Ivoire',
    company: 'Immo Gestion CI',
    bio: 'Gestionnaire immobilier professionnel spécialisé dans la gestion de propriétés résidentielles et commerciales à Abidjan.',
    avatar: user?.user_metadata?.avatar_url,
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      dashboard: {
        compactView: false,
        autoRefresh: true,
        theme: 'auto'
      },
      privacy: {
        publicProfile: false,
        showContactInfo: true
      }
    },
    stats: {
      propertiesCount: 0,
      unitsCount: 0,
      tenantsCount: 0,
      totalRevenue: 0,
      memberSince: '2024'
    }
  });

  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      // Charger les statistiques du propriétaire
      const [properties, units, tenants] = await Promise.all([
        dataService.getProperties(),
        dataService.getUnits(),
        dataService.getTenants()
      ]);

      const stats = {
        propertiesCount: properties.length,
        unitsCount: units.length,
        tenantsCount: tenants.length,
        totalRevenue: units.reduce((total, unit) => total + unit.rent, 0),
        memberSince: '2024'
      };

      setProfileData(prev => ({ ...prev, stats }));
      setFormData(prev => ({ ...prev, stats }));
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Simulation de sauvegarde - en production, cela ferait appel à Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(formData);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePreferences = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category as keyof typeof prev.preferences],
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* En-tête du profil */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-semibold">{profileData.name}</h1>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Propriétaire Vérifié</span>
                  </Badge>
                </div>
                <p className="text-muted-foreground">{profileData.email}</p>
                <p className="text-sm text-muted-foreground">Membre depuis {profileData.stats.memberSince}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold">{profileData.stats.propertiesCount}</p>
            <p className="text-sm text-muted-foreground">Propriétés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold">{profileData.stats.unitsCount}</p>
            <p className="text-sm text-muted-foreground">Unités</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold">{profileData.stats.tenantsCount}</p>
            <p className="text-sm text-muted-foreground">Locataires</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 text-primary flex items-center justify-center font-semibold text-lg">
              F
            </div>
            <p className="text-2xl font-semibold">{profileData.stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Revenue/mois (CFA)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => updateFormData('company', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                disabled={!isEditing}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => updateFormData('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
                placeholder="Présentez-vous et votre activité..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Préférences */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes importantes</p>
                </div>
                <Switch
                  checked={formData.preferences.notifications.email}
                  onCheckedChange={(checked) => updatePreferences('notifications', 'email', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">Alertes urgentes par SMS</p>
                </div>
                <Switch
                  checked={formData.preferences.notifications.sms}
                  onCheckedChange={(checked) => updatePreferences('notifications', 'sms', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">Notifications dans le navigateur</p>
                </div>
                <Switch
                  checked={formData.preferences.notifications.push}
                  onCheckedChange={(checked) => updatePreferences('notifications', 'push', checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tableau de bord */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Tableau de bord</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Vue compacte</Label>
                  <p className="text-sm text-muted-foreground">Affichage condensé des données</p>
                </div>
                <Switch
                  checked={formData.preferences.dashboard.compactView}
                  onCheckedChange={(checked) => updatePreferences('dashboard', 'compactView', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Actualisation automatique</Label>
                  <p className="text-sm text-muted-foreground">Mise à jour des données en temps réel</p>
                </div>
                <Switch
                  checked={formData.preferences.dashboard.autoRefresh}
                  onCheckedChange={(checked) => updatePreferences('dashboard', 'autoRefresh', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select
                  value={formData.preferences.dashboard.theme}
                  onValueChange={(value) => updatePreferences('dashboard', 'theme', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="auto">Automatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Confidentialité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profil public</Label>
                  <p className="text-sm text-muted-foreground">Permettre aux locataires de voir votre profil</p>
                </div>
                <Switch
                  checked={formData.preferences.privacy.publicProfile}
                  onCheckedChange={(checked) => updatePreferences('privacy', 'publicProfile', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Afficher les informations de contact</Label>
                  <p className="text-sm text-muted-foreground">Téléphone et email visibles aux locataires</p>
                </div>
                <Switch
                  checked={formData.preferences.privacy.showContactInfo}
                  onCheckedChange={(checked) => updatePreferences('privacy', 'showContactInfo', checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Gérez rapidement votre compte et vos paramètres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="justify-start">
              <Mail className="w-4 h-4 mr-2" />
              Vérifier l'email
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Authentification 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OwnerProfile;