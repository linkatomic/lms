import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ChevronRight, Rocket, Shield } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, display_name').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  const firstName = profile?.display_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'there'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-50">Team Learning Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user.email}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Welcome, {firstName}! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Ready to learn? Pick up where you left off.</p>
        </div>

        {/* Course card */}
        <Link href="/course" className="block group">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-48 h-48 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-2">Your Current Course</p>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">Let's Create Foundation!</h2>
                  <p className="text-indigo-100 text-sm max-w-sm leading-relaxed">
                    Everything a new AMRYTT MEDIA team member needs to hit the ground running.
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 group-hover:scale-110 transition-transform">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-0" />
                </div>
                <span className="text-white/80 text-xs font-medium">0% complete</span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex gap-4 text-sm text-indigo-200">
                  <span>3 Modules</span>
                  <span>·</span>
                  <span>27 Lessons</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl group-hover:bg-indigo-50 transition">
                  Start Learning
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Admin panel link — only visible to admins */}
        {isAdmin && (
          <Link href="/admin" className="block group mt-6">
            <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-violet-100 dark:border-violet-900 shadow-sm p-5 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-950 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">Admin Panel</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Create and manage team member accounts</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 transition flex-shrink-0" />
            </div>
          </Link>
        )}

        {/* Quick links to lessons */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">Module 1 — Start Here</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 1, title: 'History & Overview', emoji: '🏢' },
              { id: 2, title: 'Vision, Mission & Core Values', emoji: '🎯' },
              { id: 3, title: 'Goals & Objectives', emoji: '📈' },
              { id: 4, title: 'AMRYTT MEDIA Philosophy', emoji: '💡' },
              { id: 5, title: 'Key Departments', emoji: '👥' },
            ].map(lesson => (
              <Link
                key={lesson.id}
                href={`/course/lesson/${lesson.id}`}
                className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition group"
              >
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-50 text-sm truncate">{lesson.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Lesson {lesson.id}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
