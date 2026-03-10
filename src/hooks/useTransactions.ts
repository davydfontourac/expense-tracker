import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type { Transaction } from '@/types';

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  yearBalance: number;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    yearBalance: 0
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async (filters: { type: string, month: string, year: string, search: string }) => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.month && filters.year) {
        params.append('month', filters.month);
        params.append('year', filters.year);
      }
      if (filters.search) params.append('search', filters.search);

      const [transRes, sumRes, historyRes] = await Promise.all([
        api.get<Transaction[]>(`/transactions?${params.toString()}`),
        api.get(`/transactions/summary?month=${filters.month}&year=${filters.year}`),
        api.get('/transactions/history')
      ]);

      setTransactions(transRes.data);
      setSummary({
        totalIncome: sumRes.data.income,
        totalExpense: sumRes.data.expense,
        balance: sumRes.data.totalBalance,
        yearBalance: sumRes.data.yearBalance
      });
      setHistory(historyRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar transações');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { transactions, summary, history, isLoading, fetchTransactions };
}
