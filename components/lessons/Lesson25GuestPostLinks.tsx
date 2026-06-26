'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Globe, BookOpen, TrendingUp, Award, Users,
  Shield, Tag, Timer, Cpu, CheckCircle, Handshake,
  ExternalLink, Info, Star, Building2, Link,
} from 'lucide-react'

// ─────────────────────────────────────
// Section definitions
// ─────────────────────────────────────
interface Section {
  id: string
  label: string
  shortLabel: string
  color: string
  Icon: React.FC<{ className?: string }>
}

const SECTIONS: Section[] = [
  { id: 'what-is-gpl',         label: 'What is GUESTPOSTLINKS.NET?',             shortLabel: 'What is GPL?',     color: 'blue',    Icon: Globe      },
  { id: 'philosophy',          label: 'GUESTPOSTLINKS Philosophy',                shortLabel: 'Philosophy',       color: 'violet',  Icon: BookOpen   },
  { id: 'empowering-growth',   label: 'Empowering Growth Through Partnerships',   shortLabel: 'Empowering Growth',color: 'emerald', Icon: TrendingUp },
  { id: 'what-sets-us-apart',  label: 'What Sets Us Apart',                       shortLabel: 'Sets Us Apart',    color: 'amber',   Icon: Award      },
  { id: 'our-team',            label: 'Our Team',                                 shortLabel: 'Our Team',         color: 'teal',    Icon: Users      },
]

// ─────────────────────────────────────
// Color maps
// ─────────────────────────────────────
const BG: Record<string, string> = {
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  amber:   'bg-amber-100 dark:bg-amber-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
  green:   'bg-green-100 dark:bg-green-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  rose:    'bg-rose-100 dark:bg-rose-900/40',
}

const TEXT: Record<string, string> = {
  blue:    'text-blue-700 dark:text-blue-300',
  violet:  'text-violet-700 dark:text-violet-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  amber:   'text-amber-700 dark:text-amber-300',
  teal:    'text-teal-700 dark:text-teal-300',
  green:   'text-green-700 dark:text-green-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  rose:    'text-rose-700 dark:text-rose-300',
}

const BORDER: Record<string, string> = {
  blue:    'border-blue-200 dark:border-blue-700',
  violet:  'border-violet-200 dark:border-violet-700',
  emerald: 'border-emerald-200 dark:border-emerald-700',
  amber:   'border-amber-200 dark:border-amber-700',
  teal:    'border-teal-200 dark:border-teal-700',
  green:   'border-green-200 dark:border-green-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  rose:    'border-rose-200 dark:border-rose-700',
}

const GRADIENT: Record<string, string> = {
  blue:    'from-blue-500 to-indigo-500',
  violet:  'from-violet-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-500',
  amber:   'from-amber-500 to-orange-500',
  teal:    'from-teal-500 to-cyan-600',
  green:   'from-green-500 to-emerald-500',
  indigo:  'from-indigo-500 to-blue-600',
  rose:    'from-rose-500 to-pink-600',
}

// ─────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────
function SectionHeader({ section }: { section: Section }) {
  const { label, color, Icon } = section
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENT[color]} flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{label}</h2>
    </div>
  )
}

