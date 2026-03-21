import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export const ADMIN_EMAILS = ['tadasvwow066@gmail.com', 'info@nodas.lt']

export async function checkAdmin(req: NextRequest): Promise<boolean> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return false
  const { data: { user } } = await adminSupabase.auth.getUser(token)
  if (!user) return false
  if (ADMIN_EMAILS.includes(user.email ?? '')) return true
  const { data } = await adminSupabase.from('profiles').select('is_admin').eq('id', user.id).single()
  return data?.is_admin === true
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await adminSupabase.from('profiles').select('is_admin').eq('id', userId).single()
  return data?.is_admin === true
}
