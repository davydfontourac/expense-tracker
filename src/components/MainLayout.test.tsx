import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';

vi.mock('./Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('./BottomNavigation', () => ({
  default: () => <div data-testid="bottom-nav">BottomNavigation</div>
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    Outlet: () => <div data-testid="outlet">Outlet</div>
  };
});

describe('MainLayout', () => {
  it('renders Sidebar, Outlet and BottomNavigation', () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });
});
