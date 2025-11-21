import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSeatSelection } from '../../hooks/useSeatSelection';
import type { SelectedSeat } from '../../utils/types';

describe('useSeatSelection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockSeat1: SelectedSeat = {
    id: 'A-1-01',
    col: 1,
    x: 50,
    y: 40,
    priceTier: 1,
    status: 'available',
    section: 'A',
    row: 1,
  };

  const mockSeat2: SelectedSeat = {
    id: 'A-1-02',
    col: 2,
    x: 80,
    y: 40,
    priceTier: 1,
    status: 'available',
    section: 'A',
    row: 1,
  };

  it('starts with empty selection', () => {
    const { result } = renderHook(() => useSeatSelection());

    expect(result.current.selectedSeats).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.canSelectMore).toBe(true);
  });

  it('toggles seat selection', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat(mockSeat1);
    });

    expect(result.current.selectedSeats).toHaveLength(1);
    expect(result.current.isSeatSelected('A-1-01')).toBe(true);
  });

  it('deselects seat when toggled again', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat(mockSeat1);
    });

    expect(result.current.selectedSeats).toHaveLength(1);

    act(() => {
      result.current.toggleSeat(mockSeat1);
    });

    expect(result.current.selectedSeats).toHaveLength(0);
    expect(result.current.isSeatSelected('A-1-01')).toBe(false);
  });

  it('calculates total price correctly', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat(mockSeat1);
      result.current.toggleSeat(mockSeat2);
    });

    expect(result.current.total).toBe(500);
  });

  it('enforces max seat limit', () => {
    const { result } = renderHook(() => useSeatSelection());

    const seats: SelectedSeat[] = Array.from({ length: 10 }, (_, i) => ({
      id: `A-1-${String(i + 1).padStart(2, '0')}`,
      col: i + 1,
      x: 50 + i * 30,
      y: 40,
      priceTier: 1,
      status: 'available' as const,
      section: 'A',
      row: 1,
    }));

    act(() => {
      seats.forEach(seat => result.current.toggleSeat(seat));
    });

    expect(result.current.selectedSeats).toHaveLength(8);
    expect(result.current.canSelectMore).toBe(false);
  });

  it('removes specific seat', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat(mockSeat1);
      result.current.toggleSeat(mockSeat2);
    });

    expect(result.current.selectedSeats).toHaveLength(2);

    act(() => {
      result.current.removeSeat('A-1-01');
    });

    expect(result.current.selectedSeats).toHaveLength(1);
    expect(result.current.isSeatSelected('A-1-01')).toBe(false);
    expect(result.current.isSeatSelected('A-1-02')).toBe(true);
  });

  it('clears all selections', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat(mockSeat1);
      result.current.toggleSeat(mockSeat2);
    });

    expect(result.current.selectedSeats).toHaveLength(2);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedSeats).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it('persists selection to localStorage', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat(mockSeat1);
    });

    const stored = localStorage.getItem('selected-seats');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('A-1-01');
  });

  it('loads selection from localStorage', () => {
    localStorage.setItem('selected-seats', JSON.stringify([mockSeat1]));

    const { result } = renderHook(() => useSeatSelection());

    expect(result.current.selectedSeats).toHaveLength(1);
    expect(result.current.isSeatSelected('A-1-01')).toBe(true);
  });
});
