import type { Metadata, Viewport } from 'next'
import './globals.css'

const BASE_URL = 'https://nodas.lt'

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'nodas.lt — Svetainių remontas ir priežiūra Lietuvoje | nuo €39',
    template: '%s | nodas.lt',
  },

  description:
    'Profesionalus svetainių remontas Lietuvoje — diagnozė per 4h, mokate tik už rezultatą. Web SPA priežiūra nuo €29/mėn. WordPress, React, Wix, Shopify. Susisiekite: info@nodas.lt',

  keywords: [
    'svetainių remontas',
    'web remontas',
    'svetainės remontas Lietuva',
    'svetainė neveikia',
    'svetainė sugedo',
    'lėta svetainė',
    'svetainių priežiūra',
    'web priežiūra',
    'svetainių palaikymas',
    'WordPress remontas',
    'WordPress priežiūra',
    'web remontas Vilnius',
    'IT specialistas Lietuva',
    'svetainių kūrimas',
    'web kūrimas Lietuva',
    'Next.js React kūrimas',
    'SSL sertifikatas',
    'svetainės saugumas',
    'web hosting Lietuva',
    'SEO optimizavimas',
    'nodas.lt',
  ],

  authors: [{ name: 'nodas.lt', url: BASE_URL }],
  creator: 'nodas.lt',
  publisher: 'nodas.lt',

  alternates: {
    canonical: BASE_URL,
    languages: {
      'lt': BASE_URL,
      'x-default': BASE_URL,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'lt_LT',
    url: BASE_URL,
    siteName: 'nodas.lt',
    title: 'nodas.lt — Svetainių remontas ir priežiūra Lietuvoje',
    description:
      'Svetainė sugedo? Sutvarkom per 24h. Diagnozė nemokama — mokate tik už rezultatą. Web SPA priežiūra nuo €29/mėn.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'nodas.lt — Svetainių remontas ir priežiūra Lietuvoje',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@nodaslt',
    creator: '@nodaslt',
    title: 'nodas.lt — Svetainių remontas ir priežiūra Lietuvoje',
    description: 'Svetainė sugedo? Sutvarkom per 24h. Diagnozė nemokama.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },

  category: 'technology',
}

// ── JSON-LD: WebSite + LocalBusiness (global, every page) ──────────────────

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'nodas.lt',
  url: BASE_URL,
  description: 'Svetainių remontas ir priežiūra Lietuvoje',
  inLanguage: 'lt',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#business`,
  name: 'nodas.lt',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/og-image.png`,
  description:
    'Profesionalus svetainių remontas ir priežiūra Lietuvoje. Web remontas nuo €39, Web SPA priežiūra nuo €29/mėn.',
  email: 'info@nodas.lt',
  telephone: undefined,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'LT',
    addressLocality: 'Lietuva',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 55.1694,
    longitude: 23.8813,
  },
  areaServed: [
    { '@type': 'Country', name: 'Lithuania' },
    { '@type': 'City', name: 'Vilnius' },
    { '@type': 'City', name: 'Kaunas' },
    { '@type': 'City', name: 'Klaipėda' },
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Credit Card, Paysera, Bank Transfer',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '22:00',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'IT Paslaugos',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Web Remontas', description: 'Svetainių remontas ir taisymas' },
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '39', priceCurrency: 'EUR', description: 'nuo €39' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Web SPA Priežiūra', description: 'Mėnesinė svetainių priežiūra ir monitoringas' },
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '29', priceCurrency: 'EUR', unitCode: 'MON', description: 'nuo €29/mėn' },
      },
    ],
  },
  sameAs: [
    'https://github.com/SirCryptoLot/nodas',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
        />
      </head>
      <body style={{ margin: 0, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
