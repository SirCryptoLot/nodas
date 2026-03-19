# nodas.lt Platformos Implementacijos Planas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sukurti pilną nodas.lt IT paslaugų SaaS platformą — landing page, autentifikacija, dashboard, AI svetainių generatorius, užsakymų sistema, parduotuvė, blog, admin panel, Paysera mokėjimai.

**Architecture:** Next.js 14 App Router su TypeScript strict mode. Kiekvienas puslapis yra Server Component pagal nutylėjimą; `'use client'` tik ten, kur reikia event handlers ar hooks. Supabase RLS saugo duomenis. Visi API raktai tik server-side.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v3, Supabase (PostgreSQL + Auth), Anthropic API (claude-haiku-4-5-20251001), Paysera, Resend, Vercel

---

## Failų struktūra

```
app/
  layout.tsx                          ← root layout, šriftai, global metadata
  page.tsx                            ← landing page
  robots.ts / sitemap.ts              ← SEO
  auth/
    login/page.tsx                    ← Google OAuth prisijungimas
    callback/route.ts                 ← OAuth callback
  dashboard/
    layout.tsx                        ← sidebar + topbar shell
    page.tsx                          ← dashboard home
    sites/
      page.tsx                        ← AI generatorius
      builder/page.tsx                ← peržiūra + regeneration
    orders/
      page.tsx                        ← užsakymų sąrašas
      new/page.tsx                    ← naujas užsakymas (wizard)
    repair/page.tsx                   ← remonto užklausa
    spa/page.tsx                      ← SPA prenumerata
    ai/page.tsx                       ← AI sprendimai
    seo/page.tsx                      ← SEO paslaugos
    profile/
      page.tsx
      ProfileForm.tsx                 ← 'use client'
  admin/
    layout.tsx                        ← admin shell
    page.tsx                          ← statistikos
    users/page.tsx
    orders/page.tsx
    sites/page.tsx
    blog/page.tsx
    produktai/page.tsx
  api/
    generate-site/route.ts            ← POST generuoti, PUT išsaugoti
    orders/route.ts                   ← CRUD
    admin/
      orders/route.ts
      blog/route.ts
      products/route.ts
      users/route.ts
    profile/route.ts
    payment/
      route.ts                        ← Paysera init
      callback/route.ts               ← Paysera callback
    shop/
      checkout/route.ts
      callback/route.ts
    products/route.ts                 ← viešas produktų sąrašas
    check-site/route.ts
    domain-check/route.ts
    subdomain/route.ts
    contact/route.ts                  ← kontaktų forma
    test-email/route.ts
  s/[subdomain]/page.tsx             ← AI svetainės rendering
  blog/
    page.tsx
    [slug]/page.tsx
  parduotuve/
    page.tsx
    [slug]/page.tsx
    krepselis/page.tsx
    checkout/page.tsx
  payment/
    success/page.tsx
    cancel/page.tsx
components/
  layout/
    Navbar.tsx                        ← viešas navbar
    Footer.tsx
    DashboardSidebar.tsx              ← 'use client'
    DashboardTopbar.tsx
  ui/
    Logo.tsx                          ← SVG logotipas
    ServiceCard.tsx
    StatCard.tsx
lib/
  supabase/
    client.ts                         ← browser client
    server.ts                         ← server client (SSR)
  email.ts                            ← visos email funkcijos
  paysera.ts                          ← Paysera utils
  admin.ts                            ← admin utils
  types.ts                            ← visi TypeScript tipai
middleware.ts                         ← subdomain routing + auth guard
```

---

## Fazė 1: Projekto sukūrimas ir konfigūracija

### Task 1: Next.js projekto inicializavimas

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`
- Create: `.env.local`, `.gitignore`

- [ ] **Step 1: Sukurti Next.js projektą**

```bash
cd C:/nodas
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

- [ ] **Step 2: Patikrinti kad projektas starts**

```bash
npm run dev
```
Laukiama: `http://localhost:3000` veikia

- [ ] **Step 3: Instaliuoti papildomas priklausomybes**

```bash
npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk resend
```

- [ ] **Step 4: Sukurti .env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://hcwxeqilojtmyrjpiuiu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<iš nodas.md>
SUPABASE_SERVICE_ROLE_KEY=<iš nodas.md>
ANTHROPIC_API_KEY=<iš nodas.md>
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=<iš nodas.md>
RESEND_FROM=nodas.lt <info@nodas.lt>
PAYSERA_PROJECT_ID=your_paysera_project_id
PAYSERA_SIGN_PASSWORD=your_paysera_sign_password
SMTP_HOST=fazanas.serveriai.lt
SMTP_PORT=587
SMTP_USER=info@nodas.lt
SMTP_PASS=<iš nodas.md>
SMTP_FROM=nodas.lt <info@nodas.lt>
```

- [ ] **Step 5: Atnaujinti .gitignore — pridėti nodas.md ir .env.local**

```
.env.local
nodas.md
.next/
node_modules/
```

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

### Task 2: TypeScript tipai ir Supabase klientai

**Files:**
- Create: `lib/types.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Sukurti `lib/types.ts`**

```typescript
export type UserTier = 'simple' | 'cms' | 'custom'
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type SpaPlan = 'basic' | 'pro' | 'enterprise'
export type ProductType = 'digital' | 'physical'

export interface Profile {
  id: string
  full_name: string | null
  tier: UserTier
  phone: string | null
  is_admin: boolean
  created_at: string
}

export interface GeneratedSite {
  id: string
  user_id: string
  name: string
  prompt: string
  html_content: string
  subdomain: string
  published: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  service_type: string
  status: OrderStatus
  price: number | null
  notes: string | null
  created_at: string
}

export interface SpaSubscription {
  user_id: string
  plan: SpaPlan
  status: 'active' | 'cancelled'
  plan_price: number
  started_at: string
  renewal_date: string | null
  cancelled_at: string | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  type: ProductType
  stock: number | null
  created_at: string
}

export interface ShopOrder {
  id: string
  user_id: string
  items: Array<{ product_id: string; quantity: number; price: number }>
  total: number
  status: OrderStatus
  created_at: string
}

export interface CartItem {
  user_id: string
  product_id: string
  quantity: number
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  service: string
  message: string
  created_at: string
}
```

