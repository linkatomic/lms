import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, CheckCircle2, XCircle, Clock,
  AlertTriangle, PenLine, ChevronDown,
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'
import { L27_DESC_QUESTIONS } from '@/lib/lesson27-questions'
import type { QuizAttempt } from '@/lib/quiz-attempts'

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

const SCORE_COLORS: Record<string, string> = {
  correct:   'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  partial:   'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  incorrect: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
}

const SCORE_LABELS: Record<string, string> = {
  correct: 'Correct', partial: 'Partial', incorrect: 'Incorrect',
}

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function MyResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: raw } = await supabase
    .from('quiz_attempts')
    .select('*')
    .order('lesson_id', { ascending: true })
    .order('created_at', { ascending: false })

  const attempts = (raw ?? []) as QuizAttempt[]

  const byLesson = new Map<number, QuizAttempt[]>()
  for (const a of attempts) {
    if (!byLesson.has(a.lesson_id)) byLesson.set(a.lesson_id, [])
    byLesson.get(a.lesson_id)!.push(a)
  }

  const totalPassed = attempts.filter(a => a.passed && !a.terminated).length
  const pendingReview = attempts.filter(a => a.review_status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/course" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-50 hidden sm:block">Team Learning Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 py-10 text-white">
          <Link href="/course" className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white text-sm mb-4 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Test Results</h1>
          <p className="text-indigo-200 text-sm">
            {attempts.length} total attempt{attempts.length !== 1 ? 's' : ''} &middot; {totalPassed} passed
            {pendingReview > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" /> {pendingReview} awaiting review
              </span>
            )}
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {attempts.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No test attempts yet.</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Complete a quiz to see your results here.</p>
            <Link href="/course" className="mt-4 inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Go to course →
            </Link>
          </div>
        ) : (
          [...byLesson.entries()].map(([lessonId, lessonAttempts]) => (
            <div key={lessonId} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Lesson header */}
              <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">Lesson {lessonId}</p>
                <h2 className="font-bold text-gray-900 dark:text-gray-50 text-base">{QUIZ_NAMES[lessonId] ?? `Quiz — Lesson ${lessonId}`}</h2>
              </div>

              {/* Attempts */}
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {lessonAttempts.map((attempt, i) => {
                  const attemptNum = lessonAttempts.length - i
                  const isPending  = attempt.review_status === 'pending'
                  const isReviewed = attempt.review_status === 'reviewed'
                  const isL27 = lessonId === 27

                  return (
                    <div key={attempt.id} className="px-6 py-4 space-y-4">
                      {/* Attempt summary row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {attemptNum}
                        </div>

                        {/* Score */}
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-50 tabular-nums">
                          {isL27 ? `MCQ: ${attempt.score}/30` : `${attempt.score}/${attempt.total_questions}`}
                        </span>

                        {/* Pass/fail */}
                        {attempt.terminated ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                            <AlertTriangle className="w-3 h-3" /> Terminated
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

                        {/* Review status (L27 only) */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 animate-pulse">
                            <Clock className="w-3 h-3" /> Written: Awaiting Review
                          </span>
                        )}
                        {isReviewed && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            <PenLine className="w-3 h-3" /> Written: Reviewed
                          </span>
                        )}

                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto tabular-nums">
                          {fmt(attempt.time_used)} &middot; {fmtDate(attempt.created_at)}
                        </span>
                      </div>

                      {/* L27 reviewed feedback */}
                      {isL27 && isReviewed && (
                        <div className="mt-2 space-y-3 border-t border-gray-50 dark:border-gray-800 pt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Written Answer Feedback from Manager</p>
                          {L27_DESC_QUESTIONS.map(q => {
                            const key = String(q.index)
                            const mark = attempt.descriptive_scores?.[key]
                            const fb = attempt.admin_feedback?.[key]
                            const userAns = attempt.answers?.[key]

                            return (
                              <div key={q.index} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden text-sm">
                                {/* Question */}
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/40 flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Q{q.id}</p>
                                    <p className="text-gray-800 dark:text-gray-100 font-medium leading-snug whitespace-pre-wrap">{q.text}</p>
                                  </div>
                                  {mark && (
                                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border ${SCORE_COLORS[mark] ?? ''}`}>
                                      {SCORE_LABELS[mark] ?? mark}
                                    </span>
                                  )}
                                </div>

                                {/* User answer */}
                                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Your Answer</p>
                                  {userAns?.trim()
                                    ? <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{userAns}</p>
                                    : <p className="text-gray-300 dark:text-gray-600 italic">No answer provided</p>}
                                </div>

                                {/* Manager feedback */}
                                {fb?.trim() && (
                                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-violet-50/50 dark:bg-violet-950/30">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400 mb-1">Manager Feedback</p>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{fb}</p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* L27 pending message */}
                      {isL27 && isPending && (
                        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm">
                          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-amber-800 dark:text-amber-300">
                            Your written answers are being reviewed by your manager. Check back here once they have been reviewed to see your feedback and final result.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
