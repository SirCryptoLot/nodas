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

// ── JSON-LD ─────────────────────────────────────────────────────────────────

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

// ── SVG Icons ────────────────────────────────────────────────────────────────

function IconWrench({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function IconShield({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconBot({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="10" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4M8 16v.01M16 16v.01" />
    </svg>
  )
}

function IconGlobe({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </svg>
  )
}

function IconCode({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function IconSearch({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function IconZap({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconMail({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconLock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconClock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconMonitor({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    Icon: IconWrench,
    title: 'Web Remontas',
    desc: 'Svetainė lėta, nulaužta ar neveikia? Diagnozuojame per 4h, taisome tą pačią dieną. Jokio mokėjimo iš anksto.',
    price: 'nuo €39',
    highlight: true,
    href: '/web-remontas',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
  },
  {
    Icon: IconShield,
    title: 'Web SPA priežiūra',
    desc: 'Mėnesinė priežiūra, monitoringas 24/7, backupai, SSL, turinio keitimai. Jūs — verslui, mes — techninei daliai.',
    price: 'nuo €29/mėn',
    highlight: true,
    href: '/web-spa',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    Icon: IconBot,
    title: 'AI Svetainė',
    desc: 'Aprašykite verslą — AI sukurs profesionalią svetainę per minutes.',
    price: '€149',
    highlight: false,
    href: '#kontaktai',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    Icon: IconGlobe,
    title: 'WordPress / CMS',
    desc: 'Pilnai valdoma svetainė su administravimo paneliu ir SEO įrankiais.',
    price: '€349',
    highlight: false,
    href: '#kontaktai',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    Icon: IconCode,
    title: 'Custom Dev',
    desc: 'Individualios sistemos React, Next.js ir Node.js technologijomis.',
    price: 'Pagal poreikį',
    highlight: false,
    href: '#kontaktai',
    iconBg: '#f1f5f9',
    iconColor: '#475569',
  },
  {
    Icon: IconSearch,
    title: 'SEO',
    desc: 'Optimizuojame svetainę Google paieškos rezultatams ir turinio strategijai.',
    price: 'Individualus',
    highlight: false,
    href: '#kontaktai',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebRemontas) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSpa) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1e40af 100%)',
        padding: '80px 24px 90px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -120, right: -120,
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
          <div className="mobile-stack mobile-gap-sm" style={{
            display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center',
          }}>

            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 28,
              }}>
                <span style={{ fontSize: 14 }}>🇱🇹</span>
                <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Lietuvos IT specialistas
                </span>
              </div>

              <h1 className="mobile-hero-title" style={{
                fontSize: 54, fontWeight: 900, color: '#fff',
                lineHeight: 1.08, margin: '0 0 20px', letterSpacing: '-1.5px',
              }}>
                Svetainė sugedo?<br />
                <span style={{
                  background: 'linear-gradient(90deg, #f97316, #fb923c)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Sutvarkom.</span>
              </h1>

              <p style={{ fontSize: 18, color: '#cbd5e1', margin: '0 0 32px', lineHeight: 1.7, maxWidth: 540 }}>
                Profesionalus web remontas ir priežiūra — diagnozė per 4h,
                mokate tik už rezultatą. Nuo <strong style={{ color: '#fff' }}>€39</strong>.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Web remontas per 24 val. — nuo €39',
                  'Mėnesinė SPA priežiūra — nuo €29/mėn',
                  'WordPress, React, Next.js, Wix, Shopify',
                  'Diagnozė per 4h · mokate tik už rezultatą',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0', fontSize: 15 }}>
                    <span style={{ color: '#f97316', flexShrink: 0, display: 'flex' }}>
                      <IconCheck />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
                <a href="#kontaktai"
                  className="inline-flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-orange-600"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#f97316', color: '#fff',
                    padding: '14px 28px', borderRadius: 10, fontSize: 15,
                    fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  Gauti nemokamą diagnostiką
                  <IconArrowRight />
                </a>
                <a href="#paslaugos"
                  className="transition-colors duration-200 hover:bg-white/20"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.08)', color: '#e2e8f0',
                    padding: '14px 28px', borderRadius: 10, fontSize: 15,
                    fontWeight: 600, textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                >
                  Paslaugos
                </a>
              </div>

              <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                {[
                  { value: '< 4h', label: 'Diagnozė' },
                  { value: '24h', label: 'Remontas' },
                  { value: '99.9%', label: 'SPA uptime' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{value}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Quick order card */}
            <div className="mobile-full" style={{
              background: '#fff', borderRadius: 20, padding: 30,
              boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#f97316', display: 'flex' }}><IconZap /></span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Greita pagalba</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                Pasirinkite paslaugą — atsakome per 4h
              </div>

              {[
                { label: 'Web Remontas', price: 'nuo €39', bg: '#eff6ff', accent: '#2563eb', Icon: IconWrench },
                { label: 'SPA priežiūra', price: 'nuo €29/mėn', bg: '#f0fdf4', accent: '#16a34a', Icon: IconShield },
                { label: 'WordPress', price: '€349', bg: '#fefce8', accent: '#ca8a04', Icon: IconGlobe },
                { label: 'AI Svetainė', price: '€149', bg: '#f5f3ff', accent: '#7c3aed', Icon: IconBot },
              ].map(({ label, price, bg, accent, Icon }) => (
                <a key={label} href="#kontaktai"
                  className="transition-all duration-150 hover:-translate-y-px hover:shadow-md cursor-pointer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 10, background: bg,
                    marginBottom: 10, textDecoration: 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                    <span style={{ color: accent, display: 'flex' }}><Icon size={18} /></span>
                    {label}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#fff', background: accent,
                    borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap',
                  }}>
                    {price}
                  </span>
                </a>
              ))}

              <a href="#kontaktai"
                className="flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-orange-600"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#f97316', color: '#fff', padding: '14px 0',
                  borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none',
                  marginTop: 16,
                }}
              >
                Susisiekti dabar
                <IconArrowRight />
              </a>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
                Nemokama konsultacija · Atsakome per 4h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section style={{ background: '#1e3a8a', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          flexWrap: 'wrap', gap: 28,
        }}>
          {[
            { Icon: IconLock, label: 'SSL apsauga' },
            { Icon: IconClock, label: 'Atsakymas per 4h' },
            { Icon: IconMonitor, label: '24/7 monitoringas' },
            { Icon: IconZap, label: 'Paysera mokėjimai' },
          ].map(({ Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>
              <span style={{ display: 'flex', opacity: 0.8 }}><Icon /></span>
              {label}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>
            <span style={{ fontSize: 16 }}>🇱🇹</span>
            Lietuviškai
          </div>
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '72px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Ar jums pažįstama?
          </div>
          <h2 className="mobile-h2" style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 48px', lineHeight: 1.2 }}>
            Svetainė neveikia — o verslas stovi
          </h2>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              {
                title: 'Svetainė lėta arba neveikia',
                desc: 'Pirkėjai palieka, Google baudžia — kiekviena minutė kainuoja.',
                bg: '#fef2f2', border: '#fecaca', text: '#991b1b',
              },
              {
                title: 'Nulaužta ar užkrėsta',
                desc: 'Virusai, spam nuorodos, juodasis sąrašas — reikalingas skubus atstatymas.',
                bg: '#fff7ed', border: '#fed7aa', text: '#9a3412',
              },
              {
                title: 'Niekas neatsako',
                desc: 'Kūrėjas dingo, hostingas tylus, nežinote kur ieškoti pagalbos.',
                bg: '#fdf4ff', border: '#e9d5ff', text: '#6b21a8',
              },
            ].map(({ title, desc, bg, border, text }) => (
              <div key={title} style={{
                background: bg, border: `1px solid ${border}`, borderRadius: 14,
                padding: '24px 22px', textAlign: 'left',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            Jei taip — <span style={{ color: '#f97316' }}>mes čia</span>.{' '}
            <a href="#kontaktai"
              className="hover:text-blue-800 transition-colors duration-150"
              style={{ color: '#2563eb', textDecoration: 'underline', textDecorationColor: '#bfdbfe' }}
            >
              Kreipkitės dabar →
            </a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="paslaugos" style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Paslaugos
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
              Viskas, ko reikia jūsų svetainei
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
              Web remontas ir priežiūra — mūsų specializacija
            </p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {SERVICES.map(({ Icon, title, desc, price, highlight, href, iconBg, iconColor }) => (
              <a key={title} href={href}
                className="flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: '#fff', borderRadius: 16, padding: 26,
                  border: highlight ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  boxShadow: highlight ? '0 4px 24px rgba(37,99,235,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                  textDecoration: 'none', position: 'relative',
                }}
              >
                {highlight && (
                  <div style={{
                    position: 'absolute', top: -11, left: 20,
                    background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700,
                    padding: '3px 12px', borderRadius: 999, letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>Populiariausia</div>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: iconColor, marginBottom: 14, flexShrink: 0,
                }}>
                  <Icon />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, flex: 1, marginBottom: 16 }}>{desc}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: highlight ? '#eff6ff' : '#f1f5f9',
                  color: highlight ? '#1e40af' : '#475569',
                  borderRadius: 8, padding: '5px 12px', fontSize: 13, fontWeight: 700, alignSelf: 'flex-start',
                }}>
                  {price}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Procesas
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Kaip tai veikia
            </h2>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative' }}>
            {[
              {
                num: '01', title: 'Aprašykite problemą',
                desc: 'Pasakykite kas nutiko — per formą, el. paštą ar telefonu. Jokių techninių žargonų.',
                Icon: IconMail,
              },
              {
                num: '02', title: 'Diagnozuojame per 4h',
                desc: 'Išsiaiškinsime problemą ir pateikime tikslią kainą. Jokių netikėtumų, jokio mokėjimo iš anksto.',
                Icon: IconSearch,
              },
              {
                num: '03', title: 'Sutvarkom ir pristatom',
                desc: 'Dirbiame greitai. Gavę jūsų patvirtinimą — problema išspręsta, svetainė veikia.',
                Icon: IconCheck,
              },
            ].map(({ num, title, desc, Icon }, i) => (
              <div key={num} style={{ textAlign: 'center', position: 'relative' }}>
                {i < 2 && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', top: 28, left: '65%', right: '-35%',
                    height: 2, background: 'linear-gradient(90deg, #2563eb, #bfdbfe)',
                    zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  margin: '0 auto 20px', position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 10 }}>{num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPA PLANS ────────────────────────────────────────────────────── */}
      <section id="planai" style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Planai
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
              Web SPA priežiūros planai
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
              Patikėkite svetainę mums. Jūs — verslui, mes — techninei daliai.
            </p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, alignItems: 'center' }}>
            {SPA_PLANS.map(({ name, price, period, features, cta, popular }) => (
              <div key={name} style={{
                background: popular ? 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)' : '#fff',
                borderRadius: 20, padding: popular ? 34 : 28,
                border: popular ? 'none' : '1px solid #e2e8f0',
                boxShadow: popular ? '0 12px 48px rgba(15,23,42,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative',
                transform: popular ? 'scale(1.04)' : 'none',
              }}>
                {popular && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg, #f97316, #fb923c)', color: '#fff',
                    fontSize: 11, fontWeight: 800, padding: '5px 16px', borderRadius: 999,
                    whiteSpace: 'nowrap', letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>Populiariausias</div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: popular ? '#93c5fd' : '#64748b', marginBottom: 14 }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: popular ? '#fff' : '#0f172a', letterSpacing: '-1px' }}>{price}</span>
                  <span style={{ fontSize: 14, color: popular ? '#93c5fd' : '#94a3b8' }}>{period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: popular ? '#cbd5e1' : '#374151', lineHeight: 1.55 }}>
                      <span style={{ color: popular ? '#4ade80' : '#2563eb', flexShrink: 0, display: 'flex', marginTop: 1 }}>
                        <IconCheck />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#kontaktai"
                  className={`flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 ${popular ? 'hover:bg-orange-600' : 'hover:bg-blue-900'}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px 0',
                    background: popular ? '#f97316' : '#1e40af',
                    color: '#fff',
                    borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  {cta}
                  <IconArrowRight />
                </a>
              </div>
            ))}
          </div>

          {/* Repair pricing note */}
          <div style={{
            marginTop: 40, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
            padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: '#eff6ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2563eb', flexShrink: 0,
              }}>
                <IconWrench size={20} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>Web Remontas — vienkartinis</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Diagnozė nemokama · Mokate tik už rezultatą · Nuo €39</div>
              </div>
            </div>
            <a href="#kontaktai"
              className="inline-flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-slate-800"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#0f172a', color: '#fff', padding: '12px 22px',
                borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Kreiptis dabar
              <IconArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="duk" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              D.U.K.
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Dažniausiai užduodami klausimai
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQ.map(({ q, a }) => (
              <details key={q} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 12, overflow: 'hidden',
              }}>
                <summary style={{
                  padding: '18px 22px', fontSize: 15, fontWeight: 700, color: '#0f172a',
                  cursor: 'pointer', listStyle: 'none', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center', userSelect: 'none',
                }}>
                  {q}
                  <span style={{ color: '#2563eb', fontSize: 22, flexShrink: 0, marginLeft: 16, fontWeight: 300, lineHeight: 1 }}>+</span>
                </summary>
                <div style={{
                  padding: '16px 22px 20px', fontSize: 14, color: '#475569',
                  lineHeight: 1.75, borderTop: '1px solid #e2e8f0',
                }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="kontaktai" style={{
        background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
        padding: '88px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Kontaktai
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>
              Pradėkime šiandien
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              Parašykite — atsakysime per 4 valandas. Diagnozė nemokama.
            </p>
          </div>

          <ContactForm />

          <div style={{
            textAlign: 'center', marginTop: 28,
            display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <a href="mailto:info@nodas.lt"
              className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-blue-300"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#93c5fd', fontSize: 14, textDecoration: 'none' }}
            >
              <IconMail />
              info@nodas.lt
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#475569', fontSize: 14 }}>
              <span>🇱🇹</span>
              Lietuva
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#475569', fontSize: 14 }}>
              <span style={{ color: '#f97316', display: 'flex' }}><IconZap /></span>
              Per 4 val.
            </span>
          </div>
        </div>
      </section>

    </main>
  )
}
