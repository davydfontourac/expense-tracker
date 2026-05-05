import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Categories from './Categories';
import { useMobile } from '@/hooks/useMobile';

const mockFetchCategories = vi.fn();
const mockCategories: any[] = [];
let mockIsLoading = false;

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: mockCategories,
    isLoading: mockIsLoading,
    fetchCategories: mockFetchCategories,
  }),
}));

vi.mock('@/hooks/useMobile', () => ({
  useMobile: vi.fn(() => false),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ profile: null }),
}));

const mockSupabaseDelete = vi.fn().mockReturnThis();
const mockSupabaseEq = vi.fn().mockResolvedValue({ error: null });
mockSupabaseDelete.mockReturnValue({ eq: mockSupabaseEq });

const mockSupabaseSelect = vi.fn().mockReturnThis();
const mockSupabaseGte = vi.fn().mockReturnThis();
const mockSupabaseLte = vi.fn().mockResolvedValue({
  error: null,
  data: [
    { amount: 500, category_id: 'c-1', type: 'expense' },
    { amount: 2000, category_id: 'c-2', type: 'expense' }
  ]
});
mockSupabaseGte.mockReturnValue({ lte: mockSupabaseLte });
mockSupabaseSelect.mockReturnValue({ gte: mockSupabaseGte });

vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn((table) => {
      if (table === 'categories') {
        return { delete: mockSupabaseDelete };
      }
      if (table === 'transactions') {
        return { select: mockSupabaseSelect };
      }
      return {};
    }),
  },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button>Theme</button>,
}));

vi.mock('@/components/BottomNavigation', () => ({
  default: () => <nav data-testid="bottom-nav" />,
}));

vi.mock('@/components/PageTransition', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('@/components/ConfirmModal', () => ({
  default: ({ isOpen, onConfirm, onClose }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    ) : null,
}));

vi.mock('@/components/CategoryForm', () => ({
  default: ({ isOpen }: any) => (isOpen ? <div data-testid="category-form" /> : null),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/components/MonthYearPicker', () => ({
  MonthYearPicker: ({ onChange }: any) => (
    <div data-testid="month-year-picker">
      <button onClick={() => onChange('06', '2025')}>Change Month</button>
    </div>
  )
}));

vi.mock('@/components/Donut', () => ({
  Donut: () => <div data-testid="donut-chart" />
}));

describe('Categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCategories.length = 0;
    mockIsLoading = false;
    (useMobile as any).mockReturnValue(false);
  });

  it('deve renderizar o título "Minhas Categorias"', () => {
    render(<Categories />);
    expect(screen.getByText('Minhas Categorias')).toBeInTheDocument();
  });

  it('deve exibir a tela de vazio quando não há categorias', () => {
    render(<Categories />);
    expect(screen.getByText('Nenhuma categoria')).toBeInTheDocument();
  });

  it('deve abrir o formulário ao clicar em "Criar Primeira Categoria"', () => {
    render(<Categories />);
    fireEvent.click(screen.getByText('Criar Primeira Categoria'));
    expect(screen.getByTestId('category-form')).toBeInTheDocument();
  });

  it('deve abrir o formulário ao clicar em "Nova Categoria"', () => {
    render(<Categories />);
    fireEvent.click(screen.getByText('Nova Categoria'));
    expect(screen.getByTestId('category-form')).toBeInTheDocument();
  });

  it('deve chamar fetchCategories ao montar', async () => {
    render(<Categories />);
    await waitFor(() => {
      expect(mockFetchCategories).toHaveBeenCalled();
      expect(mockSupabaseSelect).toHaveBeenCalled();
    });
  });

  it('deve exibir skeletons durante o carregamento', () => {
    mockIsLoading = true;
    const { container } = render(<Categories />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('deve exibir a lista de categorias quando há dados', async () => {
    mockCategories.push(
      { id: 'c-1', name: 'Alimentação', color: '#EF4444', icon: 'tag', monthly_limit: 1000 },
      { id: 'c-2', name: 'Transporte', color: '#6B7280', icon: 'tag', monthly_limit: 0 },
    );
    render(<Categories />);
    
    await waitFor(() => {
      expect(screen.getByText('Alimentação')).toBeInTheDocument();
      expect(screen.getByText('Transporte')).toBeInTheDocument();
    });

    // Alimentação spent 500, limit 1000 (50%)
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument();
    expect(screen.getByText('50% DO LIMITE')).toBeInTheDocument();
  });

  it('deve abrir modal de edição ao clicar em uma categoria', async () => {
    mockCategories.push({ id: 'c-1', name: 'Alimentação', color: '#EF4444', icon: 'tag', monthly_limit: 1000 });
    render(<Categories />);
    
    await waitFor(() => screen.getByText('Alimentação'));
    fireEvent.click(screen.getByText('Alimentação'));
    
    expect(screen.getByTestId('category-form')).toBeInTheDocument();
  });

  it('deve abrir modal de exclusão e confirmar exclusão', async () => {
    mockCategories.push({ id: 'c-1', name: 'Alimentação', color: '#EF4444', icon: 'tag', monthly_limit: 1000 });
    render(<Categories />);
    
    await waitFor(() => screen.getByText('Alimentação'));
    
    // The MoreHorizontal icon button
    const deleteBtn = document.querySelector('button.hover\\:text-red-500');
    fireEvent.click(deleteBtn!);
    
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Confirmar'));
    
    await waitFor(() => {
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', 'c-1');
      expect(mockFetchCategories).toHaveBeenCalled();
    });
  });

  it('deve cancelar a exclusão', async () => {
    mockCategories.push({ id: 'c-1', name: 'Alimentação', color: '#EF4444', icon: 'tag', monthly_limit: 1000 });
    render(<Categories />);
    
    await waitFor(() => screen.getByText('Alimentação'));
    const deleteBtn = document.querySelector('button.hover\\:text-red-500');
    fireEvent.click(deleteBtn!);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('renderiza corretamente na visão mobile com categorias excedendo limite', async () => {
    (useMobile as any).mockReturnValue(true);
    // Over limit: limit 300, spent 500
    mockCategories.push(
      { id: 'c-1', name: 'Alimentação', color: '#EF4444', icon: 'tag', monthly_limit: 300 },
    );
    
    render(<Categories />);
    
    await waitFor(() => {
      expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
      expect(screen.getByText('Alimentação')).toBeInTheDocument();
    });

    // Verify it renders the limit text
    expect(screen.getAllByText(/ORÇ\. R\$ 300,00/i).length).toBeGreaterThan(0);
    
    // Click on category to edit in mobile
    const catCard = screen.getAllByRole('button').find(b => b.textContent?.includes('Alimentação'));
    fireEvent.click(catCard!);
    
    expect(screen.getByTestId('category-form')).toBeInTheDocument();
  });

  it('atualiza totais ao mudar o mês', async () => {
    render(<Categories />);
    await waitFor(() => {
      expect(mockSupabaseSelect).toHaveBeenCalled();
    });

    fireEvent.click(screen.getAllByText('Change Month')[0]);
    
    await waitFor(() => {
      // should trigger fetchTotals again
      expect(mockSupabaseSelect).toHaveBeenCalledTimes(2);
    });
  });
});
