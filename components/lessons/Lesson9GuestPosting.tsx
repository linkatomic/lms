'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, Search, Award, Link2, Target } from 'lucide-react'

// ──────────────────────────────────────────────
// YouTube embed (reused pattern)
// ──────────────────────────────────────────────
function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-black">
      <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span className="text-white text-xs font-semibold truncate">{title}</span>
      </div>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-2 animate-pulse">
                <svg className="w-5 h-5 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="text-gray-400 text-xs">Loading video…</p>
            </div>
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Benefits data
// ──────────────────────────────────────────────
const benefits = [
  {
    num: '01', icon: Users,
    title: 'Increased Website Traffic',
    tagline: 'Borrowed audience, real visitors.',
    desc: 'By contributing content to popular blogs or websites, you put your brand in front of their existing audience — attracting new visitors to your own site who would never have found you otherwise.',
    analogy: 'Like being a guest speaker at a packed conference. The crowd came for the event, but they leave knowing your name.',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
    dot: 'bg-emerald-500',
  },
  {
    num: '02', icon: Search,
    title: 'Improved SEO',
    tagline: 'Backlinks = ranking fuel.',
    desc: 'Guest posts almost always include a backlink to your website. Each link from a reputable site is a "vote of confidence" in Google\'s eyes — helping you rank higher in search results.',
    analogy: 'Like getting a recommendation letter from a respected professor. Google trusts recommendations from trusted sources.',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    dot: 'bg-blue-500',
  },
  {
    num: '03', icon: Award,
    title: 'Brand Authority',
    tagline: 'Publish on their stage, own your reputation.',
    desc: 'Publishing well-written, informative content on reputable websites signals to readers (and search engines) that you are an expert in your field — not just another faceless company.',
    analogy: 'Like getting an article published in a respected magazine. Being featured there automatically elevates how people perceive you.',
    bg: 'bg-violet-50 dark:bg-violet-950',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
    dot: 'bg-violet-500',
  },
  {
    num: '04', icon: Link2,
    title: 'Networking Opportunities',
    tagline: 'Relationships that open doors.',
    desc: 'Guest posting connects you with bloggers, influencers, and industry experts. These relationships often lead to future collaborations, referrals, and joint opportunities that money can\'t easily buy.',
    analogy: 'Like co-writing a project with someone well-connected in your field. The collaboration itself is the introduction.',
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
    dot: 'bg-amber-500',
  },
  {
    num: '05', icon: Target,
    title: 'Lead Generation',
    tagline: 'The right audience, already interested.',
    desc: 'High-quality content on relevant platforms attracts potential clients or customers who are already interested in your niche. These are warm leads — far easier to convert than cold advertising.',
    analogy: 'Like opening a shop inside a store that already sells complementary products. Their customers are already your ideal buyers.',
    bg: 'bg-rose-50 dark:bg-rose-950',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-100 dark:bg-rose-900',
    dot: 'bg-rose-500',
  },
]

