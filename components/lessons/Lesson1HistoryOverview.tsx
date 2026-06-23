'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Calendar, Users, Star, Zap, TrendingUp } from 'lucide-react'

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))
  const [display, setDisplay] = useState(0)
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const controls = animate(count, to, { duration: 1.8, ease: 'easeOut' })
    count.on('change', v => setDisplay(Math.round(v)))
    return controls.stop
  }, [to, count])

  return <span>{display}{suffix}</span>
}

const stats = [
  { icon: Calendar, label: 'Founded', value: 2022, suffix: '', color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' },
  { icon: TrendingUp, label: 'Years of Growth', value: 3, suffix: '+', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  { icon: Users, label: 'Team Members', value: 45, suffix: '+', color: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  { icon: Star, label: 'Years Experience', value: 12, suffix: ' Yrs', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
]

const timeline = [
  { year: '2022', title: 'AMRYTT MEDIA Founded', desc: 'Launched in Sheridan, Wyoming by Mr. Bhagyesh Patel & Mr. Manish Suthar with a team of 5.', icon: '🚀' },
  { year: '2023', title: 'Rapid Growth', desc: 'Expanded services across Content Marketing, PPC, SEO, and Social Media. Team doubled.', icon: '📈' },
  { year: '2024', title: 'Scaling Up', desc: 'Grew to 45+ professionals. Launched guestpostlinks.net and expanded to global clients.', icon: '🌍' },
  { year: '2025', title: 'Leading the Future', desc: 'Pioneering digital marketing innovation — and you\'re now part of this journey!', icon: '⭐' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function Lesson1HistoryOverview() {
  return (
    <div className="space-y-10">

      {/* Welcome hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 text-white p-8 sm:p-12"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-3">Welcome to AMRYTT MEDIA LLC</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            We don't just keep pace<br />with digital trends —<br />
            <span className="text-yellow-300">we lead them.</span>
          </h2>
          <p className="text-indigo-100 text-base max-w-xl leading-relaxed">
            A fast-growing, performance-driven digital marketing agency crafting impactful, data-driven strategies across Content Marketing, PPC, Social Media, and SEO.
          </p>
          <div className="mt-5 flex items-center gap-2 text-indigo-200 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Sheridan, Wyoming · Founded 2022</span>
          </div>
        </div>
      </motion.div>

      {/* Animated stats */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-gray-800 mb-5"
        >
          AMRYTT MEDIA by the numbers
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`bg-white rounded-2xl border ${s.border} p-5 text-center shadow-sm`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our story */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500" /> Our Story
        </h2>
        <p className="text-gray-600 leading-relaxed text-base">
          Founded in <strong>Sheridan, Wyoming</strong> in 2022 by <strong>Mr. Bhagyesh Patel</strong> and <strong>Mr. Manish Suthar</strong> — two visionary leaders with over <strong>12 years of combined digital marketing experience</strong>.
        </p>
        <p className="text-gray-600 leading-relaxed text-base mt-3">
          Their passion for the industry is infectious, inspiring a team of experts to push boundaries and drive performance. With their leadership, AMRYTT MEDIA embodies a forward-thinking, client-centric philosophy.
        </p>

        <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-indigo-800 font-semibold text-sm">💡 Did you know?</p>
          <p className="text-indigo-700 text-sm mt-1">
            In just <strong>3 years</strong>, AMRYTT MEDIA grew from <strong>5 people</strong> to a thriving team of <strong>45+ professionals</strong>! That's 9× growth — a testament to our culture of innovation and excellence.
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-gray-800 mb-6"
        >
          Our Growth Journey
        </motion.h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-indigo-100" />
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative pl-16"
              >
                <div className="absolute left-0 w-12 h-12 bg-white border-2 border-indigo-200 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                  {item.icon}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{item.year}</span>
                  <h3 className="font-bold text-gray-900 mt-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Services overview */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl border border-indigo-100 p-7"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">What We Do</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Content Marketing', 'Paid Search (PPC)', 'Display Advertising', 'Social Media Marketing', 'SEO', 'Guest Posting'].map(service => (
            <div key={service} className="bg-white rounded-xl px-4 py-3 text-sm font-medium text-gray-700 border border-gray-100 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
              {service}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mission teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
      >
        <p className="text-gray-500 text-sm font-medium mb-2">Our Mission (in a nutshell)</p>
        <p className="text-gray-900 text-lg font-semibold leading-relaxed italic">
          "To elevate brands and achieve measurable, tangible success through a balance of creativity and precision."
        </p>
        <p className="text-gray-400 text-sm mt-3">👉 We'll dive deep into Mission, Vision & Core Values in the next lesson!</p>
      </motion.div>

    </div>
  )
}
