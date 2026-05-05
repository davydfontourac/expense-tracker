import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPassword from './ResetPassword';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/services/supabase';

// Mocks
vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
    },
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getAllByText('Nova Senha').length).toBeGreaterThan(0);
    expect(screen.getByText('Redefinir Senha')).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    renderComponent();
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    
    fireEvent.click(screen.getByText('Redefinir Senha'));
    
    expect(await screen.findByText('As senhas não coincidem')).toBeInTheDocument();
  });

  it('handles successful password reset', async () => {
    (supabase.auth.updateUser as any).mockResolvedValue({ error: null });
    
    renderComponent();
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••');
    
    fireEvent.change(passwordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmInput, { target: { value: 'newpass123' } });
    
    fireEvent.click(screen.getByText('Redefinir Senha'));
    
    expect(await screen.findByText('Senha atualizada com sucesso! Redirecionando...')).toBeInTheDocument();
    
    // Simulate timeout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 3500 });
  });

  it('handles api error during password reset', async () => {
    (supabase.auth.updateUser as any).mockResolvedValue({ error: new Error('API Error Test') });
    
    renderComponent();
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••');
    
    fireEvent.change(passwordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmInput, { target: { value: 'newpass123' } });
    
    fireEvent.click(screen.getByText('Redefinir Senha'));
    
    expect(await screen.findByText('API Error Test')).toBeInTheDocument();
  });
});
