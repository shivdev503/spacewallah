import { NextResponse } from 'next/server';

/**
 * Receives every lead from the site (quote, WhatsApp, site visit, shortlist).
 *
 * Set LEAD_WEBHOOK_URL in .env to forward leads to your CRM, a Google Apps
 * Script attached to a Sheet, Zapier/Make, or your WhatsApp Business provider.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').replace(/\D/g, '');
  if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: 'Name and a valid 10 digit Indian mobile number are required' }, { status: 422 });
  }

  const lead = {
    name,
    phone: `+91${phone}`,
    source: String(body.ctx ?? '').slice(0, 300),
    variant: body.variant ?? 'quote',
    city: body.city ?? null,
    teamSize: body.teamSize ?? null,
    visitDate: body.visitDate ?? null,
    visitTime: body.visitTime ?? null,
    page: body.page ?? null,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get('user-agent'),
  };

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!res.ok) console.error('[lead] webhook responded', res.status);
    } catch (e) {
      console.error('[lead] webhook failed', e);
    }
  } else {
    console.log('[lead]', lead);
  }

  return NextResponse.json({ ok: true });
}
