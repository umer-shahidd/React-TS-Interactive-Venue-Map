import { ShoppingCart, X } from 'lucide-react';
import type { SelectedSeat } from '../utils/types';
import { formatCurrency, getSeatLabel, getSeatPrice } from '../utils/seatHelpers';
import { MAX_SEATS } from '../utils/types';

interface SeatSummaryProps {
  selectedSeats: SelectedSeat[];
  total: number;
  onRemoveSeat: (seatId: string) => void;
  onClearSelection: () => void;
}

export function SeatSummary({ selectedSeats, total, onRemoveSeat, onClearSelection }: SeatSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Selected Seats</h2>
          </div>
          <span className="text-sm text-blue-100">
            {selectedSeats.length} / {MAX_SEATS}
          </span>
        </div>
      </div>

      <div className="p-6">
        {selectedSeats.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No seats selected yet</p>
        ) : (
          <>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {selectedSeats.map(seat => (
                <div
                  key={seat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getSeatLabel(seat)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(getSeatPrice(seat.priceTier))}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveSeat(seat.id)}
                    className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label={`Remove ${getSeatLabel(seat)}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={selectedSeats.length === 0}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={onClearSelection}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  disabled={selectedSeats.length === 0}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
