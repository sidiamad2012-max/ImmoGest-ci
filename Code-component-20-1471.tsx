-- Run this in Supabase SQL Editor to refresh the API schema cache
-- This forces PostgREST to reload the schema information

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative method: You can also restart the PostgREST service
-- by going to Settings > API in your Supabase dashboard and clicking "Restart API"

-- Verify tables exist with correct structure
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'units', 'tenants', 'maintenance_requests', 'transactions');

-- Check if RLS is enabled (should return 't' for all tables)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'units', 'tenants', 'maintenance_requests', 'transactions');

-- Check RLS policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'units', 'tenants', 'maintenance_requests', 'transactions');