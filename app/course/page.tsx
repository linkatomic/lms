import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, ChevronRight, Lock } from 'lucide-react'
import { COURSE } from '@/lib/course-data'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

const BUILT_LESSONS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])

export default async function CoursePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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

        {COURSE.modules.map((mod, modIndex) => (
          <div key={mod.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Module header */}
            <div className={`bg-gradient-to-r ${mod.color} p-6 text-white`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mod.emoji}</span>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Module {mod.id}</p>
                  <h3 className="font-bold text-lg leading-snug">{mod.title}</h3>
                </div>
                {modIndex > 1 && (
                  <div className="ml-auto flex items-center gap-1 bg-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Coming Soon
                  </div>
                )}
              </div>
            </div>

            {/* Lessons list */}
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {mod.lessons.map((lesson, i) => (
                BUILT_LESSONS.has(lesson.id) ? (
                  <Link
                    key={lesson.id}
                    href={`/course/lesson/${lesson.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition group"
                  >
                    <div className={`w-8 h-8 ${mod.lightColor} rounded-lg flex items-center justify-center text-sm font-bold ${mod.borderColor} border flex-shrink-0`}>
                      {'isQuiz' in lesson && lesson.isQuiz ? '📝' : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-50 text-sm truncate">{lesson.title}</p>
                      {lesson.duration && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lesson.duration}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition flex-shrink-0" />
                  </Link>
                ) : (
                  <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 opacity-50">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-500 dark:text-gray-400 text-sm truncate">{lesson.title}</p>
                      {lesson.duration && <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{lesson.duration}</p>}
                    </div>
                    <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
