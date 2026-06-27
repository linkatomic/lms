'use client'

import { useState } from 'react'
import { Share2, Copy, Check, ExternalLink, Eye, Lock } from 'lucide-react'

// Keep in sync with app/preview/[lessonId]/page.tsx whitelist
const SHAREABLE_LESSONS = [
  {
    id: 28,
    title: 'SOP: Payment Methods, Fees & How to Handle Them',
    module: 'Module 3',
    moduleColor: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
]

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition ${
        copied
          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy link
        </>
      )}
    </button>
  )
}

export default function ShareableLinks() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lms-tau-ebon.vercel.app'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 bg-teal-50 dark:bg-teal-950 rounded-xl flex items-center justify-center">
          <Share2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-50">Shareable Lesson Links</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Share these with anyone — no login required to view</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-xs font-bold bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          <Eye className="w-3 h-3" />
          Public
        </span>
      </div>

      {/* Info banner */}
      <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-100 dark:border-amber-900 flex items-start gap-2">
        <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          These links are <strong>public</strong> — anyone with the link can view the content, even without a course account. They are <strong>not visible</strong> in the course module list.
        </p>
      </div>

      {/* Lesson list */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {SHAREABLE_LESSONS.map(lesson => {
          const previewUrl = `${baseUrl}/preview/${lesson.id}`
          return (
            <div key={lesson.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex-shrink-0 ${lesson.moduleColor}`}>
                  {lesson.module}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{lesson.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5 font-mono">{previewUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CopyButton url={previewUrl} />
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          To make additional lessons shareable, add them to the whitelist in{' '}
          <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">app/preview/[lessonId]/page.tsx</code>
        </p>
      </div>
    </div>
  )
}
