import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, ChevronRight, Lock, Shield, BarChart2, CheckCircle2 } from 'lucide-react'
import { COURSE } from '@/lib/course-data'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

const BUILT_LESSONS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27])

const MODULE_LESSON_IDS: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  3: [25, 26, 27],
}

export default async function CoursePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: progressRows }, { data: attemptRows }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase.from('lesson_progress').select('lesson_id'),
    supabase.from('quiz_attempts').select('lesson_id'),
  ])
  const isAdmin = profile?.role === 'admin'

  const completedLessons = new Set<number>([
    ...(progressRows ?? []).map((r: { lesson_id: number }) => r.lesson_id),
    ...(attemptRows ?? []).map((r: { lesson_id: number }) => r.lesson_id),
  ])

  // Module unlock state
  const mod1Done = MODULE_LESSON_IDS[1].every(id => completedLessons.has(id))
  const mod2Done = MODULE_LESSON_IDS[2].every(id => completedLessons.has(id))
  const moduleUnlocked: Record<number, boolean> = {
    1: true,
    2: mod1Done,
    3: mod1Done && mod2Done,
  }

  // Progress counts per module
  const modProgress = (modId: number) => ({
    done: MODULE_LESSON_IDS[modId].filter(id => completedLessons.has(id)).length,
    total: MODULE_LESSON_IDS[modId].length,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-50 hidden sm:block">Team Learning Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/my-results" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition">
              <BarChart2 className="w-3 h-3" />
              My Results
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900 transition">
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            )}
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-white">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">Your Training Course</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">{COURSE.title}</h1>
          <p className="text-indigo-100 text-lg max-w-xl">{COURSE.description}</p>
          <div className="mt-6 flex items-center gap-6 text-sm text-indigo-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>3 Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Self-paced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Course Modules</h2>

        {COURSE.modules.map((mod) => {
          const unlocked = moduleUnlocked[mod.id] ?? false
          const { done, total } = modProgress(mod.id)
          const isComplete = done === total

          return (
            <div
              key={mod.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl border shadow-sm overflow-hidden transition ${
                unlocked
                  ? 'border-gray-100 dark:border-gray-800'
                  : 'border-gray-200 dark:border-gray-700 opacity-75'
              }`}
            >
              {/* Module header */}
              <div className={`bg-gradient-to-r ${mod.color} p-6 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mod.emoji}</span>
                  <div className="flex-1">
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Module {mod.id}</p>
                    <h3 className="font-bold text-lg leading-snug">{mod.title}</h3>
                  </div>

                  {/* Status badge */}
                  {!unlocked ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 bg-black/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Locked
                      </div>
                      <p className="text-white/60 text-[10px] font-medium">
                        Complete Module {mod.id - 1} to unlock
                      </p>
                    </div>
                  ) : isComplete ? (
                    <div className="flex items-center gap-1.5 bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/40">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-white/80 text-xs font-semibold">{done}/{total} done</div>
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/70 rounded-full transition-all"
                          style={{ width: `${(done / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lessons list */}
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {mod.lessons.map((lesson, i) => {
                  const isBuilt = BUILT_LESSONS.has(lesson.id)
                  const isDone = completedLessons.has(lesson.id)
                  const isQuiz = 'isQuiz' in lesson && lesson.isQuiz

                  if (!unlocked) {
                    // Module is locked — show all lessons as locked
                    return (
                      <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 opacity-50 cursor-not-allowed">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-500 dark:text-gray-400 text-sm truncate">{lesson.title}</p>
                        </div>
                        <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      </div>
                    )
                  }

                  if (!isBuilt) {
                    return (
                      <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 opacity-40">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-200 dark:border-gray-700 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-500 dark:text-gray-400 text-sm truncate">{lesson.title}</p>
                        </div>
                        <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={lesson.id}
                      href={`/course/lesson/${lesson.id}`}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition group ${
                        isDone ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Badge */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800'
                          : `${mod.lightColor} ${mod.borderColor} border`
                      }`}>
                        {isDone
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          : <span className={`text-sm font-bold ${isDone ? 'text-emerald-600' : ''}`}>{isQuiz ? '📝' : i + 1}</span>
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${
                          isDone
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-gray-900 dark:text-gray-50'
                        }`}>
                          {lesson.title}
                        </p>
                        {isDone && (
                          <p className="text-xs text-emerald-500 dark:text-emerald-500 mt-0.5">Completed</p>
                        )}
                      </div>

                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition ${
                        isDone
                          ? 'text-emerald-300 dark:text-emerald-700 group-hover:text-emerald-500'
                          : 'text-gray-300 dark:text-gray-600 group-hover:text-indigo-500'
                      }`} />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
