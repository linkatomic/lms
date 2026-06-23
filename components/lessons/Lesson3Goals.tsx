'use client'

import { motion } from 'framer-motion'
import { Rocket, Globe, Target } from 'lucide-react'

const shortTermGoals = [
  {
    emoji: '📋',
    title: 'Expand Publisher Network',
    desc: 'Increase publishers on guestpostlinks.net to 50,000 by 2024 — enhancing diversity and reach for advertisers.',
  },
  {
    emoji: '⚙️',
    title: 'Enhance Platform Features',
    desc: 'Develop and launch advanced features and tools for guestpostlinks.net and internal processing.',
  },
  {
    emoji: '🌐',
    title: 'Launch New Products',
    desc: 'Launch guestpostsites.com, backlinksmonitor.io, caseconverter.tools, and getindexednow.com.',
  },
  {
    emoji: '📣',
    title: 'Market Penetration',
    desc: 'Increase brand awareness in key markets by 25% through targeted campaigns, SEO, and partnerships.',
  },
]

const longTermGoals = [
  {
    emoji: '🏆',
    title: 'Industry Leadership',
    desc: 'Become a recognized leader in digital marketing automation — known for innovation, quality, and service excellence.',
  },
  {
    emoji: '🛠️',
    title: 'Diversification of Services',
    desc: 'Launch 5+ additional digital marketing tools over the next five years, including influencer marketing and social media automation.',
  },
  {
    emoji: '🌍',
    title: 'Global Expansion',
    desc: 'Expand platforms to serve clients globally with localized support and features for each market.',
  },
  {
    emoji: '♻️',
    title: 'Sustainability & Social Responsibility',
    desc: 'Support sustainable digital marketing through education, community engagement, and support for emerging marketers.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } }),
}


export default function Lesson3Goals() {
  return (
    <div className="space-y-10">

      {/* Intro banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Lesson 3</p>
        <h2 className="text-3xl font-bold mb-3">Goals & Objectives</h2>
        <p className="text-blue-100 leading-relaxed max-w-lg">
          Goals give us direction. They tell us where we're going — and how we'll know when we get there.
        </p>
      </motion.div>

      {/* What are goals */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-amber-50 border border-amber-100 rounded-2xl p-6"
      >
        <p className="text-amber-800 font-semibold text-sm mb-1">📖 Quick Definition</p>
        <p className="text-amber-900 text-[15px] leading-relaxed">
          Goals and objectives are the <strong>specific targets and outcomes</strong> a company aims to achieve. They provide a clear direction for the company's activities and help measure its progress.
        </p>
      </motion.div>

      {/* Short-term goals */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Short-Term Goals</h2>
            <p className="text-sm text-gray-500">Things we're actively working on right now</p>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {shortTermGoals.map((goal, i) => (
            <motion.div
              key={goal.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5"
            >
              <span className="text-3xl mb-3 block">{goal.emoji}</span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{goal.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{goal.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-500 text-sm font-medium">
          <Rocket className="w-4 h-4" />
          Looking further ahead…
        </div>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Long-term goals */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Long-Term Goals</h2>
            <p className="text-sm text-gray-500">The big picture — where we're headed over the next 5+ years</p>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {longTermGoals.map((goal, i) => (
            <motion.div
              key={goal.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5"
            >
              <span className="text-3xl mb-3 block">{goal.emoji}</span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{goal.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{goal.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl border border-indigo-100 p-7"
      >
        <p className="text-lg font-bold text-gray-900 mb-2">🎯 Your Role in These Goals</p>
        <p className="text-gray-600 leading-relaxed">
          Every person at AMRYTT MEDIA contributes to these goals. As a new team member, your work — no matter which department you're in — directly supports our mission to grow, innovate, and lead.
        </p>
      </motion.div>

    </div>
  )
}
