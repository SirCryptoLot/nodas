import { ContactForm } from './_components/ContactForm'

const SERVICES = [
  { icon: '🔧', title: 'Web Remontas', desc: 'Svetainė neveikia? Klaidos, lėtas greitis, nulaužta — sutaisau greitai.', price: 'nuo €39' },
  { icon: '🤖', title: 'AI Svetainė', desc: 'Claude AI sugeneruoja jūsų svetainę pagal aprašymą per 5 minutes.', price: '€149 vienkartinis' },
  { icon: '📦', title: 'WordPress / CMS', desc: 'Pilnai valdoma svetainė su administravimo paneliu.', price: '€349 vienkartinis' },
  { icon: '⚡', title: 'Custom Dev — React, Next.js', desc: 'Individualūs sprendimai verslui.', price: 'Individualus' },
  { icon: '🛡️', title: 'Web SPA priežiūra', desc: 'Mėnesinė priežiūra, monitoringas, backupai, turinio keitimai.', price: '€29–€129/mėn' },
  { icon: '🧠', title: 'AI Sprendimai', desc: 'AI agentai, chatbotai, automatizavimas jūsų verslui.', price: 'Individualus' },
  { icon: '🔍', title: 'SEO', desc: 'Optimizuojame svetainę Google paieškos rezultatams.', price: 'Individualus' },
  { icon: '🖥️', title: 'Serverių diegimas', desc: 'Linux serverių konfigūracija, hosting, domenai.', price: 'Individualus' },
  { icon: '🛒', title: 'El. parduotuvė', desc: 'WooCommerce ar custom e-commerce sprendimai.', price: 'Individualus' },
]

const TRUST_ITEMS = [
  { icon: '🔒', label: 'SSL apsauga' },
  { icon: '⚡', label: 'Greitas atsakas' },
  { icon: '🇱🇹', label: 'Lietuviškas specialistas' },
  { icon: '💳', label: 'Paysera mokėjimai' },
  { icon: '🤖', label: 'AI technologijos' },
]

const TESTIMONIALS = [
  {
    text: 'Kreipiausi dėl sugriuvusios svetainės — Donaldas sutaisė per kelias valandas. Greitas, kompetentingas, aiškiai paaiškina.',
    author: 'Tomas K.',
    role: 'Smulkaus verslo savininkas',
  },
  {
    text: 'Užsakiau AI svetainę ir per dieną jau turėjau pilnai veikiančią svetainę. Fantastiškas rezultatas už tokią kainą!',
    author: 'Rūta M.',
    role: 'Laisvai samdoma dizainerė',
  },
]

