import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { BookOpen, LogIn, Eye, ExternalLink } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

// ── Whitelist — only lessons listed here can be publicly shared ───────────────
const SHAREABLE_LESSONS: Record<number, { title: string; module: string; moduleColor: string }> = {
  28: {
    title: 'SOP: Payment Methods, Fees & How to Handle Them',
    module: 'Module 3 — Introduction to GUESTPOSTLINKS.NET',
    moduleColor: 'from-emerald-500 to-teal-600',
  },
}

// ── Lesson components (only for whitelisted lessons) ─────────────────────────
function PreviewSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-4">
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-5/6" />
    </div>
  )
}

const LESSON_COMPONENTS: Record<number, React.ComponentType> = {
  28: dynamic(() => import('@/components/lessons/Lesson28PaymentSOP'), { loading: PreviewSkeleton }),
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function PreviewPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  const id = parseInt(lessonId)

  const meta = SHAREABLE_LESSONS[id]
  if (!meta) notFound()

  const LessonComponent = LESSON_COMPONENTS[id]
  if (!LessonComponent) notFound()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Minimal header */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-50 hidden sm:block text-sm">AMRYTT MEDIA — Team Learning Hub</span>
              <span className="font-bold text-gray-900 dark:text-gray-50 sm:hidden text-sm">AMRYTT MEDIA</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <Eye className="w-3 h-3" />
              Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Access banner */}
      <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>You&apos;re viewing a shared lesson.</strong> This is not the full course — sign in to access all 29 lessons across 4 modules.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition whitespace-nowrap"
          >
            Sign in for full access
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Lesson header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">{meta.module}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">{meta.title}</h1>
        </div>
      </div>

      {/* Lesson content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <LessonComponent />
      </main>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">
            Want access to the full course?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            The Team Learning Hub has 29 lessons across 4 modules — covering digital marketing, SEO, content writing, and more.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Access Full Course
          </Link>
        </div>
      </div>
    </div>
  )
}
