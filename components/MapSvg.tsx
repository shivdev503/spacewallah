import { LINE, type Listing } from '@/lib/data';

/** Schematic location map. Replace with a Google Maps / Mapbox embed using real coordinates. */
export default function MapSvg({ l }: { l: Listing }) {
  const col = LINE[l.line];
  const dx = Math.min(260, 60 + l.walk * 18);
  return (
    <svg viewBox="0 0 720 280" role="img" aria-label={`Location of ${l.name} relative to ${l.station} metro station`}>
      <rect width="720" height="280" fill="var(--sunk)" />
      <g stroke="var(--line)" strokeWidth="10" fill="none" strokeLinecap="round"><path d="M0 70H720M0 200H720M140 0V280M420 0V280M610 0V280" /></g>
      <g fill="var(--surface)" stroke="var(--line)">
        <rect x="160" y="88" width="80" height="94" rx="6" /><rect x="440" y="88" width="150" height="94" rx="6" />
        <rect x="30" y="88" width="90" height="94" rx="6" /><rect x="630" y="215" width="80" height="55" rx="6" />
        <rect x="160" y="215" width="240" height="55" rx="6" />
      </g>
      <path d="M0 135 C180 120 300 150 720 128" stroke={col} strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="300" cy="140" r="11" fill="var(--surface)" stroke={col} strokeWidth="5" />
      <text x="300" y="112" textAnchor="middle" fontFamily="Hanken Grotesk, system-ui, sans-serif" fontSize="14" fontWeight="700" fill="var(--ink)">{l.station}</text>
      <path d={`M300 152 V200 H${300 + dx}`} stroke="var(--ink)" strokeWidth="2.5" strokeDasharray="5 6" fill="none" />
      <text x={300 + dx / 2} y="228" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="var(--muted)">{l.walk} min walk</text>
      <g transform={`translate(${300 + dx - 14},158)`}>
        <path d="M14 40s-14-13-14-24a14 14 0 0 1 28 0c0 11-14 24-14 24z" fill="#E3A23B" />
        <circle cx="14" cy="15" r="5" fill="#1C1305" />
      </g>
    </svg>
  );
}
