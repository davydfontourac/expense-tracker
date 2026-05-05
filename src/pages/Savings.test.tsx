import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Savings from './Savings';

vi.mock('@/hooks/useSavings', () => ({
  useSavings: () => ({
    goals: [],
    isLoading: false,
    fetchGoals: vi.fn(),
    upsertGoal: vi.fn(),
    deleteGoal: vi.fn(),
    addDeposit: vi.fn()
  })
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    summary: { caixinhaBalance: 0 },
    fetchTransactions: vi.fn()
  })
}));

vi.mock('@/hooks/useMobile', () => ({
  useMobile: () => false
}));

vi.mock('@/context/PrivacyContext', () => ({
  usePrivacy: () => ({ hideBalance: false })
}));

vi.mock('@/components/SavingsForm', () => ({
  default: () => <div data-testid="savings-form">SavingsForm</div>
}));

describe('Savings Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Savings />
      </BrowserRouter>
    );
    expect(screen.getByText('Caixinhas')).toBeInTheDocument();
  });
});
