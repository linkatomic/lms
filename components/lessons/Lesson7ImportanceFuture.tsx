'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Globe, TrendingDown, BarChart2, Target,
  RefreshCw, MessageCircle, Bot, Glasses,
  Leaf, ShieldCheck, ShoppingBag,
} from 'lucide-react'

const benefits = [
  {
    icon: Globe,
    title: 'Global Reach',
    tagline: 'No borders. No limits.',
    desc: 'Digital marketing lets any business reach customers worldwide — a small Indian agency can land clients in the US, UK, or Australia without leaving the office.',
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
    num: '01',
  },
  {
    icon: TrendingDown,
    title: 'Cost-Effectiveness',
    tagline: 'Do more with less.',
    desc: 'A newspaper ad costs a fixed amount no matter who sees it. Digital marketing models like CPC and CPA mean you only pay when it actually works.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
    num: '02',
  },
  {
    icon: BarChart2,
    title: 'Measurable Results',
    tagline: 'Know exactly what\'s working.',
    desc: 'Unlike a billboard, digital marketing tells you who clicked, when, from where, and whether they became a customer — all in real time.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    num: '03',
  },
  {
    icon: Target,
    title: 'Targeted Audience',
    tagline: 'Reach the right people, not everyone.',
    desc: 'You can show your ad only to 35-year-old marketing managers in London who are interested in SEO. No traditional medium can match that precision.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-100 dark:bg-rose-900',
    num: '04',
  },
  {
    icon: RefreshCw,
    title: 'Flexibility & Adaptability',
    tagline: 'Change course in real time.',
    desc: 'If a campaign isn\'t performing, you can pause, tweak, and relaunch in minutes. A printed flyer can\'t be recalled. A digital ad can be improved instantly.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
    num: '05',
  },
  {
    icon: MessageCircle,
    title: 'Improved Engagement',
    tagline: 'Two-way conversations, not one-way ads.',
    desc: 'Customers can comment, share, reply, and interact. This builds real relationships and brand loyalty that traditional advertising simply can\'t achieve.',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50 dark:bg-sky-950',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    iconBg: 'bg-sky-100 dark:bg-sky-900',
    num: '06',
  },
]

const predictions = [
  {
    icon: Bot,
    title: 'AI & Automation',
    year: '2025–2030',
    summary: 'Smarter, faster, more personal.',
    detail: 'AI will write ad copy, pick the best time to send emails, predict which leads will convert, and optimize campaigns 24/7 without human input. Marketers won\'t be replaced — but marketers who use AI will replace those who don\'t.',
    color: 'from-violet-500 to-indigo-600',
    dot: 'bg-violet-500',
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950',
    text: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
  },
  {
    icon: Glasses,
    title: 'AR & VR Experiences',
    year: '2026+',
    summary: 'Marketing you can step inside.',
    detail: 'Augmented Reality lets customers "try on" products or see furniture in their home before buying. VR can place customers inside a brand experience. This will redefine how products are shown and sold online.',
    color: 'from-indigo-500 to-blue-600',
    dot: 'bg-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-800',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    text: 'text-indigo-700 dark:text-indigo-300',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
  },
  {
    icon: Leaf,
    title: 'Sustainability Marketing',
    year: 'Right now',
    summary: 'Values matter as much as value.',
    detail: 'Consumers — especially younger ones — actively choose brands that reflect their values. Companies that demonstrate real environmental and ethical practices in their marketing will win loyalty that discounts never could.',
    color: 'from-emerald-500 to-teal-600',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
  },
  {
    icon: ShieldCheck,
    title: 'Blockchain in Marketing',
    year: '2026–2030',
    summary: 'Trust, transparency, and no fake clicks.',
    detail: 'Blockchain will verify that ad views are real humans (not bots), protect user data, and make digital transactions transparent. For agencies like AMRYTT, this means more trustworthy reporting for clients.',
    color: 'from-amber-500 to-orange-500',
    dot: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
  },
  {
    icon: ShoppingBag,
    title: 'Social Commerce',
    year: 'Happening now',
    summary: 'Shop without ever leaving the app.',
    detail: 'Instagram, TikTok, and Pinterest already let users buy products directly from a post. The line between scrolling and shopping is disappearing — brands that sell inside social feeds will have a massive edge.',
    color: 'from-rose-500 to-pink-600',
    dot: 'bg-rose-500',
    border: 'border-rose-200 dark:border-rose-800',
    bg: 'bg-rose-50 dark:bg-rose-950',
    text: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-100 dark:bg-rose-900',
  },
]

function BenefitCard({ b, index }: { b: typeof benefits[0]; index: number }) {
  const Icon = b.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className={`bg-white dark:bg-gray-900 rounded-2xl border ${b.border} shadow-sm p-6 flex gap-4`}
    >
      <div className={`w-11 h-11 ${b.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-5 h-5 ${b.text}`} />
      </div>
      <div>
        <p className={`text-xs font-bold uppercase tracking-widest ${b.text} mb-1`}>{b.num}</p>
        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-1">{b.title}</h3>
        <p className={`text-xs font-semibold italic ${b.text} mb-2`}>{b.tagline}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{b.desc}</p>
      </div>
    </motion.div>
  )
}

