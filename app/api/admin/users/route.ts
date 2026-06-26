import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

async function getCallerRole() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return data?.role ?? null
}

export async function GET() {
  const role = await getCallerRole()
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()

  const [{ data: authData, error: authError }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('profiles').select('*'),
  ])

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

  const merged = (authData?.users ?? []).map(u => {
    const p = profiles?.find(p => p.id === u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      display_name: p?.display_name ?? '',
      role: p?.role ?? 'user',
      team: p?.team ?? null,
      enrolled_courses: p?.enrolled_courses ?? ['foundation'],
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at ?? null,
    }
  })

  // Sort: admins first, then alphabetically by email
  merged.sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (b.role === 'admin' && a.role !== 'admin') return 1
    return a.email.localeCompare(b.email)
  })

  return NextResponse.json({ users: merged })
}
