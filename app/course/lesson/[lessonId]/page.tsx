import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import LessonLayout from '@/components/LessonLayout'

// ── Spinner shown while a lesson chunk loads ──────────────────────────────────
function LessonSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-4">
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-5/6" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-4/6" />
      <div className="mt-6 h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-5/6" />
    </div>
  )
}

// ── Each lesson is its own JS chunk — only the active lesson loads ─────────────
// Content lessons: SSR on (good for SEO/first paint)
// Quiz lessons: SSR off (heavy client state, no SEO value)
const LESSON_COMPONENTS: Record<number, React.ComponentType> = {
  1:  dynamic(() => import('@/components/lessons/Lesson1HistoryOverview'),   { loading: LessonSkeleton }),
  2:  dynamic(() => import('@/components/lessons/Lesson2VisionMission'),     { loading: LessonSkeleton }),
  3:  dynamic(() => import('@/components/lessons/Lesson3Goals'),             { loading: LessonSkeleton }),
  4:  dynamic(() => import('@/components/lessons/Lesson4Philosophy'),        { loading: LessonSkeleton }),
  5:  dynamic(() => import('@/components/lessons/Lesson5Departments'),       { loading: LessonSkeleton }),
  6:  dynamic(() => import('@/components/lessons/Lesson6IntroDigitalMarketing'), { loading: LessonSkeleton }),
  7:  dynamic(() => import('@/components/lessons/Lesson7ImportanceFuture'),  { loading: LessonSkeleton }),
  8:  dynamic(() => import('@/components/lessons/Lesson8ContentMarketing'),  { loading: LessonSkeleton }),
  9:  dynamic(() => import('@/components/lessons/Lesson9GuestPosting'),      { loading: LessonSkeleton }),
  10: dynamic(() => import('@/components/lessons/Lesson10Quiz'),             { loading: LessonSkeleton }),
  11: dynamic(() => import('@/components/lessons/Lesson11KeyTerminologies'), { loading: LessonSkeleton }),
  12: dynamic(() => import('@/components/lessons/Lesson12Quiz'),             { loading: LessonSkeleton }),
  13: dynamic(() => import('@/components/lessons/Lesson13KeyTerminologies'), { loading: LessonSkeleton }),
  14: dynamic(() => import('@/components/lessons/Lesson14Quiz'),             { loading: LessonSkeleton }),
  15: dynamic(() => import('@/components/lessons/Lesson15KeyTerminologies'), { loading: LessonSkeleton }),
  16: dynamic(() => import('@/components/lessons/Lesson16Quiz'),             { loading: LessonSkeleton }),
  17: dynamic(() => import('@/components/lessons/Lesson17KeyTerminologies'), { loading: LessonSkeleton }),
  18: dynamic(() => import('@/components/lessons/Lesson18Quiz'),             { loading: LessonSkeleton }),
  19: dynamic(() => import('@/components/lessons/Lesson19KeyTerminologies'), { loading: LessonSkeleton }),
  20: dynamic(() => import('@/components/lessons/Lesson20Quiz'),             { loading: LessonSkeleton }),
  21: dynamic(() => import('@/components/lessons/Lesson21KeyTerminologies'), { loading: LessonSkeleton }),
  22: dynamic(() => import('@/components/lessons/Lesson22Quiz'),             { loading: LessonSkeleton }),
  23: dynamic(() => import('@/components/lessons/Lesson23KeyTerminologies'), { loading: LessonSkeleton }),
  24: dynamic(() => import('@/components/lessons/Lesson24Quiz'),             { loading: LessonSkeleton }),
  25: dynamic(() => import('@/components/lessons/Lesson25GuestPostLinks'),   { loading: LessonSkeleton }),
  26: dynamic(() => import('@/components/lessons/Lesson26KeyServices'),      { loading: LessonSkeleton }),
  27: dynamic(() => import('@/components/lessons/Lesson27Quiz'),             { loading: LessonSkeleton }),
  28: dynamic(() => import('@/components/lessons/Lesson28Playground'),       { loading: LessonSkeleton }),
}

const LESSON_MODULE_MAP: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1,
  6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2,
  16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2,
  25: 3, 26: 3, 27: 3,
  28: 4,
}

const ALWAYS_UNLOCKED_MODULES = new Set([4])

const MODULE_1_LESSONS = [1, 2, 3, 4, 5]
const MODULE_2_LESSONS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
const QUIZ_LESSON_IDS = new Set([10, 12, 14, 16, 18, 20, 22, 24, 27])

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const supabase = await createClient()

  // Run auth + params resolution in parallel
  const [{ data: { user } }, { lessonId }] = await Promise.all([
    supabase.auth.getUser(),
    params,
  ])
  if (!user) redirect('/login')

  const id = parseInt(lessonId)
  const LessonComponent = LESSON_COMPONENTS[id]
  const moduleId = LESSON_MODULE_MAP[id]
  if (!LessonComponent || !moduleId) notFound()

  // Module lock guard — only fetch DB if needed (Module 1 and always-unlocked modules skip)
  if (moduleId > 1 && !ALWAYS_UNLOCKED_MODULES.has(moduleId)) {
    const [{ data: progressRows }, { data: attemptRows }] = await Promise.all([
      supabase.from('lesson_progress').select('lesson_id'),
      supabase.from('quiz_attempts').select('lesson_id'),
    ])
    const done = new Set([
      ...(progressRows ?? []).map((r: { lesson_id: number }) => r.lesson_id),
      ...(attemptRows ?? []).map((r: { lesson_id: number }) => r.lesson_id),
    ])
    if (moduleId === 2 && !MODULE_1_LESSONS.every(l => done.has(l))) redirect('/course')
    if (moduleId === 3 && !MODULE_2_LESSONS.every(l => done.has(l))) redirect('/course')
  }

  // Mark lesson as read before rendering — void/fire-and-forget is unreliable
  // in serverless (Vercel kills the function once the response is sent).
  // (quiz progress is tracked separately via quiz_attempts)
  if (!QUIZ_LESSON_IDS.has(id)) {
    await supabase.from('lesson_progress').upsert(
      { user_id: user.id, lesson_id: id },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
    )
  }

  return (
    <LessonLayout moduleId={moduleId} lessonId={id}>
      <LessonComponent />
    </LessonLayout>
  )
}
