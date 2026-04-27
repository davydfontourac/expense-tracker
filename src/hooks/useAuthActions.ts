import { useState } from 'react';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: globalThis.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `Erro ao conectar com ${provider}`);
    }
  };

  const handleLogin = async (data: any, onSuccess?: () => void) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      if (error) throw error;
      toast.success('Bem-vindo de volta!');
      if (onSuccess) onSuccess();
      else navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao realizar login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: any, onSuccess?: () => void) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.fullName } }
      });
      if (error) throw error;
      toast.success('Cadastro realizado! Verifique seu e-mail.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao realizar cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string, onSuccess: () => void) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${globalThis.location.origin}/reset-password`
      });
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao solicitar recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSocialLogin,
    handleLogin,
    handleRegister,
    handleForgotPassword
  };
}
