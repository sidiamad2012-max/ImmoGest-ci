-- ImmoGest CI - Tables Creation Script
-- Execute this script in your Supabase SQL Editor

-- Create ENUM types first
DO $$ BEGIN
  CREATE TYPE unit_status AS ENUM ('available', 'occupied', 'maintenance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_category AS ENUM ('plumbing', 'electrical', 'hvac', 'appliance', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_status AS ENUM ('pending', 'in-progress', 'completed', 'scheduled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  total_units INTEGER NOT NULL DEFAULT 0,
  year_built INTEGER,
  square_footage DECIMAL,
  owner_id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. UNITS TABLE
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor TEXT NOT NULL,
  type TEXT NOT NULL,
  surface DECIMAL NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  rent DECIMAL NOT NULL DEFAULT 0,
  deposit DECIMAL NOT NULL DEFAULT 0,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  furnished BOOLEAN DEFAULT FALSE,
  status unit_status DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, unit_number)
);

-- 3. TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  rent_amount DECIMAL NOT NULL DEFAULT 0,
  deposit_amount DECIMAL NOT NULL DEFAULT 0,
  emergency_contact TEXT,
  occupation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MAINTENANCE_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category maintenance_category NOT NULL,
  priority maintenance_priority NOT NULL DEFAULT 'medium',
  status maintenance_status NOT NULL DEFAULT 'pending',
  reported_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scheduled_date DATE,
  completed_date DATE,
  reported_by TEXT NOT NULL,
  assigned_to TEXT,
  estimated_cost DECIMAL,
  actual_cost DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  category TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_units_property_id ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);
CREATE INDEX IF NOT EXISTS idx_tenants_unit_id ON tenants(unit_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_unit_id ON maintenance_requests(unit_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_requests_updated_at ON maintenance_requests;
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all operations for now)
-- You can customize these later based on your authentication needs

-- Properties policies
CREATE POLICY "Allow read access to properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Allow insert access to properties" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to properties" ON properties FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to properties" ON properties FOR DELETE USING (true);

-- Units policies
CREATE POLICY "Allow read access to units" ON units FOR SELECT USING (true);
CREATE POLICY "Allow insert access to units" ON units FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to units" ON units FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to units" ON units FOR DELETE USING (true);

-- Tenants policies
CREATE POLICY "Allow read access to tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Allow insert access to tenants" ON tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to tenants" ON tenants FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to tenants" ON tenants FOR DELETE USING (true);

-- Maintenance requests policies
CREATE POLICY "Allow read access to maintenance_requests" ON maintenance_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert access to maintenance_requests" ON maintenance_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to maintenance_requests" ON maintenance_requests FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to maintenance_requests" ON maintenance_requests FOR DELETE USING (true);

-- Transactions policies
CREATE POLICY "Allow read access to transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow insert access to transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to transactions" ON transactions FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to transactions" ON transactions FOR DELETE USING (true);

-- Insert sample data for testing
INSERT INTO properties (id, name, address, description, total_units, year_built, square_footage, owner_id) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Résidence Les Palmiers', 'Boulevard Lagunaire, Cocody, Abidjan, Côte d''Ivoire', 'Résidence moderne avec équipements mis à jour, proche du centre-ville et des transports en commun à Abidjan.', 12, 2018, 850, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, property_id, unit_number, floor, type, surface, bedrooms, bathrooms, rent, deposit, description, amenities, furnished, status) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '1A', 'rdc', 'f2', 65, 2, 1, 180000, 360000, 'Appartement lumineux avec balcon donnant sur jardin', '{wifi,parking,security}', false, 'occupied'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '1B', 'rdc', 'f1', 45, 1, 1, 120000, 240000, 'Studio moderne avec kitchenette équipée', '{wifi,ac,security}', true, 'available'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '2A', 'etage_1', 'f3', 85, 3, 2, 250000, 500000, 'Grand appartement familial avec terrasse', '{wifi,parking,security,balcony}', false, 'occupied'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '2B', 'etage_1', 'f2', 70, 2, 1, 190000, 380000, 'Appartement rénové avec vue dégagée', '{wifi,ac,security}', false, 'maintenance'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '3A', 'etage_2', 'f2', 68, 2, 1, 185000, 370000, 'Appartement calme avec beaucoup de lumière', '{wifi,parking,security}', false, 'available')
ON CONFLICT (property_id, unit_number) DO NOTHING;

INSERT INTO tenants (id, unit_id, name, email, phone, lease_start, lease_end, rent_amount, deposit_amount, emergency_contact, occupation) 
VALUES 
  ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'Awa Traoré', 'awa.traore@email.com', '+225 07 12 34 56 78', '2024-01-15', '2025-01-14', 180000, 360000, '+225 05 11 22 33 44', 'Professeure'),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Kouadio Michel', 'kouadio.michel@email.com', '+225 05 98 76 54 32', '2024-03-01', '2025-02-28', 250000, 500000, '+225 07 55 66 77 88', 'Ingénieur'),
  ('770e8400-e29b-41d4-a716-446655440002', NULL, 'Aminata Kone', 'aminata.kone@email.com', '+225 01 23 45 67 89', '2024-06-01', '2025-05-31', 0, 0, '+225 07 99 88 77 66', 'Commercante')
ON CONFLICT (id) DO NOTHING;

INSERT INTO maintenance_requests (id, unit_id, title, description, category, priority, status, reported_date, scheduled_date, completed_date, reported_by, assigned_to, estimated_cost, actual_cost) 
VALUES 
  ('880e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'Fuite robinet cuisine', 'Eau qui goutte du robinet de cuisine, réparation ou remplacement nécessaire', 'plumbing', 'medium', 'in-progress', '2024-12-10', '2024-12-18', NULL, 'Awa Traoré', 'Plomberie Express CI', 90000, NULL),
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Climatisation ne refroidit pas', 'Climatiseur du salon ne maintient pas la température', 'hvac', 'high', 'scheduled', '2024-12-11', '2024-12-19', NULL, 'Kouadio Michel', 'Froid Service Abidjan', 180000, NULL),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Peinture écaillée salle de bain', 'Peinture qui s''écaille dans la salle de bain due à l''humidité', 'general', 'low', 'pending', '2024-12-12', NULL, NULL, 'Propriétaire', NULL, 75000, NULL),
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Prise électrique défaillante', 'Prise de courant dans la chambre principale ne fonctionne pas', 'electrical', 'urgent', 'completed', '2024-12-08', '2024-12-09', '2024-12-09', 'Propriétaire', 'Électricité Moderne CI', 50000, 45000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO transactions (id, property_id, type, description, amount, category, tenant_id, date) 
VALUES 
  ('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'income', 'Paiement Loyer - Logement 1A', 180000, 'Loyer', '770e8400-e29b-41d4-a716-446655440000', '2024-12-01'),
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'income', 'Paiement Loyer - Logement 2A', 250000, 'Loyer', '770e8400-e29b-41d4-a716-446655440001', '2024-12-01'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'expense', 'Réparation Électricité - Logement 2B', 45000, 'Maintenance', NULL, '2024-12-09'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'expense', 'Assurance propriété - Mois de décembre', 85000, 'Assurance', NULL, '2024-12-05')
ON CONFLICT (id) DO NOTHING;