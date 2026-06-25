'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Columns, Search, Target, List, Type, Eye, Tag,
  Zap, FileText, BadgeCheck, Timer, Shield,
  TrendingUp, Users, Hash, Globe, Compass, Award,
  AlignLeft, Link2, BookOpen, AlertTriangle, Info,
  ExternalLink, Check,
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
  { id: 'sidebar-links',       label: 'Sidebar Links',       shortLabel: 'Sidebar Links',  color: 'slate',   Icon: Columns    },
  { id: 'search-algorithm',    label: 'Search Algorithm',    shortLabel: 'Search Algo',    color: 'blue',    Icon: Search     },
  { id: 'search-intent',       label: 'Search Intent',       shortLabel: 'Search Intent',  color: 'violet',  Icon: Target     },
  { id: 'search-results',      label: 'Search Results',      shortLabel: 'Search Results', color: 'emerald', Icon: List       },
  { id: 'search-term',         label: 'Search Term / Query', shortLabel: 'Search Term',    color: 'teal',    Icon: Type       },
  { id: 'search-visibility',   label: 'Search Visibility',   shortLabel: 'Visibility',     color: 'cyan',    Icon: Eye        },
  { id: 'secondary-keywords',  label: 'Secondary Keywords',  shortLabel: 'Secondary KW',   color: 'sky',     Icon: Tag        },
  { id: 'short-tail-keywords', label: 'Short-Tail Keywords', shortLabel: 'Short-Tail KW',  color: 'orange',  Icon: Zap        },
  { id: 'sponsored-post',      label: 'Sponsored Post',      shortLabel: 'Sponsored Post', color: 'amber',   Icon: FileText   },
  { id: 'sponsored-tag',       label: 'Sponsored Tag',       shortLabel: 'Sponsored Tag',  color: 'rose',    Icon: BadgeCheck },
  { id: 'site-speed',          label: 'Site Speed',          shortLabel: 'Site Speed',     color: 'indigo',  Icon: Timer      },
  { id: 'trust-flow',          label: 'Trust Flow',          shortLabel: 'Trust Flow',     color: 'purple',  Icon: Shield     },
  { id: 'traffic',             label: 'Traffic',             shortLabel: 'Traffic',        color: 'green',   Icon: TrendingUp },
  { id: 'ugc-link',            label: 'UGC Link Attribute',  shortLabel: 'UGC Link',       color: 'pink',    Icon: Users      },
  { id: 'url-slug',            label: 'URL Slug',            shortLabel: 'URL Slug',       color: 'lime',    Icon: Hash       },
  { id: 'webpage',             label: 'Webpage',             shortLabel: 'Webpage',        color: 'red',     Icon: Globe      },
  { id: 'website-nav',         label: 'Website Navigation',  shortLabel: 'Web Nav',        color: 'fuchsia', Icon: Compass    },
  { id: 'white-hat-seo',       label: 'White Hat SEO',       shortLabel: 'White Hat SEO',  color: 'emerald', Icon: Award      },
  { id: 'word-count',          label: 'Word Count',          shortLabel: 'Word Count',     color: 'blue',    Icon: AlignLeft  },
  { id: 'web-address',         label: 'Web Address / URL',   shortLabel: 'Web Address',    color: 'violet',  Icon: Link2      },
]

// ─────────────────────────────────────
// Color maps (17 unique colors)
// ─────────────────────────────────────
const BG: Record<string, string> = {
  slate:   'bg-slate-100 dark:bg-slate-800/50',
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
  cyan:    'bg-cyan-100 dark:bg-cyan-900/40',
  sky:     'bg-sky-100 dark:bg-sky-900/40',
  orange:  'bg-orange-100 dark:bg-orange-900/40',
  amber:   'bg-amber-100 dark:bg-amber-900/40',
  rose:    'bg-rose-100 dark:bg-rose-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  purple:  'bg-purple-100 dark:bg-purple-900/40',
  green:   'bg-green-100 dark:bg-green-900/40',
  pink:    'bg-pink-100 dark:bg-pink-900/40',
  lime:    'bg-lime-100 dark:bg-lime-900/40',
  red:     'bg-red-100 dark:bg-red-900/40',
  fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/40',
}

