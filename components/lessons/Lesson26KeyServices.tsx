'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Globe, FileText, Link, MapPin, Newspaper, Activity,
  Trophy, MessageSquare, Search, CheckCircle, ExternalLink,
  Info, AlertTriangle, Star, Building2, Users, Shield,
  Timer, TrendingUp, Award, BookOpen, Tag, Zap,
  ArrowRight, Target, Layers, ChevronRight, Megaphone,
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
  { id: 'services-overview', label: 'Key Services Overview',         shortLabel: 'Overview',         color: 'emerald', Icon: Layers      },
  { id: 'guest-posting',     label: 'Guest Posting',                  shortLabel: 'Guest Posting',    color: 'blue',    Icon: FileText    },
  { id: 'niche-edits',       label: 'Niche Edits',                    shortLabel: 'Niche Edits',      color: 'violet',  Icon: Link        },
  { id: 'local-citation',    label: 'Local Citation Building',         shortLabel: 'Local Citation',   color: 'teal',    Icon: MapPin      },
  { id: 'press-release',     label: 'Press Release Distribution',      shortLabel: 'Press Release',    color: 'amber',   Icon: Newspaper   },
  { id: 'local-seo',         label: 'Local SEO',                       shortLabel: 'Local SEO',        color: 'green',   Icon: Search      },
  { id: 'pharmacy-niche',    label: 'Pharmacy Niche',                  shortLabel: 'Pharmacy',         color: 'rose',    Icon: Activity    },
  { id: 'casino-gaming',     label: 'Casino & Gaming Niche',           shortLabel: 'Casino/Gaming',    color: 'indigo',  Icon: Trophy      },
  { id: 'foreign-language',  label: 'Foreign Language Niche',          shortLabel: 'Foreign Language', color: 'purple',  Icon: MessageSquare },
]

// ─────────────────────────────────────
// Color maps
// ─────────────────────────────────────
const BG: Record<string, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
  amber:   'bg-amber-100 dark:bg-amber-900/40',
  green:   'bg-green-100 dark:bg-green-900/40',
  rose:    'bg-rose-100 dark:bg-rose-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  purple:  'bg-purple-100 dark:bg-purple-900/40',
  sky:     'bg-sky-100 dark:bg-sky-900/40',
  orange:  'bg-orange-100 dark:bg-orange-900/40',
}

const TEXT: Record<string, string> = {
  emerald: 'text-emerald-700 dark:text-emerald-300',
  blue:    'text-blue-700 dark:text-blue-300',
  violet:  'text-violet-700 dark:text-violet-300',
  teal:    'text-teal-700 dark:text-teal-300',
  amber:   'text-amber-700 dark:text-amber-300',
  green:   'text-green-700 dark:text-green-300',
  rose:    'text-rose-700 dark:text-rose-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  purple:  'text-purple-700 dark:text-purple-300',
  sky:     'text-sky-700 dark:text-sky-300',
  orange:  'text-orange-700 dark:text-orange-300',
}

const BORDER: Record<string, string> = {
  emerald: 'border-emerald-200 dark:border-emerald-700',
  blue:    'border-blue-200 dark:border-blue-700',
  violet:  'border-violet-200 dark:border-violet-700',
  teal:    'border-teal-200 dark:border-teal-700',
  amber:   'border-amber-200 dark:border-amber-700',
  green:   'border-green-200 dark:border-green-700',
  rose:    'border-rose-200 dark:border-rose-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  purple:  'border-purple-200 dark:border-purple-700',
  sky:     'border-sky-200 dark:border-sky-700',
  orange:  'border-orange-200 dark:border-orange-700',
}

const GRADIENT: Record<string, string> = {
  emerald: 'from-emerald-500 to-teal-500',
  blue:    'from-blue-500 to-indigo-500',
  violet:  'from-violet-500 to-purple-600',
  teal:    'from-teal-500 to-cyan-600',
  amber:   'from-amber-500 to-orange-500',
  green:   'from-green-500 to-emerald-500',
  rose:    'from-rose-500 to-pink-600',
  indigo:  'from-indigo-500 to-blue-600',
  purple:  'from-purple-500 to-violet-600',
  sky:     'from-sky-500 to-blue-500',
  orange:  'from-orange-500 to-amber-500',
}

