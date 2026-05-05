import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MonthYearPicker } from './MonthYearPicker';

describe('MonthYearPicker Component', () => {
  it('renders with initial label correctly', () => {
    const handleChange = vi.fn();
    render(<MonthYearPicker month="5" year="2026" onChange={handleChange} />);

    expect(screen.getByText('Maio 2026')).toBeInTheDocument();
  });

  it('opens dropdown on click and displays months', () => {
    const handleChange = vi.fn();
    render(<MonthYearPicker month="5" year="2026" onChange={handleChange} />);

    // Click to open dropdown
    fireEvent.click(screen.getByText('Maio 2026'));

    // Check that months are displayed
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Dez')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('handles year change buttons', () => {
    const handleChange = vi.fn();
    render(<MonthYearPicker month="5" year="2026" onChange={handleChange} />);

    fireEvent.click(screen.getByText('Maio 2026'));

    // Prev year button
    const buttons = screen.getAllByRole('button');
    // ChevronLeft is typically the first button in the header
    fireEvent.click(buttons[1]); // buttons[0] is the main picker chip trigger, buttons[1] is chevron left, buttons[2] is chevron right
    expect(handleChange).toHaveBeenLastCalledWith('5', '2025');

    // Next year button
    fireEvent.click(buttons[2]);
    expect(handleChange).toHaveBeenLastCalledWith('5', '2027');
  });

  it('calls onChange and closes dropdown when month is clicked', () => {
    const handleChange = vi.fn();
    render(<MonthYearPicker month="5" year="2026" onChange={handleChange} />);

    fireEvent.click(screen.getByText('Maio 2026'));

    // Click Jan (index 0 -> month "1")
    fireEvent.click(screen.getByText('Jan'));
    expect(handleChange).toHaveBeenCalledWith('1', '2026');
    expect(screen.queryByText('Jan')).not.toBeInTheDocument(); // closed
  });

  it('calls onChange with current date when Ir para hoje is clicked', () => {
    const handleChange = vi.fn();
    render(<MonthYearPicker month="5" year="2026" onChange={handleChange} />);

    fireEvent.click(screen.getByText('Maio 2026'));

    fireEvent.click(screen.getByText('Ir para hoje'));

    const now = new Date();
    const expectedMonth = String(now.getMonth() + 1);
    const expectedYear = String(now.getFullYear());

    expect(handleChange).toHaveBeenCalledWith(expectedMonth, expectedYear);
    expect(screen.queryByText('Ir para hoje')).not.toBeInTheDocument(); // closed
  });

  it('closes dropdown when clicking outside', () => {
    const handleChange = vi.fn();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <MonthYearPicker month="5" year="2026" onChange={handleChange} />
      </div>
    );

    fireEvent.click(screen.getByText('Maio 2026'));
    expect(screen.getByText('Jan')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Jan')).not.toBeInTheDocument();
  });
});
