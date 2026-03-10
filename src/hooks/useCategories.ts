import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, fetchCategories, setCategories };
}
