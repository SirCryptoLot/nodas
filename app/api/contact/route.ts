import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { name, email, service, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Trūksta laukų' }, { status: 400 })
  }

  await supabase.from('contact_submissions').insert({ name, email, service: service ?? 'Kita', message })

  return NextResponse.json({ ok: true })
}
