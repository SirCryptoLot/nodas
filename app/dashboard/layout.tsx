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

  const userName = profile?.full_name
    ?? (user.user_metadata?.full_name as string | undefined)
    ?? (user.user_metadata?.name as string | undefined)
    ?? user.email
    ?? 'Vartotojas'
  const tier = profile?.tier ?? 'simple'

  return (
    <div className="dashboard-layout">
      <DashboardSidebar userName={userName} tier={tier} />
      <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
