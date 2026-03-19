import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPayseraPayment } from '@/lib/paysera'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const { items, total, email } = await req.json()
  if (!items?.length) return NextResponse.json({ error: 'Krepšelis tuščias' }, { status: 400 })

  const { data: order, error } = await supabase.from('orders_shop').insert({
    items, total, status: 'pending',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const payseraUrl = createPayseraPayment({
    orderId: order.id,
    amount: Math.round(total * 100),
    currency: 'EUR',
    description: `nodas.lt užsakymas #${order.id.slice(0, 8)}`,
    callbackUrl: `${appUrl}/api/shop/callback`,
    acceptUrl: `${appUrl}/payment/success`,
    cancelUrl: `${appUrl}/payment/cancel`,
    email,
  })

  return NextResponse.json({ payseraUrl, orderId: order.id })
}
