import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Shield, ArrowLeft, FileText, Clock, Mail, Radio } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'
import AdminDashboard from '@/components/AdminDashboard'
import LiveTracker from '@/components/admin/LiveTracker'

async function QuizAttemptsCard() {
  const admin = createAdminClient()
  const { data: attempts } = await admin
    .from('quiz_attempts')
    .select('lesson_id, review_status')

  const totalAttempts = attempts?.length ?? 0
  const pendingReviews = attempts?.filter(a => a.review_status === 'pending').length ?? 0

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 bg-violet-50 dark:bg-violet-950 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-50">Quiz Attempts</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">All test submissions across all users</p>
        </div>
      </div>
      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalAttempts}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total Attempts</p>
          </div>
          {pendingReviews > 0 && (
            <div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingReviews}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-amber-500" />
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Awaiting Review</p>
              </div>
            </div>
          )}
        </div>
        <Link
          href="/admin/quiz"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          <FileText className="w-4 h-4" />
          View Quiz Attempts
        </Link>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  // Non-admins get silently redirected
  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-50 hidden sm:block">Team Learning Hub</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800">
              <Shield className="w-3 h-3" />
              Admin Panel
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user.email}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-violet-200 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-violet-300" />
            <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest">Admin Panel</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">User Management</h1>
          <p className="text-violet-100 text-sm">Create and manage team member accounts for the LMS.</p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Quick action cards row */}
        <div className="grid sm:grid-cols-3 gap-4">
          <QuizAttemptsCard />

          {/* Live Tracker card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                <Radio className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">Live Tracker</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">See who&apos;s online and on which lesson</p>
              </div>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Updates in real-time</span>
              </div>
              <Link
                href="/admin/tracker"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
              >
                <Radio className="w-4 h-4" />
                View Tracker
              </Link>
            </div>
          </div>

          {/* Email Templates card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">Email Templates</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Preview all automated notification emails</p>
              </div>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex gap-6">
                {[
                  { label: 'Welcome', icon: '👋' },
                  { label: 'Quiz Score', icon: '📊' },
                  { label: 'Review Alert', icon: '📝' },
                  { label: 'Results', icon: '🏆' },
                ].map(t => (
                  <div key={t.label} className="text-center">
                    <p className="text-lg mb-0.5">{t.icon}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/email-preview"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
              >
                <Mail className="w-4 h-4" />
                Preview Emails
              </Link>
            </div>
          </div>
        </div>

        {/* Inline live tracker */}
        <LiveTracker />

        <AdminDashboard adminEmail={user.email!} />
      </main>
    </div>
  )
}
