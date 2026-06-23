'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  FileText, Search, TrendingUp, Share2, Mail,
  Link, MousePointer, Star, Smartphone, BarChart2,
} from 'lucide-react'

// ──────────────────────────────────────────────
// Hub-and-spoke diagram matching the doc image
// ──────────────────────────────────────────────
function DigitalMarketingDiagram() {
  const C = { x: 300, y: 220 }

  const nodes = [
    { label: ['SEO'],             cx: 300, cy: 58,  color: '#3b82f6' },
    { label: ['VIDEO'],           cx: 480, cy: 102, color: '#7c3aed' },
    { label: ['MOBILE','& TABLET'], cx: 540, cy: 220, color: '#10b981' },
    { label: ['ROI'],             cx: 480, cy: 338, color: '#f59e0b' },
    { label: ['SEM'],             cx: 300, cy: 382, color: '#ef4444' },
    { label: ['PAY PER','CLICK'], cx: 120, cy: 338, color: '#06b6d4' },
    { label: ['CONTENT'],         cx: 60,  cy: 220, color: '#ec4899' },
    { label: ['SOCIAL','MEDIA'],  cx: 120, cy: 102, color: '#22c55e' },
  ]

  return (
    <svg viewBox="0 0 600 440" className="w-full max-w-sm mx-auto">
      <defs>
        <linearGradient id="cg6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>

      {/* Connector lines */}
      {nodes.map((n, i) => (
        <line key={i}
          x1={C.x} y1={C.y} x2={n.cx} y2={n.cy}
          stroke={n.color} strokeWidth="1.5" strokeOpacity="0.5"
          strokeDasharray="6 4"
        />
      ))}

      {/* Outer nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r="37"
            fill={n.color} fillOpacity="0.12"
            stroke={n.color} strokeWidth="1.5"
          />
          {n.label.map((line, li) => (
            <text
              key={li}
              x={n.cx}
              y={n.cy + (n.label.length === 1 ? 4 : li === 0 ? -4 : 11)}
              textAnchor="middle"
              fill={n.color}
              fontSize="9"
              fontWeight="800"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* Centre */}
      <ellipse cx={C.x} cy={C.y} rx="100" ry="66" fill="url(#cg6)" />
      <text x={C.x} y={C.y - 10} textAnchor="middle" fill="white" fontSize="14"
        fontWeight="800" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="1">
        DIGITAL
      </text>
      <text x={C.x} y={C.y + 12} textAnchor="middle" fill="white" fontSize="14"
        fontWeight="800" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="1">
        MARKETING
      </text>
    </svg>
  )
}

