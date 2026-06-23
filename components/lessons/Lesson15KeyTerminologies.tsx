'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ExternalLink, Link, Type, Cpu, BarChart2, AlertTriangle,
  Search, Download, Globe, ArrowRight, Database, FileSearch,
  PieChart, BookOpen, Check,
} from 'lucide-react'

// ─────────────────────────────────────
// Types & Term definitions
// ─────────────────────────────────────
interface Term {
  id: string
  label: string
  shortLabel: string
  color: string
  Icon: React.FC<{ className?: string }>
}

const TERMS: Term[] = [
  { id: 'external-link',         label: 'External Link',           shortLabel: 'External Link',    color: 'orange',  Icon: ExternalLink  },
  { id: 'exact-match-anchor',    label: 'Exact Match Anchor Text', shortLabel: 'Exact Match',      color: 'purple',  Icon: Type          },
  { id: 'footer-link',           label: 'Footer Link',             shortLabel: 'Footer Link',      color: 'slate',   Icon: Link          },
  { id: 'google-algorithm',      label: 'Google Algorithm',        shortLabel: 'G. Algorithm',     color: 'blue',    Icon: Cpu           },
  { id: 'google-analytics',      label: 'Google Analytics',        shortLabel: 'G. Analytics',     color: 'sky',     Icon: BarChart2     },
  { id: 'google-penalty',        label: 'Google Penalty',          shortLabel: 'G. Penalty',       color: 'red',     Icon: AlertTriangle },
  { id: 'google-search-console', label: 'Google Search Console',   shortLabel: 'Search Console',   color: 'teal',    Icon: Search        },
  { id: 'inbound-link',          label: 'Inbound Link',            shortLabel: 'Inbound Link',     color: 'green',   Icon: Download      },
  { id: 'indexability',          label: 'Indexability',            shortLabel: 'Indexability',     color: 'violet',  Icon: Globe         },
  { id: 'internal-link',         label: 'Internal Link',           shortLabel: 'Internal Link',    color: 'cyan',    Icon: ArrowRight    },
  { id: 'index',                 label: 'Index',                   shortLabel: 'Index',            color: 'indigo',  Icon: Database      },
  { id: 'indexed-page',          label: 'Indexed Page',            shortLabel: 'Indexed Page',     color: 'emerald', Icon: FileSearch    },
  { id: 'infographic',           label: 'Infographic',             shortLabel: 'Infographic',      color: 'amber',   Icon: PieChart      },
]

// ─────────────────────────────────────
// Color maps (all 13 colors)
// ─────────────────────────────────────
const BG: Record<string, string> = {
  orange:  'bg-orange-100 dark:bg-orange-900/40',
  purple:  'bg-purple-100 dark:bg-purple-900/40',
  slate:   'bg-slate-100 dark:bg-slate-800/60',
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  sky:     'bg-sky-100 dark:bg-sky-900/40',
  red:     'bg-red-100 dark:bg-red-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
  green:   'bg-green-100 dark:bg-green-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  cyan:    'bg-cyan-100 dark:bg-cyan-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  amber:   'bg-amber-100 dark:bg-amber-900/40',
}

const TEXT: Record<string, string> = {
  orange:  'text-orange-700 dark:text-orange-300',
  purple:  'text-purple-700 dark:text-purple-300',
  slate:   'text-slate-700 dark:text-slate-300',
  blue:    'text-blue-700 dark:text-blue-300',
  sky:     'text-sky-700 dark:text-sky-300',
  red:     'text-red-700 dark:text-red-300',
  teal:    'text-teal-700 dark:text-teal-300',
  green:   'text-green-700 dark:text-green-300',
  violet:  'text-violet-700 dark:text-violet-300',
  cyan:    'text-cyan-700 dark:text-cyan-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  amber:   'text-amber-700 dark:text-amber-300',
}

