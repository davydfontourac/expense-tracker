import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSavings } from './useSavings';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';

// Mock dependencies
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockIlike = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useSavings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default chain mocks
    mockSelect.mockReturnValue({ order: mockOrder, ilike: mockIlike });
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockIlike.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: { id: 'cat-1' }, error: null });
    
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });
    
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: { id: 'user-1' } },
    });
  });

  describe('fetchGoals', () => {
    it('should fetch goals successfully', async () => {
      const mockGoals = [{ id: '1', name: 'Car' }];
      mockOrder.mockResolvedValueOnce({ data: mockGoals, error: null });

      const { result } = renderHook(() => useSavings());

      expect(result.current.isLoading).toBe(true);
      
      await act(async () => {
        await result.current.fetchGoals();
      });

      expect(supabase.from).toHaveBeenCalledWith('savings_goals');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: true });
      expect(result.current.goals).toEqual(mockGoals);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch errors', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: new Error('Fetch error') });

      const { result } = renderHook(() => useSavings());

      await act(async () => {
        await result.current.fetchGoals();
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar metas de economia');
      expect(result.current.goals).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('upsertGoal', () => {
    it('should insert a new goal', async () => {
      const { result } = renderHook(() => useSavings());
      
      let success = false;
      await act(async () => {
        success = await result.current.upsertGoal({ name: 'House' });
      });

      expect(supabase.from).toHaveBeenCalledWith('savings_goals');
      expect(mockInsert).toHaveBeenCalledWith([{ name: 'House', user_id: 'user-1' }]);
      expect(toast.success).toHaveBeenCalledWith('Meta criada!');
      expect(success).toBe(true);
    });

    it('should update an existing goal', async () => {
      const { result } = renderHook(() => useSavings());
      
      let success = false;
      await act(async () => {
        success = await result.current.upsertGoal({ id: '1', name: 'House Updated' });
      });

      expect(supabase.from).toHaveBeenCalledWith('savings_goals');
      expect(mockUpdate).toHaveBeenCalledWith({ id: '1', name: 'House Updated', user_id: 'user-1' });
      expect(mockEq).toHaveBeenCalledWith('id', '1');
      expect(toast.success).toHaveBeenCalledWith('Meta atualizada!');
      expect(success).toBe(true);
    });

    it('should handle unauthenticated user', async () => {
      (supabase.auth.getUser as Mock).mockResolvedValueOnce({ data: { user: null } });
      const { result } = renderHook(() => useSavings());
      
      let success = true;
      await act(async () => {
        success = await result.current.upsertGoal({ name: 'House' });
      });

      expect(toast.error).toHaveBeenCalledWith('Usuário não autenticado');
      expect(success).toBe(false);
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal successfully', async () => {
      const { result } = renderHook(() => useSavings());
      
      let success = false;
      await act(async () => {
        success = await result.current.deleteGoal('1');
      });

      expect(supabase.from).toHaveBeenCalledWith('savings_goals');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '1');
      expect(toast.success).toHaveBeenCalledWith('Meta excluída!');
      expect(success).toBe(true);
    });

    it('should handle delete error', async () => {
      mockEq.mockResolvedValueOnce({ error: new Error('Delete error') });
      const { result } = renderHook(() => useSavings());
      
      let success = true;
      await act(async () => {
        success = await result.current.deleteGoal('1');
      });

      expect(toast.error).toHaveBeenCalledWith('Delete error');
      expect(success).toBe(false);
    });
  });

  describe('addDeposit', () => {
    it('should add a deposit and create a transaction', async () => {
      // Setup initial goals
      const mockGoals = [{ id: 'goal-1', name: 'Car', current_amount: 100 }];
      mockOrder.mockResolvedValueOnce({ data: mockGoals, error: null });

      const { result } = renderHook(() => useSavings());

      await act(async () => {
        await result.current.fetchGoals();
      });

      let success = false;
      await act(async () => {
        success = await result.current.addDeposit('goal-1', 50);
      });

      // Update goal balance
      expect(supabase.from).toHaveBeenCalledWith('savings_goals');
      expect(mockUpdate).toHaveBeenCalledWith({ current_amount: 150 });
      expect(mockEq).toHaveBeenCalledWith('id', 'goal-1');

      // Fetch category
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockIlike).toHaveBeenCalledWith('name', '%caixinha%');

      // Insert transaction
      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
        user_id: 'user-1',
        amount: 50,
        type: 'transfer_out',
        description: 'Aporte: Car',
        category_id: 'cat-1',
        savings_goal_id: 'goal-1',
      })]);

      expect(toast.success).toHaveBeenCalledWith('Aporte realizado com sucesso!');
      expect(success).toBe(true);
    });

    it('should return false if goal is not found', async () => {
      const { result } = renderHook(() => useSavings());
      
      let success = true;
      await act(async () => {
        success = await result.current.addDeposit('invalid-id', 50);
      });

      expect(success).toBe(false);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});
