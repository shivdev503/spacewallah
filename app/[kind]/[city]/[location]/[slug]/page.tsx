import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import Card from '@/components/Card';
import LeadForm from '@/components/LeadForm';
import MapSvg from '@/components/MapSvg';
import { HeartButton, LeadButton, WhatsAppButton } from '@/components/Actions';
import { AdvisorCard, Crumbs } from '@/components/Sections';
import { art } from '@/lib/art';
import { abs } from '@/lib/site';
import {
  CITIES, KIND, LINE, LISTINGS, VERIFIED_ON, cityHref, inr, kindFromSlug, listingHref, listingsOf, type Listing,
} from '@/lib/data';

type Params = { kind: string; city: string; location: string; slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return LISTINGS.map((l) => ({ kind: KIND[l.kind].slug, city: l.city, location: l.locSlug, slug: l.slug }));
}

function resolve(p: Params): Listing | undefined {
  const kind = kindFromSlug(p.kind);
  return LISTINGS.find((l) => l.kind === kind && l.city === p.city && l.locSlug === p.location && l.slug === p.slug);
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const l = resolve(params);
  if (!l) return {};
  const c = CITIES[l.city];
  const price = l.kind === 'cw' ? `from ${inr(l.desk)}/seat` : `${inr(l.rent)}/sq ft`;
  return {
    title: `${l.name}, ${c.name} · ${price}`,
    description: l.kind === 'cw'
      ? `${l.name} in ${l.building}, ${l.loc}, ${c.name}. Day pass ${inr(l.day)}, hot desk ${inr(l.hot)}, dedicated desk ${inr(l.desk)}. ${l.walk} min walk to ${l.station} metro. Book a free visit.`
      : `${l.otype} of ${l.area.toLocaleString('en-IN')} sq ft at ${l.building}, ${l.loc}, ${c.name}. Rent ${inr(l.rent)}/sq ft, ${l.lock} month lock-in. ${l.walk} min to ${l.station} metro.`,
    alternates: { canonical: listingHref(l) },
  };
}

function PlanRow({ l, plan, best, price, unit }: { l: Listing; plan: string; best: string; price: number; unit: string }) {
  return (
    <tr>
      <td><b style={{ fontFamily: 'var(--f-body)', fontSize: '1rem' }}>{plan}</b></td>
      <td>{best}</td>
      <td><b>{inr(price)}</b><small>{unit}</small></td>
      <td><LeadButton ctx={`${l.name} · ${plan}`} className="btn btn-sm btn-ghost">Enquire</LeadButton></td>
    </tr>
  );
}

