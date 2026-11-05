# nodas.lt AI svetainė: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the one-page "privatus AI" site with a full Lithuanian Astro site for nodas.lt: hardware catalog, services, a "kokio kompiuterio reikia AI" calculator, 13 SEO guide pages, full technical SEO, and the existing Resend contact API.

**Architecture:** Astro static output (plain HTML, almost no JS) on Vercel. All products, services, prices and calculator hardware data live in one file `src/data/catalog.ts`; site-wide contact placeholders and the index switch live in `src/data/site.ts`. Pure logic (calculator, JSON-LD builders) lives in `src/lib/*.ts` and is unit-tested with `node --test` (Node 26 runs `.ts` with type stripping, so only erasable TS syntax). Page output is tested by reading `dist/` after `astro build`. The Vercel function `api/contact.js` stays at the repo root.

**Tech Stack:** Astro 7.4.x, @astrojs/sitemap 3.7.x, @fontsource-variable/inter 5.x, Node 26 `node:test`, Vercel, Resend REST API.

**Spec:** `docs/superpowers/specs/2026-11-05-nodas-ai-svetaine-design.md`

## Global Constraints

- All visible copy in Lithuanian; `<html lang="lt">`. Short, clear, professional. No invented testimonials, client logos, cases, stock or delivery promises.
- Nothing from the old nodas.lt or the "privatus AI" look (remove its `index.html`, `styles.css`, `main.js`, `404.html`, `robots.txt`, `sitemap.xml`, `og.png`, `fonts/`, `tests/page.test.js`).
- Look (direction A): bg `#fff`, text `#0a0a0a`, secondary `#555`/`#666`, lines `#eaeaea`, accent `#2563eb`, fits-green `#15803d`; Inter self-hosted (via @fontsource-variable/inter, latin-ext), headings 700 with `letter-spacing:-0.035em`, hero h1 ~64px desktop; primary button black pill, secondary 1px-border pill; cards 1px `#eaeaea`, radius 16px, no heavy shadows. Reference: `.superpowers/preview/kryptys.html` section A.
- No analytics, no cookies, no requests to Google or any third-party origin.
- Site URL `https://nodas.lt`. URLs lowercase ASCII, no trailing slash.
- `SITE.indexable = false` until owner data arrives: every page `<meta name="robots" content="noindex, nofollow">` and robots.txt `Disallow: /`. Flipping to `true` removes both and enables `Allow: /` + Sitemap line.
- Placeholders `[TELEFONAS]`, `[EL. PAŠTAS]`, `[REKVIZITAI]` come only from `src/data/site.ts`.
- Prices "su PVM". Product price `null` → „Kaina pagal užklausą“. Service prices: AI įdiegimas nuo 149 €; Verslo AI serveris nuo 4 000 €; Palaikymas nuo 29 €/mėn. namams, nuo 99 €/mėn. verslui.
- Warranty copy: „Įrangai taikoma tiekėjo garantija; garantinius reikalus sutvarkome už jus.“ Never promise a fixed term beyond „pagal tiekėjo sąlygas (dažniausiai 24 mėn.)“.
- Delivery copy: „Terminas nurodomas pasiūlyme, priklauso nuo tiekėjo sandėlio.“
- Built pages: no inline `<script>` except `type="application/ld+json"`, no `<style>` / `style=""` (CSP in `vercel.json`: `script-src 'self'`, `style-src 'self'`).
- Calculator results always labelled „apytikslis įvertinimas“.

## Review Focus

1. Calculator with a model that fits nowhere sold (e.g. 120B with 20 users) → recommends DGX Station „pagal užklausą“, never an empty result or a device that doesn't fit → test `recommend falls back to DGX Station` (Task 2).
2. Calculator where only Mac Studio meets the target → recommends the nearest sold device and sets `macNote` → test `recommend notes Mac Studio when only Mac meets target` (Task 2).
3. Owner changes a price in `catalog.ts` → every page and the Product JSON-LD show it; `price:null` never emits an `offers` block → test `product jsonld omits offers when price is null` (Task 3) and `prices on pages come from catalog` (Task 4).
4. Opening `/kontaktai?tema=...&plan=...` from the calculator or a product prefills the form; an unknown `plan` falls back to `nezinau` → manual check in Task 5 + API test `validate accepts new plan values and topic` (Task 6).
5. Phone width 360px: no horizontal scroll on home, calculator, catalog → browser check step in Tasks 4 and 5.