- [ ] **Step 2: Sukurti `lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Sukurti `lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 4: Build patikrinimas**

```bash
npm run build
```
Laukiama: sėkmingas build be TypeScript klaidų

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add TypeScript types and Supabase clients"
```

---

### Task 3: Duomenų bazės schema (Supabase)

**Files:**
- Create: `supabase-schema.sql`

- [ ] **Step 1: Sukurti `supabase-schema.sql`**

```sql
-- Profiles (auto-created on first login via trigger)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  tier text not null default 'simple' check (tier in ('simple','cms','custom')),
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Generated sites
create table generated_sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  prompt text not null,
  html_content text not null,
  subdomain text unique not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table generated_sites enable row level security;
create policy "Users can manage own sites" on generated_sites for all using (auth.uid() = user_id);

-- Orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  service_type text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled')),
  price numeric(10,2),
  notes text,
  created_at timestamptz not null default now()
);
alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);

-- SPA subscriptions
create table spa_subscriptions (
  user_id uuid references profiles(id) on delete cascade primary key,
  plan text not null check (plan in ('basic','pro','enterprise')),
  status text not null default 'active' check (status in ('active','cancelled')),
  plan_price numeric(10,2) not null,
  started_at timestamptz not null default now(),
  renewal_date timestamptz,
  cancelled_at timestamptz
);
alter table spa_subscriptions enable row level security;
create policy "Users can manage own subscription" on spa_subscriptions for all using (auth.uid() = user_id);

-- Blog posts
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table blog_posts enable row level security;
create policy "Anyone can view published posts" on blog_posts for select using (published = true);

-- Products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  price numeric(10,2) not null,
  type text not null check (type in ('digital','physical')),
  stock integer,
  created_at timestamptz not null default now()
);
alter table products enable row level security;
create policy "Anyone can view products" on products for select using (true);

-- Shop orders
create table orders_shop (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null,
  items jsonb not null default '[]',
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);
alter table orders_shop enable row level security;
create policy "Users can view own shop orders" on orders_shop for select using (auth.uid() = user_id);
create policy "Anyone can insert shop orders" on orders_shop for insert with check (true);

-- Cart items
create table cart_items (
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null default 1,
  primary key (user_id, product_id)
);
alter table cart_items enable row level security;
create policy "Users can manage own cart" on cart_items for all using (auth.uid() = user_id);

-- Contact submissions
create table contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  service text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table contact_submissions enable row level security;
create policy "Anyone can insert contact" on contact_submissions for insert with check (true);
```

- [ ] **Step 2: Vykdyti SQL Supabase SQL editoriuje**

Eiti į: https://supabase.com/dashboard → SQL Editor → Paste ir vykdyti

- [ ] **Step 3: Patikrinti lentelės Supabase Table Editor**

Visos 9 lentelės turi būti matomos: profiles, generated_sites, orders, spa_subscriptions, blog_posts, products, orders_shop, cart_items, contact_submissions

- [ ] **Step 4: Commit**

```bash
git add supabase-schema.sql
git commit -m "feat: add Supabase database schema with RLS"
```

---

## Fazė 2: Landing Page

### Task 4: Komponentai — Logo, Navbar, Footer

**Files:**
- Create: `components/ui/Logo.tsx`
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Sukurti `components/ui/Logo.tsx`**

```tsx
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="8" cy="18" r="4.5" fill="#2563eb"/>
        <circle cx="28" cy="8" r="4.5" fill="#2563eb" opacity="0.65"/>
        <circle cx="28" cy="28" r="4.5" fill="#2563eb" opacity="0.65"/>
        <line x1="8" y1="18" x2="28" y2="8" stroke="#2563eb" strokeWidth="1.5" opacity="0.4"/>
        <line x1="8" y1="18" x2="28" y2="28" stroke="#2563eb" strokeWidth="1.5" opacity="0.4"/>
        <line x1="28" y1="8" x2="28" y2="28" stroke="#2563eb" strokeWidth="1" opacity="0.25"/>
      </svg>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#1e40af', letterSpacing: '-0.5px' }}>
        nodas<span style={{ color: '#93c5fd', fontWeight: 500, fontSize: 13 }}>.lt</span>
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Sukurti `components/layout/Navbar.tsx`**

```tsx
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function Navbar() {
  return (
    <nav style={{
      background: '#fff', borderBottom: '1px solid #e2e8f0',
      padding: '0 40px', height: 64, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>
      <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
        {[
          { href: '/#paslaugos', label: 'Paslaugos' },
          { href: '/#kainos', label: 'Kainos' },
          { href: '/blog', label: 'Blog' },
          { href: '/#kontaktai', label: 'Kontaktai' },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link href={href} style={{ color: '#475569', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/auth/login" style={{
        background: '#2563eb', color: '#fff', padding: '9px 20px',
        borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
      }}>
        Prisijungti →
      </Link>
    </nav>
  )
}
```

- [ ] **Step 3: Sukurti `components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{
      background: '#0f172a', color: '#94a3b8', padding: '28px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13,
    }}>
      <div>© {new Date().getFullYear()} nodas.lt — IT paslaugos Lietuvoje</div>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link href="/privatumas" style={{ color: '#60a5fa', textDecoration: 'none' }}>Privatumo politika</Link>
        <a href="mailto:info@nodas.lt" style={{ color: '#60a5fa', textDecoration: 'none' }}>info@nodas.lt</a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Build patikrinimas**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: add Logo, Navbar, Footer components"
```

---

### Task 5: Landing page — pagrindinis puslapis

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: Atnaujinti `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'nodas.lt — Web remontas ir IT paslaugos Lietuvoje',
  description: 'Web remontas, AI svetainės, WordPress, serverių diegimas. Profesionalus IT specialistas Lietuvoje. Nuo €39.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <body style={{ margin: 0, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Sukurti `app/page.tsx` — hero sekcija**

Struktūros šaltiniai (abiejų naudoti):
- Maketas: `docs/superpowers/brainstorm/6830-1773917637/landing-v2.html` (pirmas pasirinkimas — tikslūs stiliai)
- Spec: `docs/superpowers/specs/2026-03-19-nodas-platform-design.md` Section 5 (atsarginis šaltinis jei maketo nėra)

```tsx
// Hero + pasitikėjimo juosta + apie + paslaugos + atsiliepimai + kontaktai

