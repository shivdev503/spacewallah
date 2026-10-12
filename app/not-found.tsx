import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="hero hero-sm">
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1 style={{ marginTop: 14 }}>This space is <em>no longer listed.</em></h1>
        <p className="lede">It may have been leased or moved. Browse current spaces instead.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
          <Link className="btn" href="/coworking">Coworking spaces</Link>
          <Link className="btn btn-ghost" style={{ color: 'var(--hero-ink)', borderColor: 'var(--hero-line)' }} href="/office">Office spaces</Link>
        </div>
      </div>
    </section>
  );
}
