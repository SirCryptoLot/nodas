import type { Metadata } from 'next'
import { ContactForm } from '../_components/ContactForm'

const BASE = 'https://nodas.lt'
const URL  = `${BASE}/web-remontas`

export const metadata: Metadata = {
  title: 'Web Remontas Lietuvoje — Svetainių taisymas nuo €39',
  description:
    'Profesionalus svetainių remontas Lietuvoje. Svetainė lėta, nulaužta ar neveikia? Diagnozuojame per 4h, mokate tik už rezultatą. WordPress, React, Wix, Shopify, Next.js. nuo €39.',
  keywords: [
    'web remontas', 'svetainių remontas', 'svetainės remontas', 'svetainė neveikia',
    'svetainė sugedo', 'lėta svetainė', 'WordPress remontas', 'svetainė nulaužta',
    'web remontas Lietuva', 'web remontas Vilnius', 'svetainių taisymas',
    'svetainė klaida', '500 klaida', 'SSL klaida svetainė', 'svetainė lėta greičio optimizavimas',
  ],
  alternates: { canonical: URL, languages: { lt: URL, 'x-default': URL } },
  openGraph: {
    title: 'Web Remontas Lietuvoje — Svetainių taisymas nuo €39 | nodas.lt',
    description: 'Svetainė lėta ar sugedo? Diagnozuojame per 4h, mokate tik už rezultatą. WordPress, React, Wix, Shopify.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Web Remontas — nodas.lt' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${URL}#service`,
  name: 'Web Remontas',
  alternateName: ['Svetainės remontas', 'Svetainių taisymas', 'WordPress remontas', 'Web taisymas Lietuva'],
  description: 'Profesionalus svetainių remontas Lietuvoje. Diagnozė per 4h, mokate tik už rezultatą. Dirbame su WordPress, React, Next.js, Wix, Shopify.',
  url: URL,
  provider: { '@type': 'LocalBusiness', name: 'nodas.lt', url: BASE, email: 'info@nodas.lt', address: { '@type': 'PostalAddress', addressCountry: 'LT' } },
  areaServed: [{ '@type': 'Country', name: 'Lithuania' }, { '@type': 'City', name: 'Vilnius' }, { '@type': 'City', name: 'Kaunas' }],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Remonto paslaugos',
    itemListElement: [
      { '@type': 'Offer', name: 'Greičio optimizavimas', priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: '39', priceCurrency: 'EUR' } },
      { '@type': 'Offer', name: 'WordPress klaidos taisymas', priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: '39', priceCurrency: 'EUR' } },
      { '@type': 'Offer', name: 'Saugumo atkūrimas po įsilaužimo', priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: '59', priceCurrency: 'EUR' } },
      { '@type': 'Offer', name: 'SSL sertifikato konfigūracija', priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: '39', priceCurrency: 'EUR' } },
      { '@type': 'Offer', name: 'Baltosios ekrano klaida (White Screen of Death)', priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: '49', priceCurrency: 'EUR' } },
    ],
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Kiek kainuoja web remontas?', acceptedAnswer: { '@type': 'Answer', text: 'Paprastos klaidos taisymas — nuo €39. Galutinę kainą pateikiame po diagnostikos. Jokio mokėjimo iš anksto.' } },
    { '@type': 'Question', name: 'Kaip greitai diagnostikuojate problemą?', acceptedAnswer: { '@type': 'Answer', text: 'Diagnozę atliekame per 4 valandas. Dauguma remonto darbų atliekama tą pačią dieną.' } },
    { '@type': 'Question', name: 'Su kokiomis platformomis dirbate?', acceptedAnswer: { '@type': 'Answer', text: 'WordPress, Wix, Shopify, Webflow, React/Next.js, custom HTML/PHP ir daugeliu kitų.' } },
    { '@type': 'Question', name: 'Ar reikia mokėti iš anksto?', acceptedAnswer: { '@type': 'Answer', text: 'Ne. Mokate tik po to, kai problema išspręsta ir jūs patenkinti rezultatu.' } },
    { '@type': 'Question', name: 'Ką daryti jei svetainė buvo nulaužta?', acceptedAnswer: { '@type': 'Answer', text: 'Susisiekite nedelsiant. Atkuriame svetainę iš backup, pašaliname malware, sutvirtinamas saugumas ir pakeičiami slaptažodžiai.' } },
  ],
}

const PROBLEMS = [
  { icon: '🐢', title: 'Lėta svetainė', desc: 'PageSpeed žemas, lankytojai išeina? Optimizuojame greitį.' },
  { icon: '⛔', title: 'Klaidos (500, 404)', desc: 'Serverio ar puslapio klaidos — diagnozuojame ir taisome.' },
  { icon: '🔒', title: 'SSL problema', desc: 'Naršyklė rodo "Nesaugus"? Konfigūruojame sertifikatą.' },
  { icon: '💀', title: 'Baltas ekranas', desc: 'WordPress White Screen of Death — žinoma problema, greitai išsprendžiama.' },
  { icon: '🦠', title: 'Įsilaužimas / Malware', desc: 'Pašaliname virusus, atkuriame svetainę, užtikriname saugumą.' },
  { icon: '📧', title: 'El. pašto problemos', desc: 'Domenų el. paštas neveikia, spam — konfigūruojame SPF/DKIM.' },
  { icon: '📱', title: 'Mobili versija sugedo', desc: 'Dizainas išsipildęs telefone? Ištaisome responsyvumą.' },
  { icon: '🔌', title: 'Pluginų konfliktai', desc: 'WordPress pluginai konfliktuoja — identifikuojame ir sprendžiame.' },
]

