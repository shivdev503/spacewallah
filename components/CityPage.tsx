import Link from 'next/link';
import Icon from './Icon';
import LeadForm from './LeadForm';
import CityResults from './CityResults';
import { AdvisorCard, Crumbs } from './Sections';
import { CITIES, KIND, LINE, cityHref, inr, listingsOf, minOf, type CityId, type Kind, type Loc } from '@/lib/data';

export default function CityPage({ kind, cid, loc }: { kind: Kind; cid: CityId; loc?: Loc }) {
  const c = CITIES[cid];
  const cw = kind === 'cw';
  const all = listingsOf(kind, cid);
  const scoped = loc ? all.filter((l) => l.locSlug === loc.slug) : all;
  const minP = cw ? inr(minOf(listingsOf('cw', cid, loc?.slug), (l) => l.hot)) : inr(minOf(listingsOf('of', cid, loc?.slug), (l) => l.rent));
  const word = cw ? 'Coworking spaces' : 'Office spaces';
  const otherKind: Kind = cw ? 'of' : 'cw';

  return (
    <>
      <section className="hero hero-sm">
        <div className="wrap">
          <Crumbs items={[
            { href: '/', label: 'Home' },
            { href: `/${KIND[kind].slug}`, label: KIND[kind].word },
            loc ? { href: cityHref(kind, cid), label: c.name } : { label: c.name },
            ...(loc ? [{ label: loc.name }] : []),
          ]} />
          <h1 style={{ marginTop: 18 }}>{word} in <em>{loc ? `${loc.name}, ` : ''}{c.name}</em></h1>
          <p className="lede">
            {loc
              ? `${scoped.length} ${KIND[kind].plural} in ${loc.name}, near ${loc.station} metro on the ${loc.line} Line. Compare prices, amenities and walking time, then book a free visit.`
              : c.blurb}
          </p>
          <div className="stats">
            <div><b>{scoped.length}</b><span>{KIND[kind].plural}</span></div>
            <div><b>{loc ? loc.station : c.locs.length}</b><span>{loc ? `${loc.line} Line metro` : 'micro-locations'}</span></div>
            <div><b>{minP}</b><span>{cw ? 'seats from / mo' : 'rent from / sq ft'}</span></div>
          </div>
          <div style={{ marginTop: 22 }}>
            <Link className="btn btn-ghost btn-sm" style={{ color: 'var(--hero-ink)', borderColor: 'var(--hero-line)' }} href={cityHref(otherKind, cid, loc?.slug)}>
              Switch to {cw ? 'office spaces' : 'coworking'} in {loc ? loc.name : c.name} <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 28 }}>
        <div className="wrap">
          <div className="locbar">
            <Link href={cityHref(kind, cid)} scroll={false} className={!loc ? 'on' : ''}>All {c.name} <span>{all.length}</span></Link>
            {c.locs.map((x) => (
              <Link key={x.slug} href={cityHref(kind, cid, x.slug)} scroll={false} className={loc?.slug === x.slug ? 'on' : ''}>
                {x.name} <span>{all.filter((l) => l.locSlug === x.slug).length}</span>
              </Link>
            ))}
          </div>
          <div className="layout">
            <CityResults kind={kind} city={cid} loc={loc?.slug} />
            <aside className="aside">
              <LeadForm
                ctx={`${KIND[kind].word} · ${c.name}${loc ? ' · ' + loc.name : ''}`}
                city={cid}
                title={`Get ${cw ? 'coworking' : 'office'} options in ${loc ? loc.name : c.name}`}
                sub="Tell us your seats. We send 5 matching spaces with negotiated prices on WhatsApp."
              />
              <AdvisorCard cid={cid} ctx={`${KIND[kind].word} · ${c.name}`} />
              <div className="trust">
                <div><Icon name="check" /><span>Prices verified in the last 30 days</span></div>
                <div><Icon name="check" /><span>Free guided visits, same or next day</span></div>
                <div><Icon name="check" /><span>Zero brokerage for tenants</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="sec sec-tint">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">Micro-locations</span><h2>Explore {c.name} by area</h2><p>Each area listed with its nearest metro station and starting price.</p></div></div>
          <div className="loctiles">
            {c.locs.map((x) => {
              const ls = all.filter((l) => l.locSlug === x.slug);
              const p = cw ? `${inr(minOf(listingsOf('cw', cid, x.slug), (l) => l.hot))}/mo` : `${inr(minOf(listingsOf('of', cid, x.slug), (l) => l.rent))}/sq ft`;
              return (
                <Link key={x.slug} className="loctile" href={cityHref(kind, cid, x.slug)}>
                  <h4>{x.name}</h4>
                  <small><span className="ml" style={{ display: 'inline-block', width: 8, height: 8, color: LINE[x.line], background: LINE[x.line], marginRight: 6 }} />{x.station} · {x.line}</small>
                  <span className="p">{ls.length} spaces · from {p}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="seo">
            <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>Renting {cw ? 'a coworking space' : 'an office'} in {loc ? `${loc.name}, ` : ''}{c.name}</h2>
            <p>
              {loc ? loc.name : c.name} has {scoped.length} {KIND[kind].plural} listed on SpaceWallah
              {loc ? `, all within walking distance of ${loc.station} metro station.` : ` across ${c.locs.length} micro-locations, from ${c.locs[0].name} to ${c.locs[c.locs.length - 1].name}.`}{' '}
              {cw
                ? `Hot desks start at ${minP} per month and private cabins at ${inr(minOf(listingsOf('cw', cid, loc?.slug), (l) => l.cabin))} per seat.`
                : `Rents start at ${minP} per sq ft per month, with managed offices from ${inr(minOf(listingsOf('of', cid, loc?.slug), (l) => l.seatPrice))} per seat.`}
            </p>
            <p>Prices exclude 18% GST and vary with floor, view and lock-in. Speak to an advisor for current availability and negotiated rates.</p>
          </div>
        </div>
      </section>
    </>
  );
}
