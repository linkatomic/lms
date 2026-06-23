import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Verify the caller is an admin
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse and validate body
  let body: { display_name?: string; email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { display_name, email, password } = body

  if (!display_name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Display name, email, and password are all required.' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Create the auth user — email_confirm: true skips the confirmation email entirely
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  // Insert their profile row
  const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: created.user.id, display_name: display_name.trim(), role: 'user' })

  if (profileError) {
    // Roll back: remove the auth user so we don't leave orphans
    await admin.auth.admin.deleteUser(created.user.id)
    return NextResponse.json({ error: 'Failed to create profile: ' + profileError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    user: { id: created.user.id, email: created.user.email, display_name: display_name.trim() },
  })
}
