'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import LeadForm, { type LeadFormProps } from './LeadForm';
import { CITIES, getById, inr, listingHref, type Listing } from '@/lib/data';

type Modal =
  | { type: 'lead'; props: LeadFormProps }
  | { type: 'shortlist' }
  | null;

type Ctx = {
  shortlist: string[];
  toggleShort: (id: string) => void;
  openLead: (ctx: string, listingId?: string) => void;
  openWhatsApp: (ctx: string) => void;
  openShortlist: () => void;
  toast: (msg: string) => void;
};

const SiteContext = createContext<Ctx | null>(null);

export function useSite() {
  const c = useContext(SiteContext);
  if (!c) throw new Error('useSite must be used inside <Providers>');
  return c;
}

const STORAGE_KEY = 'sw-short';

export default function Providers({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [toastMsg, setToastMsg] = useState('');
  const pathname = usePathname();

  // Restore shortlist after hydration (localStorage is browser-only).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
      setShortlist(saved.filter((id) => getById(id)));
    } catch { /* storage blocked: start empty */ }
  }, []);

  // Close any modal when the route changes.
  useEffect(() => setModal(null), [pathname]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(''), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleShort = useCallback((id: string) => {
    setShortlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setToastMsg(prev.includes(id) ? 'Removed from shortlist' : 'Added to shortlist');
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const openLead = useCallback((ctx: string, listingId?: string) => {
    const l = listingId ? getById(listingId) : undefined;
    setModal({
      type: 'lead',
      props: {
        ctx,
        city: l?.city,
        title: l ? 'Get the best price' : 'Get a free quote',
        sub: l ? `for ${l.name}. Advisors usually beat the listed rate by 5 to 12%.` : undefined,
      },
    });
  }, []);

  const openWhatsApp = useCallback((ctx: string) => {
    setModal({
      type: 'lead',
      props: {
        ctx: `WhatsApp · ${ctx}`,
        variant: 'whatsapp',
        title: 'Chat with an advisor on WhatsApp',
        sub: 'Share your number. An advisor messages you on WhatsApp within 10 minutes with options, photos and brochures.',
        cta: 'Start WhatsApp chat',
      },
    });
  }, []);

  const value: Ctx = {
    shortlist, toggleShort, openLead, openWhatsApp,
    openShortlist: () => setModal({ type: 'shortlist' }),
    toast: setToastMsg,
  };

  return (
    <SiteContext.Provider value={value}>
      {children}

      <button className="wa" type="button" onClick={() => openWhatsApp('Floating button')}>
        <Icon name="whatsapp" /> Chat on WhatsApp
      </button>
      <div className="mbar">
        <button className="btn btn-wa" type="button" onClick={() => openWhatsApp('Mobile bar')}>WhatsApp</button>
        <button className="btn" type="button" onClick={() => openLead('General enquiry')}>Get free quote</button>
      </div>

      {modal && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setModal(null)} role="dialog" aria-modal="true">
          <div className={`modal-in ${modal.type === 'shortlist' && shortlist.length >= 2 ? 'wide' : ''}`}>
            <button className="x" type="button" aria-label="Close" onClick={() => setModal(null)}><Icon name="x" /></button>
            {modal.type === 'lead' ? <LeadForm {...modal.props} autoFocus /> : <ShortlistView />}
          </div>
        </div>
      )}

      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </SiteContext.Provider>
  );
}

function ShortlistView() {
  const { shortlist, toggleShort, openLead } = useSite();
  const items = shortlist.map(getById).filter(Boolean) as Listing[];
  const price = (l: Listing) => (l.kind === 'cw' ? `${inr(l.desk)} /seat` : `${inr(l.rent)} /sq ft`);
  const quoteAll = () => openLead(`Shortlist: ${items.map((l) => l.name).join('; ')}`);

  if (!items.length) {
    return (
      <div className="form">
        <h3>Your shortlist</h3>
        <p className="sub" style={{ margin: 0 }}>Tap the heart on any space to save it here and compare later.</p>
      </div>
    );
  }

  if (items.length === 1) {
    const l = items[0];
    return (
      <div className="form">
        <h3>Your shortlist</h3>
        <div className="sl-item">
          <div><Link href={listingHref(l)}>{l.name}</Link><small>{l.loc}, {CITIES[l.city].name} · {price(l)}</small></div>
          <button className="heart on" style={{ position: 'static', border: '1px solid var(--line)' }} type="button" onClick={() => toggleShort(l.id)} aria-label="Remove"><Icon name="heart" /></button>
        </div>
        <button className="btn btn-block" type="button" onClick={quoteAll}>Get a quote</button>
      </div>
    );
  }

  const rows: [string, (l: Listing) => string][] = [
    ['Location', (l) => `${l.loc}, ${CITIES[l.city].name}`],
    ['Price', price],
    ['Metro', (l) => `${l.walk} min to ${l.station}`],
    ['Rating', (l) => `★ ${l.rating}`],
    ['Size', (l) => (l.kind === 'cw' ? `${l.seats} seats` : `${l.area.toLocaleString('en-IN')} sq ft`)],
    ['Access', (l) => (l.kind === 'cw' ? (l.h24 ? '24×7' : 'Mon–Sat') : l.ready)],
    ['Lock-in', (l) => (l.kind === 'cw' ? '3 months' : `${l.lock} months`)],
  ];

  return (
    <div className="form">
      <h3>Compare your shortlist</h3>
      <p className="sub">{items.length} spaces side by side. Ask for quotes on all of them in one go.</p>
      <div className="tbl-wrap">
        <table className="ptable">
          <thead>
            <tr>
              <th />
              {items.map((l) => (
                <th key={l.id} style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--f-body)', fontSize: '.88rem', color: 'var(--ink)', fontWeight: 700 }}>
                  <Link href={listingHref(l)}>{l.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, f]) => (
              <tr key={label}>
                <td style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{label}</td>
                {items.map((l) => <td key={l.id} style={{ fontSize: '.9rem' }}>{f(l)}</td>)}
              </tr>
            ))}
            <tr>
              <td />
              {items.map((l) => (
                <td key={l.id}>
                  <button className="heart on" style={{ position: 'static', border: '1px solid var(--line)', width: 32, height: 32 }} type="button" onClick={() => toggleShort(l.id)} aria-label={`Remove ${l.name}`}><Icon name="heart" /></button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <button className="btn btn-block" type="button" onClick={quoteAll}>Get quotes for all {items.length}</button>
    </div>
  );
}