const SERVICES = [
  { num: '01', icon: '🔧', name: 'Web Remontas', desc: 'Svetainė neveikia? Klaidos, lėtas greitis, nulaužta — sutaisau greitai.', price: 'nuo €39' },
  { num: '02', icon: '🤖', name: 'AI Svetainė', desc: 'Claude AI sugeneruoja jūsų svetainę pagal aprašymą per 5 minutes.', price: '€149 vienkartinis' },
  { num: '03', icon: '📦', name: 'WordPress / CMS', desc: 'Pilnai valdoma svetainė su administravimo paneliu.', price: '€349 vienkartinis' },
  { num: '04', icon: '⚡', name: 'Custom Dev', desc: 'React, Next.js — individualūs sprendimai verslui.', price: 'Individualus' },
  { num: '05', icon: '🛡️', name: 'Web SPA priežiūra', desc: 'Mėnesinė priežiūra, monitoringas, backupai, turinio keitimai.', price: '€29–€129/mėn' },
  { num: '06', icon: '🧠', name: 'AI Sprendimai', desc: 'AI agentai, chatbotai, automatizavimas jūsų verslui.', price: 'Individualus' },
  { num: '07', icon: '🔍', name: 'SEO', desc: 'Optimizuojame svetainę Google paieškos rezultatams.', price: 'Individualus' },
  { num: '08', icon: '🖥️', name: 'Serverių diegimas', desc: 'Linux serverių konfigūracija, hosting, domenai.', price: 'Individualus' },
  { num: '09', icon: '🛒', name: 'El. parduotuvė', desc: 'WooCommerce ar custom e-commerce sprendimai.', price: 'Individualus' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero — du stulpeliai */}
      {/* Kairė: badge + H1 + USP sąrašas + mygtukai + statistikos eilutė */}
      {/* Dešinė: greito užsakymo kortelė su 4 paslaugomis */}
      {/* Maketas: landing-v2.html */}

      {/* Pasitikėjimo juosta — tamsiai mėlyna */}

      {/* Apie mane — du stulpeliai */}

      {/* id="paslaugos" — 3x3 tinklelis */}

      {/* Atsiliepimai */}

      {/* id="kontaktai" — forma → POST /api/contact */}
    </main>
  )
}
```

**Svarbu:** Kopijuoti tikslų stilių iš `docs/superpowers/brainstorm/*/landing-v2.html`. Tai patvirtintas maketas.

- [ ] **Step 3: Sukurti `app/api/contact/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { name, email, service, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Trūksta laukų' }, { status: 400 })
  }

  await supabase.from('contact_submissions').insert({ name, email, service, message })

  // Siųsti el. laišką — sendContactEmail bus sukurta Task 12
  // await sendContactEmail({ name, email, service, message })

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Patikrinti naršyklėje**

```bash
npm run dev
```
Atidaryti `http://localhost:3000` — matyti landing page su visomis sekcijomis

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx app/api/contact/
git commit -m "feat: add landing page with hero, services, contact form"
```

---

## Fazė 3: Autentifikacija

### Task 6: Google OAuth + Middleware

**Files:**
- Create: `app/auth/login/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Sukonfigūruoti Supabase Auth**

Eiti į Supabase Dashboard → Authentication → Providers → Google:
- Įjungti Google provider
- Įvesti Google Client ID: `32113438213-f4pgb442plc4psvvb9nkp6efv3mahp0l.apps.googleusercontent.com`
- Redirect URI: `https://hcwxeqilojtmyrjpiuiu.supabase.co/auth/v1/callback`

URL Configuration → Site URL: `http://localhost:3000` (dev), `https://nodas.lt` (prod)
Redirect URLs: `http://localhost:3000/auth/callback`, `https://nodas.lt/auth/callback`

- [ ] **Step 2: Sukurti `app/auth/login/page.tsx`**

```tsx
'use client'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 40, width: 360, textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }}><Logo /></div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Prisijungti</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Naudokite Google paskyrą</p>
        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '12px 0', background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Prisijungti su Google
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Sukurti `app/auth/callback/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

- [ ] **Step 4: Sukurti `middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Subdomain routing: xxx.nodas.lt → /s/xxx
  const subdomain = hostname.match(/^([a-z0-9-]+)\.nodas\.lt$/)?.[1]
  if (subdomain && subdomain !== 'www') {
    return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url))
  }

  // Auth guard
  const response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/auth/login', request.url))
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    if (!profile?.is_admin) return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if ((pathname === '/' || pathname.startsWith('/auth')) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
```

- [ ] **Step 5: Patikrinti auth srautą**

```bash
npm run dev
```
- Eiti į `http://localhost:3000/auth/login` — matyti Google mygtuką
- Spausti — nukreipia į Google OAuth
- Po sėkmingo login — nukreipia į `/dashboard`

- [ ] **Step 6: Commit**

```bash
git add app/auth/ middleware.ts
git commit -m "feat: add Google OAuth authentication and middleware"
```

---

## Fazė 4: Dashboard shell ir pagrindinis puslapis

### Task 7: Dashboard layout (sidebar + topbar)

**Files:**
- Create: `components/layout/DashboardSidebar.tsx`
- Create: `app/dashboard/layout.tsx`
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Sukurti `components/layout/DashboardSidebar.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_MAIN = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/sites', icon: '🌐', label: 'Mano svetainės' },
  { href: '/dashboard/orders', icon: '📋', label: 'Užsakymai' },
]
const NAV_SERVICES = [
  { href: '/dashboard/sites', icon: '🤖', label: 'AI Svetainė' },
  { href: '/dashboard/repair', icon: '🔧', label: 'Web Remontas' },
  { href: '/dashboard/spa', icon: '🛡️', label: 'Web SPA' },
  { href: '/dashboard/ai', icon: '🧠', label: 'AI Sprendimai' },
  { href: '/dashboard/seo', icon: '🔍', label: 'SEO' },
]

export function DashboardSidebar({ userName, tier }: { userName: string; tier: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <Logo size={24} />
      </div>
      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '6px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pagrindinis</div>
        {NAV_MAIN.map(({ href, icon, label }) => (
          <Link key={href} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
            fontSize: 13, fontWeight: pathname === href ? 600 : 500,
            color: pathname === href ? '#1e40af' : '#475569',
            background: pathname === href ? '#eff6ff' : 'transparent',
            textDecoration: 'none', margin: '1px 8px', borderRadius: 8,
          }}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Paslaugos</div>
        {NAV_SERVICES.map(({ href, icon, label }) => (
          <Link key={label} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
            fontSize: 13, fontWeight: 500, color: '#475569',
            textDecoration: 'none', margin: '1px 8px', borderRadius: 8,
          }}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Kita</div>
        <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#475569', textDecoration: 'none', margin: '1px 8px', borderRadius: 8 }}>
          <span>👤</span>Profilis
        </Link>
      </nav>
      <div style={{ padding: '14px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#1e40af' }}>
          {userName[0]?.toUpperCase() ?? 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{userName}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>{tier} planas</div>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} title="Atsijungti">↩</button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Sukurti `app/dashboard/layout.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tier')
    .eq('id', user.id)
    .single()

  const userName = profile?.full_name ?? user.email ?? 'Vartotojas'
  const tier = profile?.tier ?? 'simple'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <DashboardSidebar userName={userName} tier={tier} />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Sukurti `app/dashboard/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: sites }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('full_name, tier').eq('id', user.id).single(),
    supabase.from('generated_sites').select('id').eq('user_id', user.id),
    supabase.from('orders').select('id, status').eq('user_id', user.id),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Vartotojas'
  const siteCount = sites?.length ?? 0
  const orderCount = orders?.length ?? 0
  const activeOrders = orders?.filter(o => o.status === 'in_progress').length ?? 0

  return (
    <div style={{ padding: '0 28px 28px' }}>
      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 0 0', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginLeft: -28, marginRight: -28, paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Sveiki sugrįžę, {firstName} 👋</div>
        <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          + Naujas užsakymas
        </Link>
      </div>

      {/* Tier banner */}
      <div style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', borderRadius: 12, padding: '18px 20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Jūsų planas</div>
          <div style={{ fontSize: 18, fontWeight: 800, textTransform: 'capitalize' }}>{profile?.tier ?? 'simple'}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>
            {profile?.tier === 'simple' ? '1 AI svetainė · Pagrindinis funkcionalumas' : 'Neribotos svetainės · Premium funkcionalumas'}
          </div>
        </div>
        <Link href="/dashboard/spa" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
          Atnaujinti planą →
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: '🌐 Svetainės', value: siteCount, sub: `iš ${profile?.tier === 'simple' ? '1' : '∞'} leidžiamų` },
          { label: '📋 Užsakymai', value: orderCount, sub: `${activeOrders} vykdomi` },
          { label: '🛡️ SPA planas', value: '—', sub: 'neprenumeruota' },
          { label: '📬 Žinutės', value: 0, sub: 'neatsakyta' },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { href: '/dashboard/sites', icon: '🤖', name: 'AI Svetainė', sub: 'nuo €149' },
          { href: '/dashboard/repair', icon: '🔧', name: 'Web Remontas', sub: 'nuo €39' },
          { href: '/dashboard/spa', icon: '🛡️', name: 'Web SPA', sub: 'nuo €29/mėn' },
        ].map(({ href, icon, name, sub }) => (
          <Link key={href} href={href} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 18 }}>›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Patikrinti dashboard**

