'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  Link2, Image as ImageIcon, Trophy, ExternalLink, FileText,
  LinkIcon, Building2, ShoppingCart, AlertTriangle, Bot,
  ChevronDown, ChevronUp, Play, Star,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 bg-red-600 px-4 py-2">
        <Play className="w-3.5 h-3.5 text-white fill-white" />
        <span className="text-white text-xs font-semibold">{title}</span>
      </div>
      <div className="relative w-full bg-gray-100 dark:bg-gray-800" style={{ paddingBottom: '56.25%' }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full animate-pulse" />
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

function Screenshot({ src, alt, caption, label }: {
  src: string; alt: string; caption?: string; label?: string
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      {label && (
        <div className="flex items-center gap-2 bg-gray-800 dark:bg-gray-950 px-4 py-2">
          <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-300 text-xs font-semibold">{label}</span>
        </div>
      )}
      <img src={src} alt={alt} className="w-full block" loading="lazy" />
      {caption && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 italic">
          {caption}
        </div>
      )}
    </div>
  )
}

function DefinitionCard({ children, color = 'violet' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    violet: 'border-l-violet-500 bg-violet-50 dark:bg-violet-950/40',
    blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/40',
    amber: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/40',
    emerald: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    red: 'border-l-red-500 bg-red-50 dark:bg-red-950/40',
    indigo: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
    pink: 'border-l-pink-500 bg-pink-50 dark:bg-pink-950/40',
    teal: 'border-l-teal-500 bg-teal-50 dark:bg-teal-950/40',
  }
  return (
    <div className={`border-l-4 ${colors[color] ?? colors.violet} rounded-r-xl px-5 py-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed`}>
      {children}
    </div>
  )
}

function AmryttBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white">
      <Star className="w-5 h-5 flex-shrink-0 mt-0.5 fill-yellow-300 text-yellow-300" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function ExampleBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
      {children}
    </div>
  )
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{children}</div>
    </div>
  )
}

