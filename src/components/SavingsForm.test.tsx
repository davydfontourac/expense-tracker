import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SavingsForm from './SavingsForm';

describe('SavingsForm Component', () => {
  it('renders correctly when open', () => {
    render(
      <SavingsForm isOpen={true} onClose={vi.fn()} onConfirm={vi.fn().mockResolvedValue(true)} />
    );
    expect(screen.getByText(/Nova Caixinha|Editar Caixinha/i)).toBeInTheDocument();
  });
});
