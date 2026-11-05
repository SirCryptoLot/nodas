import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SITE } from '../../src/data/site.ts';
import { products, services } from '../../src/data/catalog.ts';
import { organization, product, service, faqPage, breadcrumbs, article } from '../../src/lib/seo.ts';

test('organization serves Lithuania', () => {
  const o: any = organization(SITE);
  assert.equal(o['@type'], 'Organization');
  assert.equal(o.url, 'https://nodas.lt');
  assert.equal(o.areaServed.name, 'Lietuva');
});

test('product jsonld omits offers when price is null', () => {
  const p: any = product({ ...products[0], priceEur: null }, SITE);
  assert.equal(p['@type'], 'Product');
  assert.equal(p.url, 'https://nodas.lt/iranga/dgx-spark');
  assert.equal('offers' in p, false);
});

test('product jsonld has EUR offer when priced', () => {
  const p: any = product({ ...products[0], priceEur: 6500 }, SITE);
  assert.equal(p.offers['@type'], 'Offer');
  assert.equal(p.offers.price, 6500);
  assert.equal(p.offers.priceCurrency, 'EUR');
});

test('service jsonld monthly unit', () => {
  const monthly: any = service(services.find((s) => s.unit)!, SITE);
  assert.equal(monthly['@type'], 'Service');
  assert.equal(monthly.offers.priceSpecification.unitText, 'MONTH');
  const once: any = service(services.find((s) => s.slug === 'idiegimas')!, SITE);
  assert.equal(once.offers.price, 149);
  assert.equal(once.offers.priceSpecification, undefined);
});

test('faqPage maps q/a to Question/acceptedAnswer', () => {
  const f: any = faqPage([{ q: 'Kas?', a: 'Tas.' }]);
  assert.equal(f['@type'], 'FAQPage');
  assert.equal(f.mainEntity[0]['@type'], 'Question');
  assert.equal(f.mainEntity[0].name, 'Kas?');
  assert.equal(f.mainEntity[0].acceptedAnswer.text, 'Tas.');
});

test('breadcrumbs positions start at 1 with absolute urls', () => {
  const b: any = breadcrumbs([{ name: 'Pradžia', path: '/' }, { name: 'Įranga', path: '/iranga' }], SITE);
  assert.equal(b.itemListElement[0].position, 1);
  assert.equal(b.itemListElement[1].item, 'https://nodas.lt/iranga');
});

test('article has headline, date and publisher', () => {
  const a: any = article({ title: 'T', description: 'D', path: '/x', date: '2026-11-05' }, SITE);
  assert.equal(a['@type'], 'Article');
  assert.equal(a.headline, 'T');
  assert.equal(a.datePublished, '2026-11-05');
  assert.equal(a.mainEntityOfPage, 'https://nodas.lt/x');
  assert.equal(a.publisher.name, 'nodas');
});
