export type SeatStatus = 'available' | 'reserved' | 'sold' | 'held';

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: number;
  status: SeatStatus;
}

export interface Row {
  index: number;
  seats: Seat[];
}

export interface Section {
  id: string;
  label: string;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
  rows: Row[];
}

export interface VenueMap {
  width: number;
  height: number;
}

export interface VenueData {
  venueId: string;
  name: string;
  map: VenueMap;
  sections: Section[];
}

export interface SelectedSeat extends Seat {
  section: string;
  row: number;
}

export interface PriceTier {
  tier: number;
  price: number;
  label: string;
}

export const PRICE_TIERS: PriceTier[] = [
  { tier: 1, price: 250, label: 'Premium' },
  { tier: 2, price: 150, label: 'Gold' },
  { tier: 3, price: 100, label: 'Silver' },
  { tier: 4, price: 75, label: 'Bronze' },
  { tier: 5, price: 50, label: 'General' },
];

export const MAX_SEATS = 8;
