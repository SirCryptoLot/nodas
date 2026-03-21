import type { Metadata } from 'next'
import { ContactForm } from './_components/ContactForm'

const BASE_URL = 'https://nodas.lt'

export const metadata: Metadata = {
  title: 'Svetainių remontas ir priežiūra Lietuvoje — nuo €39 | nodas.lt',
  description:
    'Svetainė sugedo, lėta ar nulaužta? Profesionalus web remontas Lietuvoje — diagnozė per 4h, mokate tik už rezultatą. Web SPA priežiūra nuo €29/mėn. WordPress, React, Wix, Shopify, Next.js.',
  alternates: {
    canonical: BASE_URL,
    languages: { lt: BASE_URL, 'x-default': BASE_URL },
  },
  openGraph: {
    title: 'Svetainių remontas ir priežiūra Lietuvoje | nodas.lt',
    description:
      'Svetainė sugedo? Sutvarkom per 24h. Diagnozė nemokama — mokate tik už rezultatą. Web SPA priežiūra nuo €29/mėn. Dirbame su WordPress, React, Wix, Shopify.',
    url: BASE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'nodas.lt — Svetainių remontas Lietuvoje' }],
  },
}

// ── JSON-LD: Service schemas ────────────────────────────────────────────────

const jsonLdWebRemontas = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${BASE_URL}/#web-remontas`,
  name: 'Web Remontas',
  alternateName: ['Svetainės remontas', 'Svetainių taisymas', 'WordPress remontas'],
  description:
    'Profesionalus svetainių remontas Lietuvoje. Diagnozuojame per 4 valandas, taisome greitai. Dirbame su WordPress, React, Next.js, Wix, Shopify ir kitomis platformomis. Mokate tik už rezultatą.',
  url: BASE_URL,
  provider: {
    '@type': 'LocalBusiness',
    name: 'nodas.lt',
    url: BASE_URL,
    email: 'info@nodas.lt',
    address: { '@type': 'PostalAddress', addressCountry: 'LT' },
  },
  areaServed: { '@type': 'Country', name: 'Lithuania' },
  serviceType: 'Web Development',
  category: 'Website Repair',
  offers: {
    '@type': 'Offer',
    name: 'Web Remontas',
    description: 'Svetainių remontas ir taisymas. Diagnozė nemokama.',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      minPrice: '39',
      priceCurrency: 'EUR',
      description: 'nuo €39 — galutinė kaina priklauso nuo darbo sudėtingumo',
    },
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Remonto paslaugos',
    itemListElement: [
      { '@type': 'Offer', name: 'WordPress remontas', price: '39', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Svetainės saugumo atkūrimas', price: '59', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Greičio optimizavimas', price: '49', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'SSL sertifikato konfigūracija', price: '39', priceCurrency: 'EUR' },
    ],
  },
}

const jsonLdWebSpa = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${BASE_URL}/#web-spa`,
  name: 'Web SPA Priežiūra',
  alternateName: ['Svetainių priežiūra', 'Svetainių palaikymas', 'Web priežiūra Lietuva'],
  description:
    'Mėnesinė svetainių priežiūra ir monitoringas. Uptime stebėjimas 24/7, kasdieniniai backupai, SSL atnaujinimas, turinio keitimai. Jūs — verslui, mes — techninei daliai.',
  url: BASE_URL,
  provider: {
    '@type': 'LocalBusiness',
    name: 'nodas.lt',
    url: BASE_URL,
    email: 'info@nodas.lt',
    address: { '@type': 'PostalAddress', addressCountry: 'LT' },
  },
  areaServed: { '@type': 'Country', name: 'Lithuania' },
  serviceType: 'Website Maintenance',
  category: 'Web Hosting & Maintenance',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web SPA priežiūros planai',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Bazinis planas',
        description: 'Uptime stebėjimas, SSL, mėnesinė ataskaita, 1 turinio keitimas',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '29', priceCurrency: 'EUR', unitCode: 'MON' },
      },
      {
        '@type': 'Offer',
        name: 'Pro planas',
        description: 'Kasdieniniai backupai, 3 turinio keitimai/mėn., atsakymas per 8h',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '59', priceCurrency: 'EUR', unitCode: 'MON' },
      },
      {
        '@type': 'Offer',
        name: 'Enterprise planas',
        description: 'Realaus laiko monitoringas, CDN, SLA 99.9%, avarinis atsakymas per 2h',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '129', priceCurrency: 'EUR', unitCode: 'MON' },
      },
    ],
  },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kaip greitai galite sutvarkyti svetainę?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Diagnozę atliekame per 4 valandas. Dauguma remonto darbų — tą pačią dieną. Sudėtingesniais atvejais — per 1–2 darbo dienas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kiek kainuoja web remontas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paprastos klaidos taisymas — nuo €39. Galutinė kaina priklauso nuo problemos sudėtingumo. Visada pateikiame kainą prieš pradedant darbą — jokių netikėtumų.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kas įeina į Web SPA priežiūrą?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Priklausomai nuo plano: uptime monitoringas, kasdieniniai backupai, SSL atnaujinimas, turinio keitimai ir prioritetinis techninis palaikymas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar dirbate su visomis svetainių platformomis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip — WordPress, Webflow, Wix, Shopify, custom HTML/PHP, React/Next.js ir daugiau.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar reikia mokėti iš anksto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Web remontui — ne. Mokate tik po to, kai problema išspręsta ir jūs patenkinti rezultatu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kuo skiriasi Web SPA nuo paprastos priežiūros?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Web SPA — tai aktyvus stebėjimas ir prevencija, o ne tik reagavimas į problemas. Jei svetainė sugenda — apie tai sužinosime mes, ne jūs.',
      },
    },
  ],
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Pradžia', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Web Remontas', item: `${BASE_URL}/#paslaugos` },
    { '@type': 'ListItem', position: 3, name: 'Web SPA Priežiūra', item: `${BASE_URL}/#planai` },
  ],
}