```bash
npm run dev
```
Prisijungus eiti į `http://localhost:3000/dashboard` — matyti pilną dashboard

- [ ] **Step 5: Commit**

```bash
git add components/layout/DashboardSidebar.tsx app/dashboard/
git commit -m "feat: add dashboard layout, sidebar, and home page"
```

---

## Fazė 5: AI svetainių generatorius

### Task 8: AI generavimo API ir UI

**Files:**
- Create: `app/api/generate-site/route.ts`
- Create: `app/dashboard/sites/page.tsx`
- Create: `app/dashboard/sites/builder/page.tsx`
- Create: `app/s/[subdomain]/page.tsx`

- [ ] **Step 1: Sukurti `app/api/generate-site/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  if (!prompt) return NextResponse.json({ error: 'Prompt privalomas' }, { status: 400 })

  if (process.env.MOCK_AI === 'true') {
    return NextResponse.json({
      html: `<!DOCTYPE html><html><body><h1>Mock: ${prompt}</h1></body></html>`,
      name: 'Mock svetainė',
    })
  }

  const [htmlMsg, nameMsg] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Sukurk profesionalią vieno puslapio svetainę HTML/CSS/JS. Verslo aprašymas: ${prompt}. Grąžink tik HTML kodą, be komentarų.`,
      }],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 30,
      messages: [{
        role: 'user',
        content: `Iš šio aprašymo ištrauk trumpą verslo pavadinimą (1-3 žodžiai, lotyniški rašmenys): ${prompt}. Grąžink tik pavadinimą.`,
      }],
    }),
  ])

  const html = htmlMsg.content[0].type === 'text' ? htmlMsg.content[0].text : ''
  const name = nameMsg.content[0].type === 'text' ? nameMsg.content[0].text.trim() : 'Mano svetainė'

  return NextResponse.json({ html, name })
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { html, name, prompt } = await req.json()

  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
  if (profile?.tier === 'simple') {
    const { count } = await supabase.from('generated_sites').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    if ((count ?? 0) >= 1) {
      return NextResponse.json({ error: 'Simple plane leidžiama tik 1 svetainė' }, { status: 403 })
    }
  }

  const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30)

  const { data, error: insertError } = await supabase.from('generated_sites').insert({
    user_id: user.id, name, prompt, html_content: html, subdomain, published: true,
  }).select().single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ site: data })
}
```

- [ ] **Step 2: Sukurti `app/dashboard/sites/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SitesPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ html: string; name: string } | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/generate-site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ html: result.html, name: result.name, prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      alert(`Svetainė išsaugota! Subdomain: ${data.site.subdomain}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>🤖 AI Svetainių generatorius</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, maxWidth: 600 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Aprašykite savo verslą</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Pvz: Vilniaus kavinė su puikia kava ir desertais. Dirbame I-V 8-20, VI-VII 9-18."
          style={{ width: '100%', height: 120, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
        />
        {error && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</div>}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{ background: '#2563eb', color: '#fff', padding: '11px 24px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 12, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Generuojama...' : 'Generuoti svetainę →'}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Peržiūra: {result.name}</h2>
            <button onClick={handleSave} disabled={loading} style={{ background: '#16a34a', color: '#fff', padding: '6px 16px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              💾 Išsaugoti
            </button>
          </div>
          <iframe srcDoc={result.html} style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 8 }} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Sukurti `app/dashboard/sites/builder/page.tsx`** — peržiūra po generavimo

```tsx
// Šis puslapis pasiekiamas po išsaugojimo: /dashboard/sites/builder?subdomain=xxx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function BuilderPage({ searchParams }: { searchParams: { subdomain?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const subdomain = searchParams.subdomain
  if (!subdomain) redirect('/dashboard/sites')

  const { data: site } = await supabase
    .from('generated_sites')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('user_id', user.id)
    .single()

  if (!site) redirect('/dashboard/sites')

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>🌐 {site.name}</h1>
        <a href={`https://${site.subdomain}.nodas.lt`} target="_blank" rel="noopener noreferrer"
          style={{ background: '#2563eb', color: '#fff', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Atidaryti ↗
        </a>
        <a href="/dashboard/sites" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>← Grįžti</a>
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        Adresas: <strong>{site.subdomain}.nodas.lt</strong> · Sukurta: {new Date(site.created_at).toLocaleDateString('lt-LT')}
      </div>
      <iframe
        srcDoc={site.html_content}
        style={{ width: '100%', height: 600, border: '1px solid #e2e8f0', borderRadius: 12 }}
        title={site.name}
      />
    </div>
  )
}
```

- [ ] **Step 4: Sukurti `app/s/[subdomain]/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function SubdomainPage({ params }: { params: { subdomain: string } }) {
  const supabase = await createClient()
  const { data: site } = await supabase
    .from('generated_sites')
    .select('html_content, name')
    .eq('subdomain', params.subdomain)
    .eq('published', true)
    .single()

  if (!site) notFound()

  return (
    <html>
      <head><title>{site.name}</title></head>
      <body dangerouslySetInnerHTML={{ __html: site.html_content }} />
    </html>
  )
}
```

- [ ] **Step 5: Patikrinti AI generatorių**

```bash
MOCK_AI=true npm run dev
```
- Eiti į `http://localhost:3000/dashboard/sites`
- Įvesti aprašymą, spausti "Generuoti"
- Pamatyti peržiūrą, išsaugoti
- Po išsaugojimo — nukreipia į `/dashboard/sites/builder?subdomain=xxx`

- [ ] **Step 6: Commit**

```bash
git add app/api/generate-site/ app/dashboard/sites/ app/s/
git commit -m "feat: add AI site generation with Claude API and builder preview"
```

---

## Fazė 6: Užsakymų sistema ir el. paštas

### Task 9: Užsakymų CRUD

**Files:**
- Create: `app/api/orders/route.ts`
- Create: `app/dashboard/orders/page.tsx`
- Create: `app/dashboard/orders/new/page.tsx`
- Create: `app/dashboard/repair/page.tsx`

- [ ] **Step 1: Sukurti `app/api/orders/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return NextResponse.json({ orders: data })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { service_type, notes, price } = await req.json()
  if (!service_type) return NextResponse.json({ error: 'service_type privalomas' }, { status: 400 })

  const { data, error } = await supabase.from('orders').insert({
    user_id: user.id, service_type, notes, price,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // sendOrderConfirmEmail ir sendAdminNewOrder — bus pridėti Task 10
  return NextResponse.json({ order: data })
}
```

- [ ] **Step 2: Sukurti `app/dashboard/orders/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Laukia', in_progress: 'Vykdoma', completed: 'Atlikta', cancelled: 'Atšaukta',
}
const STATUS_COLORS: Record<string, string> = {
  pending: '#fef3c7', in_progress: '#dbeafe', completed: '#dcfce7', cancelled: '#fee2e2',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>📋 Mano užsakymai</h1>
      {(!orders || orders.length === 0) ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 40, textAlign: 'center', color: '#64748b' }}>
          Dar nėra užsakymų. <a href="/dashboard/orders/new" style={{ color: '#2563eb' }}>Pateikti pirmą užsakymą →</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order: Order) => (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{order.service_type}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{new Date(order.created_at).toLocaleDateString('lt-LT')}</div>
                {order.notes && <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{order.notes}</div>}
              </div>
              {order.price && <div style={{ fontSize: 15, fontWeight: 700, color: '#2563eb' }}>€{order.price}</div>}
              <div style={{ background: STATUS_COLORS[order.status] ?? '#f1f5f9', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                {STATUS_LABELS[order.status] ?? order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Sukurti `app/dashboard/repair/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RepairPage() {
  const [form, setForm] = useState({ url: '', problem: '', contact: '', extra: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const notes = `URL: ${form.url}\nProblema: ${form.problem}\nKontaktas: ${form.contact}\nPapildoma: ${form.extra}`
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ service_type: 'Web Remontas', notes }),
      })
      if (!res.ok) throw new Error('Klaida siunčiant užklausą')
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ padding: 28 }}>
      <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: 32, maxWidth: 500, textAlign: 'center' }}>
        <div style={{ fontSize: 32 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#166534', marginTop: 12 }}>Užklausa gauta!</div>
        <div style={{ fontSize: 14, color: '#15803d', marginTop: 8 }}>Susisieksime per 24 valandas.</div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🔧 Web Remontas</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Aprašykite problemą — atsakysime per 24 val. Kaina nuo €39.</p>
      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 560 }}>
        {[
          { key: 'url', label: 'Svetainės URL', placeholder: 'https://jusu-svetaine.lt' },
          { key: 'problem', label: 'Kokia problema?', placeholder: 'Pvz: svetainė neatsidaro, rodo klaidą 500...' },
          { key: 'contact', label: 'Jūsų el. paštas arba tel.', placeholder: 'info@jusu.lt arba +370...' },
          { key: 'extra', label: 'Papildoma informacija (neprivaloma)', placeholder: 'Kada pradėjo neveikti, kas paskutiniai pakeitimai...' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
            <textarea
              value={form[key as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, height: 72, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading || !form.problem.trim()} style={{ background: '#2563eb', color: '#fff', padding: '11px 24px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Siunčiama...' : 'Siųsti užklausą →'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Build patikrinimas**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add app/api/orders/ app/dashboard/orders/ app/dashboard/repair/
git commit -m "feat: add orders CRUD and repair request form"
```

---

### Task 10: El. pašto sistema

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Sukurti `lib/email.ts`**

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM ?? 'nodas.lt <info@nodas.lt>'
const ADMIN_EMAIL = 'info@nodas.lt'

function baseLayout(content: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f8fafc;padding:32px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0">
      <div style="font-size:20px;font-weight:800;color:#1e40af;margin-bottom:24px">nodas.lt</div>
      ${content}
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
        nodas.lt — IT paslaugos Lietuvoje | info@nodas.lt
      </div>
    </div>
  </body></html>`
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({ from: FROM, to, subject: 'Sveiki atvykę į nodas.lt!',
    html: baseLayout(`<h2>Sveiki, ${name}!</h2><p>Džiaugiamės, kad prisijungėte prie nodas.lt. Galite pradėti naudotis paslaugomis savo paskyroje.</p>`) })
}

export async function sendOrderConfirmEmail(to: string, name: string, serviceType: string) {
  await resend.emails.send({ from: FROM, to, subject: `Užsakymas gautas — ${serviceType}`,
    html: baseLayout(`<h2>Užsakymas gautas!</h2><p>Sveiki, ${name}! Jūsų užsakymas <strong>${serviceType}</strong> gautas. Susisieksime per 24 val..</p>`) })
}

export async function sendOrderStatusEmail(to: string, serviceType: string, status: string) {
  await resend.emails.send({ from: FROM, to, subject: `Užsakymo statusas pakeistas — ${serviceType}`,
    html: baseLayout(`<h2>Statusas: ${status}</h2><p>Jūsų užsakymo <strong>${serviceType}</strong> statusas pakeistas į <strong>${status}</strong>.</p>`) })
}

export async function sendAdminNewOrder(serviceType: string, userName: string) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `📋 Naujas užsakymas: ${serviceType}`,
    html: baseLayout(`<h2>Naujas užsakymas!</h2><p>Klientas: <strong>${userName}</strong><br>Paslauga: <strong>${serviceType}</strong></p>`) })
}

export async function sendAdminNewUser(userName: string, email: string) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `👤 Naujas vartotojas: ${userName}`,
    html: baseLayout(`<h2>Naujas vartotojas!</h2><p>Vardas: ${userName}<br>El. paštas: ${email}</p>`) })
}

