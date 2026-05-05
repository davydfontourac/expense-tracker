import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Auth from './Auth';

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ session: null, isLoading: false })
}));

vi.mock('@/hooks/useMobile', () => ({
  useMobile: () => false
}));

vi.mock('@/components/AuthUI', () => ({
  default: () => <div data-testid="auth-ui">AuthUI Component</div>,
  StrengthMeter: () => <div data-testid="strength-meter">StrengthMeter</div>
}));

vi.mock('@/pages/MobileAuthFlow', () => ({
  default: () => <div data-testid="mobile-auth-flow">MobileAuthFlow Component</div>
}));

describe('Auth Component', () => {
  it('renders correctly on desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    expect(screen.getAllByTestId('strength-meter')[0]).toBeInTheDocument();
  });
});
