import { Info } from 'lucide-react';
import type { SelectedSeat } from '../utils/types';
import { getSeatPrice, getPriceTierLabel, formatCurrency, getSeatLabel } from '../utils/seatHelpers';

interface SeatDetailsProps {
  seat: SelectedSeat | null;
}

export function SeatDetails({ seat }: SeatDetailsProps) {
  if (!seat) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Seat Details</h2>
        </div>
        <p className="text-gray-500 text-sm">Click on a seat to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Seat Details</h2>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</span>
          <p className="text-sm text-gray-900 mt-1">{getSeatLabel(seat)}</p>
        </div>

        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price Tier</span>
          <p className="text-sm text-gray-900 mt-1">{getPriceTierLabel(seat.priceTier)}</p>
        </div>

        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</span>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(getSeatPrice(seat.priceTier))}</p>
        </div>

        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              seat.status === 'available' ? 'bg-green-100 text-green-800' :
              seat.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
              seat.status === 'sold' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {seat.status.charAt(0).toUpperCase() + seat.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
