# nodas.lt — Claude Code instrukcijos

## Projektas
Lithuanian IT services SaaS platform. Stack: Next.js 14 App Router, TypeScript strict, Tailwind + inline styles, Supabase, Anthropic API, Paysera, Resend, Vercel.

## Kritinės taisyklės
- **NIEKADA nekommituoti**: `.env.local`, `nodas.md` — juose yra realūs API raktai
- **TypeScript strict** — jokių `any` tipų
- **Jokių CSS failų** — tik Tailwind klasės ir inline `style={{}}`
- **Branch**: `master` (ne main)
- **Build prieš push**: `npm run build` turi praeiti be klaidų

## Aplinka
- Repo: github.com/SirCryptoLot/nodas (public)
- Deploy: Vercel auto-deploy on push to master
- Supabase: hcwxeqilojtmyrjpiuiu.supabase.co
- Secrets: C:\nodas\.env.local

## Architektūra
```
app/(public)/     ← viešos puslapiai (Navbar + Footer)
app/dashboard/    ← autentifikuota zona (savo sidebar)
app/admin/        ← tik is_admin=true
app/api/          ← visi API routes (server-side only)
app/s/[subdomain] ← AI-generated sites
```

## Žinomi sprendimai
- FK klaida (orders/sites insert): upsert profiles prieš insert — žr. app/api/orders/route.ts
- Supabase "permission denied": tikrinti SUPABASE_SERVICE_ROLE_KEY Vercel env vars
- Nauji vartotojai be profilio: trigger + upsert fallback API routes

## Donaldas
- Solo dev, lietuviškai komunikuoja
- Mėgsta autonominį vykdymą — nereikia klausinėti kiekvieno žingsnio
- Pirmenybė paprastiems sprendimams (dropdown > multi-step wizard)