const PLATFORMS = ['WordPress', 'Wix', 'Shopify', 'Webflow', 'React / Next.js', 'PHP / Laravel', 'HTML / CSS', 'Joomla', 'Drupal', 'OpenCart']

const PRICES = [
  { name: 'Greičio optimizavimas', price: 'nuo €39', desc: 'Core Web Vitals, cache, CDN, image optimization' },
  { name: 'Klaidos taisymas', price: 'nuo €39', desc: '404, 500, DB klaidos, plugin konfliktai' },
  { name: 'SSL konfigūracija', price: 'nuo €39', desc: 'Let\'s Encrypt, Cloudflare, nginx/apache konfigūracija' },
  { name: 'Malware šalinimas', price: 'nuo €59', desc: 'Viruso šalinimas, backup atkūrimas, saugumo sutvirtinimas' },
  { name: 'Pilnas auditais', price: 'nuo €79', desc: 'Visapusiškas patikrinimas + ataskaita + taisymas' },
]

export default function WebRemontasPage() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af,#2563eb)', padding: '72px 40px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '5px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>🔧</span>
            <span style={{ fontSize: 12, color: '#bfdbfe', fontWeight: 600 }}>Svetainių remontas Lietuvoje</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 18px', letterSpacing: '-2px' }}>
            Web Remontas<br /><span style={{ color: '#93c5fd' }}>nuo €39</span>
          </h1>

          <p style={{ fontSize: 18, color: '#bfdbfe', margin: '0 auto 32px', lineHeight: 1.6, maxWidth: 620 }}>
            Svetainė lėta, nulaužta ar visai neveikia? Diagnozuojame per <strong style={{ color: '#fff' }}>4 valandas</strong> ir taisome. Mokate tik už rezultatą.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="#kontaktai" style={{ background: '#fff', color: '#1e3a8a', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Gauti nemokamą diagnostiką →
            </a>
            <a href="#kainos" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)' }}>
              Kainos
            </a>
          </div>

          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ v: '4h', l: 'Diagnozė' }, { v: '€39', l: 'Nuo' }, { v: '0%', l: 'Mokėjimas iš anksto' }, { v: '24h', l: 'Taisymas' }].map(({ v, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#93c5fd', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMS ── */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Problemos</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Ką taisome</h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>Dirbame su visomis dažniausiomis svetainių problemomis</p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {PROBLEMS.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#f8fafc', borderRadius: 14, padding: 22, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section style={{ padding: '60px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Platformos</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 28px' }}>Dirbame su visomis platformomis</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {PLATFORMS.map(p => (
              <span key={p} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, color: '#374151' }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Procesas</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>Kaip tai veikia</h2>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { n: '01', icon: '📝', t: 'Aprašykite problemą', d: 'Per formą, el. paštą ar telefonu. Jokio techninių žargonų.' },
              { n: '02', icon: '🔍', t: 'Diagnozuojame', d: 'Per 4h identifikuojame priežastį ir pateikiame tikslią kainą.' },
              { n: '03', icon: '🔧', t: 'Taisome', d: 'Gauję patvirtinimą — taisome greitai ir kokybiškai.' },
              { n: '04', icon: '✅', t: 'Patikrinate', d: 'Mokate tik tada, kai esate patenkinti rezultatu.' },
            ].map(({ n, icon, t, d }) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>{n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICES ── */}
      <section id="kainos" style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Kainodara</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Skaidrios kainos</h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>Galutinę kainą pateikiame prieš darbą. Jokių netikėtumų.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PRICES.map(({ name, price, desc }) => (
              <div key={name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{desc}</div>
                </div>
                <div style={{ background: '#eff6ff', color: '#1e40af', padding: '6px 16px', borderRadius: 8, fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>{price}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fef9c3', border: '1px solid #fcd34d', borderRadius: 12, padding: '16px 24px', marginTop: 20, fontSize: 14, color: '#854d0e' }}>
            💡 <strong>Diagnozė nemokama.</strong> Galutinė kaina gali skirtis priklausomai nuo problemos sudėtingumo — visada informuojame prieš pradedant darbą.
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>D.U.K.</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>Dažni klausimai apie web remontą</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'Kiek kainuoja web remontas?', a: 'Paprastos klaidos taisymas — nuo €39. Galutinę kainą pateikiame po diagnostikos, prieš pradedant darbą. Jokio mokėjimo iš anksto.' },
              { q: 'Kaip greitai diagnostikuojate problemą?', a: 'Diagnozę atliekame per 4 valandas. Dauguma remonto darbų atliekama tą pačią dieną.' },
              { q: 'Su kokiomis platformomis dirbate?', a: 'WordPress, Wix, Shopify, Webflow, React/Next.js, PHP/Laravel, custom HTML/CSS ir daugeliu kitų.' },
              { q: 'Ar reikia mokėti iš anksto?', a: 'Ne. Mokate tik po to, kai problema išspręsta ir jūs patenkinti rezultatu.' },
              { q: 'Ką daryti jei svetainė buvo nulaužta?', a: 'Susisiekite nedelsiant. Atkuriame iš backup, šaliname malware, sutvirtinamas saugumas, keičiami slaptažodžiai.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
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
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Aprašykite problemą</h2>
            <p style={{ fontSize: 15, color: '#bfdbfe', margin: 0 }}>Diagnostika nemokama · Atsakome per 4h</p>
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
