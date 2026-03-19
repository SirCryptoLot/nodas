import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ subdomain?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { subdomain } = await searchParams
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
