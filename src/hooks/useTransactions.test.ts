import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTransactions } from './useTransactions';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';

const mockQuery = {
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  then: vi.fn(function (callback) {
    callback({ data: [], error: null });
    return mockQuery;
  }),
};

vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockQuery),
    rpc: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.then.mockImplementation((callback) =>
      callback({ data: [], error: null }),
    );

    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    }
  });

  it('inicia com estados padrão de lista vazia e zerado', () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.transactions).toEqual([]);
    expect(result.current.summary.availableBalance).toBe(0);
    expect(result.current.summary.caixinhaBalance).toBe(0);
    expect(result.current.history).toEqual([]);
  });

  it('busca as transações com sucesso aplicando os filtros na query', async () => {
    const mockTransactions = [{ id: 't1', amount: 100, type: 'income' }];
    const mockSummary = {
      income: 100,
      expense: 0,
      availableBalance: 100,
      caixinhaBalance: 0,
      yearBalance: 100,
    };
    const mockHistory = [{ month: 'Jan', value: 100 }];

    // Resolves the promise from the mockQuery object for the 'transactions' fetch
    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: mockTransactions, error: null }),
    );

    // Simulates rpc calls
    (supabase.rpc as any)
      .mockResolvedValueOnce({ data: mockSummary, error: null }) // sumRes
      .mockResolvedValueOnce({ data: mockHistory, error: null }); // historyRes

    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.fetchTransactions({
        type: 'income',
        month: '10',
        year: '2023',
        search: 'teste',
      });
    });

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(supabase.rpc).toHaveBeenCalledWith('get_dashboard_summary', {
      p_month: 10,
      p_year: 2023,
    });
    expect(supabase.rpc).toHaveBeenCalledWith('get_monthly_history', { p_year: 2023 });

    expect(result.current.transactions).toEqual(mockTransactions);
    expect(result.current.summary.availableBalance).toBe(100);
    expect(result.current.summary.caixinhaBalance).toBe(0);
    expect(result.current.history).toEqual(mockHistory);
    expect(result.current.isLoading).toBe(false);
  });

  it('lida com falhas no meio do paralelismo', async () => {
    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: null, error: new Error('Network error') }),
    );

    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.fetchTransactions({
        type: 'all',
        month: '10',
        year: '2023',
        search: '',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar transações');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve excluir transações por mês com sucesso', async () => {
    const { result } = renderHook(() => useTransactions());
    let success;

    await act(async () => {
      success = await result.current.deleteTransactionsByMonth(10, 2023);
    });

    expect(success).toBe(true);
    expect(toast.success).toHaveBeenCalledWith('Histórico do mês excluído com sucesso');
  });

  it('deve lidar com erro ao excluir transações por mês', async () => {
    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: null, error: new Error('Delete error') }),
    );

    const { result } = renderHook(() => useTransactions());
    let success;

    await act(async () => {
      success = await result.current.deleteTransactionsByMonth(10, 2023);
    });

    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Erro ao excluir histórico do mês');
  });

  it('deve excluir uma transação por id com sucesso', async () => {
    const { result } = renderHook(() => useTransactions());
    let success;

    await act(async () => {
      success = await result.current.deleteTransaction('t1');
    });

    expect(success).toBe(true);
    expect(toast.success).toHaveBeenCalledWith('Transação excluída com sucesso');
  });

  it('deve lidar com erro ao excluir uma transação', async () => {
    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: null, error: new Error('Delete ID error') }),
    );

    const { result } = renderHook(() => useTransactions());
    let success;

    await act(async () => {
      success = await result.current.deleteTransaction('t1');
    });

    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Erro ao excluir transação');
  });

  it('deve exportar transações com sucesso', async () => {
    const mockData = [
      { date: '2023-10-01', description: 'Teste', amount: 100, type: 'income', categories: { name: 'Alimentação' } }
    ];

    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: mockData, error: null }),
    );

    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.exportTransactions();
    });

    expect(toast.success).toHaveBeenCalledWith('Dados exportados com sucesso!');
  });

  it('deve exibir erro ao exportar transações sem dados', async () => {
    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: [], error: null }),
    );

    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.exportTransactions();
    });

    expect(toast.error).toHaveBeenCalledWith('Nenhuma transação encontrada para exportar');
  });

  it('deve lidar com erro ao exportar transações', async () => {
    mockQuery.then.mockImplementationOnce((callback) =>
      callback({ data: null, error: new Error('Export error') }),
    );

    const { result } = renderHook(() => useTransactions());

    await act(async () => {
      await result.current.exportTransactions();
    });

    expect(toast.error).toHaveBeenCalledWith('Erro ao exportar dados');
  });
});