const TEXT: Record<string, string> = {
  slate:   'text-slate-700 dark:text-slate-300',
  blue:    'text-blue-700 dark:text-blue-300',
  violet:  'text-violet-700 dark:text-violet-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  teal:    'text-teal-700 dark:text-teal-300',
  cyan:    'text-cyan-700 dark:text-cyan-300',
  sky:     'text-sky-700 dark:text-sky-300',
  orange:  'text-orange-700 dark:text-orange-300',
  amber:   'text-amber-700 dark:text-amber-300',
  rose:    'text-rose-700 dark:text-rose-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  purple:  'text-purple-700 dark:text-purple-300',
  green:   'text-green-700 dark:text-green-300',
  pink:    'text-pink-700 dark:text-pink-300',
  lime:    'text-lime-700 dark:text-lime-300',
  red:     'text-red-700 dark:text-red-300',
  fuchsia: 'text-fuchsia-700 dark:text-fuchsia-300',
}

const BORDER: Record<string, string> = {
  slate:   'border-slate-200 dark:border-slate-600',
  blue:    'border-blue-200 dark:border-blue-700',
  violet:  'border-violet-200 dark:border-violet-700',
  emerald: 'border-emerald-200 dark:border-emerald-700',
  teal:    'border-teal-200 dark:border-teal-700',
  cyan:    'border-cyan-200 dark:border-cyan-700',
  sky:     'border-sky-200 dark:border-sky-700',
  orange:  'border-orange-200 dark:border-orange-700',
  amber:   'border-amber-200 dark:border-amber-700',
  rose:    'border-rose-200 dark:border-rose-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  purple:  'border-purple-200 dark:border-purple-700',
  green:   'border-green-200 dark:border-green-700',
  pink:    'border-pink-200 dark:border-pink-700',
  lime:    'border-lime-200 dark:border-lime-700',
  red:     'border-red-200 dark:border-red-700',
  fuchsia: 'border-fuchsia-200 dark:border-fuchsia-700',
}

const GRADIENT: Record<string, string> = {
  slate:   'from-slate-500 to-slate-700',
  blue:    'from-blue-500 to-indigo-500',
  violet:  'from-violet-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-500',
  teal:    'from-teal-500 to-cyan-600',
  cyan:    'from-cyan-400 to-teal-500',
  sky:     'from-sky-400 to-blue-500',
  orange:  'from-orange-500 to-red-500',
  amber:   'from-amber-500 to-orange-500',
  rose:    'from-rose-500 to-pink-600',
  indigo:  'from-indigo-500 to-blue-600',
  purple:  'from-purple-500 to-violet-600',
  green:   'from-green-500 to-emerald-500',
  pink:    'from-pink-500 to-rose-500',
  lime:    'from-lime-500 to-green-500',
  red:     'from-red-500 to-rose-600',
  fuchsia: 'from-fuchsia-500 to-pink-600',
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

function DefinitionCard({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className={`${BG[color]} ${BORDER[color]} border rounded-2xl p-5 mb-5`}>
      <p className={`${TEXT[color]} text-xs font-bold uppercase tracking-widest mb-2`}>Definition</p>
      <div className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">{children}</div>
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

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4">
      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{children}</div>
    </div>
  )
}

function ResourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 transition group mb-2">
      <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-violet-700 dark:group-hover:text-violet-300 font-medium">{label}</span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-violet-500 flex-shrink-0" />
    </a>
  )
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-5">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <Image src={src} alt={alt} width={900} height={520} className="w-full h-auto" />
      </div>
      {caption && <figcaption className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">{caption}</figcaption>}
    </figure>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-gray-900 text-green-300 rounded-xl p-4 text-xs sm:text-sm font-mono overflow-x-auto my-4 leading-relaxed">
      <code>{code}</code>
    </pre>
  )
}

// ─────────────────────────────────────
// Individual term sections
// ─────────────────────────────────────

function SidebarLinks() {
  const term = TERMS[0]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Sidebar links</strong> are links typically located in a{' '}
        <strong>vertical column on the left or right side of a webpage</strong>. They
        provide quick navigation to different sections or pages within the website,
        making it easy for visitors to explore related content without scrolling through
        the main body.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/sidebar-links.png"
        alt="Sidebar links shown in a vertical column on the right side of a webpage"
        caption="Sidebar links sit beside the main content area and offer quick access to related pages or categories"
      />
      <InfoBox label="Common Uses" color={term.color}>
        Sidebar links are often used for category navigation, recent posts, popular articles,
        social media buttons, and advertisement banners — all visible to the user without
        interfering with the main content.
      </InfoBox>
    </section>
  )
}

