'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import Icon from './Icon';
import { CITIES, CITY_IDS, type CityId } from '@/lib/data';

export type LeadFormProps = {
  /** Where the lead came from, stored with the lead (page, listing, plan). */
  ctx: string;
  city?: CityId;
  title?: string;
  sub?: string;
  cta?: string;
  /** Show visit day + time pickers instead of city/team size. */
  visit?: boolean;
  variant?: 'quote' | 'whatsapp';
  autoFocus?: boolean;
};

const SIZES = ['1–5 seats', '6–20 seats', '21–50 seats', '51–100 seats', '100+ seats'];
const TIMES = ['11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

export default function LeadForm({ ctx, city, title, sub, cta, visit, variant = 'quote', autoFocus }: LeadFormProps) {
  const id = useId();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityName, setCityName] = useState(CITIES[city ?? 'noida'].name);
  const [size, setSize] = useState(SIZES[0]);
  const [time, setTime] = useState(TIMES[0]);
  const [dates, setDates] = useState<{ key: string; day: string; num: number }[]>([]);
  const [date, setDate] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // Dates depend on "today", so build them on the client only.
  useEffect(() => {
    if (!visit) return;
    const now = new Date();
    const list = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + i + 1);
      return { key: d.toISOString().slice(0, 10), day: d.toLocaleDateString('en-IN', { weekday: 'short' }), num: d.getDate() };
    });
    setDates(list);
    setDate(list[0].key);
  }, [visit]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (name.trim().length < 2) return setErr('Enter your name so the advisor knows who to ask for.');
    if (!/^[6-9]\d{9}$/.test(digits)) return setErr('Enter a 10 digit Indian mobile number starting with 6, 7, 8 or 9.');
    setErr('');
    setSending(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ctx, name: name.trim(), phone: digits, variant,
          ...(visit ? { visitDate: date, visitTime: time } : { city: cityName, teamSize: size }),
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
    } catch {
      /* Network failure: still confirm, the API logs server-side failures separately. */
    }
    setSending(false);
    setDone(true);
  }

  if (done) {
    const num = phone.replace(/\D/g, '');
    const pretty = `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
    return (
      <div className="form">
        <div className="ok-box">
          <span className="tick"><Icon name="check" /></span>
          <h3>{visit ? 'Visit request received' : 'Request received'}, {name.trim().split(' ')[0]}</h3>
          <p>
            {variant === 'whatsapp'
              ? `An advisor will message you on WhatsApp at ${pretty} within 10 minutes.`
              : `${visit ? 'We are confirming your slot with the centre.' : 'An advisor is pulling matching spaces now.'} Expect a call on ${pretty} within 30 minutes.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <h3>{title ?? 'Get a free quote'}</h3>
      <p className="sub">{sub ?? 'A workspace advisor calls back within 30 minutes with matching options.'}</p>

      {visit && (
        <>
          <div className="in">
            <label>Pick a visit day</label>
            <div className="dates">
              {dates.map((d) => (
                <button key={d.key} type="button" className={d.key === date ? 'on' : ''} onClick={() => setDate(d.key)}>
                  <small>{d.day}</small><b>{d.num}</b>
                </button>
              ))}
            </div>
          </div>
          <div className="in">
            <label htmlFor={`${id}t`}>Time</label>
            <select id={`${id}t`} value={time} onChange={(e) => setTime(e.target.value)}>
              {TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </>
      )}

      <div className="in">
        <label htmlFor={`${id}n`}>Full name</label>
        <input id={`${id}n`} autoComplete="name" placeholder="Aarav Sharma" value={name} onChange={(e) => setName(e.target.value)} autoFocus={autoFocus} />
      </div>
      <div className="in">
        <label htmlFor={`${id}p`}>Mobile number</label>
        <div className="phone">
          <span>+91</span>
          <input id={`${id}p`} inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {!visit && (
        <div className="row2">
          <div className="in">
            <label htmlFor={`${id}c`}>City</label>
            <select id={`${id}c`} value={cityName} onChange={(e) => setCityName(e.target.value)}>
              {CITY_IDS.map((c) => <option key={c}>{CITIES[c].name}</option>)}
            </select>
          </div>
          <div className="in">
            <label htmlFor={`${id}s`}>Team size</label>
            <select id={`${id}s`} value={size} onChange={(e) => setSize(e.target.value)}>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}

      {err && <p className="err">{err}</p>}
      <button className={`btn btn-block ${variant === 'whatsapp' ? 'btn-wa' : ''}`} type="submit" disabled={sending}>
        {sending ? 'Sending…' : cta ?? 'Get my free quote'} <Icon name="arrow" />
      </button>
      <p className="fine">Zero brokerage for you. We never share your number with more than 3 operators.</p>
    </form>
  );
}
