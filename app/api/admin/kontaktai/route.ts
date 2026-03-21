import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, checkAdmin } from '@/lib/admin'

export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { data } = await adminSupabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json({ submissions: data ?? [] })
}

export async function DELETE(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await req.json()
  const { error } = await adminSupabase.from('contact_submissions').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
