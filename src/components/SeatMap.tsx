import { memo, useCallback, useRef, useEffect, useState } from 'react';
import type { VenueData, Seat as SeatType, SelectedSeat } from '../utils/types';
import { Seat } from './Seat';
import { ZoomControls } from './ZoomControls';
import { usePanZoom } from '../hooks/usePanZoom';

interface SeatMapProps {
  venue: VenueData;
  selectedSeats: SelectedSeat[];
  canSelectMore: boolean;
  onSeatClick: (seat: SelectedSeat) => void;
  onSeatHover: (seat: SelectedSeat | null) => void;
}

export const SeatMap = memo(function SeatMap({
  venue,
  selectedSeats,
  canSelectMore,
  onSeatClick,
  onSeatHover,
}: SeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const hoverTimeoutRef = useRef<number>();

  const {
    scale,
    translateX,
    translateY,
    zoomIn,
    zoomOut,
    resetZoom,
    handleMouseDown,
    handleWheel,
  } = usePanZoom(dimensions.width, dimensions.height);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false });
      return () => svg.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleSeatClick = useCallback((seat: SeatType, section: string, row: number) => {
    onSeatClick({ ...seat, section, row });
  }, [onSeatClick]);

  const handleSeatMouseEnter = useCallback((seat: SeatType, section: string, row: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      onSeatHover({ ...seat, section, row });
    }, 100);
  }, [onSeatHover]);

  const handleSeatMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      onSeatHover(null);
    }, 100);
  }, [onSeatHover]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const isSeatSelected = useCallback((seatId: string) => {
    return selectedSeats.some(s => s.id === seatId);
  }, [selectedSeats]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        role="application"
        aria-label="Interactive seating map"
      >
        <g transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
          <rect
            width={venue.map.width}
            height={venue.map.height}
            fill="#f8fafc"
          />

          {venue.sections.map(section => (
            <g
              key={section.id}
              transform={`translate(${section.transform.x}, ${section.transform.y}) scale(${section.transform.scale})`}
            >
              <text
                x="20"
                y="20"
                className="text-sm font-semibold fill-gray-700"
                fontSize="14"
              >
                {section.label}
              </text>

              {section.rows.map(row => (
                <g key={`${section.id}-${row.index}`}>
                  {row.seats.map(seat => (
                    <g
                      key={seat.id}
                      onMouseEnter={() => handleSeatMouseEnter(seat, section.id, row.index)}
                      onMouseLeave={handleSeatMouseLeave}
                    >
                      <Seat
                        seat={seat}
                        isSelected={isSeatSelected(seat.id)}
                        canSelect={canSelectMore}
                        onSelect={(s) => handleSeatClick(s, section.id, row.index)}
                        section={section.id}
                        row={row.index}
                      />
                    </g>
                  ))}
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>

      <ZoomControls
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
      />

      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700"></div>
            <span className="text-xs text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-700"></div>
            <span className="text-xs text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-700"></div>
            <span className="text-xs text-gray-600">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-700"></div>
            <span className="text-xs text-gray-600">Sold</span>
          </div>
        </div>
      </div>
    </div>
  );
});
