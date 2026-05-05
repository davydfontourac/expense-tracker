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
  default: () => <div data-testid="auth-ui">AuthUI Component</div>
}));

vi.mock('@/pages/MobileAuthFlow', () => ({
  default: () => <div data-testid="mobile-auth-flow">MobileAuthFlow Component</div>
}));

describe('Auth Component', () => {
  it('renders correctly on desktop', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    expect(screen.getByTestId('auth-ui')).toBeInTheDocument();
  });
});
