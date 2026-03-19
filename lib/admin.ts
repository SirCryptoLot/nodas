import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single()
  return data?.is_admin === true
}
