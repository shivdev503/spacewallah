import Link from 'next/link';
import Icon from './Icon';
import LeadForm from './LeadForm';
import { LeadButton, WhatsAppButton } from './Actions';
import { art } from '@/lib/art';
import { abs } from '@/lib/site';
import { ADVISORS, CITIES, KIND, cityHref, inr, listingsOf, minOf, type CityId, type Kind } from '@/lib/data';

export function CityTile({ cid, kind }: { cid: CityId; kind: Kind }) {
  const c = CITIES[cid];
  const ls = listingsOf(kind, cid);
  const from = kind === 'cw' ? `${inr(minOf(listingsOf('cw', cid), (l) => l.hot))}/mo` : `${inr(minOf(listingsOf('of', cid), (l) => l.rent))}/sq ft`;
  return (
    <article className="city">
      <Link className="city-media" href={cityHref(kind, cid)} style={{ background: art(c.seed, 3) }}>
        <span className="cnt">{ls.length} {KIND[kind].plural}</span>
        <h3>{c.name}</h3>
      </Link>
      <div className="city-body">
        <p>{c.blurb}</p>
        <div className="chips">
          {c.locs.slice(0, 4).map((l) => <Link key={l.slug} className="chip" href={cityHref(kind, cid, l.slug)}>{l.name}</Link>)}
        </div>
        <div className="city-foot">
          <div><small>{kind === 'cw' ? 'Desks from' : 'Rent from'}</small><b>{from}</b></div>
          <Link className="link" href={cityHref(kind, cid)}>Explore <Icon name="arrow" /></Link>
        </div>
      </div>
    </article>
  );
}

export function LeadBand({ ctx, city }: { ctx: string; city?: CityId }) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="band">
          <div>
            <span className="eyebrow" style={{ color: 'var(--hero-muted)' }}>Free workspace advisory</span>
            <h2 style={{ marginTop: 10 }}>Tell us your team size. We’ll shortlist 5 spaces by tonight.</h2>
            <p>Advisors who visit these buildings every week. Real availability, negotiated rates, one call.</p>
            <ul>
              <li><Icon name="check" /> Prices negotiated below rack rate</li>
              <li><Icon name="check" /> Guided tours, same or next day</li>
              <li><Icon name="check" /> Help with agreement and GST invoice</li>
            </ul>
          </div>
          <LeadForm ctx={ctx} city={city} />
        </div>
      </div>
    </section>
  );
}

export const FAQ_GENERAL: [string, string][] = [
  ['Do I pay SpaceWallah any brokerage?', 'No. Operators and landlords pay us. Your price is the same as walking in directly, and often lower because we negotiate on volume.'],
  ['How fast can I move in?', 'Coworking desks are usually ready in 24 to 48 hours. Managed offices take 2 to 6 weeks depending on customisation. Bare shell floors need 60 to 120 days for fit-out.'],
  ['What lock-in should I expect?', 'Coworking runs month to month or on a 3 month commitment. Managed offices usually ask for 11 to 36 months. Leased offices commonly carry a 3 year lock-in on a 9 year lease.'],
  ['Are prices inclusive of GST?', 'Prices shown exclude 18% GST. With a GST-registered invoice your business can claim it back as input tax credit.'],
  ['Can I register my company at a coworking address?', 'Yes. Most coworking spaces offer virtual office plans with a registered business address for GST and MCA filings, plus mail handling.'],
];

export function Faq({ items = FAQ_GENERAL, tint = true }: { items?: [string, string][]; tint?: boolean }) {
  return (
    <section className={`sec ${tint ? 'sec-tint' : ''}`}>
      <div className="wrap">
        <div className="sec-head"><div><span className="eyebrow">Before you sign</span><h2>Questions teams ask us</h2></div></div>
        <div className="faq">
          {items.map(([q, a], i) => (
            <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </div>
      {/* FAQPage structured data for rich results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }) }} />
    </section>
  );
}

export function AdvisorCard({ cid, ctx }: { cid: CityId; ctx: string }) {
  const a = ADVISORS[cid];
  const c = CITIES[cid];
  return (
    <div className="adv">
      <div className="adv-top">
        <span className="ava">{a.init}</span>
        <div><b>{a.name}</b><small>Workspace advisor · {c.name} · online now</small></div>
      </div>
      <p>Covers {a.areas}. Has toured {a.visits} spaces and helped {a.teams}+ teams move in {c.name}.</p>
      <div className="row">
        <WhatsAppButton ctx={`${ctx} · ${a.name}`} className="btn btn-sm btn-wa"><Icon name="whatsapp" /> WhatsApp</WhatsAppButton>
        <LeadButton ctx={`${ctx} · Callback from ${a.name}`} className="btn btn-sm btn-ghost">Request callback</LeadButton>
      </div>
    </div>
  );
}

export function Crumbs({ items, plain = false }: { items: { href?: string; label: string }[]; plain?: boolean }) {
  return (
    <>
      <nav className={`crumbs ${plain ? 'plain' : ''}`} aria-label="Breadcrumb">
        {items.map((it, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i > 0 && <span>/</span>}
            {it.href ? <Link href={it.href}>{it.label}</Link> : <span style={{ opacity: 1 }}>{it.label}</span>}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, ...(it.href ? { item: abs(it.href) } : {}) })),
      }) }} />
    </>
  );
}
