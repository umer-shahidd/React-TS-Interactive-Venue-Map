import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { MAX_SEATS, type SelectedSeat } from '../utils/types';
import { calculateTotal } from '../utils/seatHelpers';

export function useSeatSelection() {
  const [selectedSeats, setSelectedSeats] = useLocalStorage<SelectedSeat[]>('selected-seats', []);

  const isSeatSelected = useCallback((seatId: string): boolean => {
    return selectedSeats.some(seat => seat.id === seatId);
  }, [selectedSeats]);

  const toggleSeat = useCallback((seat: SelectedSeat) => {
    setSelectedSeats(current => {
      const isSelected = current.some(s => s.id === seat.id);

      if (isSelected) {
        return current.filter(s => s.id !== seat.id);
      }

      if (current.length >= MAX_SEATS) {
        return current;
      }

      return [...current, seat];
    });
  }, [setSelectedSeats]);

  const removeSeat = useCallback((seatId: string) => {
    setSelectedSeats(current => current.filter(s => s.id !== seatId));
  }, [setSelectedSeats]);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, [setSelectedSeats]);

  const canSelectMore = useMemo(() => {
    return selectedSeats.length < MAX_SEATS;
  }, [selectedSeats.length]);

  const total = useMemo(() => {
    return calculateTotal(selectedSeats);
  }, [selectedSeats]);

  return {
    selectedSeats,
    isSeatSelected,
    toggleSeat,
    removeSeat,
    clearSelection,
    canSelectMore,
    total,
  };
}
