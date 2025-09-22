import { supabase, isSupabaseAvailable } from '../supabase'
import type { Database } from '../database.types'
import { withRetryAndFallback, errorHandler } from '../utils/errorHandler'
import { mockDataStore } from '../store/mockDataStore'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export class TransactionService {
  static async getTransactions(propertyId: string): Promise<Transaction[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('transactions')
          .select('*')
          .eq('property_id', propertyId)
          .order('date', { ascending: false })

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock transactions data');
        return mockDataStore.getTransactions(propertyId);
      }
    );
  }

  static async getTransaction(id: string): Promise<Transaction | null> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('transactions')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      },
      () => {
        console.log('Using mock transaction data');
        return mockDataStore.getTransaction(id);
      }
    );
  }

  static async createTransaction(transaction: TransactionInsert): Promise<Transaction | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, creating transaction in mock store');
        return mockDataStore.createTransaction(transaction);
      }

      const { data, error } = await supabase!
        .from('transactions')
        .insert(transaction)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'transaction creation');
      return null
    }
  }

  static async updateTransaction(id: string, updates: TransactionUpdate): Promise<Transaction | null> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, updating transaction in mock store');
        return mockDataStore.updateTransaction(id, updates);
      }

      const { data, error } = await supabase!
        .from('transactions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      errorHandler.handle(error, 'transaction update');
      return null
    }
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    try {
      if (!isSupabaseAvailable()) {
        console.log('Supabase not available, deleting transaction from mock store');
        return mockDataStore.deleteTransaction(id);
      }

      const { error } = await supabase!
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      errorHandler.handle(error, 'transaction deletion');
      return false
    }
  }

  static async getTransactionsByType(
    propertyId: string,
    type: 'income' | 'expense'
  ): Promise<Transaction[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('transactions')
          .select('*')
          .eq('property_id', propertyId)
          .eq('type', type)
          .order('date', { ascending: false })

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock transactions by type data');
        return mockDataStore.getTransactions(propertyId).filter(t => t.type === type);
      }
    );
  }

  static async getTransactionsByDateRange(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const { data, error } = await supabase!
          .from('transactions')
          .select('*')
          .eq('property_id', propertyId)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })

        if (error) throw error
        return data || []
      },
      () => {
        console.log('Using mock transactions by date range data');
        return mockDataStore.getTransactions(propertyId)
          .filter(t => t.date >= startDate && t.date <= endDate)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    );
  }

  static async getFinancialSummary(propertyId: string, year?: number): Promise<{
    totalIncome: number
    totalExpenses: number
    netIncome: number
    monthlyBreakdown: Array<{
      month: string
      income: number
      expenses: number
      net: number
    }>
  }> {
    return withRetryAndFallback(
      async () => {
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase not available');
        }

        const currentYear = year || new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const { data, error } = await supabase!
          .from('transactions')
          .select('*')
          .eq('property_id', propertyId)
          .gte('date', startDate)
          .lte('date', endDate)

        if (error) throw error

        const transactions = data || [];
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        // Generate monthly breakdown
        const monthlyBreakdown = [];
        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, '0');
          const monthTransactions = transactions.filter(t => 
            t.date.startsWith(`${currentYear}-${monthStr}`)
          );
          
          const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          monthlyBreakdown.push({
            month: new Date(currentYear, month - 1).toLocaleDateString('fr-FR', { month: 'short' }),
            income,
            expenses,
            net: income - expenses
          });
        }

        return {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          monthlyBreakdown
        };
      },
      () => {
        console.log('Using mock financial summary data');
        const currentYear = year || new Date().getFullYear();
        const transactions = mockDataStore.getTransactions(propertyId)
          .filter(t => new Date(t.date).getFullYear() === currentYear);
        
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        // Generate monthly breakdown
        const monthlyBreakdown = [];
        for (let month = 1; month <= 12; month++) {
          const monthTransactions = transactions.filter(t => 
            new Date(t.date).getMonth() === month - 1
          );
          
          const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          monthlyBreakdown.push({
            month: new Date(currentYear, month - 1).toLocaleDateString('fr-FR', { month: 'short' }),
            income,
            expenses,
            net: income - expenses
          });
        }

        return {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          monthlyBreakdown
        };
      }
    );
  }
}