// ──────────────────────────────────────────────
// 10 Key Components — beginner-friendly
// ──────────────────────────────────────────────
const components = [
  {
    num: '01', name: 'Content Marketing', icon: FileText,
    what: 'Creating useful articles, videos, or posts that attract people to your brand by giving them value first.',
    analogy: 'Like giving away a free recipe book to get people into your restaurant — you build trust before they spend a rupee.',
    example: 'A blog post "5 Mistakes That Kill Your SEO Rankings" brings in potential clients who then hire us for link building.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-950',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-700 dark:text-pink-300',
    iconBg: 'bg-pink-100 dark:bg-pink-900',
  },
  {
    num: '02', name: 'SEO', icon: Search,
    what: 'Making your website easy for Google to find so it shows up high in search results — without paying for ads.',
    analogy: 'Think of Google as a librarian. SEO is how you organize your website so the librarian puts it on the front shelf, not in the back room.',
    example: 'When someone searches "buy guest posts India," showing up on page 1 of Google instead of page 5.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    num: '03', name: 'SEM', icon: TrendingUp,
    what: 'Paying search engines like Google to show your ad at the top of results — instant visibility, no waiting.',
    analogy: 'Like renting a billboard on the busiest road in town. You skip the queue and go straight to the top — but you pay for it.',
    example: 'Running a Google Ad for "link building service" that appears above all organic results the same day you launch it.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
  },
  {
    num: '04', name: 'Social Media Marketing', icon: Share2,
    what: 'Using platforms like LinkedIn, Instagram, or Twitter to reach and engage your target audience consistently.',
    analogy: 'Instead of just handing out business cards, it\'s like joining the conversation at a party where your future clients are already hanging out.',
    example: 'Posting a client success story on LinkedIn gets shared 50 times and brings in 10 new inquiries that week.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
  },
  {
    num: '05', name: 'Email Marketing', icon: Mail,
    what: 'Sending targeted, personalized emails to keep your audience informed, build relationships, and bring back past customers.',
    analogy: 'Like writing a personal letter to each customer instead of dropping a generic flyer in every mailbox — it actually feels personal.',
    example: 'A monthly email to past clients about new services — many re-order just because of a well-timed reminder.',
    color: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50 dark:bg-teal-950',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-900',
  },
  {
    num: '06', name: 'Affiliate Marketing', icon: Link,
    what: 'Paying partners (affiliates) a commission every time they refer a paying customer to you.',
    analogy: 'Like a real estate agent who earns a commission for connecting buyer and seller — everyone wins, and you only pay when it works.',
    example: 'A popular SEO blogger mentions AMRYTT Media. Each client they refer earns the blogger a 10% commission.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    iconBg: 'bg-orange-100 dark:bg-orange-900',
  },
  {
    num: '07', name: 'Pay-Per-Click (PPC)', icon: MousePointer,
    what: 'Running online ads where you only pay when someone actually clicks — not just for the ad being shown.',
    analogy: 'Like paying for a taxi only when a passenger gets in — not just for parking it on the street. You pay for results, not appearances.',
    example: 'A Google Ad costs ₹40 per click. 100 clicks happen. 5 become clients worth ₹50,000 each. Very worth it.',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
  },
  {
    num: '08', name: 'Influencer Marketing', icon: Star,
    what: 'Partnering with online personalities who have large, trusted audiences to promote your brand authentically.',
    analogy: 'Like a trusted friend recommending a restaurant — you\'re far more likely to go than if you saw a generic roadside banner.',
    example: 'An SEO YouTuber with 200K subscribers mentions AMRYTT\'s services — 500 people visit the website that same day.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-100 dark:bg-rose-900',
  },
  {
    num: '09', name: 'Mobile Marketing', icon: Smartphone,
    what: 'Reaching customers on their smartphones through SMS campaigns, mobile apps, or ads designed for small screens.',
    analogy: 'Like putting a leaflet directly in someone\'s hand — except it\'s on their phone, which they check 150+ times a day.',
    example: 'Sending an SMS to 500 past clients about a flash sale on guest posts — 40 orders arrive within 24 hours.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
  },
  {
    num: '10', name: 'Analytics & Reporting', icon: BarChart2,
    what: 'Using data to track what\'s working and what\'s not — so you can make smarter decisions and improve results over time.',
    analogy: 'Like checking the score during a football match. Without it, you\'re playing blind and can\'t change strategy when you\'re losing.',
    example: 'Discovering one blog post brings 60% of all website traffic — so you write 10 more exactly like it.',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50 dark:bg-sky-950',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    iconBg: 'bg-sky-100 dark:bg-sky-900',
  },
]

const timeline = [
  {
    era: '1990s', title: 'The Beginning', emoji: '🌐',
    event: 'Birth of search engines and the first online banner ad. The internet opened a whole new marketing frontier.',
    color: 'from-gray-500 to-slate-600', dot: 'bg-slate-500',
  },
  {
    era: '2000s', title: 'Search Takes Over', emoji: '🔍',
    event: 'Rise of Google AdWords and the explosive importance of SEO. Businesses raced to rank on page 1.',
    color: 'from-blue-500 to-indigo-600', dot: 'bg-blue-500',
  },
  {
    era: 'Mid-2000s', title: 'Social Media Explodes', emoji: '📱',
    event: 'Facebook, Twitter, and LinkedIn changed how brands talk to people — from broadcast to conversation.',
    color: 'from-violet-500 to-purple-600', dot: 'bg-violet-500',
  },
  {
    era: '2010s', title: 'Mobile & Content', emoji: '📲',
    event: 'The shift to mobile marketing and the rise of content marketing. Value-first strategies became the norm.',
    color: 'from-emerald-500 to-teal-600', dot: 'bg-emerald-500',
  },
  {
    era: '2020s', title: 'AI & The Future', emoji: '🤖',
    event: 'Integration of AI, machine learning, and voice search. Personalization and automation at unprecedented scale.',
    color: 'from-indigo-500 to-violet-600', dot: 'bg-indigo-500',
  },
]