function SearchAlgorithm() {
  const term = TERMS[1]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Search Algorithm</strong> is the process search engines use to{' '}
        <strong>determine which results to show for any given query</strong>. For example,
        Google&#39;s algorithm considers hundreds of factors including keyword usage, content
        relevance, site authority, page speed, and backlink quality before ranking pages.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/search-algorithm.png"
        alt="Diagram showing how a search algorithm processes a query and returns results"
        caption="Search algorithms evaluate hundreds of signals in milliseconds to rank the most relevant pages"
      />
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-6 mb-5`}>
        <div className="flex items-center gap-2 mb-4">
          <Info className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>What is a SERP?</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          A <strong>Search Engine Results Page (SERP)</strong> is the list of web pages
          that a search engine displays in response to a specific word or phrase query.
          For instance, when you search for "SEO glossary" on Google, the page showing
          all the results is the SERP.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Organic Results', desc: 'Non-paid listings ranked by algorithm', icon: '🔍' },
            { label: 'Paid Ads',        desc: "Sponsored listings advertisers pay for",  icon: '📢' },
            { label: 'Featured Snippets', desc: 'Answer boxes pulled from top pages',    icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-center">
              <p className="text-xl mb-1">{s.icon}</p>
              <p className={`${TEXT[term.color]} text-xs font-bold mb-0.5`}>{s.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SearchIntent() {
  const term = TERMS[2]
  const intents = [
    { type: 'Informational', icon: '📖', example: '"how to make cold brew coffee"', desc: 'User wants to learn something.' },
    { type: 'Navigational',  icon: '🧭', example: '"YouTube login"',                desc: 'User wants to reach a specific website.' },
    { type: 'Transactional', icon: '🛒', example: '"buy iPhone 12"',                desc: 'User wants to complete a purchase.' },
    { type: 'Commercial',    icon: '🔎', example: '"best laptops 2024"',             desc: 'User is researching before buying.' },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Search Intent</strong> is the <strong>reason a user conducts a specific
        search</strong>. Understanding what a user actually wants to accomplish when they
        type a query helps you create content that matches their needs — which search
        engines reward with higher rankings.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/search-intent.png"
        alt="Diagram showing the four types of search intent"
        caption="Every search query has an underlying intent — matching your content to that intent is critical for ranking"
      />
      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">The 4 Types of Search Intent:</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {intents.map(it => (
          <div key={it.type} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{it.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{it.type}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 leading-snug">{it.desc}</p>
            <p className="text-xs italic text-gray-500 dark:text-gray-500">e.g., {it.example}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SearchResults() {
  const term = TERMS[3]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Search Results</strong> are the web pages presented to a user after they
        perform a search. For example, if you search "Italian restaurants" on Google,
        the list of restaurants and websites that appear is the search results.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/search-results.png"
        alt="Search results page showing organic listings and paid ads on Google"
        caption="Search results include organic listings, paid ads, local packs, and featured snippets"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: '🔍', label: 'Organic Results', desc: 'Free, algorithm-ranked listings — earned through good SEO.' },
          { icon: '💰', label: 'Paid Results',    desc: "Ads shown to advertisers' target audience based on bid and quality." },
          { icon: '📍', label: 'Local Pack',      desc: 'Map listings for location-based searches (restaurants, shops).' },
          { icon: '⭐', label: 'Rich Snippets',   desc: 'Enhanced results with stars, images, or answers pulled from pages.' },
        ].map(r => (
          <div key={r.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{r.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{r.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SearchTermQuery() {
  const term = TERMS[4]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Search Term (or Query)</strong> is the <strong>word or phrase that a
        user types into a search engine</strong>. For example,{' '}
        <em>"best laptops of 2024"</em> is a search term. Understanding the search
        terms your audience uses is the foundation of keyword research.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/search-term.png"
        alt="User typing a search term into a Google search bar"
        caption="Every search starts with a term or query — what users type is what SEO must address"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
          <p className={`${TEXT[term.color]} text-xs font-bold mb-2 uppercase tracking-widest`}>Search Term</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">What the <strong>user types</strong> into the search box to start their search.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-blue-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-widest">Keyword</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">The term a <strong>marketer targets</strong> in their content to match user searches.</p>
        </div>
      </div>
    </section>
  )
}

function SearchVisibility() {
  const term = TERMS[5]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Search Visibility</strong> measures <strong>how often your website
        appears in search results</strong> for your targeted keywords. For example, if
        your website appears in 80% of all potential searches for your target keywords,
        your search visibility score is 80%.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/search-visibility.png"
        alt="Search visibility score shown in an SEO tool dashboard"
        caption="Search visibility is tracked over time to measure the overall reach of your SEO efforts"
      />
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { score: '0–30%',  label: 'Low',  desc: 'Your site is missing most ranking opportunities.',    color: 'red'     },
          { score: '30–60%', label: 'Fair', desc: 'Ranking for some keywords but significant room to grow.', color: 'amber' },
          { score: '60%+',   label: 'Strong', desc: 'Highly visible — dominating most target searches.',  color: 'emerald' },
        ].map(s => (
          <div key={s.label} className={`${BG[s.color]} ${BORDER[s.color]} border rounded-xl p-4 text-center`}>
            <p className={`${TEXT[s.color]} text-lg font-black mb-1`}>{s.score}</p>
            <p className={`${TEXT[s.color]} text-xs font-bold mb-1`}>{s.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SecondaryKeywords() {
  const term = TERMS[6]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Secondary Keywords</strong> are additional keywords that are{' '}
        <strong>related to the primary keyword</strong> on a page. If your primary keyword
        is "Italian restaurants," secondary keywords might include "pizza," "pasta," and
        "Italian cuisine." They support the main keyword and help search engines understand
        the full topic of your content.
      </DefinitionCard>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <Screenshot
          src="/images/lesson23/secondary-keywords-1.png"
          alt="Keyword research tool showing primary and secondary keyword groupings"
          caption="Secondary keywords cluster around the primary keyword in keyword research tools"
        />
        <Screenshot
          src="/images/lesson23/secondary-keywords-2.png"
          alt="Content map showing how secondary keywords support a primary keyword"
          caption="Including secondary keywords helps cover the topic more comprehensively"
        />
      </div>
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Info className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>Example: Italian Restaurants</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`${BG['violet']} ${TEXT['violet']} text-xs font-bold px-3 py-1.5 rounded-full border ${BORDER['violet']}`}>
            🎯 Primary: Italian restaurants
          </span>
          {['pizza', 'pasta', 'Italian cuisine', 'trattorias', 'carbonara', 'tiramisu'].map(kw => (
            <span key={kw} className={`${BG[term.color]} ${TEXT[term.color]} text-xs px-3 py-1.5 rounded-full border ${BORDER[term.color]}`}>
              {kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ShortTailKeywords() {
  const term = TERMS[7]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Short-Tail Keywords</strong> are <strong>broad, often single-word or
        two-word keywords</strong> with very high search volume. Examples include "dog food"
        or "shoes." Because they are broad, they attract enormous traffic but are
        extremely competitive and often have low conversion rates.
      </DefinitionCard>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5`}>
          <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>Short-Tail Keywords</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {['"shoes"', '"dog food"', '"SEO"', '"coffee"'].map(kw => (
              <span key={kw} className="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs px-2.5 py-1 rounded-full font-semibold">{kw}</span>
            ))}
          </div>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>• 1–2 words long</li>
            <li>• Millions of monthly searches</li>
            <li>• Very high competition</li>
            <li>• Low conversion rate</li>
          </ul>
        </div>
        <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-5">
          <p className="text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-widest mb-3">Long-Tail Keywords</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {['"best running shoes for flat feet"', '"organic dog food for senior dogs"'].map(kw => (
              <span key={kw} className="bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200 text-xs px-2.5 py-1 rounded-full font-semibold">{kw}</span>
            ))}
          </div>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>• 3+ words long</li>
            <li>• Lower monthly searches</li>
            <li>• Lower competition</li>
            <li>• Higher conversion rate</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function SponsoredPost() {
  const term = TERMS[8]
  const labels = ['"Paid post"', '"Presented by"', '"Sponsored by"', '"Partnered with"', '"Promoted"', '"Affiliated with"', '"Powered by"']
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Sponsored Post</strong> is a type of content for which a person or brand{' '}
        <strong>pays the hosting website to publish</strong> it. It is often used for
        promotional purposes — the content appears alongside regular editorial content but
        is created or endorsed by an advertiser.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/sponsored-post-1.png"
        alt="Sponsored post label shown at the top of a blog article"
        caption="Sponsored posts use disclosure labels so readers know the content is paid for"
      />
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>Labels You Will Find in a Sponsored Post</p>
        <div className="flex flex-wrap gap-2">
          {labels.map(l => (
            <span key={l} className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs px-3 py-1.5 rounded-full font-semibold">
              {l}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
          These labels are required by regulations (such as FTC guidelines in the U.S.) to maintain transparency with readers.
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Live Example — BuzzFeed Sponsored Post:</p>
        <Screenshot
          src="/images/lesson23/sponsored-post-2.png"
          alt="BuzzFeed sponsored post showing a cookie showdown article paid for by Shipt"
          caption="A real-world BuzzFeed sponsored post — 'The Winner of the Holiday Cookie Showdown' presented by Shipt"
        />
        <ResourceLink
          href="https://www.buzzfeed.com/shipt/the-winner-of-the-holiday-cookie-showdown"
          label="See the live BuzzFeed sponsored post →"
        />
      </div>
      <ResourceLink
        href="https://www.blogtyrant.com/how-to-get-sponsored-posts-for-your-blog/"
        label="BlogTyrant: How to get sponsored posts for your blog →"
      />
    </section>
  )
}

function SponsoredTag() {
  const term = TERMS[9]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Sponsored Tag</strong> (<code className="bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded text-sm font-mono">rel="sponsored"</code>)
        is an HTML attribute added to links that indicates the content is{' '}
        <strong>paid for or supported by a sponsor</strong>. It is important for transparency,
        maintaining audience trust, and complying with advertising regulations like the
        FTC guidelines in the U.S.
      </DefinitionCard>
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>HTML Code Example</p>
        <CodeBlock code={`<a href="https://www.example.com" rel="sponsored">Example Website</a>`} />
        <div className="flex items-start gap-2">
          <Info className={`w-4 h-4 ${TEXT[term.color]} flex-shrink-0 mt-0.5`} />
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            The <code className="bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-1 rounded text-xs font-mono">rel="sponsored"</code> attribute
            tells search engines that this link is part of a sponsorship or paid promotion
            — they will not pass SEO value (link equity) through it.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '🛡️', label: 'Transparency', desc: 'Discloses to both readers and search engines that the link or content is paid for.' },
          { icon: '⚖️', label: 'Compliance',   desc: 'Helps meet FTC guidelines requiring clear disclosure of advertising and sponsorships.' },
          { icon: '🔒', label: 'No SEO Boost', desc: 'Sponsored links do not pass PageRank to the linked website — preventing manipulation.' },
          { icon: '✅', label: 'Best Practice', desc: 'Always use rel="sponsored" on paid links to avoid potential penalties from Google.' },
        ].map(p => (
          <div key={p.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-lg mb-1">{p.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{p.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{p.desc}</p>
          </div>
        ))}
      </div>
      <Screenshot
        src="/images/lesson23/sponsored-tag.png"
        alt="Sponsored tag rel attribute shown in a blog post's HTML code"
        caption="The rel='sponsored' attribute appears in a link's HTML to flag it as a paid placement"
      />
      <ResourceLink
        href="https://halloweenlove.com/spin-the-shadows-horror-slot-games-for-a-thrilling-halloween-experience-sponsored/"
        label="See a live sponsored post example →"
      />
    </section>
  )
}