function InfoBox({ label, children, color }: { label: string; children: React.ReactNode; color: string }) {
  return (
    <div className={`${BG[color]} ${BORDER[color]} border rounded-xl p-4 mb-4`}>
      <p className={`${TEXT[color]} text-xs font-bold uppercase tracking-widest mb-1.5`}>{label}</p>
      <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function QuoteBlock({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="relative border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950 rounded-r-xl pl-5 pr-4 py-4 mb-5">
      <div className="text-4xl text-emerald-300 dark:text-emerald-700 font-serif leading-none mb-1 select-none">&#8220;</div>
      <p className="text-gray-800 dark:text-gray-100 text-sm sm:text-base leading-relaxed italic">{children}</p>
      {author && <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold mt-2">— {author}</p>}
    </div>
  )
}

function ResourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition group mb-2">
      <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 font-medium">{label}</span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 flex-shrink-0" />
    </a>
  )
}

// ─────────────────────────────────────
// Section 1 — What is GUESTPOSTLINKS.NET?
// ─────────────────────────────────────
function WhatIsGPL() {
  const section = SECTIONS[0]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>Overview</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          <strong>GUESTPOSTLINKS.NET</strong> was launched by{' '}
          <strong>AMRYTT MEDIA LLC</strong> as its first core product. It is a platform
          that connects <strong>guest post buyers and marketers</strong> who want to
          promote their products and services and build authority for their websites.
          GUESTPOSTLINKS acts as a{' '}
          <strong>mediator</strong>, facilitating the entire process of guest posting
          for SEO and content marketing purposes.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '🔗', label: 'In-Content Backlinks', desc: 'High-Quality Contextual links placed naturally within relevant article content.' },
          { icon: '🏛️', label: 'High Authority Sites',  desc: 'Links from carefully selected, high-authority niche websites only.' },
          { icon: '🤝', label: 'Mediator Platform',     desc: 'Bridges guest post buyers with the right publishers efficiently.' },
        ].map(f => (
          <div key={f.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{f.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">What GUESTPOSTLINKS provides:</p>
        </div>
        <ul className="space-y-2.5">
          {[
            'Straightforward, fast, and competitively priced guest posting solutions',
            'In-content High-Quality Contextual Whitehat backlinks',
            'Links sourced exclusively from High-Authority, relevant niche websites',
            'Increased search engine rankings through quality link building',
            'More organic traffic, sales, and leads for your targeted keywords',
          ].map(pt => (
            <li key={pt} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              {pt}
            </li>
          ))}
        </ul>
      </div>

      <ResourceLink href="https://www.guestpostlinks.net" label="Visit GUESTPOSTLINKS.NET →" />
    </section>
  )
}

// ─────────────────────────────────────
// Section 2 — GUESTPOSTLINKS Philosophy (overview)
// ─────────────────────────────────────
function Philosophy() {
  const section = SECTIONS[1]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>Mission Statement</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          At GUESTPOSTLINKS, we are dedicated to providing{' '}
          <strong>top-quality guest posting services</strong> to help businesses across
          all industries improve their online presence and achieve higher search rankings.
        </p>
      </div>

      {/* 40,000+ stat */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-6">
          <div className="text-center flex-shrink-0">
            <p className="text-4xl sm:text-5xl font-black">40,000+</p>
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mt-1">Publishers</p>
          </div>
          <div>
            <p className="font-bold text-lg mb-1">Massive Publisher Network</p>
            <p className="text-violet-100 text-sm leading-relaxed">
              With over 40,000 publishers listed on our platform, we serve both
              SEO agencies and direct clients with a diverse range of high-quality
              backlink solutions across every niche.
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: '🏢', label: 'SEO Agencies',    desc: 'Bulk ordering, white-label solutions, and dedicated account support for agencies managing multiple clients.' },
          { icon: '👤', label: 'Direct Clients',  desc: 'Accessible, transparent, and affordable guest posting for businesses of any size.' },
          { icon: '⚡', label: 'Fast Delivery',   desc: 'Our clients rely on us for fast turnarounds, competitive pricing, and the best possible content.' },
        ].map(c => (
          <div key={c.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{c.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 3 — Empowering Growth Through Partnerships
// ─────────────────────────────────────
function EmpoweringGrowth() {
  const section = SECTIONS[2]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <QuoteBlock>
        Our company philosophy is built on the idea of empowering growth through
        strong, mutually beneficial partnerships. We believe that by working closely
        with our clients and delivering exceptional service, we can help businesses
        of all sizes thrive in the digital space.
      </QuoteBlock>

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>Our Core Focus</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          Our focus is on delivering <strong>real value</strong> — we do this by
          providing high-quality, SEO-optimized content and backlinks at competitive
          prices. Every decision we make is guided by the impact it will have on
          our clients&#39; long-term growth.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '🤝', label: 'Trust',         desc: 'Every relationship is built on honesty and full transparency — clients always know what they are getting.' },
          { icon: '🔍', label: 'Transparency',  desc: 'Clear reporting, straightforward pricing, and open communication at every step of the process.' },
          { icon: '🎯', label: 'Shared Success',desc: 'We don\'t measure our success separately — our clients\' growth is our growth.' },
        ].map(p => (
          <div key={p.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{p.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{p.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-600 rounded-2xl p-6 text-white">
        <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Our Promise</p>
        <p className="text-base leading-relaxed">
          At GUESTPOSTLINKS, we don&#39;t just see ourselves as a service provider —
          we see ourselves as an <strong>extension of our clients&#39; teams</strong>,
          working together toward the same goal:{' '}
          <strong className="text-emerald-200">sustainable growth and success</strong>.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 4 — What Sets Us Apart
// ─────────────────────────────────────
function WhatSetsUsApart() {
  const section = SECTIONS[3]
  const pillars = [
    {
      Icon: Shield,
      label: 'Commitment to Quality',
      color: 'emerald',
      desc: 'Every website and publisher on our platform is carefully vetted by our team to ensure the highest standards. We do not compromise on the quality of the sites we work with — your backlinks come from genuinely authoritative, relevant sources.',
      highlight: 'Carefully vetted publishers',
    },
    {
      Icon: Tag,
      label: 'Competitive Pricing',
      color: 'blue',
      desc: 'We offer some of the most competitive pricing in the market without compromising on quality. Our strong direct relationships with publishers and our efficient internal processes allow us to pass real savings on to our clients.',
      highlight: 'Value without compromise',
    },
    {
      Icon: Timer,
      label: 'Fast Turnaround',
      color: 'violet',
      desc: 'We understand the importance of timely service in the SEO and content marketing world. We pride ourselves on delivering results quickly and efficiently — so your campaigns stay on track and your clients stay happy.',
      highlight: 'Results delivered on time',
    },
    {
      Icon: Cpu,
      label: 'Cutting-Edge Technology',
      color: 'rose',
      desc: 'We leverage AI to enhance efficiency and speed across our platform. However, every piece of content we produce is reviewed and optimized by our expert human team to ensure it is truly SEO-friendly and meets the highest standards.',
      highlight: 'AI-enhanced, human-reviewed',
    },
  ]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <InfoBox label="Why Choose Us" color={section.color}>
        GUESTPOSTLINKS stands out in a crowded market by combining four key strengths —
        each one carefully developed to give our clients a genuine competitive advantage.
      </InfoBox>

      <div className="grid sm:grid-cols-2 gap-4">
        {pillars.map(p => {
          const PillarIcon = p.Icon
          return (
            <div key={p.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${GRADIENT[p.color]} flex items-center justify-center flex-shrink-0`}>
                  <PillarIcon className="w-4.5 h-4.5 text-white w-5 h-5" />
                </div>
                <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">{p.label}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{p.desc}</p>
              <div className={`${BG[p.color]} rounded-lg px-3 py-1.5 inline-block`}>
                <p className={`${TEXT[p.color]} text-xs font-bold`}>✓ {p.highlight}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 5 — Our Team
// ─────────────────────────────────────
function OurTeam() {
  const section = SECTIONS[4]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>Your Role</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          As part of our team, you will play a <strong>vital role</strong> in
          maintaining the high standards we are known for and helping our clients
          achieve their goals. We encourage collaboration, innovation, and a focus
          on continuous improvement — both for ourselves and for our clients.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: '🤝', label: 'Collaboration',         desc: 'We work as one united team — cross-functional support and open communication are at the heart of how we operate.' },
          { icon: '💡', label: 'Innovation',            desc: 'We actively look for better, smarter ways to serve our clients and improve our platform and processes.' },
          { icon: '📈', label: 'Continuous Improvement',desc: 'Growth is a mindset — we invest in our team\'s skills and knowledge so we can always deliver more for our clients.' },
        ].map(v => (
          <div key={v.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{v.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{v.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 text-white">
        <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-3">Our Culture</p>
        <p className="text-base leading-relaxed mb-4">
          At GUESTPOSTLINKS, every team member is a key contributor to our clients&#39;
          success. You are not just doing a job — you are helping real businesses
          grow, rank higher, and reach more customers every single day.
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { val: '40,000+', lbl: 'Publishers'  },
            { val: '100%',    lbl: 'White-Hat'   },
            { val: '24/7',    lbl: 'Support'     },
          ].map(s => (
            <div key={s.lbl} className="bg-white/10 rounded-xl py-3">
              <p className="text-xl font-black">{s.val}</p>
              <p className="text-teal-100 text-xs mt-0.5">{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Main export
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  WhatIsGPL, Philosophy, EmpoweringGrowth, WhatSetsUsApart, OurTeam,
]

export default function Lesson25GuestPostLinks() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(s.id) },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Module 3 · Lesson 25</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">GUESTPOSTLINKS.NET &amp; Its Philosophy</h1>
          <p className="text-emerald-100 text-sm leading-relaxed max-w-xl">
            Discover AMRYTT MEDIA&#39;s core product — GUESTPOSTLINKS.NET. Learn what the platform
            does, the philosophy behind it, what sets it apart from competitors, and the team
            culture that makes it all work.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-emerald-100 flex-wrap">
            <span>🔗 40,000+ Publishers</span>
            <span>🛡️ 100% White-Hat</span>
            <span>📈 SEO &amp; Content Marketing</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* Sticky sidebar — desktop */}
        <nav className="hidden lg:flex flex-col gap-0.5 w-44 flex-shrink-0 sticky top-20">
          <div className="flex items-center gap-2 mb-3 px-1">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sections</p>
          </div>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                activeId === s.id
                  ? `${BG[s.color]} ${TEXT[s.color]} font-semibold`
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {s.shortLabel}
            </button>
          ))}
        </nav>

        {/* Content + mobile pills */}
        <div className="flex-1 min-w-0">

          {/* Mobile pill nav */}
          <div className="lg:hidden mb-4 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap border transition-all ${
                    activeId === s.id
                      ? `${BG[s.color]} ${TEXT[s.color]} ${BORDER[s.color]}`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent'
                  }`}
                >
                  {s.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-16">
            {SECTION_COMPONENTS.map((SectionComp, i) => (
              <motion.div
                key={SECTIONS[i].id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 }}
                viewport={{ once: true }}
              >
                <SectionComp />
                {i < SECTION_COMPONENTS.length - 1 && (
                  <div className="mt-16 border-b border-gray-100 dark:border-gray-800" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer summary */}
          <div className="mt-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-8">
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-2">Module 3 Overview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">What you&#39;ve covered in this lesson:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { Icon: Globe,      color: 'blue',    label: 'What is GUESTPOSTLINKS.NET?',           desc: 'Platform overview, role as mediator, what it provides' },
                { Icon: BookOpen,   color: 'violet',  label: 'GUESTPOSTLINKS Philosophy',             desc: '40,000+ publishers, serving agencies and direct clients' },
                { Icon: TrendingUp, color: 'emerald', label: 'Empowering Growth Through Partnerships', desc: 'Trust, transparency, shared commitment to success' },
                { Icon: Award,      color: 'amber',   label: 'What Sets Us Apart',                    desc: 'Quality, pricing, speed, and cutting-edge technology' },
                { Icon: Users,      color: 'teal',    label: 'Our Team',                              desc: 'Collaboration, innovation, and continuous improvement' },
              ].map(({ Icon: Ic, color, label, desc }) => (
                <button key={label} onClick={() => scrollTo(SECTIONS.find(s => s.label === label)?.id ?? '')}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-900 transition text-left group">
                  <div className={`w-8 h-8 ${BG[color]} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Ic className={`w-4 h-4 ${TEXT[color]}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
