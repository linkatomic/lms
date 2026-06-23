'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  FileText, BookOpen, BarChart2, Video,
  TrendingUp, Share2, Mail, Mic, Monitor,
  Megaphone, Zap, Users, ShieldCheck, Heart,
} from 'lucide-react'

// ──────────────────────────────────────────────
// Embedded YouTube player component
// ──────────────────────────────────────────────
function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-black">
      {/* Video label */}
      <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span className="text-white text-xs font-semibold truncate">{title}</span>
      </div>
      {/* Iframe */}
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
// Importance data
// ──────────────────────────────────────────────
const importance = [
  {
    icon: Megaphone,
    title: 'Grow Brand Awareness',
    desc: 'By addressing relevant topics in blog posts or social media, content marketing helps boost your company\'s name recognition — even with people who\'ve never heard of you.',
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
  },
  {
    icon: Zap,
    title: 'Create Demand',
    desc: 'Content like e-books and whitepapers can create an urgent need for your products or services by resonating with your target audience\'s real problems.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
  },
  {
    icon: TrendingUp,
    title: 'Drive Organic Visitors',
    desc: 'Optimized content improves your search engine visibility — so people find you on Google without you paying for an ad. More traffic = more sales opportunities.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
  },
  {
    icon: Users,
    title: 'Generate Sales Leads',
    desc: 'Gating valuable content (like a free guide) behind a sign-up form lets you capture contact details from interested prospects — turning readers into potential clients.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    icon: ShieldCheck,
    title: 'Build Trust',
    desc: 'Long-form content establishes your expertise. When you consistently share useful knowledge, audiences begin to see you as an authority — not just another vendor.',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50 dark:bg-sky-950',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    iconBg: 'bg-sky-100 dark:bg-sky-900',
  },
  {
    icon: Heart,
    title: 'Earn Customer Loyalty',
    desc: 'Educational content supports current customers, not just prospects. Helping existing clients succeed encourages repeat purchases and genuine brand loyalty.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-100 dark:bg-rose-900',
  },
]

// ──────────────────────────────────────────────
// Examples data
// ──────────────────────────────────────────────
const examples = [
  {
    num: '01', icon: FileText, name: 'Blog Posts',
    short: 'Written articles on your website',
    detail: 'Companies publish articles related to their industry. These build SEO, showcase expertise, and keep readers coming back. Example: A skincare brand writing "Top 10 Tips for Glowing Skin."',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-950',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-700 dark:text-pink-300',
    iconBg: 'bg-pink-100 dark:bg-pink-900',
    hasVideo: true,
  },
  {
    num: '02', icon: BookOpen, name: 'E-books & Whitepapers',
    short: 'Deep-dive downloadable guides',
    detail: 'Offering in-depth information through downloadable resources attracts potential customers who want detailed knowledge — and often willingly share their contact info to get it.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
  },
  {
    num: '03', icon: BarChart2, name: 'Infographics',
    short: 'Visual data made shareable',
    detail: 'Infographics turn complex information into easy-to-digest visuals. They\'re highly shareable on social media and simplify concepts that would take paragraphs to explain in text.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
  },
  {
    num: '04', icon: Video, name: 'Videos',
    short: 'How-tos, tutorials, product reviews',
    detail: 'Video content is the most engaging type of content online. Companies create how-to videos, tutorials, or product reviews to connect with their audience in a personal, memorable way.',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-900',
  },
  {
    num: '05', icon: TrendingUp, name: 'Case Studies',
    short: 'Real results that build credibility',
    detail: 'A digital marketing agency publishes a case study showing how they increased a client\'s website traffic by 300%. This builds far more trust than any advertisement ever could.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
  },
  {
    num: '06', icon: Share2, name: 'Social Media Posts',
    short: 'Engaging content where your audience lives',
    detail: 'A travel company posts user-generated photos and travel tips on Instagram to engage followers. Social posts keep your brand top of mind without being overtly promotional.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    num: '07', icon: Mail, name: 'Email Newsletters',
    short: 'Consistent value in every inbox',
    detail: 'An online fitness brand sends weekly newsletters with workout tips and recipes to keep subscribers interested and coming back. Newsletters build habits around your brand.',
    color: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50 dark:bg-teal-950',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-900',
  },
  {
    num: '08', icon: Mic, name: 'Podcasts',
    short: 'Expert conversations on the go',
    detail: 'A finance firm hosts a podcast called "Money Management for Beginners" to share advice with listeners. Audio content reaches people during commutes, workouts, and daily tasks.',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50 dark:bg-sky-950',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    iconBg: 'bg-sky-100 dark:bg-sky-900',
  },
  {
    num: '09', icon: Monitor, name: 'Webinars',
    short: 'Live interactive education sessions',
    detail: 'A digital marketing agency hosts a webinar on "SEO Strategies for 2024" to educate and interact with potential clients — generating leads while delivering real value.',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
  },
]

