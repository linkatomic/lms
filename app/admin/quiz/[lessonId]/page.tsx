import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, CheckCircle2, XCircle, Clock, Shield, PenLine, AlertTriangle } from 'lucide-react'
import AttemptLimitEditor from '@/components/admin/AttemptLimitEditor'

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

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export default async function QuizAttemptListPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId: lessonIdStr } = await params
  const lessonId = parseInt(lessonIdStr)
  if (!QUIZ_NAMES[lessonId]) notFound()

  const admin = createAdminClient()
  const [{ data: attempts }, { data: limitRows }] = await Promise.all([
    admin.from('quiz_attempts').select('*').eq('lesson_id', lessonId).order('created_at', { ascending: false }),
    admin.from('quiz_attempt_limits').select('user_id,max_attempts').eq('lesson_id', lessonId),
  ])
  const limitByUser = Object.fromEntries((limitRows ?? []).map(r => [r.user_id, r.max_attempts]))

  const hasWritten = lessonId === 27
  const pendingCount = attempts?.filter(a => a.review_status === 'pending').length ?? 0

  const byUser = new Map<string, typeof attempts>()
  for (const a of attempts ?? []) {
    const key = a.user_email ?? a.user_id
    if (!byUser.has(key)) byUser.set(key, [])
    byUser.get(key)!.push(a)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-2 text-sm">
          <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition">Admin</Link>
          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
          <Link href="/admin/quiz" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition">Quiz Attempts</Link>
          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">Lesson {lessonId}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start gap-4">
          <Link href="/admin/quiz" className="mt-1 p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">Lesson {lessonId}</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">{QUIZ_NAMES[lessonId]}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {attempts?.length ?? 0} total attempt{(attempts?.length ?? 0) !== 1 ? 's' : ''} &middot; {byUser.size} user{byUser.size !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              {pendingCount} attempt{pendingCount !== 1 ? 's have' : ' has'} written answers waiting for your review.
            </p>
          </div>
        )}

        {byUser.size === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No attempts yet for this quiz.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...byUser.entries()].map(([userKey, userAttempts]) => (
              <div key={userKey} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {/* User header */}
                <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    {userKey.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{userKey}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{userAttempts!.length} attempt{userAttempts!.length !== 1 ? 's' : ''} taken</p>
                  </div>
                  <AttemptLimitEditor
                    userId={userAttempts![0].user_id}
                    lessonId={lessonId}
                    currentLimit={limitByUser[userAttempts![0].user_id] ?? 5}
                  />
                </div>

                {/* Attempts */}
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {userAttempts!.map((attempt, i) => {
                    const isPending  = attempt.review_status === 'pending'
                    const isReviewed = attempt.review_status === 'reviewed'

                    return (
                      <Link
                        key={attempt.id}
                        href={`/admin/attempt/${attempt.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500">
                          {userAttempts!.length - i}
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-50 tabular-nums">
                            {attempt.score}/{attempt.total_questions}
                          </span>
                          {attempt.terminated ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                              Terminated
                            </span>
                          ) : attempt.passed ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 animate-pulse">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {isReviewed && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                              <PenLine className="w-3 h-3" /> Reviewed
                            </span>
                          )}
                          {attempt.terminated && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                              <AlertTriangle className="w-3 h-3 text-amber-500" /> Tab violations
                            </span>
                          )}
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto tabular-nums">
                            {fmt(attempt.time_used)} used &middot; {new Date(attempt.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 transition flex-shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
