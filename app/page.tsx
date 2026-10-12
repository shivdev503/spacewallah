import Link from 'next/link';
import Icon from '@/components/Icon';
import Card from '@/components/Card';
import HeroSearch from '@/components/HeroSearch';
import { CityTile, Faq, LeadBand } from '@/components/Sections';
import { art } from '@/lib/art';
import { CITY_IDS, LISTINGS, inr, listingsOf, minOf, totalLocs } from '@/lib/data';

export default function HomePage() {
  const cwAll = listingsOf('cw');
  const ofAll = listingsOf('of');
  const featured = [...cwAll.filter((l) => l.tag), ...ofAll.filter((l) => l.tag)]
    .sort((a, b) => +b.rating - +a.rating)
    .slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="eyebrow"><i />NCR’s metro-first workspace marketplace</span>
              <h1>Find your next workspace. <em>Move in this week.</em></h1>
              <p className="lede">
                Coworking desks, private cabins and full offices across Delhi, Noida and Gurugram. Every price shown upfront,
                every space toured by our team, zero brokerage for you.
              </p>
              <HeroSearch />
              <div className="stats">
                <div><b>{LISTINGS.length}+</b><span>verified spaces</span></div>
                <div><b>{totalLocs()}</b><span>micro-locations</span></div>
                <div><b>₹0</b><span>brokerage for you</span></div>
                <div><b>30 min</b><span>advisor callback</span></div>
              </div>
            </div>
            <div className="hero-art" style={{ background: art(8, 2) }}>
              <div className="float f1">
                <span className="dot"><Icon name="rupee" /></span>
                <div><b>Dedicated desk from {inr(minOf(listingsOf('cw', 'noida'), (l) => l.desk))}</b><small>per seat / month in Noida</small></div>
              </div>
              <div className="float f2">
                <span className="dot"><Icon name="calendar" /></span>
                <div><b>Visit booked · Sector 62</b><small>Tomorrow, 11:00 AM with advisor</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">Two ways to work</span><h2>Flexible desks or an office of your own</h2></div></div>
          <div className="paths">
            <Link className="path" href="/coworking" style={{ background: art(0, 1) }}>
              <span className="go"><Icon name="arrow" /></span>
              <span className="from">From {inr(minOf(cwAll, (l) => l.hot))} / seat / month</span>
              <h3>Coworking spaces</h3>
              <p>Hot desks, dedicated desks and private cabins with meeting rooms, café and Wi‑Fi included. Start in 48 hours.</p>
              <div className="tags"><span>Day pass</span><span>Hot desk</span><span>Dedicated desk</span><span>Private cabin</span></div>
            </Link>
            <Link className="path" href="/office" style={{ background: art(1, 4) }}>
              <span className="go"><Icon name="arrow" /></span>
              <span className="from">From {inr(minOf(ofAll, (l) => l.rent))} / sq ft / month</span>
              <h3>Office spaces</h3>
              <p>Managed, furnished and bare shell offices from 1,200 to 25,000 sq ft for teams that want their own floor and brand.</p>
              <div className="tags"><span>Managed office</span><span>Furnished</span><span>Bare shell</span><span>Built-to-suit</span></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="sec sec-tint">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow">Cities</span><h2>Three cities, {totalLocs()} business districts</h2><p>Start with the city, then narrow to the sector or road your team can reach by metro.</p></div>
            <Link className="link" href="/coworking">All coworking <Icon name="arrow" /></Link>
          </div>
          <div className="cities">{CITY_IDS.map((c) => <CityTile key={c} cid={c} kind="cw" />)}</div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">Handpicked</span><h2>Spaces teams are touring this week</h2></div></div>
          <div className="grid">{featured.map((l) => <Card key={l.id} l={l} />)}</div>
        </div>
      </section>

      <section className="sec sec-tint">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">By team size</span><h2>What fits your team right now</h2></div></div>
          <div className="sizes">
            <Link className="size" href="/coworking"><span className="who">1 seat · freelancer</span><h3>Hot desk</h3><p>Any open seat, daily buzz, all amenities. Cancel any month.</p><span className="from">from {inr(minOf(cwAll, (l) => l.hot))}/mo</span></Link>
            <Link className="size" href="/coworking"><span className="who">2–15 seats · startup</span><h3>Private cabin</h3><p>A lockable room with your name on the door and shared meeting rooms.</p><span className="from">from {inr(minOf(cwAll, (l) => l.cabin))}/seat</span></Link>
            <Link className="size" href="/office"><span className="who">15–100 seats · scaling</span><h3>Managed office</h3><p>Your own floor, branded and run by the operator on one per-seat bill.</p><span className="from">from {inr(minOf(ofAll, (l) => l.seatPrice))}/seat</span></Link>
            <Link className="size" href="/office"><span className="who">100+ seats · enterprise</span><h3>Leased office</h3><p>Bare shell or built-to-suit floors in Grade A towers on long leases.</p><span className="from">from {inr(minOf(ofAll, (l) => l.rent))}/sq ft</span></Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><div><span className="eyebrow">How it works</span><h2>From search to keys in three steps</h2></div></div>
          <div className="steps">
            <div className="step"><span className="num">Step 1</span><h3>Share your brief</h3><p>Team size, budget and the metro line your people use. Takes 60 seconds on a call or form.</p></div>
            <div className="step"><span className="num">Step 2</span><h3>Tour your shortlist</h3><p>Your advisor books back-to-back visits and joins you on site to negotiate.</p></div>
            <div className="step"><span className="num">Step 3</span><h3>Sign and move in</h3><p>We check the agreement, lock-in and GST invoice. Coworking desks go live in 48 hours.</p></div>
          </div>
        </div>
      </section>

      <section className="sec sec-tint">
        <div className="wrap">
          <div className="why">
            <div><span className="ico"><Icon name="rupee" /></span><h4>Zero brokerage</h4><p>Operators pay us. You pay the space price and nothing more.</p></div>
            <div><span className="ico"><Icon name="shield" /></span><h4>Verified in person</h4><p>Every listing is visited, photographed and priced by our team.</p></div>
            <div><span className="ico"><Icon name="metro" /></span><h4>Metro-first search</h4><p>See walking time to the nearest station and line before you shortlist.</p></div>
            <div><span className="ico"><Icon name="headset" /></span><h4>One advisor, start to finish</h4><p>Same person from first call to move-in day. No call centres.</p></div>
          </div>
        </div>
      </section>

      <LeadBand ctx="Homepage" />
      <Faq />
    </>
  );
}
