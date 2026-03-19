import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')

  // OAuth error or missing code — redirect back to login
  if (errorParam || !code) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  // Exchange failed — redirect back to login
  if (error) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