export async function sendSiteGeneratedEmail(to: string, name: string, subdomain: string) {
  await resend.emails.send({ from: FROM, to, subject: `🌐 Jūsų svetainė paruošta!`,
    html: baseLayout(`<h2>Svetainė paruošta!</h2><p>Sveiki, ${name}! Jūsų AI svetainė pasiekiama:<br><a href="https://${subdomain}.nodas.lt">${subdomain}.nodas.lt</a></p>`) })
}

export async function sendContactEmail(data: { name: string; email: string; service: string; message: string }) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `📩 Kontakto užklausa: ${data.service}`,
    html: baseLayout(`<h2>Nauja kontakto užklausa</h2><p>Vardas: ${data.name}<br>El. paštas: ${data.email}<br>Paslauga: ${data.service}</p><p>${data.message}</p>`) })
}

export async function sendShopOrderConfirmEmail(to: string, total: number) {
  await resend.emails.send({ from: FROM, to, subject: `🛒 Pirkimas patvirtintas — €${total}`,
    html: baseLayout(`<h2>Ačiū už pirkimą!</h2><p>Jūsų užsakymas €${total} patvirtintas. Informuosime kai bus išsiųstas.</p>`) })
}

export async function sendAdminShopOrder(total: number, itemCount: number) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `🛒 Parduotuvės užsakymas €${total}`,
    html: baseLayout(`<h2>Parduotuvės užsakymas</h2><p>Suma: €${total}<br>Prekių: ${itemCount}</p>`) })
}
```

- [ ] **Step 2: Integruoti sendContactEmail į `/api/contact/route.ts`** — atkomentaruoti eilutę iš Task 5

- [ ] **Step 3: Integruoti sendOrderConfirmEmail ir sendAdminNewOrder į `/api/orders/route.ts`**

- [ ] **Step 4: Build patikrinimas**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add lib/email.ts app/api/contact/
git commit -m "feat: add email system with Resend"
```

