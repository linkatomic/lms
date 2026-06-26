'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, Shield, ChevronRight, BarChart2, ArrowRight,
  Layers, Trophy, Target, Zap, CheckCircle2,
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

// ── Team colors ──────────────────────────────────────────────────────────────
const TEAM_META: Record<string, { label: string; color: string; bg: string }> = {
  outreach:         { label: 'Outreach',         color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  order_processing: { label: 'Order Processing', color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20' },
  content:          { label: 'Content',          color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  seo:              { label: 'SEO',              color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  live_chat:        { label: 'Live Chat',        color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
}

// ── Greeting ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, delay = 0) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf: number
    let start: number | null = null
    const timeout = setTimeout(() => {
      function step(ts: number) {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        if (ref.current) ref.current.textContent = Math.round(eased * target).toString()
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf) }
  }, [target, duration, delay])
  return ref
}

// ── Lenis smooth scroll ───────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    let lenis: import('lenis').default | null = null
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      function raf(time: number) {
        lenis?.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })
    return () => { lenis?.destroy() }
  }, [])
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, suffix = '', color, delay,
}: {
  icon: React.ElementType; label: string; value: number; suffix?: string; color: string; delay: number
}) {
  const numRef = useCountUp(value, 900, delay)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-sm p-5 group hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex items-end gap-1">
        <span ref={numRef} className="text-3xl font-black text-white dark:text-white tracking-tight">0</span>
        {suffix && <span className="text-lg font-bold text-white/50 mb-0.5">{suffix}</span>}
      </div>
      <p className="text-[13px] text-white/40 dark:text-white/40 mt-1 font-medium">{label}</p>

      {/* subtle glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ${color.replace('bg-', 'bg-').replace('/15', '/5')} pointer-events-none`} />
    </motion.div>
  )
}

// ── Props type ────────────────────────────────────────────────────────────────
interface Props {
  firstName: string
  email: string
  team: string | null
  isAdmin: boolean
  completedLessonIds: number[]
  stats: {
    lessonsRead: number
    testsTaken: number
    testsPassed: number
    avgScore: number
    progressPct: number
    completedCount: number
    totalLessons: number
    currentModuleId: number
  }
  nextLesson: {
    id: number
    title: string
    moduleTitle: string
    moduleId: number
    isQuiz: boolean
  } | null
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardClient({ firstName, email, team, isAdmin, completedLessonIds, stats, nextLesson }: Props) {
  const completedSet = new Set(completedLessonIds)
  useLenis()
  const teamMeta = team ? TEAM_META[team] : null

  const statCards = [
    { icon: BookOpen,     label: 'Lessons Completed', value: stats.completedCount, suffix: `/${stats.totalLessons}`, color: 'bg-indigo-500/15 text-indigo-400' },
    { icon: Target,       label: 'Tests Taken',        value: stats.testsTaken,    suffix: '',                         color: 'bg-violet-500/15 text-violet-400' },
    { icon: Trophy,       label: 'Tests Passed',       value: stats.testsPassed,   suffix: '',                         color: 'bg-emerald-500/15 text-emerald-400' },
    { icon: Zap,          label: 'Avg. Score',         value: stats.avgScore,      suffix: '%',                        color: 'bg-amber-500/15 text-amber-400' },
  ]

  return (
    <div className="min-h-dvh bg-[#07080F] dark:bg-[#07080F] text-white overflow-x-hidden">

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-violet-600/[0.06] blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/[0.05] blur-[90px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="relative z-40 border-b border-white/[0.06] bg-[#07080F]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">Team Learning Hub</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {teamMeta && (
              <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${teamMeta.bg} ${teamMeta.color}`}>
                {teamMeta.label}
              </span>
            )}
            <span className="text-xs text-white/30 hidden sm:block">{email}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">

        {/* ── Welcome header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="text-white/30 text-sm font-medium mb-1 tracking-wide">{getGreeting()}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {firstName}
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">✦</span>
            </h1>
            <p className="text-white/35 text-sm mt-2 font-medium">
              {stats.completedCount === 0
                ? "Let's get your learning journey started."
                : stats.progressPct >= 100
                  ? "You've completed the course. Amazing work!"
                  : `You're ${stats.progressPct}% through your foundation course.`
              }
            </p>
          </div>

          {/* Quick nav links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/my-results" className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white/60 hover:text-white transition-all duration-200">
              <BarChart2 className="w-3.5 h-3.5" />
              My Results
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 hover:text-violet-300 transition-all duration-200">
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── Stats grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((card, i) => (
            <StatCard key={card.label} {...card} delay={100 + i * 80} />
          ))}
        </div>

        {/* ── Course progress + Continue ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-4">

          {/* Course progress card — spans 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <Link href="/course" className="block group h-full">
              <div className="relative overflow-hidden rounded-2xl h-full min-h-[200px] bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-violet-700/90 border border-white/10 p-7 shadow-2xl shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all duration-500 hover:-translate-y-0.5">
                {/* Decorative glow orbs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-indigo-200/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5">Your Course</p>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        Let&apos;s Create Foundation!
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-indigo-200/60 font-medium">Overall Progress</span>
                      <span className="text-xs font-bold text-white">{stats.progressPct}%</span>
                    </div>
                    <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full shadow-sm shadow-white/30"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressPct}%` }}
                        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-xs text-indigo-200/60 font-medium">
                      <span>{stats.completedCount}/{stats.totalLessons} lessons</span>
                      <span>·</span>
                      <span>Module {stats.currentModuleId} of 3</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white text-indigo-700 font-bold text-xs px-4 py-2 rounded-xl group-hover:bg-indigo-50 group-hover:gap-2 transition-all duration-300">
                      {stats.completedCount === 0 ? 'Start Learning' : 'Continue'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Next lesson card — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            {nextLesson ? (
              <Link href={`/course/lesson/${nextLesson.id}`} className="block group h-full">
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-indigo-500/30 hover:bg-indigo-500/[0.05] transition-all duration-300 p-6 h-full min-h-[200px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">Up Next</span>
                    </div>
                    <p className="text-[11px] text-white/25 font-medium mb-1.5 line-clamp-1">
                      {nextLesson.isQuiz ? '📝' : ''} Module {nextLesson.moduleId}
                    </p>
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
                      {nextLesson.title}
                    </h3>
                    <p className="text-xs text-white/25 mt-2 line-clamp-1">{nextLesson.moduleTitle}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                    <span className="text-xs text-white/25 font-medium">Lesson {nextLesson.id}</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:translate-x-1 transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6 h-full min-h-[200px] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="font-bold text-white text-base mb-1">Course Complete!</p>
                <p className="text-sm text-white/30">All lessons finished.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Module progress strips ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Module Progress</p>
          <div className="space-y-4">
            {[
              { id: 1, label: 'Introduction to AMRYTT MEDIA LLC', total: 5,  color: 'bg-indigo-500' },
              { id: 2, label: 'Comprehensive Guide to Digital Marketing', total: 19, color: 'bg-violet-500' },
              { id: 3, label: 'Introduction to GUESTPOSTLINKS.NET', total: 3,  color: 'bg-emerald-500' },
            ].map((mod, i) => {
              const modLessons = mod.id === 1
                ? [1,2,3,4,5]
                : mod.id === 2
                  ? [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                  : [25,26,27]
              const done = modLessons.filter(id => completedSet.has(id)).length

              return (
                <div key={mod.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-black text-white/30">{mod.id}</span>
                      <span className="text-xs text-white/50 font-medium truncate max-w-[260px]">{mod.label}</span>
                    </div>
                    <span className="text-xs text-white/25 font-medium tabular-nums flex-shrink-0 ml-3">{done}/{mod.total}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${mod.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((done / mod.total) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ── Admin quick action ──────────────────────────────────────────── */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/admin" className="flex items-center gap-4 group rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] hover:bg-violet-500/[0.08] hover:border-violet-500/25 transition-all duration-300 p-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white/80 text-sm group-hover:text-white transition-colors">Admin Panel</p>
                <p className="text-xs text-white/25 mt-0.5">Manage team members, quiz attempts, and course access</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
            </Link>
          </motion.div>
        )}

      </main>
    </div>
  )
}