function SiteSpeed() {
  const term = TERMS[10]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Site Speed</strong> refers to how quickly a webpage loads in a{' '}
        <strong>user&#39;s browser</strong>, measured in seconds. It is a crucial factor in
        determining both <strong>user experience</strong> and{' '}
        <strong>search engine rankings</strong> — Google has officially confirmed page
        speed as a ranking factor.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/site-speed.png"
        alt="PageSpeed Insights tool showing page speed score and recommendations"
        caption="Google's PageSpeed Insights scores your page 0–100 and lists specific improvements"
      />
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { score: '90–100', label: 'Fast',    color: 'emerald' },
          { score: '50–89',  label: 'Needs Improvement', color: 'amber'   },
          { score: '0–49',   label: 'Slow',    color: 'red'     },
        ].map(s => (
          <div key={s.label} className={`${BG[s.color]} ${BORDER[s.color]} border rounded-xl p-4 text-center`}>
            <p className={`${TEXT[s.color]} text-2xl font-black`}>{s.score}</p>
            <p className={`${TEXT[s.color]} text-xs font-bold mt-1`}>{s.label}</p>
          </div>
        ))}
      </div>
      <ResourceLink
        href="https://pagespeed.web.dev/analysis"
        label="Test your page speed with Google PageSpeed Insights →"
      />
    </section>
  )
}

