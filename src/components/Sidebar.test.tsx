import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ profile: { full_name: 'Test User' }, signOut: vi.fn() })
}));

describe('Sidebar Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
