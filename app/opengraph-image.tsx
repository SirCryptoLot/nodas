import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'nodas.lt — Svetainių remontas ir priežiūra Lietuvoje'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '64px 80px',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Top: logo + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            nodas<span style={{ color: '#93c5fd' }}>.lt</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.15)', borderRadius: 100,
            padding: '8px 20px',
          }}>
            <span style={{ fontSize: 20 }}>🇱🇹</span>
            <span style={{ fontSize: 15, color: '#bfdbfe', fontWeight: 600 }}>Lietuvos IT specialistas</span>
          </div>
        </div>

        {/* Center: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-2px' }}>
            Svetainė sugedo?
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#93c5fd', lineHeight: 1.05, letterSpacing: '-2px' }}>
            Sutvarkom.
          </div>
          <div style={{ fontSize: 24, color: '#bfdbfe', fontWeight: 400, marginTop: 8 }}>
            Web remontas nuo €39 · SPA priežiūra nuo €29/mėn · Diagnozė per 4h
          </div>
        </div>

        {/* Bottom: stats */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { value: '< 4h', label: 'Diagnozė' },
            { value: '€39', label: 'Nuo' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Monitoringas' },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{value}</div>
              <div style={{ fontSize: 14, color: '#93c5fd' }}>{label}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: '#fff', color: '#1e3a8a',
              padding: '14px 28px', borderRadius: 12,
              fontSize: 16, fontWeight: 700,
            }}>
              info@nodas.lt
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