function TrustFlow() {
  const term = TERMS[11]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        In SEO terms, <strong>Trust Flow</strong> measures the level of confidence search
        engines have in your website or content. It is influenced by{' '}
        <strong>the quality and relevance of your content</strong> and the{' '}
        <strong>number and quality of links pointing to your website</strong>. A high Trust
        Flow score signals to search engines that your site is authoritative and trustworthy.
      </DefinitionCard>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '📄', label: 'Content Quality',  desc: 'Well-researched, accurate, and regularly updated content earns trust over time.' },
          { icon: '🔗', label: 'Quality Backlinks', desc: 'Links from highly trusted domains pass Trust Flow to your website.' },
          { icon: '🧹', label: 'Clean Link Profile', desc: "No spammy or toxic backlinks — a healthy profile protects your trust score." },
          { icon: '📅', label: 'Domain Age',        desc: 'Older, consistently performing domains tend to have higher trust scores.' },
        ].map(f => (
          <div key={f.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{f.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>
      <ResourceLink
        href="https://www.pageonepower.com/search-glossary/trust-flow"
        label="PageOnePower: What is Trust Flow? →"
      />
    </section>
  )
}

function Traffic() {
  const term = TERMS[12]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        In web analytics, <strong>Traffic</strong> is the{' '}
        <strong>amount of data sent and received by visitors to a website</strong>. It
        represents how many people are visiting your site and is the primary metric for
        measuring a website&#39;s overall reach and popularity. High traffic indicates a
        popular or well-performing website.
      </DefinitionCard>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {[
          { type: 'Organic',   icon: '🔍', desc: 'From search engines (unpaid)' },
          { type: 'Direct',    icon: '↩️', desc: 'URL typed directly' },
          { type: 'Referral',  icon: '🔗', desc: 'From other websites' },
          { type: 'Social',    icon: '📱', desc: 'From social media platforms' },
          { type: 'Paid',      icon: '💰', desc: 'From paid ads (PPC)' },
          { type: 'Email',     icon: '📧', desc: 'From email campaigns' },
        ].map(t => (
          <div key={t.type} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-3 text-center`}>
            <p className="text-lg">{t.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold`}>{t.type}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{t.desc}</p>
          </div>
        ))}
      </div>
      <Screenshot
        src="/images/lesson23/traffic.png"
        alt="Google Analytics traffic overview showing traffic sources and visitor counts"
        caption="Google Analytics shows a full breakdown of traffic by source, helping you understand where visitors come from"
      />
    </section>
  )
}

