import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Shield, ArrowLeft, Radio } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import LogoutButton from '@/components/LogoutButton'
import LiveTracker from '@/components/admin/LiveTracker'

export default async function TrackerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

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
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Radio className="w-6 h-6 text-emerald-300" />
            <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest">Live Tracker</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Who&apos;s Learning Right Now</h1>
          <p className="text-emerald-100 text-sm">Real-time view of active users and their current lessons. Updates automatically.</p>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <LiveTracker />
      </main>
    </div>
  )
}