// ──────────────────────────────────────────────
// Component card
// ──────────────────────────────────────────────
function ComponentCard({ comp, index }: { comp: typeof components[0]; index: number }) {
  const [open, setOpen] = useState(false)
  const Icon = comp.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl border ${comp.border} shadow-sm overflow-hidden cursor-pointer`}
        onClick={() => setOpen(o => !o)}
      >
        {/* Header */}
        <div className={`${comp.bg} px-5 py-4 flex items-center gap-4`}>
          <div className={`w-10 h-10 ${comp.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${comp.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${comp.text} mb-0.5`}>{comp.num}</p>
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm">{comp.name}</h3>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-6 h-6 flex-shrink-0 ${comp.iconBg} ${comp.text} border ${comp.border} rounded-full flex items-center justify-center font-bold text-base`}
          >
            +
          </motion.div>
        </div>

        {/* Expanded */}
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-hidden"
        >
          <div className="px-5 py-5 border-t border-gray-100 dark:border-gray-800 space-y-4">

            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${comp.text} mb-1.5`}>
                📌 What it means
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{comp.what}</p>
            </div>

            <div className={`${comp.bg} border ${comp.border} rounded-xl px-4 py-3`}>
              <p className={`text-xs font-bold uppercase tracking-widest ${comp.text} mb-1.5`}>
                💡 Think of it like this
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{comp.analogy}"</p>
            </div>

            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${comp.text} mb-1.5`}>
                🏢 Real example
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{comp.example}</p>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────
// Timeline item
// ──────────────────────────────────────────────
function TimelineItem({ item, index, active, onClick }: {
  item: typeof timeline[0]; index: number; active: boolean; onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-14 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 ${item.dot} transition-transform duration-200 ${active ? 'scale-125' : 'group-hover:scale-110'}`} />
      <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${active ? 'border-gray-200 dark:border-gray-700 shadow-md' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
        <div className={`px-5 py-4 flex items-center gap-3 ${active ? `bg-gradient-to-r ${item.color}` : 'bg-white dark:bg-gray-900'}`}>
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>{item.era}</p>
            <h3 className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-900 dark:text-gray-50'}`}>{item.title}</h3>
          </div>
          <span className={`ml-auto text-xs ${active ? 'text-white/60' : 'text-gray-400 dark:text-gray-600'}`}>
            {active ? 'Tap to close ↑' : 'Tap to expand →'}
          </span>
        </div>
        <motion.div
          initial={false}
          animate={{ height: active ? 'auto' : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-5 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.event}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────
export default function Lesson6IntroDigitalMarketing() {
  const [activeEra, setActiveEra] = useState<number | null>(null)

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
          <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest mb-3">Module 2 · Lesson 1</p>
          <h2 className="text-3xl font-bold mb-3">What is Digital Marketing?</h2>
          <p className="text-violet-100 leading-relaxed max-w-lg">
            A dynamic, ever-evolving field that uses the internet and electronic devices to connect businesses with their customers — wherever they are.
          </p>
        </div>
      </motion.div>

      {/* Hub-and-spoke diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">The Big Picture</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
          Digital marketing isn't one thing — it's a <strong>family of connected channels</strong>. Here's how they all relate:
        </p>
        <DigitalMarketingDiagram />
      </motion.div>

      {/* Definition */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">The Definition</p>
        <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium">
          Digital marketing is <span className="text-violet-600 dark:text-violet-400 font-bold">all marketing efforts that use electronic devices or the internet</span>. Businesses leverage digital channels to connect with current and prospective customers.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Search Engines', emoji: '🔍' },
            { label: 'Social Media',   emoji: '📱' },
            { label: 'Email',          emoji: '📧' },
            { label: 'Websites',       emoji: '🌐' },
            { label: 'Mobile Apps',    emoji: '📲' },
          ].map(ch => (
            <div key={ch.label} className="flex flex-col items-center gap-2 bg-violet-50 dark:bg-violet-950 rounded-xl p-3 border border-violet-100 dark:border-violet-800 text-center">
              <span className="text-2xl">{ch.emoji}</span>
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">{ch.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Components */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">10 Key Components</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            ✨ <strong>Tap each card</strong> to see a plain-English explanation, a real-world analogy, and a practical example.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-3">
          {components.map((comp, i) => (
            <ComponentCard key={comp.num} comp={comp} index={i} />
          ))}
        </div>
      </div>

      {/* Evolution */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">The Evolution of Digital Marketing</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            From simple banner ads to AI-powered campaigns. ✨ <strong>Tap each era</strong> to see what changed.
          </p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-[26px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-slate-300 via-violet-300 to-indigo-400 dark:from-slate-700 dark:via-violet-700 dark:to-indigo-700" />
          <div className="space-y-3">
            {timeline.map((item, i) => (
              <TimelineItem
                key={item.era} item={item} index={i}
                active={activeEra === i}
                onClick={() => setActiveEra(activeEra === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950 rounded-2xl border border-violet-100 dark:border-violet-800 p-7"
      >
        <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Key Takeaway</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Digital marketing isn't one thing — it's a <em>collection of channels, tools, and strategies</em> working together. Every role at AMRYTT MEDIA connects to at least one of these 10 components. Understanding all of them gives you the full picture of how we help clients grow online.
        </p>
      </motion.div>

    </div>
  )
}
