'use client'

import { useState } from 'react'
import { Mail, Monitor, Smartphone, Copy, Check } from 'lucide-react'

interface EmailTemplate {
  id: string
  label: string
  description: string
  subject: string
  html: string
  trigger: string
  recipient: string
}

interface Props {
  templates: EmailTemplate[]
}

export default function EmailPreviewClient({ templates }: Props) {
  const [activeId, setActiveId] = useState(templates[0]?.id ?? '')
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)

  const active = templates.find(t => t.id === activeId) ?? templates[0]

  function copySubject() {
    navigator.clipboard.writeText(active.subject)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Template tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-[57px] z-30">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-0.5 py-2 min-w-max">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                  activeId === t.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">

        {/* Meta bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-50">{active.label}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{active.description}</p>
          </div>

          {/* Viewport toggle */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-shrink-0">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewport === 'desktop'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewport === 'mobile'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Trigger:</span>
            {active.trigger}
          </span>
          <span className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">To:</span>
            {active.recipient}
          </span>
        </div>

        {/* Subject line */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex-shrink-0">Subject</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{active.subject}</span>
          </div>
          <button
            onClick={copySubject}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Email preview iframe */}
        <div className="flex justify-center">
          <div
            className="transition-all duration-300 ease-in-out"
            style={{ width: viewport === 'mobile' ? '375px' : '100%' }}
          >
            <div className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${
              viewport === 'mobile' ? 'mx-auto' : ''
            }`}>
              {/* Browser chrome */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 dark:text-gray-500 text-center truncate mx-2">
                  {active.subject}
                </div>
              </div>

              {/* The actual email HTML rendered in iframe */}
              <iframe
                key={`${activeId}-${viewport}`}
                srcDoc={active.html}
                className="w-full border-0 bg-white"
                style={{ height: '680px', display: 'block' }}
                sandbox="allow-same-origin"
                title={`Email preview: ${active.label}`}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
