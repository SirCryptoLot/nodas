import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, checkAdmin } from '@/lib/admin'
import { sendInvoiceEmail } from '@/lib/email'

async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const { count } = await adminSupabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .like('invoice_number', `${year}/%`)
  const n = ((count ?? 0) + 1).toString().padStart(3, '0')
  return `${year}/${n}`
}

export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { data } = await adminSupabase
    .from('invoices').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ invoices: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const invoice_number = await nextInvoiceNumber()
  const { data, error } = await adminSupabase
    .from('invoices')
    .insert({ ...body, invoice_number })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoice: data })
}

export async function PUT(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id, sendEmail, ...updates } = await req.json()

  if (sendEmail) updates.sent_at = new Date().toISOString()

  const { data, error } = await adminSupabase
    .from('invoices').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (sendEmail && data) {
    try {
      await sendInvoiceEmail(data)
    } catch (e) {
      console.error('[saskaitos] email error:', e)
    }
  }

  return NextResponse.json({ invoice: data })
}

export async function DELETE(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await req.json()
  const { error } = await adminSupabase.from('invoices').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
