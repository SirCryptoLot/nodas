'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── Service definitions ────────────────────────────────────────────────────

const SERVICES = [
  { id: 'remontas',  icon: '🔧', name: 'Web Remontas',      price: 'nuo €39' },
  { id: 'wordpress', icon: '📦', name: 'WordPress / CMS',    price: 'nuo €349' },
  { id: 'custom',   icon: '⚡', name: 'Custom Dev',          price: 'Individualus' },
  { id: 'spa',      icon: '🛡️', name: 'Web SPA priežiūra',  price: 'nuo €29/mėn' },
  { id: 'ai',       icon: '🧠', name: 'AI Sprendimai',       price: 'Individualus' },
  { id: 'seo',      icon: '🔍', name: 'SEO',                 price: 'Individualus' },
  { id: 'server',   icon: '🖥️', name: 'Serverių diegimas',  price: 'Individualus' },
  { id: 'shop',     icon: '🛒', name: 'El. parduotuvė',      price: 'Individualus' },
]

// ── Field types ────────────────────────────────────────────────────────────

type FieldDef =
  | { type: 'input';    key: string; label: string; placeholder: string; required?: boolean; inputType?: string }
  | { type: 'textarea'; key: string; label: string; placeholder: string; required?: boolean; rows?: number }
  | { type: 'select';   key: string; label: string; options: string[];   required?: boolean }
  | { type: 'cards';    key: string; label: string; required?: boolean; options: { value: string; label: string; sub?: string; icon?: string }[] }
  | { type: 'checkboxes'; key: string; label: string; options: string[]; required?: boolean }

type WizardStep = {
  title: string
  subtitle?: string
  fields: FieldDef[]
}

// ── Shared fields ──────────────────────────────────────────────────────────

const CONTACT_STEP: WizardStep = {
  title: 'Kaip susisiekti?',
  subtitle: 'Susisieksime per 24 valandas',
  fields: [
    {
      type: 'input', key: 'contact', required: true,
      label: 'El. paštas arba telefonas',
      placeholder: 'vardas@email.lt arba +370 600 00000',
    },
    {
      type: 'input', key: 'name',
      label: 'Jūsų vardas (neprivaloma)',
      placeholder: 'Pvz: Jonas Jonaitis',
    },
  ],
}

// ── Wizard definitions per service ────────────────────────────────────────

