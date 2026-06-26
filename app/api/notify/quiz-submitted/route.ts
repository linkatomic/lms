import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { sendEmail, quizSubmittedAdminEmail, assessmentPendingAdminEmail } from '@/lib/gmail'
import { COURSE } from '@/lib/course-data'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function getLessonTitle(lessonId: number): string {
  for (const mod of COURSE.modules) {
    const lesson = mod.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson.title
  }
  return `Lesson ${lessonId}`
}

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { lessonId: number; score: number; totalQuestions: number; passed: boolean; needsReview?: boolean }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { lessonId, score, totalQuestions, passed, needsReview } = body

  // Get user display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const userName = profile?.display_name ?? user.email ?? 'Team Member'

  // Find admin emails using admin client (bypasses RLS)
  const admin = createAdminClient()
  const { data: adminProfiles } = await admin
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  // Get emails via auth admin for each admin profile
  const adminEmails: string[] = []
  for (const ap of adminProfiles ?? []) {
    const { data: adminUser } = await admin.auth.admin.getUserById(ap.id)
    if (adminUser?.user?.email) adminEmails.push(adminUser.user.email)
  }

  // Fallback to env variable
  if (adminEmails.length === 0 && process.env.ADMIN_EMAIL) {
    adminEmails.push(process.env.ADMIN_EMAIL)
  }

  if (adminEmails.length === 0) {
    return NextResponse.json({ ok: true, note: 'No admin emails found' })
  }

  const lessonTitle = getLessonTitle(lessonId)
  const reviewUrl = `${APP_URL}/admin/quiz/${lessonId}`
  const submittedAt = new Date().toLocaleString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  // Send to all admins
  await Promise.all(adminEmails.map(adminEmail => {
    if (needsReview) {
      return sendEmail(
        adminEmail,
        `📝 ${userName} submitted Final Assessment — Review Required`,
        assessmentPendingAdminEmail({
          userName,
          userEmail: user.email ?? '',
          lessonId,
          lessonTitle,
          reviewUrl,
          submittedAt,
        }),
      )
    }
    return sendEmail(
      adminEmail,
      `📊 ${userName} completed ${lessonTitle}`,
      quizSubmittedAdminEmail({
        userName,
        userEmail: user.email ?? '',
        lessonId,
        lessonTitle,
        score,
        totalQuestions,
        passed,
        reviewUrl,
      }),
    )
  }))

  return NextResponse.json({ ok: true })
}
