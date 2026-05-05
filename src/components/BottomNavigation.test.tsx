import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

// Mock TransactionForm to avoid testing its implementation here
vi.mock('./TransactionForm', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
    isOpen ? (
      <div data-testid="transaction-form">
        <button onClick={onClose} data-testid="close-form">Close</button>
      </div>
    ) : null
}));

describe('BottomNavigation', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <BottomNavigation />
      </BrowserRouter>
    );
  };

  it('renders all navigation items', () => {
    renderComponent();
    
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Transaç')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
    expect(screen.getByText('Categ')).toBeInTheDocument();
    expect(screen.getByText('Conta')).toBeInTheDocument();
  });

  it('opens TransactionForm when NOVO is clicked', () => {
    renderComponent();
    
    expect(screen.queryByTestId('transaction-form')).not.toBeInTheDocument();
    
    const novoButton = screen.getByText('Novo').closest('button');
    fireEvent.click(novoButton!);
    
    expect(screen.getByTestId('transaction-form')).toBeInTheDocument();
  });

  it('closes TransactionForm when close is triggered', () => {
    renderComponent();
    
    const novoButton = screen.getByText('Novo').closest('button');
    fireEvent.click(novoButton!);
    
    expect(screen.getByTestId('transaction-form')).toBeInTheDocument();
    
    const closeButton = screen.getByTestId('close-form');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('transaction-form')).not.toBeInTheDocument();
  });
});
