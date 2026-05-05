import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthUI from './AuthUI';

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isLoading: false })
}));

describe('AuthUI Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <AuthUI />
      </BrowserRouter>
    );
    // Ensure form buttons or text exist
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
  });
});
