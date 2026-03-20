import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmEmail, sendAdminNewOrder } from '@/lib/email'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return NextResponse.json({ orders: data })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { service_type, notes, price } = await req.json()
  if (!service_type) return NextResponse.json({ error: 'service_type privalomas' }, { status: 400 })

  const { data, error } = await supabase.from('orders').insert({
    user_id: user.id, service_type, notes, price,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send emails (non-blocking)
  try {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    const userName = profile?.full_name ?? user.email ?? 'Vartotojas'
    await Promise.all([
      sendOrderConfirmEmail(user.email!, userName, service_type),
      sendAdminNewOrder(service_type, userName),
    ])
  } catch (emailErr) {
    console.error('[orders] email send failed:', emailErr)
  }

  return NextResponse.json({ order: data })
}
