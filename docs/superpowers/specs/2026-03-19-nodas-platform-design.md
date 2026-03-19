# nodas.lt — Platformos Dizaino Specifikacija

**Data:** 2026-03-19
**Projektas:** nodas.lt — Lietuviška IT paslaugų SaaS platforma
**Autorius:** Donaldas (solo dev)
**Būsena:** Patvirtinta

---

## 1. Projekto apžvalga

**nodas.lt** yra lietuviška IT paslaugų platforma, kurioje klientai gali:
- Užsisakyti AI sugeneruotas svetaines (Claude API generuoja pilną HTML)
- Valdyti savo svetaines per dashboard
- Pirkti skaitmeninius ir fizinius produktus parduotuvėje
- Prenumeruoti Web SPA priežiūros planus
- Mokėti per Paysera (lietuviškas mokėjimų procesorius)

**Kalba:** Lietuviška UI visame projekte.

---

## 2. Technologijų stack

| Sluoksnis | Technologija |
|---|---|
| Framework | Next.js 14 (App Router) |
| Kalba | TypeScript (strict mode, no `any`) |
| Stiliai | Tailwind CSS v3 + inline styles (jokių CSS failų) |
| Duomenų bazė | Supabase (PostgreSQL + Row Level Security) |
| Autentifikacija | Supabase Auth + Google OAuth |
| AI | Anthropic API — `claude-haiku-4-5-20251001` |
| El. paštas | Resend (transactional) |
| Mokėjimai | Paysera (lietuviškas mokėjimų procesorius) |
| Deploy | Vercel (auto-deploy on push to `main`) |

---

## 3. Dizaino sistema

### Spalvų paletė
| Spalva | Hex | Naudojimas |
|---|---|---|
| Pagrindinis mėlynas | `#2563eb` | CTA mygtukai, akcentai, nuorodos |
| Tamsus mėlynas | `#1e40af` | Logo, antraštės, hover |
| Šviesi mėlyna | `#93c5fd` | Antriniai akcentai, `.lt` sufixas |
| Fono mėlyna | `#eff6ff` | Kortelių fonai, badge'ai |
| Rėmeliai | `#e2e8f0` | Borduros, separatoriai |
| Tekstas | `#0f172a` | Pagrindiniai tekstai |
| Antrinis tekstas | `#64748b` | Aprašymai, metaduomenys |

