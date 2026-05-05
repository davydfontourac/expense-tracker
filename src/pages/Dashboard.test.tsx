import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { usePrivacy } from '@/context/PrivacyContext';
import { useMobile } from '@/hooks/useMobile';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/context/PrivacyContext', () => ({
  usePrivacy: vi.fn(),
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: vi.fn(),
}));

vi.mock('@/hooks/useMobile', () => ({
  useMobile: vi.fn(),
}));

vi.mock('@/components/TransactionForm', () => ({
  default: ({ isOpen, onClose, initialType }: any) =>
    isOpen ? (
      <div data-testid="transaction-form">
        Mock Form {initialType}
        <button onClick={onClose}>Close Form</button>
      </div>
    ) : null,
}));

vi.mock('@/components/ImportWizard/ImportWizard', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="import-wizard">
        Mock Import
        <button onClick={onClose}>Close Import</button>
      </div>
    ) : null,
}));

const mockTransactions = [
  { id: '1', description: 'Mercado', amount: -100, date: new Date().toISOString(), type: 'expense', categories: { name: 'Alimentação' } },
  { id: '2', description: 'Salário', amount: 5000, date: new Date().toISOString(), type: 'income', categories: { name: 'Salário' } },
];

const mockSummary = {
  totalIncome: 5000,
  totalExpense: 100,
  availableBalance: 4900,
  caixinhaBalance: 0,
};

const mockHistory = [
  { month: 'Abr', fullMonth: 4, year: 2026, income: 5000, expense: 100 },
];

const mockFetchTransactions = vi.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      profile: { full_name: 'Test User', avatar_url: '' },
      isLoading: false,
    });

    (usePrivacy as any).mockReturnValue({
      hideBalance: false,
    });

    (useTransactions as any).mockReturnValue({
      transactions: mockTransactions,
      summary: mockSummary,
      history: mockHistory,
      isLoading: false,
      fetchTransactions: mockFetchTransactions,
    });

    (useMobile as any).mockReturnValue(false); // Desktop by default
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

  describe('Loading State', () => {
    it('shows loading spinner when fetching', () => {
      (useTransactions as any).mockReturnValue({
        transactions: [],
        isLoading: true,
      });
      const { container } = renderComponent();
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Desktop View', () => {
    it('renders greeting, metrics and transactions', () => {
      renderComponent();
      expect(screen.getByText(/Test/)).toBeInTheDocument();
      expect(screen.getByText('Mercado')).toBeInTheDocument();
      expect(screen.getAllByText('Salário').length).toBeGreaterThan(0);
      expect(screen.getByText('Nova transação')).toBeInTheDocument();
    });

    it('toggles privacy mode', async () => {
      renderComponent();
      // Click all eye buttons just to be sure
      const eyeButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg.lucide-eye') || b.querySelector('svg.lucide-eye-off'));
      eyeButtons.forEach(b => fireEvent.click(b));
      
      await waitFor(() => expect(screen.getAllByText('R$ 4.900,00')[0]).toHaveClass('blur-md'));
    });

    it('handles filter by type', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Receitas', { selector: 'button' }));
      fireEvent.click(screen.getByText('Despesas', { selector: 'button' }));
      fireEvent.click(screen.getByText('Todos', { selector: 'button' }));
      // We are just verifying that buttons don't crash and click logic fires.
    });

    it('handles search input and clear search', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Buscar por descrição...');
      fireEvent.change(searchInput, { target: { value: 'teste' } });
      await waitFor(() => expect(searchInput).toHaveValue('teste'));

      // Now the X button should appear
      const xSvg = document.querySelector('svg.lucide-x');
      if (xSvg) fireEvent.click(xSvg);
      await waitFor(() => expect(searchInput).toHaveValue(''));

      // Clear all filters button
      fireEvent.click(screen.getByText('Limpar filtros'));
      await waitFor(() => expect(searchInput).toHaveValue(''));
    });

    it('opens and closes transaction modal', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Nova transação'));
      expect(await screen.findByTestId('transaction-form')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Close Form'));
      await waitFor(() => expect(screen.queryByTestId('transaction-form')).not.toBeInTheDocument());
    });

    it('opens import modal', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Importar CSV'));
      expect(await screen.findByTestId('import-wizard')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Close Import'));
    });

    it('opens edit modal when clicking a transaction', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Mercado'));
      expect(await screen.findByTestId('transaction-form')).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      (useMobile as any).mockReturnValue(true);
    });

    it('renders mobile specific layout', () => {
      renderComponent();
      expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
      expect(screen.getByText('Saldo ·', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Importar dados do banco')).toBeInTheDocument();
    });

    it('toggles privacy mode in mobile', () => {
      renderComponent();
      const eyeButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg.lucide-eye') || b.querySelector('svg.lucide-eye-off'));
      fireEvent.click(eyeButtons[0]);
      expect(screen.getByText('R$ 4.900,00')).toHaveClass('blur-md');
    });

    it('opens specific modals by type', async () => {
      renderComponent();
      
      // Receitas
      fireEvent.click(screen.getAllByText('Receitas', { selector: 'span' })[0].closest('button')!);
      expect(await screen.findByText(/Mock Form income/)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Close Form'));
      
      // Despesas
      fireEvent.click(screen.getAllByText('Despesas', { selector: 'span' })[0].closest('button')!);
      expect(await screen.findByText(/Mock Form expense/)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Close Form'));
      
      // Transf.
      fireEvent.click(screen.getAllByText('Transf.', { selector: 'span' })[0].closest('button')!);
      expect(await screen.findByText(/Mock Form transfer_out/)).toBeInTheDocument();
    });

    it('opens import modal from mobile shortcut', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Importar dados do banco').closest('button')!);
      expect(await screen.findByTestId('import-wizard')).toBeInTheDocument();
    });
  });
});
