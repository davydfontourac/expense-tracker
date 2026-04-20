import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCategories } from './useCategories';
import { api } from '@/services/api';
import { toast } from 'sonner';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inicia no estado loading', () => {
    const { result } = renderHook(() => useCategories());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.categories).toEqual([]);
  });

  it('carrega categorias com sucesso', async () => {
    const mockCategories = [{ id: '1', name: 'Alimentação', icon: 'food', color: '#ff0000' }];

    (api.get as any).mockResolvedValueOnce({ data: mockCategories });

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(api.get).toHaveBeenCalledWith('/categories');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.categories).toEqual(mockCategories);
  });

  it('lida com erro na chamada da api utilizando toast', async () => {
    (api.get as any).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar categorias');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.categories).toEqual([]);
  });
});
