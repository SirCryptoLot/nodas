import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler, { validate, escapeHtml, _resetRateLimit } from '../../api/contact.js';

const valid = { name: 'Jonas', contact: 'jonas@pvz.lt', plan: 'kompiuteris', message: 'Noriu AI', website: '' };

function fakeRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.body = obj; return res; };
  res.setHeader = () => res;
  return res;
}

let calls;
const realFetch = globalThis.fetch;
const envBackup = { ...process.env };

beforeEach(() => {
  _resetRateLimit();
  calls = [];
  globalThis.fetch = async (url, opts) => { calls.push({ url, opts }); return { ok: true, json: async () => ({ id: '1' }) }; };
  process.env.RESEND_API_KEY = 'key123';
  process.env.CONTACT_TO = 'to@nodas.lt';
  process.env.CONTACT_FROM = 'forma@nodas.lt';
});

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...envBackup };
});

test('validate rejects missing name or contact', () => {
  assert.equal(validate({ ...valid, name: '  ' }).ok, false);
  assert.equal(validate({ ...valid, contact: '' }).ok, false);
});

test('validate rejects message over 2000 chars and name over 100', () => {
  assert.equal(validate({ ...valid, message: 'a'.repeat(2001) }).ok, false);
  assert.equal(validate({ ...valid, name: 'a'.repeat(101) }).ok, false);
});

test('validate rejects unknown plan', () => {
  assert.equal(validate({ ...valid, plan: 'kitas' }).ok, false);
});

test('validate trims and accepts valid body', () => {
  const r = validate({ ...valid, name: '  Jonas ' });
  assert.equal(r.ok, true);
  assert.equal(r.data.name, 'Jonas');
});

test('escapes html and keeps diacritics', () => {
  assert.equal(escapeHtml('<script>ąčęėįšųūž'), '&lt;script&gt;ąčęėįšųūž');
});

test('GET returns 405', async () => {
  const res = fakeRes();
  await handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 405);
});

test('bad JSON string returns 400', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: '{nope' }, res);
  assert.equal(res.statusCode, 400);
});

test('honeypot returns ok without sending', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: { ...valid, website: 'x' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 0);
});

test('fails with 500 when env missing', async () => {
  delete process.env.RESEND_API_KEY;
  const res = fakeRes();
  await handler({ method: 'POST', body: valid }, res);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { ok: false, error: 'config' });
  assert.equal(calls.length, 0);
});

test('sends to Resend and returns 200', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: JSON.stringify(valid) }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].opts.headers.Authorization, 'Bearer key123');
  const sent = JSON.parse(calls[0].opts.body);
  assert.equal(sent.to, 'to@nodas.lt');
  assert.equal(sent.from, 'forma@nodas.lt');
  assert.equal(sent.reply_to, 'jonas@pvz.lt');
  assert.equal(sent.subject, 'Nauja užklausa: AI kompiuteris');
});

test('no reply_to when contact is a phone number', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: { ...valid, contact: '+37060000000' } }, res);
  const sent = JSON.parse(calls[0].opts.body);
  assert.equal(sent.reply_to, undefined);
});

test('no reply_to when contact mixes email with other text', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: { ...valid, contact: 'jonas@gmail.com, 860012345' } }, res);
  assert.equal(res.statusCode, 200);
  const sent = JSON.parse(calls[0].opts.body);
  assert.equal(sent.reply_to, undefined);
  assert.ok(sent.html.includes('jonas@gmail.com, 860012345'));
});

test('fails with 502 when Resend errors', async () => {
  globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });
  const res = fakeRes();
  await handler({ method: 'POST', body: valid }, res);
  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { ok: false, error: 'send' });
});

test('fails with 502 when fetch throws', async () => {
  globalThis.fetch = async () => { throw new Error('network'); };
  const res = fakeRes();
  await handler({ method: 'POST', body: valid }, res);
  assert.equal(res.statusCode, 502);
});

test('validate rejects prototype keys as plan', () => {
  for (const plan of ['constructor', '__proto__', 'toString']) {
    assert.equal(validate({ ...valid, plan }).ok, false, plan);
  }
});

test('honeypot with non-string value still blocks', async () => {
  for (const website of [['x'], 1, true]) {
    const res = fakeRes();
    await handler({ method: 'POST', body: { ...valid, website } }, res);
    assert.equal(res.statusCode, 200);
  }
  assert.equal(calls.length, 0);
});

test('email html escapes user input and keeps diacritics', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: { ...valid, name: '<b>Ąžuolas</b>', message: '<script>x</script>\nčęė' } }, res);
  const sent = JSON.parse(calls[0].opts.body);
  assert.ok(sent.html.includes('&lt;b&gt;Ąžuolas&lt;/b&gt;'));
  assert.ok(sent.html.includes('&lt;script&gt;x&lt;/script&gt;<br>čęė'));
  assert.doesNotMatch(sent.html, /<script>|<b>Ą/);
});

test('Resend call has a timeout signal', async () => {
  const res = fakeRes();
  await handler({ method: 'POST', body: valid }, res);
  assert.ok(calls[0].opts.signal instanceof AbortSignal);
});

test('rate limit: 6th request from same IP within window gets 429', async () => {
  const req = () => ({ method: 'POST', body: valid, headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } });
  for (let i = 0; i < 5; i++) {
    const res = fakeRes();
    await handler(req(), res);
    assert.equal(res.statusCode, 200, `request ${i + 1}`);
  }
  const res = fakeRes();
  await handler(req(), res);
  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, { ok: false, error: 'rate' });
  const other = fakeRes();
  await handler({ ...req(), headers: { 'x-forwarded-for': '5.6.7.8' } }, other);
  assert.equal(other.statusCode, 200);
});