// ──────────────────────────────────────────────
// Example card
// ──────────────────────────────────────────────
function ExampleCard({
  ex, index, open, onToggle,
}: {
  ex: typeof examples[0]; index: number; open: boolean; onToggle: () => void
}) {
  const Icon = ex.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl border ${ex.border} shadow-sm overflow-hidden cursor-pointer`}
        onClick={onToggle}
      >
        <div className={`${ex.bg} px-5 py-4 flex items-center gap-4`}>
          <div className={`w-10 h-10 ${ex.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${ex.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${ex.text} mb-0.5`}>{ex.num}</p>
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm">{ex.name}</h3>
            <p className={`text-xs ${ex.text} mt-0.5 opacity-80`}>{ex.short}</p>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-6 h-6 flex-shrink-0 ${ex.iconBg} ${ex.text} border ${ex.border} rounded-full flex items-center justify-center font-bold text-base`}
          >
            +
          </motion.div>
        </div>
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-hidden"
        >
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{ex.detail}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────
export default function Lesson8ContentMarketing() {
  const [openExample, setOpenExample] = useState<number | null>(null)

  const toggle = (i: number) => setOpenExample(openExample === i ? null : i)

  return (
    <div className="space-y-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-pink-200 text-sm font-semibold uppercase tracking-widest mb-3">Module 2 · Lesson 3</p>
          <h2 className="text-3xl font-bold mb-3">What is Content Marketing?</h2>
          <p className="text-pink-100 leading-relaxed max-w-lg">
            Not all marketing is about selling. Content marketing is about giving first — and letting the value you create do the convincing.
          </p>
        </div>
      </motion.div>

      {/* Definition */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-3">The Definition</p>
        <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium">
          Content marketing is a form of marketing focused on <span className="text-pink-600 dark:text-pink-400 font-bold">creating, publishing, and distributing content for a targeted audience online</span> — to attract, engage, and ultimately convert them into customers.
        </p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Attract Attention', emoji: '🎯' },
            { label: 'Generate Leads', emoji: '📥' },
            { label: 'Build Loyalty', emoji: '❤️' },
            { label: 'Drive Sales', emoji: '📈' },
          ].map(g => (
            <div key={g.label} className="flex flex-col items-center gap-2 bg-pink-50 dark:bg-pink-950 rounded-xl p-3 border border-pink-100 dark:border-pink-800 text-center">
              <span className="text-2xl">{g.emoji}</span>
              <p className="text-xs font-semibold text-pink-700 dark:text-pink-300">{g.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* YouTube video 1 — What is Content Marketing? */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-3">
          Watch: What is Content Marketing?
        </p>
        <YouTubeEmbed
          videoId="oZ5F4aknYFY"
          title="What is Content Marketing? — Video Explainer"
        />
      </motion.div>

      {/* Importance — 6 points */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Why Content Marketing Matters</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            6 reasons it's a non-negotiable part of any digital strategy.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {importance.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`bg-white dark:bg-gray-900 rounded-2xl border ${item.border} shadow-sm p-6 flex gap-4`}
              >
                <div className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-5 h-5 ${item.text}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Examples — 9 types */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">9 Examples of Content Marketing</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            ✨ <strong>Tap each type</strong> to see what it is and a real example.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-3">
          {examples.map((ex, i) => (
            <div key={ex.num}>
              <ExampleCard
                ex={ex}
                index={i}
                open={openExample === i}
                onToggle={() => toggle(i)}
              />
              {/* YouTube video 2 — placed right after Blog Posts card when it's open */}
              {ex.num === '01' && openExample === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <YouTubeEmbed
                    videoId="3H_-Mjq9OsA"
                    title="Blog Posts as Content Marketing — Learn More"
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 rounded-2xl border border-pink-100 dark:border-pink-800 p-7"
      >
        <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Key Takeaway</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Content marketing works because it <em>gives before it asks</em>. Every blog post, video, case study, and newsletter builds trust over time — and trust converts to customers far more reliably than any cold advertisement. At AMRYTT MEDIA, the content our writers create is the foundation of every link building campaign.
        </p>
      </motion.div>

    </div>
  )
}