// Sub-type card (expandable)
function TypeCard({ number, name, description, screenshot, screenshotAlt, screenshotCaption, screenshotLabel }: {
  number: number; name: string; description: string;
  screenshot?: string; screenshotAlt?: string; screenshotCaption?: string; screenshotLabel?: string;
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
      >
        <span className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-50 flex-1">{name}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
              {screenshot && (
                <Screenshot src={screenshot} alt={screenshotAlt ?? name} caption={screenshotCaption} label={screenshotLabel} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Term data
// ─────────────────────────────────────────────────────────────

const TERMS = [
  { id: 'anchor-text',    label: 'Anchor Text',    icon: Link2,         color: 'blue'    },
  { id: 'alt-text',       label: 'Alt Text',       icon: ImageIcon,     color: 'violet'  },
  { id: 'authority-site', label: 'Authority Site', icon: Trophy,        color: 'amber'   },
  { id: 'backlinks',      label: 'Backlinks',      icon: ExternalLink,  color: 'emerald' },
  { id: 'blog',           label: 'Blog',           icon: FileText,      color: 'orange'  },
  { id: 'broken-link',    label: 'Broken Link',    icon: LinkIcon,      color: 'red'     },
  { id: 'b2b',            label: 'B2B',            icon: Building2,     color: 'indigo'  },
  { id: 'b2c',            label: 'B2C',            icon: ShoppingCart,  color: 'pink'    },
  { id: 'black-hat-seo',  label: 'Black Hat SEO',  icon: AlertTriangle, color: 'red'     },
  { id: 'crawler',        label: 'Crawler',        icon: Bot,           color: 'teal'    },
]

const NAV_COLORS: Record<string, string> = {
  blue:    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-blue-400',
  violet:  'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 ring-violet-400',
  amber:   'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 ring-amber-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 ring-emerald-400',
  orange:  'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 ring-orange-400',
  red:     'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 ring-red-400',
  indigo:  'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 ring-indigo-400',
  pink:    'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 ring-pink-400',
  teal:    'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 ring-teal-400',
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function Lesson11KeyTerminologies() {
  const [activeId, setActiveId] = useState('anchor-text')
  const navRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // IntersectionObserver to highlight active term in nav
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    TERMS.forEach(t => {
      const el = sectionRefs.current[t.id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(t.id) },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Scroll active nav pill into view
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const activePill = nav.querySelector(`[data-term="${activeId}"]`) as HTMLElement
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeId])

  function scrollToTerm(id: string) {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <div className="space-y-0">

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden mb-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-violet-300" />
            <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest">Module 2 · Lesson 5</p>
          </div>
          <h2 className="text-2xl font-bold mb-2">Key Terminologies in Content Marketing</h2>
          <p className="text-violet-100 text-sm max-w-xl">
            10 essential terms you'll use every day at AMRYTT MEDIA — with real examples, screenshots, and videos.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {TERMS.map((t, i) => (
              <span key={t.id} className="text-xs bg-white/15 text-white/90 px-2.5 py-1 rounded-full font-medium">
                {i + 1}. {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky term navigator */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 -mx-4 px-4 py-3 mb-8">
        <div ref={navRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {TERMS.map((t, i) => {
            const Icon = t.icon
            const isActive = activeId === t.id
            return (
              <button
                key={t.id}
                data-term={t.id}
                onClick={() => scrollToTerm(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? `${NAV_COLORS[t.color]} ring-2`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="opacity-60">{i + 1}.</span>
                <Icon className="w-3 h-3" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────── */}
      {/* 01. Anchor Text */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('anchor-text')} id="anchor-text" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 01</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Anchor Text</h3>
          </div>
        </div>

        <DefinitionCard color="blue">
          <strong>Anchor text</strong> is the clickable, visible text in a hyperlink. It's the words that are underlined and coloured blue (or another colour) that you click to go somewhere else.
          <br /><br />
          SEO best practice: the anchor text should be <strong>relevant to the page it links to</strong>. Both users and search engines read anchor text to understand what the linked page is about.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a signpost.</strong> If a signpost says "City Centre" and points to the city centre, that's good anchor text. If it just says "Click here," you have no idea what's ahead.
        </ExampleBox>

        <Screenshot
          src="/images/lesson11/anchor-article-example.png"
          alt="Article showing sportsbook software as anchor text"
          label="Live Example — Real article published by AMRYTT"
          caption="The highlighted phrase 'sportsbook software' is a clickable anchor text linking to the client's website."
        />

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
          📌 <strong>Note:</strong> One article can have <strong>more than one anchor text.</strong> Most guest posts have 1–3 anchor texts linking to different pages.
        </div>

        <div>
          <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-3">Types of Anchor Texts — click each to expand:</p>
          <div className="space-y-2">
            <TypeCard
              number={1}
              name="Branded"
              description="The anchor text uses the brand's actual name — e.g. Apple, Nike, GUESTPOSTLINKS, 96ACE. These indicate the reader already knows this brand and is specifically looking for it. Branded keywords build brand recognition and trust."
              screenshot="/images/lesson11/anchor-branded.png"
              screenshotAlt="96ACE branded anchor text"
              screenshotLabel="Real Example — Branded Anchor Text"
              screenshotCaption="The brand name '96ACE' is boxed in red — this is the branded anchor text used in an article published on behalf of a client."
            />
            <TypeCard
              number={2}
              name="Generic"
              description="Vague, non-descriptive text like 'click here', 'visit here', or 'read more'. Google gets no useful context from this. It's still used sometimes for natural variation, but should not be overused."
              screenshot="/images/lesson11/anchor-generic.png"
              screenshotAlt="Click here generic anchor text"
              screenshotLabel="Real Example — Generic Anchor Text"
              screenshotCaption="The phrase 'Click here' is a generic anchor text — it tells neither the reader nor Google what the linked page is about."
            />
            <TypeCard
              number={3}
              name="Naked URL"
              description="The raw URL itself is used as the anchor text — e.g. https://www.thunderlaser.com/laser-machines/laser-cutter/. The link address is visible instead of descriptive words. Useful for transparency but not ideal for SEO."
              screenshot="/images/lesson11/anchor-naked-url.png"
              screenshotAlt="Naked URL anchor text"
              screenshotLabel="Real Example — Naked URL Anchor Text"
              screenshotCaption="The full URL is displayed as the clickable anchor text, annotated with 'Naked URL as an anchor text'."
            />
          </div>
        </div>

        <AmryttBox>
          At AMRYTT MEDIA, our guest posts always use the <strong>client's required anchor text</strong> (usually branded or keyword-rich). You'll receive the exact anchor text and target URL for every article you write.
        </AmryttBox>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 02. Alt Text */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('alt-text')} id="alt-text" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 02</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Alt Text</h3>
          </div>
        </div>

        <DefinitionCard color="violet">
          <strong>Alt text (alternative text)</strong> is a short written description added to an image inside a webpage's HTML code. It describes what the image shows.
          <br /><br />
          It serves two purposes:
          <br />• <strong>Accessibility:</strong> Screen readers read alt text aloud for visually impaired users.
          <br />• <strong>SEO:</strong> Search engines can't "see" images — they read the alt text to understand what the image is about.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a caption for the blind.</strong> If a photo shows a red sports car, the alt text would be <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">alt="Red Ferrari 488 on a race track"</code>. Google reads this and knows it's a car image, not a food photo.
        </ExampleBox>

        <div className="grid sm:grid-cols-2 gap-4">
          <Screenshot
            src="/images/lesson11/alt-text-admin.png"
            alt="WordPress media library showing alt text field"
            label="View from Admin Panel (Backend)"
            caption="Inside WordPress — when you click an image, you can see and edit its Alt Text in the right-hand panel."
          />
          <Screenshot
            src="/images/lesson11/alt-text-source.png"
            alt="HTML source code showing alt text attribute"
            label="View in Page Source (CTRL+U)"
            caption="In the HTML source code, alt text appears as: alt='Understanding the Technical Challenges of Online Games'"
          />
        </div>

        <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-xl px-5 py-4 space-y-2">
          <p className="font-bold text-violet-800 dark:text-violet-300 text-sm">🔍 How to check Alt Text on any webpage:</p>
          <ol className="text-sm text-violet-700 dark:text-violet-300 space-y-1 list-decimal list-inside">
            <li>Open the page in your browser</li>
            <li>Press <kbd className="bg-violet-200 dark:bg-violet-800 px-1.5 py-0.5 rounded text-xs font-mono">CTRL + U</kbd> to open page source</li>
            <li>Press <kbd className="bg-violet-200 dark:bg-violet-800 px-1.5 py-0.5 rounded text-xs font-mono">CTRL + F</kbd> and search for <code className="text-xs">alt=</code></li>
            <li>You'll see every image's alt text in the HTML</li>
          </ol>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 03. Authority Site */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('authority-site')} id="authority-site" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 03</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Authority Site</h3>
          </div>
        </div>

        <DefinitionCard color="amber">
          An <strong>authority site</strong> is a website that Google and other search engines consider <strong>highly trusted and credible</strong> in its topic area. These sites have high-quality content, get lots of organic traffic, and earn links from other reputable websites.
          <br /><br />
          When you get a backlink from an authority site, it's a very strong signal to Google that your content is trustworthy.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a university degree.</strong> A recommendation letter from Harvard carries more weight than one from an unknown school — even if both say the same thing. A backlink from Wikipedia &gt; a backlink from a random blog.
        </ExampleBox>

        <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">Real examples of high-authority sites:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'The New York Times', badge: 'News', score: '~95', domain: 'nytimes.com' },
            { name: 'Wikipedia',           badge: 'Encyclopedia', score: '~94', domain: 'wikipedia.org' },
            { name: 'The Guardian',        badge: 'News', score: '~93', domain: 'theguardian.com' },
            { name: 'Reddit',              badge: 'Community', score: '~91', domain: 'reddit.com' },
            { name: 'Facebook.com',        badge: 'Social', score: '100', domain: 'facebook.com' },
          ].map(s => (
            <div key={s.name} className="bg-white dark:bg-gray-900 border border-amber-100 dark:border-amber-900 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{s.name}</p>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{s.badge}</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{s.domain}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${s.score}%` }} />
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">DR {s.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-3">
          <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">📂 Real example from AMRYTT's work:</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            AMRYTT published a guest post about <em>uPVC sash windows</em> on behalf of a client. Inside that article, we linked to two authority sites to add credibility:
          </p>
          <div className="space-y-2">
            <div className="flex gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5">
              <span className="text-lg flex-shrink-0">1</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Anchor: <span className="text-violet-600 dark:text-violet-400">"inert gas like argon"</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Linked to Quora's explanation of inert gases — supports the blog's discussion of argon-filled window glazing.</p>
              </div>
            </div>
            <div className="flex gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5">
              <span className="text-lg flex-shrink-0">2</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Anchor: <span className="text-violet-600 dark:text-violet-400">"the warranty"</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Linked to Investopedia's definition of warranty — a highly trusted financial/legal authority site.</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">Linking to authority sites inside your article improves its credibility in Google's eyes.</p>
        </div>

        <AmryttBox>
          When writing guest posts, you should always link to <strong>authority sites</strong> as supporting references — this signals to Google that your article is well-researched and trustworthy. Your content manager will often specify which authority links to include.
        </AmryttBox>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 04. Backlinks */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('backlinks')} id="backlinks" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 04</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Backlinks</h3>
          </div>
        </div>

        <DefinitionCard color="emerald">
          A <strong>backlink</strong> (also called an <em>inbound link</em>) is a link <strong>from one website to a page on another website.</strong>
          <br /><br />
          Backlinks are one of the most important ranking factors in SEO. Google treats each backlink as a "vote of confidence" — the more quality backlinks your page has, the higher it can rank in search results.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a reference letter.</strong> If 50 respected people recommend you, you look more credible than someone with no recommendations. Each backlink from a quality site is one "recommendation" to Google.
        </ExampleBox>

        {/* Visual flow */}
        <div className="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
          <p className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-4">📖 Real Example — How it works:</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-center">
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex-1">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Website A</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">thewayofthegame.net</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Publishes: "Bookies Are Upping Their Game With Software"</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="text-emerald-500 font-bold text-xl">→</div>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-full">contains link to</span>
            </div>
            <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-xl p-4 flex-1">
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase mb-1">Website B</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">standardperhead.com</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detailed guide on "Sportsbook Software"</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">← Receives the backlink</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic text-center">
            Website B benefits — Google sees that Website A (a trusted source) is recommending Website B, which boosts B's ranking.
          </p>
        </div>

        <Screenshot
          src="/images/lesson11/backlinks-example.png"
          alt="Article showing sportsbook software backlink"
          label="Live Backlink in Published Article"
          caption="The phrase 'sportsbook software' (highlighted in red) is a clickable backlink pointing to the client's website (standardperhead.com). This is a real guest post published by AMRYTT MEDIA."
        />

        <AmryttBox>
          <strong>Guest posting IS backlink building.</strong> Every article AMRYTT publishes on behalf of a client contains a backlink pointing to the client's website. This is how we help clients rank higher on Google — by placing their links on trusted, high-traffic websites.
        </AmryttBox>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 05. Blog */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('blog')} id="blog" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 05</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Blog</h3>
          </div>
        </div>

        <DefinitionCard color="orange">
          A <strong>blog</strong> is a frequently updated website or online journal where individuals or groups <strong>share their thoughts, ideas, expertise, or information</strong> in a casual, conversational tone.
          <br /><br />
          Blogs are one of the most powerful content marketing tools — they attract organic traffic, establish expertise, and give other websites something worth linking to.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a column in a newspaper</strong> — except anyone can write one, it's free to publish, and millions of people can read it instantly online.
          <br /><br />
          <strong>Example:</strong> Imagine a food blogger who posts new content every week — a seasonal recipe, a restaurant review, a cooking tip. Over time, thousands of people follow their blog for reliable food advice.
        </ExampleBox>

        <YouTubeEmbed videoId="3H_-Mjq9OsA" title="What is a Blog? — Video Explanation" />
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 06. Broken Link */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('broken-link')} id="broken-link" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <LinkIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 06</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Broken Link</h3>
          </div>
        </div>

        <DefinitionCard color="red">
          A <strong>broken link</strong> is a hyperlink that <strong>no longer works</strong> — it points to a page that has been deleted, moved, or renamed. When clicked, it shows an error (usually "404 – Page Not Found").
          <br /><br />
          Broken links are bad for two reasons:
          <br />• <strong>User experience:</strong> Visitors land on an error page and feel frustrated.
          <br />• <strong>SEO:</strong> Search engine crawlers can't follow broken links, which hinders proper indexing.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a wrong address.</strong> If a friend gives you an address for a restaurant that closed last year, you'll arrive to find an empty building. That's a broken link — the signpost exists, but the destination is gone.
        </ExampleBox>

        <Screenshot
          src="/images/lesson11/broken-link-example.png"
          alt="No Results Found page from a broken link"
          label="What a Broken Link Looks Like"
          caption="When you click a broken link, you land on an error page like this — 'No Results Found'. The linked content no longer exists at that URL."
        />

        <WarningBox>
          <strong>In guest posting:</strong> If a publisher updates or removes their website, the backlinks we placed in old articles can become broken. This is why ongoing monitoring of placed links is important.
        </WarningBox>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 07. B2B */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('b2b')} id="b2b" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 07</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">B2B — Business-to-Business</h3>
          </div>
        </div>

        <DefinitionCard color="indigo">
          <strong>B2B (Business-to-Business)</strong> refers to transactions or communications that happen <strong>between two businesses</strong>, rather than between a business and an individual consumer.
          <br /><br />
          In SEO/Content Marketing terms: B2B strategies target <strong>niche, technical keywords</strong> with <strong>longer sales cycles</strong> — because business decisions take longer and involve multiple people.
        </DefinitionCard>

        <div className="sm:flex gap-5 items-start space-y-4 sm:space-y-0">
          <img
            src="/images/lesson11/b2b-illustration.png"
            alt="B2B Business-to-Business illustration"
            className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-64 flex-shrink-0"
            loading="lazy"
          />
          <div className="space-y-3 flex-1">
            <ExampleBox>
              💡 <strong>Examples of B2B businesses:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• A software company selling tools to other companies (e.g. Slack, Salesforce)</li>
                <li>• A logistics company providing delivery services to retailers</li>
                <li>• A raw material supplier selling to manufacturers</li>
              </ul>
            </ExampleBox>
            <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300">
              <strong>SEO implication:</strong> B2B keywords are more specific and technical. The audience is smaller but more valuable — one B2B conversion can be worth thousands of dollars.
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 08. B2C */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('b2c')} id="b2c" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 08</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">B2C — Business-to-Consumer</h3>
          </div>
        </div>

        <DefinitionCard color="pink">
          <strong>B2C (Business-to-Consumer)</strong> refers to transactions between a <strong>business and individual consumers</strong> — everyday people like you and me.
          <br /><br />
          B2C SEO strategies aim for <strong>broader audiences</strong> with <strong>high-volume, general keywords</strong>. Decisions are faster and more emotional than B2B.
        </DefinitionCard>

        <div className="grid sm:grid-cols-2 gap-4">
          <ExampleBox>
            <strong>B2C Examples:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Amazon selling products to shoppers</li>
              <li>• Netflix streaming to individual subscribers</li>
              <li>• A clothing brand selling directly to customers</li>
              <li>• A food delivery app taking orders from people</li>
            </ul>
          </ExampleBox>
          <div className="bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 rounded-xl px-5 py-4">
            <p className="font-bold text-pink-800 dark:text-pink-300 text-sm mb-3">B2B vs B2C at a glance</p>
            <div className="space-y-2 text-xs">
              {[
                ['Audience',      'Other businesses',    'Individual consumers'],
                ['Keywords',      'Niche & technical',   'Broad & general'],
                ['Decision time', 'Weeks / months',      'Minutes / hours'],
                ['Content tone',  'Professional',        'Casual / emotional'],
              ].map(([label, b2b, b2c]) => (
                <div key={label} className="grid grid-cols-3 gap-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{b2b}</span>
                  <span className="text-pink-600 dark:text-pink-400">{b2c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 09. Black Hat SEO */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('black-hat-seo')} id="black-hat-seo" className="scroll-mt-20 space-y-5 mb-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 09</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Black Hat SEO</h3>
          </div>
        </div>

        <DefinitionCard color="red">
          <strong>Black Hat SEO</strong> refers to <strong>aggressive, deceptive SEO tactics</strong> that try to manipulate search engine rankings by violating Google's guidelines.
          <br /><br />
          These tactics focus on tricking search engines rather than genuinely helping users. If caught, Google can penalise or completely remove the website from search results.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like cheating in an exam.</strong> You might get a short-term advantage, but if caught, you face serious consequences — failing the exam, getting expelled. Black Hat SEO gives short-term rankings but risks permanent penalties.
        </ExampleBox>

        <div className="space-y-3">
          <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">⚠️ Common Black Hat Techniques:</p>
          {[
            {
              name: 'Keyword Stuffing',
              desc: 'Cramming a keyword unnaturally into content over and over again to manipulate rankings. e.g. "Buy cheap shoes. Our cheap shoes are the best cheap shoes. Find cheap shoes here." Unreadable — Google detects and penalises it.',
              icon: '🔁',
            },
            {
              name: 'Cloaking',
              desc: 'Showing different content to search engine bots vs. real users. The bot sees keyword-rich text, the user sees something else entirely. This is deliberate deception and violates Google\'s guidelines.',
              icon: '🎭',
            },
            {
              name: 'Private Blog Networks (PBN)',
              desc: 'A network of fake/expired websites created solely to link to one target site, artificially inflating its backlink count. Google actively hunts and penalises PBNs — websites using them can vanish from search results overnight.',
              icon: '🕸️',
            },
          ].map(t => (
            <div key={t.name} className="flex gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <span className="text-xl flex-shrink-0 mt-0.5">{t.icon}</span>
              <div>
                <p className="font-bold text-red-800 dark:text-red-300 text-sm mb-1">{t.name}</p>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <WarningBox>
          <strong>AMRYTT MEDIA only uses White Hat SEO.</strong> Our guest posting approach follows all Google guidelines — genuine content, real websites, natural anchor text. We never use Black Hat techniques.
        </WarningBox>

        <div className="space-y-4">
          <YouTubeEmbed videoId="aCQGuEfURL8" title="Black Hat SEO Explained" />
          <YouTubeEmbed videoId="U10sqkS9xXQ" title="Black Hat vs White Hat SEO" />
        </div>
      </section>

      {/* ────────────────────────────────────────────────── */}
      {/* 10. Crawler */}
      {/* ────────────────────────────────────────────────── */}
      <section ref={setRef('crawler')} id="crawler" className="scroll-mt-20 space-y-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Term 10</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Crawler</h3>
          </div>
        </div>

        <DefinitionCard color="teal">
          A <strong>crawler</strong> (also called a <em>spider</em>, <em>bot</em>, or <em>web crawler</em>) is an automated software program that <strong>systematically browses the internet</strong>, visiting websites and reading their content to add it to a search engine's index.
          <br /><br />
          Google's crawler is called <strong>Googlebot</strong>. It constantly visits websites, follows links, reads content, and reports back to Google so pages can be ranked.
        </DefinitionCard>

        <ExampleBox>
          💡 <strong>Think of it like a librarian robot.</strong> Imagine a robot that visits every library (website) in the world, reads every book (page), takes notes, and files them in a giant catalogue (Google's index). When you search on Google, it looks up that catalogue — not the live internet — to show you results.
        </ExampleBox>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { step: '1', title: 'Discover', desc: 'Googlebot finds new URLs via sitemaps and links from known pages', icon: '🔍' },
            { step: '2', title: 'Crawl',    desc: 'It visits the page and reads all text, images, links, and code',    icon: '🤖' },
            { step: '3', title: 'Index',    desc: 'The page is added to Google\'s database and becomes searchable',     icon: '📚' },
          ].map(s => (
            <div key={s.step} className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-bold text-teal-800 dark:text-teal-300 text-sm mb-1">Step {s.step}: {s.title}</p>
              <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-xl px-4 py-3 text-sm text-teal-700 dark:text-teal-300">
          <strong>Why it matters for you:</strong> Broken links, missing alt text, and slow loading speeds can all prevent Googlebot from crawling and indexing your pages properly — hurting rankings.
        </div>

        <YouTubeEmbed videoId="9n4l491nuOI" title="How Web Crawlers Work — Explained Simply" />
      </section>

      {/* Key Takeaway */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-7 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-3">Key Takeaway</p>
          <h4 className="text-lg font-bold mb-3">These 10 terms are your daily vocabulary</h4>
          <p className="text-violet-100 text-sm leading-relaxed mb-4">
            As a content writer or blogger outreach specialist at AMRYTT MEDIA, you'll use these terms in every briefing, every article, and every client report. Understanding them deeply — not just memorising definitions — is what separates a good team member from a great one.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TERMS.map(t => (
              <button
                key={t.id}
                onClick={() => scrollToTerm(t.id)}
                className="text-xs bg-white/15 hover:bg-white/25 text-white px-2 py-1.5 rounded-lg text-center transition"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
