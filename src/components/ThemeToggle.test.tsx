import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const mockSetTheme = vi.fn();
let mockTheme = 'system';

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = 'system';
  });

  it('renders correctly and opens dropdown on click', () => {
    render(<ThemeToggle />);
    const toggleBtn = screen.getByTitle('Alternar tema');
    expect(toggleBtn).toBeInTheDocument();

    // Dropdown is initially closed
    expect(screen.queryByText('Claro')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Claro')).toBeInTheDocument();
    expect(screen.getByText('Escuro')).toBeInTheDocument();
    expect(screen.getByText('Sistema')).toBeInTheDocument();
  });

  it('calls setTheme and closes dropdown when options are clicked', () => {
    render(<ThemeToggle />);
    const toggleBtn = screen.getByTitle('Alternar tema');

    // Click "Claro"
    fireEvent.click(toggleBtn);
    fireEvent.click(screen.getByText('Claro'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(screen.queryByText('Claro')).not.toBeInTheDocument();

    // Click "Escuro"
    fireEvent.click(toggleBtn);
    fireEvent.click(screen.getByText('Escuro'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(screen.queryByText('Escuro')).not.toBeInTheDocument();

    // Click "Sistema"
    fireEvent.click(toggleBtn);
    fireEvent.click(screen.getByText('Sistema'));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
    expect(screen.queryByText('Sistema')).not.toBeInTheDocument();
  });

  it('applies dropdownPosition and align props', () => {
    render(<ThemeToggle dropdownPosition="top" align="left" />);
    const toggleBtn = screen.getByTitle('Alternar tema');
    fireEvent.click(toggleBtn);

    const dropdown = screen.getByText('Claro').parentElement;
    expect(dropdown).toHaveClass('bottom-full');
    expect(dropdown).toHaveClass('left-0');
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside Element</div>
        <ThemeToggle />
      </div>
    );
    const toggleBtn = screen.getByTitle('Alternar tema');

    fireEvent.click(toggleBtn);
    expect(screen.getByText('Claro')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Claro')).not.toBeInTheDocument();
  });
});
