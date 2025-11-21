import * as fs from 'fs';
import * as path from 'path';

interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: number;
  status: 'available' | 'reserved' | 'sold' | 'held';
}

interface Row {
  index: number;
  seats: Seat[];
}

interface Section {
  id: string;
  label: string;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
  rows: Row[];
}

interface VenueData {
  venueId: string;
  name: string;
  map: {
    width: number;
    height: number;
  };
  sections: Section[];
}

const STATUSES: Array<'available' | 'reserved' | 'sold' | 'held'> = ['available', 'reserved', 'sold', 'held'];
const STATUS_WEIGHTS = [0.7, 0.15, 0.1, 0.05];

function getRandomStatus(): 'available' | 'reserved' | 'sold' | 'held' {
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < STATUSES.length; i++) {
    cumulative += STATUS_WEIGHTS[i];
    if (random < cumulative) {
      return STATUSES[i];
    }
  }

  return 'available';
}

function generateSection(
  sectionId: string,
  sectionLabel: string,
  startX: number,
  startY: number,
  rowCount: number,
  seatsPerRow: number,
  basePriceTier: number
): Section {
  const rows: Row[] = [];
  const seatSpacing = 25;
  const rowSpacing = 30;

  for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
    const seats: Seat[] = [];
    const rowY = startY + (rowIndex - 1) * rowSpacing;

    for (let col = 1; col <= seatsPerRow; col++) {
      const seatX = startX + (col - 1) * seatSpacing;

      seats.push({
        id: `${sectionId}-${rowIndex}-${String(col).padStart(2, '0')}`,
        col,
        x: seatX,
        y: rowY,
        priceTier: basePriceTier + Math.floor(rowIndex / 5),
        status: getRandomStatus(),
      });
    }

    rows.push({
      index: rowIndex,
      seats,
    });
  }

  return {
    id: sectionId,
    label: sectionLabel,
    transform: {
      x: 0,
      y: 0,
      scale: 1,
    },
    rows,
  };
}

function generateVenue(): VenueData {
  const sections: Section[] = [];

  sections.push(generateSection('A', 'Section A', 50, 50, 10, 25, 1));

  const totalSeats = sections.reduce(
    (sum, section) => sum + section.rows.reduce((rowSum, row) => rowSum + row.seats.length, 0),
    0
  );

  console.log(`Generated ${totalSeats} seats across ${sections.length} sections`);

  return {
    venueId: 'arena-01',
    name: 'Metropolis Arena',
    map: {
      width: 800,
      height: 500,
    },
    sections,
  };
}

const venue = generateVenue();
const outputPath = path.join(process.cwd(), 'public', 'venue.json');

fs.writeFileSync(outputPath, JSON.stringify(venue, null, 2));
console.log(`Venue data written to ${outputPath}`);
