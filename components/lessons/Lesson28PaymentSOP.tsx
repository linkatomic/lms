'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  CreditCard, Building2, Globe, Banknote, AlertTriangle,
  Coins, Wallet, Zap, ChevronDown, ChevronUp, BookOpen,
  Star, ArrowLeftRight, ShieldCheck, ShieldAlert, Clock,
  DollarSign, Info, FileText, CheckCircle2, XCircle,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Shared helpers (same pattern as Key Terminologies lessons)
// ─────────────────────────────────────────────────────────────

function DefinitionCard({ children, color = 'emerald' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue:    'border-l-blue-500 bg-blue-50 dark:bg-blue-950/40',
    indigo:  'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
    emerald: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    orange:  'border-l-orange-500 bg-orange-50 dark:bg-orange-950/40',
    violet:  'border-l-violet-500 bg-violet-50 dark:bg-violet-950/40',
    amber:   'border-l-amber-500 bg-amber-50 dark:bg-amber-950/40',
    teal:    'border-l-teal-500 bg-teal-50 dark:bg-teal-950/40',
    pink:    'border-l-pink-500 bg-pink-50 dark:bg-pink-950/40',
  }
  return (
    <div className={`border-l-4 ${colors[color] ?? colors.emerald} rounded-r-xl px-5 py-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed`}>
      {children}
    </div>
  )
}

function ExampleBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
      {children}
    </div>
  )
}

function AmryttBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white">
      <Star className="w-5 h-5 flex-shrink-0 mt-0.5 fill-yellow-300 text-yellow-300" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function InternalRuleBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{children}</div>
    </div>
  )
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{children}</div>
    </div>
  )
}

function SafetyBadge({ level }: { level: 'safe' | 'risky' | 'medium' }) {
  if (level === 'safe') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
      <ShieldCheck className="w-3 h-3" /> Safe
    </span>
  )
  if (level === 'risky') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
      <ShieldAlert className="w-3 h-3" /> High Risk
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
      <ShieldAlert className="w-3 h-3" /> Medium Risk
    </span>
  )
}

function FeeRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-bold text-gray-900 dark:text-gray-50">{value}</span>
        {note && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{note}</p>}
      </div>
    </div>
  )
}

function Screenshot({ src, alt, caption, label }: {
  src: string; alt: string; caption?: string; label?: string
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      {label && (
        <div className="flex items-center gap-2 bg-gray-800 dark:bg-gray-950 px-4 py-2">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-300 text-xs font-semibold">{label}</span>
        </div>
      )}
      <img src={src} alt={alt} className="w-full block" loading="lazy" />
      {caption && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 italic">
          {caption}
        </div>
      )}
    </div>
  )
}

