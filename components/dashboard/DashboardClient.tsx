'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, Shield, ChevronRight, BarChart2, ArrowRight,
  Layers, Trophy, Target, Zap, CheckCircle2, Lock,
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

// ── Teams ────────────────────────────────────────────────────────────────────
const TEAM_META: Record<string, { label: string; light: string; dark: string }> = {
  outreach:         { label: 'Outreach',         light: 'bg-blue-50 text-blue-700 border-blue-200',            dark: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' },
  order_processing: { label: 'Order Processing', light: 'bg-indigo-50 text-indigo-700 border-indigo-200',      dark: 'dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' },
  content:          { label: 'Content',          light: 'bg-emerald-50 text-emerald-700 border-emerald-200',   dark: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' },
  seo:              { label: 'SEO',              light: 'bg-amber-50 text-amber-700 border-amber-200',         dark: 'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
  live_chat:        { label: 'Live Chat',        light: 'bg-rose-50 text-rose-700 border-rose-200',            dark: 'dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Lenis ────────────────────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    let lenis: import('lenis').default | null = null
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const loop = (t: number) => { lenis?.raf(t); requestAnimationFrame(loop) }
      requestAnimationFrame(loop)
    })
    return () => lenis?.destroy()
  }, [])
}

// ── Count-up ─────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900, delay = 0) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf: number; let start: number | null = null
    const t = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        const e = 1 - Math.pow(1 - p, 3)
        if (ref.current) ref.current.textContent = Math.round(e * target).toString()
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [target, duration, delay])
  return ref
}

// ── Circular SVG Progress Ring ───────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const size = 128; const stroke = 9
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pctRef = useCountUp(pct, 1200, 300)

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="white" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center" style={{ transform: 'rotate(0deg)' }}>
        <div className="flex items-baseline justify-center gap-0.5">
          <span ref={pctRef} className="text-2xl font-black text-white leading-none">0</span>
          <span className="text-sm font-bold text-white/60">%</span>
        </div>
        <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider block mt-0.5">done</span>
      </div>
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, suffix = '', accent, delay }: {
  icon: React.ElementType; label: string; value: number; suffix?: string; accent: string; delay: number
}) {
  const ref = useCountUp(value, 900, delay)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-white/[0.12] transition-all duration-300 group"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex items-end gap-0.5 mb-1">
        <span ref={ref} className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">0</span>
        {suffix && <span className="text-lg font-bold text-gray-400 dark:text-white/40 mb-0.5">{suffix}</span>}
      </div>
      <p className="text-xs font-semibold text-gray-400 dark:text-white/35 uppercase tracking-wide">{label}</p>
    </motion.div>
  )
}

