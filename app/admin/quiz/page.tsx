import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { FileText, Users, CheckCircle2, Clock, ChevronRight, PenLine, Shield, ArrowLeft } from 'lucide-react'

const QUIZ_LESSONS = [10, 12, 14, 16, 18, 20, 22, 24, 27]

const QUIZ_NAMES: Record<number, string> = {
  10: 'Test 1 — Digital Marketing Basics',
  12: 'Test 2 — Key Terminologies #1',
  14: 'Test 3 — Key Terminologies #2',
  16: 'Test 4 — Key Terminologies #3',
  18: 'Test 5 — Key Terminologies #4',
  20: 'Test 6 — Key Terminologies #5',
  22: 'Test 7 — Key Terminologies #6',
  24: 'Test 8 — Key Terminologies #7',
  27: 'Final Assessment — MCQ + Written Answers',
}

const QUIZ_MODULE: Record<number, string> = {
  10: 'Module 2', 12: 'Module 2', 14: 'Module 2', 16: 'Module 2',
  18: 'Module 2', 20: 'Module 2', 22: 'Module 2', 24: 'Module 2',
  27: 'Module 3',
}

export default async function QuizAdminPage() {
  const admin = createAdminClient()
  const { data: attempts } = await admin
    .from('quiz_attempts')
    .select('lesson_id, passed, review_status, user_email, created_at')
    .order('created_at', { ascending: false })

  const byLesson = new Map<number, {
    total: number; passed: number; pending: number; reviewed: number
    uniqueUsers: Set<string>
  }>()

  QUIZ_LESSONS.forEach(id => byLesson.set(id, {
    total: 0, passed: 0, pending: 0, reviewed: 0, uniqueUsers: new Set(),
  }))

  for (const a of attempts ?? []) {
    const entry = byLesson.get(a.lesson_id)
    if (!entry) continue
    entry.total++
    if (a.passed) entry.passed++
    if (a.review_status === 'pending') entry.pending++
    if (a.review_status === 'reviewed') entry.reviewed++
    if (a.user_email) entry.uniqueUsers.add(a.user_email)
  }

  const totalPending = [...byLesson.values()].reduce((s, v) => s + v.pending, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-50 text-sm">Admin</span>
          </div>
          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Quiz Attempts</span>
          <div className="ml-auto">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Quiz Attempts Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View all user quiz submissions. Click a quiz to see individual attempts.</p>
        </div>

        {totalPending > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3">
            <PenLine className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              {totalPending} written answer {totalPending === 1 ? 'submission needs' : 'submissions need'} your review.
            </p>
          </div>
        )}

        <div className="grid gap-3">
          {QUIZ_LESSONS.map(lessonId => {
            const entry = byLesson.get(lessonId)!
            const hasWritten = lessonId === 27

            return (
              <Link
                key={lessonId}
                href={`/admin/quiz/${lessonId}`}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                        {QUIZ_MODULE[lessonId]} · Lesson {lessonId}
                      </span>
                      {hasWritten && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold">
                          Written
                        </span>
                      )}
                      {entry.pending > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                          {entry.pending} pending
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-sm leading-snug mb-3">
                      {QUIZ_NAMES[lessonId]}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{entry.total} attempt{entry.total !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{entry.uniqueUsers.size} user{entry.uniqueUsers.size !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{entry.passed} passed</span>
                      </div>
                      {entry.reviewed > 0 && (
                        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                          <PenLine className="w-3.5 h-3.5" />
                          <span>{entry.reviewed} reviewed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 transition flex-shrink-0 mt-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
