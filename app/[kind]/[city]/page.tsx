import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';
import { CITIES, CITY_IDS, KIND, inr, isCity, kindFromSlug, listingsOf, minOf } from '@/lib/data';

type Params = { kind: string; city: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return (['coworking', 'office'] as const).flatMap((kind) => CITY_IDS.map((city) => ({ kind, city })));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const kind = kindFromSlug(params.kind);
  if (!kind || !isCity(params.city)) return {};
  const c = CITIES[params.city];
  const n = listingsOf(kind, params.city).length;
  const cw = kind === 'cw';
  const from = cw ? inr(minOf(listingsOf('cw', params.city), (l) => l.hot)) : inr(minOf(listingsOf('of', params.city), (l) => l.rent));
  return {
    title: cw ? `Coworking Space in ${c.name} · ${n} Spaces from ${from}/seat` : `Office Space for Rent in ${c.name} · ${n} Offices from ${from}/sq ft`,
    description: `Compare ${n} ${KIND[kind].plural} in ${c.name} across ${c.locs.slice(0, 4).map((l) => l.name).join(', ')} and more. Prices upfront, metro walking time, free site visits.`,
    alternates: { canonical: `/${params.kind}/${params.city}` },
  };
}

export default function Page({ params }: { params: Params }) {
  const kind = kindFromSlug(params.kind);
  if (!kind || !isCity(params.city)) notFound();
  return <CityPage kind={kind} cid={params.city} />;
}
