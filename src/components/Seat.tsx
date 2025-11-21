import { memo, useCallback } from 'react';
import type { Seat as SeatType } from '../utils/types';
import { getSeatColor, getSeatStrokeColor } from '../utils/seatHelpers';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  canSelect: boolean;
  onSelect: (seat: SeatType) => void;
  section: string;
  row: number;
}

const SEAT_RADIUS = 6;

export const Seat = memo(function Seat({ seat, isSelected, canSelect, onSelect, section, row }: SeatProps) {
  const handleClick = useCallback(() => {
    if (seat.status === 'available' && (canSelect || isSelected)) {
      onSelect(seat);
    }
  }, [seat, canSelect, isSelected, onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && seat.status === 'available' && (canSelect || isSelected)) {
      e.preventDefault();
      onSelect(seat);
    }
  }, [seat, canSelect, isSelected, onSelect]);

  const isInteractive = seat.status === 'available';
  const fillColor = getSeatColor(seat.status, isSelected);
  const strokeColor = getSeatStrokeColor(seat.status, isSelected);

  return (
    <circle
      cx={seat.x}
      cy={seat.y}
      r={SEAT_RADIUS}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={isSelected ? 2.5 : 1.5}
      className={isInteractive ? 'cursor-pointer transition-all hover:opacity-80' : 'cursor-not-allowed'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : -1}
      role="button"
      aria-label={`Section ${section}, Row ${row}, Seat ${seat.col}, ${seat.status}, ${isSelected ? 'selected' : 'not selected'}`}
      aria-pressed={isSelected}
      aria-disabled={!isInteractive || (!canSelect && !isSelected)}
      data-seat-id={seat.id}
      data-testid={`seat-${seat.id}`}
    />
  );
});
