import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>

      <div className="px-2 py-1 text-xs font-medium text-gray-600 text-center border-y border-gray-200">
        {Math.round(scale * 100)}%
      </div>

      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>

      <div className="border-t border-gray-200 pt-2">
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