export default function Home() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section className="mobile-section" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        padding: '72px 40px 80px',
      }}>
        <div className="mobile-stack mobile-gap-sm" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 400px', gap: 56, alignItems: 'center',
        }}>

          {/* Left column */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.15)', borderRadius: 100,
              padding: '6px 16px', fontSize: 13, color: '#bfdbfe', marginBottom: 20,
            }}>
              🇱🇹 Lietuvos IT specialistas
            </div>

            <h1 className="mobile-hero-title" style={{
              fontSize: 46, fontWeight: 900, color: '#fff',
              lineHeight: 1.15, margin: '0 0 18px', letterSpacing: '-1px',
            }}>
              Jūsų svetainė veikia tobulai.
            </h1>

            <p style={{ fontSize: 17, color: '#bfdbfe', margin: '0 0 24px', lineHeight: 1.65 }}>
              Web remontas, AI svetainės, WordPress, serverių diegimas.
              Greitas, patikimas — nuo <strong style={{ color: '#fff' }}>€39</strong>.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                'Svetainių remontas per 24 val.',
                'AI svetainė per 5 minutes',
                'WordPress ir e-commerce sprendimai',
                'Linux serverių konfigūracija',
                'Mėnesinė SPA priežiūra',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e0f2fe', fontSize: 15 }}>
                  <span style={{ color: '#4ade80', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <a href="#kontaktai" style={{
                background: '#fff', color: '#1e3a8a',
                padding: '13px 28px', borderRadius: 10, fontSize: 15,
                fontWeight: 700, textDecoration: 'none',
              }}>
                Gauti pasiūlymą →
              </a>
              <a href="#paslaugos" style={{
                background: 'rgba(255,255,255,0.12)', color: '#fff',
                padding: '13px 28px', borderRadius: 10, fontSize: 15,
                fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)',
              }}>
                Paslaugos
              </a>
            </div>

            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { value: '50+', label: 'Projektų' },
                { value: '24h', label: 'Atsakymo laikas' },
                { value: '€39', label: 'Nuo' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#93c5fd', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — quick-order card */}
          <div className="mobile-full" style={{
            background: '#fff', borderRadius: 20, padding: 28,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Greitai pradėti</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Pasirinkite paslaugą</div>

            {[
              { icon: '🔧', label: 'Web Remontas', price: 'nuo €39', color: '#fef3c7', badge: '#f59e0b' },
              { icon: '🤖', label: 'AI Svetainė', price: '€149', color: '#ede9fe', badge: '#7c3aed' },
              { icon: '📦', label: 'WordPress', price: '€349', color: '#dcfce7', badge: '#16a34a' },
              { icon: '🛡️', label: 'SPA priežiūra', price: 'nuo €29/mėn', color: '#dbeafe', badge: '#2563eb' },
            ].map(({ icon, label, price, color, badge }) => (
              <a key={label} href="#kontaktai" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 10, background: color,
                marginBottom: 10, textDecoration: 'none',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{icon} {label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: badge, borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap' }}>
                  {price}
                </span>
              </a>
            ))}

            <a href="#kontaktai" style={{
              display: 'block', textAlign: 'center',
              background: '#2563eb', color: '#fff', padding: '13px 0',
              borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', marginTop: 14,
            }}>
              Susisiekti dabar →
            </a>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
              Atsakome per 24 val. · Nemokama konsultacija
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#1e3a8a', padding: '16px 24px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          flexWrap: 'wrap', gap: 20,
        }}>
          {TRUST_ITEMS.map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#bfdbfe', fontSize: 13 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="apie" className="mobile-section" style={{ padding: '80px 40px', background: '#fff' }}>
        <div className="mobile-stack mobile-gap-sm" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        }}>

          {/* SVG — hidden on mobile */}
          <div className="mobile-hide-svg" style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="300" height="240" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="30" width="280" height="180" rx="16" fill="#dbeafe" />
              <rect x="40" y="50" width="240" height="140" rx="10" fill="#1e3a8a" />
              <rect x="56" y="66" width="100" height="8" rx="4" fill="#60a5fa" />
              <rect x="56" y="82" width="160" height="6" rx="3" fill="#3b82f6" opacity="0.6" />
              <rect x="56" y="96" width="140" height="6" rx="3" fill="#3b82f6" opacity="0.4" />
              <rect x="56" y="110" width="80" height="28" rx="6" fill="#2563eb" />
              <rect x="148" y="110" width="80" height="28" rx="6" fill="#1d4ed8" opacity="0.5" />
              <circle cx="220" cy="160" r="30" fill="#60a5fa" opacity="0.3" />
              <text x="210" y="166" fontSize="22" fill="#2563eb">🤖</text>
              <rect x="100" y="218" width="120" height="12" rx="6" fill="#e2e8f0" />
              <rect x="130" y="235" width="60" height="8" rx="4" fill="#cbd5e1" />
            </svg>
          </div>

          {/* Text */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Apie mane
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.2 }}>
              Solo IT specialistas su aistra technologijoms
            </h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: '0 0 14px' }}>
              Sveiki! Aš esu <strong>Donaldas</strong> — nepriklausomas web kūrėjas ir IT specialistas iš Lietuvos.
              Dirbu su klientais tiesiogiai, be tarpininkų.
            </p>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: '0 0 24px' }}>
              Naudoju moderniausias technologijas — <strong>Next.js, React, AI</strong> — kad jūsų projektas
              būtų greitas, modernus ir efektyvus.
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { value: '5+', label: 'Metų patirtis' },
                { value: '50+', label: 'Projektų' },
                { value: '100%', label: 'Patenkintų klientų' },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb' }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="paslaugos" className="mobile-section" style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Paslaugos
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Viskas, ko reikia jūsų verslui
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 10 }}>
              Nuo greito remonto iki pilnų e-commerce sprendimų
            </p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {SERVICES.map(({ icon, title, desc, price }) => (
              <div key={title} style={{
                background: '#fff', borderRadius: 14, padding: 22,
                border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{desc}</div>
                <div style={{
                  display: 'inline-block', background: '#dbeafe', color: '#1e40af',
                  borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 700, alignSelf: 'flex-start',
                }}>
                  {price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="mobile-section" style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Atsiliepimai
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Ką sako klientai
            </h2>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {TESTIMONIALS.map(({ text, author, role }) => (
              <div key={author} style={{
                background: '#f8fafc', borderRadius: 16, padding: 28,
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: 36, color: '#2563eb', marginBottom: 10, lineHeight: 1 }}>&ldquo;</div>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>
                  {text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                  }}>
                    {author[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{author}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: 14, whiteSpace: 'nowrap' }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="kontaktai" className="mobile-section" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Kontaktai
            </div>
            <h2 className="mobile-h2" style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0 }}>
              Pradėkime jūsų projektą
            </h2>
            <p style={{ fontSize: 15, color: '#bfdbfe', marginTop: 12 }}>
              Parašykite — atsakysime per 24 valandas.
            </p>
          </div>

          <ContactForm />

          <div style={{ textAlign: 'center', marginTop: 28, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <a href="mailto:info@nodas.lt" style={{ color: '#93c5fd', fontSize: 14, textDecoration: 'none' }}>
              ✉️ info@nodas.lt
            </a>
            <span style={{ color: '#bfdbfe', fontSize: 14 }}>🇱🇹 Lietuva</span>
            <span style={{ color: '#bfdbfe', fontSize: 14 }}>⚡ Per 24 val.</span>
          </div>
        </div>
      </section>

    </main>
  )
}