function PredictionCard({ p, index, active, onClick }: {
  p: typeof predictions[0]; index: number; active: boolean; onClick: () => void
}) {
  const Icon = p.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.09 }}
      className="relative pl-14 cursor-pointer group"
      onClick={onClick}
    >
      {/* Timeline dot */}
      <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 ${p.dot} transition-transform duration-200 ${active ? 'scale-125' : 'group-hover:scale-110'}`} />

      <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        active
          ? 'border-gray-200 dark:border-gray-700 shadow-md'
          : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 flex items-center gap-3 transition-colors duration-200 ${
          active ? `bg-gradient-to-r ${p.color}` : 'bg-white dark:bg-gray-900'
        }`}>
          <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center ${
            active ? 'bg-white/20' : p.iconBg
          }`}>
            <Icon className={`w-4 h-4 ${active ? 'text-white' : p.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${active ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
              {p.year}
            </p>
            <h3 className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-900 dark:text-gray-50'}`}>{p.title}</h3>
          </div>
          <span className={`text-xs flex-shrink-0 ${active ? 'text-white/60' : 'text-gray-400 dark:text-gray-600'}`}>
            {active ? 'Close ↑' : 'Expand →'}
          </span>
        </div>

        {/* Summary always visible when collapsed */}
        {!active && (
          <div className={`px-5 py-3 ${p.bg} border-t ${p.border}`}>
            <p className={`text-xs font-semibold italic ${p.text}`}>{p.summary}</p>
          </div>
        )}

        {/* Full detail when expanded */}
        <motion.div
          initial={false}
          animate={{ height: active ? 'auto' : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-5 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <p className={`text-xs font-bold uppercase tracking-widest ${p.text}`}>{p.summary}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{p.detail}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Lesson7ImportanceFuture() {
  const [activePrediction, setActivePrediction] = useState<number | null>(null)

  return (
    <div className="space-y-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest mb-3">Module 2 · Lesson 2</p>
          <h2 className="text-3xl font-bold mb-3">Importance & The Future</h2>
          <p className="text-violet-100 leading-relaxed max-w-lg">
            Why does digital marketing matter so much — and where is it heading? Understanding this will help you see the bigger picture behind every decision we make at AMRYTT MEDIA.
          </p>
        </div>
      </motion.div>

      {/* Why it matters intro */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Why It Matters</p>
        <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium">
          Traditional marketing shouts at people. Digital marketing <span className="text-violet-600 dark:text-violet-400 font-bold">starts a conversation</span> — one that's measurable, targeted, and affordable for businesses of every size.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { stat: '5.4B', label: 'Internet users worldwide' },
            { stat: '60%', label: 'Of purchases start online' },
            { stat: '3×', label: 'Higher ROI vs traditional' },
          ].map(s => (
            <div key={s.label} className="bg-violet-50 dark:bg-violet-950 rounded-xl p-4 border border-violet-100 dark:border-violet-800 text-center">
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-300 mb-1">{s.stat}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 6 Benefits */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">6 Key Benefits</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Each benefit explains <em>why</em> digital marketing is now the primary way businesses grow.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <BenefitCard key={b.num} b={b} index={i} />
          ))}
        </div>
      </div>

      {/* Future section */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">The Future of Digital Marketing</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Five trends that will reshape the industry. ✨ <strong>Tap each prediction</strong> to see what it means in practice.
          </p>
        </motion.div>

        {/* Roadmap timeline */}
        <div className="relative">
          <div className="absolute left-[26px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-violet-400 via-emerald-400 to-rose-400 dark:from-violet-700 dark:via-emerald-700 dark:to-rose-700" />
          <div className="space-y-3">
            {predictions.map((p, i) => (
              <PredictionCard
                key={p.title}
                p={p}
                index={i}
                active={activePrediction === i}
                onClick={() => setActivePrediction(activePrediction === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Amrytt connection */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">
          What This Means for AMRYTT MEDIA
        </p>
        <div className="space-y-3">
          {[
            { emoji: '🌍', text: 'Our clients are global — we already break geographical barriers for them every day.' },
            { emoji: '📊', text: 'We deliver measurable link-building results — reports, metrics, and live tracking are non-negotiable.' },
            { emoji: '🤖', text: 'As AI reshapes content and outreach, we evolve our tools and workflows to stay ahead.' },
            { emoji: '🛍️', text: 'Social Commerce and Influencer Marketing are channels we actively use for clients — not future concepts.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{item.emoji}</span>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950 rounded-2xl border border-violet-100 dark:border-violet-800 p-7"
      >
        <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Key Takeaway</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Digital marketing isn't just the present — it's the future of every industry. The businesses that master it now, and adapt to what's coming next, will be the ones that lead. At AMRYTT MEDIA, staying ahead of these trends isn't optional — it's our job.
        </p>
      </motion.div>

    </div>
  )
}