---

### Task 1: Astro scaffold, base layout, old site removed

**Files:**
- Delete: `index.html`, `styles.css`, `main.js`, `404.html`, `robots.txt`, `sitemap.xml`, `og.png`, `favicon.svg`, `fonts/`, `tests/page.test.js`
- Modify: `package.json` (deps astro, @astrojs/sitemap, @fontsource-variable/inter; scripts `dev`, `build`, `preview`, `test`: `node --test tests/unit/ && astro build && node --test tests/site/`), `.gitignore` (+`dist`, `.astro`)
- Create: `astro.config.mjs` (`site: 'https://nodas.lt'`, `trailingSlash: 'never'`, `build: { format: 'file', inlineStylesheets: 'never' }`, `vite.build.assetsInlineLimit: 0`, sitemap integration)
- Create: `src/data/site.ts`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `public/favicon.svg`
- Test: `tests/site/base.test.js`, helper `tests/site/dist.js`

**Interfaces:**
- Produces `SITE` from `src/data/site.ts`: `{ name: 'nodas', url: 'https://nodas.lt', indexable: false, email: '[EL. PAŠTAS]', phone: '[TELEFONAS]', rekvizitai: '[REKVIZITAI]', areaServed: 'Lietuva' }`.
- Produces `Base.astro` props: `{ title: string; description: string; path: string; jsonld?: object[]; ogImage?: string }`. Renders `<title>{title} · nodas</title>` (home: title only), description, canonical `SITE.url + path`, OG/Twitter tags, robots noindex when `!SITE.indexable`, every `jsonld` item as `<script type="application/ld+json">`.
- Produces `tests/site/dist.js`: `page(path) -> string` reads `dist/<path>.html` (`/` → `index.html`), `allPages() -> string[]` lists built html paths.
- Header nav: Įranga `/iranga`, Diegimas `/diegimas`, Skaičiuoklė `/skaiciuokle`, Necenzūruoti `/necenzuruoti-modeliai`, DUK `/duk`, Kontaktai `/kontaktai`, button „Gauti pasiūlymą“ → `/kontaktai`. Footer: links, `SITE.email`, `SITE.phone`, `SITE.rekvizitai`, Privatumas `/privatumas`, „© 2026 nodas“.

- [ ] **Step 1:** Remove old files, install deps (`npm i astro@7.4 @astrojs/sitemap@3.7 @fontsource-variable/inter@5`), add config and a placeholder `src/pages/index.astro` using `Base`.
- [ ] **Step 2: Write failing tests** `tests/site/base.test.js`:
  - `home has lang lt, title, description, canonical https://nodas.lt` (canonical exactly `https://nodas.lt/` or `https://nodas.lt` — assert equals `SITE.url + '/'` normalized; pick `https://nodas.lt/` for home)
  - `noindex on every page while SITE.indexable is false` (all `allPages()`)
  - `no third-party origins` (no `http(s)://` in `src=`/`href=` of `<link>`/`<script>` other than `https://nodas.lt`)
  - `Inter font is bundled locally` (a `.woff2` under `dist/_astro/`, CSS references it)
  - `no inline script or style` (allow only `<script type="application/ld+json">`)
- [ ] **Step 3:** Run `npm test` → FAIL; implement layout, header, footer, global.css with tokens from Global Constraints; run → PASS.
- [ ] **Step 4:** Commit `feat: astro scaffold and base layout`.

### Task 2: Catalog data and calculator logic

**Files:**
- Create: `src/data/catalog.ts`, `src/lib/calc.ts`
- Test: `tests/unit/calc.test.ts`

