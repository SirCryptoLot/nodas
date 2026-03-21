import type { Metadata } from 'next'
import { ContactForm } from '../_components/ContactForm'

const BASE = 'https://nodas.lt'
const URL  = `${BASE}/web-spa`

export const metadata: Metadata = {
  title: 'Web SPA Priežiūra Lietuvoje — Svetainių palaikymas nuo €29/mėn',
  description:
    'Profesionali svetainių priežiūra ir palaikymas Lietuvoje. Uptime monitoringas 24/7, kasdieniniai backupai, SSL, turinio keitimai. Nuo €29/mėn. Jūs — verslui, mes — techninei daliai.',
  keywords: [
    'web spa priežiūra', 'svetainių priežiūra', 'svetainių palaikymas',
    'web priežiūra Lietuva', 'svetainės priežiūra', 'svetainių monitoringas',
    'uptime monitoringas', 'wordpress priežiūra', 'svetainės backup',
    'SSL sertifikatas', 'svetainių techninis palaikymas', 'web maintenance Lietuva',
    'svetainės administravimas', 'mėnesinė svetainių priežiūra',
  ],
  alternates: { canonical: URL, languages: { lt: URL, 'x-default': URL } },
  openGraph: {
    title: 'Web SPA Priežiūra — Svetainių palaikymas nuo €29/mėn | nodas.lt',
    description: 'Uptime monitoringas 24/7, backupai, SSL, turinio keitimai. Jūs — verslui, mes — techninei daliai.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Web SPA Priežiūra — nodas.lt' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${URL}#service`,
  name: 'Web SPA Priežiūra',
  alternateName: ['Svetainių priežiūra', 'Svetainių palaikymas', 'Web priežiūra Lietuva', 'Svetainių monitoringas'],
  description: 'Profesionali mėnesinė svetainių priežiūra ir palaikymas. Uptime monitoringas 24/7, kasdieniniai backupai, SSL, turinio keitimai. Nuo €29/mėn.',
  url: URL,
  provider: { '@type': 'LocalBusiness', name: 'nodas.lt', url: BASE, email: 'info@nodas.lt', address: { '@type': 'PostalAddress', addressCountry: 'LT' } },
  areaServed: { '@type': 'Country', name: 'Lithuania' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web SPA priežiūros planai',
    itemListElement: [
      { '@type': 'Offer', name: 'Bazinis planas', priceSpecification: { '@type': 'UnitPriceSpecification', price: '29', priceCurrency: 'EUR', unitCode: 'MON' } },
      { '@type': 'Offer', name: 'Pro planas', priceSpecification: { '@type': 'UnitPriceSpecification', price: '59', priceCurrency: 'EUR', unitCode: 'MON' } },
      { '@type': 'Offer', name: 'Enterprise planas', priceSpecification: { '@type': 'UnitPriceSpecification', price: '129', priceCurrency: 'EUR', unitCode: 'MON' } },
    ],
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Kas yra Web SPA priežiūra?', acceptedAnswer: { '@type': 'Answer', text: 'Web SPA — aktyvus svetainės stebėjimas ir priežiūra. Monitoringas 24/7, kasdieniniai backupai, SSL atnaujinimas, turinio keitimai. Jei svetainė sugenda — sužinosime mes, ne jūs.' } },
    { '@type': 'Question', name: 'Kiek kainuoja svetainių priežiūra?', acceptedAnswer: { '@type': 'Answer', text: 'Bazinis planas — €29/mėn (uptime stebėjimas, SSL, ataskaita, 1 keitimas/mėn). Pro — €59/mėn. Enterprise — €129/mėn su SLA 99.9% ir avariniu atsakymu per 2h.' } },
    { '@type': 'Question', name: 'Ar galima atšaukti planą?', acceptedAnswer: { '@type': 'Answer', text: 'Taip, planą galima atšaukti bet kuriuo metu. Įsipareigojimas tik mėnesiui.' } },
    { '@type': 'Question', name: 'Ką daryti jei svetainė sugenda priežiūros metu?', acceptedAnswer: { '@type': 'Answer', text: 'Apie tai sužinosime mes — monitoringas aptinka gedimą per 5–15 minučių. Pro ir Enterprise planuose reaguojame iš karto.' } },
    { '@type': 'Question', name: 'Ar dirbate su visomis svetainių platformomis?', acceptedAnswer: { '@type': 'Answer', text: 'Taip — WordPress, Shopify, Wix, Webflow, React/Next.js ir custom sprendimai.' } },
  ],
}

const FEATURES = [
  { icon: '📡', title: 'Uptime monitoringas', desc: 'Tikriname svetainės veikimą kas 5–15 minučių. Gedimo atveju — reaguojame iš karto.' },
  { icon: '💾', title: 'Kasdieniniai backupai', desc: 'Automatinės atsarginės kopijos. Galima atkurti bet kurią dieną per 30 min.' },
  { icon: '🔒', title: 'SSL sertifikatas', desc: 'Atnaujinamas automatiškai. Jokio "Nesaugus" įspėjimo lankytojams.' },
  { icon: '🛡️', title: 'Saugumo atnaujinimai', desc: 'Plugin, temų ir CMS atnaujinimai. Saugumo spragos užtaisytos laiku.' },
  { icon: '📝', title: 'Turinio keitimai', desc: 'Tekstai, nuotraukos, kainos — atliekame pagal poreikį pagal planą.' },
  { icon: '📊', title: 'Mėnesinė ataskaita', desc: 'Uptime statistika, atlikti darbai, rekomendacijos — kiekvieną mėnesį.' },
]

const PLANS = [
  {
    name: 'Bazinis',
    price: '€29',
    period: '/mėn',
    popular: false,
    features: [
      'Uptime stebėjimas kas 15 min.',
      'SSL sertifikato stebėjimas',
      'Mėnesinė ataskaita',
      '1 turinio keitimas/mėn.',
      'El. pašto pagalba',
    ],
    notIncluded: ['Kasdieniniai backupai', 'Avarinis atsakymas'],
  },
  {
    name: 'Pro',
    price: '€59',
    period: '/mėn',
    popular: true,
    features: [
      'Uptime stebėjimas kas 5 min.',
      'Kasdieniniai backupai',
      'SSL + saugumo atnaujinimai',
      '3 turinio keitimai/mėn.',
      'Atsakymas per 8h',
      'Mėnesinė ataskaita',
    ],
    notIncluded: ['Avarinis atsakymas per 2h'],
  },
  {
    name: 'Enterprise',
    price: '€129',
    period: '/mėn',
    popular: false,
    features: [
      'Realaus laiko monitoringas',
      'CDN tinklas',
      'SLA 99.9% garantija',
      'Avarinis atsakymas per 2h (24/7)',
      'Neriboti turinio keitimai',
      'Prioritetinis palaikymas',
    ],
    notIncluded: [],
  },
]

export default function WebSpaPage() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af,#2563eb)', padding: '72px 40px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '5px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>🛡️</span>
            <span style={{ fontSize: 12, color: '#bfdbfe', fontWeight: 600 }}>Svetainių priežiūra Lietuvoje</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 18px', letterSpacing: '-2px' }}>
            Web SPA Priežiūra<br /><span style={{ color: '#93c5fd' }}>nuo €29/mėn</span>
          </h1>

          <p style={{ fontSize: 18, color: '#bfdbfe', margin: '0 auto 32px', lineHeight: 1.6, maxWidth: 620 }}>
            Jūs — verslui. Mes — techninei daliai. Uptime monitoringas <strong style={{ color: '#fff' }}>24/7</strong>, kasdieniniai backupai, SSL, turinio keitimai.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="#planai" style={{ background: '#fff', color: '#1e3a8a', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Pasirinkti planą →
            </a>
            <a href="#kas-iteina" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)' }}>
              Kas įeina?
            </a>
          </div>

          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ v: '24/7', l: 'Monitoringas' }, { v: '99.9%', l: 'Uptime SLA' }, { v: '5 min', l: 'Tikrinimas' }, { v: '<30min', l: 'Backup atkūrimas' }].map(({ v, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#93c5fd', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section style={{ padding: '72px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ display: 'inline-block', background: '#fef9c3', border: '1px solid #fcd34d', borderRadius: 12, padding: '14px 24px', fontSize: 15, color: '#854d0e', fontWeight: 600, marginBottom: 48 }}>
            ⚠️ 60% svetainių turi kritinius saugumo pažeidimus — ar žinote, kaip sekasi jūsų?
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Kodėl reikia priežiūros</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>Be priežiūros vs. Su priežiūra</h2>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#dc2626', marginBottom: 16 }}>❌ Be priežiūros</div>
              {['Svetainė sugenda — sužinote iš klientų', 'Pasenę pluginai = saugumo spragos', 'SSL baigiasi — naršyklė blokuoja', 'Backup nėra — duomenys prarasti', 'Lėta svetainė — lankytojai išeina'].map(t => (
                <div key={t} style={{ fontSize: 14, color: '#7f1d1d', marginBottom: 10, paddingLeft: 8, borderLeft: '3px solid #fca5a5' }}>{t}</div>
              ))}
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#166534', marginBottom: 16 }}>✅ Su Web SPA priežiūra</div>
              {['Gedimą aptinkame mes — per 5 min.', 'Atnaujinimai atliekami automatiškai', 'SSL atnaujinamas laiku, visada saugus', 'Kasdieniniai backupai — visada galima atkurti', 'Greičio optimizavimas įtrauktas'].map(t => (
                <div key={t} style={{ fontSize: 14, color: '#14532d', marginBottom: 10, paddingLeft: 8, borderLeft: '3px solid #86efac' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="kas-iteina" style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Funkcijos</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>Kas įeina į priežiūrą</h2>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="planai" style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Planai</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Pasirinkite tinkamą planą</h2>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>Galima keisti ar atšaukti bet kada</p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {PLANS.map(({ name, price, period, popular, features, notIncluded }) => (
              <div key={name} style={{
                background: popular ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : '#fff',
                borderRadius: 18, padding: 32,
                border: popular ? 'none' : '1px solid #e2e8f0',
                boxShadow: popular ? '0 8px 40px rgba(37,99,235,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative', transform: popular ? 'scale(1.04)' : 'none',
              }}>
                {popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    ⭐ POPULIARIAUSIAS
                  </div>
                )}
                <div style={{ fontSize: 15, fontWeight: 700, color: popular ? '#bfdbfe' : '#64748b', marginBottom: 12 }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: popular ? '#fff' : '#0f172a' }}>{price}</span>
                  <span style={{ fontSize: 14, color: popular ? '#93c5fd' : '#64748b' }}>{period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: popular ? '#bfdbfe' : '#374151', lineHeight: 1.4 }}>
                      <span style={{ color: popular ? '#4ade80' : '#2563eb', flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                  {notIncluded.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: popular ? 'rgba(255,255,255,0.3)' : '#cbd5e1', lineHeight: 1.4 }}>
                      <span style={{ flexShrink: 0 }}>—</span>{f}
                    </div>
                  ))}
                </div>
                <a href="#kontaktai" style={{ display: 'block', textAlign: 'center', padding: '12px 0', background: popular ? '#fff' : '#2563eb', color: popular ? '#1e40af' : '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  Pradėti →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>D.U.K.</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>Dažni klausimai apie SPA priežiūrą</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'Kas yra Web SPA priežiūra?', a: 'Aktyvus svetainės stebėjimas ir priežiūra. Monitoringas 24/7, kasdieniniai backupai, SSL, turinio keitimai. Jei svetainė sugenda — sužinosime mes, ne jūs.' },
              { q: 'Kiek kainuoja svetainių priežiūra?', a: 'Bazinis planas — €29/mėn. Pro — €59/mėn (kasdieniniai backupai, 3 keitimai/mėn). Enterprise — €129/mėn su SLA 99.9% ir avariniu atsakymu per 2h.' },
              { q: 'Ar galima atšaukti planą?', a: 'Taip. Įsipareigojimas tik mėnesiui — galima atšaukti bet kada.' },
              { q: 'Ką daryti jei svetainė sugenda priežiūros metu?', a: 'Apie tai sužinosime mes — monitoringas aptinka gedimą per 5–15 min. Pro ir Enterprise planuose reaguojame iš karto.' },
              { q: 'Ar dirbate su visomis platformomis?', a: 'Taip — WordPress, Shopify, Wix, Webflow, React/Next.js ir custom sprendimai.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <summary style={{ padding: '18px 22px', fontSize: 15, fontWeight: 700, color: '#0f172a', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {q}<span style={{ color: '#2563eb', fontSize: 20, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 22px 18px', paddingTop: 16, fontSize: 14, color: '#475569', lineHeight: 1.7, borderTop: '1px solid #e2e8f0' }}>{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="kontaktai" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Kontaktai</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Pradėkite šiandien</h2>
            <p style={{ fontSize: 15, color: '#bfdbfe', margin: 0 }}>Pirmasis mėnuo — po pirmojo patikrinimo · Atsakome per 4h</p>
          </div>
          <ContactForm />
          <div style={{ textAlign: 'center', marginTop: 24, color: '#93c5fd', fontSize: 14 }}>
            ✉️ <a href="mailto:info@nodas.lt" style={{ color: '#93c5fd', textDecoration: 'none' }}>info@nodas.lt</a>
          </div>
        </div>
      </section>
    </main>
  )
}
