'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react'
import { COURSE } from '@/lib/course-data'
import ThemeToggle from '@/components/ThemeToggle'
import LessonPresenceTracker from '@/components/LessonPresenceTracker'

interface LessonLayoutProps {
  moduleId: number
  lessonId: number
  children: React.ReactNode
}

export default function LessonLayout({ moduleId, lessonId, children }: LessonLayoutProps) {
  const router = useRouter()
  const mod = COURSE.modules.find(m => m.id === moduleId)!
  const lessons = mod.lessons
  const currentIndex = lessons.findIndex(l => l.id === lessonId)
  const currentLesson = lessons[currentIndex]
  const prevLesson = lessons[currentIndex - 1]
  const nextLesson = lessons[currentIndex + 1]
  const progress = Math.round(((currentIndex + 1) / lessons.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Silent presence heartbeat — tells admin tracker which lesson is open */}
      <LessonPresenceTracker lessonId={lessonId} />

      {/* Top nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/course" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition text-sm">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to course</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{mod.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {lessons.length}
            </span>
            <ThemeToggle />
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div
            className="h-1 bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      {/* Lesson title header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wide mb-2">
            <span>Lesson {currentIndex + 1}</span>
            {currentLesson.duration && (
              <>
                <span>·</span>
                <span>{currentLesson.duration}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">{currentLesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Bottom navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
          {prevLesson ? (
            <Link
              href={`/course/lesson/${prevLesson.id}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">{prevLesson.title}</span>
            </Link>
          ) : <div />}

          {nextLesson ? (
            <Link
              href={`/course/lesson/${nextLesson.id}`}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition active:scale-95"
            >
              <span>Next: {nextLesson.title}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/course"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Module!</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
