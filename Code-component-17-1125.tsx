import { createClient } from '@supabase/supabase-js'

// Ces valeurs seront remplacées par vos vraies clés Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          address: string
          description: string | null
          total_units: number
          year_built: number | null
          square_footage: number | null
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          description?: string | null
          total_units: number
          year_built?: number | null
          square_footage?: number | null
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          description?: string | null
          total_units?: number
          year_built?: number | null
          square_footage?: number | null
          created_at?: string
          updated_at?: string
          owner_id?: string
        }
      }
      units: {
        Row: {
          id: string
          property_id: string
          unit_number: string
          floor: string
          type: string
          surface: number
          bedrooms: number
          bathrooms: number
          rent: number
          deposit: number
          description: string | null
          amenities: string[]
          furnished: boolean
          status: 'available' | 'occupied' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          unit_number: string
          floor: string
          type: string
          surface: number
          bedrooms: number
          bathrooms: number
          rent: number
          deposit: number
          description?: string | null
          amenities?: string[]
          furnished?: boolean
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          unit_number?: string
          floor?: string
          type?: string
          surface?: number
          bedrooms?: number
          bathrooms?: number
          rent?: number
          deposit?: number
          description?: string | null
          amenities?: string[]
          furnished?: boolean
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          unit_id: string | null
          name: string
          email: string
          phone: string
          lease_start: string
          lease_end: string
          rent_amount: number
          deposit_amount: number
          emergency_contact: string | null
          occupation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id?: string | null
          name: string
          email: string
          phone: string
          lease_start: string
          lease_end: string
          rent_amount: number
          deposit_amount: number
          emergency_contact?: string | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string | null
          name?: string
          email?: string
          phone?: string
          lease_start?: string
          lease_end?: string
          rent_amount?: number
          deposit_amount?: number
          emergency_contact?: string | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_requests: {
        Row: {
          id: string
          unit_id: string
          title: string
          description: string
          category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'in-progress' | 'completed' | 'scheduled'
          reported_date: string
          scheduled_date: string | null
          completed_date: string | null
          reported_by: string
          assigned_to: string | null
          estimated_cost: number | null
          actual_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          title: string
          description: string
          category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'in-progress' | 'completed' | 'scheduled'
          reported_date: string
          scheduled_date?: string | null
          completed_date?: string | null
          reported_by: string
          assigned_to?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          title?: string
          description?: string
          category?: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'in-progress' | 'completed' | 'scheduled'
          reported_date?: string
          scheduled_date?: string | null
          completed_date?: string | null
          reported_by?: string
          assigned_to?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          property_id: string
          type: 'income' | 'expense'
          description: string
          amount: number
          category: string
          tenant_id: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          type: 'income' | 'expense'
          description: string
          amount: number
          category: string
          tenant_id?: string | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          type?: 'income' | 'expense'
          description?: string
          amount?: number
          category?: string
          tenant_id?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}