const BORDER: Record<string, string> = {
  orange:  'border-orange-200 dark:border-orange-700',
  purple:  'border-purple-200 dark:border-purple-700',
  slate:   'border-slate-200 dark:border-slate-600',
  blue:    'border-blue-200 dark:border-blue-700',
  sky:     'border-sky-200 dark:border-sky-700',
  red:     'border-red-200 dark:border-red-700',
  teal:    'border-teal-200 dark:border-teal-700',
  green:   'border-green-200 dark:border-green-700',
  violet:  'border-violet-200 dark:border-violet-700',
  cyan:    'border-cyan-200 dark:border-cyan-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  emerald: 'border-emerald-200 dark:border-emerald-700',
  amber:   'border-amber-200 dark:border-amber-700',
}

const GRADIENT: Record<string, string> = {
  orange:  'from-orange-500 to-red-500',
  purple:  'from-purple-500 to-violet-500',
  slate:   'from-slate-500 to-gray-600',
  blue:    'from-blue-500 to-indigo-500',
  sky:     'from-sky-400 to-blue-500',
  red:     'from-red-500 to-rose-600',
  teal:    'from-teal-500 to-cyan-600',
  green:   'from-green-500 to-emerald-500',
  violet:  'from-violet-500 to-purple-600',
  cyan:    'from-cyan-500 to-sky-500',
  indigo:  'from-indigo-500 to-blue-600',
  emerald: 'from-emerald-500 to-teal-500',
  amber:   'from-amber-500 to-yellow-400',
}

// ─────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────
function SectionHeader({ term }: { term: Term }) {
  const { label, color, Icon } = term
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENT[color]} flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{label}</h2>
    </div>
  )
}

function Def({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className={`${BG[color]} ${BORDER[color]} border rounded-xl p-4 mb-5`}>
      <p className={`text-sm leading-relaxed ${TEXT[color]}`}>{children}</p>
    </div>
  )
}

function LearnMoreBtn({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950 px-3 py-1.5 rounded-lg transition hover:bg-indigo-100 dark:hover:bg-indigo-900">
      <ExternalLink className="w-3 h-3 flex-shrink-0" />
      {label}
    </a>
  )
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="my-5">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
        <Image src={src} alt={alt} width={900} height={520} className="w-full h-auto" />
      </div>
      {caption && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2 italic">{caption}</p>
      )}
    </div>
  )
}

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="my-5 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