export default function ListingPage({ params }: { params: Params }) {
  const l = resolve(params);
  if (!l) notFound();
  const c = CITIES[l.city];
  const cw = l.kind === 'cw';
  const kindSlug = KIND[l.kind].slug;
  const similar = listingsOf(l.kind, l.city)
    .filter((x) => x.id !== l.id)
    .sort((a, b) => Number(b.locSlug === l.locSlug) - Number(a.locSlug === l.locSlug) || +b.rating - +a.rating)
    .slice(0, 3);
  const caps = cw ? ['Open desks', 'Reception', 'Private cabin', 'Meeting room', 'Café'] : ['Floor plate', 'Lobby', 'Work bay', 'Board room', 'Pantry'];

  const faqs: [string, string][] = [
    ['What is the lock-in and security deposit?', cw
      ? 'Desks and cabins run month to month after a 3 month lock-in. Security deposit is 2 months of seat charges, refundable on exit with 30 days notice.'
      : `Lock-in is ${l.lock} months. Security deposit is usually 6 to 10 months of rent, with 15% escalation every 3 years.`],
    ['Is the listed price final?', 'No. It is the operator’s quoted price and is negotiable. SpaceWallah advisors typically secure 5 to 12% lower, plus free parking or meeting room credits for larger teams.'],
    ['Do I get a GST invoice?', 'Yes. You receive a GST-registered invoice every month, so the 18% GST can be claimed as input tax credit.'],
    ['Can the space be customised or branded?', cw
      ? 'Teams of 15 or more can get branded cabins, custom layouts and dedicated meeting rooms.'
      : l.otype === 'Bare shell' ? 'Yes, the floor is handed over bare and you design the fit-out.' : 'Branding and minor layout changes are included. Larger changes are quoted separately.'],
    cw
      ? ['Is it open 24×7?', l.h24 ? 'Yes. Members get 24×7 access with biometric entry.' : 'No. Working hours are listed above. Late access can be arranged for dedicated desk and cabin members.']
      : ['When can we move in?', `Possession: ${l.ready.toLowerCase()}.`],
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: l.name,
    url: abs(listingHref(l)),
    address: { '@type': 'PostalAddress', streetAddress: l.building, addressLocality: `${l.loc}, ${c.name}`, addressRegion: c.name === 'Gurugram' ? 'Haryana' : c.name === 'Noida' ? 'Uttar Pradesh' : 'Delhi', addressCountry: 'IN' },
    amenityFeature: l.amen.map(([, a]) => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
  };

  return (
    <>
      <div className="wrap fade" style={{ paddingTop: 22 }}>
        <Crumbs plain items={[
          { href: '/', label: 'Home' },
          { href: `/${kindSlug}`, label: KIND[l.kind].word },
          { href: cityHref(l.kind, l.city), label: c.name },
          { href: cityHref(l.kind, l.city, l.locSlug), label: l.loc },
          { label: l.name },
        ]} />

        <div className="gal">
          {caps.map((t, i) => (
            <div key={t} style={{ background: art(l.seed + i, i) }}>
              <small>{t}</small>
              {i === 4 && (
                <WhatsAppButton ctx={`${l.name} · All ${l.photos} photos and brochure`} className="btn btn-sm" style={{ position: 'absolute', right: 12, bottom: 10 }}>
                  View all {l.photos} photos
                </WhatsAppButton>
              )}
            </div>
          ))}
        </div>

        <div className="layout" style={{ marginTop: 6 }}>
          <div>
            <div className="l-head">
              <div>
                <span className="eyebrow">{cw ? `${l.op} · Coworking` : `${l.otype} · Office space`}</span>
                <h1>{l.name}</h1>
                <p className="loc"><Icon name="pin" /> {l.building}, {l.loc}, {c.name}</p>
                <div className="badges">
                  <span className="badge gold"><Icon name="star" /> {l.rating} rated</span>
                  <span className="badge"><span className="ml" style={{ width: 8, height: 8, color: LINE[l.line], background: LINE[l.line] }} />{l.walk} min to {l.station}</span>
                  <span className="badge"><Icon name="building" /> Floor {l.floor}</span>
                  <span className="badge"><Icon name="shield" /> Toured by our team on {VERIFIED_ON}</span>
                </div>
              </div>
              <HeartButton id={l.id} name={l.name} style={{ position: 'static', border: '1px solid var(--line)' }} />
            </div>

            <div className="blk" style={{ marginTop: 24 }}>
              <h2>About this space</h2>
              <p>
                {cw
                  ? `${l.name} sits on floor ${l.floor} of ${l.building} in ${l.loc}, a ${l.walk} minute walk from ${l.station} on the ${l.line} Line. The centre has ${l.seats} seats across open desks and private cabins, with meeting rooms bookable by the hour and ${l.h24 ? '24×7 access for members' : 'staffed reception Monday to Saturday'}.`
                  : `A ${l.area.toLocaleString('en-IN')} sq ft ${l.otype.toLowerCase()} on floor ${l.floor} of ${l.building}, ${l.walk} minutes on foot from ${l.station} (${l.line} Line). Fits around ${l.seats} people. Possession: ${l.ready.toLowerCase()}.`}
              </p>
            </div>

            <div className="blk">
              <h2>{cw ? 'Plans and pricing' : 'Commercials'}</h2>
              {l.kind === 'cw' ? (
                <>
                  <div className="tbl-wrap">
                    <table className="ptable">
                      <thead><tr><th>Plan</th><th>Best for</th><th>Price</th><th /></tr></thead>
                      <tbody>
                        <PlanRow l={l} plan="Day pass" best="Trying the space, occasional use" price={l.day} unit="per person / day" />
                        <PlanRow l={l} plan="Hot desk" best="Freelancers, hybrid staff" price={l.hot} unit="per seat / month" />
                        <PlanRow l={l} plan="Dedicated desk" best="Daily users, small teams" price={l.desk} unit="per seat / month" />
                        <PlanRow l={l} plan="Private cabin" best="Teams of 2 to 20" price={l.cabin} unit="per seat / month" />
                        <PlanRow l={l} plan="Meeting room" best="6 to 12 people" price={l.meet} unit="per hour" />
                        <PlanRow l={l} plan="Virtual office" best="GST and company address" price={l.virt} unit="per year" />
                      </tbody>
                    </table>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: 10 }}>Prices exclude 18% GST. Security deposit is usually 2 months of seat charges.</p>
                </>
              ) : (
                <>
                  <div className="specs">
                    <div><small>Format</small><b>{l.otype}</b></div>
                    <div><small>Carpet area</small><b>{l.area.toLocaleString('en-IN')} sq ft</b></div>
                    <div><small>Rent</small><b>{inr(l.rent)} / sq ft</b></div>
                    <div><small>Est. monthly rent</small><b>{inr(l.area * l.rent)}</b></div>
                    <div><small>Maintenance</small><b>{inr(l.maint)} / sq ft</b></div>
                    <div><small>Approx. seats</small><b>{l.seats}</b></div>
                    <div><small>Lock-in</small><b>{l.lock} months</b></div>
                    <div><small>Possession</small><b>{l.ready}</b></div>
                    <div><small>Parking</small><b>{l.parking}</b></div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: 10 }}>Rent and maintenance exclude 18% GST. Typical escalation is 15% every 3 years; security deposit 6 to 10 months.</p>
                </>
              )}
            </div>

            <div className="blk">
              <h2>Amenities</h2>
              <div className="amen">{l.amen.map(([ic, a]) => <div key={a}><Icon name={ic} />{a}</div>)}</div>
            </div>

            <div className="blk">
              <h2>Working hours</h2>
              <div className="hours">
                {(() => {
                  const open = cw && l.h24;
                  return [['Mon – Fri', open ? '24 hours' : '8:00 – 21:00'], ['Saturday', open ? '24 hours' : '9:00 – 18:00'], ['Sunday', open ? '24 hours' : 'Closed'], ['Public holidays', open ? 'Open' : 'Closed']]
                    .map(([d, h]) => <div key={d}><span>{d}</span><b className="mono">{h}</b></div>);
                })()}
              </div>
            </div>

            <div className="blk">
              <h2>Location and commute</h2>
              <div className="map">
                <MapSvg l={l} />
                <div className="map-foot"><span><Icon name="pin" /> {l.building}, {l.loc}, {c.name}</span><span className="mono">{l.station} · {l.walk} min walk</span></div>
              </div>
              <div className="hours" style={{ marginTop: 14, maxWidth: 'none' }}>
                <div><span>{l.station} metro ({l.line})</span><b className="mono">{((l.walk * 80) / 1000).toFixed(1)} km · {l.walk} min walk</b></div>
                <div><span>IGI Airport</span><b className="mono">{l.air} km</b></div>
                <div><span>Parking</span><b className="mono">{l.kind === 'cw' ? (l.amen.some(([i]) => i === 'car') ? 'Available' : 'Street / paid') : l.parking}</b></div>
                <div><span>Food courts nearby</span><b className="mono">{2 + (l.seed % 5)} within 1 km</b></div>
              </div>
            </div>

            <div className="blk">
              <h2>Frequently asked</h2>
              <div className="faq">
                {faqs.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}
              </div>
            </div>
          </div>

          <aside className="aside" style={{ marginTop: 28 }}>
            <div className="price-card">
              <div className="price">
                <small>{cw ? 'Dedicated desk from' : 'Rent from'}{l.kind === 'cw' && <span className="rack">{inr(l.rack)}</span>}</small>
                <b>{inr(l.kind === 'cw' ? l.desk : l.rent)}<i>{cw ? ' /seat/mo' : ' /sq ft/mo'}</i></b>
              </div>
              <p className="note">{l.kind === 'cw' ? `Hot desk ${inr(l.hot)} · Cabin ${inr(l.cabin)} per seat` : `Approx. ${inr(l.area * l.rent)} per month all-in rent`}</p>
              <span className="neg">Quoted price · negotiable</span>
              <div className="row2" style={{ marginTop: 14 }}>
                <LeadButton ctx={`${l.name} · Best price`} listingId={l.id} className="btn btn-sm">Get best price</LeadButton>
                <WhatsAppButton ctx={`${l.name} · Brochure`} className="btn btn-sm btn-ghost">Brochure</WhatsAppButton>
              </div>
            </div>
            <LeadForm ctx={`${l.name} · Site visit`} visit title="Book a free site visit" sub="An advisor meets you at reception and negotiates on the spot." cta="Book my visit" />
            <AdvisorCard cid={l.city} ctx={l.name} />
          </aside>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow">Similar spaces</span><h2>More in {c.name}</h2></div>
            <Link className="link" href={cityHref(l.kind, l.city)}>View all <Icon name="arrow" /></Link>
          </div>
          <div className="grid">{similar.map((x) => <Card key={x.id} l={x} />)}</div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }) }} />
    </>
  );
}