// ── Module Progress Card ─────────────────────────────────────────────────────
function ModuleCard({ id, label, done, total, barColor, delay, unlocked }: {
  id: number; label: string; done: number; total: number; barColor: string; delay: number; unlocked: boolean
}) {
  const pct = Math.round((done / total) * 100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white dark:bg-white/[0.03] border rounded-2xl p-5 transition-all duration-300 ${
        unlocked
          ? 'border-gray-100 dark:border-white/[0.07] shadow-sm dark:shadow-none'
          : 'border-gray-100 dark:border-white/[0.05] opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
          unlocked
            ? 'bg-gray-100 dark:bg-white/[0.08] text-gray-700 dark:text-white/70'
            : 'bg-gray-50 dark:bg-white/[0.04] text-gray-400 dark:text-white/30'
        }`}>
          {id}
        </div>
        {!unlocked ? (
          <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-white/20" />
        ) : done === total ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : null}
      </div>
      <p className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wide mb-1">Module {id}</p>
      <p className="text-sm font-bold text-gray-800 dark:text-white/80 leading-snug line-clamp-2 mb-4">{label}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold">
          <span className="text-gray-400 dark:text-white/30">{done}/{total} lessons</span>
          <span className="text-gray-500 dark:text-white/40">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  firstName: string; email: string; team: string | null; isAdmin: boolean
  completedLessonIds: number[]
  stats: {
    lessonsRead: number; testsTaken: number; testsPassed: number; avgScore: number
    progressPct: number; completedCount: number; totalLessons: number; currentModuleId: number
  }
  nextLesson: { id: number; title: string; moduleTitle: string; moduleId: number; isQuiz: boolean } | null
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardClient({ firstName, email, team, isAdmin, completedLessonIds, stats, nextLesson }: Props) {
  useLenis()
  const completedSet = new Set(completedLessonIds)
  const teamMeta = team ? TEAM_META[team] : null

  const MOD_DATA = [
    { id: 1, label: 'Introduction to AMRYTT MEDIA LLC',             lessons: [1,2,3,4,5],                                           barColor: 'bg-indigo-500',  delay: 0.70 },
    { id: 2, label: 'Comprehensive Guide to Digital Marketing',      lessons: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], barColor: 'bg-violet-500',  delay: 0.76 },
    { id: 3, label: 'Introduction to GUESTPOSTLINKS.NET',            lessons: [25,26,27],                                             barColor: 'bg-emerald-500', delay: 0.82 },
  ]
  const mod1Done = MOD_DATA[0].lessons.every(id => completedSet.has(id))
  const moduleUnlocked = [true, mod1Done, mod1Done && MOD_DATA[1].lessons.every(id => completedSet.has(id))]

  const statCards = [
    { icon: BookOpen, label: 'Lessons Done',  value: stats.completedCount, suffix: `/${stats.totalLessons}`, accent: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
    { icon: Target,   label: 'Tests Taken',   value: stats.testsTaken,     suffix: '',                        accent: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400' },
    { icon: Trophy,   label: 'Tests Passed',  value: stats.testsPassed,    suffix: '',                        accent: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    { icon: Zap,      label: 'Avg. Score',    value: stats.avgScore,       suffix: '%',                       accent: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  ]

  return (
    <div className="min-h-dvh bg-[#F7F8FF] dark:bg-[#0A0B12] overflow-x-hidden">

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0B12]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow shadow-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight hidden sm:block">Team Learning Hub</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {teamMeta && (
              <span className={`hidden sm:inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border ${teamMeta.light} ${teamMeta.dark}`}>
                {teamMeta.label}
              </span>
            )}
            <span className="text-xs text-gray-400 dark:text-white/25 hidden lg:block mr-1">{email}</span>
            <Link href="/my-results" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-600 dark:text-white/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200">
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:block">My Results</span>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-600 dark:bg-violet-500/20 text-white dark:text-violet-300 hover:bg-violet-700 dark:hover:bg-violet-500/30 border dark:border-violet-500/20 transition-all duration-200">
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Admin</span>
              </Link>
            )}
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.05] blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-violet-400/10 blur-2xl" />
          <div className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-indigo-400/10 blur-2xl" />
          {/* Subtle dot pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between gap-6"
          >
            {/* Greeting */}
            <div className="flex-1">
              <p className="text-indigo-200/70 text-sm font-semibold mb-1">{getGreeting()}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {firstName}
              </h1>
              <p className="text-indigo-200/60 text-sm sm:text-base mt-2 font-medium max-w-md">
                {stats.completedCount === 0
                  ? "Welcome! Let's start your learning journey."
                  : stats.progressPct >= 100
                    ? 'You have completed the entire course. Incredible work!'
                    : `You are ${stats.progressPct}% through the Foundation course.`
                }
              </p>

              {/* Mini course info */}
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <Link href="/course" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-indigo-900/20 group">
                  {stats.completedCount === 0 ? 'Start Learning' : 'Continue Course'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <div className="flex items-center gap-1.5 text-indigo-200/60 text-xs font-medium">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{stats.completedCount}/{stats.totalLessons} lessons · Module {stats.currentModuleId} of 3</span>
                </div>
              </div>
            </div>

            {/* Progress ring */}
            <div className="hidden sm:flex flex-col items-center gap-2 flex-shrink-0">
              <ProgressRing pct={stats.progressPct} />
              <span className="text-[11px] text-indigo-200/50 font-semibold uppercase tracking-wider">Overall</span>
            </div>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="h-6 bg-[#F7F8FF] dark:bg-[#0A0B12]" style={{
          clipPath: 'ellipse(110% 100% at 50% 100%)',
          marginTop: '-1px',
        }} />
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 space-y-5 -mt-2">

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((c, i) => (
            <StatCard key={c.label} {...c} delay={120 + i * 70} />
          ))}
        </div>

        {/* Course card + Next lesson */}
        <div className="grid lg:grid-cols-5 gap-4">

          {/* Course card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <Link href="/course" className="block group h-full">
              <div className="relative overflow-hidden rounded-2xl h-full min-h-[180px] bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-6 sm:p-7 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-400">
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/[0.08] rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-300/10 rounded-full blur-xl" />
                <div className="relative flex flex-col h-full justify-between">
                  <div>
                    <p className="text-indigo-200/60 text-[11px] font-bold uppercase tracking-widest mb-1">Your Course</p>
                    <h2 className="text-xl font-black text-white">Let&apos;s Create Foundation!</h2>
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-indigo-200/60 font-medium mb-2">
                      <span>Overall Progress</span>
                      <span className="text-white font-bold">{stats.progressPct}%</span>
                    </div>
                    <div className="h-2 bg-white/15 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressPct}%` }}
                        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-indigo-200/50 font-medium">{stats.completedCount}/{stats.totalLessons} lessons completed</span>
                      <span className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors group-hover:gap-2 duration-200">
                        View Course
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Next lesson */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            {nextLesson ? (
              <Link href={`/course/lesson/${nextLesson.id}`} className="block group h-full">
                <div className="h-full min-h-[180px] bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-indigo-500/25 hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Up Next</span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-white/25 font-medium mb-1">
                      Module {nextLesson.moduleId} {nextLesson.isQuiz ? '· Quiz' : '· Lesson'}
                    </p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {nextLesson.title}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-white/25 mt-1.5 line-clamp-1">{nextLesson.moduleTitle}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-white/[0.06]">
                    <span className="text-xs text-gray-400 dark:text-white/25 font-medium">Lesson {nextLesson.id}</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-full min-h-[180px] bg-emerald-50 dark:bg-emerald-500/[0.06] border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">Course Complete!</p>
                <p className="text-sm text-gray-500 dark:text-white/30 mt-1">All lessons finished.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Module progress cards */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25 mb-3 px-0.5">Module Progress</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {MOD_DATA.map((mod, i) => {
              const done = mod.lessons.filter(id => completedSet.has(id)).length
              return (
                <ModuleCard
                  key={mod.id}
                  id={mod.id}
                  label={mod.label}
                  done={done}
                  total={mod.lessons.length}
                  barColor={mod.barColor}
                  delay={mod.delay}
                  unlocked={moduleUnlocked[i]}
                />
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}
