import Link from 'next/link'
import { ArrowLeft, BookOpen, Shield, Mail } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmailPreviewClient from '@/components/admin/EmailPreviewClient'
import {
  welcomeEmail,
  quizSubmittedAdminEmail,
  assessmentPendingAdminEmail,
  reviewCompleteUserEmail,
} from '@/lib/gmail'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default async function EmailPreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Generate all template previews with sample data
  const templates = [
    {
      id: 'welcome',
      label: 'Welcome Email',
      description: 'Sent to new users when their account is created',
      trigger: 'Admin creates a new user',
      recipient: 'New user',
      subject: 'Welcome to Team Learning Hub — Your Login Details',
      html: welcomeEmail({
        displayName: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        password: 'SecurePass123!',
        loginUrl: `${APP_URL}/login`,
        team: 'content',
      }),
    },
    {
      id: 'quiz-score',
      label: 'Quiz Score (Admin)',
      description: 'Sent to all admins when a user completes an MCQ quiz',
      trigger: 'User submits any quiz (Lesson 10–24)',
      recipient: 'All admins',
      subject: '📊 Alex Johnson completed Content Marketing Quiz',
      html: quizSubmittedAdminEmail({
        userName: 'Alex Johnson',
        userEmail: 'alex.johnson@example.com',
        lessonId: 12,
        lessonTitle: 'Content Marketing Quiz',
        score: 9,
        totalQuestions: 10,
        passed: true,
        reviewUrl: `${APP_URL}/admin/quiz/12`,
      }),
    },
    {
      id: 'assessment-pending',
      label: 'Final Assessment (Admin)',
      description: 'Sent to all admins when a user submits the Final Assessment (Lesson 27)',
      trigger: 'User submits Lesson 27 Final Assessment',
      recipient: 'All admins',
      subject: '📝 Alex Johnson submitted Final Assessment — Review Required',
      html: assessmentPendingAdminEmail({
        userName: 'Alex Johnson',
        userEmail: 'alex.johnson@example.com',
        lessonId: 27,
        lessonTitle: 'Final Assessment',
        reviewUrl: `${APP_URL}/admin/quiz/27`,
        submittedAt: new Date().toLocaleString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
      }),
    },
    {
      id: 'review-complete',
      label: 'Results Ready (User)',
      description: 'Sent to the user after admin reviews their Final Assessment',
      trigger: 'Admin submits review in the attempt detail page',
      recipient: 'User who submitted the test',
      subject: 'Your results for Lesson 27 are ready',
      html: reviewCompleteUserEmail({
        userName: 'Alex Johnson',
        lessonId: 27,
        lessonTitle: 'Final Assessment',
        score: 34,
        totalQuestions: 40,
        passed: true,
        feedback: 'Excellent work on the SEO and content marketing sections. Your explanation of backlink strategies showed a deep understanding. Keep up the great effort!',
        resultsUrl: `${APP_URL}/my-results`,
      }),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-50 hidden sm:block">Team Learning Hub</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800">
              <Shield className="w-3 h-3" />
              Admin
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 dark:text-gray-500 hidden sm:block">{user.email}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-violet-200 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <Mail className="w-5 h-5 text-violet-300" />
            <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest">Email Templates</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Email Preview</h1>
          <p className="text-violet-200 text-sm">Preview all automated email notifications with real sample data.</p>
        </div>
      </div>

      <EmailPreviewClient templates={templates} />
    </div>
  )
}