**Interfaces:**
- `catalog.ts` exports:
  - `type Device = { id: string; name: string; memoryGB: number; usableGB: number; bandwidthGBs: number; sold: boolean; onRequest?: boolean; tier: number; spec: { gpu: string; cpu: string; ram: string; disk: string; psu?: string }; productSlug?: string }`
  - `devices: Device[]` with these values (bandwidth from official specs; 2× 5090 is effective):
    | id | name | memoryGB | usableGB | bandwidthGBs | sold | tier |
    |---|---|---|---|---|---|---|
    | `rtx5090` | AI kompiuteris su RTX 5090 | 32 | 30 | 1792 | true | 1 |
    | `dgx-spark` | NVIDIA DGX Spark (GB10) | 128 | 115 | 273 | true | 2 |
    | `rtx5090x2` | AI kompiuteris su 2× RTX 5090 | 64 | 60 | 2870 | true | 3 |
    | `rtxpro6000` | AI darbo stotis su RTX PRO 6000 | 96 | 92 | 1792 | true | 4 |
    | `dgx-station` | NVIDIA DGX Station (GB300) | 288 | 270 | 8000 | true, onRequest | 5 |
    | `mac-m4max` | Mac Studio M4 Max 128 GB | 128 | 96 | 546 | false | — |
    | `mac-m3ultra` | Mac Studio M3 Ultra 512 GB | 512 | 384 | 819 | false | — |
  - `type ModelPreset = { id: string; label: string; paramsB: number; activeB: number; example: string; hint: string }`; `models`: `8b` (8/8, „Llama 3.1 8B“, „paprasti tekstai, santraukos“), `32b` (32/32, „Qwen3 32B“, „rimtas darbas su dokumentais“), `70b` (70/70, „Llama 3.3 70B“, „arti ChatGPT lygio“), `120b` (120/5.1, „gpt-oss-120b (MoE)“, „didžiausi atviri modeliai“).
  - `type Product = { slug: string; name: string; deviceId: string; short: string; specs: [string, string][]; priceEur: number | null; variants?: string[] }`; `products`: `dgx-spark` (variants PNY DGX Spark, ASUS Ascent GX10, Lenovo ThinkStation PGX), `ai-kompiuteris-rtx-5090`, `ai-kompiuteris-2x-rtx-5090`, `ai-darbo-stotis-rtx-pro-6000`, `dgx-station`; all `priceEur: null`.
  - `PACKAGE_INCLUDES = ['Įranga', 'Įdiegtas ir sukonfigūruotas AI', 'Pradinis apmokymas', 'Pagalba su tiekėjo garantija']`
  - `type Service = { slug: string; name: string; priceFrom: number; unit?: '€/mėn.'; audience: string; short: string }`; `services`: `idiegimas` 149, `verslo-serveris` 4000, `palaikymas-namams` 29 €/mėn., `palaikymas-verslui` 99 €/mėn.
- `calc.ts` exports (constants `BYTES_PER_PARAM = 0.5625`, `OVERHEAD = 1.2`, `EFFICIENCY = 0.55`, `KV_PER_USER_PER_B = 0.02`, `WORDS_PER_TOKEN = 0.6`):
  - `memoryNeededGB(model: ModelPreset, users: number): number` = `paramsB*BYTES_PER_PARAM*OVERHEAD + (users-1)*paramsB*KV_PER_USER_PER_B`, rounded to 1 decimal
  - `tokensPerSecond(device: Device, model: ModelPreset, users: number): number` = `EFFICIENCY*bandwidthGBs/(activeB*BYTES_PER_PARAM) / (1 + 0.15*(users-1))`, rounded to integer
  - `evaluate(model, targetTps: number, users: number): Row[]` with `Row = { device: Device; fits: boolean; tps: number; meets: boolean }` for every device (tps 0 when not fits), sorted sold first by tier then Macs
  - `recommend(rows: Row[]): { device: Device; macNote: boolean; onRequest: boolean }` → cheapest-tier sold row with `meets`; else if any Mac row `meets` → highest-tps sold row that fits, `macNote: true`; else if any sold row fits → highest-tps fitting sold row; else DGX Station, `onRequest: true`
  - `readingLabel(tps: number): string` → words/s = tps*0.6: `< 3` „lėčiau nei skaitote“, `<= 6` „maždaug kaip skaitote“, else „greičiau nei skaitote“