---

## Fazė 7: Blog

### Task 11: Blog puslapiai

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Sukurti `app/blog/page.tsx`** — serverinis komponentas, gauna `blog_posts` iš Supabase (published=true), rodo kortelių tinklelį

- [ ] **Step 2: Sukurti `app/blog/[slug]/page.tsx`** — gauna vieną įrašą pagal slug, rodo turinį

- [ ] **Step 3: Sukurti `app/api/admin/blog/route.ts`** — CRUD admin blog valdymui (GET/POST/PUT/DELETE)

- [ ] **Step 4: Commit**

```bash
git add app/blog/ app/api/admin/blog/
git commit -m "feat: add blog listing and detail pages"
```

---

## Fazė 8: Parduotuvė

### Task 12: Parduotuvė ir krepšelis

**Files:**
- Create: `app/parduotuve/page.tsx`
- Create: `app/parduotuve/[slug]/page.tsx`
- Create: `app/parduotuve/krepselis/page.tsx`
- Create: `app/parduotuve/checkout/page.tsx`
- Create: `app/api/products/route.ts`
- Create: `lib/paysera.ts`
- Create: `app/api/payment/route.ts`
- Create: `app/api/payment/callback/route.ts`
- Create: `app/payment/success/page.tsx`
- Create: `app/payment/cancel/page.tsx`

- [ ] **Step 1: Sukurti `lib/paysera.ts`**

