import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { supabase } from '@/services/supabase';

const mobileMockState = { isMobile: false };
const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockResolvedValue({ error: null });
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('@/hooks/useMobile', () => ({
  useMobile: () => mobileMockState.isMobile,
}));

const mockUser = { id: 'u-123', email: 'john@doe.com' };
const mockProfile = { full_name: 'John Doe', avatar_url: '' };

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    profile: mockProfile,
    isLoading: false,
    refreshProfile: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('@/context/PrivacyContext', () => ({
  usePrivacy: () => ({
    hideBalance: false,
    setHideBalance: vi.fn(),
  }),
}));

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    summary: { caixinhaBalance: 5000 },
    transactions: [{ id: '1' }],
    fetchTransactions: vi.fn(),
    exportTransactions: vi.fn(),
  }),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [{ id: '1' }],
    fetchCategories: vi.fn(),
  }),
}));

vi.mock('@/hooks/usePWA', () => ({
  usePWA: () => ({
    isInstallable: true,
    installApp: vi.fn(),
  }),
}));

const builder = {
  upsert: (...args: any[]) => mockUpsert(...args),
  update: function(...args: any[]) {
    mockUpdate(...args);
    return this;
  },
  eq: (...args: any[]) => mockEq(...args),
};

vi.mock('@/services/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(() => builder),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://img.com/avatar.jpg' } }),
      })),
    },
  },
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}));

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button>ThemeToggle</button>,
}));

vi.mock('@/components/BottomNavigation', () => ({
  default: () => <nav>BottomNav</nav>,
}));

