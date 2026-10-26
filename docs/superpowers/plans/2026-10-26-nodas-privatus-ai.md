# nodas.lt privataus AI svetainė: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A one-page Lithuanian site at nodas.lt selling private/local AI, with a contact form that emails inquiries via Resend.

**Architecture:** Static `index.html` + `styles.css` + tiny `main.js` served by Vercel; one Vercel Node serverless function `api/contact.js` calls the Resend HTTP API with `fetch` (no npm dependencies). Tests use the built-in `node:test` runner.

**Tech Stack:** HTML, CSS, vanilla JS, Node 20+ (`node:test`), Vercel, Resend REST API, Google Fonts (Pixelify Sans).

**Spec:** `docs/superpowers/specs/2026-10-26-nodas-privatus-ai-design.md`

## Global Constraints

- All visible copy in Lithuanian; `<html lang="lt">`. Short sentences, minimal text.
- Nothing from the old nodas.lt (no Next.js, Supabase, admin, old copy).
- Palette: bg `#f4f1ea`, text `#1c1a17`, secondary `#5a544b` / `#7a746a`, accent `#c2410c`, lines `#ddd6c8`. No gradients, shadows, glows, stock imagery.
- Fonts: Pixelify Sans (Google Fonts, `subset=latin-ext`, weights 400;600) for logo, headings, prices, links/buttons; system sans-serif for body text.
- Hero heading ~64–88px on desktop, must fit at 360px width.
- Section labels: small accent uppercase `0N · PAVADINIMAS`.
- Prices (with VAT, note „Kainos nurodytos su PVM“): AI įdiegimas nuo 149 € / 1 diena; Privatus AI kompiuteris nuo 1 500 € / 3–5 d.; Verslo AI serveris nuo 4 000 € / 1–3 sav. Support nuo 29 €/mėn. privatiems, nuo 99 €/mėn. verslui. Warranty 24 mėn.
- Placeholders `[TELEFONAS]`, `[EL. PAŠTAS]`, `[REKVIZITAI]` appear only in the `#kontaktai` section and the footer.
- No analytics, no cookies, no cookie banner. No npm runtime dependencies.
- Env vars: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.

## Review Focus

1. A 360px-wide phone shows the big pixel headings and long Lithuanian words without horizontal scroll → `clamp()` sizes + `overflow-wrap:anywhere` on headings; checked in Task 2 step 4.
2. Resend down or env vars missing → visitor sees an error with the fallback contact text, never a fake „Ačiū“ → test `fails with 500 when env missing` and `fails with 502 when Resend errors` (Task 1).
3. Visitor double-clicks „Siųsti“ → only one request; button disabled while sending (Task 3).
4. User input with `<script>` or Lithuanian letters arrives in the email escaped and readable → test `escapes html and keeps diacritics` (Task 1).
5. Bots fill the hidden honeypot → 200 response, no email sent → test `honeypot returns ok without sending` (Task 1).

---

### Task 1: Contact API

**Files:**
- Create: `package.json` (`{"name":"nodas","private":true,"type":"module","scripts":{"test":"node --test"}}`), `.gitignore` (`node_modules`, `.vercel`, `.env*`, `.superpowers/`)
- Create: `api/contact.js`
- Test: `tests/contact.test.js`

**Interfaces:**
- Produces: `POST /api/contact` with JSON `{ name, contact, plan, message, website }` (`website` = honeypot). Responses: `200 {ok:true}`; `400 {ok:false,error:"invalid"}`; `405`; `500 {ok:false,error:"config"}`; `502 {ok:false,error:"send"}`.
- Exports: `validate(body) -> {ok:true, data} | {ok:false}`; `escapeHtml(s) -> string`; `default async function handler(req, res)`.
- `plan` must be one of: `"diegimas" | "kompiuteris" | "serveris" | "palaikymas" | "nezinau"`.

- [ ] **Step 0:** `git init -b main` in `C:\nodas`, create `package.json` and `.gitignore`.
- [ ] **Step 1: Write failing tests** in `tests/contact.test.js` using `node:test` + `assert`, with a fake `res` (`status(code)` → chainable, `json(obj)` records) and `globalThis.fetch` stubbed:
  - `validate rejects missing name or contact` → `{ok:false}`
  - `validate rejects message over 2000 chars and name over 100` → `{ok:false}`
  - `validate rejects unknown plan` → `{ok:false}`
  - `validate trims and accepts valid body` → `ok:true`, `data.name === "Jonas"`
  - `escapes html and keeps diacritics`: `escapeHtml('<script>ąčęėįšųūž')` === `'&lt;script&gt;ąčęėįšųūž'`
  - `GET returns 405`
  - `honeypot returns ok without sending`: `website:"x"` → 200, fetch not called
  - `fails with 500 when env missing`
  - `sends to Resend and returns 200`: fetch called once with `https://api.resend.com/emails`, `Authorization: Bearer <key>`, body `to` = `CONTACT_TO`, `from` = `CONTACT_FROM`, `reply_to` set when contact contains `@`, subject `Nauja užklausa: <plan label>`
  - `fails with 502 when Resend errors`: fetch resolves `{ok:false}` → 502
