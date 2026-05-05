import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { supabase } from '@/services/supabase';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

vi.mock('@/components/PageTransition', () => ({
  default: ({ children }: any) => <div data-testid="page-transition">{children}</div>
}));

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />
}));

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders the forgot password form initially', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    expect(screen.getByText('Recuperar senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar link/i })).toBeInTheDocument();
  });

  it('submits the form successfully and shows success message', async () => {
    (supabase.auth.resetPasswordForEmail as Mock).mockResolvedValueOnce({ error: null });
    
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.any(String),
      });
      expect(screen.getByText('E-mail enviado!')).toBeInTheDocument();
    });
  });

  it('shows an error message when submission fails', async () => {
    (supabase.auth.resetPasswordForEmail as Mock).mockResolvedValueOnce({ 
      error: new Error('Usuário não encontrado') 
    });
    
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument();
    });
  });
});
