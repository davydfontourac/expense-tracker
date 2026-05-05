import { renderHook, act } from '@testing-library/react';
import { useAuthActions } from './useAuthActions';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      resend: vi.fn(),
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('useAuthActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleSocialLogin', () => {
    it('should call signInWithOAuth and handle success', async () => {
      (supabase.auth.signInWithOAuth as vi.Mock).mockResolvedValueOnce({ data: {}, error: null });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleSocialLogin('google');
      });

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: globalThis.location.origin },
      });
    });

    it('should handle errors during social login', async () => {
      const error = new Error('Social login failed');
      (supabase.auth.signInWithOAuth as vi.Mock).mockResolvedValueOnce({ data: null, error });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleSocialLogin('github');
      });

      expect(toast.error).toHaveBeenCalledWith('Social login failed');
    });
  });

  describe('handleLogin', () => {
    it('should call signInWithPassword and navigate on success', async () => {
      (supabase.auth.signInWithPassword as vi.Mock).mockResolvedValueOnce({ data: {}, error: null });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleLogin({ email: 'test@test.com', password: 'password123' });
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
      expect(toast.success).toHaveBeenCalledWith('Bem-vindo de volta!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should call onSuccess callback if provided', async () => {
      (supabase.auth.signInWithPassword as vi.Mock).mockResolvedValueOnce({ data: {}, error: null });
      const { result } = renderHook(() => useAuthActions());
      const onSuccess = vi.fn();

      await act(async () => {
        await result.current.handleLogin({ email: 'test@test.com', password: 'password123' }, onSuccess);
      });

      expect(onSuccess).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (supabase.auth.signInWithPassword as vi.Mock).mockResolvedValueOnce({ data: null, error });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleLogin({ email: 'test@test.com', password: 'password123' });
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('handleRegister', () => {
    it('should call signUp and onSuccess callback', async () => {
      (supabase.auth.signUp as vi.Mock).mockResolvedValueOnce({ data: {}, error: null });
      const { result } = renderHook(() => useAuthActions());
      const onSuccess = vi.fn();
      
      await act(async () => {
        await result.current.handleRegister({ email: 'test@test.com', password: 'password123', fullName: 'Test User' }, onSuccess);
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        options: { data: { full_name: 'Test User' } }
      });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should handle register error', async () => {
      const error = new Error('Registration failed');
      (supabase.auth.signUp as vi.Mock).mockResolvedValueOnce({ data: null, error });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleRegister({ email: 'test@test.com', password: 'password123', fullName: 'Test User' });
      });

      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
  });

  describe('handleForgotPassword', () => {
    it('should call resetPasswordForEmail and onSuccess callback', async () => {
      (supabase.auth.resetPasswordForEmail as vi.Mock).mockResolvedValueOnce({ data: {}, error: null });
      const { result } = renderHook(() => useAuthActions());
      const onSuccess = vi.fn();
      
      await act(async () => {
        await result.current.handleForgotPassword('test@test.com', onSuccess);
      });

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@test.com', {
        redirectTo: `${globalThis.location.origin}/reset-password`
      });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should handle forgot password error', async () => {
      const error = new Error('Reset failed');
      (supabase.auth.resetPasswordForEmail as vi.Mock).mockResolvedValueOnce({ data: null, error });
      const { result } = renderHook(() => useAuthActions());
      const onSuccess = vi.fn();
      
      await act(async () => {
        await result.current.handleForgotPassword('test@test.com', onSuccess);
      });

      expect(toast.error).toHaveBeenCalledWith('Reset failed');
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('handleResendConfirmation', () => {
    it('should call resend and show success toast', async () => {
      (supabase.auth.resend as vi.Mock).mockResolvedValueOnce({ data: {}, error: null });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleResendConfirmation('test@test.com');
      });

      expect(supabase.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'test@test.com',
        options: {
          emailRedirectTo: `${globalThis.location.origin}/login`
        }
      });
      expect(toast.success).toHaveBeenCalledWith('Link reenviado! Verifique seu e-mail.');
    });

    it('should handle resend error', async () => {
      const error = new Error('Resend failed');
      (supabase.auth.resend as jest.Mock).mockResolvedValueOnce({ data: null, error });
      const { result } = renderHook(() => useAuthActions());
      
      await act(async () => {
        await result.current.handleResendConfirmation('test@test.com');
      });

      expect(toast.error).toHaveBeenCalledWith('Resend failed');
    });
  });
});
