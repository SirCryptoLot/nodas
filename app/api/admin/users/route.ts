import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, checkAdmin } from '@/lib/admin'

export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [{ data: profiles }, { data: { users } }] = await Promise.all([
    adminSupabase.from('profiles').select('*').order('created_at', { ascending: false }),
    adminSupabase.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const emailMap = Object.fromEntries(users.map(u => [u.id, u.email ?? '']))
  const enriched = (profiles ?? []).map(p => ({ ...p, email: emailMap[p.id] ?? '' }))

  return NextResponse.json({ users: enriched })
}

export async function PUT(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id, tier, is_admin } = await req.json()
  const updates: Record<string, unknown> = {}
  if (tier !== undefined) updates.tier = tier
  if (is_admin !== undefined) updates.is_admin = is_admin
  const { data, error } = await adminSupabase.from('profiles').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ user: data })
}

export async function DELETE(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await req.json()
  const { error } = await adminSupabase.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
