import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Terms from './Terms';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-markdown', () => ({
  default: () => <div data-testid="markdown-content">Markdown Content</div>
}));

vi.mock('@/components/PageTransition', () => ({
  default: ({ children }: any) => <div data-testid="page-transition">{children}</div>
}));

describe('Terms', () => {
  it('renders the terms of use page correctly', () => {
    render(
      <BrowserRouter>
        <Terms />
      </BrowserRouter>
    );

    expect(screen.getByText(/Termos de Uso/i)).toBeInTheDocument();
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });

  it('has a download button and handles download', () => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn();
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    const mockClick = vi.fn();

    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
    } as any;

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    const spyAppend = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    const spyRemove = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

    render(
      <BrowserRouter>
        <Terms />
      </BrowserRouter>
    );

    const downloadBtn = screen.getByText('Download MD').closest('button');
    if (downloadBtn) fireEvent.click(downloadBtn);

    expect(spyAppend).toHaveBeenCalledWith(mockAnchor);
    expect(mockClick).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalledWith(mockAnchor);
  });

  it('navigates back when clicking the back button', () => {
    render(
      <BrowserRouter>
        <Terms />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
  });
});
