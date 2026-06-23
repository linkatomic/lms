'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const departments = [
  {
    name: 'Human Resources',
    short: 'HR',
    emoji: '👥',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    desc: 'Manages the employee lifecycle — recruitment, onboarding, training, performance management, and employee relations. Ensures a positive workplace culture and supports the professional growth and well-being of all staff.',
    keywords: ['Recruitment', 'Onboarding', 'Training', 'Culture'],
  },
  {
    name: 'Accounts',
    short: 'FIN',
    emoji: '💰',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    desc: 'Handles all financial operations — invoicing, payment processing, budget management, and financial reporting. Ensures all transactions are accurate, timely, and compliant with legal requirements.',
    keywords: ['Invoicing', 'Budgets', 'Payments', 'Compliance'],
  },
  {
    name: 'Blogger Outreach',
    short: 'BO',
    emoji: '✍️',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    desc: 'Builds and maintains relationships with bloggers, influencers, and online publishers. Identifies key partners, negotiates placements, and ensures the successful promotion of client content — enhancing brand visibility and authority.',
    keywords: ['Publishers', 'Outreach', 'Placements', 'Brand Authority'],
  },
  {
    name: 'Operations / Order Processing',
    short: 'OPS',
    emoji: '⚙️',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    desc: 'Processes service orders end-to-end for clients — from order placement to fulfillment. Coordinates across departments, handles order tracking, and ensures customer satisfaction throughout delivery of Guest Posting orders.',
    keywords: ['Order Processing', 'Fulfillment', 'Coordination', 'Guest Posts'],
  },
  {
    name: 'Content Writers',
    short: 'CW',
    emoji: '📝',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    desc: 'Creates high-quality, engaging content aligned with client brand voice and marketing objectives. Produces blog posts, articles, and other content types that attract and retain customers through compelling storytelling.',
    keywords: ['Blog Posts', 'Articles', 'Brand Voice', 'Storytelling'],
  },
  {
    name: 'PPC (Paid Search)',
    short: 'PPC',
    emoji: '📣',
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    desc: 'Manages pay-per-click advertising campaigns across Google Ads, Bing Ads, and social media channels. Creates targeted ad strategies, optimizes campaigns for maximum ROI, and drives high-quality traffic to websites.',
    keywords: ['Google Ads', 'Bing Ads', 'ROI', 'Ad Strategy'],
  },
  {
    name: 'SEO',
    short: 'SEO',
    emoji: '🔍',
    color: 'from-teal-500 to-green-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    desc: 'Improves organic search rankings on major search engines. Conducts keyword research, on-page and off-page optimization, technical SEO audits, and content strategies to boost visibility and drive organic traffic.',
    keywords: ['Keyword Research', 'On-Page SEO', 'Backlinks', 'Rankings'],
  },
  {
    name: 'Developer',
    short: 'DEV',
    emoji: '💻',
    color: 'from-gray-600 to-slate-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    desc: 'Builds and maintains the technical infrastructure supporting our digital marketing efforts. Works on website development, integrations, and ensures all digital assets are optimized for performance, security, and user experience.',
    keywords: ['Development', 'Integrations', 'Performance', 'Security'],
  },
]

function DeptCard({ dept, index }: { dept: typeof departments[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl border ${dept.border} dark:border-gray-700 shadow-sm overflow-hidden cursor-pointer`}
        onClick={() => setOpen(o => !o)}
      >
        <div className={`${dept.bg} dark:bg-gray-800 p-5 flex items-center gap-4`}>
          <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
            {dept.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${dept.text} dark:opacity-80`}>{dept.short}</p>
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm mt-0.5 truncate">{dept.name}</h3>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-7 h-7 flex-shrink-0 bg-white dark:bg-gray-700 ${dept.text} dark:opacity-80 border ${dept.border} dark:border-gray-600 rounded-full flex items-center justify-center font-bold text-lg`}
          >
            +
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-5 py-5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{dept.desc}</p>
            <div className="flex flex-wrap gap-2">
              {dept.keywords.map(k => (
                <span key={k} className={`text-xs font-medium px-2.5 py-1 rounded-full ${dept.bg} dark:bg-gray-800 ${dept.text} dark:opacity-80 border ${dept.border} dark:border-gray-700`}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Lesson5Departments() {
  return (
    <div className="space-y-10">

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-36 h-36 bg-white/10 rounded-full blur-3xl" />
        <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-3">Lesson 5</p>
        <h2 className="text-3xl font-bold mb-3">Key Departments</h2>
        <p className="text-gray-300 leading-relaxed max-w-lg">
          Meet the teams that power AMRYTT MEDIA. 8 departments, one mission — delivering exceptional digital marketing results.
        </p>
      </motion.div>

      {/* Intro callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6"
      >
        <p className="text-indigo-800 dark:text-indigo-300 font-semibold text-sm mb-1">🏢 How We're Organized</p>
        <p className="text-indigo-700 dark:text-indigo-300 text-[15px] leading-relaxed">
          AMRYTT MEDIA is organized into <strong>8 key departments</strong> that work together to deliver exceptional digital marketing solutions. Each department has a distinct role, but all of us work as one team.
        </p>
      </motion.div>

      {/* Department count */}
      <div className="grid grid-cols-4 gap-3">
        {['8 Departments', '45+ People', '1 Mission', '∞ Growth'].map((stat, i) => (
          <motion.div
            key={stat}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center"
          >
            <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">{stat}</p>
          </motion.div>
        ))}
      </div>

      {/* Department cards */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">The 8 Departments</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">✨ Tap each department card to learn what they do.</p>
        </motion.div>
        <div className="space-y-3">
          {departments.map((dept, i) => (
            <DeptCard key={dept.name} dept={dept} index={i} />
          ))}
        </div>
      </div>

      {/* Congratulations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-3xl p-8 text-center"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-3">Module 1 Complete!</h2>
        <p className="text-indigo-200 leading-relaxed max-w-md mx-auto">
          You've now learned about AMRYTT MEDIA's history, values, goals, philosophy, and team structure. You're officially part of the family!
        </p>
        <p className="mt-4 text-indigo-300 text-sm">Ready for Module 2? Let's dive into Digital Marketing!</p>
      </motion.div>

    </div>
  )
}
