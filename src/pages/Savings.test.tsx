import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Savings from './Savings';

vi.mock('@/hooks/useSavings', () => ({
  useSavings: () => ({
    savings: [],
    isLoading: false,
    summary: { total: 0, monthlyContribution: 0, projectedYearly: 0 },
    fetchSavings: vi.fn(),
    addSaving: vi.fn(),
    updateSaving: vi.fn(),
    deleteSaving: vi.fn()
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
    expect(screen.getByText('Minhas Economias')).toBeInTheDocument();
  });
});
