'use client'

import { useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { setAttemptLimit } from '@/app/admin/quiz/[lessonId]/actions'

interface AttemptLimitEditorProps {
  userId: string
  lessonId: number
  currentLimit: number
}

export default function AttemptLimitEditor({ userId, lessonId, currentLimit }: AttemptLimitEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentLimit)
  const [saving, setSaving] = useState(false)
  const [displayed, setDisplayed] = useState(currentLimit)

  async function handleSave() {
    if (value < 1 || value > 20) return
    setSaving(true)
    try {
      await setAttemptLimit(userId, lessonId, value)
      setDisplayed(value)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setValue(displayed)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={1}
          max={20}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="w-14 text-sm text-center rounded-lg border border-violet-300 dark:border-violet-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
        />
        <span className="text-xs text-gray-400">attempts</span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={handleCancel}
          className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition group"
    >
      <span className="font-semibold tabular-nums">{displayed}</span>
      <span>attempt{displayed !== 1 ? 's' : ''} allowed</span>
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
    </button>
  )
}
