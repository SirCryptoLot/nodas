export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="8" cy="18" r="4.5" fill="#2563eb"/>
        <circle cx="28" cy="8" r="4.5" fill="#2563eb" opacity="0.65"/>
        <circle cx="28" cy="28" r="4.5" fill="#2563eb" opacity="0.65"/>
        <line x1="8" y1="18" x2="28" y2="8" stroke="#2563eb" strokeWidth="1.5" opacity="0.4"/>
        <line x1="8" y1="18" x2="28" y2="28" stroke="#2563eb" strokeWidth="1.5" opacity="0.4"/>
        <line x1="28" y1="8" x2="28" y2="28" stroke="#2563eb" strokeWidth="1" opacity="0.25"/>
      </svg>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#1e40af', letterSpacing: '-0.5px' }}>
        nodas<span style={{ color: '#93c5fd', fontWeight: 500, fontSize: 13 }}>.lt</span>
      </span>
    </div>
  )
}
