import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (callerProfile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: { userId?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { userId } = body
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  if (userId === user.id) return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })

  const admin = createAdminClient()

  // Safety check — never delete another admin
  const { data: targetProfile } = await admin.from('profiles').select('role').eq('id', userId).single()
  if (targetProfile?.role === 'admin') return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 400 })

  // Delete auth user — Supabase cascades to profiles if FK is ON DELETE CASCADE
  // Also manually delete profile in case cascade isn't set up
  await admin.from('profiles').delete().eq('id', userId)
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
