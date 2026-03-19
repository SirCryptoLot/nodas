import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>👤 Profilis</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 480 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>El. paštas</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{user.email}</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Planas</div>
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{profile?.tier ?? 'simple'}</span>
        </div>
        <ProfileForm initialName={profile?.full_name ?? ''} initialPhone={profile?.phone ?? ''} />
      </div>
    </div>
  )
}
