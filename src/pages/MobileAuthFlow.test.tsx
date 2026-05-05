import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MobileAuthFlow from './MobileAuthFlow';

const mockNavigate = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

const mockHandleLogin = vi.fn();
const mockHandleRegister = vi.fn();
const mockHandleForgotPassword = vi.fn();
const mockHandleResendConfirmation = vi.fn();

vi.mock('@/hooks/useAuthActions', () => ({
  useAuthActions: () => ({
    handleLogin: mockHandleLogin,
    handleRegister: mockHandleRegister,
    handleForgotPassword: mockHandleForgotPassword,
    handleResendConfirmation: mockHandleResendConfirmation,
    handleSocialLogin: vi.fn(),
    isLoading: false,
  }),
}));

describe('MobileAuthFlow Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockSearchParams = new URLSearchParams();
  });

  it('completes the onboarding flow and navigates to register', () => {
    vi.useFakeTimers();
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    // Initial Splash Screen
    expect(screen.getByText('Seu dinheiro sob controle.')).toBeInTheDocument();

    // Advance 2.5 seconds to Onboarding Step 1
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Rastreie tudo em um só lugar.')).toBeInTheDocument();

    // Click Next to Onboarding Step 2
    fireEvent.click(screen.getByText('Próximo'));
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('Importe extratos em 2 cliques.')).toBeInTheDocument();

    // Click Next to Onboarding Step 3
    fireEvent.click(screen.getByText('Próximo'));
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('Insights que fazem sentido.')).toBeInTheDocument();

    // Click Finish to Register Screen
    fireEvent.click(screen.getByText('Começar agora'));
    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('allows skipping onboarding directly to register', () => {
    vi.useFakeTimers();
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    // Click Pular
    fireEvent.click(screen.getByText('Pular'));
    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('navigates between login, register, and forgot password steps', () => {
    mockSearchParams = new URLSearchParams('mode=login');
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    // Starts directly in Login mode
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();

    // On Login step, click link to go back to Register
    const registerLink = screen.getByRole('button', { name: /Criar conta/i });
    fireEvent.click(registerLink);
    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();

    // We are on Register step. Click link to go to Login
    const loginLink = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(loginLink);
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();

    // Click Forgot Password
    fireEvent.click(screen.getByText('Esqueceu a senha?'));
    expect(screen.getByText('Digite seu e-mail e mandaremos um link para você redefinir.')).toBeInTheDocument();

    // Click Voltar
    fireEvent.click(screen.getByText('Voltar'));
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
  });

  it('handles the hamburger menu interactions, language toggling, and home navigation', () => {
    mockSearchParams = new URLSearchParams('mode=login');
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    // Open hamburger menu (the header button handles onOpenMenu)
    const headerButtons = screen.getAllByRole('button');
    fireEvent.click(headerButtons[1]); // second button in LoginStep is Hamburger menu

    // Check menu contents
    expect(screen.getByText('Página Inicial')).toBeInTheDocument();
    expect(screen.getByText('Tema')).toBeInTheDocument();
    expect(screen.getByText('Idioma')).toBeInTheDocument();

    // Click EN Language
    fireEvent.click(screen.getByText('EN'));
    // Page translations should update to English
    expect(screen.getByText('Language')).toBeInTheDocument();

    // Click Home Page to navigate
    fireEvent.click(screen.getByText('Home Page'));
    expect(mockNavigate).toHaveBeenCalledWith('/');

    // Click PT Language
    fireEvent.click(screen.getByText('PT'));
    expect(screen.getByText('Idioma')).toBeInTheDocument();

    // Close menu
    const closeMenuBtn = document.querySelector('.lucide-x')?.closest('button');
    if (closeMenuBtn) {
      fireEvent.click(closeMenuBtn);
    }
    expect(screen.queryByText('Idioma')).not.toBeInTheDocument();
  });

  it('submits registration form successfully and goes to success screen', async () => {
    mockHandleRegister.mockImplementation((data, cb) => {
      cb();
    });

    // Start directly in Login, then go to Register to test registration
    mockSearchParams = new URLSearchParams('mode=login');
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    // Click link to go to Register
    const registerLink = screen.getByRole('button', { name: /Criar conta/i });
    fireEvent.click(registerLink);

    // Fill registration
    fireEvent.change(screen.getByPlaceholderText('Como devemos te chamar?'), { target: { value: 'User Mobile' } });
    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), { target: { value: 'user@mobile.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText('Digite sua senha');
    fireEvent.change(passwordInputs[0], { target: { value: 'Secret123!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirme sua senha'), { target: { value: 'Secret123!' } });
    fireEvent.click(screen.getByRole('checkbox'));

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(mockHandleRegister).toHaveBeenCalled();
    });
    
    // Should be on register success step
    expect(await screen.findByText('Verifique seu e-mail')).toBeInTheDocument();

    // Try resending confirmation
    fireEvent.click(screen.getByText('Reenviar link'));
    expect(mockHandleResendConfirmation).toHaveBeenCalledWith('user@mobile.com');

    // Click go to login
    fireEvent.click(screen.getByText('Ir para o Login →'));
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
  });

  it('handles login form submission', async () => {
    mockSearchParams = new URLSearchParams('mode=login');
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    // Fill login
    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), { target: { value: 'user@mobile.com' } });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), { target: { value: 'Secret123!' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled();
    });
  });

  it('handles forgot password submission and success state', async () => {
    mockHandleForgotPassword.mockImplementation((email, cb) => {
      cb();
    });

    mockSearchParams = new URLSearchParams('mode=login');
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Esqueceu a senha?'));

    // Fill and submit
    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), { target: { value: 'user@mobile.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar link' }));

    await waitFor(() => {
      expect(mockHandleForgotPassword).toHaveBeenCalledWith('user@mobile.com', expect.any(Function));
    });

    // Success screen
    expect(await screen.findByText('Verifique seu inbox.')).toBeInTheDocument();

    // Back to login
    fireEvent.click(screen.getByText('Voltar para o Login'));
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
  });
});
