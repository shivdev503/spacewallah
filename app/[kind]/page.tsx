import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Card from '@/components/Card';
import { CityTile, Crumbs, Faq, LeadBand } from '@/components/Sections';
import { CITY_IDS, KIND, OTYPES, cityHref, inr, kindFromSlug, listingsOf, minOf } from '@/lib/data';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ kind: 'coworking' }, { kind: 'office' }];
}

export function generateMetadata({ params }: { params: { kind: string } }): Metadata {
  const kind = kindFromSlug(params.kind);
  if (!kind) return {};
  const cw = kind === 'cw';
  const from = cw ? inr(minOf(listingsOf('cw'), (l) => l.hot)) : inr(minOf(listingsOf('of'), (l) => l.rent));
  return {
    title: cw ? `Coworking Spaces in Delhi NCR from ${from}/seat` : `Office Space for Rent in Delhi NCR from ${from}/sq ft`,
    description: cw
      ? `Compare ${listingsOf('cw').length} coworking spaces in Delhi, Noida and Gurugram. Day passes, hot desks, dedicated desks and private cabins with prices shown upfront.`
      : `Compare ${listingsOf('of').length} managed, furnished and bare shell offices in Delhi, Noida and Gurugram. Rent per sq ft, lock-in and possession shown upfront.`,
    alternates: { canonical: `/${params.kind}` },
  };
}

export default function KindPage({ params }: { params: { kind: string } }) {
  const kind = kindFromSlug(params.kind);
  if (!kind) notFound();
  const cw = kind === 'cw';
  const all = listingsOf(kind);
  const cwAll = listingsOf('cw');
  const ofAll = listingsOf('of');

  const types: [string, string, number, string][] = cw
    ? [
        ['Day pass', 'A full working day with Wi‑Fi, café and meeting room credits.', minOf(cwAll, (l) => l.day), '/day'],
        ['Hot desk', 'Any open seat in the shared zone. Ideal for freelancers and hybrid teams.', minOf(cwAll, (l) => l.hot), '/seat/mo'],
        ['Dedicated desk', 'Your own desk with lockable storage, same seat every day.', minOf(cwAll, (l) => l.desk), '/seat/mo'],
        ['Private cabin', 'Lockable room for 2 to 20 people with shared amenities.', minOf(cwAll, (l) => l.cabin), '/seat/mo'],
        ['Meeting room', 'Book by the hour for client pitches, interviews and offsites.', minOf(cwAll, (l) => l.meet), '/hour'],
        ['Virtual office', 'Business address for GST and company registration, with mail handling.', minOf(cwAll, (l) => l.virt), '/year'],
      ]
    : OTYPES.map(([t, d]) => [t, d, minOf(ofAll.filter((l) => l.otype === t), (l) => l.rent), '/sq ft/mo']);

  const popular = all.slice().sort((a, b) => +b.rating - +a.rating).slice(0, 6);
  const from = cw ? inr(minOf(cwAll, (l) => l.hot)) : inr(minOf(ofAll, (l) => l.rent));

  return (
    <>
      <section className="hero hero-sm">
        <div className="wrap">
          <Crumbs items={[{ href: '/', label: 'Home' }, { label: KIND[kind].word }]} />
          <h1 style={{ marginTop: 18 }}>{cw ? <>Coworking spaces in <em>Delhi NCR</em></> : <>Office spaces for lease in <em>Delhi NCR</em></>}</h1>
          <p className="lede">
            {cw
              ? `${all.length} coworking spaces across Delhi, Noida and Gurugram. Desks, cabins and meeting rooms with everything included.`
              : `${all.length} managed, furnished and bare shell offices from 1,200 sq ft. Compare rent per sq ft, lock-in and possession dates.`}
          </p>
          <div className="stats">
            <div><b>{all.length}</b><span>{KIND[kind].plural}</span></div>
            <div><b>{from}</b><span>{cw ? 'lowest seat price / mo' : 'lowest rent / sq ft'}</span></div>
            <div><b>3</b><span>cities</span></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">Choose a city</span><h2>Where does your team want to work?</h2></div></div>
          <div className="cities">{CITY_IDS.map((c) => <CityTile key={c} cid={c} kind={kind} />)}</div>
        </div>
      </section>

      <section className="sec sec-tint">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">{cw ? 'Plans' : 'Office formats'}</span><h2>{cw ? 'Pick the plan, not the long lease' : 'Four ways to take an office'}</h2></div></div>
          <div className={`types ${cw ? '' : 'types-4'}`}>
            {types.map(([t, d, p, unit]) => (
              <Link key={t} className="type" href={cityHref(kind, 'noida')}>
                <h3>{t}</h3><p>{d}</p><span className="from">from {inr(p)}{unit}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">Top rated</span><h2>{cw ? 'Popular coworking spaces' : 'Popular office spaces'}</h2></div></div>
          <div className="grid">{popular.map((l) => <Card key={l.id} l={l} />)}</div>
        </div>
      </section>

      <LeadBand ctx={`${KIND[kind].word} homepage`} />
      <Faq />
    </>
  );
}
