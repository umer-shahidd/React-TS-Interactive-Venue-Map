import { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';
import { SeatMap } from './components/SeatMap';
import { SeatDetails } from './components/SeatDetails';
import { SeatSummary } from './components/SeatSummary';
import { useSeatSelection } from './hooks/useSeatSelection';
import type { VenueData, SelectedSeat } from './utils/types';

function App() {
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<SelectedSeat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedSeats,
    isSeatSelected,
    toggleSeat,
    removeSeat,
    clearSelection,
    canSelectMore,
    total,
  } = useSeatSelection();

  useEffect(() => {
    fetch('/venue.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load venue data');
        }
        return response.json();
      })
      .then(data => {
        setVenue(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue map...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error: {error || 'Venue data not available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Ticket className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{venue.name}</h1>
              <p className="text-sm text-gray-500">Select your seats {selectedSeats.length > 0 && `(${selectedSeats.length} selected)`}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          <div className="lg:col-span-3 h-full">
            <SeatMap
              venue={venue}
              selectedSeats={selectedSeats}
              canSelectMore={canSelectMore}
              onSeatClick={toggleSeat}
              onSeatHover={setHoveredSeat}
            />
          </div>

          <div className="lg:col-span-1 space-y-6 h-full overflow-y-auto">
            <SeatDetails seat={hoveredSeat || (selectedSeats.length > 0 ? selectedSeats[selectedSeats.length - 1] : null)} />
            <SeatSummary
              selectedSeats={selectedSeats}
              total={total}
              onRemoveSeat={removeSeat}
              onClearSelection={clearSelection}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