```typescript
import * as crypto from 'crypto'

export function createPayseraPayment(params: {
  orderId: string
  amount: number // centais
  currency: string
  description: string
  callbackUrl: string
  acceptUrl: string
  cancelUrl: string
  email?: string
}) {
  const projectId = process.env.PAYSERA_PROJECT_ID!
  const signPassword = process.env.PAYSERA_SIGN_PASSWORD!
  const test = process.env.NODE_ENV !== 'production' ? '1' : '0'

  const data = {
    projectid: projectId,
    orderid: params.orderId,
    amount: params.amount.toString(),
    currency: params.currency,
    country: 'LT',
    accepturl: params.acceptUrl,
    cancelurl: params.cancelUrl,
    callbackurl: params.callbackUrl,
    test,
    p_email: params.email ?? '',
  }

  const dataStr = Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')
  const encoded = Buffer.from(dataStr).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
  const sign = crypto.createHash('md5').update(encoded + signPassword).digest('hex')

  return `https://www.paysera.com/pay/?data=${encoded}&sign=${sign}`
}

export function verifyPayseraCallback(data: string, sign: string): boolean {
  const signPassword = process.env.PAYSERA_SIGN_PASSWORD!
  const expected = crypto.createHash('md5').update(data + signPassword).digest('hex')
  return expected === sign
}

export function parsePayseraCallback(data: string): Record<string, string> {
  const decoded = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
  return Object.fromEntries(decoded.split('&').map(p => p.split('=')))
}
```

- [ ] **Step 2: Sukurti `app/api/products/route.ts`** — viešas GET produktų sąrašas

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ products: data ?? [] })
}
```

- [ ] **Step 3: Sukurti parduotuvės puslapius**

Krepšelio būsena: saugoma `cart_items` Supabase lentelėje (prisijungusiems) arba `localStorage` (neprisijungusiems).

- `app/parduotuve/page.tsx` — serverinis, gauna produktus, rodo kortelių tinklelį su "Į krepšelį" mygtuku
- `app/parduotuve/[slug]/page.tsx` — produkto detalės, kaina, "Pirkti" mygtukas
- `app/parduotuve/krepselis/page.tsx` — krepšelio turinys, kiekiai, suma, "Apmokėti" mygtukas → inicijuoja Paysera
- `app/parduotuve/checkout/page.tsx` — checkout formos puslapis (vardas, adresas fizinėms prekėms)

**Cart state flow:**
1. Vartotojas spaudžia "Į krepšelį" → `POST /api/cart` → įrašo `cart_items`
2. Krepšelio puslapis → `GET /api/cart` → rodo prekes
3. "Apmokėti" → `POST /api/shop/checkout` → sukuria `orders_shop`, grąžina Paysera URL
4. Paysera callback → `POST /api/shop/callback` → atnaujina `orders_shop.status = 'completed'`

- [ ] **Step 4: Sukurti `app/api/shop/checkout/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPayseraPayment } from '@/lib/paysera'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const { items, total, email } = await req.json() // items: Array<{product_id, quantity, price}>
  if (!items?.length) return NextResponse.json({ error: 'Krepšelis tuščias' }, { status: 400 })

  const { data: order, error } = await supabase.from('orders_shop').insert({
    items, total, status: 'pending',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const payseraUrl = createPayseraPayment({
    orderId: order.id,
    amount: Math.round(total * 100),
    currency: 'EUR',
    description: `nodas.lt užsakymas #${order.id.slice(0, 8)}`,
    callbackUrl: `${appUrl}/api/shop/callback`,
    acceptUrl: `${appUrl}/payment/success`,
    cancelUrl: `${appUrl}/payment/cancel`,
    email,
  })

  return NextResponse.json({ payseraUrl, orderId: order.id })
}
```

- [ ] **Step 5: Sukurti `app/api/shop/callback/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPayseraCallback, parsePayseraCallback } from '@/lib/paysera'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const data = body.get('data') as string
  const sign = body.get('sign') as string

  if (!verifyPayseraCallback(data, sign)) {
    return new Response('Invalid signature', { status: 400 })
  }

  const params = parsePayseraCallback(data)
  if (params.status === '1') { // 1 = mokėjimas sėkmingas
    await supabase.from('orders_shop').update({ status: 'completed' }).eq('id', params.orderid)
  }

  return new Response('OK')
}
```

- [ ] **Step 3: Sukurti `app/api/payment/route.ts`** — inicijuoja Paysera mokėjimą

- [ ] **Step 4: Sukurti `app/api/payment/callback/route.ts`** — validuoja Paysera callback, atnaujina užsakymo statusą

- [ ] **Step 5: Sukurti sėkmės/atšaukimo puslapius**

- [ ] **Step 6: Commit**

```bash
git add app/parduotuve/ app/api/products/ app/api/shop/ lib/paysera.ts app/api/payment/ app/payment/
git commit -m "feat: add shop, cart, and Paysera payment integration"
```

---

## Fazė 9: Admin panel

### Task 13: Admin zona

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/users/page.tsx`
- Create: `app/admin/orders/page.tsx`
- Create: `app/admin/sites/page.tsx`
- Create: `app/admin/blog/page.tsx`
- Create: `app/admin/produktai/page.tsx`
- Create: `app/api/admin/orders/route.ts`
- Create: `app/api/admin/users/route.ts`
- Create: `app/api/admin/products/route.ts`
- Create: `lib/admin.ts`

- [ ] **Step 1: Sukurti `lib/admin.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single()
  return data?.is_admin === true
}
```

- [ ] **Step 2: Sukurti `app/admin/layout.tsx`** — patikrina is_admin, rodo admin sidebar

- [ ] **Step 3: Sukurti `app/admin/page.tsx`** — statistikos: vartotojų skaičius, užsakymų, svetainių

- [ ] **Step 4: Sukurti `app/admin/users/page.tsx`** — vartotojų sąrašas su galimybe keisti tier ir is_admin

- [ ] **Step 5: Sukurti `app/admin/orders/page.tsx`** — visi užsakymai su galimybe keisti statusą

- [ ] **Step 6: Sukurti admin API routes** — `/api/admin/orders`, `/api/admin/users`, `/api/admin/products`, `/api/admin/blog`

- [ ] **Step 7: Commit**

```bash
git add app/admin/ app/api/admin/ lib/admin.ts
git commit -m "feat: add admin panel with user, order, and content management"
```

---

## Fazė 10: SEO ir papildomi puslapiai

