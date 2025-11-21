import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeatSummary } from '../../components/SeatSummary';
import type { SelectedSeat } from '../../utils/types';

describe('SeatSummary', () => {
  const mockSeats: SelectedSeat[] = [
    {
      id: 'A-1-01',
      col: 1,
      x: 50,
      y: 40,
      priceTier: 1,
      status: 'available',
      section: 'A',
      row: 1,
    },
    {
      id: 'A-1-02',
      col: 2,
      x: 80,
      y: 40,
      priceTier: 1,
      status: 'available',
      section: 'A',
      row: 1,
    },
  ];

  it('displays message when no seats are selected', () => {
    const onRemoveSeat = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <SeatSummary
        selectedSeats={[]}
        total={0}
        onRemoveSeat={onRemoveSeat}
        onClearSelection={onClearSelection}
      />
    );

    expect(screen.getByText('No seats selected yet')).toBeInTheDocument();
  });

  it('displays selected seats count', () => {
    const onRemoveSeat = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <SeatSummary
        selectedSeats={mockSeats}
        total={500}
        onRemoveSeat={onRemoveSeat}
        onClearSelection={onClearSelection}
      />
    );

    expect(screen.getByText('2 / 8')).toBeInTheDocument();
  });

  it('displays total price correctly', () => {
    const onRemoveSeat = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <SeatSummary
        selectedSeats={mockSeats}
        total={500}
        onRemoveSeat={onRemoveSeat}
        onClearSelection={onClearSelection}
      />
    );

    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('calls onRemoveSeat when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveSeat = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <SeatSummary
        selectedSeats={mockSeats}
        total={500}
        onRemoveSeat={onRemoveSeat}
        onClearSelection={onClearSelection}
      />
    );

    const removeButtons = screen.getAllByLabelText(/Remove Section A/);
    await user.click(removeButtons[0]);

    expect(onRemoveSeat).toHaveBeenCalledWith('A-1-01');
  });

  it('calls onClearSelection when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveSeat = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <SeatSummary
        selectedSeats={mockSeats}
        total={500}
        onRemoveSeat={onRemoveSeat}
        onClearSelection={onClearSelection}
      />
    );

    const clearButton = screen.getByText('Clear Selection');
    await user.click(clearButton);

    expect(onClearSelection).toHaveBeenCalled();
  });

  it('displays all selected seats', () => {
    const onRemoveSeat = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <SeatSummary
        selectedSeats={mockSeats}
        total={500}
        onRemoveSeat={onRemoveSeat}
        onClearSelection={onClearSelection}
      />
    );

    expect(screen.getByText('Section A, Row 1, Seat 1')).toBeInTheDocument();
    expect(screen.getByText('Section A, Row 1, Seat 2')).toBeInTheDocument();
  });
});
