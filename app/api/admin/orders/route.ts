import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, checkAdmin } from '@/lib/admin'
import { sendOrderStatusEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: orders } = await adminSupabase
    .from('orders')
    .select('*, profiles(full_name, phone)')
    .order('created_at', { ascending: false })

  const { data: { users } } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(users.map(u => [u.id, u.email ?? '']))

  const enriched = (orders ?? []).map(o => ({
    ...o,
    user_email: emailMap[o.user_id] ?? '',
    user_name: (o.profiles as { full_name: string | null } | null)?.full_name ?? '',
  }))

  return NextResponse.json({ orders: enriched })
}

export async function PUT(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id, status, price, admin_notes, client_comment, sendEmail } = await req.json()

  // Build update — only include fields that have values
  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (price !== null && price !== undefined) updates.price = price

  // Try with admin_notes first; if column doesn't exist, retry without it
  if (admin_notes !== undefined) updates.admin_notes = admin_notes

  let result = await adminSupabase
    .from('orders').update(updates).eq('id', id).select().single()

  // Fallback: admin_notes column may not exist in schema
  if (result.error && admin_notes !== undefined) {
    const safeUpdates = { ...updates }
    delete safeUpdates.admin_notes
    result = await adminSupabase
      .from('orders').update(safeUpdates).eq('id', id).select().single()
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  const order = result.data

  // Send email to client only when explicitly requested
  if (sendEmail && order) {
    try {
      const [{ data: profile }, { data: authData }] = await Promise.all([
        adminSupabase.from('profiles').select('full_name').eq('id', order.user_id).single(),
        adminSupabase.auth.admin.getUserById(order.user_id),
      ])
      const userEmail = authData.user?.email
      if (userEmail) {
        await sendOrderStatusEmail(
          userEmail,
          profile?.full_name ?? 'Klientas',
          order.service_type,
          status ?? order.status,
          order.notes ?? '',
          client_comment ?? '',
        )
      }
    } catch (e) {
      console.error('[admin/orders] email error:', e)
      // Don't fail the whole request if only email fails
    }
  }

  return NextResponse.json({ order })
}

export async function DELETE(req: NextRequest) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await req.json()
  const { error } = await adminSupabase.from('orders').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