### Logotipas
SVG ikonėlė — trys sujungti taškai (tinklo mazgai / nodes), atspindintys pavadinimą "nodas". Mėlyna spalva (#2563eb). Tekstas: **nodas** (tamsiai mėlynas, 800 weight) + **.lt** (šviesi mėlyna, 500 weight).

### Tipografija
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Antraštės: 700–900 weight, letter-spacing: -0.5px–-1.5px
- Teksto dydžiai: 13px (meta), 14px (UI), 15–17px (body), 18–52px (antraštės)

### Komponentai
- **Kortelės:** `border-radius: 12px`, `border: 1px solid #e2e8f0`, baltas fonas
- **Mygtukai:** `border-radius: 8–10px`, `font-weight: 600–700`
- **Badge'ai:** `border-radius: 999px` (piliulės forma)
- **Šešėliai:** subtilūs `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` — naudoti saikingai

---

## 4. Puslapių struktūra

### Viešoji zona (be autentifikacijos)
| Puslapis | Kelias | Aprašymas |
|---|---|---|
| Landing page | `/` | Pagrindinis rinkodaros puslapis |
| Blog sąrašas | `/blog` | Visi blog įrašai |
| Blog įrašas | `/blog/[slug]` | Individualus įrašas |
| Parduotuvė | `/parduotuve` | Produktų katalogas |
| Produkto puslapis | `/parduotuve/[slug]` | Produkto detalės |
| Krepšelis | `/parduotuve/krepselis` | Pirkinių krepšelis |
| Checkout | `/parduotuve/checkout` | Mokėjimo srautas |
| Mokėjimas — sėkmė | `/payment/success` | Sėkmingo mokėjimo puslapis |
| Mokėjimas — atšaukta | `/payment/cancel` | Atšaukto mokėjimo puslapis |

### Autentifikacijos zona
| Puslapis | Kelias | Aprašymas |
|---|---|---|
| Prisijungimas | `/auth/login` | Google OAuth mygtukas — vienintelis auth metodas (registracija ir login — tas pats srautas: pirmas prisijungimas = auto-registracija) |
| OAuth callback | `/auth/callback` | Google OAuth callback handler; po sėkmingo prisijungimo → `/dashboard` |

### Dashboard (apsaugota, reikia prisijungimo)
| Puslapis | Kelias | Aprašymas |
|---|---|---|
| Pagrindinis | `/dashboard` | Statistikos, greiti veiksmai, paskutinės svetainės/užsakymai |
| Svetainės | `/dashboard/sites` | AI svetainių generatoriaus UI |
| Svetainių kūrėjas | `/dashboard/sites/builder` | Po AI generavimo: peržiūra + redagavimas. Rodo sugeneruotą HTML iFrame, leidžia iš naujo generuoti arba išsaugoti. Ne pilnas vizualinis kūrėjas — tik peržiūra + regeneration srautas. |
| Užsakymai | `/dashboard/orders` | Užsakymų sąrašas |
| Naujas užsakymas | `/dashboard/orders/new` | Daugiažingsnio formos vedlys |
| Profilis | `/dashboard/profile` | Vartotojo profilis |
| Web Remontas | `/dashboard/repair` | Remonto užklausos forma |
| Web SPA | `/dashboard/spa` | SPA prenumeratos puslapis |
| AI Sprendimai | `/dashboard/ai` | AI paslaugų puslapis |
| SEO | `/dashboard/seo` | SEO paslaugų puslapis |

### Admin zona (tik administratoriams)
| Puslapis | Kelias | Aprašymas |
|---|---|---|
| Admin pagrindinis | `/admin` | Statistikos suvestinė |
| Vartotojai | `/admin/users` | Vartotojų valdymas |
| Užsakymai | `/admin/orders` | Visų užsakymų valdymas |
| Svetainės | `/admin/sites` | Visų sugeneruotų svetainių peržiūra |
| Blog | `/admin/blog` | Blog įrašų valdymas |
| Produktai | `/admin/produktai` | Produktų valdymas |

### AI svetainių zona
| Puslapis | Kelias | Aprašymas |
|---|---|---|
| Kliento svetainė | `/s/[subdomain]` | Renderina AI sugeneruotą svetainę |

---

## 5. Landing page dizainas

### Struktūra (iš viršaus į apačią)
1. **Navigacija** — sticky, baltas fonas, logo + nuorodos + "Prisijungti" CTA
2. **Hero** — dviejų kolonų išdėstymas:
   - Kairė: badge + H1 + aprašymas + 5 USP punktai su varnelėmis + CTA mygtukai + statistikos eilutė
   - Dešinė: greito užsakymo kortelė su 4 populiariausiomis paslaugomis ir kainomis
3. **Pasitikėjimo juosta** — tamsiai mėlyna (`#1e3a8a`), ikonėlės: SSL, greitas atsakas, 🇱🇹, Paysera, AI
4. **Apie mane** — dviejų kolonų: kairė SVG iliustracija, dešinė tekstas + highlight sąrašas
5. **Paslaugos** — 3×3 tinklelis, 9 paslaugų kortelės su numeriu, ikonėle, aprašymu, kaina
6. **Atsiliepimai** — 2 kortelės šalia šalia
7. **Kontaktai** — tamsiai mėlynas fonas, centruota forma
8. **Footer** — tamsus (`#0f172a`), copyright + privatumo politika + el. paštas

### Paslaugų kainos (landing page)
| # | Paslauga | Kaina |
|---|---|---|
| 01 | Web Remontas | nuo €39 |
| 02 | AI Svetainė | €149 vienkartinis |
| 03 | WordPress / CMS | €349 vienkartinis |
| 04 | Custom Dev | Individualus |
| 05 | Web SPA priežiūra | €29–€129/mėn |
| 06 | AI Sprendimai | Individualus |
| 07 | SEO | Individualus |
| 08 | Serverių diegimas | Individualus |
| 09 | El. parduotuvė | Individualus |

---

## 6. Dashboard dizainas

### Išdėstymas
- **Šoninis meniu** (220px): logo + navigacijos sekcijos + vartotojo info apačioje
- **Viršutinė juosta** (56px): puslapio pavadinimas + pranešimai + CTA mygtukas
- **Turinys**: scrollable, padding 24px

### Dashboard pagrindinis puslapis
1. **Plano banner** — gradientas (#1e40af → #2563eb), dabartinis tier + "Atnaujinti" mygtukas
2. **Statistikos kortelės** (4 kolonos): svetainės, užsakymai, SPA planas, žinutės
3. **Dviejų kolonų tinklelis**:
   - Kairė: svetainių sąrašas + užsakymų istorija
   - Dešinė: greiti veiksmai (5 paslaugos su rodyklėmis)

### Navigacijos sekcijos
- **Pagrindinis**: Dashboard, Mano svetainės (badge), Užsakymai (badge)
- **Paslaugos**: AI Svetainė, Web Remontas, Web SPA, AI Sprendimai, SEO
- **Kita**: Profilis

---

## 7. Duomenų bazės schema

| Lentelė | Pagrindiniai stulpeliai | Pastabos |
|---|---|---|
| `profiles` | `id`, `full_name`, `tier`, `phone`, `is_admin` (bool) | Sukuriama pirmo prisijungimo metu (trigger). `is_admin` naudojamas admin zonos apsaugai. |
| `generated_sites` | `id`, `user_id`, `name`, `prompt`, `html_content`, `subdomain`, `published`, `created_at` | subdomain auto-nustatomas |
| `orders` | `id`, `user_id`, `service_type`, `status`, `price`, `notes`, `created_at` | status: pending/in_progress/completed/cancelled |
| `spa_subscriptions` | `user_id`, `plan`, `status`, `plan_price`, `started_at`, `renewal_date`, `cancelled_at` | plan: basic(€29)/pro(€59)/enterprise(€129) |
| `blog_posts` | `id`, `title`, `slug`, `content`, `published`, `created_at` | |
| `products` | `id`, `name`, `slug`, `price`, `type`, `stock`, `created_at` | type: digital/physical |
| `orders_shop` | `id`, `user_id`, `items` (JSONB array of `{product_id, quantity, price}`), `total`, `status`, `created_at` | FK: items[].product_id → products.id (soft reference, denormalizuota kainai) |
| `cart_items` | `user_id`, `product_id`, `quantity` | FK: product_id → products.id |
| `contact_submissions` | `id`, `name`, `email`, `service`, `message`, `created_at` | Kontaktų formos įrašai |

Visos lentelės su **Row Level Security (RLS)**.

---

## 8. AI svetainių generavimo srautas

1. Vartotojas įveda aprašymą `/dashboard/sites`
2. `POST /api/generate-site` — paraleliai kviečia Claude API:
   - Pilna HTML svetainė (8000 max tokens)
   - Trumpas verslo pavadinimas (30 max tokens)
3. Modelis: `claude-haiku-4-5-20251001`
4. `PUT /api/generate-site` — išsaugo Supabase:
   - Patikrina vartotojo tier: `simple` = max 1 svetainė
   - Įrašo į `generated_sites`
   - Siunčia "svetainė paruošta" el. laišką per Resend
5. Svetainė pasiekiama `/s/[subdomain]`

---

## 9. Mokėjimų sistema

- **Paysera** — lietuviškas mokėjimų procesorius
- `createPayseraPayment()` — generuoja mokėjimo URL su MD5 parašu
- `verifyPayseraCallback()` — validuoja Paysera callback parašą
- **Test mode**: automatiškai kai `NODE_ENV !== 'production'`

---

## 10. El. pašto sistema

Transportas: **Resend**. Visų laiškų šablonas su nodas.lt branding.

| Funkcija | Kada siunčiama |
|---|---|
| `sendWelcomeEmail` | Naujo vartotojo registracija |
| `sendOrderConfirmEmail` | Klientas pateikia užsakymą |
| `sendOrderStatusEmail` | Admin keičia užsakymo statusą |
| `sendAdminNewOrder` | Pranešimas info@nodas.lt apie naują užsakymą |
| `sendAdminNewUser` | Pranešimas info@nodas.lt apie naują vartotoją |
| `sendSiteGeneratedEmail` | Po sėkmingo AI svetainės išsaugojimo |
| `sendShopOrderConfirmEmail` | Parduotuvės pirkimas patvirtintas |
| `sendAdminShopOrder` | Pranešimas info@nodas.lt apie parduotuvės užsakymą |
| `sendContactEmail` | Kontaktų formos užklausa — siunčia į info@nodas.lt, išsaugo `contact_submissions` |

---

## 11. Vartotojų tieriai

| Tier | Svetainių limitas | Pastabos |
|---|---|---|
| `simple` | 1 AI svetainė | Numatytasis naujiems vartotojams |
| `cms` | Neribotas | WordPress/CMS paketo pirkėjai |
| `custom` | Neribotas | Custom dev paketo pirkėjai |

**Tier paaukštinimo srautas:**
- Nauji vartotojai visada pradeda nuo `simple`
- Tier keitimas yra **rankinis**: adminas keičia `profiles.tier` per `/admin/users`
- Ateityje galima automatizuoti: Paysera payment callback → `PUT /api/profile` → tier update
- `/dashboard/spa` prenumerata **nekeičia** tier — tai atskira `spa_subscriptions` eilutė

---

## 12. Middleware logika

1. **Subdomenų routing**: `anything.nodas.lt` → perrašo į `/s/anything`
2. **Auth apsauga**: `/dashboard/*` reikalauja prisijungimo; `/` ir `/auth/*` nukreipia į dashboard jei jau prisijungta
3. **Admin apsauga**: `/admin/*` — middleware patikrina `profiles.is_admin = true`; jei ne — 403 arba nukreipiamas į `/dashboard`

---

## 13. Kodavimo konvencijos

- TypeScript strict — jokių `any` tipų
- Server components pagal nutylėjimą, `'use client'` tik kai tikrai reikia
- API raktai tik server-side kode (`app/api/`) — niekada kliento komponentuose
- Stiliai: Tailwind + inline styles — jokių CSS failų
- Supabase RLS ant visų lentelių
- Commit prefiksai: `fix:`, `feat:`, `style:`, `refactor:`
- Build patikrinimas prieš push: `npm run build` turi praeiti

---

## 14. Deploy

- **Platforma**: Vercel (auto-deploy on push to `main`)
- **Branch**: `main` — visada deployable
- **Niekada nekommituoti**: `.env.local`, `node_modules/`, `.next/`, `nodas.md`