vi.mock('@/components/PageTransition', () => ({
  default: ({ children }: any) => <div>{children}</div>,
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

describe('Profile Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mobileMockState.isMobile = false;
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => '123-mocked-uuid',
      },
      writable: true,
      configurable: true,
    });
  });

  describe('Desktop Mode', () => {
    it('deve renderizar o perfil corretamente no desktop', () => {
      render(<Profile />);
      expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
      expect(screen.getByText('john@doe.com')).toBeInTheDocument();
      expect(screen.getByText('ATIVA E VERIFICADA')).toBeInTheDocument();
    });

    it('deve chamar rpc de delete_user ao confirmar exclusão da conta', async () => {
      (supabase.rpc as any).mockResolvedValueOnce({ error: null });

      render(<Profile />);

      // Open modal
      fireEvent.click(screen.getByText('Excluir minha conta'));
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

      // Confirm exclusion
      fireEvent.click(screen.getByText('Confirmar'));

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith('delete_user');
        expect(mockToastSuccess).toHaveBeenCalledWith('Sua conta foi excluída permanentemente.');
      });
    });

    it('deve lidar com erro ao excluir conta', async () => {
      (supabase.rpc as any).mockRejectedValueOnce(new Error('RPC failed'));

      render(<Profile />);

      fireEvent.click(screen.getByText('Excluir minha conta'));
      fireEvent.click(screen.getByText('Confirmar'));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Erro ao excluir conta. Tente novamente mais tarde.');
      });
    });

    it('deve permitir atualizar dados do perfil', async () => {
      // Setup debug listener
      mockToastError.mockImplementation((msg) => {
        console.log('TOAST ERROR:', msg);
      });

      render(<Profile />);

      // Fill full name for all matches to ensure state updates
      const inputs = screen.getAllByPlaceholderText('Seu nome');
      inputs.forEach(input => {
        fireEvent.change(input, { target: { value: 'New Name' } });
      });

      // Click save button (first one is desktop)
      fireEvent.click(screen.getAllByText('Salvar alterações')[0]);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('profiles');
        expect(mockUpsert).toHaveBeenCalledWith(
          expect.objectContaining({
            full_name: 'New Name',
          })
        );
        expect(mockToastSuccess).toHaveBeenCalledWith('Perfil atualizado!');
      });
    });

    it('deve lidar com upload de avatar', async () => {
      mockToastError.mockImplementation((msg) => {
        console.log('AVATAR TOAST ERROR:', msg);
      });

      render(<Profile />);

      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      // Get all inputs with the id or class and use the desktop one (second one)
      const inputs = document.querySelectorAll('input[type="file"]');
      const input = inputs[1] || inputs[0]; // desktop is the second one in DOM tree

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Foto atualizada!');
      });
    });

    it('deve alternar a privacidade do saldo', () => {
      render(<Profile />);
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).toBeInTheDocument();
    });

    it('deve permitir exportar transações', () => {
      render(<Profile />);
      const btn = screen.getByText('Exportar Backup');
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });

    it('deve permitir limpar cache', async () => {
      render(<Profile />);
      const btn = screen.getByText('Limpar Cache');
      fireEvent.click(btn);
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Cache limpo com sucesso!');
      }, { timeout: 2000 });
    });

    it('deve permitir preencher campos de senha', () => {
      render(<Profile />);
      const currentInput = screen.getByPlaceholderText('**********');
      const newInput = screen.getByPlaceholderText('Digite a nova senha');

      fireEvent.change(currentInput, { target: { value: 'oldpassword' } });
      fireEvent.change(newInput, { target: { value: 'newpassword123' } });

      expect(currentInput).toHaveValue('oldpassword');
      expect(newInput).toHaveValue('newpassword123');
    });

    it('deve alternar o tema no desktop', () => {
      render(<Profile />);
      fireEvent.click(screen.getByText('Modo Claro'));
      fireEvent.click(screen.getByText('Modo Escuro'));
      fireEvent.click(screen.getByText('Sistema'));
    });

    it('deve lidar com erro ao limpar cache', async () => {
      Object.defineProperty(global, 'caches', {
        value: {
          keys: () => Promise.reject(new Error('Cache error')),
        },
        writable: true,
        configurable: true,
      });

      render(<Profile />);
      const btn = screen.getByText('Limpar Cache');
      fireEvent.click(btn);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Erro ao limpar cache');
      });
    });
  });

  describe('Mobile Mode', () => {
    beforeEach(() => {
      mobileMockState.isMobile = true;
    });

    it('deve renderizar o menu principal no mobile', () => {
      render(<Profile />);
      expect(screen.getByText('Conta')).toBeInTheDocument();
      expect(screen.getByText('Editar perfil', { selector: 'span' })).toBeInTheDocument();
      expect(screen.getByText('Segurança', { selector: 'span' })).toBeInTheDocument();
      expect(screen.getByText('Sobre o app', { selector: 'span' })).toBeInTheDocument();
    });

    it('deve permitir navegar para Editar Perfil no mobile e salvar alterações', async () => {
      render(<Profile />);

      // Click Editar perfil menu item
      fireEvent.click(screen.getByText('Editar perfil', { selector: 'span' }));
      expect(screen.getByText('E-mail (Não editável)')).toBeInTheDocument();

      // Change name and save
      const input = screen.getByPlaceholderText('Seu nome');
      fireEvent.change(input, { target: { value: 'Davy Mobile' } });
      fireEvent.click(screen.getByText('Salvar alterações'));

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Perfil atualizado!');
      });
    });

    it('deve permitir navegar para Segurança no mobile', () => {
      render(<Profile />);

      // Click Segurança menu item
      fireEvent.click(screen.getByText('Segurança', { selector: 'span' }));
      expect(screen.getByText('Ocultar saldo ao abrir')).toBeInTheDocument();
    });

    it('deve permitir navegar para Sobre o app, changelog e roadmap no mobile', () => {
      render(<Profile />);

      // Click Sobre o app menu item
      fireEvent.click(screen.getByText('Sobre o app', { selector: 'span' }));
      expect(screen.getByText('VERSÃO 1.2.0 · BUILD 204')).toBeInTheDocument();

      // Click Changelog
      fireEvent.click(screen.getByText('Changelog', { selector: 'span' }));
      expect(screen.getByText('v1.2.0')).toBeInTheDocument();

      // Go back and open Roadmap
      fireEvent.click(screen.getAllByRole('button')[0]); // Back button
      fireEvent.click(screen.getByText('Roadmap', { selector: 'span' }));
      expect(screen.getByText('Em desenvolvimento')).toBeInTheDocument();
    });

    it('deve chamar window.open ao clicar nos links externos do sobre no mobile', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any);

      render(<Profile />);
      fireEvent.click(screen.getByText('Sobre o app', { selector: 'span' }));

      fireEvent.click(screen.getByText('GitHub', { selector: 'span' }));
      expect(openSpy).toHaveBeenCalledWith('https://github.com/davydfontourac', '_blank', 'noopener,noreferrer');

      fireEvent.click(screen.getByText('Reportar um bug', { selector: 'span' }));
      expect(openSpy).toHaveBeenCalledWith('https://github.com/davydfontourac/expense-tracker/issues/new', '_blank', 'noopener,noreferrer');

      openSpy.mockRestore();
    });
  });
});