const SERVICES = [
  { icon: '🔧', title: 'Web Remontas', desc: 'Svetainė lėta, nulaužta ar neveikia? Diagnozuojame per 4h, taisome greitai. Jokio mokėjimo iš anksto.', price: 'nuo €39', highlight: true },
  { icon: '🛡️', title: 'Web SPA priežiūra', desc: 'Mėnesinė priežiūra, monitoringas 24/7, backupai, SSL, turinio keitimai. Jūs — verslui.', price: 'nuo €29/mėn', highlight: true },
  { icon: '🤖', title: 'AI Svetainė', desc: 'Aprašykite verslą — AI sukurs profesionalią svetainę per minutes.', price: '€149' },
  { icon: '📦', title: 'WordPress / CMS', desc: 'Pilnai valdoma svetainė su administravimo paneliu ir SEO įrankiais.', price: '€349' },
  { icon: '⚡', title: 'Custom Dev', desc: 'Individualios sistemos React, Next.js ir Node.js technologijomis.', price: 'Pagal poreikį' },
  { icon: '🔍', title: 'SEO', desc: 'Optimizuojame svetainę Google paieškos rezultatams ir turinio strategijai.', price: 'Individualus' },
]

const SPA_PLANS = [
  {
    name: 'Bazinis',
    price: '€29',
    period: '/mėn',
    features: ['Uptime stebėjimas kas 15 min.', 'SSL sertifikato įspėjimas', 'Mėnesinė ataskaita', '1 turinio keitimas/mėn.'],
    cta: 'Pradėti',
    popular: false,
  },
  {
    name: 'Pro',
    price: '€59',
    period: '/mėn',
    features: ['Uptime stebėjimas kas 5 min.', 'Kasdieniniai backupai', '3 turinio keitimai/mėn.', 'Atsakymas per 8h'],
    cta: 'Pasirinkti',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '€129',
    period: '/mėn',
    features: ['Realaus laiko stebėjimas', 'CDN tinklas', 'SLA 99.9%', 'Avarinis atsakymas per 2h (24/7)'],
    cta: 'Susisiekti',
    popular: false,
  },
]

const FAQ = [
  {
    q: 'Kaip greitai galite sutvarkyti svetainę?',
    a: 'Diagnozę atliekame per 4 valandas. Dauguma remonto darbų — tą pačią dieną. Sudėtingesniais atvejais — per 1–2 darbo dienas.',
  },
  {
    q: 'Kiek kainuoja web remontas?',
    a: 'Paprastos klaidos taisymas — nuo €39. Galutinė kaina priklauso nuo problemos sudėtingumo. Visada pateikiame kainą prieš pradedant darbą — jokių netikėtumų.',
  },
  {
    q: 'Kas įeina į Web SPA priežiūrą?',
    a: 'Priklausomai nuo plano: uptime monitoringas, kasdieniniai backupai, SSL atnaujinimas, turinio keitimai ir prioritetinis techninis palaikymas.',
  },
  {
    q: 'Ar dirbate su visomis svetainių platformomis?',
    a: 'Taip — WordPress, Webflow, Wix, Shopify, custom HTML/PHP, React/Next.js ir daugiau. Jei kyla abejonių — susisiekite, patarsime.',
  },
  {
    q: 'Ar reikia mokėti iš anksto?',
    a: 'Web remontui — ne. Mokate tik po to, kai problema išspręsta ir jūs patenkinti rezultatu. SPA priežiūrai — pirmasis mėnuo po pirmojo patikrinimo.',
  },
  {
    q: 'Kuo skiriasi Web SPA nuo paprastos priežiūros?',
    a: 'Web SPA — tai aktyvus stebėjimas ir prevencija, o ne tik reagavimas į problemas. Jei svetainė sugenda — apie tai sužinosime mes, ne jūs.',
  },
]

