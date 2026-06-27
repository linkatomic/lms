import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { lessonId?: number }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { lessonId } = body
  if (!lessonId || typeof lessonId !== 'number') {
    return NextResponse.json({ error: 'lessonId required' }, { status: 400 })
  }

  await supabase.from('user_presence').upsert(
    { user_id: user.id, lesson_id: lessonId, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )

  return NextResponse.json({ ok: true })
}
