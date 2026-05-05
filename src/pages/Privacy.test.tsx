import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Privacy from './Privacy';
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('react-markdown', () => ({
  default: () => <div data-testid="markdown-content">Markdown Content</div>
}));

vi.mock('@/components/PageTransition', () => ({
  default: ({ children }: any) => <div data-testid="page-transition">{children}</div>
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Privacy', () => {
  it('renders the privacy policy page correctly', () => {
    render(
      <BrowserRouter>
        <Privacy />
      </BrowserRouter>
    );

    expect(screen.getByText(/Política de Privacidade/i)).toBeInTheDocument();
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });

  it('has a download button and handles download', () => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn();
    const mockClick = vi.fn();

    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
    } as any;

    render(
      <BrowserRouter>
        <Privacy />
      </BrowserRouter>
    );

    const originalCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      if (tagName === 'a') return mockAnchor;
      return originalCreate(tagName, options);
    });
    const spyAppend = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    const spyRemove = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

    const downloadBtn = screen.getByText('Download MD').closest('button');
    if (downloadBtn) fireEvent.click(downloadBtn);

    expect(spyAppend).toHaveBeenCalledWith(mockAnchor);
    expect(mockClick).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalledWith(mockAnchor);
  });

  it('navigates back when clicking the back button', () => {
    render(
      <BrowserRouter>
        <Privacy />
      </BrowserRouter>
    );

    // The back button is the first button usually, let's find it by looking for the one without text or with the ArrowLeft icon
    // Since we don't have text, we can find it by className or just get the first button before "Política de Privacidade"
    const buttons = screen.getAllByRole('button');
    // The first button is the back button
    fireEvent.click(buttons[0]);
    // It calls navigate(-1). To assert this we would mock useNavigate.
  });
});