export default function Home() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebRemontas) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSpa) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── HERO ── */}
      <section className="mobile-section" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        padding: '72px 40px 80px',
      }}>
        <div className="mobile-stack mobile-gap-sm" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 400px', gap: 56, alignItems: 'center',
        }}>

          {/* Left column */}
          <div>
            {/* LT badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(255,255,255,0.15)', borderRadius: 100,
              padding: '5px 14px', marginBottom: 22,
            }}>
              <span style={{ fontSize: 14 }}>🇱🇹</span>
              <span style={{ fontSize: 12, color: '#bfdbfe', fontWeight: 600, letterSpacing: '0.3px' }}>
                Lietuvos IT specialistas
              </span>
            </div>

            <h1 className="mobile-hero-title" style={{
              fontSize: 50, fontWeight: 900, color: '#fff',
              lineHeight: 1.1, margin: '0 0 18px', letterSpacing: '-1.5px',
            }}>
              Svetainė sugedo?<br />
              <span style={{ color: '#93c5fd' }}>Sutvarkom.</span>
            </h1>

            <p style={{ fontSize: 17, color: '#bfdbfe', margin: '0 0 28px', lineHeight: 1.65 }}>
              Web remontas ir priežiūra — greita, patikima, be jokio mokėjimo iš anksto.
              Nuo <strong style={{ color: '#fff' }}>€39</strong>.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                '🔧 Web remontas per 24 val. — nuo €39',
                '🛡️ Mėnesinė SPA priežiūra — nuo €29/mėn',
                '⚙️ WordPress, React, Next.js, Wix, Shopify',
                '✓ Diagnozė per 4h · mokate tik už rezultatą',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#e0f2fe', fontSize: 15, lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <a href="#kontaktai" style={{
                background: '#fff', color: '#1e3a8a',
                padding: '13px 28px', borderRadius: 10, fontSize: 15,
                fontWeight: 700, textDecoration: 'none',
              }}>
                Gauti nemokamą diagnostiką →
              </a>
              <a href="#paslaugos" style={{
                background: 'rgba(255,255,255,0.12)', color: '#fff',
                padding: '13px 28px', borderRadius: 10, fontSize: 15,
                fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)',
              }}>
                Paslaugos
              </a>
            </div>

            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { value: '< 4h', label: 'Diagnozė' },
                { value: '24h', label: 'Remontas' },
                { value: '99.9%', label: 'SPA uptime' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#93c5fd', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — quick-order card */}
          <div className="mobile-full" style={{
            background: '#fff', borderRadius: 20, padding: 28,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>⚡ Greita pagalba</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Pasirinkite paslaugą — atsakome per 4h</div>

            {[
              { icon: '🔧', label: 'Web Remontas', price: 'nuo €39', color: '#fef3c7', badge: '#f59e0b' },
              { icon: '🛡️', label: 'SPA priežiūra', price: 'nuo €29/mėn', color: '#dbeafe', badge: '#2563eb' },
              { icon: '📦', label: 'WordPress', price: '€349', color: '#dcfce7', badge: '#16a34a' },
              { icon: '🤖', label: 'AI Svetainė', price: '€149', color: '#ede9fe', badge: '#7c3aed' },
            ].map(({ icon, label, price, color, badge }) => (
              <a key={label} href="#kontaktai" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 10, background: color,
                marginBottom: 10, textDecoration: 'none',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{icon} {label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: badge, borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap' }}>
                  {price}
                </span>
              </a>
            ))}

            <a href="#kontaktai" style={{
              display: 'block', textAlign: 'center',
              background: '#2563eb', color: '#fff', padding: '13px 0',
              borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', marginTop: 14,
            }}>
              Susisiekti dabar →
            </a>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
              Nemokama konsultacija · Atsakome per 4h
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#1e3a8a', padding: '16px 24px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          flexWrap: 'wrap', gap: 24,
        }}>
          {[
            { icon: '🔒', label: 'SSL apsauga' },
            { icon: '⚡', label: 'Atsakymas per 4h' },
            { icon: '🇱🇹', label: 'Lietuviškai' },
            { icon: '🛡️', label: '24/7 monitoringas' },
            { icon: '💳', label: 'Paysera mokėjimai' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#bfdbfe', fontSize: 13 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="paslaugos" className="mobile-section" style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Paslaugos
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Viskas, ko reikia jūsų svetainei
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 10 }}>
              Web remontas ir priežiūra — mūsų specializacija
            </p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {SERVICES.map(({ icon, title, desc, price, highlight }) => (
              <div key={title} style={{
                background: highlight ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#fff',
                borderRadius: 14, padding: 24,
                border: highlight ? '2px solid #2563eb' : '1px solid #e2e8f0',
                boxShadow: highlight ? '0 4px 20px rgba(37,99,235,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}>
                {highlight && (
                  <div style={{
                    position: 'absolute', top: -11, left: 20,
                    background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 999, letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>Populiariausia</div>
                )}
                <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{desc}</div>
                <div style={{
                  display: 'inline-block',
                  background: highlight ? '#2563eb' : '#dbeafe',
                  color: highlight ? '#fff' : '#1e40af',
                  borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 700, alignSelf: 'flex-start',
                }}>
                  {price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mobile-section" style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Procesas
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Paprasta kaip 1-2-3
            </h2>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { num: '01', icon: '📋', title: 'Aprašykite problemą', desc: 'Pasakykite kas nutiko — per formą, el. paštą ar telefonu. Jokių techninių žargonų.' },
              { num: '02', icon: '🔍', title: 'Diagnozuojame per 4h', desc: 'Išsiaiškinsime problemą ir pateikime tikslią kainą. Jokių netikėtumų, jokio mokėjimo iš anksto.' },
              { num: '03', icon: '✅', title: 'Sutvarkom ir pristatom', desc: 'Dirbiame greičiai. Gavę jūsų patvirtinimą — problema išspręsta, svetainė veikia.' },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', background: '#eff6ff',
                  border: '2px solid #bfdbfe', margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 8 }}>{num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPA PLANS ── */}
      <section id="planai" className="mobile-section" style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Planai
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
              Web SPA priežiūros planai
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
              Patikėkite svetainę mums. Jūs — verslui, mes — techninei daliai.
            </p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {SPA_PLANS.map(({ name, price, period, features, cta, popular }) => (
              <div key={name} style={{
                background: popular ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : '#fff',
                borderRadius: 18, padding: 30,
                border: popular ? 'none' : '1px solid #e2e8f0',
                boxShadow: popular ? '0 8px 40px rgba(37,99,235,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative', transform: popular ? 'scale(1.04)' : 'none',
              }}>
                {popular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                  }}>⭐ POPULIARIAUSIAS</div>
                )}
                <div style={{ fontSize: 15, fontWeight: 700, color: popular ? '#bfdbfe' : '#64748b', marginBottom: 12 }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: popular ? '#fff' : '#0f172a' }}>{price}</span>
                  <span style={{ fontSize: 14, color: popular ? '#93c5fd' : '#64748b' }}>{period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: popular ? '#bfdbfe' : '#374151', lineHeight: 1.5 }}>
                      <span style={{ color: popular ? '#4ade80' : '#2563eb', flexShrink: 0, fontSize: 14 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#kontaktai" style={{
                  display: 'block', textAlign: 'center', padding: '12px 0',
                  background: popular ? '#fff' : '#2563eb',
                  color: popular ? '#1e40af' : '#fff',
                  borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}>
                  {cta} →
                </a>
              </div>
            ))}
          </div>

          {/* Repair pricing note */}
          <div style={{
            marginTop: 36, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
            padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>🔧 Web Remontas — vienkartinis</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Diagnozė nemokama · Mokate tik už rezultatą · Nuo €39</div>
            </div>
            <a href="#kontaktai" style={{
              background: '#0f172a', color: '#fff', padding: '11px 22px',
              borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Kreiptis dabar →
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="duk" className="mobile-section" style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              D.U.K.
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Dažniausiai užduodami klausimai
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map(({ q, a }) => (
              <details key={q} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden',
              }}>
                <summary style={{
                  padding: '18px 22px', fontSize: 15, fontWeight: 700, color: '#0f172a',
                  cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  userSelect: 'none',
                }}>
                  {q}
                  <span style={{ color: '#2563eb', fontSize: 20, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 22px 18px', fontSize: 14, color: '#475569', lineHeight: 1.7, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="kontaktai" className="mobile-section" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Kontaktai
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0 }}>
              Pradėkime šiandien
            </h2>
            <p style={{ fontSize: 15, color: '#bfdbfe', marginTop: 12 }}>
              Parašykite — atsakysime per 4 valandas.
            </p>
          </div>

          <ContactForm />

          <div style={{ textAlign: 'center', marginTop: 28, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <a href="mailto:info@nodas.lt" style={{ color: '#93c5fd', fontSize: 14, textDecoration: 'none' }}>
              ✉️ info@nodas.lt
            </a>
            <span style={{ color: '#bfdbfe', fontSize: 14 }}>🇱🇹 Lietuva</span>
            <span style={{ color: '#bfdbfe', fontSize: 14 }}>⚡ Per 4 val.</span>
          </div>
        </div>
      </section>

    </main>
  )
}
