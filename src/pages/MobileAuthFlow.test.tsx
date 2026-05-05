import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MobileAuthFlow from './MobileAuthFlow';

vi.mock('@/hooks/useAuthActions', () => ({
  useAuthActions: () => ({
    handleLogin: vi.fn(),
    handleRegister: vi.fn(),
    handleGoogleLogin: vi.fn(),
    isLoading: false
  })
}));

describe('MobileAuthFlow Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <MobileAuthFlow />
      </BrowserRouter>
    );
    expect(screen.getByText(/O controle de gastos/i)).toBeInTheDocument();
  });
});