const SERVICE_WIZARD: Record<string, WizardStep[]> = {
  remontas: [
    {
      title: 'Kokia problema?',
      subtitle: 'Greitas web remontas — paprastai ištaisoma per 24h',
      fields: [
        {
          type: 'input', key: 'url', label: 'Svetainės URL', required: true,
          placeholder: 'https://jusu-svetaine.lt',
        },
        {
          type: 'cards', key: 'problema', label: 'Problemos tipas', required: true,
          options: [
            { value: 'Svetainė neveikia', label: 'Svetainė neveikia', icon: '❌', sub: 'Neatsidaro, serverio klaida' },
            { value: 'Lėtas greitis', label: 'Lėtas greitis', icon: '🐌', sub: 'Kraunasi ilgiau nei 3s' },
            { value: 'Įsilaužta', label: 'Nulaužta / įsilaužta', icon: '🔓', sub: 'Spam, reklama, virusai' },
            { value: 'Dizaino klaidos', label: 'Dizaino / CSS klaidos', icon: '🎨', sub: 'Išsisklaidęs layoutas' },
            { value: 'Forma neveikia', label: 'Forma / parduotuvė', icon: '📋', sub: 'Kontaktų forma, checkout' },
            { value: 'PHP klaidos', label: 'PHP / serverio klaidos', icon: '⚙️', sub: 'Error 500, PHP warnings' },
          ],
        },
      ],
    },
    {
      title: 'Papildoma informacija',
      subtitle: 'Kuo daugiau detalių — tuo greičiau ištaisysime',
      fields: [
        {
          type: 'textarea', key: 'details', label: 'Aprašykite problemą',
          placeholder: 'Kada pradėjo neveikti? Kas paskutiniai pakeitimai? Ar matote klaidų pranešimus?',
          rows: 4,
        },
        {
          type: 'select', key: 'platform', label: 'Svetainės platforma',
          options: ['WordPress', 'HTML / CSS', 'React / Next.js', 'Wix / Squarespace', 'Kita / nežinau'],
        },
        {
          type: 'select', key: 'urgency', label: 'Skubumas',
          options: ['Normalus (iki 48h)', 'Skubu (iki 24h)', 'Labai skubu (šiandien)'],
        },
      ],
    },
    CONTACT_STEP,
  ],

  'ai-site': [
    {
      title: 'Papasakokite apie verslą',
      subtitle: 'AI sukurs jūsų svetainę per kelias minutes',
      fields: [
        {
          type: 'input', key: 'business', label: 'Verslo pavadinimas', required: true,
          placeholder: 'Pvz: Kavinė "Rytas", UAB Statybos partneriai',
        },
        {
          type: 'cards', key: 'sector', label: 'Verslo sektorius', required: true,
          options: [
            { value: 'Restoranai / kavinės', label: 'Restoranai / kavinės', icon: '🍽️' },
            { value: 'Paslaugos', label: 'Paslaugos', icon: '🔨' },
            { value: 'Prekyba', label: 'Prekyba / parduotuvė', icon: '🛒' },
            { value: 'Medicina / sveikata', label: 'Medicina / sveikata', icon: '🏥' },
            { value: 'Ugdymas', label: 'Ugdymas / kursai', icon: '📚' },
            { value: 'Kita', label: 'Kita', icon: '💼' },
          ],
        },
      ],
    },
    {
      title: 'Svetainės turinys',
      subtitle: 'Kuo detaliau — tuo geresnė svetainė',
      fields: [
        {
          type: 'textarea', key: 'desc', label: 'Verslo aprašymas', required: true,
          placeholder: 'Ką veikia jūsų verslas? Kokios pagrindinės paslaugos / produktai? Kas jūsų tikslinė auditorija?',
          rows: 4,
        },
        {
          type: 'input', key: 'style', label: 'Pageidaujamas stilius / spalvos',
          placeholder: 'Pvz: modernus ir šviesus, tamsus ir elegantiškas, mėlona + balta',
        },
        {
          type: 'select', key: 'lang', label: 'Svetainės kalba',
          options: ['Lietuvių', 'Anglų', 'Lietuvių + anglų', 'Kita'],
        },
      ],
    },
    CONTACT_STEP,
  ],

  wordpress: [
    {
      title: 'Kokios svetainės reikia?',
      subtitle: 'WordPress / CMS — patogiai valdoma svetainė',
      fields: [
        {
          type: 'cards', key: 'type', label: 'Svetainės tipas', required: true,
          options: [
            { value: 'Verslo vizitinė', label: 'Verslo vizitinė', icon: '🏢', sub: 'Pagrindinis puslapis, paslaugos, kontaktai' },
            { value: 'Blog / Naujienos', label: 'Blog / Naujienos', icon: '📰', sub: 'Straipsniai, kategorijos, komentarai' },
            { value: 'Portfolio', label: 'Portfolio', icon: '🎨', sub: 'Darbų galerija, apie mus' },
            { value: 'El. parduotuvė', label: 'El. parduotuvė', icon: '🛒', sub: 'WooCommerce su mokėjimais' },
            { value: 'Asociacija', label: 'Asociacija / organizacija', icon: '🤝', sub: 'Nariai, renginiai, naujienos' },
            { value: 'Kita', label: 'Kita', icon: '💡' },
          ],
        },
      ],
    },
    {
      title: 'Detalės',
      subtitle: 'Pagalbinė informacija apie projektą',
      fields: [
        {
          type: 'cards', key: 'pages', label: 'Puslapių skaičius',
          options: [
            { value: '1–3 puslapiai', label: '1–3 puslapiai', icon: '📄', sub: 'Paprasta vizitinė' },
            { value: '4–10 puslapių', label: '4–10 puslapių', icon: '📚', sub: 'Vidutinis projektas' },
            { value: '10+ puslapių', label: '10+ puslapių', icon: '🗂️', sub: 'Didelis projektas' },
          ],
        },
        {
          type: 'select', key: 'lang', label: 'Svetainės kalba',
          options: ['Lietuvių', 'Anglų', 'Lietuvių + anglų', 'Kita'],
        },
        {
          type: 'textarea', key: 'details', label: 'Papildomos žinios',
          placeholder: 'Ar turite domeną? Logotipą? Ar reikia SEO? Kokios funkcijos svarbios?',
          rows: 3,
        },
      ],
    },
    CONTACT_STEP,
  ],

  custom: [
    {
      title: 'Projekto idėja',
      subtitle: 'Custom web/app kūrimas pagal jūsų reikalavimus',
      fields: [
        {
          type: 'cards', key: 'project_type', label: 'Projekto tipas', required: true,
          options: [
            { value: 'Web aplikacija', label: 'Web aplikacija', icon: '🌐', sub: 'SaaS, portalis, CRM' },
            { value: 'Mobile app', label: 'Mobili aplikacija', icon: '📱', sub: 'iOS / Android' },
            { value: 'API / Backend', label: 'API / Backend', icon: '⚙️', sub: 'REST API, integracija' },
            { value: 'Bot / Automatizavimas', label: 'Bot / Automatizavimas', icon: '🤖', sub: 'Telegram bot, scraper' },
            { value: 'Dashboard', label: 'Dashboard / Ataskaitos', icon: '📊', sub: 'Administravimo sistema' },
            { value: 'Kita', label: 'Kita', icon: '💡' },
          ],
        },
        {
          type: 'textarea', key: 'project', label: 'Projekto aprašymas', required: true,
          placeholder: 'Ką kuriame? Kokios funkcijos reikalingos? Koks tikslas? Kas naudosis sistema?',
          rows: 4,
        },
      ],
    },
    {
      title: 'Terminas ir biudžetas',
      subtitle: 'Padės tiksliau įvertinti projekto kainą',
      fields: [
        {
          type: 'input', key: 'tech', label: 'Pageidaujamos technologijos',
          placeholder: 'Pvz: Next.js, React, Node.js, Python... arba "nesvarbu"',
        },
        {
          type: 'cards', key: 'deadline', label: 'Terminas',
          options: [
            { value: 'Iki 2 sav.', label: 'Skubiai', icon: '🔥', sub: 'Iki 2 savaičių' },
            { value: '1 mėn.', label: '1 mėnuo', icon: '📅' },
            { value: '2–3 mėn.', label: '2–3 mėnesiai', icon: '🗓️' },
            { value: 'Nesvarbu', label: 'Nesvarbu', icon: '😌', sub: 'Svarbiau kokybė' },
          ],
        },
        {
          type: 'cards', key: 'budget', label: 'Biudžetas',
          options: [
            { value: 'Iki €500', label: 'Iki €500', icon: '💰' },
            { value: '€500–€2000', label: '€500–€2000', icon: '💰💰' },
            { value: '€2000+', label: '€2000+', icon: '💰💰💰' },
            { value: 'Aptarsime', label: 'Aptarsime', icon: '🤝' },
          ],
        },
      ],
    },
    CONTACT_STEP,
  ],

  spa: [
    {
      title: 'Pasirinkite priežiūros planą',
      subtitle: 'Mes rūpinamės jūsų svetaine — jūs koncentruojatės į verslą',
      fields: [
        {
          type: 'cards', key: 'plan', label: 'Planas', required: true,
          options: [
            { value: 'Basic €29/mėn', label: 'Basic', icon: '🌱', sub: '€29/mėn — monitoringas, backupai, palaikymas' },
            { value: 'Pro €59/mėn', label: 'Pro', icon: '🚀', sub: '€59/mėn — 24/7, savaitiniai backupai, 2h/mėn turinio keitimai' },
            { value: 'Enterprise €129/mėn', label: 'Enterprise', icon: '⭐', sub: '€129/mėn — kasdieniai backupai, 8h/mėn, SEO stebėjimas' },
          ],
        },
      ],
    },
    {
      title: 'Svetainės informacija',
      subtitle: 'Reikalinga priežiūros sąrankai',
      fields: [
        {
          type: 'input', key: 'url', label: 'Svetainės URL', required: true,
          placeholder: 'https://jusu-svetaine.lt',
        },
        {
          type: 'select', key: 'platform', label: 'Svetainės platforma',
          options: ['WordPress', 'HTML / CSS', 'React / Next.js', 'Wix / Squarespace', 'Kita / nežinau'],
        },
        {
          type: 'select', key: 'hosting', label: 'Hostingas',
          options: ['Hostinger', 'Hetzner / VPS', 'Vercel / Netlify', 'cPanel hostingas', 'Nežinau', 'Kita'],
        },
      ],
    },
    CONTACT_STEP,
  ],

  ai: [
    {
      title: 'Koks AI sprendimas reikalingas?',
      subtitle: 'Automatizuokite procesus su dirbtinio intelekto pagalba',
      fields: [
        {
          type: 'cards', key: 'solution', label: 'Sprendimo tipas', required: true,
          options: [
            { value: 'Chatbot', label: 'AI Chatbot', icon: '💬', sub: 'Klientų aptarnavimas 24/7' },
            { value: 'Automatizavimas', label: 'Procesų automatizavimas', icon: '⚙️', sub: 'Kartojamos užduotys' },
            { value: 'Duomenų analizė', label: 'Duomenų analizė', icon: '📊', sub: 'Ataskaitos, prognozės' },
            { value: 'Turinio generavimas', label: 'Turinio generavimas', icon: '✍️', sub: 'Tekstai, aprašymai, SEO' },
            { value: 'API integracija', label: 'AI API integracija', icon: '🔌', sub: 'OpenAI, Claude į sistemą' },
            { value: 'Kita', label: 'Kita', icon: '🧠' },
          ],
        },
      ],
    },
    {
      title: 'Jūsų verslo poreikiai',
      subtitle: 'Padės tiksliai sukonfigūruoti AI sprendimą',
      fields: [
        {
          type: 'textarea', key: 'desc', label: 'Verslo aprašymas ir poreikiai', required: true,
          placeholder: 'Kokia jūsų veikla? Ką norite automatizuoti ar pagerinti? Kiek darbuotojų? Kiek laiko sugaištama?',
          rows: 4,
        },
        {
          type: 'cards', key: 'budget', label: 'Biudžetas',
          options: [
            { value: 'Iki €300', label: 'Iki €300', icon: '💰' },
            { value: '€300–€1000', label: '€300–€1000', icon: '💰💰' },
            { value: '€1000+', label: '€1000+', icon: '💰💰💰' },
            { value: 'Aptarsime', label: 'Aptarsime', icon: '🤝' },
          ],
        },
      ],
    },
    CONTACT_STEP,
  ],

  seo: [
    {
      title: 'SEO optimizavimas',
      subtitle: 'Padidinkite svetainės matomumą Google paieškoje',
      fields: [
        {
          type: 'input', key: 'url', label: 'Svetainės URL', required: true,
          placeholder: 'https://jusu-svetaine.lt',
        },
        {
          type: 'cards', key: 'service', label: 'Reikalinga paslauga', required: true,
          options: [
            { value: 'SEO auditas', label: 'SEO Auditas', icon: '🔍', sub: 'Pilnas svetainės įvertinimas' },
            { value: 'Raktažodžiai', label: 'Raktažodžių tyrimas', icon: '🔑', sub: 'Geriausi raktažodžiai jūsų nišai' },
            { value: 'On-page SEO', label: 'On-page optimizavimas', icon: '📝', sub: 'Metaduomenys, tekstai, struktūra' },
            { value: 'Techninė SEO', label: 'Techninė SEO', icon: '⚙️', sub: 'Greitis, mobilumas, indeksavimas' },
            { value: 'Mėnesinis paketas', label: 'Mėnesinis SEO', icon: '📈', sub: 'Nuolatinis augimas' },
            { value: 'Viskas', label: 'Viskas', icon: '⭐', sub: 'Kompleksinis SEO paketas' },
          ],
        },
      ],
    },
    {
      title: 'Dabartinė situacija',
      subtitle: 'Padės greičiau paruošti SEO strategiją',
      fields: [
        {
          type: 'textarea', key: 'keywords', label: 'Raktažodžiai / veiklos sritis',
          placeholder: 'Pvz: kavinė Vilnius, kavos tiekimas, kava verslui...',
          rows: 3,
        },
        {
          type: 'textarea', key: 'current', label: 'Dabartinė situacija (neprivaloma)',
          placeholder: 'Kur šiuo metu esate Google? Ar buvo daryta SEO anksčiau? Kokia konkurencija?',
          rows: 3,
        },
      ],
    },
    CONTACT_STEP,
  ],

  server: [
    {
      title: 'Serverio konfigūracija',
      subtitle: 'Profesionalus serverių diegimas ir sąranka',
      fields: [
        {
          type: 'cards', key: 'type', label: 'Serverio tipas', required: true,
          options: [
            { value: 'VPS', label: 'VPS serveris', icon: '🖥️', sub: 'Virtual Private Server' },
            { value: 'Dedikuotas', label: 'Dedikuotas serveris', icon: '💾', sub: 'Pilna galia jums' },
            { value: 'Cloud', label: 'Cloud (AWS/GCP/Azure)', icon: '☁️', sub: 'Debesų kompiuterija' },
            { value: 'Docker/K8s', label: 'Docker / Kubernetes', icon: '🐳', sub: 'Konteinerių orkestracija' },
            { value: 'Shared hosting', label: 'Shared hosting', icon: '🏘️', sub: 'cPanel konfigūracija' },
            { value: 'Kita', label: 'Kita', icon: '⚙️' },
          ],
        },
        {
          type: 'select', key: 'os', label: 'Operacinė sistema',
          options: ['Ubuntu 22.04', 'Debian 12', 'CentOS / Rocky Linux', 'Windows Server', 'Nesu tikras'],
        },
      ],
    },
    {
      title: 'Reikalavimai',
      subtitle: 'Ką reikia įdiegti ir sukonfigūruoti?',
      fields: [
        {
          type: 'textarea', key: 'needs', label: 'Tikslai ir reikalavimai', required: true,
          placeholder: 'Ką reikia įdiegti? (nginx, MySQL, Docker, SSL, mail server...)\nKoks apkrovimas planuojamas? Kiek lankytojų per dieną?',
          rows: 4,
        },
        {
          type: 'select', key: 'access', label: 'Ar turite SSH prieigą?',
          options: ['Taip, turiu root prieigą', 'Taip, turiu sudo vartotoją', 'Ne, reikia sukurti', 'Nežinau'],
        },
      ],
    },
    CONTACT_STEP,
  ],

  shop: [
    {
      title: 'El. parduotuvė',
      subtitle: 'Pradėkite pardavinėti internete',
      fields: [
        {
          type: 'cards', key: 'platform', label: 'Platforma', required: true,
          options: [
            { value: 'WooCommerce', label: 'WooCommerce', icon: '📦', sub: 'WordPress pagrindu — lanksti' },
            { value: 'Custom Next.js', label: 'Custom / Next.js', icon: '⚡', sub: 'Greita, unikali parduotuvė' },
            { value: 'Shopify', label: 'Shopify', icon: '🛍️', sub: 'SaaS — paprasta naudoti' },
            { value: 'PrestaShop', label: 'PrestaShop', icon: '🏪', sub: 'Atviro kodo, galingas' },
            { value: 'Kita / nežinau', label: 'Kita / nežinau', icon: '🤔' },
          ],
        },
        {
          type: 'cards', key: 'products', label: 'Prekių skaičius',
          options: [
            { value: 'Iki 50', label: 'Iki 50 prekių', icon: '🛒' },
            { value: '50–500', label: '50–500 prekių', icon: '🏭' },
            { value: '500+', label: '500+ prekių', icon: '🏢' },
          ],
        },
      ],
    },
    {
      title: 'Mokėjimai ir detalės',
      subtitle: 'Mokėjimo sistemos ir papildomos funkcijos',
      fields: [
        {
          type: 'cards', key: 'payment', label: 'Mokėjimų sistema',
          options: [
            { value: 'Paysera', label: 'Paysera', icon: '🇱🇹', sub: 'Lietuviška, visi bankai' },
            { value: 'Stripe', label: 'Stripe', icon: '💳', sub: 'Tarptautinė, kortelės' },
            { value: 'PayPal', label: 'PayPal', icon: '🅿️', sub: 'Tarptautinė, žinoma' },
            { value: 'Kelios', label: 'Kelios sistemos', icon: '🔄', sub: 'Paysera + Stripe / PayPal' },
          ],
        },
        {
          type: 'textarea', key: 'details', label: 'Papildomos funkcijos',
          placeholder: 'Ar reikia sandėlio valdymo? Integracijos su buhalterine programa? Pristatymo skaičiuoklės? Lojalumo programos?',
          rows: 3,
        },
      ],
    },
    CONTACT_STEP,
  ],
}

