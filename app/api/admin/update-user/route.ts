import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const VALID_TEAMS = ['outreach', 'order_processing', 'content', 'seo', 'live_chat']

export async function PATCH(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: { userId?: string; team?: string | null; enrolled_courses?: string[] }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { userId, team, enrolled_courses } = body
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  if (team !== undefined && team !== null && !VALID_TEAMS.includes(team)) {
    return NextResponse.json({ error: 'Invalid team value' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (team !== undefined) update.team = team
  if (enrolled_courses !== undefined) update.enrolled_courses = enrolled_courses.length ? enrolled_courses : ['foundation']

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update(update).eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
