'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { COURSE } from '@/lib/course-data'
import { Users, BookOpen, RefreshCw, Wifi, WifiOff, ClipboardList } from 'lucide-react'

// ── Lesson metadata lookup ────────────────────────────────────────────────────

interface LessonMeta {
  title: string
  moduleTitle: string
  moduleId: number
  moduleColor: string
  isQuiz: boolean
}

const LESSON_META: Record<number, LessonMeta> = {}

for (const mod of COURSE.modules) {
  for (const lesson of mod.lessons) {
    LESSON_META[lesson.id] = {
      title: lesson.title,
      moduleTitle: mod.title,
      moduleId: mod.id,
      moduleColor: mod.color,
      isQuiz: 'isQuiz' in lesson ? !!(lesson as { isQuiz?: boolean }).isQuiz : false,
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 10) return 'Just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

function initials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

const MODULE_BADGE_COLORS: Record<number, string> = {
  1: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  2: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  3: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
}

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-blue-500',
  'from-violet-400 to-purple-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-cyan-400 to-sky-500',
]

function avatarGradient(userId: string) {
  const idx = userId.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ActiveUser {
  userId: string
  lessonId: number
  updatedAt: string
  displayName: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LiveTracker() {
  const [active, setActive]       = useState<ActiveUser[]>([])
  const [loading, setLoading]     = useState(true)
  const [connected, setConnected] = useState(false)
  const [lastAt, setLastAt]       = useState<Date>(new Date())
  const [, setTick]               = useState(0) // for "X min ago" re-renders

  const fetchActive = useCallback(async () => {
    const res = await fetch('/api/admin/tracker')
    if (!res.ok) return
    const json = await res.json()
    setActive(json.active ?? [])
    setLastAt(new Date())
    setLoading(false)
  }, [])

  // Initial fetch + Supabase Realtime subscription + 30s fallback poll
  useEffect(() => {
    fetchActive()

    const supabase = createClient()
    const channel = supabase
      .channel('presence_tracker')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        () => fetchActive(),
      )
      .subscribe(status => setConnected(status === 'SUBSCRIBED'))

    const poll = setInterval(fetchActive, 30_000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(poll)
    }
  }, [fetchActive])

  // Re-render "X min ago" labels every 10s
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 10_000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {active.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                {active.length}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 dark:text-gray-50">Live Tracker</p>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {active.length === 0 ? 'No active users' : `${active.length} user${active.length !== 1 ? 's' : ''} online`}
              {' · '}refreshed {timeAgo(lastAt.toISOString())}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {connected ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Polling</span>
            </div>
          )}
          <button
            onClick={fetchActive}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="px-6 py-16 text-center">
          <RefreshCw className="w-6 h-6 text-gray-300 dark:text-gray-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading active users…</p>
        </div>
      ) : active.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-7 h-7 text-gray-200 dark:text-gray-700" />
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No one is active right now</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
            Users appear here within seconds of opening a lesson
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
          <AnimatePresence initial={false}>
            {active.map(u => {
              const meta = LESSON_META[u.lessonId]
              const secsAgo = (Date.now() - new Date(u.updatedAt).getTime()) / 1000
              const isActive = secsAgo < 90

              return (
                <motion.div
                  key={u.userId}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition"
                >
                  {/* Avatar with online dot */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient(u.userId)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {initials(u.displayName)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
                      isActive ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">
                      {u.displayName || 'Unknown User'}
                    </p>
                    {meta ? (
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${MODULE_BADGE_COLORS[meta.moduleId] ?? MODULE_BADGE_COLORS[1]}`}>
                          M{meta.moduleId}
                        </span>
                        <BookOpen className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {meta.title}
                        </p>
                        {meta.isQuiz && (
                          <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex-shrink-0">
                            Test
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5">Lesson #{u.lessonId}</p>
                    )}
                  </div>

                  {/* Last seen */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {timeAgo(u.updatedAt)}
                    </p>
                    <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">last seen</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
