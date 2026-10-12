'use client';

import { useMemo, useState } from 'react';
import Card from './Card';
import { fromPrice, listingsOf, type CityId, type Kind, type Listing } from '@/lib/data';

type Sort = 'rec' | 'lo' | 'hi' | 'metro' | 'rating';

const BUDGET = {
  cw: [['any', 'Any budget'], ['lt8', 'Under ₹8,000'], ['8-12', '₹8,000–12,000'], ['gt12', 'Above ₹12,000']],
  of: [['any', 'Any rent'], ['lt80', 'Under ₹80/sq ft'], ['80-150', '₹80–150/sq ft'], ['gt150', 'Above ₹150/sq ft']],
} as const;
const SIZE = {
  cw: [['any', 'Any team size'], ['s', 'Up to 100 seats'], ['m', '100–250 seats'], ['l', '250+ seats']],
  of: [['any', 'Any area'], ['s', 'Under 3,000 sq ft'], ['m', '3,000–10,000 sq ft'], ['l', '10,000+ sq ft']],
} as const;

function inBudget(l: Listing, b: string) {
  const v = fromPrice(l);
  if (b === 'any') return true;
  if (l.kind === 'cw') return b === 'lt8' ? v < 8000 : b === '8-12' ? v >= 8000 && v <= 12000 : v > 12000;
  return b === 'lt80' ? v < 80 : b === '80-150' ? v >= 80 && v <= 150 : v > 150;
}
function inSize(l: Listing, s: string) {
  if (s === 'any') return true;
  if (l.kind === 'cw') return s === 's' ? l.seats <= 100 : s === 'm' ? l.seats > 100 && l.seats <= 250 : l.seats > 250;
  return s === 's' ? l.area < 3000 : s === 'm' ? l.area >= 3000 && l.area <= 10000 : l.area > 10000;
}

export default function CityResults({ kind, city, loc }: { kind: Kind; city: CityId; loc?: string }) {
  const [budget, setBudget] = useState('any');
  const [size, setSize] = useState('any');
  const [sort, setSort] = useState<Sort>('rec');

  const results = useMemo(() => {
    const ls = listingsOf(kind, city, loc).filter((l) => inBudget(l, budget) && inSize(l, size));
    const sorters: Record<Sort, (a: Listing, b: Listing) => number> = {
      rec: (a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0) || +b.rating - +a.rating,
      lo: (a, b) => fromPrice(a) - fromPrice(b),
      hi: (a, b) => fromPrice(b) - fromPrice(a),
      metro: (a, b) => a.walk - b.walk,
      rating: (a, b) => +b.rating - +a.rating,
    };
    return ls.sort(sorters[sort]);
  }, [kind, city, loc, budget, size, sort]);

  return (
    <div>
      <div className="filters">
        <div className="fs">
          <select aria-label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
            {BUDGET[kind].map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
          <select aria-label="Size" value={size} onChange={(e) => setSize(e.target.value)}>
            {SIZE[kind].map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="rec">Recommended</option>
            <option value="lo">Price: low to high</option>
            <option value="hi">Price: high to low</option>
            <option value="metro">Closest to metro</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>
        <span className="count">{results.length} {results.length === 1 ? 'space' : 'spaces'}</span>
      </div>
      <div className="grid grid-2">
        {results.length ? results.map((l) => <Card key={l.id} l={l} />) : (
          <div className="empty" style={{ gridColumn: '1/-1' }}>
            <b>No spaces match these filters.</b><br />Widen the budget or size, or ask an advisor to find off-market options.
          </div>
        )}
      </div>
    </div>
  );
}
