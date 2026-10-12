export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <span className="logo-mark" style={dark ? { background: 'var(--hero-2)' } : undefined}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 21V7l8-4 8 4v14" stroke="#F2F0E6" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9.5 21v-6.5h5V21" stroke="#E3A23B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </span>
      <span>Space<b>Wallah</b></span>
    </>
  );
}
