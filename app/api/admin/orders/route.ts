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

  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (price !== undefined) updates.price = price
  if (admin_notes !== undefined) updates.admin_notes = admin_notes

  const { data: order, error } = await adminSupabase
    .from('orders').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send email to client only if explicitly requested
  if (sendEmail && order) {
    try {
      const [{ data: profile }, { data: authData }] = await Promise.all([
        adminSupabase.from('profiles').select('full_name').eq('id', order.user_id).single(),
        adminSupabase.auth.admin.getUserById(order.user_id),
      ])
      const userEmail = authData.user?.email
      if (userEmail) {
        // Combine original notes + admin comment for the email
        const emailContent = [
          order.notes,
          client_comment ? `\n💬 Papildoma informacija:\n${client_comment}` : '',
        ].filter(Boolean).join('\n')

        await sendOrderStatusEmail(
          userEmail,
          profile?.full_name ?? 'Klientas',
          order.service_type,
          status ?? order.status,
          emailContent,
          client_comment ?? '',
        )
      }
    } catch (e) {
      console.error('[admin/orders] email error:', e)
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
