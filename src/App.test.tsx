import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Mocks the matchMedia API that framer-motion might use or other UI tools
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('App', () => {
  it('renders without crashing (Smoke Test)', () => {
    // Renderezia o app dentro de um MemoryRouter para os AuthRoutes e AppRoutes funcionarem
    render(
      <MemoryRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // Na nossa estrutura principal não logada, o <App> nos levará para a rota ou Login ou Splash de Carregamento
    // Verifica apenas se os elementos principais da div ou root existiram sem estourar.
    const mainElement = document.querySelector('div');
    expect(mainElement).toBeInTheDocument();
  });
});
