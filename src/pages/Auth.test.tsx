import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Auth from './Auth';
import { useAuthActions } from '@/hooks/useAuthActions';

vi.mock('@/hooks/useAuthActions', () => ({
  useAuthActions: vi.fn(),
}));

const mockHandleLogin = vi.fn();
const mockHandleRegister = vi.fn((data, callback) => callback && callback());
const mockHandleSocialLogin = vi.fn();
const mockHandleResendConfirmation = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/login' })
  };
});

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthActions as any).mockReturnValue({
      isLoading: false,
      handleLogin: mockHandleLogin,
      handleRegister: mockHandleRegister,
      handleSocialLogin: mockHandleSocialLogin,
      handleResendConfirmation: mockHandleResendConfirmation,
    });
    
    // Simulate desktop view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

  it('renders login form by default if path is /login', () => {
    renderComponent();
    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(/Bem-vindo de volta/i);
    expect(screen.getByPlaceholderText(/Digite seu email/i)).toBeInTheDocument();
  });

  it('toggles to register mode and displays register form', async () => {
    renderComponent();
    const toggleButton = screen.getAllByRole('button').find(b => b.textContent?.includes('Cadastrar'));
    fireEvent.click(toggleButton!);
    
    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(/Crie sua conta/i);
    });
  });

  it('submits login form correctly', async () => {
    renderComponent();
    const emailInput = screen.getAllByPlaceholderText(/Digite seu email/i)[0];
    const passwordInput = screen.getAllByPlaceholderText(/Digite sua senha/i)[0];
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getAllByRole('button').find(b => b.textContent?.includes('Entrar →'));
    fireEvent.click(submitButton!);
    
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
      }));
    });
  });

  it('submits register form and shows success screen', async () => {
    renderComponent();
    // Switch to register
    const toggleButton = screen.getAllByRole('button').find(b => b.textContent?.includes('Cadastrar'));
    fireEvent.click(toggleButton!);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Como devemos te chamar\?/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText(/Como devemos te chamar\?/i);
    const emailInput = screen.getByPlaceholderText(/Digite seu email/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Digite sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/Confirme sua senha/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Password123!' } });
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    const submitButton = screen.getAllByRole('button').find(b => b.textContent?.includes('Criar conta'));
    fireEvent.click(submitButton!);
    
    await waitFor(() => {
      expect(mockHandleRegister).toHaveBeenCalled();
    });
    
    // Check success screen
    expect(screen.getByText(/Enviamos um link de confirmação/i)).toBeInTheDocument();
    
    // Click resend
    const resendBtn = screen.getByText(/Reenviar link/i);
    fireEvent.click(resendBtn);
    expect(mockHandleResendConfirmation).toHaveBeenCalledWith('test@example.com');
  });

  it('toggles language', async () => {
    renderComponent();
    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    
    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(/Welcome back/i);
    });
    
    const ptButton = screen.getByText('PT');
    fireEvent.click(ptButton);
    
    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(/Bem-vindo de volta/i);
    });
  });

  it('handles social login', async () => {
    renderComponent();
    const googleBtn = screen.getByRole('button', { name: /Google/i });
    const githubBtn = screen.getByRole('button', { name: /GitHub/i });
    
    fireEvent.click(googleBtn);
    expect(mockHandleSocialLogin).toHaveBeenCalledWith('google');
    
    fireEvent.click(githubBtn);
    expect(mockHandleSocialLogin).toHaveBeenCalledWith('github');
  });
});
