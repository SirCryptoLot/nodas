import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page } from './dist.js';

test('kontaktai has form with all plan options and privacy link', () => {
  const h = page('/kontaktai');
  assert.match(h, /<form[^>]*id="forma"/);
  for (const n of ['name', 'contact', 'plan', 'topic', 'message', 'website']) assert.match(h, new RegExp(`name="${n}"`), n);
  for (const v of ['idiegimas', 'dgx-spark', 'rtx5090', 'rtx5090x2', 'rtxpro6000', 'dgx-station', 'verslo-serveris', 'palaikymas', 'necenzuruotas', 'nezinau']) {
    assert.match(h, new RegExp(`<option value="${v}"`), v);
  }
  assert.match(h, /id="forma-zinute"[^>]*aria-live="polite"/);
  assert.match(h, /href="\/privatumas"/);
  assert.ok(h.includes('Jūsų duomenis naudosime tik atsakyti į užklausą'));
});

test('kontaktai shows contact placeholders from SITE and ContactPage jsonld', () => {
  const h = page('/kontaktai');
  const main = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  assert.ok(main.includes('[EL. PAŠTAS]') && main.includes('[TELEFONAS]'));
  assert.match(main, /data-email/);
  assert.match(main, /data-phone/);
});
