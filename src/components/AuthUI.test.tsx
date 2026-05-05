import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthHeader } from './AuthUI';

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isLoading: false })
}));

describe('AuthUI Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <AuthHeader onOpenMenu={vi.fn()} title="Entrar" subtitle="Insira seus dados" />
      </BrowserRouter>
    );
    // Ensure title exists
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
  });
});
