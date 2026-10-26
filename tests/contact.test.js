import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler, { validate, escapeHtml } from '../api/contact.js';

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