// ─────────────────────────────────────
// 1 — External Link
// ─────────────────────────────────────
function ExternalLinkSection() {
  const term = TERMS[0]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Also known as an <strong>Outbound Link</strong>, an external link is a hyperlink that points to any domain other than
        the domain the link exists on. SEO best practices recommend using a balanced mix of internal and external links to
        provide value to users and to help search engines understand the content of your website.
      </Def>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Example</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <p className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1">Linking Site</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">americanceliac.org</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Publishing article about "Apex Legends wellness"</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0 text-orange-400">
            <ArrowRight className="w-5 h-5" />
            <span className="text-[10px] font-bold text-orange-500 whitespace-nowrap">external link</span>
          </div>
          <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Linked-To Site</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">safestcheats.com</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">A completely different domain</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          americanceliac.org is linking to safestcheats.com — a different domain — making it an{' '}
          <strong className="text-orange-600 dark:text-orange-400">external link for americanceliac.org</strong>.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 2 — Exact Match Anchor Text
// ─────────────────────────────────────
function ExactMatchAnchorSection() {
  const term = TERMS[1]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Exact match anchor text is a specific type of hyperlink anchor text that matches the target page's exact keyword
        or key phrase. It involves using the exact keyword as the clickable text of the link. Exact match anchor text can
        provide relevancy signals to search engines, but overusing it can be seen as manipulative and may result in penalties.
      </Def>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Example</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          A website wants to rank for the keyword{' '}
          <strong className="text-purple-600 dark:text-purple-400">"Grand Cayman"</strong>.
          The exact match anchor text in a sentence looks like this:
        </p>
        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed italic">
            "Located just minutes from the{' '}
            <span className="text-purple-600 dark:text-purple-300 underline font-semibold">Grand Cayman</span>
            , Dolphin Discovery is easily accessible for cruise passengers looking to make the most of their shore excursion."
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-3 h-3 rounded-sm bg-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The underlined text{' '}
            <strong className="text-purple-600 dark:text-purple-400">"Grand Cayman"</strong>{' '}
            is the anchor text — it <em>exactly</em> matches the target keyword the page is trying to rank for.
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Target Page:</span> dolphindiscovery.com/grand-cayman/
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 3 — Footer Link
// ─────────────────────────────────────
function FooterLinkSection() {
  const term = TERMS[2]
  const types = [
    { label: 'Navigational Links',       desc: 'Services, About, Contact — help users find key pages',   ok: true  },
    { label: 'Legal Links',              desc: 'Privacy Policy, Terms of Use, Refund Policy',             ok: true  },
    { label: 'Social Media Links',       desc: 'Facebook, LinkedIn, Instagram, and other platform icons', ok: true  },
    { label: 'Excessive Keyword Links',  desc: 'Too many keyword-stuffed links — appears spammy to Google', ok: false },
  ]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Footer links are links located in the footer section of a website. They usually include navigational links,
        legal information, social media links, and sometimes targeted keyword links. While they can be beneficial for
        site navigation, they should be used sparingly and properly, as excessive footer linking can be seen as spammy
        by search engines.
      </Def>

      <Screenshot
        src="/images/lesson15/footer-link-guestpostlinks.png"
        alt="GUESTPOSTLINKS website footer with red boxes highlighting the Services, Resources, Legal navigation sections and social media icons"
        caption="GUESTPOSTLINKS.net footer — red boxes highlight the different types of footer links: Services, Resources, Legal navigation and social icons"
      />

      <div className="grid grid-cols-2 gap-2 mb-5">
        {types.map(item => (
          <div key={item.label} className={`rounded-xl border p-3 ${
            item.ok
              ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
              : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'
          }`}>
            <p className={`text-xs font-bold mb-1 ${item.ok ? 'text-slate-700 dark:text-slate-200' : 'text-red-700 dark:text-red-300'}`}>
              {item.ok ? '✓' : '✗'} {item.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 4 — Google Algorithm
// ─────────────────────────────────────
function GoogleAlgorithmSection() {
  const term = TERMS[3]
  const factors = ['Keyword usage', 'Relevancy', 'Site speed', 'Backlinks']
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        The Google Algorithm is the complex system used by Google to retrieve data from its search index and instantly
        deliver the best possible results for a query. It considers many factors when ranking pages, including keyword
        usage, relevancy, site speed, and backlinks.
      </Def>

      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Key Ranking Factors</p>
        <div className="grid grid-cols-2 gap-2">
          {factors.map(f => (
            <div key={f} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{f}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <LearnMoreBtn href="https://developers.google.com/search/blog/2024/09/search-experiences-in-sa" label="Google Search Status Dashboard" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 5 — Google Analytics
// ─────────────────────────────────────
function GoogleAnalyticsSection() {
  const term = TERMS[4]
  const metrics = ['Website traffic', 'User behavior', 'Bounce rate', 'Conversion rate']
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Google Analytics is a web analytics service offered by Google that provides statistics and analytical tools for
        SEO and marketing purposes. It can track and report website traffic, user behavior, bounce rate, conversion rate,
        and more.
      </Def>

      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map(m => (
          <span key={m} className="text-xs font-semibold bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700 px-2.5 py-1 rounded-full">
            {m}
          </span>
        ))}
      </div>

      <Screenshot
        src="/images/lesson15/google-analytics-dashboard.png"
        alt="Google Analytics 4 Reports Snapshot showing 74K users, 64K new users, 2m 45s average engagement time, and $309K total revenue"
        caption="Google Analytics 4 (GA4) — Reports Snapshot showing key metrics: Users, New Users, Average Engagement Time, and Revenue"
      />

      <div className="flex flex-wrap gap-2">
        <LearnMoreBtn href="https://support.google.com/analytics/answer/9212670?hl=en" label="Overview of Google Analytics" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 6 — Google Penalty
// ─────────────────────────────────────
const PENALTY_TYPES = [
  'Unnatural links', 'Cloaking', 'Hacked website', 'Structured data issue',
  'Keyword stuffing', 'Thin content', 'Duplicate content', 'Spammy auto-generated content',
  'User-generated spam', 'Doorways', 'Intrusive pop-ups', 'Misleading or improper content',
  'Spammy free hosting',
]

function GooglePenaltySection() {
  const term = TERMS[5]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        A Google Penalty is a punitive action taken by Google against websites that violate the search engine's
        webmaster guidelines. Penalties can result in decreased search rankings or removal from search results altogether.
      </Def>

      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Common Causes of Google Penalties</p>
        <div className="flex flex-wrap gap-2">
          {PENALTY_TYPES.map(p => (
            <span key={p} className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-2.5 py-1.5 rounded-full">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {p}
            </span>
          ))}
        </div>
      </div>

      <Screenshot
        src="/images/lesson15/google-penalty-notification.png"
        alt="Google Search Console email notification: Major spam problems on example.com — page prevented from showing in Google Search"
        caption="A real Google penalty notification from Search Console — 'Major spam problems detected. Pages have been prevented from showing in Google Search.'"
      />

      <div className="flex flex-wrap gap-2">
        <LearnMoreBtn href="https://searchengineland.com/google-penalties-manual-actions-notifications-guide-388509" label="Read More About Google Penalties" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 7 — Google Search Console
// ─────────────────────────────────────
function GoogleSearchConsoleSection() {
  const term = TERMS[6]
  const features = [
    'Monitor your site\'s presence in Google Search',
    'View search queries, clicks, and impressions',
    'Troubleshoot indexing and coverage issues',
    'Identify and fix performance problems',
  ]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Google Search Console is a free service provided by Google that helps you monitor, maintain, and troubleshoot
        your site's presence in Google Search results. It offers tools and reports for understanding and improving your
        site's performance in Google Search.
      </Def>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {features.map(f => (
          <div key={f} className="flex items-start gap-2 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg p-2.5">
            <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-teal-800 dark:text-teal-200 leading-snug">{f}</p>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson15/google-search-console-dashboard.png"
        alt="Google Search Console Performance on Search results dashboard showing 10.4K total clicks and 4.32M total impressions for corkboardconcepts.com"
        caption="Google Search Console — Performance report for corkboardconcepts.com: 10.4K clicks, 4.32M impressions, 0.2% CTR, average position 18.9"
      />
    </section>
  )
}

// ─────────────────────────────────────
// 8 — Inbound Link
// ─────────────────────────────────────
function InboundLinkSection() {
  const term = TERMS[7]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Also known as a <strong>Backlink</strong> or <strong>Incoming Link</strong>, an inbound link is a hyperlink
        coming from another website to your own. These links play a key role in SEO as they can signal the quality and
        relevance of your content to search engines, influencing your site's ranking in search results.
      </Def>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Same scenario — different perspective
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Linking Site</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">americanceliac.org</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Giving the link out</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0 text-green-400">
            <ArrowRight className="w-5 h-5" />
            <span className="text-[10px] font-bold text-green-500 whitespace-nowrap">inbound link</span>
          </div>
          <div className="flex-1 min-w-0 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Receiving Site</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">safestcheats.com</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Receiving an inbound link</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 bg-amber-50 dark:bg-amber-950 rounded-lg p-3 -mx-0 mt-3">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <span className="font-bold">Key insight:</span> The exact same link is an{' '}
            <span className="text-orange-600 dark:text-orange-400 font-semibold">External Link</span> from americanceliac.org's
            perspective (it's linking out), and an{' '}
            <span className="text-green-600 dark:text-green-400 font-semibold">Inbound Link</span> from safestcheats.com's
            perspective (it's receiving a link). It's the same link — just viewed from different sides.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 9 — Indexability
// ─────────────────────────────────────
function IndexabilitySection() {
  const term = TERMS[8]
  const steps = [
    { n: 1, title: 'Discover the page URL',  desc: "Search engines find the URL through crawling, sitemaps, or links pointing to it." },
    { n: 2, title: 'Crawl it',               desc: "Download the content of the page — text, images, and code." },
    { n: 3, title: 'Process it',             desc: "Understand and extract key information from the crawled page, then add it to the index." },
  ]
  const factors = [
    { label: 'Meta Tags',   href: 'https://ahrefs.com/seo/glossary/meta-tags'  },
    { label: 'Robots.txt',  href: 'https://ahrefs.com/seo/glossary/robots-txt'  },
    { label: 'XML Sitemap', href: 'https://ahrefs.com/seo/glossary/sitemap'     },
  ]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        Indexability refers to a search engine's ability to analyze and add a webpage to its index. Factors affecting
        indexability include the site's meta tags, robots.txt file, XML sitemap, and whether the content is accessible
        and understandable to the search engine.
      </Def>

      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          How Search Engines Index a Page
        </p>
        <div className="space-y-2">
          {steps.map(s => (
            <div key={s.n} className="flex items-start gap-3 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-xl p-3">
              <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                {s.n}
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">{s.title}</p>
                <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
          Key Factors Affecting Indexability
        </p>
        <div className="flex flex-wrap gap-2">
          {factors.map(f => (
            <LearnMoreBtn key={f.label} href={f.href} label={f.label} />
          ))}
        </div>
      </div>

      <YouTubeEmbed id="_12-1ClFa-8" title="Understanding Website Indexing" />
    </section>
  )
}

// ─────────────────────────────────────
// 10 — Internal Link
// ─────────────────────────────────────
function InternalLinkSection() {
  const term = TERMS[9]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        An internal link goes from one page on a website to another page on the <strong>same website</strong>. Internal
        links are useful for helping users navigate the site and for spreading link equity (ranking power) throughout the site.
      </Def>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Real Example — Guestpostlinks.net
        </p>
        <div className="flex items-start gap-3 flex-wrap">
          <a href="https://guestpostlinks.net/guest-post-backlinks/" target="_blank" rel="noopener noreferrer"
            className="flex-1 min-w-0 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3 hover:border-cyan-400 transition group">
            <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1">Source Article</p>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition">
              "Guest Post Backlinks: What They Are and Why They Matter for Your SEO"
            </p>
            <p className="text-[10px] text-cyan-500 mt-1">guestpostlinks.net/guest-post-backlinks/</p>
          </a>
          <div className="flex flex-col items-center justify-center gap-0.5 py-2 flex-shrink-0 text-cyan-400">
            <ArrowRight className="w-5 h-5" />
            <span className="text-[10px] font-bold text-cyan-500 whitespace-nowrap">internal link</span>
          </div>
          <a href="https://guestpostlinks.net/what-is-an-authority-website/" target="_blank" rel="noopener noreferrer"
            className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-cyan-400 transition group">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Linked Page</p>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition">
              "What is an Authority Website?"
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">guestpostlinks.net/what-is-an-authority-website/</p>
          </a>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Both pages are on <strong>guestpostlinks.net</strong> — the same domain. This is what makes it an{' '}
          <strong className="text-cyan-600 dark:text-cyan-400">internal link</strong>: it enhances user navigation
          and spreads link equity across the site.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 11 — Index
// ─────────────────────────────────────
function IndexSection() {
  const term = TERMS[10]
  const facts = [
    {
      title: 'How it works',
      body: "Google's web crawlers (also known as spiders) scan websites to find new and updated pages. If a page meets Google's requirements, it's added to the index.",
    },
    {
      title: 'What it includes',
      body: 'The index includes hundreds of billions of web pages and is over 100 million GB in size.',
    },
    {
      title: "What it's used for",
      body: 'People use the index to search for information on the web. Every Google search result comes from the index.',
    },
    {
      title: 'How to check if your site is indexed',
      body: 'Use the Page Indexing report in Google Search Console to see which pages Google can find and index on your site.',
    },
  ]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        The Google Index is a collection of web pages that Google uses to provide search results. It is similar to a
        library index — which lists all the books in the library — but instead of books, the Google index lists all
        the web pages Google knows about.
      </Def>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {facts.map((f, i) => (
          <div key={i} className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1.5">{f.title}</p>
            <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// 12 — Indexed Page
// ─────────────────────────────────────
function IndexedPageSection() {
  const term = TERMS[11]
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        An indexed page is a webpage that a search engine has crawled, analyzed, and added to its index. Being indexed
        is a prerequisite for a webpage to appear in search results.
      </Def>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          How to Check if a Page is Indexed (No Tools Needed)
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
          Use either the{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">site:</code>
          {' '}or{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">info:</code>
          {' '}search operator in Google. Copy the URL of your webpage and paste it with the operator in front of it:
        </p>

        <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-4 font-mono">
          <p className="text-xs text-gray-500 mb-2">{"// Paste into Google search bar"}</p>
          <p className="text-sm text-green-400">site:https://guestpostlinks.net</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">Returns results</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Page IS indexed — it will appear in Google Search results</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">No results</p>
            <p className="text-xs text-red-700 dark:text-red-300">Page is NOT indexed — it will not appear in search results</p>
          </div>
        </div>
      </div>

      <Screenshot
        src="/images/lesson15/indexed-page-site-operator.png"
        alt="Google search results for site:https://guestpostlinks.net showing multiple indexed pages including the homepage and category pages"
        caption="Searching site:https://guestpostlinks.net in Google returns multiple results — confirming these pages are indexed by Google"
      />
    </section>
  )
}

// ─────────────────────────────────────
// 13 — Infographic
// ─────────────────────────────────────
function InfographicSection() {
  const term = TERMS[12]
  const benefits = ['Attracts attention', 'Generates backlinks', 'Increases social shares', 'Simplifies complex data']
  return (
    <section id={term.id} className="scroll-mt-24">
      <SectionHeader term={term} />
      <Def color={term.color}>
        An infographic is a visual representation of information or data presented in a graphical format. Infographics
        are often used to communicate complex concepts or data in a visually appealing and easily understandable manner.
        They can be effective for attracting attention, generating backlinks, and increasing social media shares.
      </Def>

      <div className="flex flex-wrap gap-2 mb-4">
        {benefits.map(b => (
          <span key={b} className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 px-2.5 py-1 rounded-full">
            {b}
          </span>
        ))}
      </div>

      <Screenshot
        src="/images/lesson15/infographic-example.png"
        alt="What is an Infographic? — a visual infographic showing sections: Big Picture, Summary, Explore, images summarize facts at 90%, why use it, and did you know facts"
        caption="Example infographic: 'What is an Infographic?' — presenting the concept visually using icons, stats, and minimal text"
      />
    </section>
  )
}

// ─────────────────────────────────────
// Section component list (must match TERMS order)
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  ExternalLinkSection,
  ExactMatchAnchorSection,
  FooterLinkSection,
  GoogleAlgorithmSection,
  GoogleAnalyticsSection,
  GooglePenaltySection,
  GoogleSearchConsoleSection,
  InboundLinkSection,
  IndexabilitySection,
  InternalLinkSection,
  IndexSection,
  IndexedPageSection,
  InfographicSection,
]

// ─────────────────────────────────────
// Main Component
// ─────────────────────────────────────
export default function Lesson15KeyTerminologies() {
  const [activeId, setActiveId] = useState(TERMS[0].id)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    TERMS.forEach(t => {
      const el = document.getElementById(t.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(t.id) },
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
    <div className="flex gap-6 items-start">
      {/* Sticky side nav — desktop only */}
      <nav className="hidden lg:flex flex-col gap-1 w-48 flex-shrink-0 sticky top-20">
        <div className="flex items-center gap-2 mb-3 px-1">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Key Terms</p>
        </div>
        {TERMS.map(t => (
          <button
            key={t.id}
            onClick={() => scrollTo(t.id)}
            className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-all ${
              activeId === t.id
                ? `${BG[t.color]} ${TEXT[t.color]} font-semibold`
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t.shortLabel}
          </button>
        ))}
      </nav>

      {/* Mobile pill nav */}
      <div className="lg:hidden w-full mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {TERMS.map(t => (
            <button
              key={t.id}
              onClick={() => scrollTo(t.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap border transition-all ${
                activeId === t.id
                  ? `${BG[t.color]} ${TEXT[t.color]} ${BORDER[t.color]}`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent'
              }`}
            >
              {t.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div ref={containerRef} className="flex-1 min-w-0 space-y-10">
        {SECTION_COMPONENTS.map((SectionComp, i) => (
          <motion.div
            key={TERMS[i].id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
            viewport={{ once: true }}
          >
            <SectionComp />
            {i < SECTION_COMPONENTS.length - 1 && (
              <div className="mt-10 border-b border-gray-100 dark:border-gray-800" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
