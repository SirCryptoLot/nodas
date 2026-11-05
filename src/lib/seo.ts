// Struktūrizuoti duomenys (schema.org JSON-LD) Google'ui.
import type { Product, Service } from '../data/catalog.ts';

type Site = { name: string; url: string; email: string; phone: string; areaServed: string };

const country = (site: Site) => ({ '@type': 'Country', name: site.areaServed });
const ref = (site: Site) => ({ '@type': 'Organization', name: site.name, url: site.url });

export function organization(site: Site): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: site.url + '/favicon.svg',
    email: site.email,
    telephone: site.phone,
    areaServed: country(site),
  };
}

export function product(p: Product, site: Site): object {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.short,
    url: `${site.url}/iranga/${p.slug}`,
    brand: { '@type': 'Brand', name: p.slug.startsWith('dgx') ? 'NVIDIA' : site.name },
  };
  if (p.priceEur !== null) {
    out.offers = {
      '@type': 'Offer',
      price: p.priceEur,
      priceCurrency: 'EUR',
      url: `${site.url}/iranga/${p.slug}`,
      seller: ref(site),
    };
  }
  return out;
}

export function service(s: Service, site: Site): object {
  const offers: Record<string, unknown> = { '@type': 'Offer', price: s.priceFrom, priceCurrency: 'EUR' };
  if (s.unit) {
    offers.priceSpecification = { '@type': 'UnitPriceSpecification', price: s.priceFrom, priceCurrency: 'EUR', unitText: 'MONTH' };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.short,
    provider: ref(site),
    areaServed: country(site),
    offers,
  };
}

export function faqPage(items: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
}

export function breadcrumbs(items: { name: string; path: string }[], site: Site): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, n) => ({
      '@type': 'ListItem',
      position: n + 1,
      name: i.name,
      item: site.url + (i.path === '/' ? '/' : i.path),
    })),
  };
}

export function article(a: { title: string; description: string; path: string; date: string }, site: Site): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    mainEntityOfPage: site.url + a.path,
    inLanguage: 'lt',
    author: ref(site),
    publisher: { ...ref(site), logo: { '@type': 'ImageObject', url: site.url + '/favicon.svg' } },
    image: site.url + '/og.png',
  };
}
