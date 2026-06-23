'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Target, Eye, Heart } from 'lucide-react'

const coreValues = [
  {
    name: 'Mutual Respect',
    emoji: '🤝',
    quote: '"Respect is a two-way street, if you want to get it, you\'ve got to give it."',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    name: 'Commitment',
    emoji: '💪',
    quote: '"Without commitment, you cannot have depth in anything, whether it\'s a relationship, a business, or a hobby."',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    name: 'Integrity',
    emoji: '⭐',
    quote: '"Real integrity is doing the right thing, knowing that nobody\'s going to know whether you did it or not."',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    name: 'Openness',
    emoji: '🌐',
    quote: '"The more we open ourselves, the more we have within ourselves."',
    color: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    name: 'Teamwork',
    emoji: '🙌',
    quote: '"Coming together is a beginning, staying together is progress, and working together is a success."',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  {
    name: 'Customer Experience',
    emoji: '❤️',
    quote: '"Customer service should not be a department. It should be the entire company."',
    color: 'from-red-500 to-pink-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
]

function FlipCard({ value, index }: { value: typeof coreValues[0]; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d', height: 160 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl border ${value.border} ${value.bg} flex flex-col items-center justify-center p-5 shadow-sm`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl mb-3">{value.emoji}</span>
          <p className="font-bold text-gray-800 text-center text-sm">{value.name}</p>
          <p className="text-xs text-gray-400 mt-2">Tap to reveal quote →</p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center p-5 shadow-sm`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-white text-xs leading-relaxed text-center font-medium italic">
            {value.quote}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

const missionPoints = [
  'Deliver exceptional results meeting every client\'s needs with precision and speed — without compromising on quality.',
  'Stay ahead of the curve by embracing and shaping the latest industry trends and best practices.',
  'Invest in the growth of our team, creating a collaborative culture that sparks creativity and nurtures leadership.',
  'Forge lasting partnerships with clients, offering personalized, top-tier services with transparent communication.',
]

const visionPoints = [
  'Rise as one of India\'s most recognized and respected leaders in the digital marketing arena.',
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
        <h2 className="text-3xl font-bold mb-3">Vision, Mission & Core Values</h2>
        <p className="text-indigo-100 leading-relaxed max-w-lg">
          These aren't just words on a wall — they're the compass that guides every decision at AMRYTT MEDIA.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
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
              <p className="text-gray-600 leading-relaxed text-[15px]">{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
        </div>
        <div className="space-y-4">
          {visionPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start bg-violet-50 rounded-xl p-4 border border-violet-100"
            >
              <span className="text-violet-500 mt-0.5 flex-shrink-0">◆</span>
              <p className="text-gray-700 leading-relaxed text-[15px]">{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Core Values — flip cards */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Core Values</h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-500 text-sm mb-5 ml-13"
        >
          ✨ <strong>Tap each card</strong> to reveal the guiding quote behind every value.
        </motion.p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {coreValues.map((value, i) => (
            <FlipCard key={value.name} value={value} index={i} />
          ))}
        </div>
      </div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-7"
      >
        <p className="text-lg font-bold text-gray-900 mb-2">🎯 Key Takeaway</p>
        <p className="text-gray-600 leading-relaxed">
          At AMRYTT MEDIA, our Mission is our <em>daily commitment</em>, our Vision is our <em>north star</em>, and our Core Values are the <em>rules we live by</em>. Every decision — big or small — is filtered through these principles.
        </p>
      </motion.div>

    </div>
  )
}
