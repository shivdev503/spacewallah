import Link from 'next/link';
import Icon from './Icon';
import { HeartButton, LeadButton } from './Actions';
import { art } from '@/lib/art';
import { CITIES, LINE, inr, listingHref, type Listing } from '@/lib/data';

export default function Card({ l }: { l: Listing }) {
  const c = CITIES[l.city];
  const href = listingHref(l);
  const cw = l.kind === 'cw';
  return (
    <article className="card">
      <Link className="card-media" href={href} style={{ background: art(l.seed) }} aria-label={l.name}>
        {l.tag && <span className="pill pill-tag">{l.tag}</span>}
        <span className="pill pill-glass"><Icon name="metro" /> {l.walk} min walk to metro</span>
      </Link>
      <HeartButton id={l.id} name={l.name} />
      <div className="card-body">
        <div className="card-top">
          <span className="eyebrow">{cw ? l.op : l.otype}</span>
          <span className="rating"><Icon name="star" /> {l.rating}</span>
        </div>
        <h3><Link href={href}>{l.name}</Link></h3>
        <p className="loc"><Icon name="pin" /> {cw ? `${l.building}, ` : ''}{l.loc}, {c.name}</p>
        <p className="metro-line">
          <span className="ml" style={{ color: LINE[l.line], background: LINE[l.line] }} />
          {l.station} · {l.line} Line
        </p>
        <div className="minis">
          {cw ? (
            <><span>{l.seats} seats</span><span>{l.h24 ? '24×7' : 'Mon–Sat'}</span></>
          ) : (
            <><span>{l.area.toLocaleString('en-IN')} sq ft</span><span>{l.ready}</span></>
          )}
          <span>{l.amen[0][1]}</span>
        </div>
        <div className="card-foot">
          <div className="price">
            <small>{cw ? 'Dedicated desk from' : 'Rent from'}{cw && <span className="rack">{inr(l.rack)}</span>}</small>
            <b>{inr(cw ? l.desk : l.rent)}<i>{cw ? ' /seat/mo' : ' /sq ft/mo'}</i></b>
          </div>
          <LeadButton ctx={l.name} listingId={l.id} className="btn btn-sm btn-dark">Get quote</LeadButton>
        </div>
      </div>
    </article>
  );
}