// Expandable sub-card (used for India bank types, Wise options)
function SubCard({ number, name, badge, badgeColor, description, meta }: {
  number: number; name: string; badge?: string; badgeColor?: string; description: string; meta?: string
}) {
  const [open, setOpen] = useState(false)
  const badgeCls = badgeColor === 'emerald'
    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
    : badgeColor === 'orange'
    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
    : badgeColor === 'violet'
    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
      >
        <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-50 flex-1">{name}</span>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>{badge}</span>
        )}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
              {meta && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">{meta}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Navigation data
// ─────────────────────────────────────────────────────────────

const METHODS = [
  { id: 'paypal',       label: 'PayPal',           shortLabel: 'PayPal',       icon: CreditCard,     color: 'blue'    },
  { id: 'bank-india',   label: 'Bank Transfers',   shortLabel: 'Bank (India)', icon: Building2,      color: 'indigo'  },
  { id: 'ach',          label: 'ACH',              shortLabel: 'ACH',          icon: ArrowLeftRight, color: 'emerald' },
  { id: 'wire',         label: 'Wire Transfer',    shortLabel: 'Wire',         icon: Globe,          color: 'orange'  },
  { id: 'sepa',         label: 'SEPA',             shortLabel: 'SEPA',         icon: Banknote,       color: 'violet'  },
  { id: 'crypto',       label: 'Crypto',           shortLabel: 'Crypto',       icon: Coins,          color: 'amber'   },
  { id: 'payoneer',     label: 'Payoneer',         shortLabel: 'Payoneer',     icon: Wallet,         color: 'teal'    },
  { id: 'wise',         label: 'Wise',             shortLabel: 'Wise',         icon: Zap,            color: 'pink'    },
]

const NAV_COLORS: Record<string, string> = {
  blue:    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  indigo:  'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  orange:  'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  violet:  'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300',
  amber:   'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  teal:    'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300',
  pink:    'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
}
const TEXT: Record<string, string> = {
  blue:    'text-blue-700 dark:text-blue-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  orange:  'text-orange-700 dark:text-orange-300',
  violet:  'text-violet-700 dark:text-violet-300',
  amber:   'text-amber-700 dark:text-amber-300',
  teal:    'text-teal-700 dark:text-teal-300',
  pink:    'text-pink-700 dark:text-pink-300',
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function Lesson28PaymentSOP() {
  const [activeId, setActiveId] = useState('paypal')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    METHODS.forEach(m => {
      const el = sectionRefs.current[m.id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(m.id) },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  function scrollTo(id: string) {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-8 relative overflow-hidden mb-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-300" />
            <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest">Module 3 · SOP</p>
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Methods, Fees & How to Handle Them</h2>
          <p className="text-emerald-100 text-sm max-w-xl">
            Your go-to guide for handling payments at AMRYTT MEDIA — 8 methods explained with fees, timelines, analogies, and internal rules.
          </p>
          <p className="text-emerald-200/80 text-xs mt-2 italic">
            Think of this like choosing the right vehicle for delivery: some are fast but expensive, some are cheap but slow, some are safe but rigid.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {METHODS.map((m, i) => (
              <span key={m.id} className="text-xs bg-white/15 text-white/90 px-2.5 py-1 rounded-full font-medium">
                {i + 1}. {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Comparison Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">Quick Comparison — All 8 Methods at a Glance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60">
                <th className="text-left px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Method</th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cost</th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Speed</th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Coverage</th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Safety</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {[
                { name: 'PayPal',    cost: '~10%',       speed: 'Fast',        cover: 'Global',    safety: 'safe'   },
                { name: 'ACH',      cost: 'Free ($0)',   speed: '3–5 days',    cover: 'US only',   safety: 'safe'   },
                { name: 'Wire',     cost: '$15–$35',     speed: '1–5 days',    cover: 'Global',    safety: 'medium' },
                { name: 'SEPA',     cost: '0.50€–1%',   speed: '1–2 days',    cover: '36 countries', safety: 'safe' },
                { name: 'Crypto',   cost: '~varies',     speed: 'Varies',      cover: 'Global',    safety: 'risky'  },
                { name: 'Payoneer', cost: 'Low (on withdrawal)', speed: 'Fast', cover: 'Global',   safety: 'safe'   },
                { name: 'Wise',     cost: '$2–$70',      speed: 'Varies',      cover: 'Global',    safety: 'safe'   },
              ].map(r => (
                <tr key={r.name} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-50">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.cost}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Clock className="w-3 h-3 text-gray-400" /> {r.speed}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.cover}</td>
                  <td className="px-4 py-3"><SafetyBadge level={r.safety as 'safe' | 'risky' | 'medium'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* Sticky sidebar — desktop only */}
        <nav className="hidden lg:flex flex-col gap-1 w-48 flex-shrink-0 sticky top-20">
          <div className="flex items-center gap-2 mb-3 px-1">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Methods</p>
          </div>
          {METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => scrollTo(m.id)}
              className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-all ${
                activeId === m.id
                  ? `${NAV_COLORS[m.color]} font-semibold`
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {m.shortLabel}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Mobile pill nav */}
          <div className="lg:hidden mb-4 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => scrollTo(m.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap border transition-all ${
                    activeId === m.id
                      ? `${NAV_COLORS[m.color]} ${TEXT[m.color]} border-current`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent'
                  }`}
                >
                  {m.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* ─────────────────────── 01. PayPal ─────────────────────── */}
          <section ref={setRef('paypal')} id="paypal" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 01</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">PayPal</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="safe" /></div>
            </div>

            <DefinitionCard color="blue">
              PayPal is a digital payment platform that lets you send money internationally. It's one of the most widely used methods in our workflow. <strong>However, it comes with fees — and it's important you understand exactly how they work.</strong>
            </DefinitionCard>

            <div className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 rounded-2xl p-5">
              <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-3">💰 How PayPal Fees Work</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">There are <strong>2 types of charges</strong> when sending via PayPal:</p>
              <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                <FeeRow label="PayPal Transaction Fee" value="~6–7%" />
                <FeeRow label="Currency Conversion Fee" value="~2–3%" />
                <FeeRow label="Total (we always calculate at max)" value="~10%" note="Always use this to be safe" />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
              <p className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-3">📌 Important Example</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Let's say we need to send <strong>100€</strong> to an admin:
              </p>
              <div className="space-y-2">
                {[
                  { from: 'You send', val: '100€', note: 'Full amount from our end' },
                  { from: 'PayPal fee (~7%)', val: '−7€', note: 'Transaction fee deducted' },
                  { from: 'Currency conversion (~3%)', val: '−3€', note: 'Exchange rate markup' },
                  { from: 'Admin actually receives', val: '~90€', note: '⚠️ Not the full 100€' },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg ${
                    i === 3 ? 'bg-blue-200/60 dark:bg-blue-800/60 font-bold' : 'bg-blue-100/50 dark:bg-blue-900/50'
                  }`}>
                    <span className="text-sm text-blue-800 dark:text-blue-200">{row.from}</span>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${i === 3 ? 'text-blue-900 dark:text-blue-100' : 'text-blue-700 dark:text-blue-300'}`}>{row.val}</span>
                      <p className="text-xs text-blue-500 dark:text-blue-400">{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ExampleBox>
              💡 <strong>Think of it like this:</strong> You're sending a package worth 100€, but the courier + customs take their cut before delivery. Even though you paid for 100€, the receiver only gets ~90€ after fees.
            </ExampleBox>

            <InternalRuleBox>
              <strong>Internal Rule:</strong> Normally, we <em>do not</em> pass PayPal fees to the admin — it's part of our operational cost. <strong>BUT:</strong> if an admin is pushing hard on pricing, you <em>can</em> factor in the 10% to justify the amount.
            </InternalRuleBox>

            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
              <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">🛡️ Safety — Disputes & Chargebacks</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                PayPal allows disputes and chargebacks. If a vendor scams us or removes links after payment, we <strong>can open a dispute and recover funds.</strong> This makes PayPal relatively safe compared to other methods.
              </p>
            </div>
          </section>

          {/* ─────────────────────── 02. Bank India ─────────────────────── */}
          <section ref={setRef('bank-india')} id="bank-india" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 02</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Understanding Bank Transfers — India Basics</h3>
              </div>
            </div>

            <DefinitionCard color="indigo">
              Before we dive into international transfers like ACH, Wire, and SEPA — it helps to understand how bank transfers work in India first. <strong>The concept is very similar</strong>, just with more fees, more checks, and more delays internationally.
            </DefinitionCard>

            <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">India has 3 types of bank transfers — click each to expand:</p>

            <div className="space-y-2">
              <SubCard
                number={1}
                name="IMPS — Immediate Payment Service"
                badge="Instant"
                badgeColor="emerald"
                description="Instant 24/7 transfer — works on weekends and holidays. No minimum amount. Max limit: ₹5,00,000. If done via bank branch: fees range ₹5 to ₹50 depending on the bank."
                meta="Think of IMPS like sending money via UPI-style instant transfer. Fast and always available. International equivalent: Wise wallet / instant card payments."
              />
              <SubCard
                number={2}
                name="NEFT — National Electronic Funds Transfer"
                badge="Batch"
                badgeColor="orange"
                description="Works in batches — takes a few hours. No minimum or maximum limit. If done via bank branch: fees are ₹2.5 to ₹25 + GST."
                meta="Think of NEFT like a scheduled delivery van — it moves money in groups, not instantly. International equivalent: ACH (slow, batch-based, US only)."
              />
              <SubCard
                number={3}
                name="RTGS — Real Time Gross Settlement"
                badge="Large Payments"
                badgeColor="violet"
                description="Used for large payments only. Minimum amount: ₹2,00,000. No maximum limit. Processed individually (not in batches). If done via bank branch: fees are ₹25 to ₹50 + GST."
                meta="Think of RTGS like a dedicated truck for a big shipment — direct, priority transfer. International equivalent: Wire Transfer (direct, higher fees, global)."
              />
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5">
              <p className="font-bold text-indigo-800 dark:text-indigo-300 text-sm mb-3">🔗 How Indian Methods Map to International Methods</p>
              <div className="space-y-2">
                {[
                  { india: 'IMPS', eq: 'Wise wallet / instant card payment', desc: 'Both are fast & always available' },
                  { india: 'NEFT', eq: 'ACH',                                 desc: 'Both are slow, batch-based' },
                  { india: 'RTGS', eq: 'Wire Transfer',                        desc: 'Both are direct, priority transfers' },
                ].map(row => (
                  <div key={row.india} className="flex items-start gap-3 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-xl px-4 py-3">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 text-sm w-12 flex-shrink-0">{row.india}</span>
                    <span className="text-indigo-400 dark:text-indigo-500 flex-shrink-0">≈</span>
                    <div>
                      <span className="font-bold text-indigo-800 dark:text-indigo-200 text-sm">{row.eq}</span>
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AmryttBox>
              This section is foundational. Once you understand IMPS/NEFT/RTGS, you can immediately relate to ACH, Wire, and SEPA. <strong>International banking works the same way — just with more fees, more checks, and more delays.</strong>
            </AmryttBox>
          </section>

          {/* ─────────────────────── 03. ACH ─────────────────────── */}
          <section ref={setRef('ach')} id="ach" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowLeftRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 03</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">ACH — US Bank Transfer</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="safe" /></div>
            </div>

            <DefinitionCard color="emerald">
              <strong>ACH (Automated Clearing House)</strong> is a bank transfer method that works <strong>only for US bank accounts</strong>. It's completely free but takes 3–5 working days to settle.
            </DefinitionCard>

            <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-5">
              <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                <FeeRow label="Fee" value="$0 — Free" />
                <FeeRow label="Transfer Time" value="3–5 working days" />
                <FeeRow label="Coverage" value="US bank accounts only" />
              </div>
            </div>

            <ExampleBox>
              💡 <strong>Think of it like:</strong> Sending cash via bank with no undo button. It's free, it's domestic US, but once it's sent — it's very hard to get back.
            </ExampleBox>

            <WarningBox>
              <strong>Once sent → cannot reverse easily.</strong> The only option is to go through a legal route, which is time-consuming. Always double-check the bank account details before initiating an ACH payment.
            </WarningBox>
          </section>

          {/* ─────────────────────── 04. Wire Transfer ─────────────────────── */}
          <section ref={setRef('wire')} id="wire" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 04</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Wire Transfer</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="medium" /></div>
            </div>

            <DefinitionCard color="orange">
              Wire transfer is a <strong>global</strong> bank transfer method. Unlike ACH, it works internationally but comes with fees. It requires a <strong>SWIFT code</strong> (the international equivalent of IFSC in India) to route the payment to the correct bank.
            </DefinitionCard>

            <div className="bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-900 rounded-2xl p-5">
              <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                <FeeRow label="Fee" value="$15 – $35" note="Charged by the sending bank" />
                <FeeRow label="US → US Transfer" value="~1 working day" />
                <FeeRow label="International Transfer" value="3–5 working days" />
                <FeeRow label="Required" value="SWIFT Code" note="Like IFSC, but for international banks" />
              </div>
            </div>

            <ExampleBox>
              💡 <strong>Think of it like:</strong> A direct international courier — it goes anywhere in the world, but you pay for the delivery. The more remote, the longer it takes.
            </ExampleBox>

            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-4 space-y-2">
              <p className="font-bold text-orange-800 dark:text-orange-300 text-sm">📅 Team Question — The Friday Problem</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                <strong>Q: What happens if we initiate a wire payment on Friday evening?</strong>
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                <strong>A:</strong> Banks don't process wire transfers on weekends. The transfer will only start processing on Monday — which means a delay is automatic. Always plan wire transfers for Monday–Thursday to avoid weekend gaps.
              </p>
            </div>

            <InternalRuleBox>
              <strong>Emergency tip:</strong> If you accidentally sent a wire and need to stop it — call the bank <em>immediately</em>. If the transfer hasn't been processed yet, the bank can hold it. Once processed, it's very difficult to reverse.
            </InternalRuleBox>
          </section>

          {/* ─────────────────────── 05. SEPA ─────────────────────── */}
          <section ref={setRef('sepa')} id="sepa" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 05</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">SEPA — Euro Payments</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="safe" /></div>
            </div>

            <DefinitionCard color="violet">
              <strong>SEPA (Single Euro Payments Area)</strong> allows easy bank transfers across Europe. It covers EU countries plus some additional countries — <strong>36 countries total</strong>. All you need is the recipient's IBAN. No SWIFT code, no hassle.
              <br /><br />
              We now support Euro payments, so understanding SEPA is important for your day-to-day work.
            </DefinitionCard>

            <div className="bg-white dark:bg-gray-900 border border-violet-100 dark:border-violet-900 rounded-2xl p-5">
              <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-3">💶 SEPA Fee Structure</p>
              <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                <FeeRow label="Transfers under 500€" value="0.50€ flat" note="Very cheap" />
                <FeeRow label="Transfers over 500€" value="1% fee" note="Still cheaper than PayPal's 10%" />
                <FeeRow label="What you need" value="IBAN only" note="No SWIFT code required" />
              </div>
            </div>

            <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 space-y-4">
              <p className="font-bold text-violet-800 dark:text-violet-300 text-sm">🏦 What is an IBAN?</p>
              <p className="text-sm text-violet-700 dark:text-violet-300">
                IBAN = <strong>International Bank Account Number</strong>. It's a standardised account number used across Europe that contains all the routing information needed to make a payment.
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-violet-100 dark:border-violet-900">
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-2">Example IBAN: DE89 3704 0044 0532 0130 00</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { part: 'DE', label: 'Country Code', color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
                    { part: '89', label: 'Check Digits', color: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300' },
                    { part: '3704 0044', label: 'Bank Code', color: 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300' },
                    { part: '0532 0130 00', label: 'Account Number', color: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300' },
                  ].map(p => (
                    <div key={p.part} className={`${p.color} rounded-lg px-3 py-2 text-center`}>
                      <div className="font-bold font-mono text-sm">{p.part}</div>
                      <div className="text-[10px] mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Screenshot
                src="/images/lesson28/iban-anatomy.png"
                alt="Anatomy of an IBAN showing country code, check digits, bank code, and account number"
                label="IBAN Anatomy — Visual Guide"
                caption="An IBAN is made up of 4 parts: Country code, check digits, bank identifier code, and account number. For SEPA payments, all you need is this number."
              />
            </div>

            <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-5">
              <p className="font-bold text-violet-800 dark:text-violet-300 text-sm mb-3">🌍 SEPA Supported Countries (36 total)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {[
                  'Belgium', 'Bulgaria', 'Cyprus', 'Denmark', 'Germany', 'Estonia',
                  'Finland', 'France', 'Greece', 'Hungary', 'Ireland', 'Iceland',
                  'Italy', 'Croatia', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
                  'Malta', 'Netherlands', 'Norway', 'Austria', 'Poland', 'Portugal',
                  'Romania', 'Slovenia', 'Slovakia', 'Spain', 'Czech Republic', 'Sweden',
                  'Switzerland',
                ].map(c => (
                  <span key={c} className="text-xs bg-violet-100/70 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-lg text-center">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <ExampleBox>
              💡 <strong>Think of IBAN like:</strong> A full address of a bank account. Just like you need a full postal address to deliver mail, IBAN gives the banking network all the information it needs to route your payment correctly — country, bank, branch, and account all in one string.
            </ExampleBox>
          </section>

          {/* ─────────────────────── 06. Crypto ─────────────────────── */}
          <section ref={setRef('crypto')} id="crypto" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 06</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Crypto</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="risky" /></div>
            </div>

            <DefinitionCard color="amber">
              Crypto is a decentralized payment method — <strong>no bank is involved</strong>. Transfers happen directly wallet-to-wallet on the blockchain. We support multiple cryptocurrencies, but treat all crypto payments as high risk.
            </DefinitionCard>

            <div className="bg-white dark:bg-gray-900 border border-amber-100 dark:border-amber-900 rounded-2xl p-5">
              <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-3">💎 Supported Cryptocurrencies</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'BTC', full: 'Bitcoin', color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' },
                  { name: 'ETH', full: 'Ethereum', color: 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300' },
                  { name: 'USDT (ERC20)', full: 'Tether — Ethereum Network', color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' },
                  { name: 'USDT (TRC20)', full: 'Tether — Tron Network', color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' },
                  { name: 'USDC', full: 'USD Coin', color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
                ].map(c => (
                  <div key={c.name} className={`${c.color} rounded-xl px-3 py-2.5`}>
                    <div className="font-bold text-sm">{c.name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{c.full}</div>
                  </div>
                ))}
              </div>
            </div>

            <WarningBox>
              <strong>High Risk — No Recovery If Wrong Transfer.</strong> There are no chargebacks in crypto. If you send to the wrong wallet address, the funds are gone permanently. <strong>We only pay crypto to verified admins.</strong> Always double-check the wallet address — copy-paste, never type manually.
            </WarningBox>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 space-y-3">
              <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">🔑 Why We Ask for 5% Discount When Paying via Crypto</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">When we pay via crypto, here's what happens behind the scenes:</p>
              <div className="space-y-2">
                {[
                  { step: '1', label: 'Convert USD → Crypto (USDT/USDC)', detail: 'Payment gateway fees apply' },
                  { step: '2', label: 'Volatility risk during conversion', detail: 'Crypto prices fluctuate, so value can drop between conversion and send' },
                  { step: '3', label: 'Network/gas fees to send', detail: 'Blockchain transaction fees' },
                ].map(s => (
                  <div key={s.step} className="flex gap-3 bg-amber-100/50 dark:bg-amber-900/30 rounded-xl px-3 py-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-400 dark:bg-amber-700 text-amber-900 dark:text-amber-100 text-xs font-bold flex items-center justify-center flex-shrink-0">{s.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{s.label}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-200/60 dark:bg-amber-800/40 rounded-xl px-4 py-3">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                  ∴ We ask for 5% discount to balance conversion cost + risk + volatility. This keeps the net amount fair for both sides.
                </p>
              </div>
            </div>

            <ExampleBox>
              💡 <strong>Think of it like:</strong> Buying foreign cash from an airport exchange counter. You always pay extra while buying (the exchange spread). So when we convert USD to crypto, we're paying that "airport rate" — hence we recover that via a vendor discount.
            </ExampleBox>
          </section>

          {/* ─────────────────────── 07. Payoneer ─────────────────────── */}
          <section ref={setRef('payoneer')} id="payoneer" className="scroll-mt-20 space-y-5 mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 07</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Payoneer</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="safe" /></div>
            </div>

            <DefinitionCard color="teal">
              Payoneer lets you create <strong>multiple receiving accounts in different currencies</strong> — like having a local US bank account, a European bank account, and a UK bank account all in one place. Instead of asking someone to send an "international wire," you share your local Payoneer account details and they send domestically.
            </DefinitionCard>

            <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-2xl p-5">
              <p className="font-bold text-teal-800 dark:text-teal-300 text-sm mb-3">🌐 Multi-Currency Accounts Available</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { currency: 'USD', flag: '🇺🇸', label: 'US Dollar Account', detail: 'Like having a US bank' },
                  { currency: 'EUR', flag: '🇪🇺', label: 'Euro Account', detail: 'Like having a European bank' },
                  { currency: 'GBP', flag: '🇬🇧', label: 'British Pound Account', detail: 'Like having a UK bank' },
                ].map(c => (
                  <div key={c.currency} className="bg-white dark:bg-gray-900 border border-teal-100 dark:border-teal-900 rounded-xl p-3.5 text-center">
                    <div className="text-2xl mb-1">{c.flag}</div>
                    <div className="font-bold text-gray-900 dark:text-gray-50 text-lg">{c.currency}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.label}</div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 mt-1 italic">{c.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <Screenshot
              src="/images/lesson28/payoneer-dashboard.png"
              alt="Payoneer dashboard showing USD, EUR, and GBP balances"
              label="Payoneer Dashboard — Real Account View"
              caption="A Payoneer account showing multi-currency balances: USD, EUR, and GBP all in one dashboard. Each currency has its own local bank account details you can share with payers."
            />

            <div className="bg-white dark:bg-gray-900 border border-teal-100 dark:border-teal-900 rounded-2xl p-5">
              <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-3">💸 Where Fees Come In</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Receiving money is usually easy and low cost. But fees appear when you:</p>
              <div className="space-y-2">
                <div className="flex gap-3 bg-teal-50 dark:bg-teal-950 rounded-xl p-3.5">
                  <span className="text-lg flex-shrink-0">1️⃣</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Withdraw to your local bank account</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Payoneer → your bank = fees apply. Can be fixed fee OR % based (depends on currency & country)</p>
                  </div>
                </div>
                <div className="flex gap-3 bg-teal-50 dark:bg-teal-950 rounded-xl p-3.5">
                  <span className="text-lg flex-shrink-0">2️⃣</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Currency conversion</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">If you receive USD but withdraw in INR or EUR, conversion fees apply on top</p>
                  </div>
                </div>
              </div>
            </div>

            <ExampleBox>
              💡 <strong>Think of Payoneer like:</strong> Having multiple foreign bank lockers. Money sits there safely in each currency. But when you bring it home (withdraw to your bank), you pay handling charges. The money isn't truly "in your pocket" until you withdraw it.
            </ExampleBox>

            <AmryttBox>
              Payoneer is <strong>great for collecting international payments</strong> without the hassle of international wire fees from the sender's side. The sender pays domestically (e.g., a US client sends to our US Payoneer account as a local transfer) — and only we pay when we withdraw. This saves the sender money and makes payments faster.
            </AmryttBox>
          </section>

          {/* ─────────────────────── 08. Wise ─────────────────────── */}
          <section ref={setRef('wise')} id="wise" className="scroll-mt-20 space-y-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Method 08</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Wise</h3>
              </div>
              <div className="ml-auto"><SafetyBadge level="safe" /></div>
            </div>

            <DefinitionCard color="pink">
              Wise is very similar to PayPal — but with <strong>lower fees and more flexible payment options</strong>. You can use it to send via ACH, Wise wallet, bank transfer, debit card, or credit card. Each option has a different cost and speed.
            </DefinitionCard>

            <div className="bg-white dark:bg-gray-900 border border-pink-100 dark:border-pink-900 rounded-2xl p-5">
              <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-3">💡 Sending $1,000 via Wise — All Options Compared</p>
              <div className="space-y-2">
                {[
                  { method: 'Wise Wallet',     fee: '~$2',  note: 'Cheapest + Fastest (if balance available)', best: true, avoid: false },
                  { method: 'ACH via Wise',    fee: '~$5',  note: 'Very cheap, slightly slower',               best: false, avoid: false },
                  { method: 'Domestic Wire',   fee: '~$10', note: 'Initiated via bank website or branch',       best: false, avoid: false },
                  { method: 'Debit Card',      fee: '~$16', note: 'Faster but higher cost',                    best: false, avoid: false },
                  { method: 'Credit Card',     fee: '~$70', note: 'Very expensive — avoid unless urgent',       best: false, avoid: true  },
                ].map(opt => (
                  <div key={opt.method} className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
                    opt.best ? 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800' :
                    opt.avoid ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' :
                    'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      {opt.best && <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" />}
                      {opt.avoid && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                      {!opt.best && !opt.avoid && <div className="w-4 h-4" />}
                      <div>
                        <p className={`text-sm font-semibold ${opt.best ? 'text-pink-800 dark:text-pink-200' : opt.avoid ? 'text-red-800 dark:text-red-200' : 'text-gray-800 dark:text-gray-200'}`}>
                          {opt.method}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.note}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${opt.best ? 'text-pink-700 dark:text-pink-300' : opt.avoid ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {opt.fee}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <InternalRuleBox>
              <strong>Always prefer Wise Wallet first, then ACH.</strong> Credit card via Wise should be a last resort — at $70 fee for $1,000, it's 7% which is comparable to PayPal. If you need to pay via credit card, consider PayPal instead.
            </InternalRuleBox>

            <div className="bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 rounded-xl px-4 py-3 text-sm text-pink-700 dark:text-pink-300">
              <strong>Currency Conversion:</strong> If the payment is in a different currency (USD → EUR, USD → INR), <em>additional</em> conversion fees apply on top of the base fee. Factor this in when calculating total cost.
            </div>

            <ExampleBox>
              💡 <strong>Think of Wise like:</strong> A smart payment router. You pick your route based on priority — cheap route (ACH), fast route (card), or balanced route (wallet). Each route costs differently, and you always know the fee upfront before confirming.
            </ExampleBox>

            <AmryttBox>
              Wise is our most flexible tool for sending payments internationally. The <strong>Wise Wallet balance is the cheapest and fastest option</strong> — always check if we have balance there before choosing a more expensive method. When in doubt: Wise Wallet → ACH → Domestic Wire → Debit Card → Credit Card (last resort).
            </AmryttBox>
          </section>

          {/* ─────────────────────── Final Takeaway ─────────────────────── */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-3">Key Takeaway</p>
              <h4 className="text-lg font-bold mb-3">Choose the right tool for the job</h4>
              <p className="text-emerald-100 text-sm leading-relaxed mb-5">
                Every payment method has its place. As an AMRYTT MEDIA team member, you'll be asked to initiate or verify payments regularly. Your job is to understand the fees, the speed, the risk, and the right situation for each method.
              </p>

              {/* Quick decision grid */}
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                {[
                  { situation: 'Need safety + disputes',     use: '→ PayPal'                   },
                  { situation: 'US recipient, no budget',    use: '→ ACH (free)'               },
                  { situation: 'Global, any currency',       use: '→ Wire Transfer'            },
                  { situation: 'European admin, EUR',        use: '→ SEPA (cheapest)'          },
                  { situation: 'Admin prefers crypto',       use: '→ Crypto + 5% discount'     },
                  { situation: 'Collecting globally',        use: '→ Payoneer (receive)'       },
                  { situation: 'Flexible + cost-conscious',  use: '→ Wise Wallet first'        },
                ].map(r => (
                  <div key={r.situation} className="bg-white/10 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-emerald-200">{r.situation}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{r.use}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => scrollTo(m.id)}
                    className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
