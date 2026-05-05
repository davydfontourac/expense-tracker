import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AporteModal from './AporteModal';
import { vi } from 'vitest';

describe('AporteModal', () => {
  const mockGoal = {
    id: '1',
    name: 'Carro Novo',
    target_amount: 50000,
    current_amount: 10000,
    target_date: null,
    icon: '🚗',
    color: '#000000'
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn().mockResolvedValue(true),
    goal: mockGoal
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<AporteModal {...defaultProps} />);
    
    expect(screen.getByText('Fazer Aporte')).toBeInTheDocument();
    expect(screen.getByText('Carro Novo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0,00')).toBeInTheDocument();
  });

  it('returns null when not open', () => {
    const { container } = render(<AporteModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<AporteModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables submit button when amount is empty', () => {
    render(<AporteModal {...defaultProps} />);
    
    const submitButton = screen.getByText('Confirmar');
    expect(submitButton).toBeDisabled();
  });

  it('calls onConfirm with correct values and closes modal on success', async () => {
    render(<AporteModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('0,00');
    fireEvent.change(input, { target: { value: '150.50' } });
    
    const submitButton = screen.getByText('Confirmar');
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith('1', 150.5);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('does not close modal if onConfirm returns false', async () => {
    const onConfirmFail = vi.fn().mockResolvedValue(false);
    render(<AporteModal {...defaultProps} onConfirm={onConfirmFail} />);
    
    const input = screen.getByPlaceholderText('0,00');
    fireEvent.change(input, { target: { value: '150.50' } });
    
    fireEvent.click(screen.getByText('Confirmar'));
    
    await waitFor(() => {
      expect(onConfirmFail).toHaveBeenCalledWith('1', 150.5);
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });
});
