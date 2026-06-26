'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Send, RotateCcw } from 'lucide-react'
import { submitDescriptiveReview } from '@/app/admin/attempt/[attemptId]/actions'

const MARK_OPTIONS = [
  { value: 'correct',   label: 'Correct',   color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300', icon: CheckCircle2 },
  { value: 'partial',   label: 'Partial',   color: 'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300',           icon: AlertTriangle },
  { value: 'incorrect', label: 'Incorrect', color: 'border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300',                     icon: XCircle },
]

interface DescriptiveQuestion {
  index: number
  id: number
  text: string
  hint: string
}

interface ReviewFormProps {
  attemptId: string
  questions: DescriptiveQuestion[]
  answers: Record<string, string>
  existingFeedback?: Record<string, string>
  existingScores?: Record<string, string>
  alreadyReviewed?: boolean
}

export default function ReviewForm({
  attemptId,
  questions,
  answers,
  existingFeedback = {},
  existingScores = {},
  alreadyReviewed = false,
}: ReviewFormProps) {
  const [feedback, setFeedback] = useState<Record<string, string>>(existingFeedback)
  const [scores, setScores] = useState<Record<string, string>>(existingScores)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(alreadyReviewed)
  const [error, setError] = useState('')

  async function handleSubmit() {
    const allScored = questions.every(q => scores[String(q.index)])
    if (!allScored) { setError('Please mark every question before submitting the review.'); return }
    setError('')
    setSaving(true)
    try {
      await submitDescriptiveReview(attemptId, feedback, scores)
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {questions.map(q => {
        const answerKey   = String(q.index)
        const userAnswer  = answers[answerKey]
        const hasAnswer   = userAnswer !== undefined && userAnswer.trim() !== ''
        const mark        = scores[answerKey]
        const markOption  = MARK_OPTIONS.find(m => m.value === mark)

        return (
          <div key={q.index} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Question */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Q{q.id} — Written Answer</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">{q.text}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">Hint: {q.hint}</p>
                </div>
                {markOption && (
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border ${markOption.color}`}>
                    {markOption.label}
                  </span>
                )}
              </div>
            </div>

            {/* User answer */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Student Answer</p>
              {hasAnswer
                ? <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{userAnswer}</p>
                : <p className="text-sm text-gray-300 dark:text-gray-600 italic">No answer provided</p>}
            </div>

            {/* Admin mark + feedback */}
            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Your Mark</p>
                <div className="flex gap-2">
                  {MARK_OPTIONS.map(opt => {
                    const Icon = opt.icon
                    const selected = scores[answerKey] === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => !saved && setScores(prev => ({ ...prev, [answerKey]: opt.value }))}
                        disabled={saved}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition ${
                          selected
                            ? opt.color + ' border-current'
                            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                        } disabled:cursor-default`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  Feedback for Student <span className="normal-case font-normal">(optional)</span>
                </p>
                <textarea
                  value={feedback[answerKey] ?? ''}
                  onChange={e => setFeedback(prev => ({ ...prev, [answerKey]: e.target.value }))}
                  disabled={saved}
                  rows={3}
                  placeholder="Write feedback the student will see..."
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 px-3 py-2.5 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition disabled:opacity-60 disabled:cursor-default resize-none"
                />
              </div>
            </div>
          </div>
        )
      })}

      {/* Submit */}
      {saved ? (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Review submitted</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">The student will see your feedback and their final result.</p>
          </div>
          <button
            onClick={() => setSaved(false)}
            className="ml-auto flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition shadow-sm text-sm"
          >
            {saving ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Saving review...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review &amp; Notify Student
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