function UGCLink() {
  const term = TERMS[13]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>UGC</strong> stands for <strong>User Generated Content</strong>. The{' '}
        <strong>UGC Link Attribute</strong> (
        <code className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-1.5 py-0.5 rounded text-sm font-mono">rel="ugc"</code>
        ) is a tag added to links within user-generated content — such as blog comments
        and forum posts — to inform Google that the link was created by a user, not the
        website owner.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/ugc-link.png"
        alt="UGC link attribute shown in a forum comment with rel=ugc"
        caption="The rel='ugc' attribute tells Google this link came from a reader's comment, not editorial content"
      />
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>HTML Code Example</p>
        <CodeBlock code={`<a href="https://www.example.com" rel="ugc">Example Website</a>`} />
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          This signals to search engines that the link is user-generated — they will
          treat it differently from editorial links and will not pass full link equity through it.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '🧹', label: 'Link Profile Integrity', desc: 'Distinguishes editorial links from user-generated ones, keeping your link profile clean.' },
          { icon: '🛡️', label: 'Spam Protection',        desc: "Protects your site if malicious users post spam links in your comments." },
        ].map(b => (
          <div key={b.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{b.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{b.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{b.desc}</p>
          </div>
        ))}
      </div>
      <ResourceLink
        href="https://www.nairaland.com/8161893/nurturing-future-healers-importance-medical"
        label="See a live example of a UGC link in context →"
      />
    </section>
  )
}

