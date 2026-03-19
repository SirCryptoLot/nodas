import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')

  if (errorParam || !code) return NextResponse.redirect(`${origin}/auth/login`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/auth/login`)

  // Send welcome email for new users
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('created_at').eq('id', user.id).single()
      const isNewUser = profile && (Date.now() - new Date(profile.created_at).getTime()) < 30000
      if (isNewUser) {
        const { sendWelcomeEmail, sendAdminNewUser } = await import('@/lib/email')
        const name = (user.user_metadata?.full_name as string) ?? user.email ?? 'Vartotojas'
        await Promise.allSettled([
          sendWelcomeEmail(user.email!, name),
          sendAdminNewUser(name, user.email!),
        ])
      }
    }
  } catch { /* email failure non-fatal */ }

  return NextResponse.redirect(`${origin}/dashboard`)
}
