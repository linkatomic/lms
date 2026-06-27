'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// Types & shared constants
// ─────────────────────────────────────────────────────────────────────────────

interface StationProps { onComplete: (score: number) => void; completed: boolean; score: number }

const MAX_SCORES = [100, 100, 100, 100, 100, 100, 100, 100, 100]

// ─────────────────────────────────────────────────────────────────────────────
// Station 1 — The Link Lab (Dofollow / Nofollow)
// ─────────────────────────────────────────────────────────────────────────────

function Station1({ onComplete, completed, score }: StationProps) {
  const [relAttr, setRelAttr] = useState<'dofollow' | 'nofollow' | 'sponsored' | 'ugc'>('dofollow')
  const [dr, setDr] = useState(50)
  const [position, setPosition] = useState<'body' | 'sidebar' | 'footer'>('body')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)

  const positionMultiplier = position === 'body' ? 1 : position === 'sidebar' ? 0.6 : 0.3
  const relMultiplier = relAttr === 'dofollow' ? 1 : 0
  const juice = Math.round(dr * relMultiplier * positionMultiplier)

  const handleCheck = () => {
    const isCorrect = relAttr === 'dofollow' && dr >= 90 && position === 'body'
    setSubmitted(true)
    setCorrect(isCorrect)
    if (!completed) onComplete(isCorrect ? 100 : 40)
  }

  const relOptions = [
    { value: 'dofollow', label: 'Dofollow', html: '<a href="...">', desc: 'Passes full link equity' },
    { value: 'nofollow', label: 'Nofollow', html: '<a href="..." rel="nofollow">', desc: 'No equity passed' },
    { value: 'sponsored', label: 'Sponsored', html: '<a href="..." rel="sponsored">', desc: 'Marks paid links' },
    { value: 'ugc', label: 'UGC', html: '<a href="..." rel="ugc">', desc: 'User-generated content' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚡</span>
          <h3 className="text-xl font-bold">Station 1: The Link Lab</h3>
        </div>
        <p className="text-blue-100 text-sm">Configure three variables and watch link juice flow (or not). Then set the maximum possible configuration.</p>
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* rel= toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">1. rel= attribute</p>
          <div className="space-y-2">
            {relOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setRelAttr(opt.value)}
                className={`w-full text-left rounded-xl px-3 py-2.5 border transition ${
                  relAttr === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <p className={`text-xs font-mono ${relAttr === opt.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>{opt.html}</p>
                <p className={`text-xs font-semibold mt-0.5 ${relAttr === opt.value ? 'text-blue-800 dark:text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* DR slider */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">2. Source site DR</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{dr}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              dr >= 70 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
              dr >= 40 ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
              'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>
              {dr >= 70 ? 'High Authority' : dr >= 40 ? 'Medium' : 'Low Authority'}
            </span>
          </div>
          <input type="range" min={1} max={100} value={dr}
            onChange={e => setDr(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>DR 1</span><span>DR 50</span><span>DR 100</span>
          </div>
          <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
            <p>• Random-blog.net — DR 8</p>
            <p>• Niche authority site — DR 45</p>
            <p>• Forbes, NYT — DR 90+</p>
          </div>
        </div>

        {/* Position */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">3. Link placement</p>
          <div className="space-y-2">
            {([
              { v: 'body', label: 'Body Content', mult: '100%', emoji: '✅' },
              { v: 'sidebar', label: 'Sidebar', mult: '60%', emoji: '⚠️' },
              { v: 'footer', label: 'Footer', mult: '30%', emoji: '🔻' },
            ] as const).map(opt => (
              <button
                key={opt.v}
                onClick={() => setPosition(opt.v)}
                className={`w-full text-left rounded-xl px-3 py-3 border transition ${
                  position === opt.v
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${position === opt.v ? 'text-blue-800 dark:text-blue-200' : 'text-gray-700 dark:text-gray-200'}`}>
                    {opt.emoji} {opt.label}
                  </p>
                  <span className={`text-xs font-bold ${position === opt.v ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{opt.mult}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Juice visualizer */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full mx-auto flex items-center justify-center text-xl font-black text-gray-600 dark:text-gray-300">
              DR{dr}
            </div>
            <p className="text-xs text-gray-400 mt-2">Source Site</p>
          </div>

          {/* Pipe */}
          <div className="flex-1 relative h-8 flex items-center">
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all duration-500 ${juice > 0 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                animate={{ width: `${juice}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            {juice === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-red-400 text-lg">✕</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full mx-auto flex items-center justify-center text-white text-xl font-black">
              {juice}
            </div>
            <p className="text-xs text-gray-400 mt-2">Your Site</p>
          </div>
        </div>

        <div className={`text-center rounded-xl p-3 ${
          juice > 60 ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
          juice > 20 ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
          'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
        }`}>
          <p className="font-bold text-sm">
            {juice === 0 ? '❌ No link juice transferred (nofollow/ugc/sponsored blocks it)' :
             juice < 30 ? `⚠️ Weak signal — ${juice} SEO value units transferred` :
             juice < 70 ? `✅ Decent link — ${juice} SEO value units transferred` :
             `🚀 Strong backlink — ${juice} SEO value units transferred!`}
          </p>
        </div>
      </div>

      {/* Challenge */}
      <div className="bg-indigo-50 dark:bg-indigo-950 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-5">
        <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-1">🎯 Challenge</p>
        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">Set the configuration that transfers <strong>maximum possible link juice</strong> to your site.</p>
        {!submitted ? (
          <button onClick={handleCheck}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition">
            Lock in my answer →
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${correct ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'}`}>
            {correct
              ? '✅ Perfect! DR 90+ · Dofollow · Body = maximum juice. This is what every great backlink looks like.'
              : '💡 Not quite. Maximum juice = Dofollow + highest DR + Body placement. Try adjusting and retrying!'}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 2 — SERP Traffic Engine
// ─────────────────────────────────────────────────────────────────────────────

const CTR_BY_POSITION = [28.5, 15.7, 11.0, 8.0, 5.7, 4.0, 2.7, 1.9, 1.4, 1.0]

function Station2({ onComplete, completed, score }: StationProps) {
  const [position, setPosition] = useState(7)
  const [volume, setVolume] = useState(10000)
  const [submitted, setSubmitted] = useState(false)

  const ctr = CTR_BY_POSITION[position - 1]
  const clicks = Math.round((ctr / 100) * volume)
  const revenuePerClick = 50
  const revenue = clicks * revenuePerClick

  const handleCheck = () => {
    const s = position <= 3 ? 100 : position <= 5 ? 70 : 40
    setSubmitted(true)
    if (!completed) onComplete(s)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📊</span>
          <h3 className="text-xl font-bold">Station 2: SERP Traffic Engine</h3>
        </div>
        <p className="text-violet-100 text-sm">Move your result up the SERP and watch how traffic (and revenue) changes. Get to position #3 or better to pass.</p>
      </div>

      {/* SERP preview */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-500 font-mono ml-2">
            google.com/search?q=best+guest+posting+services
          </div>
        </div>
        <div className="space-y-1">
          {CTR_BY_POSITION.map((pCtr, i) => {
            const pos = i + 1
            const isYou = pos === position
            const isAd = pos <= 2
            return (
              <motion.div
                key={pos}
                layout
                className={`rounded-xl px-3 py-2.5 border transition ${
                  isYou
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 shadow-md'
                    : 'border-transparent hover:border-gray-100 dark:hover:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                    isYou ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>{pos}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isAd && <span className="text-[9px] font-bold border border-yellow-400 text-yellow-600 px-1 rounded">Ad</span>}
                      <p className={`text-sm font-medium truncate ${isYou ? 'text-blue-800 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}`}>
                        {isYou ? '⭐ YOUR SITE — guestpostlinks.net' : pos === 1 && !isYou ? 'Competitor A — linksy.com' : `Competitor ${pos} — site${pos}.com`}
                      </p>
                    </div>
                    {isYou && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">https://guestpostlinks.net/services</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-bold ${isYou ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400'}`}>{pCtr}% CTR</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your position</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-black text-violet-600 dark:text-violet-400">#{position}</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
              position === 1 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
              position <= 3 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
              position <= 5 ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
              'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>
              {position === 1 ? '🏆 Top!' : position <= 3 ? '✅ Page 1 top' : position <= 5 ? '⚠️ Page 1' : '🔻 Lower'}
            </span>
          </div>
          <input type="range" min={1} max={10} value={position}
            onChange={e => setPosition(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>#1</span><span>#5</span><span>#10</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Monthly search volume</p>
          <input type="range" min={1000} max={100000} step={1000} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full accent-violet-600 mb-3"
          />
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{volume.toLocaleString()}</p>
          <p className="text-xs text-gray-400">searches / month</p>
        </div>
      </div>

      {/* Result */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-2xl border border-violet-100 dark:border-violet-800 p-5">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-black text-violet-700 dark:text-violet-300">{ctr}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Click-through rate</p>
          </div>
          <div>
            <p className="text-2xl font-black text-violet-700 dark:text-violet-300">{clicks.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Est. monthly clicks</p>
          </div>
          <div>
            <p className="text-2xl font-black text-violet-700 dark:text-violet-300">₹{revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Est. revenue (₹{revenuePerClick}/click)</p>
          </div>
        </div>
        {position === 1 && (
          <div className="text-center text-sm text-violet-700 dark:text-violet-300 font-semibold">
            🏆 Position #1 = {Math.round(CTR_BY_POSITION[0] / CTR_BY_POSITION[9])}× more traffic than position #10!
          </div>
        )}
      </div>

      <div className="bg-violet-50 dark:bg-violet-950 rounded-2xl border border-violet-100 dark:border-violet-800 p-5">
        <p className="text-sm font-bold text-violet-800 dark:text-violet-200 mb-1">🎯 Challenge</p>
        <p className="text-sm text-violet-700 dark:text-violet-300 mb-4">Move your site to <strong>position #3 or better</strong> to complete this station.</p>
        {!submitted ? (
          <button onClick={handleCheck}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition">
            Submit my position →
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${position <= 3 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'}`}>
            {position <= 3
              ? `✅ You're in the top 3! At position #${position} you capture ${ctr}% of all clicks — that's ${clicks.toLocaleString()} visits/month.`
              : `💡 You need position #3 or better. Right now at #${position} you only get ${ctr}% CTR. Slide up!`}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 3 — Meta Description Studio
// ─────────────────────────────────────────────────────────────────────────────

function Station3({ onComplete, completed, score }: StationProps) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')

  const titleLen = title.length
  const descLen = desc.length
  const titleOk = titleLen > 0 && titleLen <= 60
  const descOk = descLen >= 120 && descLen <= 160

  const ctrScore = (() => {
    let pts = 0
    if (descLen >= 120 && descLen <= 160) pts++
    if (/[a-z]/i.test(desc) && desc.toLowerCase().includes('guest post') || desc.toLowerCase().includes('seo') || desc.toLowerCase().includes('backlink') || desc.toLowerCase().includes('link')) pts++
    if (/learn|discover|get|boost|improve|grow|try|start|find/i.test(desc)) pts++
    if (/[.!?]$/.test(desc.trim())) pts++
    if (pts >= 4) return 'Excellent'
    if (pts >= 3) return 'Good'
    if (pts >= 2) return 'Average'
    return 'Poor'
  })()

  const titleDisplay = view === 'desktop'
    ? (titleLen > 60 ? title.slice(0, 60) + '…' : title || 'Your Page Title Here')
    : (titleLen > 50 ? title.slice(0, 50) + '…' : title || 'Your Page Title Here')

  const descDisplay = view === 'desktop'
    ? (descLen > 160 ? desc.slice(0, 160) + '…' : desc || 'Write your meta description here. Aim for 120–160 characters, include a keyword, and end with a clear call to action.')
    : (descLen > 120 ? desc.slice(0, 120) + '…' : desc || 'Write your meta description here…')

  const handleCheck = () => {
    const s = ctrScore === 'Excellent' ? 100 : ctrScore === 'Good' ? 75 : ctrScore === 'Average' ? 50 : 25
    setSubmitted(true)
    if (!completed) onComplete(s)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🪟</span>
          <h3 className="text-xl font-bold">Station 3: Meta Description Studio</h3>
        </div>
        <p className="text-teal-100 text-sm">Write a page title and meta description. Watch your live SERP snippet update as you type.</p>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Page Title</label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              titleLen === 0 ? 'text-gray-400' :
              titleLen <= 60 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
              'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>{titleLen}/60</span>
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Buy Guest Posts in India — #1 Link Building Service"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Meta Description</label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              descLen === 0 ? 'text-gray-400' :
              descLen < 120 ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
              descLen <= 160 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
              'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>{descLen}/160</span>
          </div>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            placeholder="e.g. Boost your Google rankings with our guest posting service. 60,000+ publishers, DA 20–90+. Get natural backlinks from niche-relevant sites. Start today!"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">Tip: 120–160 chars · include a keyword · end with a CTA</p>
        </div>
      </div>

      {/* SERP Preview */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Live SERP Preview</p>
          <div className="flex gap-1">
            {(['desktop', 'mobile'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${view === v ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                {v === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
              </button>
            ))}
          </div>
        </div>
        <div className={`p-5 ${view === 'mobile' ? 'max-w-sm' : ''}`}>
          <div className="mb-1">
            <p className="text-[10px] text-gray-400 font-mono">https://guestpostlinks.net</p>
          </div>
          <p className={`font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-snug ${view === 'desktop' ? 'text-xl' : 'text-lg'}`}>
            {titleDisplay}
          </p>
          {titleLen > (view === 'desktop' ? 60 : 50) && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">⚠️ Title truncated in SERP</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{descDisplay}</p>
          {descLen > (view === 'desktop' ? 160 : 120) && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">⚠️ Description truncated in SERP</p>
          )}
        </div>
      </div>

      {/* CTR Score */}
      {descLen > 0 && (
        <div className={`rounded-2xl border p-4 ${
          ctrScore === 'Excellent' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800' :
          ctrScore === 'Good' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' :
          ctrScore === 'Average' ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' :
          'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ctrScore === 'Excellent' ? '🌟' : ctrScore === 'Good' ? '✅' : ctrScore === 'Average' ? '⚠️' : '❌'}</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-50">CTR Score: {ctrScore}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ctrScore === 'Excellent' ? 'Length ✓ · Keyword ✓ · Benefit ✓ · CTA ✓' :
                 ctrScore === 'Good' ? 'Almost there — add a stronger call-to-action or keyword' :
                 ctrScore === 'Average' ? 'Include a keyword and a benefit statement' :
                 'Too short, missing keyword, or missing call-to-action'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-teal-50 dark:bg-teal-950 rounded-2xl border border-teal-100 dark:border-teal-800 p-5">
        <p className="text-sm font-bold text-teal-800 dark:text-teal-200 mb-1">🎯 Challenge</p>
        <p className="text-sm text-teal-700 dark:text-teal-300 mb-4">Write a meta description that gets an <strong>"Excellent"</strong> CTR Score.</p>
        {!submitted ? (
          <button onClick={handleCheck}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition">
            Submit →
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${ctrScore === 'Excellent' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'}`}>
            {ctrScore === 'Excellent'
              ? '✅ Excellent! Your snippet would stand out in any SERP and drive strong click-through rates.'
              : `💡 Your score: ${ctrScore}. Make sure you have: 120–160 chars, an SEO keyword, a benefit ("Boost rankings"), and a CTA ("Start today").`}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 4 — Keyword Density Analyzer
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_TEXTS = {
  good: `Guest posting is one of the most effective link building strategies available to modern SEO professionals. When you publish high-quality content on authoritative websites, you earn backlinks that signal trustworthiness to search engines. The key is to choose websites relevant to your niche and write genuinely useful content. Over time, a consistent guest posting strategy can dramatically improve your domain authority and organic search rankings. Many businesses partner with agencies like AMRYTT MEDIA to handle their outreach and content creation at scale.`,
  borderline: `Guest posting is a powerful guest posting strategy. Through guest posting, you can build guest posting links. Our guest posting service offers the best guest posting opportunities. Guest posting helps with guest posting SEO and guest posting outreach. We recommend guest posting for all guest posting clients.`,
  stuffed: `Keyword density keyword density keyword density. The keyword density formula shows keyword density percentage. Keyword density is important for keyword density SEO. High keyword density keyword density means keyword density stuffing. Check your keyword density keyword density keyword density today. Keyword density keyword density keyword density.`,
}

function Station4({ onComplete, completed, score }: StationProps) {
  const [text, setText] = useState('')
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0

  // Count phrase occurrences using regex — supports multi-word keywords
  const kwCount = (() => {
    const kw = keyword.trim()
    if (!kw || !text.trim()) return 0
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return (text.match(new RegExp(escaped, 'gi')) || []).length
  })()

  // Each occurrence of a multi-word keyword occupies N words of the text
  const kwWordCount = keyword.trim() ? keyword.trim().split(/\s+/).filter(Boolean).length : 1
  const density = wordCount > 0 && kwCount > 0
    ? parseFloat(((kwCount * kwWordCount / wordCount) * 100).toFixed(2))
    : 0

  const zone = density === 0 ? 'none' : density < 1 ? 'low' : density <= 3 ? 'good' : density <= 5 ? 'risky' : 'stuffed'

  const handleLoad = (type: keyof typeof SAMPLE_TEXTS) => {
    setText(SAMPLE_TEXTS[type])
    setKeyword(type === 'stuffed' ? 'keyword density' : type === 'borderline' ? 'guest posting' : 'guest posting')
  }

  const handleCheck = () => {
    const isStuffed = zone === 'stuffed'
    const s = isStuffed ? 25 : zone === 'good' ? 100 : zone === 'risky' ? 60 : 40
    setSubmitted(true)
    if (!completed) onComplete(s)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔬</span>
          <h3 className="text-xl font-bold">Station 4: Keyword Density Analyzer</h3>
        </div>
        <p className="text-amber-100 text-sm">Type or paste text, set your target keyword. Watch the density calculate in real time. Aim for 1–3% — the safe zone.</p>
      </div>

      {/* Quick load */}
      <div className="flex flex-wrap gap-2">
        <p className="text-xs font-bold text-gray-400 self-center mr-1">Load sample:</p>
        {([['good', '✅ Natural (1–2%)'], ['borderline', '⚠️ Borderline (3–5%)'], ['stuffed', '🚫 Stuffed (6%+)']] as const).map(([type, label]) => (
          <button key={type} onClick={() => handleLoad(type)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition">
            {label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
            placeholder="Type or paste your content here…"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Target Keyword</label>
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="e.g. guest posting"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Meter */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Density</span>
              <span className={`text-3xl font-black ${
                zone === 'good' ? 'text-emerald-600 dark:text-emerald-400' :
                zone === 'risky' ? 'text-amber-600 dark:text-amber-400' :
                zone === 'stuffed' ? 'text-red-600 dark:text-red-400' :
                'text-gray-400'
              }`}>{density}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all ${
                  zone === 'good' ? 'bg-emerald-500' :
                  zone === 'risky' ? 'bg-amber-500' :
                  zone === 'stuffed' ? 'bg-red-500' :
                  'bg-gray-300'
                }`}
                animate={{ width: `${Math.min(density * 10, 100)}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className={`text-xs font-bold text-center rounded-lg py-1.5 ${
              zone === 'good' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
              zone === 'risky' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
              zone === 'stuffed' ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' :
              'bg-gray-50 dark:bg-gray-800 text-gray-400'
            }`}>
              {zone === 'none' ? 'Enter keyword' :
               zone === 'low' ? 'Underdone (<1%)' :
               zone === 'good' ? '✅ Natural (1–3%)' :
               zone === 'risky' ? '⚠️ Getting risky' :
               '🚫 KEYWORD STUFFING'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                <p className="text-lg font-black text-gray-700 dark:text-gray-200">{wordCount}</p>
                <p className="text-[10px] text-gray-400">words</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                <p className="text-lg font-black text-gray-700 dark:text-gray-200">{kwCount}</p>
                <p className="text-[10px] text-gray-400">keyword hits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl border border-amber-100 dark:border-amber-800 p-5">
        <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-1">🎯 Challenge</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">Load the <strong>Stuffed sample</strong>, identify the problem, then edit the text to bring density into the <strong>1–3% safe zone</strong>.</p>
        {!submitted ? (
          <button onClick={handleCheck}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition">
            Check my density →
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${zone === 'good' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'}`}>
            {zone === 'good'
              ? `✅ Perfect! ${density}% is right in the sweet spot. Google reads this as natural, keyword-relevant content.`
              : zone === 'stuffed'
              ? `🚫 ${density}% density — that's keyword stuffing. Google will penalize this. Reduce keyword repetition.`
              : `⚠️ ${density}% is ${zone === 'risky' ? 'getting risky' : 'too low'}. Aim for 1–3%.`}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 5 — Search Intent Classifier
// ─────────────────────────────────────────────────────────────────────────────

type Intent = 'Informational' | 'Navigational' | 'Transactional' | 'Commercial'

const QUERIES: { query: string; answer: Intent; why: string }[] = [
  { query: 'how do backlinks work', answer: 'Informational', why: '"How" questions signal the user wants to learn, not buy.' },
  { query: 'guestpostlinks.net login', answer: 'Navigational', why: 'The user is trying to reach a specific website — classic navigation intent.' },
  { query: 'buy guest posts India', answer: 'Transactional', why: '"Buy" is an explicit purchase signal — user is ready to spend money.' },
  { query: 'best guest posting services 2024', answer: 'Commercial', why: '"Best" + comparison signals the user is evaluating options before buying.' },
  { query: 'what is domain authority', answer: 'Informational', why: '"What is" = learning intent, no purchase involved.' },
  { query: 'ahrefs pricing', answer: 'Commercial', why: 'Checking pricing is research before a purchase — commercial investigation.' },
  { query: 'Neil Patel blog', answer: 'Navigational', why: 'Searching for a person/brand name = navigating to a specific destination.' },
  { query: 'order niche edit links', answer: 'Transactional', why: '"Order" signals purchase intent — user wants to complete a transaction.' },
  { query: 'what is keyword stuffing', answer: 'Informational', why: 'Definitional question — purely educational intent.' },
  { query: 'link building service vs in-house SEO', answer: 'Commercial', why: 'Comparing two options is a pre-purchase research pattern.' },
  { query: 'semrush vs ahrefs', answer: 'Commercial', why: 'Tool comparison = commercial investigation (deciding what to subscribe to).' },
  { query: 'free backlink checker', answer: 'Transactional', why: '"Free tool" is transactional — user wants to use something, even if free.' },
  { query: 'how to check domain rating', answer: 'Informational', why: 'How-to guide intent — user wants to learn a process.' },
  { query: 'AMRYTT MEDIA LLC contact', answer: 'Navigational', why: 'Finding a specific company\'s contact page = navigational.' },
  { query: 'start link building campaign', answer: 'Transactional', why: '"Start" signals readiness to take action — transactional intent.' },
  { query: 'what is white hat SEO', answer: 'Informational', why: 'Definition question = informational.' },
  { query: 'top 10 SEO agencies India', answer: 'Commercial', why: 'Ranked list query = comparison research before choosing a service.' },
  { query: 'nofollow vs dofollow links explained', answer: 'Informational', why: '"Explained" = wants education, not to make a purchase.' },
  { query: 'get a free SEO audit', answer: 'Transactional', why: 'Wants to obtain something (audit) right now — transactional.' },
  { query: 'Google Search Console tutorial', answer: 'Informational', why: '"Tutorial" = wants to learn a tool, educational intent.' },
]

const INTENT_COLORS: Record<Intent, string> = {
  Informational: 'bg-blue-600',
  Navigational: 'bg-violet-600',
  Transactional: 'bg-emerald-600',
  Commercial: 'bg-amber-500',
}
const INTENT_LIGHT: Record<Intent, string> = {
  Informational: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  Navigational: 'bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200',
  Transactional: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
  Commercial: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
}

function Station5({ onComplete, completed, score }: StationProps) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(Intent | null)[]>(Array(QUERIES.length).fill(null))
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)

  const q = QUERIES[current]
  const totalCorrect = answers.filter((a, i) => a === QUERIES[i].answer).length

  const handleAnswer = (intent: Intent) => {
    if (answers[current] !== null) return
    const newAnswers = [...answers]
    newAnswers[current] = intent
    setAnswers(newAnswers)
    const isCorrect = intent === q.answer
    setStreak(isCorrect ? streak + 1 : 0)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      if (current < QUERIES.length - 1) {
        setCurrent(c => c + 1)
      } else {
        setFinished(true)
        if (!completed) {
          const s = Math.round((newAnswers.filter((a, i) => a === QUERIES[i].answer).length / QUERIES.length) * 100)
          onComplete(s)
        }
      }
    }, 1800)
  }

  if (finished) {
    const pct = Math.round((totalCorrect / QUERIES.length) * 100)
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🧠</span>
            <h3 className="text-xl font-bold">Station 5: Search Intent Classifier</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '✅' : '📚'}</div>
          <p className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-1">{totalCorrect} / {QUERIES.length}</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{pct}% correct</p>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
            pct >= 80 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
            'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
          }`}>
            {pct >= 80 ? '🎯 Intent Master!' : 'Keep practising — review the explanations below'}
          </div>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {QUERIES.map((q, i) => {
            const userAns = answers[i]
            const isRight = userAns === q.answer
            return (
              <div key={i} className={`rounded-xl border p-3 ${isRight ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300 flex-1">"{q.query}"</p>
                  <div className="flex gap-2 flex-shrink-0">
                    {!isRight && userAns && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${INTENT_LIGHT[userAns]}`}>{userAns}</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${INTENT_LIGHT[q.answer]}`}>{isRight ? '✓' : '→'} {q.answer}</span>
                  </div>
                </div>
                {!isRight && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{q.why}</p>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🧠</span>
          <h3 className="text-xl font-bold">Station 5: Search Intent Classifier</h3>
        </div>
        <p className="text-rose-100 text-sm">Classify each query by search intent. 20 queries — rapid fire style.</p>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-500">{current + 1} / {QUERIES.length}</span>
          {streak >= 3 && <span className="text-sm font-bold text-orange-500">🔥 {streak} in a row!</span>}
          <span className="text-sm font-semibold text-gray-500">{answers.filter((a, i) => a !== null && a === QUERIES[i].answer).length} correct</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(current / QUERIES.length) * 100}%` }} />
        </div>
      </div>

      {/* Query card */}
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Search query</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-mono">"{q.query}"</p>

          {showFeedback && answers[current] !== null && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className={`mt-4 rounded-xl p-3 ${answers[current] === q.answer ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'}`}>
              <p className="font-bold text-sm">{answers[current] === q.answer ? '✅ Correct!' : `❌ It's ${q.answer}`}</p>
              <p className="text-xs mt-1 opacity-80">{q.why}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Intent buttons */}
      <div className="grid grid-cols-2 gap-3">
        {(['Informational', 'Navigational', 'Transactional', 'Commercial'] as Intent[]).map(intent => (
          <button key={intent}
            disabled={answers[current] !== null}
            onClick={() => handleAnswer(intent)}
            className={`${INTENT_COLORS[intent]} hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition active:scale-95 text-sm`}>
            {intent === 'Informational' ? '🔍' : intent === 'Navigational' ? '🧭' : intent === 'Transactional' ? '🛒' : '📊'} {intent}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-400">
        <p>🔍 Wants to learn</p>
        <p>🧭 Wants a site</p>
        <p>🛒 Wants to buy</p>
        <p>📊 Comparing options</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 6 — White Hat vs Black Hat Card Sort
// ─────────────────────────────────────────────────────────────────────────────

const TACTICS = [
  { id: 1, text: 'Writing a high-quality guest post for a relevant blog', answer: 'white' },
  { id: 2, text: 'Building 10 fake blogs to link to a client site (PBN)', answer: 'black' },
  { id: 3, text: 'Buying 500 links from a link farm overnight', answer: 'black' },
  { id: 4, text: 'Getting a natural editorial link from an industry publication', answer: 'white' },
  { id: 5, text: 'Using keyword stuffing — repeating a keyword 30 times in 200 words', answer: 'black' },
  { id: 6, text: 'Publishing original research that earns natural backlinks', answer: 'white' },
  { id: 7, text: 'Adding descriptive alt text to all website images', answer: 'white' },
  { id: 8, text: 'Cloaking — showing Google one page and users another', answer: 'black' },
  { id: 9, text: 'Disavowing toxic backlinks using Google Search Console', answer: 'white' },
  { id: 10, text: 'Paying for links without the rel="sponsored" attribute', answer: 'black' },
  { id: 11, text: 'Writing genuinely useful content that answers search intent', answer: 'white' },
  { id: 12, text: 'Spinning existing articles to create 100 "unique" versions', answer: 'black' },
  { id: 13, text: 'Building a local citation (NAP) on reputable directories', answer: 'white' },
  { id: 14, text: 'Using exact-match anchor text on every single backlink', answer: 'black' },
  { id: 15, text: 'Creating an infographic and promoting it for organic sharing', answer: 'white' },
]

function Station6({ onComplete, completed, score }: StationProps) {
  const [answers, setAnswers] = useState<Record<number, 'white' | 'black'>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Record<number, boolean>>({})

  const totalAnswered = Object.keys(answers).length

  const handleSort = (id: number, bucket: 'white' | 'black') => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [id]: bucket }))
  }

  const handleSubmit = () => {
    const r: Record<number, boolean> = {}
    TACTICS.forEach(t => { r[t.id] = answers[t.id] === t.answer })
    setResults(r)
    setSubmitted(true)
    const correct = Object.values(r).filter(Boolean).length
    if (!completed) onComplete(Math.round((correct / TACTICS.length) * 100))
  }

  const correctCount = submitted ? Object.values(results).filter(Boolean).length : 0

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-700 to-gray-800 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎭</span>
          <h3 className="text-xl font-bold">Station 6: White Hat vs Black Hat</h3>
        </div>
        <p className="text-gray-300 text-sm">Sort each SEO tactic into the right bucket. Google penalises Black Hat — know the difference.</p>
      </div>

      {submitted && (
        <div className={`rounded-2xl border p-4 text-center ${correctCount >= 13 ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'}`}>
          <p className="text-2xl font-black text-gray-900 dark:text-gray-50">{correctCount} / {TACTICS.length} correct</p>
          <p className="text-sm text-gray-500 mt-1">
            {correctCount === TACTICS.length ? '🏆 Perfect score — AMRYTT MEDIA Code of Ethics: Unlocked!' :
             correctCount >= 13 ? '✅ Strong ethical instincts!' : '📚 Review the red ones below'}
          </p>
        </div>
      )}

      {/* Buckets header */}
      <div className="grid grid-cols-2 gap-4 sticky top-16 z-10 bg-gray-50 dark:bg-gray-950 py-2">
        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 p-3 text-center">
          <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">✅ White Hat</p>
          <p className="text-xs text-gray-400">{Object.values(answers).filter(v => v === 'white').length} sorted</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-red-300 dark:border-red-700 p-3 text-center">
          <p className="font-bold text-red-700 dark:text-red-300 text-sm">❌ Black Hat</p>
          <p className="text-xs text-gray-400">{Object.values(answers).filter(v => v === 'black').length} sorted</p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {TACTICS.map(t => {
          const ans = answers[t.id]
          const isCorrect = submitted ? results[t.id] : null
          return (
            <motion.div key={t.id} layout
              className={`bg-white dark:bg-gray-900 rounded-xl border p-4 transition ${
                submitted
                  ? isCorrect ? 'border-emerald-300 dark:border-emerald-700' : 'border-red-300 dark:border-red-700'
                  : 'border-gray-100 dark:border-gray-800'
              }`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{t.text}</p>
                  {submitted && !isCorrect && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
                      → Correct: {t.answer === 'white' ? '✅ White Hat' : '❌ Black Hat'}
                    </p>
                  )}
                </div>
                {!submitted ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleSort(t.id, 'white')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${ans === 'white' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-emerald-400 hover:text-emerald-600'}`}>
                      ✅ White
                    </button>
                    <button onClick={() => handleSort(t.id, 'black')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${ans === 'black' ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-400 hover:text-red-600'}`}>
                      ❌ Black
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${isCorrect ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={totalAnswered < TACTICS.length}
          className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition">
          {totalAnswered < TACTICS.length ? `Sort all ${TACTICS.length - totalAnswered} remaining cards first` : 'Submit my answers →'}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 7 — URL Anatomy Dissector + Slug Builder
// ─────────────────────────────────────────────────────────────────────────────

const URL_PARTS = [
  { id: 'protocol', label: 'Protocol', value: 'https://', color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800', hint: 'Tells the browser how to communicate (HTTP vs HTTPS)' },
  { id: 'subdomain', label: 'Subdomain', value: 'blog.', color: 'bg-violet-500', textColor: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-950', border: 'border-violet-200 dark:border-violet-800', hint: 'A section/prefix of the main domain (not always present)' },
  { id: 'domain', label: 'Domain', value: 'guestpostlinks', color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800', hint: 'The registered name — the core identity of the website' },
  { id: 'tld', label: 'TLD', value: '.net', color: 'bg-amber-500', textColor: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800', hint: 'Top-Level Domain: .com .net .org .in etc.' },
  { id: 'subfolder', label: 'Subfolder', value: '/seo-tips/', color: 'bg-rose-500', textColor: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950', border: 'border-rose-200 dark:border-rose-800', hint: 'A category or section within the site' },
  { id: 'slug', label: 'Slug', value: 'how-to-build-backlinks', color: 'bg-cyan-500', textColor: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-200 dark:border-cyan-800', hint: 'The unique identifier for this specific page — should include target keyword' },
]

const SLUG_TITLE = 'Top 10 Mistakes That Kill Your SEO Rankings in 2024'
const IDEAL_SLUG = 'top-10-mistakes-kill-seo-rankings'

function Station7({ onComplete, completed, score }: StationProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [labelAnswers, setLabelAnswers] = useState<Record<string, string>>({})
  const [partADone, setPartADone] = useState(false)
  const [slug, setSlug] = useState('')
  const [slugSubmitted, setSlugSubmitted] = useState(false)

  const checkSlug = (s: string) => {
    const lower = s === s.toLowerCase()
    const noSpaces = !s.includes(' ')
    const hasHyphens = s.includes('-')
    const noStopWords = !/(^|-)(the|that|in|a|an|and|or|of|to|your)(-|$)/i.test(s)
    const hasKeyword = s.includes('seo') && s.includes('ranking')
    const goodLength = s.length <= 60
    return { lower, noSpaces, hasHyphens, noStopWords, hasKeyword, goodLength }
  }

  const slugChecks = checkSlug(slug)
  const slugScore = Object.values(slugChecks).filter(Boolean).length

  const handleLabelClick = (partId: string) => {
    if (partADone) return
    setSelectedPart(partId === selectedPart ? null : partId)
  }

  const handleLabelDrop = (partId: string) => {
    if (!selectedPart || partADone) return
    setLabelAnswers(prev => ({ ...prev, [selectedPart]: partId }))
    setSelectedPart(null)
  }

  const partACorrect = URL_PARTS.every(p => labelAnswers[p.id] === p.id)

  const handlePartASubmit = () => {
    setPartADone(true)
  }

  const handleSlugSubmit = () => {
    setSlugSubmitted(true)
    const s = Math.round(((partACorrect ? 50 : 25) + (slugScore / 6) * 50))
    if (!completed) onComplete(s)
  }

  const fullUrl = URL_PARTS.map(p => p.value).join('')

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-cyan-600 to-sky-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔗</span>
          <h3 className="text-xl font-bold">Station 7: URL Anatomy Dissector</h3>
        </div>
        <p className="text-cyan-100 text-sm">Part A: Click a URL segment, then click its label. Part B: Build the perfect slug for a blog post.</p>
      </div>

      {/* Part A */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Part A — Identify each part of this URL</p>

        {/* URL display */}
        <div className="flex flex-wrap gap-0 mb-6 font-mono text-sm bg-gray-50 dark:bg-gray-800 rounded-xl p-4 overflow-x-auto">
          {URL_PARTS.map(p => {
            const assigned = labelAnswers[p.id]
            const correct = partADone && assigned === p.id
            const wrong = partADone && assigned && assigned !== p.id
            return (
              <button
                key={p.id}
                disabled={partADone}
                onClick={() => handleLabelDrop(p.id)}
                className={`px-1 py-0.5 rounded transition font-mono text-sm border-b-2 ${
                  selectedPart ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700' : ''
                } ${
                  partADone
                    ? correct ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300' :
                      wrong ? 'border-red-500 text-red-700 dark:text-red-300' :
                      'border-gray-300 text-gray-500'
                    : 'border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                {p.value}
              </button>
            )
          })}
        </div>

        {/* Labels to assign */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {URL_PARTS.map(p => {
            const isSelected = selectedPart === p.id
            const isAssigned = Object.values(labelAnswers).includes(p.id)
            return (
              <button
                key={p.id}
                disabled={partADone}
                onClick={() => handleLabelClick(p.id)}
                className={`text-xs font-bold px-2 py-2 rounded-lg border transition text-center ${
                  isSelected ? `${p.bg} ${p.border} ${p.textColor} ring-2 ring-offset-1` :
                  isAssigned && !partADone ? 'opacity-40 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400' :
                  `${p.bg} ${p.border} ${p.textColor} hover:opacity-80`
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 mb-3">
          {selectedPart
            ? `Selected: "${URL_PARTS.find(p => p.id === selectedPart)?.label}" — now click the part of the URL it belongs to`
            : 'Click a label first, then click the URL segment it describes'}
        </p>

        {partADone ? (
          <div className={`rounded-xl p-3 text-sm font-semibold ${partACorrect ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
            {partACorrect ? '✅ Perfect! You can read any URL like a map now.' : '⚠️ Some were off — check the highlighted segments. The correct labels: Protocol · Subdomain · Domain · TLD · Subfolder · Slug'}
          </div>
        ) : Object.keys(labelAnswers).length === URL_PARTS.length ? (
          <button onClick={handlePartASubmit}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm px-5 py-2 rounded-xl transition">
            Check Part A →
          </button>
        ) : (
          <p className="text-xs text-gray-400">{Object.keys(labelAnswers).length}/{URL_PARTS.length} labels assigned</p>
        )}
      </div>

      {/* Part B — Slug Builder */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Part B — Build the optimal URL slug</p>
        <div className="bg-sky-50 dark:bg-sky-950 rounded-xl border border-sky-100 dark:border-sky-800 p-3 mb-4">
          <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-widest mb-1">Blog post title</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{SLUG_TITLE}</p>
        </div>

        <div className="flex items-center gap-2 mb-3 font-mono text-sm bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
          <span className="text-gray-400">https://guestpostlinks.net/blog/</span>
          <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            disabled={slugSubmitted}
            placeholder="your-slug-here"
            className="flex-1 bg-transparent text-cyan-700 dark:text-cyan-300 font-bold focus:outline-none"
          />
        </div>

        {/* Slug criteria */}
        {slug.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { label: 'All lowercase', ok: slugChecks.lower },
              { label: 'No spaces', ok: slugChecks.noSpaces },
              { label: 'Uses hyphens', ok: slugChecks.hasHyphens },
              { label: 'No stop words', ok: slugChecks.noStopWords },
              { label: 'Has keywords', ok: slugChecks.hasKeyword },
              { label: 'Under 60 chars', ok: slugChecks.goodLength },
            ].map(c => (
              <div key={c.label} className={`text-xs font-semibold rounded-lg px-2 py-1.5 flex items-center gap-1.5 ${c.ok ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
                <span>{c.ok ? '✓' : '✗'}</span> {c.label}
              </div>
            ))}
          </div>
        )}

        {slugSubmitted ? (
          <div className={`rounded-xl p-4 ${slugScore >= 5 ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
            <p className="font-bold text-sm mb-1">{slugScore >= 5 ? '✅ Excellent slug!' : `${slugScore}/6 criteria met`}</p>
            <p className="text-xs">An example ideal slug: <code className="bg-white dark:bg-gray-900 px-1 rounded font-mono">{IDEAL_SLUG}</code></p>
          </div>
        ) : (
          <button onClick={handleSlugSubmit} disabled={slug.length === 0}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition">
            Submit slug →
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 8 — Backlink Quality Arena
// ─────────────────────────────────────────────────────────────────────────────

interface Backlink {
  id: number
  site: string
  dr: number
  type: 'Dofollow' | 'Nofollow'
  placement: 'Body' | 'Sidebar' | 'Footer'
  anchor: 'Branded' | 'Exact Match' | 'Generic' | 'Naked URL'
  why: string
}

const BACKLINKS: Backlink[] = [
  { id: 1, site: 'Forbes.com', dr: 94, type: 'Dofollow', placement: 'Body', anchor: 'Branded', why: 'Highest DR + dofollow + body placement. The gold standard.' },
  { id: 2, site: 'TechNiche.io', dr: 52, type: 'Dofollow', placement: 'Body', anchor: 'Branded', why: 'Mid DR but dofollow body link from a relevant niche site — solid value.' },
  { id: 3, site: 'Wikipedia.org', dr: 94, type: 'Nofollow', placement: 'Body', anchor: 'Branded', why: 'High authority but nofollow = no equity. Great for traffic and trust, not rankings.' },
  { id: 4, site: 'MarketingHub.com', dr: 38, type: 'Dofollow', placement: 'Body', anchor: 'Exact Match', why: 'Decent DR, dofollow, body — but exact-match anchor overuse is risky.' },
  { id: 5, site: 'BlogDirectory.net', dr: 22, type: 'Dofollow', placement: 'Sidebar', why: 'Low DR + sidebar placement = weak signal.', anchor: 'Generic' },
  { id: 6, site: 'Forum-Spam.ru', dr: 8, type: 'Dofollow', placement: 'Footer', anchor: 'Exact Match', why: 'Low DR + footer + spammy domain = potential negative signal.' },
  { id: 7, site: 'SEOInsider.blog', dr: 61, type: 'Dofollow', placement: 'Body', anchor: 'Generic', why: 'Good DR, dofollow, body. Generic anchor is natural and safe.' },
  { id: 8, site: 'LocalNews.co.in', dr: 15, type: 'Nofollow', placement: 'Body', anchor: 'Branded', why: 'Low DR + nofollow = minimal value. Traffic might come though.' },
]

const CORRECT_ORDER = [1, 7, 2, 4, 3, 5, 8, 6] // by SEO value desc

function Station8({ onComplete, completed, score }: StationProps) {
  const [ranking, setRanking] = useState<number[]>(BACKLINKS.map(b => b.id))
  const [submitted, setSubmitted] = useState(false)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  // Use refs so drag state never triggers re-renders during the drag
  const dragStartIdx = useRef<number | null>(null)
  const rankingRef = useRef(ranking)
  rankingRef.current = ranking

  const moveItem = (fromIdx: number, toIdx: number) => {
    const next = [...rankingRef.current]
    const [item] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, item)
    setRanking(next)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    let pts = BACKLINKS.length
    ranking.forEach((id, i) => { if (CORRECT_ORDER[i] !== id) pts-- })
    if (!completed) onComplete(Math.max(0, Math.round((pts / BACKLINKS.length) * 100)))
  }

  const getLink = (id: number) => BACKLINKS.find(b => b.id === id)!

  const drColor = (dr: number) =>
    dr >= 70 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
    dr >= 40 ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🏆</span>
          <h3 className="text-xl font-bold">Station 8: Backlink Quality Arena</h3>
        </div>
        <p className="text-orange-100 text-sm">Rank these 8 backlinks from most to least valuable. Drag cards to reorder, or use the ▲▼ buttons. Consider DR, link type, placement, and anchor text.</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-100 dark:border-amber-800 p-4 text-xs text-amber-700 dark:text-amber-300">
        <p className="font-bold mb-1">Ranking factors to consider:</p>
        <div className="grid grid-cols-2 gap-1">
          <p>• <strong>DR</strong>: Higher = more equity transferred</p>
          <p>• <strong>Dofollow</strong>: Passes juice / Nofollow: doesn't</p>
          <p>• <strong>Body</strong> beats Sidebar beats Footer</p>
          <p>• <strong>Branded/Generic</strong> anchors = safer than Exact Match</p>
        </div>
      </div>

      <div className="space-y-2">
        {ranking.map((id, idx) => {
          const link = getLink(id)
          const correctPos = CORRECT_ORDER.indexOf(id)
          const isCorrectPos = submitted && correctPos === idx
          const isDragOver = !submitted && dragOverIdx === idx

          return (
            <div
              key={id}
              draggable={!submitted}
              onDragStart={e => {
                dragStartIdx.current = idx
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                // Only update visual indicator — don't move items yet
                if (dragOverIdx !== idx) setDragOverIdx(idx)
              }}
              onDrop={e => {
                e.preventDefault()
                // Move only on drop — this prevents the jitter
                if (dragStartIdx.current !== null && dragStartIdx.current !== idx) {
                  moveItem(dragStartIdx.current, idx)
                }
                dragStartIdx.current = null
                setDragOverIdx(null)
              }}
              onDragEnd={() => {
                dragStartIdx.current = null
                setDragOverIdx(null)
              }}
              className={`bg-white dark:bg-gray-900 rounded-xl border p-4 transition select-none ${
                submitted
                  ? isCorrectPos
                    ? 'border-emerald-300 dark:border-emerald-700'
                    : 'border-red-300 dark:border-red-700'
                  : isDragOver
                  ? 'border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-950'
                  : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 cursor-grab active:cursor-grabbing'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  submitted
                    ? isCorrectPos ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{link.site}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${drColor(link.dr)}`}>DR {link.dr}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${link.type === 'Dofollow' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{link.type}</span>
                    <span className="text-[10px] text-gray-400">{link.placement}</span>
                    <span className="text-[10px] text-gray-400">· {link.anchor}</span>
                  </div>
                  {submitted && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {isCorrectPos ? '✓ ' : `→ Should be #${correctPos + 1}. `}{link.why}
                    </p>
                  )}
                </div>
                {/* Arrow buttons as fallback for touch/mobile */}
                {!submitted && (
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => idx > 0 && moveItem(idx, idx - 1)}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 rounded transition text-xs"
                    >▲</button>
                    <button
                      onClick={() => idx < ranking.length - 1 && moveItem(idx, idx + 1)}
                      disabled={idx === ranking.length - 1}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 rounded transition text-xs"
                    >▼</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!submitted ? (
        <button onClick={handleSubmit}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition">
          Submit my ranking →
        </button>
      ) : (
        <div className="bg-orange-50 dark:bg-orange-950 rounded-2xl border border-orange-100 dark:border-orange-800 p-5 text-center">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            <strong>Quality rule:</strong> DR + Dofollow + Body placement = the three pillars of a valuable backlink. A DR 94 nofollow (Wikipedia) is worth less for SEO than a DR 52 dofollow from a relevant niche blog.
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station 9 — Inbound vs Outbound: Link Direction Lab
// ─────────────────────────────────────────────────────────────────────────────

type LinkDir = 'inbound' | 'outbound'

const SITES_S9 = [
  { id: 'newswire', name: 'NewsWire.com',      emoji: '📡', desc: 'A news website',            color: 'violet'  },
  { id: 'techblog', name: 'TechBlog.com',       emoji: '📰', desc: 'The guest post publisher',  color: 'blue'    },
  { id: 'gpl',      name: 'GuestPostLinks.net', emoji: '🔗', desc: "Your client's site",        color: 'emerald' },
  { id: 'wiki',     name: 'Wikipedia.org',      emoji: '📚', desc: 'Authority reference site',  color: 'gray'    },
]

const CONNECTIONS_S9 = [
  {
    id: 'a', from: 'newswire', to: 'techblog',
    context: 'NewsWire published an article that references and links to TechBlog',
  },
  {
    id: 'b', from: 'techblog', to: 'gpl',
    context: 'AMRYTT publishes a guest post on TechBlog with a link to the client (GuestPostLinks.net)',
  },
  {
    id: 'c', from: 'techblog', to: 'wiki',
    context: "TechBlog's article links to Wikipedia as an authority source",
  },
]

const SITE_COLORS_S9: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  violet:  { bg: 'bg-violet-50 dark:bg-violet-950',   border: 'border-violet-200 dark:border-violet-800',   text: 'text-violet-700 dark:text-violet-300',   ring: 'ring-violet-400'  },
  blue:    { bg: 'bg-blue-50 dark:bg-blue-950',       border: 'border-blue-200 dark:border-blue-800',       text: 'text-blue-700 dark:text-blue-300',       ring: 'ring-blue-400'    },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-400' },
  gray:    { bg: 'bg-gray-50 dark:bg-gray-900',       border: 'border-gray-200 dark:border-gray-700',       text: 'text-gray-600 dark:text-gray-400',       ring: 'ring-gray-400'    },
}

const SCENARIOS_S9 = [
  {
    situation: 'TechBlog.com publishes a guest post containing a link pointing to GuestPostLinks.net.',
    question: "For GuestPostLinks.net, this link is...",
    answer: 'inbound' as LinkDir,
    why: "GuestPostLinks.net is RECEIVING the link from TechBlog. Any link pointing INTO your site from another domain = inbound link (also called a backlink). This is exactly what AMRYTT builds for clients.",
  },
  {
    situation: 'The same article on TechBlog.com contains a link pointing to GuestPostLinks.net.',
    question: "For TechBlog.com, that exact same link is...",
    answer: 'outbound' as LinkDir,
    why: "TechBlog.com is SENDING the link OUT to another domain. The same link is inbound for the receiver AND outbound for the sender — simultaneously. One link, two names.",
  },
  {
    situation: 'AMRYTT publishes 10 guest posts across different websites, each containing a link to a client website.',
    question: "The client website has just gained 10 new...",
    answer: 'inbound' as LinkDir,
    why: "10 links pointing INTO the client site = 10 new inbound links (backlinks). This is AMRYTT's core deliverable — every guest post creates one inbound link for the client.",
  },
  {
    situation: 'A guest post article cites Wikipedia, BBC News, and Investopedia by linking to them as sources.',
    question: "From the publisher's website perspective, all 3 source links are...",
    answer: 'outbound' as LinkDir,
    why: "The publisher's site is linking OUT to 3 other domains. Every link that leaves your domain is an outbound link — regardless of how reputable the destination is.",
  },
  {
    situation: 'Google Search Console shows 820 backlinks pointing to GuestPostLinks.net.',
    question: "All 820 backlinks are... for GuestPostLinks.net.",
    answer: 'inbound' as LinkDir,
    why: '"Backlinks" and "inbound links" are the same thing — links pointing INTO your site from other domains. This is the #1 metric link building campaigns aim to grow.',
  },
  {
    situation: "Forbes.com publishes an article and includes a link to a client's website.",
    question: "For Forbes.com, the link to the client site is...",
    answer: 'outbound' as LinkDir,
    why: "Forbes is PLACING the link in their content, pointing OUT to another domain. For Forbes.com, that's an outbound link — they are the sender.",
  },
  {
    situation: "Forbes.com publishes an article and includes a link to a client's website.",
    question: "For the client's website, the Forbes link is...",
    answer: 'inbound' as LinkDir,
    why: "The client's site is RECEIVING the link from Forbes. An inbound link from Forbes.com (DR 94) is one of the most valuable backlinks possible — the receiver always calls it inbound.",
  },
  {
    situation: "AMRYTT's own website has a resources page linking to Ahrefs, SEMrush, and Google Search Console.",
    question: "From AMRYTT's website's perspective, all 3 tool links are...",
    answer: 'outbound' as LinkDir,
    why: "AMRYTT.com is linking OUT to 3 external tools. These are outbound links. Outbound links to quality resources don't hurt you — they can signal credibility to Google.",
  },
]

function Station9({ onComplete, completed, score }: StationProps) {
  const [selectedSite, setSelectedSite] = useState<string>('techblog')
  const [current, setCurrent]           = useState(0)
  const [answers, setAnswers]           = useState<(LinkDir | null)[]>(Array(SCENARIOS_S9.length).fill(null))
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished]         = useState(false)

  const q = SCENARIOS_S9[current]

  const getLinkStatus = (conn: typeof CONNECTIONS_S9[0]) => {
    if (selectedSite === conn.to)   return 'inbound'
    if (selectedSite === conn.from) return 'outbound'
    return 'neutral'
  }

  const selectedSiteData = SITES_S9.find(s => s.id === selectedSite)
  const inboundCount  = CONNECTIONS_S9.filter(c => c.to   === selectedSite).length
  const outboundCount = CONNECTIONS_S9.filter(c => c.from === selectedSite).length

  const handleAnswer = (choice: LinkDir) => {
    if (answers[current] !== null) return
    const newAnswers = [...answers]
    newAnswers[current] = choice
    setAnswers(newAnswers)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      if (current < SCENARIOS_S9.length - 1) {
        setCurrent(c => c + 1)
      } else {
        setFinished(true)
        if (!completed) {
          const correct = newAnswers.filter((a, i) => a === SCENARIOS_S9[i].answer).length
          onComplete(Math.round((correct / SCENARIOS_S9.length) * 100))
        }
      }
    }, 1900)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-fuchsia-600 to-violet-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🧭</span>
          <h3 className="text-xl font-bold">Station 9: Link Direction Lab</h3>
        </div>
        <p className="text-fuchsia-100 text-sm">Master inbound vs outbound links — the most confused concept in SEO. Same link, two different names. It all depends on your perspective.</p>
      </div>

      {/* Core concept */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">The core insight</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <p className="font-bold text-emerald-800 dark:text-emerald-200 text-sm mb-1">↙ Inbound Link</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">A link coming INTO your website from another website. Also called a backlink. This is what AMRYTT builds for clients.</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <p className="font-bold text-orange-800 dark:text-orange-200 text-sm mb-1">↗ Outbound Link</p>
            <p className="text-xs text-orange-700 dark:text-orange-300">A link going OUT from your website to another website. Every link you place in your content is outbound from your site.</p>
          </div>
        </div>
        <div className="bg-fuchsia-50 dark:bg-fuchsia-950 border border-fuchsia-100 dark:border-fuchsia-800 rounded-xl px-4 py-3">
          <p className="text-sm text-fuchsia-800 dark:text-fuchsia-200 font-semibold">⚡ Key Rule: Every single link is BOTH at the same time — outbound for the site that placed it, inbound for the site it points to. Your perspective determines the name.</p>
        </div>
      </div>

      {/* Interactive perspective switcher */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">🔬 Perspective Lab — click any website to see its link types</p>

        {/* Site selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SITES_S9.map(site => {
            const c = SITE_COLORS_S9[site.color]
            const isSelected = selectedSite === site.id
            return (
              <button key={site.id}
                onClick={() => setSelectedSite(site.id)}
                className={`text-left rounded-xl border p-3 transition ${
                  isSelected ? `${c.bg} ${c.border} ring-2 ${c.ring}` : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{site.emoji}</span>
                  <span className={`text-xs font-bold truncate ${isSelected ? c.text : 'text-gray-500 dark:text-gray-400'}`}>{site.name}</span>
                </div>
                <p className="text-[10px] text-gray-400">{site.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Inbound / outbound count for selected site */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-200 dark:border-emerald-800 p-3 text-center">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{inboundCount}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Inbound link{inboundCount !== 1 ? 's' : ''}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">links coming IN to {selectedSiteData?.name}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950 rounded-xl border border-orange-200 dark:border-orange-800 p-3 text-center">
            <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{outboundCount}</p>
            <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold">Outbound link{outboundCount !== 1 ? 's' : ''}</p>
            <p className="text-[10px] text-orange-600 dark:text-orange-500 mt-0.5">links going OUT from {selectedSiteData?.name}</p>
          </div>
        </div>

        {/* Connection list */}
        <div className="space-y-2">
          {CONNECTIONS_S9.map(conn => {
            const status   = getLinkStatus(conn)
            const fromSite = SITES_S9.find(s => s.id === conn.from)!
            const toSite   = SITES_S9.find(s => s.id === conn.to)!
            return (
              <div key={conn.id}
                className={`rounded-xl border p-4 transition ${
                  status === 'inbound'  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50' :
                  status === 'outbound' ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/50' :
                  'border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span>{fromSite.emoji}</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fromSite.name}</span>
                  <span className={`text-lg font-black ${
                    status === 'outbound' ? 'text-orange-500' :
                    status === 'inbound'  ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'
                  }`}>→</span>
                  <span>{toSite.emoji}</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{toSite.name}</span>
                  {status === 'inbound' && (
                    <span className="ml-auto text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white">↙ INBOUND</span>
                  )}
                  {status === 'outbound' && (
                    <span className="ml-auto text-xs font-black px-2.5 py-1 rounded-full bg-orange-500 text-white">↗ OUTBOUND</span>
                  )}
                  {status === 'neutral' && (
                    <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">not {selectedSiteData?.name}&apos;s link</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">{conn.context}</p>
                {status !== 'neutral' && (
                  <p className={`text-xs font-semibold mt-1.5 ${status === 'inbound' ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'}`}>
                    {status === 'inbound'
                      ? `↙ This link points INTO ${selectedSiteData?.name} — inbound for them`
                      : `↗ ${selectedSiteData?.name} placed this link pointing OUT — outbound for them`}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {selectedSite === 'techblog' && (
          <div className="bg-fuchsia-50 dark:bg-fuchsia-950 border border-fuchsia-100 dark:border-fuchsia-800 rounded-xl p-3">
            <p className="text-xs font-bold text-fuchsia-800 dark:text-fuchsia-200">💡 TechBlog.com has BOTH types simultaneously</p>
            <p className="text-xs text-fuchsia-700 dark:text-fuchsia-300 mt-1">NewsWire links TO TechBlog (1 inbound) while TechBlog links OUT to 2 sites (2 outbound). Every real website has both — there is no such thing as a site with only one type.</p>
          </div>
        )}
      </div>

      {/* Rapid-fire challenge */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-600 to-violet-700 px-5 py-4">
          <p className="font-bold text-white">🎯 Challenge: 8 Real-world Scenarios</p>
          <p className="text-fuchsia-200 text-xs mt-0.5">Read each scenario carefully — the same link can have a different answer depending on whose perspective is asked.</p>
        </div>

        {finished ? (
          <div className="p-5 space-y-4">
            {(() => {
              const correct = answers.filter((a, i) => a === SCENARIOS_S9[i].answer).length
              const pct     = Math.round((correct / SCENARIOS_S9.length) * 100)
              return (
                <>
                  <div className={`rounded-xl p-4 text-center ${pct >= 75 ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-amber-50 dark:bg-amber-950'}`}>
                    <p className="text-3xl font-black text-gray-900 dark:text-gray-50">{correct} / {SCENARIOS_S9.length}</p>
                    <p className={`text-sm font-bold mt-1 ${pct >= 75 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                      {pct >= 87 ? '🏆 Link Direction Master!' : pct >= 75 ? '✅ Solid understanding!' : pct >= 50 ? '⚠️ Getting there — review the ones you missed' : '📚 Re-read the perspective lab above and try again'}
                    </p>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {SCENARIOS_S9.map((s, i) => {
                      const userAns = answers[i]
                      const isRight = userAns === s.answer
                      return (
                        <div key={i} className={`rounded-xl border p-3 ${isRight ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50'}`}>
                          <div className="flex items-start gap-2 mb-1">
                            <span className={`text-xs font-black flex-shrink-0 ${isRight ? 'text-emerald-600' : 'text-red-600'}`}>{isRight ? '✓' : '✗'}</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{s.question}</p>
                          </div>
                          {!isRight && (
                            <div className="flex gap-3 ml-4 mb-1">
                              <span className="text-xs text-red-600 dark:text-red-400">You: {userAns}</span>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">Answer: {s.answer}</span>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 ml-4">{s.why}</p>
                        </div>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{current + 1} / {SCENARIOS_S9.length}</span>
              <span>{answers.filter((a, i) => a !== null && a === SCENARIOS_S9[i].answer).length} correct so far</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-fuchsia-500 rounded-full transition-all duration-300" style={{ width: `${(current / SCENARIOS_S9.length) * 100}%` }} />
            </div>

            {/* Scenario card */}
            <AnimatePresence mode="wait">
              <motion.div key={current}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
                className="space-y-3"
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Scenario</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{q.situation}</p>
                </div>
                <div className="bg-fuchsia-50 dark:bg-fuchsia-950 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800 px-4 py-3">
                  <p className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-widest mb-1">Question</p>
                  <p className="text-sm font-semibold text-fuchsia-900 dark:text-fuchsia-100">{q.question}</p>
                </div>

                {showFeedback && answers[current] !== null && (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-xl p-3 border ${answers[current] === q.answer
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
                    <p className={`font-bold text-sm mb-1 ${answers[current] === q.answer ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                      {answers[current] === q.answer ? '✅ Correct!' : `❌ It's "${q.answer}"`}
                    </p>
                    <p className={`text-xs ${answers[current] === q.answer ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{q.why}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Answer buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button disabled={answers[current] !== null} onClick={() => handleAnswer('inbound')}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition active:scale-95">
                ↙ Inbound
              </button>
              <button disabled={answers[current] !== null} onClick={() => handleAnswer('outbound')}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition active:scale-95">
                ↗ Outbound
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">Inbound = link coming IN to that site · Outbound = link going OUT from that site</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Station Card (overview grid)
// ─────────────────────────────────────────────────────────────────────────────

const STATION_META = [
  { num: 1, title: 'The Link Lab', emoji: '⚡', color: 'from-blue-500 to-indigo-600', desc: 'Toggle rel= attributes and watch juice flow' },
  { num: 2, title: 'SERP Traffic Engine', emoji: '📊', color: 'from-violet-500 to-purple-600', desc: 'Move your ranking and see traffic change live' },
  { num: 3, title: 'Meta Description Studio', emoji: '🪟', color: 'from-teal-500 to-emerald-600', desc: 'Write snippets with live SERP preview' },
  { num: 4, title: 'Keyword Density Analyzer', emoji: '🔬', color: 'from-amber-500 to-orange-600', desc: 'Measure density in real time — spot stuffing' },
  { num: 5, title: 'Search Intent Classifier', emoji: '🧠', color: 'from-rose-500 to-pink-600', desc: '20 rapid-fire queries to classify' },
  { num: 6, title: 'White Hat vs Black Hat', emoji: '🎭', color: 'from-slate-600 to-gray-700', desc: 'Sort 15 tactics into the right bucket' },
  { num: 7, title: 'URL Anatomy Dissector', emoji: '🔗', color: 'from-cyan-500 to-sky-600', desc: 'Label URL parts · Build the perfect slug' },
  { num: 8, title: 'Backlink Quality Arena', emoji: '🏆', color: 'from-orange-500 to-rose-600', desc: 'Rank 8 backlinks from best to worst' },
  { num: 9, title: 'Link Direction Lab', emoji: '🧭', color: 'from-fuchsia-600 to-violet-700', desc: 'Classify 8 link scenarios as inbound or outbound' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main Playground
// ─────────────────────────────────────────────────────────────────────────────

export default function Lesson28Playground() {
  const [activeStation, setActiveStation] = useState<number | null>(null)
  const [scores, setScores] = useState<Record<number, number>>({})
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const stationRef = useRef<HTMLDivElement>(null)

  const handleComplete = useCallback((stationNum: number, score: number) => {
    setScores(prev => ({ ...prev, [stationNum]: score }))
    setCompleted(prev => new Set([...prev, stationNum]))
  }, [])

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const maxTotal = MAX_SCORES.reduce((a, b) => a + b, 0)
  const allDone = completed.size === 9

  const handleOpenStation = (num: number) => {
    setActiveStation(num)
    setTimeout(() => stationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const STATION_COMPONENTS = [Station1, Station2, Station3, Station4, Station5, Station6, Station7, Station8, Station9]
  const ActiveComponent = activeStation ? STATION_COMPONENTS[activeStation - 1] : null

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-rose-100 text-sm font-semibold uppercase tracking-widest mb-3">Module 4 · Interactive Learning</p>
          <h2 className="text-3xl font-bold mb-3">SEO Playground</h2>
          <p className="text-rose-50 leading-relaxed max-w-lg mb-5">
            9 hands-on stations. No passive reading — you build, toggle, classify, and rank. Every station reinforces a concept from Modules 1–3.
          </p>
          {allDone ? (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold px-4 py-2 rounded-xl border border-white/30">
              🏆 {completed.size}/9 completed · {totalScore}/{maxTotal} XP
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-xl border border-white/30">
                {completed.size}/9 stations done
              </div>
              {completed.size > 0 && (
                <div className="text-rose-100 text-sm">{totalScore} XP earned</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* All-done banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">🎓</p>
            <p className="text-xl font-black mb-1">Playground Graduate!</p>
            <p className="text-emerald-100">You completed all 9 stations and scored <strong>{totalScore}/{maxTotal} XP</strong>. You now have hands-on experience with the core concepts behind every guest post AMRYTT Media delivers.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Station grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {STATION_META.map((s, i) => {
          const isDone = completed.has(s.num)
          const stScore = scores[s.num]
          const isActive = activeStation === s.num
          return (
            <motion.button
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleOpenStation(s.num)}
              className={`text-left rounded-2xl border overflow-hidden transition group ${
                isActive
                  ? 'border-rose-400 dark:border-rose-600 shadow-md ring-2 ring-rose-300 dark:ring-rose-700'
                  : isDone
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <div className={`bg-gradient-to-r ${s.color} px-5 py-4 flex items-center gap-4`}>
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Station {s.num}</p>
                  <p className="font-bold text-white truncate">{s.title}</p>
                </div>
                {isDone && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-white text-xs font-black">{stScore} XP</div>
                    <div className="text-white/70 text-[10px]">✓ done</div>
                  </div>
                )}
              </div>
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
                <span className="text-gray-300 dark:text-gray-600 group-hover:text-rose-400 transition text-lg flex-shrink-0">→</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Active station */}
      <AnimatePresence mode="wait">
        {activeStation && ActiveComponent && (
          <motion.div
            key={activeStation}
            ref={stationRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="border-t-4 border-rose-400 pt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Active: Station {activeStation} of 9
              </p>
              <button onClick={() => setActiveStation(null)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition">
                ↑ Back to overview
              </button>
            </div>
            <ActiveComponent
              onComplete={(s) => handleComplete(activeStation, s)}
              completed={completed.has(activeStation)}
              score={scores[activeStation] ?? 0}
            />
            {/* Next station nav */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => handleOpenStation(Math.max(1, activeStation - 1))}
                disabled={activeStation === 1}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                ← Station {activeStation - 1}
              </button>
              <button
                onClick={() => handleOpenStation(Math.min(9, activeStation + 1))}
                disabled={activeStation === 9}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition">
                Station {activeStation + 1} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score bar */}
      {completed.size > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Your Progress</p>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{totalScore} / {maxTotal} XP</p>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
              animate={{ width: `${(totalScore / maxTotal) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATION_META.map(s => {
              const isDone = completed.has(s.num)
              return (
                <div key={s.num} className={`text-[10px] font-bold px-2 py-1 rounded-full ${isDone ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  S{s.num} {isDone ? `✓ ${scores[s.num]}` : '—'}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
