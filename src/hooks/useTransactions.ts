import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { format } from 'date-fns';
import type { Transaction } from '@/types';

interface Summary {
  totalIncome: number;
  totalExpense: number;
  availableBalance: number;
  caixinhaBalance: number;
  yearBalance: number;
}

interface MonthlyHistory {
  month: string | number;
  fullMonth?: number;
  year: number;
  income: number;
  expense: number;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    availableBalance: 0,
    caixinhaBalance: 0,
    yearBalance: 0,
  });
  const [history, setHistory] = useState<MonthlyHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(
    async (filters: { type: string; month: string; year: string; search: string; category?: string }) => {
      try {
        setIsLoading(true);

        const monthNum = Number(filters.month);
        const yearNum = Number(filters.year);

        // 1. Fetch Transactions with Category details
        let query = supabase
          .from('transactions')
          .select('*, categories!inner(name, icon, color)')
          .order('date', { ascending: false });

        if (filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }

        if (filters.search) {
          query = query.ilike('description', `%${filters.search}%`);
        }

        if (filters.category) {
          query = query.eq('categories.name', filters.category);
        }

        if (monthNum && yearNum) {
          const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1)).toISOString();
          const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59)).toISOString();
          query = query.gte('date', startDate).lte('date', endDate);
        }

        const now = new Date();
        const effectiveMonth = monthNum || (now.getMonth() + 1);
        const effectiveYear = yearNum || now.getFullYear();

        // 2. Fetch Summary and History via RPC
        const [transRes, sumRes, historyRes] = await Promise.all([
          query,
          supabase.rpc('get_dashboard_summary', { p_month: effectiveMonth, p_year: effectiveYear }),
          supabase.rpc('get_monthly_history', { p_year: effectiveYear }),
        ]);

        if (transRes.error) throw transRes.error;
        if (sumRes.error) throw sumRes.error;
        if (historyRes.error) throw historyRes.error;

        setTransactions(transRes.data || []);
        if (sumRes.data) {
          setSummary({
            totalIncome: sumRes.data.income || 0,
            totalExpense: sumRes.data.expense || 0,
            availableBalance: sumRes.data.availableBalance || 0,
            caixinhaBalance: sumRes.data.caixinhaBalance || 0,
            yearBalance: sumRes.data.yearBalance || 0,
          });
        }
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        toast.error('Erro ao carregar transações');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deleteTransactionsByMonth = async (month: number, year: number) => {
    try {
      setIsLoading(true);

      const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();

      const { error } = await supabase
        .from('transactions')
        .delete()
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      toast.success('Histórico do mês excluído com sucesso');
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erro ao excluir histórico:', error);
      toast.error('Erro ao excluir histórico do mês');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;
      toast.success('Transação excluída com sucesso');
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportTransactions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*, categories(name)')
        .order('date', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error('Nenhuma transação encontrada para exportar');
        return;
      }

      // Format data for CSV
      const csvData = data.map(t => ({
        Data: format(new Date(t.date), 'dd/MM/yyyy'),
        Descrição: t.description,
        Categoria: t.categories?.name || 'Sem categoria',
        Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
        Valor: t.amount,
        Observações: t.notes || ''
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `expense-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Dados exportados com sucesso!');
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    summary,
    history,
    isLoading,
    fetchTransactions,
    deleteTransactionsByMonth,
    deleteTransaction,
    exportTransactions,
  };
}
