'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const pillars = [
  {
    number: '01',
    title: 'Quality and Integrity First',
    emoji: '⭐',
    quote: '"We are committed to providing top-tier services with a focus on quality, integrity, and transparency. Our philosophy revolves around building trust with our clients by delivering results that exceed expectations, while maintaining ethical practices in everything we do."',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
  },
  {
    number: '02',
    title: 'Empowering Growth Through Partnerships',
    emoji: '🤝',
    quote: '"Our philosophy is centered on building strong, long-term partnerships that foster mutual growth. We believe in empowering our clients by delivering high-quality services at competitive prices."',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
  },
  {
    number: '03',
    title: 'Success Through Innovation',
    emoji: '🚀',
    quote: '"We strive to stay ahead of the curve by constantly improving our processes, adopting the latest technologies, and delivering creative solutions that help our clients succeed in an ever-evolving digital world."',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  {
    number: '04',
    title: 'Customer Centric',
    emoji: '❤️',
    quote: '"Our philosophy is simple: put the client first. We believe that by understanding the unique needs of each client and tailoring our services accordingly, we can help them achieve their goals. Success for our clients is success for us."',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
  },
  {
    number: '05',
    title: 'Sustainability in Business',
    emoji: '🌱',
    quote: '"We believe in creating sustainable business practices, not just for ourselves but for our clients as well. Our philosophy revolves around building long-lasting relationships and delivering results that stand the test of time."',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  {
    number: '06',
    title: 'Global Reach, Personalized Service',
    emoji: '🌍',
    quote: '"Our philosophy is to combine the best of both worlds — global reach with personalized service. We aim to provide scalable solutions while maintaining a personalized approach, ensuring that every client feels heard and valued."',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
  },
]

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <div
        className={`bg-white rounded-2xl border ${pillar.border} shadow-sm overflow-hidden cursor-pointer`}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Header */}
        <div className={`${pillar.bg} px-6 py-5 flex items-center gap-4`}>
          <div className={`w-12 h-12 bg-gradient-to-br ${pillar.color} rounded-xl flex items-center justify-center text-xl shadow-sm`}>
            {pillar.emoji}
          </div>
          <div className="flex-1">
            <p className={`text-xs font-bold uppercase tracking-widest ${pillar.text} mb-0.5`}>Pillar {pillar.number}</p>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{pillar.title}</h3>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-7 h-7 flex-shrink-0 ${pillar.bg} ${pillar.text} border ${pillar.border} rounded-full flex items-center justify-center text-lg font-bold`}
          >
            +
          </motion.div>
        </div>

        {/* Expandable content */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 py-5 border-t border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed italic">{pillar.quote}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Lesson4Philosophy() {
  return (
    <div className="space-y-10">

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest mb-3">Lesson 4</p>
        <h2 className="text-3xl font-bold mb-3">AMRYTT MEDIA Philosophy</h2>
        <p className="text-violet-100 leading-relaxed max-w-lg">
          Our philosophy is the "why" behind everything we do. Six pillars that define how we work, how we treat clients, and how we grow together.
        </p>
      </motion.div>

      {/* Intro text */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-6"
      >
        <p className="text-gray-700 leading-relaxed text-[15px]">
          AMRYTT MEDIA is committed to providing exceptional digital solutions that empower businesses to succeed in today's competitive landscape. Our philosophy is rooted in <strong>quality, integrity, partnership, innovation, customer focus, sustainability, and global reach</strong>.
        </p>
      </motion.div>

      {/* Pillars */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h2 className="text-xl font-bold text-gray-900">The 6 Pillars</h2>
          <p className="text-gray-500 text-sm mt-1">✨ Tap each pillar to read the full philosophy statement.</p>
        </motion.div>
        <div className="space-y-3">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.number} pillar={pillar} index={i} />
          ))}
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
      >
        <p className="text-lg font-bold text-gray-900 mb-3">🎯 Why This Matters for You</p>
        <p className="text-gray-600 leading-relaxed">
          As a member of AMRYTT MEDIA, you are a living embodiment of these principles. Every email you write, every client interaction, every deliverable — it's all rooted in these 6 pillars. Understanding them isn't just useful. It's essential.
        </p>
      </motion.div>

    </div>
  )
}