- [ ] **Step 2:** Run `npm test` → FAIL (module not found).
- [ ] **Step 3:** Implement `api/contact.js`. Body may arrive parsed (`req.body` object) or as a string; handle both, bad JSON → 400. Email HTML lists all fields through `escapeHtml`; plan labels in Lithuanian (AI įdiegimas / AI kompiuteris / Verslo AI serveris / Palaikymas / Nežinau).
- [ ] **Step 4:** Run `npm test` → all PASS.
- [ ] **Step 5:** Commit `feat: contact API via Resend`.

### Task 2: Page markup and styles

**Files:**
- Create: `index.html`, `styles.css`, `favicon.svg` (pixel-style „N“ in accent color)
- Test: `tests/page.test.js`

**Interfaces:**
- Produces for Task 3: `<form id="forma">` with fields `name`, `contact`, `plan` (select, values as in Task 1), `message` (textarea), hidden honeypot `website` (in a visually hidden wrapper, `tabindex="-1"`, `autocomplete="off"`), submit button `#forma-siusti`, status element `#forma-zinute` (`aria-live="polite"`).

- [ ] **Step 1: Write failing tests** reading `index.html` as text:
  - `has lang lt, title, description, og tags`
  - `has sections in order`: ids `paslaugos`, `nauda`, `kainos`, `eiga`, `garantijos`, `duk`, `kontaktai`, and each appears after the previous
  - `shows exact prices and VAT note`: contains `nuo 149 €`, `nuo 1 500 €`, `nuo 4 000 €`, `1 diena`, `3–5 d.`, `1–3 sav.`, `nuo 29 €/mėn.`, `nuo 99 €/mėn.`, `24 mėn.`, `Kainos nurodytos su PVM`
  - `loads Pixelify Sans with latin-ext`
  - `placeholders only in contacts and footer`: every `[TELEFONAS]`/`[EL. PAŠTAS]`/`[REKVIZITAI]` index is after the `id="kontaktai"` index
  - `form has required fields and privacy line`: names above present, text `Jūsų duomenis naudosime tik atsakyti į užklausą`
  - `no analytics`: no `gtag`, `googletagmanager`, `analytics`
- [ ] **Step 2:** Run `npm test` → page tests FAIL.
- [ ] **Step 3:** Write `index.html` + `styles.css` following the spec's 8 sections (hero, Kam tai skirta, Ką galėsite nuveikti ir kokia nauda, Paketai, Kaip vyksta, Garantijos ir palaikymas, DUK via `<details>` with the 5 spec questions answered honestly, Kontaktai + footer). Copy short; use the mockup `.superpowers/brainstorm/*/content/8bit-fontas.html` option C as visual reference. CSS tokens on `:root`; headings `font-size: clamp(...)`, `overflow-wrap:anywhere`; max content width ~760px; 16px side gutter on mobile.
- [ ] **Step 4:** Run `npm test` → PASS. Open `index.html` in a browser at 1280px and 360px widths: no horizontal scroll, diacritics render in Pixelify Sans.
- [ ] **Step 5:** Commit `feat: one-page site markup and styles`.

### Task 3: Form behavior

**Files:**
- Create: `main.js` (loaded with `defer`)
- Test: manual check with `vercel dev` (no DOM test framework, per no-deps constraint)

**Interfaces:**
- Consumes: form ids from Task 2, `POST /api/contact` from Task 1.

- [ ] **Step 1:** Implement submit handler: `preventDefault`, disable `#forma-siusti` and set text „Siunčiama…“, POST JSON, on `ok` replace form with „Ačiū! Atsakysime per 1 darbo dieną.“, on any failure show „Nepavyko išsiųsti. Parašykite mums: [EL. PAŠTAS]“ and re-enable the button. Browser `required` attributes do basic validation.
- [ ] **Step 2:** Run `vercel dev` (or `npx vercel dev`) with a `.env.local` lacking the key → submit shows the error text; double-click sends one request (Network tab).
- [ ] **Step 3:** Commit `feat: contact form submit`.

### Task 4: Preview deploy

- [ ] **Step 1:** Ask the owner to run `! npx vercel login` if not logged in. Then `npx vercel` (new project `nodas`) → preview URL.
- [ ] **Step 2:** Verify preview: page loads, fonts load, `npm test` still passes, form shows the error state (env not set yet).
- [ ] **Step 3:** Report the preview URL to the owner.

**Gate:** Moving the nodas.lt domain to this project (`vercel --prod`, domain transfer, removal of the old project) waits for the owner's real phone, email, company details, and form recipient — the spec says placeholders are replaced before launch. Do not do it in this plan.
