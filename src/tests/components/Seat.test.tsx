import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Seat } from '../../components/Seat';
import type { Seat as SeatType } from '../../utils/types';

describe('Seat', () => {
  const mockSeat: SeatType = {
    id: 'A-1-01',
    col: 1,
    x: 50,
    y: 40,
    priceTier: 1,
    status: 'available',
  };

  it('renders a seat at correct position', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <svg>
        <Seat
          seat={mockSeat}
          isSelected={false}
          canSelect={true}
          onSelect={onSelect}
          section="A"
          row={1}
        />
      </svg>
    );

    const circle = container.querySelector('circle');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute('cx', '50');
    expect(circle).toHaveAttribute('cy', '40');
  });

  it('calls onSelect when available seat is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <svg>
        <Seat
          seat={mockSeat}
          isSelected={false}
          canSelect={true}
          onSelect={onSelect}
          section="A"
          row={1}
        />
      </svg>
    );

    const seat = screen.getByTestId('seat-A-1-01');
    await user.click(seat);

    expect(onSelect).toHaveBeenCalledWith(mockSeat);
  });

  it('does not call onSelect when sold seat is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const soldSeat = { ...mockSeat, status: 'sold' as const };

    render(
      <svg>
        <Seat
          seat={soldSeat}
          isSelected={false}
          canSelect={true}
          onSelect={onSelect}
          section="A"
          row={1}
        />
      </svg>
    );

    const seat = screen.getByTestId('seat-A-1-01');
    await user.click(seat);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation with Enter key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <svg>
        <Seat
          seat={mockSeat}
          isSelected={false}
          canSelect={true}
          onSelect={onSelect}
          section="A"
          row={1}
        />
      </svg>
    );

    const seat = screen.getByTestId('seat-A-1-01');
    seat.focus();
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith(mockSeat);
  });

  it('displays correct aria-label', () => {
    const onSelect = vi.fn();

    render(
      <svg>
        <Seat
          seat={mockSeat}
          isSelected={false}
          canSelect={true}
          onSelect={onSelect}
          section="A"
          row={1}
        />
      </svg>
    );

    const seat = screen.getByTestId('seat-A-1-01');
    expect(seat).toHaveAttribute(
      'aria-label',
      'Section A, Row 1, Seat 1, available, not selected'
    );
  });

  it('shows selected state correctly', () => {
    const onSelect = vi.fn();

    render(
      <svg>
        <Seat
          seat={mockSeat}
          isSelected={true}
          canSelect={true}
          onSelect={onSelect}
          section="A"
          row={1}
        />
      </svg>
    );

    const seat = screen.getByTestId('seat-A-1-01');
    expect(seat).toHaveAttribute('aria-pressed', 'true');
  });
});
