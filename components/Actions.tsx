'use client';

import type { CSSProperties, ReactNode } from 'react';
import Icon from './Icon';
import { useSite } from './Providers';

/** Opens the quote form in a modal. */
export function LeadButton({ ctx, listingId, className = 'btn', style, children }: {
  ctx: string; listingId?: string; className?: string; style?: CSSProperties; children: ReactNode;
}) {
  const { openLead } = useSite();
  return <button type="button" className={className} style={style} onClick={() => openLead(ctx, listingId)}>{children}</button>;
}

/** Opens the WhatsApp lead form in a modal. */
export function WhatsAppButton({ ctx, className = 'btn btn-wa', style, children }: {
  ctx: string; className?: string; style?: CSSProperties; children: ReactNode;
}) {
  const { openWhatsApp } = useSite();
  return <button type="button" className={className} style={style} onClick={() => openWhatsApp(ctx)}>{children}</button>;
}

export function HeartButton({ id, name, style }: { id: string; name: string; style?: CSSProperties }) {
  const { shortlist, toggleShort } = useSite();
  const on = shortlist.includes(id);
  return (
    <button type="button" className={`heart ${on ? 'on' : ''}`} style={style} aria-pressed={on}
      aria-label={on ? `Remove ${name} from shortlist` : `Add ${name} to shortlist`}
      onClick={(e) => { e.preventDefault(); toggleShort(id); }}>
      <Icon name="heart" />
    </button>
  );
}
