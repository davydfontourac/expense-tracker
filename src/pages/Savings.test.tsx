import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Savings from './Savings';
import { useSavings } from '@/hooks/useSavings';
import { useMobile } from '@/hooks/useMobile';

// Mock dependencies
vi.mock('@/hooks/useSavings', () => ({
  useSavings: vi.fn(),
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    summary: { caixinhaBalance: 500 },
    fetchTransactions: vi.fn(),
  }),
}));

vi.mock('@/hooks/useMobile', () => ({
  useMobile: vi.fn(),
}));

vi.mock('@/context/PrivacyContext', () => ({
  usePrivacy: () => ({ hideBalance: false }),
}));

vi.mock('@/components/SavingsForm', () => ({
  default: ({ isOpen, goal }: any) => isOpen ? <div data-testid="savings-form">Mock SavingsForm - {goal ? 'Edit' : 'New'}</div> : null,
}));

vi.mock('@/components/AporteModal', () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="aporte-modal">Mock AporteModal</div> : null,
}));

vi.mock('@/components/ConfirmModal', () => ({
  default: ({ isOpen, onConfirm }: any) => isOpen ? (
    <div data-testid="confirm-modal">
      Mock ConfirmModal
      <button onClick={onConfirm}>ConfirmDeleteBtn</button>
    </div>
  ) : null,
}));

const mockGoals = [
  {
    id: 'g1',
    name: 'Viagem',
    target_amount: 1000,
    current_amount: 200,
    icon: '✈️',
    color: '#3b82f6',
    target_date: '2025-12-31T00:00:00.000Z',
  },
  {
    id: 'g2',
    name: 'Carro',
    target_amount: 50000,
    current_amount: 0,
    icon: '🚗',
    color: '#10b981',
    target_date: null,
  },
];

const mockUseSavingsReturn = {
  goals: mockGoals,
  isLoading: false,
  fetchGoals: vi.fn(),
  upsertGoal: vi.fn(),
  deleteGoal: vi.fn(),
  addDeposit: vi.fn(),
};

describe('Savings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSavings as any).mockReturnValue(mockUseSavingsReturn);
    (useMobile as any).mockReturnValue(false); // Desktop by default
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Savings />
      </BrowserRouter>
    );

  describe('Desktop View', () => {
    it('renders goals and stats correctly', () => {
      renderComponent();
      expect(screen.getByText('Caixinhas')).toBeInTheDocument();
      expect(screen.getByText('Viagem')).toBeInTheDocument();
      expect(screen.getByText('Carro')).toBeInTheDocument();
      expect(screen.getByText('Nova caixinha')).toBeInTheDocument();
    });

    it('opens SavingsForm for a new goal when clicking Nova caixinha', () => {
      renderComponent();
      const newGoalBtn = screen.getByText('Nova caixinha');
      fireEvent.click(newGoalBtn);
      expect(screen.getByTestId('savings-form')).toHaveTextContent('Mock SavingsForm - New');
    });

    it('opens SavingsForm to edit an existing goal', () => {
      renderComponent();
      const editButtons = screen.getAllByText('Editar');
      fireEvent.click(editButtons[0]);
      expect(screen.getByTestId('savings-form')).toHaveTextContent('Mock SavingsForm - Edit');
    });

    it('opens AporteModal when clicking + Aportar', async () => {
      renderComponent();
      const aporteButtons = screen.getAllByText('+ Aportar');
      fireEvent.click(aporteButtons[0]);
      expect(await screen.findByTestId('aporte-modal')).toBeInTheDocument();
    });

    it('opens ConfirmModal when clicking Excluir and allows deletion', async () => {
      renderComponent();
      const deleteButtons = screen.getAllByText('Excluir');
      fireEvent.click(deleteButtons[0]);
      
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      
      const confirmBtn = screen.getByText('ConfirmDeleteBtn');
      await act(async () => {
        fireEvent.click(confirmBtn);
      });
      
      expect(mockUseSavingsReturn.deleteGoal).toHaveBeenCalledWith('g1');
    });

    it('shows empty state when there are no goals', () => {
      (useSavings as any).mockReturnValue({ ...mockUseSavingsReturn, goals: [] });
      renderComponent();
      expect(screen.getByText('Comece a guardar dinheiro criando sua primeira caixinha!')).toBeInTheDocument();
      
      const emptyBtn = screen.getByText('Comece a guardar dinheiro criando sua primeira caixinha!');
      fireEvent.click(emptyBtn);
      expect(screen.getByTestId('savings-form')).toHaveTextContent('Mock SavingsForm - New');
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      (useMobile as any).mockReturnValue(true);
    });

    it('renders mobile layout correctly', () => {
      renderComponent();
      expect(screen.getByText('TOTAL GUARDADO')).toBeInTheDocument();
      expect(screen.getByText('Suas caixinhas')).toBeInTheDocument();
    });

    it('opens SavingsForm for new goal in mobile header', () => {
      renderComponent();
      const addBtns = screen.getAllByRole('button');
      // The first button is the Plus button (Link is an 'a' tag)
      fireEvent.click(addBtns[0]);
      expect(screen.getByTestId('savings-form')).toHaveTextContent('Mock SavingsForm - New');
    });

    it('opens AporteModal when clicking a goal card in mobile', async () => {
      renderComponent();
      const goalCard = screen.getByText('Viagem').closest('button');
      fireEvent.click(goalCard!);
      expect(await screen.findByTestId('aporte-modal')).toBeInTheDocument();
    });
  });
});
