import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard/DashboardClient'
import { COURSE } from '@/lib/course-data'

const TOTAL_LESSONS = COURSE.modules.flatMap(m => m.lessons).length // 27
const QUIZ_IDS = new Set([10, 12, 14, 16, 18, 20, 22, 24, 27])

// Find the next lesson to continue (first not yet completed)
function findNextLesson(completedIds: Set<number>) {
  for (const mod of COURSE.modules) {
    for (const lesson of mod.lessons) {
      if (!completedIds.has(lesson.id)) {
        return { lesson, mod }
      }
    }
  }
  return null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: progressRows },
    { data: attemptRows },
  ] = await Promise.all([
    supabase.from('profiles').select('role, display_name, team').eq('id', user.id).single(),
    supabase.from('lesson_progress').select('lesson_id'),
    supabase.from('quiz_attempts').select('lesson_id, score, total_questions, passed'),
  ])

  const isAdmin = profile?.role === 'admin'
  const firstName = profile?.display_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'there'
  const team = profile?.team ?? null

  const completedLessonIds = new Set<number>([
    ...(progressRows ?? []).map((r: { lesson_id: number }) => r.lesson_id),
    ...(attemptRows ?? []).map((r: { lesson_id: number }) => r.lesson_id),
  ])

  const lessonsRead = (progressRows ?? []).length
  const testsTaken = new Set((attemptRows ?? []).map((r: { lesson_id: number }) => r.lesson_id)).size
  const testsPassed = (attemptRows ?? []).filter((r: { passed: boolean }) => r.passed).length

  const scores = (attemptRows ?? [])
    .filter((r: { total_questions: number }) => r.total_questions > 0)
    .map((r: { score: number; total_questions: number }) => Math.round((r.score / r.total_questions) * 100))
  const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0

  const progressPct = Math.round((completedLessonIds.size / TOTAL_LESSONS) * 100)

  const currentModuleId = (() => {
    for (const mod of [...COURSE.modules].reverse()) {
      if (mod.lessons.some(l => completedLessonIds.has(l.id))) return mod.id
    }
    return 1
  })()

  const nextItem = findNextLesson(completedLessonIds)

  return (
    <DashboardClient
      firstName={firstName}
      email={user.email ?? ''}
      team={team}
      isAdmin={isAdmin}
      stats={{
        lessonsRead,
        testsTaken,
        testsPassed,
        avgScore,
        progressPct,
        completedCount: completedLessonIds.size,
        totalLessons: TOTAL_LESSONS,
        currentModuleId,
      }}
        completedLessonIds={[...completedLessonIds]}
      nextLesson={nextItem ? {
        id: nextItem.lesson.id,
        title: nextItem.lesson.title,
        moduleTitle: nextItem.mod.title,
        moduleId: nextItem.mod.id,
        isQuiz: 'isQuiz' in nextItem.lesson && !!nextItem.lesson.isQuiz,
      } : null}
    />
  )
}
