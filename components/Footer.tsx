import Link from 'next/link';
import Logo from './Logo';
import { LeadButton } from './Actions';
import { CITIES, CITY_IDS, cityHref } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" href="/"><Logo dark /></Link>
            <p style={{ marginTop: 14, maxWidth: '30ch', fontSize: '.92rem' }}>
              Coworking and office spaces across Delhi, Noida and Gurugram. Free advisory, zero brokerage.
            </p>
            <Link href="/coworking">Coworking spaces</Link>
            <Link href="/office">Office spaces</Link>
            <LeadButton ctx="Footer" className="btn btn-sm" style={{ marginTop: 14 }}>Talk to an advisor</LeadButton>
          </div>
          {CITY_IDS.map((cid) => (
            <div key={cid}>
              <h5>{CITIES[cid].name}</h5>
              {CITIES[cid].locs.slice(0, 5).map((l) => (
                <Link key={l.slug} href={cityHref('cw', cid, l.slug)}>Coworking in {l.name}</Link>
              ))}
              <Link href={cityHref('of', cid)}>Office space in {CITIES[cid].name}</Link>
            </div>
          ))}
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} SpaceWallah. Workspaces across Delhi NCR.</span>
          <span>Prices exclude 18% GST.</span>
        </div>
      </div>
    </footer>
  );
}
