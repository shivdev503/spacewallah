'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Icon from './Icon';
import { CITIES, CITY_IDS, cityHref, type CityId, type Kind } from '@/lib/data';

export default function HeroSearch() {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>('cw');
  const [city, setCity] = useState<CityId>('noida');
  const [loc, setLoc] = useState('');

  return (
    <div className="search">
      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={kind === 'cw'} className={kind === 'cw' ? 'on' : ''} onClick={() => setKind('cw')}>Coworking</button>
        <button type="button" role="tab" aria-selected={kind === 'of'} className={kind === 'of' ? 'on' : ''} onClick={() => setKind('of')}>Office space</button>
      </div>
      <div className="search-row">
        <div className="fld">
          <label htmlFor="hCity">City</label>
          <select id="hCity" value={city} onChange={(e) => { setCity(e.target.value as CityId); setLoc(''); }}>
            {CITY_IDS.map((c) => <option key={c} value={c}>{CITIES[c].name}</option>)}
          </select>
        </div>
        <div className="fld">
          <label htmlFor="hLoc">Micro-location</label>
          <select id="hLoc" value={loc} onChange={(e) => setLoc(e.target.value)}>
            <option value="">All of {CITIES[city].name}</option>
            {CITIES[city].locs.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
          </select>
        </div>
        <div className="fld">
          <label htmlFor="hSize">Seats</label>
          <select id="hSize" defaultValue="1–5">
            <option>1–5</option><option>6–20</option><option>21–50</option><option>50+</option>
          </select>
        </div>
        <button className="btn" type="button" onClick={() => router.push(cityHref(kind, city, loc || undefined))}>
          Search <Icon name="arrow" />
        </button>
      </div>
    </div>
  );
}
