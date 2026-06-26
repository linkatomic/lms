'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserPlus, Mail, Lock, Eye, EyeOff,
  CheckCircle2, AlertCircle, RefreshCw, Shield, User,
  Clock, Search, X, ChevronDown, Pencil, Save, BookOpen,
  Tag, Trash2, TriangleAlert,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAMS = [
  { value: 'outreach',         label: 'Outreach',          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { value: 'order_processing', label: 'Order Processing',  color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  { value: 'content',          label: 'Content',           color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { value: 'seo',              label: 'SEO',               color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { value: 'live_chat',        label: 'Live Chat',         color: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
]

const AVAILABLE_COURSES = [
  { id: 'foundation', label: "Let's Create Foundation!", desc: 'Core onboarding — required for all teams' },
]

function teamMeta(value: string | null) {
  return TEAMS.find(t => t.value === value) ?? null
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserRow {
  id: string
  email: string
  display_name: string
  role: 'admin' | 'user'
  team: string | null
  enrolled_courses: string[]
  created_at: string
  last_sign_in: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ─── Team badge ───────────────────────────────────────────────────────────────

function TeamBadge({ value }: { value: string | null }) {
  const t = teamMeta(value)
  if (!t) return <span className="text-xs text-gray-300 dark:text-gray-600 italic">No team</span>
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>
      <Tag className="w-2.5 h-2.5" />
      {t.label}
    </span>
  )
}

// ─── Create User Form ────────────────────────────────────────────────────────

function CreateUserForm({ onCreated }: { onCreated: () => void }) {
  const [displayName, setDisplayName]         = useState('')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [showPassword, setShowPassword]       = useState(false)
  const [team, setTeam]                       = useState('')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['foundation'])
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState('')

  function toggleCourse(id: string) {
    setEnrolledCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: displayName,
        email,
        password,
        team: team || null,
        enrolled_courses: enrolledCourses,
      }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }

    setSuccess(`Account created for ${data.user.display_name} (${data.user.email})`)
    setDisplayName('')
    setEmail('')
    setPassword('')
    setTeam('')
    setEnrolledCourses(['foundation'])
    onCreated()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white">Create New Account</p>
          <p className="text-violet-200 text-xs">No email confirmation required</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Display Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="e.g. sarah@amrytt.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition"
            />
          </div>
        </div>

        {/* Team */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Team <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={team} onChange={e => setTeam(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition appearance-none"
            >
              <option value="">— No team assigned —</option>
              {TEAMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Course Access <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {AVAILABLE_COURSES.map(course => (
              <label key={course.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                enrolledCourses.includes(course.id)
                  ? 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}>
                <input type="checkbox" checked={enrolledCourses.includes(course.id)} onChange={() => toggleCourse(course.id)}
                  className="mt-0.5 accent-violet-600 w-4 h-4"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{course.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{course.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">The user can change this after first login.</p>
        </div>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
            </motion.div>
          )}
          {success && (
            <motion.div key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl px-4 py-3 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />{success}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition shadow-sm"
        >
          {loading ? (
            <><RefreshCw className="w-4 h-4 animate-spin" />Creating account…</>
          ) : (
            <><UserPlus className="w-4 h-4" />Create Account</>
          )}
        </motion.button>
      </form>
    </div>
  )
}

// ─── Inline Edit Row ──────────────────────────────────────────────────────────

function EditUserPanel({ user, onSaved, onDeleted, onCancel }: {
  user: UserRow
  onSaved: (updated: Partial<UserRow>) => void
  onDeleted: () => void
  onCancel: () => void
}) {
  const [displayName, setDisplayName]         = useState(user.display_name)
  const [team, setTeam]                       = useState(user.team ?? '')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(user.enrolled_courses ?? ['foundation'])
  const [saving, setSaving]                   = useState(false)
  const [error, setError]                     = useState('')
  const [confirmDelete, setConfirmDelete]     = useState(false)
  const [deleting, setDeleting]               = useState(false)

  function toggleCourse(id: string) {
    setEnrolledCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  async function handleSave() {
    if (!displayName.trim()) { setError('Display name cannot be empty.'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/update-user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, display_name: displayName.trim(), team: team || null, enrolled_courses: enrolledCourses }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Failed to save.'); return }
    onSaved({ display_name: displayName.trim(), team: team || null, enrolled_courses: enrolledCourses })
  }

  async function handleDelete() {
    setDeleting(true); setError('')
    const res = await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
    const data = await res.json()
    setDeleting(false)
    if (!res.ok) { setError(data.error ?? 'Failed to delete.'); setConfirmDelete(false); return }
    onDeleted()
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <td colSpan={6} className="px-6 py-5 bg-violet-50 dark:bg-violet-950/30 border-b border-violet-100 dark:border-violet-900">

        {/* Delete confirmation overlay */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl p-4"
            >
              <TriangleAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700 dark:text-red-300">Delete {user.display_name || user.email}?</p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                  This permanently removes their account and cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={handleDelete} disabled={deleting}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition"
                >
                  {deleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-4 items-start">

          {/* Display name */}
          <div className="flex-1 space-y-1 min-w-[160px]">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Display Name</p>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Full name"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition"
              />
            </div>
          </div>

          {/* Team selector */}
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</p>
            <div className="relative">
              <select value={team} onChange={e => setTeam(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition appearance-none"
              >
                <option value="">— No team —</option>
                {TEAMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Courses */}
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Access</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COURSES.map(course => (
                <label key={course.id} className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer transition ${
                  enrolledCourses.includes(course.id)
                    ? 'border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <input type="checkbox" checked={enrolledCourses.includes(course.id)} onChange={() => toggleCourse(course.id)}
                    className="accent-violet-600 w-3.5 h-3.5"
                  />
                  <BookOpen className="w-3 h-3" />
                  {course.label}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 justify-start pt-5 flex-shrink-0">
            {error && <p className="text-xs text-red-600 dark:text-red-400 max-w-[200px]">{error}</p>}
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
              <button onClick={onCancel}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={() => { setConfirmDelete(true); setError('') }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      </td>
    </motion.tr>
  )
}

// ─── Mobile Edit Panel ────────────────────────────────────────────────────────

function MobileEditPanel({ user, onSaved, onDeleted, onCancel }: {
  user: UserRow
  onSaved: (updated: Partial<UserRow>) => void
  onDeleted: () => void
  onCancel: () => void
}) {
  const [displayName, setDisplayName]         = useState(user.display_name)
  const [team, setTeam]                       = useState(user.team ?? '')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(user.enrolled_courses ?? ['foundation'])
  const [saving, setSaving]                   = useState(false)
  const [error, setError]                     = useState('')
  const [confirmDelete, setConfirmDelete]     = useState(false)
  const [deleting, setDeleting]               = useState(false)

  function toggleCourse(id: string) {
    setEnrolledCourses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  async function handleSave() {
    if (!displayName.trim()) { setError('Display name cannot be empty.'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/update-user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, display_name: displayName.trim(), team: team || null, enrolled_courses: enrolledCourses }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Failed to save.'); return }
    onSaved({ display_name: displayName.trim(), team: team || null, enrolled_courses: enrolledCourses })
  }

  async function handleDelete() {
    setDeleting(true); setError('')
    const res = await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
    const data = await res.json()
    setDeleting(false)
    if (!res.ok) { setError(data.error ?? 'Failed to delete.'); setConfirmDelete(false); return }
    onDeleted()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-violet-50 dark:bg-violet-950/30 border-t border-violet-100 dark:border-violet-900 px-4 py-4 space-y-3"
    >
      {confirmDelete && (
        <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <TriangleAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-red-700 dark:text-red-300">Delete this account?</p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">This is permanent and cannot be undone.</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={handleDelete} disabled={deleting}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
            >
              {deleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              {deleting ? '…' : 'Delete'}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">No</button>
          </div>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Display Name</p>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition"
          />
        </div>
      </div>

      {/* Team */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</p>
        <div className="relative">
          <select value={team} onChange={e => setTeam(e.target.value)}
            className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-sm focus:outline-none appearance-none"
          >
            <option value="">— No team —</option>
            {TEAMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Access</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COURSES.map(course => (
            <label key={course.id} className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer transition ${
              enrolledCourses.includes(course.id)
                ? 'border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500'
            }`}>
              <input type="checkbox" checked={enrolledCourses.includes(course.id)} onChange={() => toggleCourse(course.id)} className="accent-violet-600 w-3.5 h-3.5" />
              <BookOpen className="w-3 h-3" />{course.label}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-2 flex-wrap">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button onClick={() => { setConfirmDelete(true); setError('') }}
          className="flex items-center gap-1 text-xs text-red-500 px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </motion.div>
  )
}

// ─── Users Table ─────────────────────────────────────────────────────────────

function UsersTable({ users: initialUsers, loading, onRefresh }: {
  users: UserRow[]; loading: boolean; onRefresh: () => void
}) {
  const [search, setSearch]         = useState('')
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [users, setUsers]           = useState<UserRow[]>(initialUsers)

  useEffect(() => { setUsers(initialUsers) }, [initialUsers])

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    (u.team && u.team.toLowerCase().includes(search.toLowerCase()))
  )

  function handleSaved(userId: string, updated: Partial<UserRow>) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u))
    setEditingId(null)
  }

  function handleDeleted(userId: string) {
    setUsers(prev => prev.filter(u => u.id !== userId))
    setEditingId(null)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-50">All Users</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{users.length} account{users.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>
        <button onClick={onRefresh} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-gray-50 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or team…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="px-6 py-12 text-center">
          <RefreshCw className="w-6 h-6 text-gray-300 dark:text-gray-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading users…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Users className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
          <p className="text-sm text-gray-400 dark:text-gray-500">{search ? 'No users match your search.' : 'No users found.'}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                <AnimatePresence>
                  {filtered.map(u => (
                    <>
                      <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${editingId === u.id ? 'bg-violet-50/30 dark:bg-violet-950/10' : ''}`}
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              u.role === 'admin'
                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}>
                              {(u.display_name || u.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-medium text-gray-900 dark:text-gray-50">{u.display_name || <span className="italic text-gray-400">No name</span>}</p>
                                {u.role === 'admin' && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                                    <Shield className="w-2.5 h-2.5" /> Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Team */}
                        <td className="px-6 py-4"><TeamBadge value={u.team} /></td>

                        {/* Courses */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(u.enrolled_courses ?? []).length === 0 ? (
                              <span className="text-xs text-gray-300 dark:text-gray-600 italic">None</span>
                            ) : (u.enrolled_courses ?? []).map(cid => {
                              const course = AVAILABLE_COURSES.find(c => c.id === cid)
                              return (
                                <span key={cid} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                  <BookOpen className="w-2.5 h-2.5" />
                                  {course?.label ?? cid}
                                </span>
                              )
                            })}
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{fmtDate(u.created_at)}</span>
                          </div>
                        </td>

                        {/* Last Login */}
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {u.last_sign_in ? (
                            <div>
                              <p>{fmtDate(u.last_sign_in)}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">{fmtTime(u.last_sign_in)}</p>
                            </div>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600 italic text-xs">Never</span>
                          )}
                        </td>

                        {/* Edit button */}
                        <td className="px-4 py-4">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                              className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border transition ${
                                editingId === u.id
                                  ? 'border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                                  : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400'
                              }`}
                            >
                              <Pencil className="w-3 h-3" />
                              {editingId === u.id ? 'Cancel' : 'Edit'}
                            </button>
                          )}
                        </td>
                      </motion.tr>

                      {/* Edit panel row */}
                      <AnimatePresence>
                        {editingId === u.id && (
                          <EditUserPanel
                            key={`edit-${u.id}`}
                            user={u}
                            onSaved={updated => handleSaved(u.id, updated)}
                            onDeleted={() => handleDeleted(u.id)}
                            onCancel={() => setEditingId(null)}
                          />
                        )}
                      </AnimatePresence>
                    </>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(u => (
              <div key={u.id} className="px-4 py-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
                    u.role === 'admin'
                      ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {(u.display_name || u.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-gray-50 text-sm truncate">{u.display_name || u.email}</p>
                      {u.role === 'admin' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <TeamBadge value={u.team} />
                    </div>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Joined {fmtDate(u.created_at)}</p>
                  </div>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                      className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Mobile edit panel */}
                {editingId === u.id && (
                  <MobileEditPanel
                    key={`edit-mobile-${u.id}`}
                    user={u}
                    onSaved={updated => handleSaved(u.id, updated)}
                    onDeleted={() => handleDeleted(u.id)}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [users, setUsers]           = useState<UserRow[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (res.ok) setUsers(data.users)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Stats per team
  const teamCounts = TEAMS.map(t => ({
    ...t,
    count: users.filter(u => u.team === t.value).length,
  }))
  const unassigned = users.filter(u => u.role === 'user' && !u.team).length

  return (
    <div className="space-y-6">

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center col-span-1">
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{loadingUsers ? '—' : users.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total Users</p>
        </div>
        {teamCounts.map(t => (
          <div key={t.value} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className={`text-2xl font-black`}>{loadingUsers ? '—' : t.count}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.label}</p>
          </div>
        ))}
        {unassigned > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-gray-400">{unassigned}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No Team</p>
          </div>
        )}
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <CreateUserForm onCreated={fetchUsers} />
        <UsersTable users={users} loading={loadingUsers} onRefresh={fetchUsers} />
      </div>
    </div>
  )
}