// ─────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────
function SectionHeader({ section }: { section: Section }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENT[section.color]} flex items-center justify-center shadow-sm flex-shrink-0`}>
        <section.Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{section.label}</h2>
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
    <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-4 flex gap-3">
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-5 bg-white dark:bg-gray-900">
      <img src={src} alt={alt} className="w-full object-contain" loading="lazy" />
      {caption && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-2 px-3 border-t border-gray-100 dark:border-gray-800">{caption}</p>
      )}
    </div>
  )
}

function ServiceLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r ${GRADIENT[color]} text-white shadow hover:shadow-md transition-all hover:scale-[1.02] mb-5`}>
      {label}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  )
}

function ResourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition group mb-2">
      <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 font-medium truncate">{label}</span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 flex-shrink-0" />
    </a>
  )
}

// ─────────────────────────────────────
// Section 1 — Key Services Overview
// ─────────────────────────────────────
function ServicesOverview() {
  const section = SECTIONS[0]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What We Provide</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          GUESTPOSTLINKS specialises in two powerful pillars of digital growth:{' '}
          <strong>Link Building</strong> and <strong>Local SEO</strong>. By combining
          these services, we help businesses gain the visibility they need to grow
          both locally and globally — improving search engine rankings, driving more
          traffic, and generating real leads and sales.
        </p>
      </div>

      <Screenshot
        src="/images/lesson26/services-overview.png"
        alt="GUESTPOSTLINKS Key Services Overview"
        caption="GUESTPOSTLINKS key services at a glance"
      />

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENT['blue']} flex items-center justify-center mb-3`}>
            <Link className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold text-gray-900 dark:text-gray-50 mb-2">Link Building Services</p>
          <ul className="space-y-1.5">
            {['Guest Posting', 'Niche Edits', 'Local Citation Building', 'Press Release Distribution'].map(s => (
              <li key={s} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENT['green']} flex items-center justify-center mb-3`}>
            <Search className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold text-gray-900 dark:text-gray-50 mb-2">Local SEO</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Optimise your online presence for local search results, attracting
            customers in your specific geographical area through local citations,
            business listings, and local search strategies.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white">
        <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Platform Filters — Special Content Niches</p>
        <p className="text-sm text-emerald-50 leading-relaxed mb-3">
          GUESTPOSTLINKS&#39; platform includes special filter options for publishers who
          accept specific types of content. Understanding these filters is essential
          when placing orders on the platform:
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '💊', label: 'Pharmacy', desc: 'Health, pharma & CBD content' },
            { icon: '🎰', label: 'Casino/Gaming', desc: 'Sports betting & casino content' },
            { icon: '🌍', label: 'Foreign Language', desc: 'Multi-language content allowed' },
          ].map(f => (
            <div key={f.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl mb-1">{f.icon}</p>
              <p className="font-bold text-xs">{f.label}</p>
              <p className="text-emerald-100 text-xs mt-0.5 leading-tight">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 2 — Guest Posting
// ─────────────────────────────────────
function GuestPosting() {
  const section = SECTIONS[1]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is Guest Posting?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          Guest Posting is the process of writing and publishing an article on someone
          else&#39;s website or blog. GUESTPOSTLINKS secures guest posts on <strong>reputable
          websites in the client&#39;s niche</strong>, ensuring that the backlinks placed
          within those articles are natural and contextually relevant to the client&#39;s
          industry.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '🎯', label: 'Niche-Relevant', desc: 'Every guest post is placed on a site in or closely related to your niche — Google values contextual relevance.' },
          { icon: '✍️', label: 'Editorial Quality', desc: 'Content is professionally written and meets the editorial standards of the host website.' },
          { icon: '🔗', label: 'Natural Backlinks', desc: 'Links appear naturally within the content — not in footers or sidebars — for maximum SEO value.' },
        ].map(f => (
          <div key={f.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{f.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
          How Guest Posting Works (Step-by-Step)
        </p>
        <div className="space-y-3">
          {[
            { n: '1', title: 'Client Submits Order',   desc: 'You provide your URL, target keyword, and niche. We identify the right websites from our publisher network.' },
            { n: '2', title: 'Site Selection',          desc: 'Our team selects a suitable high-authority website that accepts guest posts in your niche.' },
            { n: '3', title: 'Content Creation',        desc: 'A professional writer creates a high-quality, SEO-optimised article with your backlink placed naturally.' },
            { n: '4', title: 'Editorial Approval',      desc: 'The website reviews and approves the content before publishing — ensuring quality standards are met.' },
            { n: '5', title: 'Live Link Delivered',     desc: 'Once published, you receive the live URL with your backlink. The link builds authority over time.' },
          ].map(s => (
            <div key={s.n} className="flex gap-3">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${GRADIENT[section.color]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>{s.n}</div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{s.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>Key SEO Benefits</p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {[
            'Increases domain authority over time',
            'Improves keyword rankings in search results',
            'Drives referral traffic from host website',
            'Builds brand visibility in your niche',
            'Creates a diverse and natural link profile',
            'Long-lasting, permanent backlinks',
          ].map(b => (
            <li key={b} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <ServiceLink href="https://guestpostlinks.net/guest-posting-service/" label="View Guest Posting Service" color={section.color} />
    </section>
  )
}

// ─────────────────────────────────────
// Section 3 — Niche Edits
// ─────────────────────────────────────
function NicheEdits() {
  const section = SECTIONS[2]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What are Niche Edits?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          Niche Edits (also called <strong>Link Insertions</strong>) involve placing your
          backlink <em>within an existing, already-published article</em> on an established
          website. Instead of creating a brand-new article, we identify relevant content
          that&#39;s already indexed, has existing authority, and insert your link naturally
          into the text — giving you faster and often stronger SEO results.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Guest Posting vs. Niche Edits — What&#39;s the Difference?</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={`${BG['blue']} rounded-xl p-4`}>
            <p className={`${TEXT['blue']} text-xs font-bold mb-2`}>✍️ Guest Posting</p>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
              <li>• New article created from scratch</li>
              <li>• Takes longer (writing + approval)</li>
              <li>• Builds link authority over time</li>
              <li>• Great for brand storytelling</li>
              <li>• Best for long-term strategy</li>
            </ul>
          </div>
          <div className={`${BG[section.color]} rounded-xl p-4`}>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-2`}>🔗 Niche Edits</p>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
              <li>• Link added to existing article</li>
              <li>• Faster turnaround time</li>
              <li>• Instant inherited page authority</li>
              <li>• Existing traffic already flows to page</li>
              <li>• Best for quick SEO wins</li>
            </ul>
          </div>
        </div>
      </div>

      <InfoBox label="Why Existing Articles are More Powerful" color={section.color}>
        When a page has been live for months or years, it has already accumulated{' '}
        <strong>backlinks, traffic, and trust signals</strong> from Google. By inserting
        your link into that page, your website inherits a portion of that existing authority
        immediately — unlike a new guest post that starts with zero history.
      </InfoBox>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '⚡', label: 'Faster Results',   desc: 'Links in established pages can show ranking improvements in weeks, not months.' },
          { icon: '🏛️', label: 'Real Authority',   desc: 'Pages with existing backlinks and traffic pass stronger link equity to your site.' },
          { icon: '🌊', label: 'Traffic Boost',    desc: 'The host page already gets visitors — your link can drive immediate referral traffic.' },
        ].map(f => (
          <div key={f.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{f.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white mb-5">
        <p className="text-violet-100 text-xs font-bold uppercase tracking-widest mb-2">The Goal</p>
        <p className="text-sm text-violet-50 leading-relaxed">
          Both Guest Posting and Niche Edits work together to create a{' '}
          <strong>diverse link profile</strong> — which signals{' '}
          <strong>trustworthiness and relevance</strong> to search engines like Google,
          ultimately improving your site&#39;s ranking for your targeted keywords.
        </p>
      </div>

      <ServiceLink href="https://guestpostlinks.net/niche-edits-service/" label="View Niche Edits Service" color={section.color} />
    </section>
  )
}

// ─────────────────────────────────────
// Section 4 — Local Citation Building (ENRICHED)
// ─────────────────────────────────────
function LocalCitation() {
  const section = SECTIONS[3]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is a Local Citation?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          A <strong>local citation</strong> is any online mention of your business&#39;s core
          details — its <strong>Name, Address, and Phone Number</strong> (commonly called
          <strong> NAP</strong>). These mentions appear in online directories, review sites,
          social platforms, and websites. Google uses citations to verify that your business
          is real, legitimate, and located where you say it is.
        </p>
      </div>

      {/* NAP concept */}
      <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-6 mb-5 text-white">
        <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-3">The NAP Formula</p>
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          {[
            { letter: 'N', word: 'Name',    ex: 'Pizza Palace Ltd',       icon: '🏢' },
            { letter: 'A', word: 'Address', ex: '12 Main St, London',     icon: '📍' },
            { letter: 'P', word: 'Phone',   ex: '+44 20 7946 0800',       icon: '📞' },
          ].map(n => (
            <div key={n.letter} className="bg-white/15 rounded-xl p-3">
              <p className="text-3xl font-black text-white">{n.letter}</p>
              <p className="text-teal-100 text-xs font-bold">{n.word}</p>
              <p className="text-xs text-teal-200 mt-1 leading-tight">{n.icon} {n.ex}</p>
            </div>
          ))}
        </div>
        <p className="text-teal-100 text-sm leading-relaxed">
          Your NAP must be <strong className="text-white">100% identical</strong> across every
          platform. Even small differences (e.g., "Street" vs "St") confuse Google and
          can hurt your local rankings.
        </p>
      </div>

      {/* Types of citations */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Two Types of Citations</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={`${BG[section.color]} rounded-xl p-4`}>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-2`}>📋 Structured Citations</p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 leading-snug">
              Your NAP listed in a <strong>formal business directory</strong> — the most
              common and most powerful type.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Examples:</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {['Google Business Profile', 'Yelp', 'Yellow Pages', 'Foursquare', 'Bing Places', 'Apple Maps', 'TripAdvisor'].map(p => (
                <li key={p} className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-teal-500 flex-shrink-0" />{p}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-gray-700 dark:text-gray-200 text-xs font-bold mb-2">📰 Unstructured Citations</p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 leading-snug">
              Your business mentioned naturally in <strong>blog posts, news articles,
              or forum discussions</strong> — less formal but still valuable.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Examples:</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {['"Best pizza near me" blog round-up', 'Local news article mentioning your business', 'Community forum recommendation', 'Social media mention with location'].map(p => (
                <li key={p} className="flex items-start gap-1"><Star className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* How it helps rankings */}
      <InfoBox label="How Citations Improve Local Rankings" color={section.color}>
        Google&#39;s local algorithm weighs <strong>citation volume and accuracy</strong> heavily.
        The more consistent, accurate mentions your business has across authoritative directories,
        the more confidence Google has in your business&#39;s legitimacy — pushing you higher in
        the <strong>Local Pack</strong> (the map results at the top of local searches).
      </InfoBox>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '📍', label: '"Near Me" Searches',       desc: 'Strong citations help you appear when people search "best [service] near me" on Google.' },
          { icon: '🗺️', label: 'Google Maps / Local Pack', desc: 'Citations are a top-3 ranking factor for the map results shown above organic search listings.' },
          { icon: '✅', label: 'Business Trust Signals',   desc: 'Consistent NAP across 50+ directories tells Google your business is established and trustworthy.' },
          { icon: '🏪', label: 'Foot Traffic & Calls',     desc: 'Accurate listings on Yelp, Google, and Apple Maps directly drive customer calls and visits.' },
        ].map(f => (
          <div key={f.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{f.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      <WarningBox>
        <strong>NAP Consistency is Critical!</strong> If your business is listed as
        "123 High Street" on Google but "123 High St." on Yelp and "123 High St, Suite A"
        on Yellow Pages — Google sees these as THREE different businesses. Always use
        the exact same format everywhere.
      </WarningBox>

      <ServiceLink href="https://guestpostlinks.net/local-citation-building-services/" label="View Local Citation Building Service" color={section.color} />
    </section>
  )
}

// ─────────────────────────────────────
// Section 5 — Press Release Distribution (ENRICHED)
// ─────────────────────────────────────
function PressRelease() {
  const section = SECTIONS[4]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is a Press Release?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          A <strong>press release</strong> (also called a news release) is an official,
          written announcement that a company issues to <strong>journalists, media outlets,
          and news aggregators</strong>. It announces something newsworthy — a product launch,
          partnership, award, or company milestone. GUESTPOSTLINKS distributes your press release
          to hundreds of authoritative news sites, earning you high-DA backlinks and
          widespread brand coverage.
        </p>
      </div>

      {/* Fun analogy */}
      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-700 rounded-2xl p-5 mb-5">
        <p className="text-amber-800 dark:text-amber-200 text-xs font-bold uppercase tracking-widest mb-2">💡 Think of it this way...</p>
        <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">
          Imagine you&#39;ve just opened an exciting new restaurant. Instead of telling people
          one by one, you hire a publicist who sends your story to every newspaper, TV channel,
          and food blog in the city — overnight, hundreds of people know about you.
          <strong> That&#39;s exactly what press release distribution does for your business online.</strong>
        </p>
      </div>

      {/* How distribution works */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">How Press Release Distribution Works</p>
        <div className="space-y-3">
          {[
            { n: '1', title: 'You Share Your News',        desc: 'Provide your announcement — product launch, partnership, award, event, or any newsworthy update.' },
            { n: '2', title: 'We Write the Press Release', desc: 'Our team crafts a professional, keyword-optimised press release in standard journalistic format.' },
            { n: '3', title: 'Distributed to 300+ Sites',  desc: 'Your press release is sent to a network of news sites, wire services, and media outlets.' },
            { n: '4', title: 'Indexed by Google',          desc: 'Each published article creates a backlink to your site — many indexed on Google News for extra visibility.' },
            { n: '5', title: 'Backlinks & Brand Reach',    desc: 'You gain high-DA backlinks from news domains (often DA 50–90+) plus massive brand exposure.' },
          ].map(s => (
            <div key={s.n} className="flex gap-3">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${GRADIENT[section.color]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>{s.n}</div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{s.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What makes good press release */}
      <InfoBox label="What Makes a Good Press Release?" color={section.color}>
        A strong press release answers the classic journalism questions: <strong>Who, What,
        When, Where, Why, and How</strong>. It must be genuinely newsworthy (not just an
        advertisement), written in a professional tone, include a compelling headline,
        and contain a targeted keyword for SEO.
      </InfoBox>

      {/* Types of press releases */}
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '🚀', label: 'Product Launch',       desc: 'Announcing a new product, feature, or service to the market.' },
          { icon: '🤝', label: 'Partnership / Deal',   desc: 'Sharing news of a new business partnership, acquisition, or major contract.' },
          { icon: '🏆', label: 'Award / Recognition',  desc: 'Publicising an industry award, certification, or milestone achievement.' },
          { icon: '📅', label: 'Event / Milestone',    desc: 'Announcing an upcoming event, grand opening, or company anniversary.' },
          { icon: '📊', label: 'Survey / Research',    desc: 'Publishing findings from original industry research or customer surveys.' },
          { icon: '👔', label: 'Executive Hire',       desc: 'Introducing a new C-level hire or significant leadership change.' },
        ].map(t => (
          <div key={t.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-3 flex gap-3`}>
            <p className="text-xl flex-shrink-0">{t.icon}</p>
            <div>
              <p className={`${TEXT[section.color]} text-xs font-bold`}>{t.label}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key benefits */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white mb-5">
        <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-3">Key SEO &amp; Brand Benefits</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            '🔗 High-DA backlinks from major news sites (DA 50–90+)',
            '📰 Potential Google News indexing for extra visibility',
            '🌐 Syndicated to 300+ news outlets simultaneously',
            '📈 Drives referral traffic from news readers',
            '🏷️ Builds brand authority and industry credibility',
            '🎯 Keyword-optimised for better search rankings',
          ].map(b => (
            <p key={b} className="text-sm text-amber-50 flex items-start gap-2">{b}</p>
          ))}
        </div>
      </div>

      <ServiceLink href="https://guestpostlinks.net/press-release-distribution/" label="View Press Release Distribution Service" color={section.color} />
    </section>
  )
}

// ─────────────────────────────────────
// Section 6 — Local SEO
// ─────────────────────────────────────
function LocalSEO() {
  const section = SECTIONS[5]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is Local SEO?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          <strong>Local SEO</strong> is the practice of optimising a business&#39;s online
          presence so it appears prominently in <strong>geographically-relevant searches</strong>.
          It is essential for businesses that operate in specific locations and want to attract
          customers in their city, town, or region — such as restaurants, clinics, law firms,
          plumbers, and retail shops.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '📍', label: '"Near Me" Searches',    desc: 'Appear when potential customers search for your service followed by their location.' },
          { icon: '🗺️', label: 'Google Maps / Pack',   desc: 'Rank in the top-3 map results that appear above organic results for local queries.' },
          { icon: '🏪', label: 'Local Customers',       desc: 'Attract people who are physically near your location and ready to buy or visit.' },
        ].map(f => (
          <div key={f.label} className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4`}>
            <p className="text-2xl mb-2">{f.icon}</p>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Who Needs Local SEO?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            '🍕 Restaurants & cafés', '💆 Salons & spas',
            '⚖️ Law firms & solicitors', '🏥 Clinics & dentists',
            '🔧 Plumbers & electricians', '🏡 Estate agents',
            '🚗 Car dealerships & garages', '🛒 Local retail shops',
          ].map(b => (
            <p key={b} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              {b}
            </p>
          ))}
        </div>
      </div>

      <InfoBox label="How Link Building + Local SEO Work Together" color={section.color}>
        By combining <strong>Link Building</strong> (which builds domain authority) with{' '}
        <strong>Local SEO</strong> (which builds local visibility), GUESTPOSTLINKS helps
        businesses gain the reach they need to grow <strong>both locally and globally</strong>.
        A strong link profile supports your overall domain strength, making local SEO
        efforts even more effective.
      </InfoBox>

      <div className="mb-5">
        <ResourceLink href="https://guestpostlinks.net/local-citation-building-services/" label="Local Citation Building Service — guestpostlinks.net" />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Refund Policy</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          For information about GUESTPOSTLINKS&#39; refund policy, please visit the official refund policy page.
        </p>
        <ResourceLink href="https://guestpostlinks.net/refund-policy/" label="GUESTPOSTLINKS Refund Policy" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 7 — Pharmacy Niche
// ─────────────────────────────────────
function PharmacyNiche() {
  const section = SECTIONS[6]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <Screenshot
        src="/images/lesson26/filter-options.png"
        alt="GUESTPOSTLINKS platform filter options — Pharmacy, Sports/Gaming, Foreign Language"
        caption="Platform filter options for special content niches"
      />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is the Pharmacy Filter?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          The <strong>Pharmacy filter</strong> on the GUESTPOSTLINKS platform is used to
          identify websites and publishers that accept content in the{' '}
          <strong>pharmaceutical, healthcare, and wellness niche</strong>. This includes
          articles about medications, treatments, health advice, supplements — and
          importantly, <strong>CBD products</strong>. Not all websites accept this type
          of content, so this filter helps you find the right publishers quickly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">💊 Pharmaceutical Products</p>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            {['Prescription drugs (e.g., Lisinopril, Metformin)', 'Over-the-counter medications (e.g., Ibuprofen, Aspirin)', 'Vitamins, probiotics, herbal supplements (e.g., Omega-3)', 'Vaccines (COVID-19, Flu, MMR, DTaP)'].map(i => (
              <li key={i} className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />{i}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">🏥 Healthcare Topics</p>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            {['Mental Health & Wellbeing', "Women's Health", 'Chronic Disease Management', 'Cancer Therapies & Pain Management', 'Preventative Care & Lifestyle Tips', 'Public Health & Immunisation'].map(i => (
              <li key={i} className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <Screenshot
        src="/images/lesson26/pharmacy-examples.png"
        alt="Examples of pharmaceutical and healthcare content for guest posting"
        caption="Examples of pharmaceutical content types covered in the Pharmacy niche"
      />

      {/* CBD Section */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 mb-5">
        <p className={`${TEXT[section.color]} text-sm font-bold uppercase tracking-widest mb-3`}>CBD — A Key Part of the Pharmacy Niche</p>

        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed mb-4">
          <strong>CBD (Cannabidiol)</strong> is a compound found naturally in the{' '}
          <em>Cannabis sativa</em> plant (also known as hemp). Unlike{' '}
          <strong>THC (tetrahydrocannabinol)</strong>, which produces a psychoactive
          &#34;high&#34;, CBD is <strong>non-intoxicating</strong> and is used widely
          for its potential health benefits.
        </p>

        <Screenshot
          src="/images/lesson26/cbd-overview.png"
          alt="CBD cannabidiol overview — non-intoxicating compound from Cannabis sativa"
          caption="CBD is non-psychoactive and widely used in wellness products"
        />

        <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Research suggests CBD may help with:</p>
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {[
            { icon: '💪', label: 'Pain Relief',         desc: 'May interact with the endocannabinoid system to regulate pain.' },
            { icon: '😌', label: 'Anxiety & Depression', desc: 'Some studies show CBD may reduce symptoms of anxiety and depression.' },
            { icon: '😴', label: 'Sleep Disorders',      desc: 'CBD may improve sleep quality for some individuals.' },
            { icon: '⚡', label: 'Epilepsy',             desc: 'Epidiolex — a prescription CBD medication — is FDA-approved for certain epilepsy types.' },
          ].map(b => (
            <div key={b.label} className={`${BG['rose']} rounded-lg p-2.5 flex gap-2`}>
              <p className="text-base flex-shrink-0">{b.icon}</p>
              <div>
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">{b.label}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Common CBD Product Forms:</p>
        <Screenshot
          src="/images/lesson26/cbd-products.png"
          alt="CBD product forms — oils, capsules, gummies, topicals, vapes"
          caption="CBD comes in many forms including oils, capsules, gummies, and topicals"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { icon: '🧴', form: 'CBD Oil',      desc: 'Most common — derived from hemp' },
            { icon: '💊', form: 'CBD Capsules', desc: 'Measured doses in capsule form' },
            { icon: '🍬', form: 'CBD Gummies',  desc: 'Convenient and enjoyable way to consume' },
            { icon: '🧪', form: 'CBD Topicals', desc: 'Creams, lotions for localised relief' },
            { icon: '💨', form: 'CBD Vapes',    desc: 'Inhaled CBD vapour for fast effect' },
          ].map(p => (
            <div key={p.form} className="bg-white dark:bg-gray-900 rounded-lg p-2.5 text-center">
              <p className="text-lg">{p.icon}</p>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{p.form}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 8 — Casino & Gaming Niche
// ─────────────────────────────────────
function CasinoGaming() {
  const section = SECTIONS[7]
  const casinoPlatforms = ['Bet365', '888 Casino', 'LeoVegas', 'Casumo', 'Unibet', 'PokerStars Casino', 'PartyCasino', 'Betway Casino', 'Spin Casino', 'Royal Panda', 'Mr Green']
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is the Casino &amp; Gaming Filter?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          The <strong>Sports/Gaming filter</strong> on the GUESTPOSTLINKS platform identifies
          websites that accept <strong>casino, sports betting, and online gambling content</strong>.
          Since many websites do not allow gambling-related articles, this filter helps
          clients quickly locate the publishers who do — ensuring compliance with each
          publisher&#39;s editorial guidelines.
        </p>
      </div>

      <Screenshot
        src="/images/lesson26/casino-gaming.png"
        alt="Casino and Gaming niche filter on GUESTPOSTLINKS platform"
        caption="The Casino/Gaming filter identifies publishers that accept gambling-related content"
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">What is a Casino?</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          A casino is a facility (physical or online) where various types of{' '}
          <strong>gambling activities</strong> take place. It offers games of both chance
          and skill — and may also offer entertainment, dining, and accommodation.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🎰', label: 'Slot Machines',   desc: 'Electronic games where players spin reels hoping to match symbols for a payout.' },
            { icon: '🃏', label: 'Table Games',     desc: 'Poker, blackjack, baccarat, and roulette — card and wheel-based betting games.' },
            { icon: '⚽', label: 'Sports Betting',  desc: 'Betting on outcomes of sports events like football, basketball, or horse racing.' },
            { icon: '💻', label: 'Online Casinos',  desc: 'Digital platforms offering virtual versions of traditional games with live dealers.' },
            { icon: '👑', label: 'VIP Programs',    desc: 'Loyalty programmes for high rollers offering exclusive perks, cashback, and rewards.' },
          ].map(c => (
            <div key={c.label} className={`${BG[section.color]} rounded-xl p-3 flex gap-3`}>
              <p className="text-lg flex-shrink-0">{c.icon}</p>
              <div>
                <p className={`${TEXT[section.color]} text-xs font-bold`}>{c.label}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* International casino terms */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">International Casino Terms You Should Know</p>
        <div className="space-y-2.5">
          {[
            { term: 'Jackpot',     def: 'A large cash prize, especially in slot machines or lotteries.' },
            { term: 'House Edge',  def: "The mathematical advantage the casino has over players — ensures long-term profitability for the house." },
            { term: 'High Roller', def: 'A gambler who consistently wagers large sums of money.' },
            { term: 'Pit Boss',    def: 'A casino employee who oversees the gaming area, ensures fairness, and resolves disputes.' },
            { term: 'Comp Points', def: 'Complimentary points earned through play — redeemable for meals, hotel stays, or cash.' },
            { term: 'Whale',       def: 'An extremely high-stakes gambler, often receiving special VIP treatment from the casino.' },
          ].map(t => (
            <div key={t.term} className={`${BG[section.color]} rounded-lg p-3 flex gap-3`}>
              <p className={`${TEXT[section.color]} text-xs font-bold w-24 flex-shrink-0 pt-0.5`}>{t.term}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{t.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Online casino platforms */}
      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-xl p-4 mb-4`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-3`}>Well-Known Online Casino Platforms</p>
        <div className="flex flex-wrap gap-2">
          {casinoPlatforms.map(p => (
            <span key={p} className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">{p}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Section 9 — Foreign Language Niche
// ─────────────────────────────────────
function ForeignLanguage() {
  const section = SECTIONS[8]
  return (
    <section id={section.id}>
      <SectionHeader section={section} />

      <div className={`${BG[section.color]} ${BORDER[section.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[section.color]} text-xs font-bold uppercase tracking-widest mb-2`}>What is the Foreign Language Filter?</p>
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">
          The <strong>Foreign Language filter</strong> identifies websites on the
          GUESTPOSTLINKS platform that accept content published in{' '}
          <strong>languages other than the website&#39;s primary language</strong>.
          This filter is for clients who need to place content in a specific
          language on a site whose main language is different.
        </p>
      </div>

      <Screenshot
        src="/images/lesson26/foreign-language.png"
        alt="Foreign Language content filter on GUESTPOSTLINKS platform"
        caption="The Foreign Language filter finds publishers that accept multi-language content"
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Real Example: artdaily.com</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          Consider <strong>artdaily.com</strong> — a website where the majority of articles
          are published in English. However, they also allow content to be published in
          Italian, Spanish, Thai, and German. This makes it a &quot;Foreign Language allowed&quot;
          website for those non-English content orders.
        </p>
        <div className="space-y-2">
          <div className={`${BG[section.color]} rounded-xl p-3`}>
            <p className={`${TEXT[section.color]} text-xs font-bold mb-1`}>🇬🇧 English (Website&#39;s Primary Language)</p>
            <a href="https://artdaily.com/news/170012/Mobile-Magic--Discover-the-Exciting-World-of-Phone-Casinos-in-Europe"
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline break-all">
              artdaily.com/news/170012/Mobile-Magic--Discover-the-Exciting-World-of-Phone-Casinos-in-Europe
            </a>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-gray-600 dark:text-gray-300 text-xs font-bold mb-1">🇮🇹 Italian (Foreign Language — Other Language)</p>
            <a href="https://artdaily.com/news/170013/Capire-le-Statistiche-di--Crazy-Time---Un-Vantaggio-per-i-Giocatori"
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline break-all">
              artdaily.com/news/170013/Capire-le-Statistiche-di--Crazy-Time---Un-Vantaggio-per-i-Giocatori
            </a>
          </div>
        </div>
      </div>

      <WarningBox>
        <strong>Important to remember:</strong> If a website&#39;s <em>primary</em> language
        is Spanish and you receive an order for Spanish content — that is{' '}
        <strong>NOT a foreign language order</strong>. The foreign language filter only
        applies when you are placing content in a language <em>different</em> from
        the website&#39;s main language. For example: posting Italian content on an
        English-language website = foreign language order.
      </WarningBox>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: '✅', label: 'IS a Foreign Language Order',    desc: 'English website, Italian article → Foreign Language filter applies.', green: true },
          { icon: '❌', label: 'NOT a Foreign Language Order',   desc: "Spanish website, Spanish article → No filter needed, it's the native language.", green: false },
          { icon: '✅', label: 'IS a Foreign Language Order',    desc: 'English website, German article → Foreign Language filter applies.', green: true },
          { icon: '❌', label: 'NOT a Foreign Language Order',   desc: "French website, French article → No filter needed, it's the native language.", green: false },
        ].map((ex, i) => (
          <div key={i} className={`${ex.green ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'} border rounded-xl p-3`}>
            <p className={`${ex.green ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'} text-xs font-bold mb-1`}>{ex.icon} {ex.label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{ex.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Main export
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  ServicesOverview, GuestPosting, NicheEdits, LocalCitation,
  PressRelease, LocalSEO, PharmacyNiche, CasinoGaming, ForeignLanguage,
]

export default function Lesson26KeyServices() {
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
      <div className="bg-gradient-to-br from-blue-700 via-teal-600 to-emerald-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Module 3 · Lesson 26</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Key Services: Link Building &amp; Local SEO</h1>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xl">
            A deep dive into the core services GUESTPOSTLINKS offers — from guest posting and
            niche edits to local citation building, press release distribution, and local SEO.
            Plus, learn about the platform&#39;s special content niche filters.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-blue-100 flex-wrap">
            <span>🔗 4 Link Building Services</span>
            <span>📍 Local SEO</span>
            <span>🎯 3 Special Niche Filters</span>
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

        {/* Content */}
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

          {/* All sections */}
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
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 rounded-2xl border border-blue-100 dark:border-blue-900 p-8">
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-2">Lesson Summary</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">What you&#39;ve covered in this lesson:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {SECTIONS.map((s, i) => {
                const SectionIcon = s.Icon
                return (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-900 transition text-left group">
                    <div className={`w-8 h-8 ${BG[s.color]} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <SectionIcon className={`w-4 h-4 ${TEXT[s.color]}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">{s.label}</p>
                    </div>
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
