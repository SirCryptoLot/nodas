import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: sites }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('generated_sites').select('id, name, subdomain, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('orders').select('id, service_type, status, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <ProfileClient
      email={user.email ?? ''}
      profile={profile}
      sites={sites ?? []}
      recentOrders={orders ?? []}
    />
  )
}
