import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';
import { CITIES, CITY_IDS, KIND, findLoc, inr, isCity, kindFromSlug, listingsOf, minOf } from '@/lib/data';

type Params = { kind: string; city: string; location: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return (['coworking', 'office'] as const).flatMap((kind) =>
    CITY_IDS.flatMap((city) => CITIES[city].locs.map((l) => ({ kind, city, location: l.slug }))),
  );
}

function resolve(params: Params) {
  const kind = kindFromSlug(params.kind);
  if (!kind || !isCity(params.city)) return null;
  const loc = findLoc(params.city, params.location);
  return loc ? { kind, city: params.city, loc } : null;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const r = resolve(params);
  if (!r) return {};
  const c = CITIES[r.city];
  const n = listingsOf(r.kind, r.city, r.loc.slug).length;
  const cw = r.kind === 'cw';
  const from = cw ? inr(minOf(listingsOf('cw', r.city, r.loc.slug), (l) => l.hot)) : inr(minOf(listingsOf('of', r.city, r.loc.slug), (l) => l.rent));
  return {
    title: cw ? `Coworking Space in ${r.loc.name}, ${c.name} from ${from}/seat` : `Office Space in ${r.loc.name}, ${c.name} from ${from}/sq ft`,
    description: `${n} ${KIND[r.kind].plural} in ${r.loc.name}, ${c.name}, near ${r.loc.station} metro (${r.loc.line} Line). Compare prices and amenities and book a free visit.`,
    alternates: { canonical: `/${params.kind}/${params.city}/${params.location}` },
  };
}

export default function Page({ params }: { params: Params }) {
  const r = resolve(params);
  if (!r) notFound();
  return <CityPage kind={r.kind} cid={r.city} loc={r.loc} />;
}
