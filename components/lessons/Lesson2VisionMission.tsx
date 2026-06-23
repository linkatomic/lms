'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Target, Eye, Zap } from 'lucide-react'

const operatingRules = [
  {
    number: '01',
    name: 'Fastest Delivery',
    team: 'Operations Team',
    emoji: '⚡',
    tagline: 'Speed matters.',
    detail: 'If a client places an order, it should move fast and smoothly — no unnecessary delays. Every minute counts when a client is waiting.',
    color: 'from-indigo-500 to-blue-600',
    lightBg: 'bg-indigo-50',
    darkBg: 'dark:bg-indigo-950',
    border: 'border-indigo-200',
    darkBorder: 'dark:border-indigo-700',
    teamColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    textColor: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    number: '02',
    name: 'Quality Content',
    team: 'Content Team',
    emoji: '✍️',
    tagline: 'Backlinks without good content = wasted effort.',
    detail: 'We focus on creating content that actually deserves to be published — writing that earns its place, builds authority, and delivers real value to readers.',
    color: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    darkBg: 'dark:bg-violet-950',
    border: 'border-violet-200',
    darkBorder: 'dark:border-violet-700',
    teamColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    textColor: 'text-violet-700 dark:text-violet-300',
  },
  {
    number: '03',
    name: 'Best Pricing',
    team: 'Outreach Team',
    emoji: '🎯',
    tagline: 'Competitive rates. Zero compromise on quality.',
    detail: 'Get the best possible rates from publishers, then pass that advantage to clients. We stay competitive without ever cutting corners on the quality of placements.',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    darkBg: 'dark:bg-emerald-950',
    border: 'border-emerald-200',
    darkBorder: 'dark:border-emerald-700',
    teamColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
]

function RuleCard({ rule, index }: { rule: typeof operatingRules[0]; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      className="cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d', height: 220 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl border ${rule.border} ${rule.darkBorder} ${rule.lightBg} ${rule.darkBg} shadow-sm flex flex-col justify-between p-6`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between">
            <span className={`text-xs font-bold uppercase tracking-widest ${rule.textColor}`}>
              Rule {rule.number}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rule.teamColor}`}>
              {rule.team}
            </span>
          </div>
          <div>
            <span className="text-4xl block mb-3">{rule.emoji}</span>
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-1">{rule.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">{rule.tagline}</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-right">Tap for details →</p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${rule.color} shadow-sm flex flex-col justify-center p-6`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4">
            {rule.team}
          </span>
          <h3 className="font-bold text-white text-lg mb-3">{rule.name}</h3>
          <p className="text-white/90 text-sm leading-relaxed">{rule.detail}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

const missionPoints = [
  "Deliver exceptional results meeting every client's needs with precision and speed — without compromising on quality.",
  'Stay ahead of the curve by embracing and shaping the latest industry trends and best practices.',
  'Invest in the growth of our team, creating a collaborative culture that sparks creativity and nurtures leadership.',
  'Forge lasting partnerships with clients, offering personalized, top-tier services with transparent communication.',
]

const visionPoints = [
  "Rise as one of India's most recognized and respected leaders in the digital marketing arena.",
  'Strengthen our team with top talent — skilled professionals driven to excel.',
  'Elevate our standards and set new benchmarks, pushing the boundaries of innovation and excellence.',
]

export default function Lesson2VisionMission() {
  return (
    <div className="space-y-10">

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
        <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">Lesson 2</p>
        <h2 className="text-3xl font-bold mb-3">Vision, Mission & How We Operate</h2>
        <p className="text-indigo-100 leading-relaxed max-w-lg">
          These aren't just words on a wall — they're the compass that guides every decision at AMRYTT MEDIA.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Our Mission</h2>
        </div>
        <div className="space-y-4">
          {missionPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Our Vision</h2>
        </div>
        <div className="space-y-4">
          {visionPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start bg-violet-50 dark:bg-violet-950 rounded-xl p-4 border border-violet-100 dark:border-violet-800"
            >
              <span className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0">◆</span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How We Operate — 3 rule flip cards */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">How We Operate</h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-500 dark:text-gray-400 text-sm mb-5 ml-13"
        >
          Think of these as our operating rules — not just words. ✨ <strong>Tap each card</strong> to see what it means in practice.
        </motion.p>
        <div className="grid sm:grid-cols-3 gap-4">
          {operatingRules.map((rule, i) => (
            <RuleCard key={rule.number} rule={rule} index={i} />
          ))}
        </div>
      </div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-7"
      >
        <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">🎯 Key Takeaway</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          At AMRYTT MEDIA, our Mission is our <em>daily commitment</em>, our Vision is our <em>north star</em>, and our Operating Rules are what we <em>actually live by</em> every single day — speed, quality, and value for every client.
        </p>
      </motion.div>

    </div>
  )
}
