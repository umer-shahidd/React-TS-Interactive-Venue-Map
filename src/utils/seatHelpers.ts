import { PRICE_TIERS, type SelectedSeat, type SeatStatus } from './types';

export function getSeatPrice(priceTier: number): number {
  const tier = PRICE_TIERS.find(t => t.tier === priceTier);
  return tier?.price ?? 0;
}

export function getPriceTierLabel(priceTier: number): string {
  const tier = PRICE_TIERS.find(t => t.tier === priceTier);
  return tier?.label ?? 'Unknown';
}

export function calculateTotal(seats: SelectedSeat[]): number {
  return seats.reduce((sum, seat) => sum + getSeatPrice(seat.priceTier), 0);
}

export function getSeatColor(status: SeatStatus, isSelected: boolean): string {
  if (isSelected) return '#3b82f6';

  switch (status) {
    case 'available':
      return '#10b981';
    case 'reserved':
      return '#f59e0b';
    case 'sold':
      return '#ef4444';
    case 'held':
      return '#6b7280';
    default:
      return '#9ca3af';
  }
}

export function getSeatStrokeColor(status: SeatStatus, isSelected: boolean): string {
  if (isSelected) return '#1e40af';

  switch (status) {
    case 'available':
      return '#059669';
    case 'reserved':
      return '#d97706';
    case 'sold':
      return '#b91c1c';
    case 'held':
      return '#4b5563';
    default:
      return '#6b7280';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getSeatLabel(seat: SelectedSeat): string {
  return `Section ${seat.section}, Row ${seat.row}, Seat ${seat.col}`;
}