function BenefitCard({ b, index }: { b: typeof benefits[0]; index: number }) {
  const [open, setOpen] = useState(false)
  const Icon = b.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl border ${b.border} shadow-sm overflow-hidden cursor-pointer`}
        onClick={() => setOpen(o => !o)}
      >
        {/* Header */}
        <div className={`${b.bg} px-5 py-4 flex items-center gap-4`}>
          <div className={`w-10 h-10 ${b.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${b.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${b.text} mb-0.5`}>{b.num}</p>
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm">{b.title}</h3>
            <p className={`text-xs italic ${b.text} opacity-80 mt-0.5`}>{b.tagline}</p>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-6 h-6 flex-shrink-0 ${b.iconBg} ${b.text} border ${b.border} rounded-full flex items-center justify-center font-bold text-base`}
          >
            +
          </motion.div>
        </div>

        {/* Expand */}
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-hidden"
        >
          <div className="px-5 py-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{b.desc}</p>
            <div className={`${b.bg} border ${b.border} rounded-xl px-4 py-3`}>
              <p className={`text-xs font-bold uppercase tracking-widest ${b.text} mb-1`}>💡 Think of it like this</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{b.analogy}"</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────
export default function Lesson9GuestPosting() {
  return (
    <div className="space-y-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest mb-3">Module 2 · Lesson 4</p>
          <h2 className="text-3xl font-bold mb-3">What is Guest Posting?</h2>
          <p className="text-emerald-100 leading-relaxed max-w-lg">
            The strategy that sits at the heart of everything AMRYTT MEDIA does — and one of the most powerful ways to grow online authority.
          </p>
        </div>
      </motion.div>

      {/* AMRYTT spotlight callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">⭐</span>
          <div>
            <p className="font-bold text-lg mb-1">This is AMRYTT MEDIA's core service.</p>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Everything you'll learn in this lesson — the strategy, the benefits, the process — is what our entire team works on every single day. Understanding guest posting deeply is not just helpful, it's essential for every person in this company.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Definition */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">The Definition</p>
        <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium">
          Guest posting (also called <span className="text-emerald-600 dark:text-emerald-400 font-bold">guest blogging</span>) is the practice of <span className="text-emerald-600 dark:text-emerald-400 font-bold">writing and publishing an article on someone else's website</span> as a guest author — in exchange for a backlink, exposure to their audience, or both.
        </p>

        {/* How it works — simple 3-step visual */}
        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">How it works — in 3 steps</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { step: '1', label: 'Write an article', sub: 'Original, high-quality content on a topic relevant to the host site.', emoji: '✍️' },
              { step: '2', label: 'Publish on their site', sub: 'The host website publishes it with your name and a link back to your website.', emoji: '🌐' },
              { step: '3', label: 'Both sides win', sub: 'They get free quality content. You get traffic, a backlink, and brand exposure.', emoji: '🏆' },
            ].map((s, i) => (
              <div key={i} className="flex-1 flex gap-3 items-start bg-emerald-50 dark:bg-emerald-950 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-1">
                    <span className="mr-1.5">{s.emoji}</span>{s.label}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* YouTube embed */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
          Watch: What is Guest Posting?
        </p>
        <YouTubeEmbed
          videoId="BltNT6yy0So"
          title="What is Guest Posting? — Video Explainer"
        />
      </motion.div>

      {/* 5 Benefits */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">5 Key Benefits of Guest Posting</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            ✨ <strong>Tap each benefit</strong> for a plain-English explanation and a real-world analogy.
          </p>
        </motion.div>
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <BenefitCard key={b.num} b={b} index={i} />
          ))}
        </div>
      </div>

      {/* AMRYTT team connection */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
          Who Does What at AMRYTT MEDIA
        </p>
        <div className="space-y-3">
          {[
            {
              team: 'Operations Team',
              emoji: '⚙️',
              role: 'Receives the client order and kicks off the entire process. Coordinates between teams to ensure smooth, fast delivery.',
              bg: 'bg-indigo-50 dark:bg-indigo-950',
              border: 'border-indigo-200 dark:border-indigo-800',
              text: 'text-indigo-700 dark:text-indigo-300',
            },
            {
              team: 'Content Writers',
              emoji: '✍️',
              role: 'Write the guest post — original, well-researched articles that are good enough to be published on reputable websites.',
              bg: 'bg-pink-50 dark:bg-pink-950',
              border: 'border-pink-200 dark:border-pink-800',
              text: 'text-pink-700 dark:text-pink-300',
            },
            {
              team: 'Blogger Outreach Team',
              emoji: '🤝',
              role: 'Find the right websites, negotiate placements, and secure the published backlinks — at the best possible rates.',
              bg: 'bg-violet-50 dark:bg-violet-950',
              border: 'border-violet-200 dark:border-violet-800',
              text: 'text-violet-700 dark:text-violet-300',
            },
          ].map((t, i) => (
            <motion.div
              key={t.team}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-4 items-start ${t.bg} border ${t.border} rounded-xl p-4`}
            >
              <span className="text-2xl flex-shrink-0">{t.emoji}</span>
              <div>
                <p className={`font-bold text-sm ${t.text} mb-1`}>{t.team}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl border border-emerald-100 dark:border-emerald-800 p-7"
      >
        <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Key Takeaway</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Guest posting is a win-win strategy — the host site gets quality content, and the guest author gets traffic, backlinks, authority, and leads. At AMRYTT MEDIA, we do this at scale for clients around the world. Every article written, every site outreached, and every link placed is one guest post that makes a client's website stronger.
        </p>
      </motion.div>

    </div>
  )
}
