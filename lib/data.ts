/**
 * SpaceWallah data layer.
 *
 * Everything here is SAMPLE data produced by a deterministic generator so the
 * site renders end to end. Replace `LISTINGS` with records from your CMS or
 * database (keep the same Listing shape) and every page, filter, sitemap entry
 * and metadata tag updates automatically.
 */
import type { IconName } from './icons';

export type Kind = 'cw' | 'of';
export type KindSlug = 'coworking' | 'office';
export type CityId = 'delhi' | 'noida' | 'gurugram';

export const KIND = {
  cw: { slug: 'coworking', word: 'Coworking', plural: 'coworking spaces' },
  of: { slug: 'office', word: 'Office', plural: 'office spaces' },
} as const;

export const kindFromSlug = (s: string): Kind | null =>
  s === 'coworking' ? 'cw' : s === 'office' ? 'of' : null;

export const LINE: Record<string, string> = {
  Blue: '#1F5FBF', Yellow: '#D9A700', Violet: '#7B3FA0', Magenta: '#C2185B',
  Aqua: '#169CB0', Rapid: '#3C7DA8', 'Airport Express': '#E07A1F', Red: '#D23A2B',
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type Loc = { name: string; slug: string; station: string; line: string; base: number };
export type City = { id: CityId; name: string; blurb: string; seed: number; locs: Loc[] };

const RAW: Record<CityId, { name: string; blurb: string; seed: number; locs: [string, string, string, number][] }> = {
  delhi: {
    name: 'Delhi', seed: 2,
    blurb: 'From Connaught Place blocks to Aerocity glass towers, Delhi suits law firms, consultancies and brand offices that need a central address.',
    locs: [['Connaught Place', 'Rajiv Chowk', 'Yellow', 18000], ['Nehru Place', 'Nehru Place', 'Violet', 10500], ['Saket', 'Saket', 'Yellow', 12500], ['Okhla Phase 3', 'Okhla NSIC', 'Magenta', 8500], ['Jasola', 'Jasola Apollo', 'Violet', 9500], ['Aerocity', 'Aerocity', 'Airport Express', 16000], ['Rajouri Garden', 'Rajouri Garden', 'Blue', 9000], ['Netaji Subhash Place', 'Netaji Subhash Place', 'Red', 9500]],
  },
  noida: {
    name: 'Noida', seed: 0,
    blurb: 'Planned sectors along the Blue and Aqua Lines give Noida the best value in NCR for tech teams, startups and back offices.',
    locs: [['Sector 62', 'Noida Sector 62', 'Blue', 7000], ['Sector 63', 'Noida Electronic City', 'Blue', 6500], ['Sector 58', 'Noida Sector 59', 'Blue', 6000], ['Sector 16', 'Noida Sector 16', 'Blue', 7500], ['Sector 18', 'Noida Sector 18', 'Blue', 8500], ['Sector 125', 'Okhla Bird Sanctuary', 'Magenta', 8000], ['Sector 132', 'Noida Sector 142', 'Aqua', 7500], ['Sector 135', 'Noida Sector 137', 'Aqua', 7200]],
  },
  gurugram: {
    name: 'Gurugram', seed: 5,
    blurb: 'Cyber City, Golf Course Road and Sohna Road hold NCR’s densest cluster of Grade A offices, MNC headquarters and enterprise coworking.',
    locs: [['Cyber City', 'Cyber City', 'Rapid', 15500], ['Golf Course Road', 'Sector 53-54', 'Rapid', 14500], ['Sohna Road', 'Millennium City Centre', 'Yellow', 10000], ['MG Road', 'MG Road', 'Yellow', 11500], ['Udyog Vihar', 'Moulsari Avenue', 'Rapid', 9500], ['Sector 44', 'Sector 42-43', 'Rapid', 12000], ['Golf Course Ext. Road', 'Sector 55-56', 'Rapid', 11000]],
  },
};

export const CITY_IDS: CityId[] = ['delhi', 'noida', 'gurugram'];

export const CITIES: Record<CityId, City> = Object.fromEntries(
  CITY_IDS.map((id) => [id, {
    id, name: RAW[id].name, blurb: RAW[id].blurb, seed: RAW[id].seed,
    locs: RAW[id].locs.map(([name, station, line, base]) => ({ name, slug: slugify(name), station, line, base })),
  }]),
) as Record<CityId, City>;

export const isCity = (s: string): s is CityId => (CITY_IDS as string[]).includes(s);

export const ADVISORS: Record<CityId, { name: string; init: string; areas: string; teams: number; visits: string }> = {
  delhi: { name: 'Ritika Malhotra', init: 'RM', areas: 'Connaught Place, Saket, Aerocity, Nehru Place', teams: 180, visits: '260+' },
  noida: { name: 'Arjun Verma', init: 'AV', areas: 'Sector 62, 63, 16, 18, 125, 132', teams: 240, visits: '310+' },
  gurugram: { name: 'Neha Kapoor', init: 'NK', areas: 'Cyber City, Golf Course Road, Sohna Road, Udyog Vihar', teams: 210, visits: '290+' },
};

export const VERIFIED_ON = '28 Sep 2026';

export const AMEN: [IconName, string][] = [
  ['wifi', '1 Gbps Wi‑Fi'], ['bolt', '100% power backup'], ['snow', 'Central AC'], ['users', 'Meeting rooms'],
  ['coffee', 'Café & pantry'], ['car', 'Car parking'], ['clock', '24×7 access'], ['print', 'Printing & scanning'],
  ['phone', 'Phone booths'], ['shield', 'CCTV & biometric entry'], ['door', 'Reception & mail handling'],
];

export const OTYPES: [string, string][] = [
  ['Managed office', 'Fully run by the operator: fit-out, IT, housekeeping and security in one per-seat bill.'],
  ['Furnished office', 'Ready desks, cabins and pantry. You sign the lease and run it.'],
  ['Bare shell', 'Raw floor plate to design your own. Longest lock-in, lowest rent.'],
  ['Built-to-suit', 'Developer fits out to your layout before handover.'],
];

type Common = {
  id: string; slug: string; city: CityId; loc: string; locSlug: string; station: string; line: string;
  building: string; name: string; rating: string; walk: number; amen: [IconName, string][]; tag: string;
  seed: number; air: number; photos: number; floor: number; seats: number;
};
export type CwListing = Common & { kind: 'cw'; op: string; desk: number; hot: number; cabin: number; meet: number; virt: number; day: number; rack: number; h24: boolean };
export type OfListing = Common & { kind: 'of'; otype: string; area: number; rent: number; maint: number; seatPrice: number; lock: number; ready: string; parking: string };
export type Listing = CwListing | OfListing;

/* ---------- deterministic sample generator ---------- */
const OPS = ['Kova Works', 'Banyan Desk', 'Tensquare', 'Loft Nine', 'Indigo Commons', 'Halcyon Hub', 'Workyard', 'Pinnacle Desk'];
const BLDG = ['Arcadia Business Park', 'Sterling Tower', 'Tapti Square', 'Indus Court', 'Meridian One', 'Cedar Corporate Centre', 'Raintree Plaza', 'Ashoka Trade Tower', 'Vertex Heights', 'Orchid Business Bay'];
const AIRPORT: Record<CityId, [number, number]> = { delhi: [11, 24], noida: [28, 42], gurugram: [12, 20] };

function generate(): Listing[] {
  let s = 7;
  const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const pickN = <T,>(a: T[], n: number) => { const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c.slice(0, n); };
  const r100 = (n: number) => Math.round(n / 100) * 100;
  const out: Listing[] = [];
  let k = 0;
  for (const cid of CITY_IDS) {
    for (const loc of CITIES[cid].locs) {
      const nc = 3 + Math.floor(rnd() * 3), no = 2 + Math.floor(rnd() * 3);
      const common = (name: string, building: string) => ({
        city: cid, loc: loc.name, locSlug: loc.slug, station: loc.station, line: loc.line, building, name,
        rating: (4.15 + rnd() * 0.8).toFixed(1), walk: 2 + Math.floor(rnd() * 11), seed: Math.floor(rnd() * 60),
        air: AIRPORT[cid][0] + Math.floor(rnd() * (AIRPORT[cid][1] - AIRPORT[cid][0])), photos: 9 + Math.floor(rnd() * 10),
        floor: 1 + Math.floor(rnd() * 14),
      });
      for (let i = 0; i < nc; i++) {
        const op = pick(OPS), building = pick(BLDG), d = r100(loc.base * (0.85 + rnd() * 0.35)), id = String(++k);
        const name = `${op} ${loc.name}`;
        out.push({
          kind: 'cw', id, slug: `${slugify(name)}-${id}`, ...common(name, building), op,
          desk: d, hot: r100(d * 0.68), cabin: r100(d * 1.22), meet: r100(d / 11), virt: r100(d * 1.9),
          day: Math.round(d / 22 / 50) * 50 + 50, rack: r100(d * (1.08 + rnd() * 0.1)),
          seats: 60 + Math.floor(rnd() * 14) * 30, amen: pickN(AMEN, 7 + Math.floor(rnd() * 4)), h24: rnd() > 0.55,
          tag: rnd() > 0.78 ? pick(['Popular', 'New', 'Top rated']) : '',
        });
      }
      for (let i = 0; i < no; i++) {
        const otype = pick(OTYPES)[0], building = pick(BLDG), id = String(++k);
        const area = r100(1200 + rnd() * rnd() * 24000), rent = Math.round(loc.base * 0.0105 * (0.85 + rnd() * 0.4));
        const name = `${building}, ${loc.name}`;
        out.push({
          kind: 'of', id, slug: `${slugify(name)}-${id}`, ...common(name, building), otype, area, rent,
          maint: Math.round(rent * 0.12 + 8), seats: Math.round(area / (otype === 'Managed office' ? 55 : 75)),
          seatPrice: r100(loc.base * 1.15), lock: otype === 'Bare shell' ? 36 : otype === 'Managed office' ? 12 : pick([24, 36]),
          ready: otype === 'Bare shell' || otype === 'Built-to-suit' ? '60–120 days' : pick(['Ready to move', 'In 15 days', 'In 30 days']),
          parking: `1 per ${pick([800, 1000, 1200])} sq ft`, amen: pickN(AMEN, 6 + Math.floor(rnd() * 4)),
          tag: rnd() > 0.8 ? pick(['Grade A', 'New', 'Popular']) : '',
        });
      }
    }
  }
  return out;
}

export const LISTINGS: Listing[] = generate();
const BY_ID = new Map(LISTINGS.map((l) => [l.id, l]));
export const getById = (id: string) => BY_ID.get(id);

export function listingsOf(kind: 'cw', city?: CityId, loc?: string): CwListing[];
export function listingsOf(kind: 'of', city?: CityId, loc?: string): OfListing[];
export function listingsOf(kind: Kind, city?: CityId, loc?: string): Listing[];
export function listingsOf(kind: Kind, city?: CityId, loc?: string): Listing[] {
  return LISTINGS.filter((l) => l.kind === kind && (!city || l.city === city) && (!loc || l.locSlug === loc));
}

export const findLoc = (city: CityId, locSlug: string) => CITIES[city].locs.find((l) => l.slug === locSlug);

export const listingHref = (l: Listing) => `/${KIND[l.kind].slug}/${l.city}/${l.locSlug}/${l.slug}`;
export const cityHref = (kind: Kind, city: CityId, locSlug?: string) => `/${KIND[kind].slug}/${city}${locSlug ? '/' + locSlug : ''}`;

export const minOf = <T,>(a: T[], f: (x: T) => number) => (a.length ? Math.min(...a.map(f)) : 0);
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const fromPrice = (l: Listing) => (l.kind === 'cw' ? l.desk : l.rent);
export const totalLocs = () => CITY_IDS.reduce((a, c) => a + CITIES[c].locs.length, 0);