- [ ] **Step 1: Write failing tests** `tests/unit/calc.test.ts`:
  - `memory for 70b single user is ~47 GB` → `Math.abs(memoryNeededGB(70b,1) - 47.25) <= 0.1`
  - `rtx5090 8b ~ 219 tok/s` → `tokensPerSecond(rtx5090, 8b, 1) === 219`
  - `dgx spark 70b ~ 4 tok/s` → `=== 4`
  - `users slow per-user speed` → 20 users < 1 user / 3
  - `70b does not fit rtx5090` → evaluate row `fits === false`, `tps === 0`
  - `recommend picks cheapest sold device meeting target` → 8b, 30 tok/s, 1 user → `rtx5090`
  - `recommend falls back to DGX Station` → 120b-sized dense custom preset `{paramsB:400, activeB:400}`, 20 users → `dgx-station`, `onRequest: true`
  - `recommend notes Mac Studio when only Mac meets target` → model `{paramsB:150, activeB:12}`, target 40, 1 user (needs ~101 GB: fits dgx-spark ~22 tok/s, mac-m3ultra ~67 tok/s) → device `dgx-spark`, `macNote === true`. Rule: `onRequest` devices are never picked in the first three branches, only in the final fallback.
  - `readingLabel thresholds` → 4 → „lėčiau…“, 8 → „maždaug…“, 40 → „greičiau…“
  - `every product points at an existing device` and `prices are null or positive`
- [ ] **Step 2:** `node --test tests/unit/` → FAIL; implement; → PASS.
- [ ] **Step 3:** Commit `feat: catalog data and calculator logic`.

### Task 3: JSON-LD builders, robots and sitemap

**Files:**
- Create: `src/lib/seo.ts`, `src/pages/robots.txt.ts`
- Modify: `astro.config.mjs` (sitemap `filter` excludes `/404`)
- Test: `tests/unit/seo.test.ts`, `tests/site/robots.test.js`