// ── Component ──────────────────────────────────────────────────────────────

export default function NewOrderPage() {
  const searchParams = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Pre-select service from URL param ?s=remontas
  useEffect(() => {
    const s = searchParams.get('s')
    if (s && SERVICE_WIZARD[s]) {
      setSelectedId(s)
      setStep(0)
      setValues({})
    }
  }, [searchParams])

  const selectedService = SERVICES.find(s => s.id === selectedId)
  const wizard = selectedId ? SERVICE_WIZARD[selectedId] ?? [] : []
  const currentStep = wizard[step]
  const totalSteps = wizard.length

  function setValue(key: string, val: string) {
    setValues(v => ({ ...v, [key]: val }))
  }

  function isStepValid(): boolean {
    if (!currentStep) return false
    for (const field of currentStep.fields) {
      if (field.required && !values[field.key]?.trim()) return false
    }
    return true
  }

  function buildNotes(): string {
    if (!selectedId) return ''
    const parts: string[] = []
    for (const ws of wizard) {
      for (const field of ws.fields) {
        if (field.key === 'contact' || field.key === 'name') continue
        const val = values[field.key]
        if (val) parts.push(`${field.label}: ${val}`)
      }
    }
    return parts.join('\n')
  }

  function selectService(id: string) {
    setSelectedId(id)
    setStep(0)
    setValues({})
    setError('')
  }

  async function handleNext() {
    if (!isStepValid()) return
    if (step < totalSteps - 1) {
      setStep(s => s + 1)
      return
    }
    // Last step — submit
    if (!selectedService) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const notes = buildNotes()
      const contact = values['contact'] ?? ''
      const name = values['name'] ?? ''
      const fullNotes = notes + (name ? `\n\nVardas: ${name}` : '') + (contact ? `\nKontaktai: ${contact}` : '')

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ service_type: selectedService.name, notes: fullNotes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Serverio klaida')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────

  if (success) {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 16, padding: 48, maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#166534', marginBottom: 8 }}>Užsakymas pateiktas!</div>
          <div style={{ fontSize: 14, color: '#15803d', marginBottom: 6 }}>
            Paslauga: <strong>{selectedService?.name}</strong>
          </div>
          <div style={{ fontSize: 14, color: '#15803d', marginBottom: 28 }}>
            Susisieksime per 24 valandas su {values['contact']}.
          </div>
          <a href="/dashboard/orders"
            style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Peržiūrėti užsakymus →
          </a>
        </div>
      </div>
    )
  }

  // ── Service selection ──────────────────────────────────────────────────

  if (!selectedId) {
    return (
      <div style={{ padding: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: '#0f172a' }}>+ Naujas užsakymas</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Pasirinkite paslaugą, kurią norite užsakyti</p>
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 680 }}>
          {SERVICES.map(s => (
            <button
              type="button"
              key={s.id}
              onClick={() => selectService(s.id)}
              style={{
                padding: '16px 12px', border: '2px solid #e2e8f0',
                borderRadius: 12, background: '#fff',
                cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = '#2563eb'
                el.style.boxShadow = '0 2px 12px rgba(37,99,235,0.12)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = '#e2e8f0'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{s.price}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Wizard ─────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => step === 0 ? setSelectedId(null) : setStep(s => s - 1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, padding: '6px 0', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← {step === 0 ? 'Visos paslaugos' : 'Atgal'}
        </button>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <span style={{ fontSize: 16 }}>{selectedService?.icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedService?.name}</span>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 580, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {currentStep?.title}
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {step + 1} / {totalSteps}
          </span>
        </div>
        <div style={{ height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / totalSteps) * 100}%`,
            background: '#2563eb',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Step card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 32, maxWidth: 580 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{currentStep?.title}</div>
          {currentStep?.subtitle && (
            <div style={{ fontSize: 13, color: '#64748b' }}>{currentStep.subtitle}</div>
          )}
        </div>

        {currentStep?.fields.map(field => (
          <div key={field.key} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              {field.label}
              {field.required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
            </label>

            {field.type === 'input' && (
              <input
                type={field.inputType ?? 'text'}
                value={values[field.key] ?? ''}
                onChange={e => setValue(field.key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={values[field.key] ?? ''}
                onChange={e => setValue(field.key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={field.rows ?? 3}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
              />
            )}

            {field.type === 'select' && (
              <select
                value={values[field.key] ?? ''}
                onChange={e => setValue(field.key, e.target.value)}
                required={field.required}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">— Pasirinkite —</option>
                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}

            {field.type === 'cards' && (
              <div style={{ display: 'grid', gridTemplateColumns: field.options.length <= 3 ? '1fr' : 'repeat(2, 1fr)', gap: 8 }}>
                {field.options.map(o => (
                  <button
                    type="button"
                    key={o.value}
                    onClick={() => setValue(field.key, o.value)}
                    style={{
                      padding: '12px 14px',
                      border: `2px solid ${values[field.key] === o.value ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 10,
                      background: values[field.key] === o.value ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.1s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {o.icon && <span style={{ fontSize: 18 }}>{o.icon}</span>}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: values[field.key] === o.value ? '#1e40af' : '#0f172a' }}>{o.label}</div>
                        {o.sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{o.sub}</div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {field.type === 'checkboxes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {field.options.map(o => {
                  const current = values[field.key] ? values[field.key].split('|') : []
                  const checked = current.includes(o)
                  return (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked ? current.filter(x => x !== o) : [...current, o]
                          setValue(field.key, next.join('|'))
                        }}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                      {o}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={loading || !isStepValid()}
          style={{
            width: '100%',
            background: isStepValid() ? '#2563eb' : '#94a3b8',
            color: '#fff',
            padding: '13px',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading || !isStepValid() ? 'not-allowed' : 'pointer',
            marginTop: 8,
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Siunčiama...' : step < totalSteps - 1 ? 'Toliau →' : 'Pateikti užsakymą →'}
        </button>
      </div>
    </div>
  )
}
