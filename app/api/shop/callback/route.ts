import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPayseraCallback, parsePayseraCallback } from '@/lib/paysera'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const data = body.get('data') as string
  const sign = body.get('sign') as string

  if (!verifyPayseraCallback(data, sign)) {
    return new Response('Invalid signature', { status: 400 })
  }

  const params = parsePayseraCallback(data)
  if (params.status === '1') {
    await supabase.from('orders_shop').update({ status: 'completed' }).eq('id', params.orderid)
  }

  return new Response('OK')
}
