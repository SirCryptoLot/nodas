import { createClient } from '@/lib/supabase/server'
import type { GeneratedSite } from '@/lib/types'

export default async function AdminSitesPage() {
  const supabase = await createClient()
  const { data: sites } = await supabase.from('generated_sites').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>🌐 Visos svetainės</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sites?.map((s: GeneratedSite) => (
          <div key={s.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.subdomain}.nodas.lt</div>
            </div>
            <a href={`https://${s.subdomain}.nodas.lt`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontSize: 13 }}>Atidaryti ↗</a>
          </div>
        ))}
      </div>
    </div>
  )
}
