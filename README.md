# Event Seating Map Application

A high-performance, interactive event seating map built with React, TypeScript, and SVG. Designed to handle 15,000+ seats with smooth 60fps performance, full accessibility, and mobile responsiveness.

## Features

- **High Performance**: Efficiently renders 21,800+ seats without lag
- **Interactive Map**: Click, hover, pan, and zoom controls
- **Seat Selection**: Select up to 8 seats with real-time price calculation
- **Accessibility**: Full keyboard navigation, ARIA labels, and focus management
- **Persistence**: Selected seats saved to localStorage
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **Testing**: Comprehensive unit tests (Vitest) and E2E tests (Playwright)

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Vite** for blazing-fast development
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Vitest + React Testing Library** for unit tests
- **Playwright** for E2E tests
- **SVG** for high-performance map rendering

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

### Unit Tests

```bash
npm test              # Run tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate coverage report
```

### E2E Tests

```bash
npm run e2e          # Run Playwright tests
npm run e2e:ui       # Open Playwright UI
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Seat.tsx        # Individual seat component (memoized)
│   ├── SeatMap.tsx     # Main map container with pan/zoom
│   ├── SeatDetails.tsx # Seat information panel
│   ├── SeatSummary.tsx # Selection summary and checkout
│   └── ZoomControls.tsx # Zoom in/out/reset controls
├── hooks/              # Custom React hooks
│   ├── useSeatSelection.ts  # Seat selection logic
│   ├── useLocalStorage.ts   # localStorage persistence
│   └── usePanZoom.ts        # Pan and zoom controls
├── utils/              # Utility functions
│   ├── types.ts        # TypeScript interfaces
│   └── seatHelpers.ts  # Helper functions (price, color, format)
├── tests/              # Unit tests
│   ├── components/     # Component tests
│   └── hooks/          # Hook tests
└── App.tsx             # Main application component

e2e/                    # E2E tests
scripts/                # Build scripts
public/                 # Static assets
  └── venue.json        # Venue data (21,800 seats)
```

## Architecture Decisions

### Performance Optimizations

#### 1. React.memo for Seat Components
Each seat is wrapped in `React.memo` to prevent unnecessary re-renders. Only changed seats re-render when the selection state updates.

```typescript
export const Seat = memo(function Seat({ ... }) { ... });
```

#### 2. Efficient State Management
- Used `useCallback` for event handlers to maintain referential equality
- Used `useMemo` for expensive calculations (total price, selection status)
- Minimized state updates to only affected components

#### 3. SVG Rendering Strategy
- SVG chosen over Canvas for better accessibility and DOM integration
- Seats rendered as SVG circles with minimal attributes
- CSS classes used for styling to reduce inline styles
- Transform groups for efficient section positioning

#### 4. Virtualization Not Needed
While the venue has 21,800 seats, SVG handles this efficiently because:
- Circles are lightweight DOM elements
- Browser optimizations for SVG rendering
- Proper use of `React.memo` prevents cascading updates
- Only interactive seats need event handlers

#### 5. LocalStorage for Persistence
Selected seats persisted to localStorage with efficient serialization:
- Automatic save on every selection change
- Loaded on mount to restore user's session
- Handles cross-tab synchronization

### Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Management**: Visible focus rings and logical tab order
- **Semantic HTML**: Proper button roles and interactive elements

### Responsive Design

- **Desktop**: Two-column layout (70% map, 30% details)
- **Tablet**: Adaptive grid layout
- **Mobile**: Full-screen map with bottom sheet for details


## Generating Venue Data

To regenerate the venue data with different parameters:

```bash
npm run generate:venue
```

Edit `scripts/generateVenue.ts` to customize:
- Number of sections
- Seats per row
- Number of rows
- Seat spacing
- Price tiers