**Interfaces:**
- `seo.ts`: `organization(site): object` (Organization, name, url, email, telephone, areaServed Country Lietuva, logo `/favicon.svg`); `product(p: Product, site): object` (Product, name, description, url, brand; `offers` {price, priceCurrency 'EUR', availability InStock… no: `PreOrder`? use `https://schema.org/InStock` only if price; omit offers entirely when `priceEur === null`); `service(s: Service, site): object` (Service, provider org, areaServed, `offers.price` = priceFrom, `priceSpecification.unitText` for monthly); `faqPage(items: {q: string; a: string}[]): object`; `breadcrumbs(items: {name: string; path: string}[], site): object`; `article(a: {title: string; description: string; path: string; date: string}, site): object`.
- `robots.txt.ts` GET: indexable → `User-agent: *\nAllow: /\nSitemap: https://nodas.lt/sitemap-index.xml`; else `User-agent: *\nDisallow: /`.

- [ ] **Step 1: Failing tests**: `product jsonld omits offers when price is null`, `product jsonld has EUR offer when priced`, `service jsonld monthly unit`, `faqPage maps q/a to Question/acceptedAnswer`, `breadcrumbs positions start at 1 with absolute urls`, `robots disallows all while not indexable` (reads `dist/robots.txt`), `sitemap lists home and excludes 404`.
- [ ] **Step 2:** Run → FAIL; implement; `npm test` → PASS.
- [ ] **Step 3:** Commit `feat: structured data builders, robots, sitemap`.

### Task 4: Core pages

**Files:**
- Create: `src/pages/index.astro`, `src/pages/iranga/index.astro`, `src/pages/iranga/[slug].astro`, `src/pages/diegimas.astro`, `src/pages/necenzuruoti-modeliai.astro`, `src/pages/duk.astro`, `src/pages/privatumas.astro`, `src/pages/404.astro`, `src/data/faq.ts`, `src/components/ProductCard.astro`, `src/components/Price.astro`, `src/components/Faq.astro`, `src/components/CtaBand.astro`
- Test: `tests/site/pages.test.js`

**Interfaces:**
- Consumes `SITE`, `products`, `services`, `PACKAGE_INCLUDES`, `seo.*`.
- `faq.ts` exports `faq: {q: string; a: string}[]` (≥ 8 items: duomenys niekur neišeina, lietuvių kalba, kuo skiriasi nuo ChatGPT, kokio kompiuterio reikia, garantija, pristatymas, necenzūruoti modeliai, palaikymas, kaip vyksta darbas).
- `Price.astro` props `{ eur: number | null; monthly?: boolean }` → „nuo 1 500 €“ / „nuo 29 €/mėn.“ / „Kaina pagal užklausą“; thousands with narrow space-free regular space (`1 500`).
- Every product CTA links `/kontaktai?plan=<deviceId or dgx>&tema=<encoded product name>`.

- [ ] **Step 1: Failing tests**:
  - `every page has unique title and description` (all pages)
  - `canonical equals https://nodas.lt + path`
  - `product pages exist for every catalog product with Product + BreadcrumbList jsonld`
  - `prices on pages come from catalog` (products show „Kaina pagal užklausą“ while null; `/diegimas` shows `nuo 149 €`, `nuo 4 000 €`, `nuo 29 €/mėn.`, `nuo 99 €/mėn.` and „su PVM“)
  - `warranty and delivery copy present` (`/iranga` contains both exact sentences from Global Constraints)
  - `duk has FAQPage jsonld with all faq items`
  - `home links to iranga, diegimas, skaiciuokle, necenzuruoti-modeliai, kontaktai`
  - `placeholders appear only in footer, kontaktai and privatumas` (strip footer, then only those two pages may contain them)
  - `404 page exists and is not in sitemap`
- [ ] **Step 2:** Run → FAIL; build pages (home per spec section „Pagrindinis“, hero copy „Jūsų AI. Jūsų serveryje.“; necenzūruoti page with responsibility note; privatumas adapted from the old site's policy text in git history `c5d658f:index.html`, retention 12 mėn., processors Resend + Vercel, no cookies, VDAI) → PASS.
- [ ] **Step 3:** Browser check at 1366×768 and 360px: no horizontal scroll, matches direction A.
- [ ] **Step 4:** Commit `feat: core pages`.

### Task 5: Calculator UI

**Files:**
- Create: `src/components/Calculator.astro` (full + `compact` prop), `src/scripts/calculator.ts`, `src/pages/skaiciuokle.astro`
- Modify: `src/pages/index.astro` (compact calculator in hero)
- Test: `tests/site/calculator.test.js`

**Interfaces:**
- Consumes `devices`, `models`, `evaluate`, `recommend`, `readingLabel`, `memoryNeededGB`.
- Server-renders initial state (model `32b`, target 20 tok/s, users 1) so the page is useful without JS; `calculator.ts` updates on input. Data passed via `data-*` JSON attribute on the root element (no inline script).
- Controls: model radio group (`name="model"`), range `#tps` (5–100, step 5), users segmented (`1`, `5`, `20`). Output: memory needed, `readingLabel`, table rows (name, „telpa“/„netelpa“, ~tok/s, ✓ when meets), recommended config card with `spec` fields, CTA `/kontaktai?plan=<rec.id>&tema=<encoded "Skaičiuoklė: <model label>, <tps> tok/s, <users> vart.">`, Mac note text „Mac Studio irgi tiktų, bet jo neparduodame.“, label „apytikslis įvertinimas“.
- `/skaiciuokle` adds an explainer (kas yra tokenai, kodėl svarbi atmintis) + FAQPage jsonld (3 items).

- [ ] **Step 1: Failing tests**: `calculator page server-renders a recommendation and all devices`, `compact calculator on home`, `cta prefill link present`, `apytikslis įvertinimas label present`.
- [ ] **Step 2:** Run → FAIL; implement → PASS.
- [ ] **Step 3:** Browser check: move slider, switch model/users, result and CTA update; 360px no horizontal scroll; 120b + 20 users shows DGX Station „pagal užklausą“.
- [ ] **Step 4:** Commit `feat: hardware calculator`.

### Task 6: Contact page and API update

**Files:**
- Create: `src/pages/kontaktai.astro`, `src/components/ContactForm.astro`, `src/scripts/contact.ts`
- Modify: `api/contact.js`, `tests/contact.test.js` → move to `tests/unit/contact.test.js`

**Interfaces:**
- `PLANS` in `api/contact.js` becomes: `idiegimas` „AI įdiegimas“, `dgx-spark` „DGX Spark“, `rtx5090` „AI kompiuteris RTX 5090“, `rtx5090x2` „AI kompiuteris 2× RTX 5090“, `rtxpro6000` „AI darbo stotis RTX PRO 6000“, `dgx-station` „DGX Station“, `verslo-serveris` „Verslo AI serveris“, `palaikymas` „Palaikymas“, `necenzuruotas` „Necenzūruotas modelis“, `nezinau` „Nežinau“.
- Body gains optional `topic` (string ≤ 300, shown in email as „Tema“, escaped). Everything else (honeypot, rate limit, timeout, reply_to rule, env vars `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`) unchanged.
- Form fields: `name`, `contact`, `plan` (select with the values above), `topic` (hidden, from `?tema=`), `message`, honeypot `website`; `contact.ts` reads `?plan=` (falls back to `nezinau` if unknown) and `?tema=`, submits JSON, same states as before (Siunčiama…, success replaces form with `role="status"` focus, error shows `SITE.email` and `SITE.phone`).

- [ ] **Step 1: Failing tests**: `validate accepts new plan values and topic`, `old plan value kompiuteris is rejected`, `topic over 300 chars rejected`, `topic appears escaped in email html`; site test `kontaktai has form with all plan options and privacy link`.
- [ ] **Step 2:** Run → FAIL; implement → PASS (all existing API tests stay green).
- [ ] **Step 3:** Browser check: `/kontaktai?plan=dgx-spark&tema=Test` preselects and carries topic; `?plan=bogus` → Nežinau; submit against the static preview shows the error state.
- [ ] **Step 4:** Commit `feat: contact page with topic prefill`.

### Task 7: SEO guide pages

**Files:**
- Create: `src/content.config.ts` (collection `gidai`, schema: `title`, `description`, `date`, `related: string[]` of paths), `src/content/gidai/*.md` (13), `src/pages/[slug].astro`, `src/layouts/Guide.astro`
- Test: `tests/site/guides.test.js`

**Interfaces:**
- Slugs (spec list order): `dgx-spark-lietuvoje`, `dgx-station`, `kokio-kompiuterio-reikia-ai`, `dgx-spark-vs-rtx-5090-vs-mac-studio`, `privatus-ai-imonei`, `chatgpt-alternatyva-be-debesies`, `ai-buhalterijai`, `ai-teisininkams`, `ai-klinikoms`, `ai-gamybai`, `necenzuruoti-ai-modeliai`, `lietuviskas-ai-lokaliai`, `di-aktas-imonei`.
- Guide layout: Base + Article + BreadcrumbList jsonld, H1 = title, body, „Susiję“ links (`related`), CtaBand linking `/skaiciuokle` and `/kontaktai`.
- Home and footer link a „Gidai“ list; `/iranga` links the hardware guides.

- [ ] **Step 1: Failing tests**: `all 13 guides built`, `each guide ≥ 600 words`, `each guide has Article jsonld and one h1`, `each guide links to /skaiciuokle or /iranga or /kontaktai`, `guides are in sitemap` (sitemap content regardless of indexable), `no guide links to a non-existent internal path` (every internal href across dist resolves to a built page or asset).
- [ ] **Step 2:** Run → FAIL; write the 13 guides (facts only from spec research or official specs; prices of DGX Spark in LT as „rinkoje ~6 000–6 700 € su PVM (2026 m. lapkritis)“; no invented stats) → PASS.
- [ ] **Step 3:** Commit `feat: 13 SEO guide pages`.

### Task 8: Security headers, OG image, final verification

**Files:**
- Modify: `vercel.json` (keep headers; CSP adds nothing new since fonts are same-origin; add `"outputDirectory": "dist"`, `"buildCommand": "astro build"`)
- Create: `public/og.png` (1200×630, rendered by headless Chrome from `.superpowers/preview/og-nodas.html` in direction A)
- Test: `tests/site/headers.test.js`

- [ ] **Step 1: Failing tests**: `vercel.json CSP has no unsafe-inline`, `og.png is 1200x630 PNG`, `every page references og.png`.
- [ ] **Step 2:** Implement → `npm test` PASS.
- [ ] **Step 3:** `astro preview` browser pass over every page at 1366×768 and 360px; console has no errors.
- [ ] **Step 4:** Commit `feat: og image and deploy config`.
