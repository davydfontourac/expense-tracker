import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthHeader, SocialAuth, AuthFooter, Input, StrengthMeter } from './AuthUI';

describe('AuthUI Component', () => {
  describe('AuthHeader', () => {
    it('renders with back button when onBack is provided', () => {
      const handleBack = vi.fn();
      const handleOpenMenu = vi.fn();
      render(
        <BrowserRouter>
          <AuthHeader onBack={handleBack} onOpenMenu={handleOpenMenu} title="Entrar" subtitle="Insira seus dados" />
        </BrowserRouter>
      );
      expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
      expect(screen.getByText(/Insira seus dados/i)).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // back button and menu button

      fireEvent.click(buttons[0]);
      expect(handleBack).toHaveBeenCalledTimes(1);

      fireEvent.click(buttons[1]);
      expect(handleOpenMenu).toHaveBeenCalledTimes(1);
    });

    it('renders logo instead of back button when onBack is not provided', () => {
      const handleOpenMenu = vi.fn();
      render(
        <BrowserRouter>
          <AuthHeader onOpenMenu={handleOpenMenu} title="Register" subtitle="Sub" />
        </BrowserRouter>
      );
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    it('hides logo when hideLogo is true and onBack is not provided', () => {
      const handleOpenMenu = vi.fn();
      render(
        <BrowserRouter>
          <AuthHeader onOpenMenu={handleOpenMenu} title="Register" subtitle="Sub" hideLogo={true} />
        </BrowserRouter>
      );
      expect(screen.queryByAltText('Logo')).not.toBeInTheDocument();
    });
  });

  describe('SocialAuth', () => {
    const mockT = {
      register: { or: 'OU' }
    };

    it('renders correctly and handles social login clicks', () => {
      const handleSocialLogin = vi.fn();
      render(<SocialAuth t={mockT} onSocialLogin={handleSocialLogin} />);

      expect(screen.getByText('OU')).toBeInTheDocument();
      const googleBtn = screen.getByRole('button', { name: /Google/i });
      const githubBtn = screen.getByRole('button', { name: /GitHub/i });

      fireEvent.click(googleBtn);
      expect(handleSocialLogin).toHaveBeenCalledWith('google');

      fireEvent.click(githubBtn);
      expect(handleSocialLogin).toHaveBeenCalledWith('github');
    });

    it('disables buttons when loading', () => {
      const handleSocialLogin = vi.fn();
      render(<SocialAuth t={mockT} onSocialLogin={handleSocialLogin} isLoading={true} />);

      const googleBtn = screen.getByRole('button', { name: /Google/i });
      const githubBtn = screen.getByRole('button', { name: /GitHub/i });

      expect(googleBtn).toBeDisabled();
      expect(githubBtn).toBeDisabled();
    });
  });

  describe('AuthFooter', () => {
    it('splits text by linkText and highlights link text', () => {
      const handleClick = vi.fn();
      render(<AuthFooter text="Não tem uma conta? Cadastre-se" linkText="Cadastre-se" onClick={handleClick} />);

      expect(screen.getByText(/Não tem uma conta\?/i)).toBeInTheDocument();
      const linkBtn = screen.getByRole('button');
      fireEvent.click(linkBtn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input', () => {
    it('renders input with label and forwards ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input label="E-mail" placeholder="Insira seu e-mail" ref={ref} />);

      expect(screen.getByText('E-mail')).toBeInTheDocument();
      const inputEl = screen.getByPlaceholderText('Insira seu e-mail') as HTMLInputElement;
      expect(inputEl).toBeInTheDocument();
      expect(ref.current).toBe(inputEl);
    });

    it('renders error message when provided', () => {
      render(<Input label="E-mail" error="E-mail obrigatório" />);
      expect(screen.getByText('E-mail obrigatório')).toBeInTheDocument();
    });
  });

  describe('StrengthMeter', () => {
    it('renders segments with correct classes in strength mode', () => {
      const { rerender } = render(<StrengthMeter score={0} segments={4} />);
      let segments = document.querySelectorAll('.h-1');
      expect(segments).toHaveLength(4);

      // Score 1 (red)
      rerender(<StrengthMeter score={1} segments={4} />);
      expect(document.querySelector('.bg-red-500')).toBeInTheDocument();

      // Score 2 (orange)
      rerender(<StrengthMeter score={2} segments={4} />);
      expect(document.querySelector('.bg-orange-500')).toBeInTheDocument();

      // Score 3 (yellow)
      rerender(<StrengthMeter score={3} segments={4} />);
      expect(document.querySelector('.bg-yellow-500')).toBeInTheDocument();

      // Score 4 (green)
      rerender(<StrengthMeter score={4} segments={4} />);
      expect(document.querySelector('.bg-green-500')).toBeInTheDocument();
    });

    it('renders correct classes in match mode', () => {
      const { rerender } = render(<StrengthMeter score={2} segments={4} mode="match" />);
      expect(document.querySelector('.bg-red-500')).toBeInTheDocument(); // not complete match

      rerender(<StrengthMeter score={4} segments={4} mode="match" />);
      expect(document.querySelector('.bg-green-500')).toBeInTheDocument(); // complete match
    });
  });
});
