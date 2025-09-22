# Configuration Supabase pour ImmoGest CI

## Vue d'ensemble

ImmoGest CI peut fonctionner en deux modes :
- **Mode démonstration** : Utilise des données fictives (par défaut)
- **Mode production** : Connecté à une base de données Supabase réelle

## Configuration Rapide

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez l'URL du projet et la clé API publique

### 2. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_cle_publique_ici
```

### 3. Structure de la base de données

Exécutez ces commandes SQL dans l'éditeur SQL de Supabase :

#### Table Properties (Propriétés)
```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  total_units INTEGER NOT NULL DEFAULT 0,
  year_built INTEGER,
  square_footage INTEGER,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table Units (Logements)
```sql
CREATE TABLE units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor TEXT NOT NULL,
  type TEXT NOT NULL,
  surface INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  rent INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  furnished BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('available', 'occupied', 'maintenance')) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table Tenants (Locataires)
```sql
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  rent_amount INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  emergency_contact TEXT,
  occupation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table Maintenance Requests (Demandes de maintenance)
```sql
CREATE TABLE maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'general')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'scheduled')) DEFAULT 'pending',
  reported_date DATE NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  reported_by TEXT NOT NULL,
  assigned_to TEXT,
  estimated_cost INTEGER,
  actual_cost INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table Transactions (Transactions financières)
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Politiques de sécurité (RLS)

Activez Row Level Security pour chaque table :

```sql
-- Activer RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Politiques de base (à adapter selon vos besoins)
-- Pour l'instant, autoriser toutes les opérations
CREATE POLICY "Allow all for authenticated users" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON units FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON tenants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON maintenance_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON transactions FOR ALL USING (auth.role() = 'authenticated');
```

### 5. Données d'exemple (optionnel)

```sql
-- Insérer une propriété d'exemple
INSERT INTO properties (name, address, description, total_units, year_built, square_footage, owner_id)
VALUES ('Résidence Les Palmiers', 'Boulevard Lagunaire, Cocody, Abidjan', 'Résidence moderne avec équipements complets', 12, 2018, 850, 'owner-1');

-- Récupérer l'ID de la propriété
-- Remplacez {property_id} par l'ID réel dans les requêtes suivantes

-- Insérer des logements d'exemple
INSERT INTO units (property_id, unit_number, floor, type, surface, bedrooms, bathrooms, rent, deposit, description, amenities, furnished, status)
VALUES 
  ('{property_id}', '1A', 'rdc', 'f2', 65, 2, 1, 180000, 360000, 'Appartement lumineux avec balcon', '{"wifi", "parking", "security"}', false, 'available'),
  ('{property_id}', '1B', 'rdc', 'f1', 45, 1, 1, 120000, 240000, 'Studio moderne avec kitchenette', '{"wifi", "ac", "security"}', true, 'available');
```

## Vérification

Après configuration, l'application affichera :
- Badge vert "Base de données connectée" si Supabase est configuré
- Badge orange "Mode démonstration" si utilisation des données fictives

## Dépannage

### Erreurs courantes

1. **"Network Error"** : Vérifiez l'URL du projet
2. **"Invalid API Key"** : Vérifiez la clé API publique
3. **"Timeout"** : Problème de réseau ou configuration firewall

### Logs de débogage

Ouvrez la console développeur (F12) pour voir les messages de débogage :
- Messages `Supabase not available` indiquent un problème de configuration
- Messages `Using mock data` indiquent l'utilisation des données fictives

## Support

Pour plus d'aide :
- [Documentation Supabase](https://supabase.com/docs)
- [Guide de démarrage rapide](https://supabase.com/docs/guides/getting-started)
- [Communauté Supabase](https://github.com/supabase/supabase/discussions)