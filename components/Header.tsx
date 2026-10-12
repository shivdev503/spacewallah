'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import Logo from './Logo';
import { useSite } from './Providers';

const NAV = [
  { href: '/coworking', label: 'Coworking' },
  { href: '/office', label: 'Office space' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { shortlist, openShortlist, openLead } = useSite();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="hdr">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="SpaceWallah home"><Logo /></Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? 'on' : ''}>{n.label}</Link>
          ))}
        </nav>
        <div className="hdr-r">
          <button className="short-btn" type="button" aria-label="Open shortlist" onClick={openShortlist}>
            <Icon name="heart" /><span className="n">{shortlist.length}</span>
          </button>
          <button className="btn btn-sm" type="button" onClick={() => openLead('Header')}>Get free quote</button>
          <button className="menu-btn" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <Icon name="menu" />
          </button>
        </div>
      </div>
      <div className={`wrap mnav ${open ? 'open' : ''}`}>
        {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label === 'Coworking' ? 'Coworking spaces' : 'Office spaces'}</Link>)}
      </div>
    </header>
  );
}