### Task 14: SEO ir kiti dashboard puslapiai

**Files:**
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/dashboard/spa/page.tsx`
- Create: `app/dashboard/ai/page.tsx`
- Create: `app/dashboard/seo/page.tsx`
- Create: `app/dashboard/profile/page.tsx`
- Create: `app/dashboard/profile/ProfileForm.tsx`

- [ ] **Step 1: Sukurti `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/admin/'] },
    sitemap: 'https://nodas.lt/sitemap.xml',
  }
}
```

- [ ] **Step 2: Sukurti `app/sitemap.ts`** — lista viešų URL: /, /blog/*, /parduotuve/*

- [ ] **Step 3: Sukurti `app/dashboard/spa/page.tsx`** — SPA planų pasirinkimas (Basic/Pro/Enterprise) su kainomis

- [ ] **Step 4: Sukurti `app/dashboard/profile/page.tsx`** ir **`ProfileForm.tsx`** — profilio redagavimas (vardas, telefonas)

- [ ] **Step 5: Sukurti `app/dashboard/orders/new/page.tsx`** — daugiažingsnio formos vedlys

```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SERVICES = ['Web Remontas', 'AI Svetainė', 'WordPress / CMS', 'Custom Dev', 'Web SPA priežiūra', 'AI Sprendimai', 'SEO', 'Serverių diegimas', 'El. parduotuvė']

export default function NewOrderPage() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ service_type: service, notes }),
    })
    router.push('/dashboard/orders')
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>+ Naujas užsakymas</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 560 }}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>1. Pasirinkite paslaugą</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SERVICES.map(s => (
                <button key={s} onClick={() => { setService(s); setStep(2) }}
                  style={{ padding: '12px 16px', background: service === s ? '#eff6ff' : '#f8fafc', border: `1px solid ${service === s ? '#93c5fd' : '#e2e8f0'}`, borderRadius: 8, textAlign: 'left', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>2. Aprašykite užsakymą</h2>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Paslauga: <strong>{service}</strong></div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Aprašykite ko reikia, kokie reikalavimai, terminas..."
              style={{ width: '100%', height: 120, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ padding: '10px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>← Atgal</button>
              <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Siunčiama...' : 'Pateikti užsakymą →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Sukurti `app/api/profile/route.ts`** — PUT profilio atnaujinimui

- [ ] **Step 7: Integruoti `sendWelcomeEmail` ir `sendAdminNewUser` į auth srautą**

Modifikuoti `app/auth/callback/route.ts` — po `exchangeCodeForSession` patikrinti ar tai naujas vartotojas (pirmą kartą), ir siųsti laiškus:

```typescript
// Po supabase.auth.exchangeCodeForSession(code):
const { data: { user } } = await supabase.auth.getUser()
if (user) {
  const { data: profile } = await supabase.from('profiles').select('created_at').eq('id', user.id).single()
  const isNewUser = profile && (Date.now() - new Date(profile.created_at).getTime()) < 30000 // < 30s
  if (isNewUser) {
    const { sendWelcomeEmail, sendAdminNewUser } = await import('@/lib/email')
    const name = user.user_metadata?.full_name ?? user.email ?? 'Vartotojas'
    await Promise.allSettled([
      sendWelcomeEmail(user.email!, name),
      sendAdminNewUser(name, user.email!),
    ])
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add app/robots.ts app/sitemap.ts app/dashboard/spa/ app/dashboard/orders/new/ app/dashboard/profile/ app/dashboard/ai/ app/dashboard/seo/ app/auth/
git commit -m "feat: add SEO, SPA page, new order wizard, profile editor, welcome emails"
```

---

## Fazė 11: Deploy

### Task 15: Vercel deploy ir konfigūracija

- [ ] **Step 1: Patikrinti lokalų build**

```bash
npm run build
```
Laukiama: 0 TypeScript klaidų, sėkmingas build

- [ ] **Step 2: Sukurti Vercel projektą**

```bash
npx vercel --prod
```
Arba: https://vercel.com → New Project → importuoti GitHub repo

- [ ] **Step 3: Nustatyti aplinkos kintamuosius Vercel**

Vercel Dashboard → Project → Settings → Environment Variables. Pridėti visus kintamuosius iš `.env.local` (be NEXT_PUBLIC_APP_URL — jį pakeisti į `https://nodas.lt`)

- [ ] **Step 4: Nustatyti domeną**

Vercel → Domains → pridėti `nodas.lt` ir `*.nodas.lt` (wildcard subdomains)

- [ ] **Step 5: Atnaujinti Supabase URL Configuration**

Supabase → Authentication → URL Configuration:
- Site URL: `https://nodas.lt`
- Redirect URLs: `https://nodas.lt/auth/callback`, `http://localhost:3000/auth/callback`

- [ ] **Step 6: Galutinis patikrinimas**

Patikrinti produkcijoje:
- `https://nodas.lt` → landing page
- `https://nodas.lt/auth/login` → Google OAuth
- `https://nodas.lt/dashboard` → dashboard (po login)

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "feat: production ready — nodas.lt platform complete"
git push origin main
```

---

## Testavimas

Kiekvienos fazės pabaigoje patikrinti:
1. `npm run build` praeina be klaidų
2. `npm run lint` praeina
3. Svarbiausi srautai rankiniu būdu naršyklėje:
   - Auth: prisijungimas → dashboard → atsijungimas
   - AI: aprašymas → generavimas → išsaugojimas → `/s/[subdomain]`
   - Užsakymas: forma → submission → admin mato
   - Admin: `/admin` pasiekiamas tik is_admin=true vartotojams

---

## Greita orientacija

| Noriu pakeisti... | Failas |
|---|---|
| Landing page dizainą | `app/page.tsx` |
| Dashboard šoninį meniu | `components/layout/DashboardSidebar.tsx` |
| AI generavimo prompt | `app/api/generate-site/route.ts` |
| El. laiškų šablonus | `lib/email.ts` |
| Paysera integracją | `lib/paysera.ts` |
| Supabase duomenų bazę | `supabase-schema.sql` + Supabase SQL Editor |
| TypeScript tipus | `lib/types.ts` |
| Middleware (auth/subdomains) | `middleware.ts` |