function URLSlug() {
  const term = TERMS[14]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>URL Slug</strong> is the part of a URL that identifies a specific
        page in a human-readable way. Major search engines like Google rely on the slug
        to <strong>comprehend and categorise your content accurately</strong>. A well-crafted
        slug is concise, descriptive, and includes the primary keyword.
      </DefinitionCard>
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>Example URL</p>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs sm:text-sm overflow-x-auto">
          <span className="text-gray-400">https://guestpostlinks.net/</span>
          <span className="text-lime-400 font-bold">what-is-a-url-slug</span>
          <span className="text-gray-400">/</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
          The slug is <strong className="text-lime-700 dark:text-lime-300">what-is-a-url-slug</strong> — the unique identifier that comes after the domain name.
        </p>
      </div>
      <Screenshot
        src="/images/lesson23/url-slug.png"
        alt="URL slug shown in a web browser's address bar"
        caption="The URL slug appears directly in the browser address bar — it is the page's unique identifier"
      />
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2 uppercase tracking-widest">Good Slug</p>
          <code className="text-emerald-700 dark:text-emerald-300 text-sm">/best-coffee-brewing-methods</code>
          <ul className="mt-2 space-y-1">
            {['Short & descriptive', 'Uses hyphens (not underscores)', 'Includes primary keyword', 'All lowercase'].map(pt => (
              <li key={pt} className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                <Check className="w-3 h-3" /> {pt}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2 uppercase tracking-widest">Bad Slug</p>
          <code className="text-red-700 dark:text-red-300 text-sm">/page?id=1234&cat=53</code>
          <ul className="mt-2 space-y-1">
            {['Not readable by humans', 'Contains numbers & symbols', 'No keyword included', 'Unmemorable'].map(pt => (
              <li key={pt} className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="w-3 h-3" /> {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ResourceLink
        href="https://guestpostlinks.net/what-is-a-url-slug/"
        label="Full guide: What is a URL Slug? →"
      />
    </section>
  )
}

function Webpage() {
  const term = TERMS[15]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Webpage</strong> is a document or information resource that is suitable
        for the <strong>World Wide Web (WWW)</strong> and can be accessed through a web
        browser. Every website is built from individual webpages — each a separate HTML
        document containing text, images, links, and other media.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/webpage.png"
        alt="A webpage displayed in a web browser showing content, navigation, and images"
        caption="A webpage is a single HTML document within a website — accessible via its unique URL"
      />
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: '📝', label: 'Content',     desc: 'Text, headings, images, and videos that make up the page.' },
          { icon: '🔗', label: 'Links',       desc: 'Internal links to other pages, and outbound links to external sites.' },
          { icon: '🏗️', label: 'HTML/CSS',    desc: 'The code structure (HTML) and styling (CSS) that defines the layout.' },
        ].map(c => (
          <div key={c.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{c.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{c.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function WebsiteNavigation() {
  const term = TERMS[16]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Website Navigation</strong> is the process of{' '}
        <strong>navigating a network of information resources on the World Wide Web</strong>,
        which is organised as hypertext or hypermedia. Good navigation helps visitors find
        what they need quickly — and helps search engines crawl and understand your site.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/website-navigation-1.png"
        alt="Website navigation menu showing main categories and dropdown submenus"
        caption="Clear navigation menus allow users to quickly move between sections of a website"
      />
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
          <p className={`${TEXT[term.color]} text-xs font-bold mb-2 uppercase tracking-widest`}>Hypertext</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Text that contains clickable links to other pages or resources. The foundation
            of web navigation — click a word, go somewhere new.
          </p>
          <div className="mt-2">
            <ResourceLink href="https://www.mediafactory.org.au/li-wen-ho/tag/hypertext/" label="Learn about hypertext →" />
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
          <p className="text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2 uppercase tracking-widest">Hypermedia</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            An extension of hypertext that includes links within and between images,
            audio, video, and other media types — not just text.
          </p>
          <div className="mt-2">
            <ResourceLink href="https://www.techopedia.com/definition/3105/hypermedia" label="Learn about hypermedia →" />
          </div>
        </div>
      </div>
      <Screenshot
        src="/images/lesson23/website-navigation-2.png"
        alt="Breadcrumb navigation and menu structure showing website hierarchy"
        caption="Navigation structures like breadcrumbs and menus help users and crawlers understand site hierarchy"
      />
    </section>
  )
}

function WhiteHatSEO() {
  const term = TERMS[17]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>White Hat SEO</strong> refers to the use of optimisation strategies,
        techniques, and tactics that{' '}
        <strong>focus on providing genuine value to users</strong> and completely follow
        search engine rules and policies. It is the opposite of Black Hat SEO, which
        uses deceptive tactics to manipulate rankings.
      </DefinitionCard>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
          <p className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">White Hat SEO ✓</p>
          <ul className="space-y-2">
            {['Creating high-quality, original content', 'Earning genuine backlinks', 'Optimising page speed and UX', 'Using keywords naturally', 'Building real audience relationships'].map(pt => (
              <li key={pt} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {pt}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-5">
          <p className="text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-widest mb-3">Black Hat SEO ✗</p>
          <ul className="space-y-2">
            {['Keyword stuffing', 'Buying links', 'Cloaking (showing different content to bots)', 'Duplicate content', 'Private Blog Networks (PBNs)'].map(pt => (
              <li key={pt} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <InfoBox label="Why White Hat SEO Wins Long-Term" color={term.color}>
        Black hat tactics may produce short-term ranking boosts, but Google&#39;s algorithm
        updates (Panda, Penguin, Helpful Content Update) consistently penalise sites that
        break the rules. White Hat SEO builds sustainable, long-term rankings that survive
        algorithm changes.
      </InfoBox>
      <ResourceLink
        href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
        label="Google: Official SEO Starter Guide →"
      />
    </section>
  )
}

function WordCount() {
  const term = TERMS[18]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Word Count</strong> is the number of words on a webpage. While there is
        no universally perfect word count for SEO, <strong>longer, in-depth content
        often ranks better</strong> on search engines — because it tends to cover topics
        more thoroughly and earn more backlinks. However, quality always matters more
        than length.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson23/word-count-1.png"
        alt="SEO tool showing average word count for top-ranking pages"
        caption="Top-ranking pages for competitive keywords often have significantly more content than lower-ranked pages"
      />
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Info className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>How to Count Words</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Online Tool</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Use a free word counter website to instantly count words in any text you paste in.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Google Docs</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Press <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl + Shift + C</kbd> to open the word count window.</p>
          </div>
        </div>
      </div>
      <Screenshot
        src="/images/lesson23/word-count-2.png"
        alt="Word count tool showing word and character counts for a text sample"
        caption="Online word count tools provide instant word, character, and sentence counts"
      />
      <ResourceLink
        href="https://wordcounter.net/"
        label="WordCounter.net — Free online word count tool →"
      />
    </section>
  )
}

function WebAddress() {
  const term = TERMS[19]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Web Address</strong>, also known as a{' '}
        <strong>URL (Uniform Resource Locator)</strong>, is the specific location that
        identifies a webpage or resource on the internet. It is the unique address users
        enter into their web browser to access a particular website or page.
      </DefinitionCard>
      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>Anatomy of a Web Address</p>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs sm:text-sm overflow-x-auto mb-4">
          <span className="text-blue-400 font-bold">https://</span>
          <span className="text-emerald-400 font-bold">www.example.com</span>
          <span className="text-amber-400 font-bold">/blog</span>
          <span className="text-pink-400 font-bold">/what-is-seo</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { part: 'https://', label: 'Protocol', color: 'blue' },
            { part: 'example.com', label: 'Domain', color: 'emerald' },
            { part: '/blog', label: 'Path', color: 'amber' },
            { part: '/what-is-seo', label: 'Slug', color: 'pink' },
          ].map(p => (
            <div key={p.label} className={`${BG[p.color]} rounded-xl p-3 text-center`}>
              <code className={`${TEXT[p.color]} text-xs font-bold block mb-1`}>{p.part}</code>
              <p className="text-xs text-gray-500 dark:text-gray-400">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
      <Screenshot
        src="/images/lesson23/web-address.png"
        alt="Web address (URL) shown in a browser address bar with its components highlighted"
        caption="A complete web address (URL) is made up of the protocol, domain name, path, and optional slug"
      />
    </section>
  )
}

// ─────────────────────────────────────
// Section components in TERMS order
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  SidebarLinks, SearchAlgorithm, SearchIntent, SearchResults,
  SearchTermQuery, SearchVisibility, SecondaryKeywords, ShortTailKeywords,
  SponsoredPost, SponsoredTag, SiteSpeed, TrustFlow,
  Traffic, UGCLink, URLSlug, Webpage,
  WebsiteNavigation, WhiteHatSEO, WordCount, WebAddress,
]

// ─────────────────────────────────────
// Main export
// ─────────────────────────────────────
export default function Lesson23KeyTerminologies() {
  const [activeId, setActiveId] = useState(TERMS[0].id)

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
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-700 via-blue-600 to-violet-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Module 2 · Lesson 23</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Key Terminologies in Content Marketing — 7</h1>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xl">
            20 essential SEO and content marketing terms: Sidebar Links, Search Algorithm, Search Intent,
            Search Results, Search Term, Search Visibility, Secondary Keywords, Short-Tail Keywords,
            Sponsored Post, Sponsored Tag, Site Speed, Trust Flow, Traffic, UGC Link,
            URL Slug, Webpage, Website Navigation, White Hat SEO, Word Count, and Web Address.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-blue-100">
            <span>📚 20 Terms</span>
            <span>🖼️ 21 Screenshots</span>
            <span>🔗 10 Resource Links</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* Sticky sidebar — desktop only */}
        <nav className="hidden lg:flex flex-col gap-0.5 w-44 flex-shrink-0 sticky top-20">
          <div className="flex items-center gap-2 mb-3 px-1">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Key Terms</p>
          </div>
          {TERMS.map(t => (
            <button
              key={t.id}
              onClick={() => scrollTo(t.id)}
              className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                activeId === t.id
                  ? `${BG[t.color]} ${TEXT[t.color]} font-semibold`
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t.shortLabel}
            </button>
          ))}
        </nav>

        {/* Content + mobile pill nav */}
        <div className="flex-1 min-w-0">

          {/* Mobile pill nav */}
          <div className="lg:hidden mb-4 overflow-x-auto">
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

          {/* Content sections */}
          <div className="space-y-16">
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
                  <div className="mt-16 border-b border-gray-100 dark:border-gray-800" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer summary */}
          <div className="mt-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-4">Module 2 — Key Terms Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TERMS.map(t => {
                const Icon = t.Icon
                return (
                  <button key={t.id} onClick={() => scrollTo(t.id)}
                    className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-900 transition text-left group">
                    <div className={`w-7 h-7 ${BG[t.color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${TEXT[t.color]}`} />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-medium leading-snug">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
