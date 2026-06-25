'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  AlertOctagon, Activity, TrendingUp, Trophy, Layers,
  Search, PieChart, Link, RefreshCw, MapPin, Tag, Layout, Zap,
  BookOpen, ExternalLink, AlertTriangle, Check, Info,
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
  { id: 'keyword-cannibalization', label: 'Keyword Cannibalization', shortLabel: 'K. Cannibalization', color: 'orange',  Icon: AlertOctagon },
  { id: 'keyword-density',         label: 'Keyword Density',         shortLabel: 'Keyword Density',    color: 'blue',    Icon: Activity     },
  { id: 'keyword-difficulty',      label: 'Keyword Difficulty',      shortLabel: 'K. Difficulty',      color: 'red',     Icon: TrendingUp   },
  { id: 'keyword-ranking',         label: 'Keyword Ranking',         shortLabel: 'Keyword Ranking',    color: 'emerald', Icon: Trophy       },
  { id: 'keyword-stuffing',        label: 'Keyword Stuffing',        shortLabel: 'Keyword Stuffing',   color: 'rose',    Icon: Layers       },
  { id: 'keyword-research',        label: 'Keyword Research',        shortLabel: 'Keyword Research',   color: 'violet',  Icon: Search       },
  { id: 'keyword-analysis',        label: 'Keyword Analysis',        shortLabel: 'Keyword Analysis',   color: 'indigo',  Icon: PieChart     },
  { id: 'link-building',           label: 'Link Building',           shortLabel: 'Link Building',      color: 'teal',    Icon: Link         },
  { id: 'link-exchange',           label: 'Link Exchange',           shortLabel: 'Link Exchange',      color: 'cyan',    Icon: RefreshCw    },
  { id: 'local-citation',          label: 'Local Citation',          shortLabel: 'Local Citation',     color: 'amber',   Icon: MapPin       },
  { id: 'long-tail-keyword',       label: 'Long-tail Keyword',       shortLabel: 'Long-tail KW',       color: 'purple',  Icon: Tag          },
  { id: 'landing-page',            label: 'Landing Page',            shortLabel: 'Landing Page',       color: 'sky',     Icon: Layout       },
  { id: 'link-juice',              label: 'Link Juice',              shortLabel: 'Link Juice',         color: 'green',   Icon: Zap          },
]

// ─────────────────────────────────────
// Color maps (all 13 colors)
// ─────────────────────────────────────
const BG: Record<string, string> = {
  orange:  'bg-orange-100 dark:bg-orange-900/40',
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  red:     'bg-red-100 dark:bg-red-900/40',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  rose:    'bg-rose-100 dark:bg-rose-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
  cyan:    'bg-cyan-100 dark:bg-cyan-900/40',
  amber:   'bg-amber-100 dark:bg-amber-900/40',
  purple:  'bg-purple-100 dark:bg-purple-900/40',
  sky:     'bg-sky-100 dark:bg-sky-900/40',
  green:   'bg-green-100 dark:bg-green-900/40',
}

const TEXT: Record<string, string> = {
  orange:  'text-orange-700 dark:text-orange-300',
  blue:    'text-blue-700 dark:text-blue-300',
  red:     'text-red-700 dark:text-red-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  rose:    'text-rose-700 dark:text-rose-300',
  violet:  'text-violet-700 dark:text-violet-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  teal:    'text-teal-700 dark:text-teal-300',
  cyan:    'text-cyan-700 dark:text-cyan-300',
  amber:   'text-amber-700 dark:text-amber-300',
  purple:  'text-purple-700 dark:text-purple-300',
  sky:     'text-sky-700 dark:text-sky-300',
  green:   'text-green-700 dark:text-green-300',
}

const BORDER: Record<string, string> = {
  orange:  'border-orange-200 dark:border-orange-700',
  blue:    'border-blue-200 dark:border-blue-700',
  red:     'border-red-200 dark:border-red-700',
  emerald: 'border-emerald-200 dark:border-emerald-700',
  rose:    'border-rose-200 dark:border-rose-700',
  violet:  'border-violet-200 dark:border-violet-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  teal:    'border-teal-200 dark:border-teal-700',
  cyan:    'border-cyan-200 dark:border-cyan-700',
  amber:   'border-amber-200 dark:border-amber-700',
  purple:  'border-purple-200 dark:border-purple-700',
  sky:     'border-sky-200 dark:border-sky-700',
  green:   'border-green-200 dark:border-green-700',
}

const GRADIENT: Record<string, string> = {
  orange:  'from-orange-500 to-red-500',
  blue:    'from-blue-500 to-indigo-500',
  red:     'from-red-500 to-rose-600',
  emerald: 'from-emerald-500 to-teal-500',
  rose:    'from-rose-500 to-pink-600',
  violet:  'from-violet-500 to-purple-600',
  indigo:  'from-indigo-500 to-blue-600',
  teal:    'from-teal-500 to-cyan-600',
  cyan:    'from-cyan-500 to-sky-500',
  amber:   'from-amber-500 to-orange-500',
  purple:  'from-purple-500 to-violet-600',
  sky:     'from-sky-400 to-blue-500',
  green:   'from-green-500 to-emerald-500',
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
      className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 transition group">
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

// ─────────────────────────────────────
// Individual term sections
// ─────────────────────────────────────

function KeywordCannibalization() {
  const term = TERMS[0]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Cannibalization</strong> happens when multiple pages on your website
        compete for the <strong>same or similar keywords</strong>. This can confuse search
        engines and potentially dilute the relevance of each page, hurting your overall
        SEO performance.
      </DefinitionCard>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '😵', title: 'Confuses Search Engines', desc: "Google can't decide which of your pages to rank for the keyword, so it may rank none of them well." },
          { icon: '📉', title: 'Dilutes Page Authority', desc: 'Instead of one strong page, you have two weak pages splitting the backlinks and authority.' },
          { icon: '🔗', title: 'Splits Link Equity', desc: 'External sites may link to different versions of your page, weakening the power of each.' },
          { icon: '🏆', title: 'Wrong Page Ranks', desc: 'A low-value page might outrank your best content for the target keyword.' },
        ].map(c => (
          <div key={c.title} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{c.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{c.title}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <InfoBox label="Example" color={term.color}>
        If you have two blog posts — <strong>"Best Running Shoes"</strong> and{' '}
        <strong>"Top Running Shoes for Beginners"</strong> — both targeting the keyword{' '}
        <em>running shoes</em>, they compete against each other. Google may rank neither
        well, when you would be better off combining them into one authoritative page.
      </InfoBox>

      <Screenshot
        src="/images/lesson17/keyword-cannibalization.png"
        alt="Keyword cannibalization example"
        caption="Multiple pages competing for the same keyword weaken each other's SEO performance"
      />

      <ResourceLink
        href="https://ahrefs.com/blog/keyword-cannibalization/"
        label="Read the full Ahrefs guide on Keyword Cannibalization →"
      />
    </section>
  )
}

function KeywordDensity() {
  const term = TERMS[1]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Density</strong> is the percentage of times a keyword appears on a
        webpage compared to the total number of words on that page. Overuse of a keyword
        can lead to <em>keyword stuffing</em>, which search engines may penalise.
      </DefinitionCard>

      <InfoBox label="Example" color={term.color}>
        {"Let's say you have a 500-word article on "}
        <strong>"digital marketing"</strong>
        {" and the keyword appears 10 times."}
      </InfoBox>

      {/* Formula card */}
      <div className="bg-gray-900 rounded-2xl p-5 mb-5 font-mono">
        <p className="text-gray-400 text-xs mb-3 font-sans">Formula</p>
        <p className="text-green-400 text-sm mb-2">
          Keyword Density = (Keyword appearances / Total words) &times; 100
        </p>
        <p className="text-gray-300 text-sm mb-1">
          Keyword Density = (10 / 500) &times; 100
        </p>
        <p className="text-yellow-400 text-sm font-bold">= 2%</p>
        <p className="text-gray-500 text-xs mt-3 font-sans">
          The keyword "digital marketing" appears in 2% of the total content.
        </p>
      </div>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl px-4 py-3 mb-5 flex gap-3 items-start`}>
        <Check className={`w-4 h-4 ${TEXT[term.color]} flex-shrink-0 mt-0.5`} />
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          <strong>SEO best practice:</strong> Aim for a natural keyword density of{' '}
          <strong>1–3%</strong>. This ensures readability while maintaining relevance
          for search engines. Going above this risks a keyword stuffing penalty.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <Screenshot
          src="/images/lesson17/keyword-density-1.png"
          alt="Keyword density tool screenshot"
          caption="Keyword density checker tool result"
        />
        <Screenshot
          src="/images/lesson17/keyword-density-2.png"
          alt="Keyword density analysis example"
          caption="Keyword frequency analysis in action"
        />
      </div>

      <div className="mb-2">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
          How to check Keyword Density — free tools:
        </p>
        <div className="space-y-2">
          <ResourceLink href="https://www.seoreviewtools.com/keyword-density-checker/" label="SEO Review Tools — Keyword Density Checker" />
          <ResourceLink href="https://smallseotools.com/keyword-density-checker/" label="Small SEO Tools — Keyword Density Checker" />
          <ResourceLink href="https://checkserp.com/keyword-density-checker/" label="CheckSERP — Keyword Density Checker" />
        </div>
      </div>
    </section>
  )
}

function KeywordDifficulty() {
  const term = TERMS[2]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Difficulty (KD)</strong> is a metric that estimates how hard it
        would be to rank for a particular keyword in organic search results. It takes into
        account factors such as <strong>search volume</strong>, <strong>competition</strong>,
        and <strong>domain authority</strong>.
      </DefinitionCard>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Search Volume', desc: 'How many people search for this keyword per month. Higher volume = more competition.', icon: '🔍' },
          { label: 'Competition',   desc: 'How many other websites are targeting the same keyword and how strong they are.',        icon: '⚔️' },
          { label: 'Domain Authority', desc: 'The overall strength and trustworthiness of the domains currently ranking for it.', icon: '🏛️' },
        ].map(f => (
          <div key={f.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4 text-center`}>
            <p className="text-2xl mb-2">{f.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{f.label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        {[
          { range: '0–30', label: 'Easy', bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300' },
          { range: '31–70', label: 'Medium', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
          { range: '71–100', label: 'Hard', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300' },
        ].map(kd => (
          <div key={kd.label} className={`${kd.bg} rounded-xl py-3 px-2`}>
            <p className={`${kd.text} text-lg font-bold`}>{kd.range}</p>
            <p className={`${kd.text} text-xs font-semibold`}>{kd.label}</p>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson17/keyword-difficulty-1.png"
        alt="Keyword difficulty score on Ahrefs"
        caption="Keyword Difficulty score shown in Ahrefs — the higher the number, the harder it is to rank"
      />
      <Screenshot
        src="/images/lesson17/keyword-difficulty-2.png"
        alt="Keyword difficulty comparison chart"
        caption="Comparing keyword difficulty across multiple keywords"
      />

      <ResourceLink
        href="https://ahrefs.com/keyword-difficulty"
        label="Check Keyword Difficulty on Ahrefs (free tool) →"
      />
    </section>
  )
}

function KeywordRanking() {
  const term = TERMS[3]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Ranking</strong> refers to a {"website's"} position in search engine
        results for a specific keyword. The goal of SEO is to improve a {"website's"} keyword
        ranking, getting it as close to the <strong>top of the first page</strong> of search
        results as possible.
      </DefinitionCard>

      <div className="space-y-2 mb-5">
        {[
          { pos: '#1', label: 'Gets ~28% of all clicks for that keyword', highlight: true },
          { pos: '#2', label: 'Gets ~15% of all clicks', highlight: false },
          { pos: '#3', label: 'Gets ~11% of all clicks', highlight: false },
          { pos: '#4–10', label: 'Share the remaining clicks on page 1', highlight: false },
          { pos: 'Page 2+', label: 'Gets less than 1% of all clicks', highlight: false },
        ].map(r => (
          <div key={r.pos} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
            r.highlight
              ? `${BG[term.color]} ${BORDER[term.color]}`
              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'
          }`}>
            <span className={`font-mono font-bold text-sm w-14 flex-shrink-0 ${r.highlight ? TEXT[term.color] : 'text-gray-500 dark:text-gray-400'}`}>{r.pos}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{r.label}</span>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson17/keyword-ranking.png"
        alt="Keyword ranking in SERP"
        caption="A website's keyword ranking determines how much organic traffic it receives"
      />

      <ResourceLink
        href="https://ahrefs.com/seo/glossary/keyword-ranking"
        label="Read more about Keyword Ranking on Ahrefs →"
      />
    </section>
  )
}

function KeywordStuffing() {
  const term = TERMS[4]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Stuffing</strong> is an outdated and penalised SEO technique where
        a keyword or phrase is used <strong>excessively</strong> in a {"webpage's"} content,
        meta tags, alt tags, and more. This results in a poor user experience and can lead
        to your site being <strong>penalised or banned</strong> from search results entirely.
      </DefinitionCard>

      <WarningBox>
        <strong>Google penalises keyword stuffing.</strong> Pages that use this technique
        may see a dramatic drop in rankings or be completely removed from search results.
        Always write naturally for your audience, not for search engines.
      </WarningBox>

      {/* Keywords definition callout */}
      <div className="flex gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-5">
        <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          <strong>What are Keywords?</strong> Keywords are words or phrases that describe
          the content on your page. They are the terms that searchers enter into search
          engines and they play a vital role in determining which pages are relevant to
          those queries.
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        In the image below, you can see <strong>"Red Apples"</strong> mentioned multiple
        times — this is a clear example of keyword stuffing:
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Screenshot
          src="/images/lesson17/keyword-stuffing-1.png"
          alt="Example of keyword stuffing with Red Apples"
          caption="'Red Apples' repeated unnaturally — classic keyword stuffing"
        />
        <Screenshot
          src="/images/lesson17/keyword-stuffing-2.png"
          alt="Keyword stuffing example 2"
          caption="Another example of over-optimised keyword usage"
        />
      </div>
    </section>
  )
}

function KeywordResearch() {
  const term = TERMS[5]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Research</strong> is a fundamental SEO task that involves identifying
        popular words and phrases people enter into search engines. The goal is to figure out
        what to rank for by understanding the queries your target audience is searching.
      </DefinitionCard>

      <div className="space-y-3 mb-5">
        {[
          { step: '1', title: 'Identify Topics', desc: 'Start with broad topics relevant to your business or content area.' },
          { step: '2', title: 'Find Keywords', desc: 'Use tools like Ahrefs, Google Keyword Planner, or Ubersuggest to find keywords within those topics.' },
          { step: '3', title: 'Analyse Metrics', desc: 'Check search volume, keyword difficulty, and competition for each keyword.' },
          { step: '4', title: 'Choose Strategically', desc: 'Target a mix of high-volume broad terms and lower-competition long-tail keywords.' },
        ].map(s => (
          <div key={s.step} className="flex gap-4 items-start">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${GRADIENT[term.color]} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{s.step}</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-50 text-sm mb-0.5">{s.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl px-4 py-3`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-1`}>Why it matters at AMRYTT MEDIA</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          Every piece of content we create — blog posts, guest posts, landing pages —
          starts with keyword research. Targeting the right keywords means our {"clients'"} content
          reaches the right people at the right time.
        </p>
      </div>
    </section>
  )
}

function KeywordAnalysis() {
  const term = TERMS[6]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Keyword Analysis</strong> is the process of researching, evaluating, and
        selecting keywords that are relevant to a {"website's"} content and target audience.
        It involves assessing factors such as <strong>search volume</strong>,{' '}
        <strong>competition</strong>, and <strong>relevance</strong> to determine the
        potential value and effectiveness of specific keywords for SEO and content
        optimisation.
      </DefinitionCard>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { factor: 'Search Volume', icon: '📊', desc: 'How many people search for this keyword each month. High volume = more potential traffic.' },
          { factor: 'Competition',   icon: '🥊', desc: 'How many competing pages are targeting the same keyword. Low competition = easier to rank.' },
          { factor: 'Relevance',     icon: '🎯', desc: 'How closely the keyword matches your content and what your audience is actually looking for.' },
        ].map(f => (
          <div key={f.factor} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-2">{f.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{f.factor}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <InfoBox label="How it differs from Keyword Research" color={term.color}>
        <strong>Keyword Research</strong> finds potential keywords.{' '}
        <strong>Keyword Analysis</strong> goes deeper — it evaluates and scores those keywords
        to decide which ones are actually worth targeting based on your {"site's"} current authority
        and business goals.
      </InfoBox>
    </section>
  )
}

function LinkBuilding() {
  const term = TERMS[7]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Link Building</strong> is the process of acquiring high-quality{' '}
        <strong>inbound links</strong> from other websites to your own. It is a key factor
        in SEO, as search engines use links to determine a {"page's"} value and relevance.
      </DefinitionCard>

      <div className="space-y-3 mb-5">
        {[
          { type: 'Guest Posting',        icon: '✍️', desc: "Write an article for another site and include a link back to yours — this is AMRYTT MEDIA's core service." },
          { type: 'Broken Link Building', icon: '🔗', desc: "Find broken links on other sites and suggest your content as a replacement." },
          { type: 'Resource Pages',       icon: '📄', desc: "Get listed on 'useful resources' or 'recommended reading' pages in your niche." },
          { type: 'Digital PR',           icon: '📰', desc: "Create newsworthy content that journalists and bloggers naturally link to." },
        ].map(m => (
          <div key={m.type} className="flex gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <span className="text-xl flex-shrink-0">{m.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-50 text-sm mb-0.5">{m.type}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl px-4 py-3`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-1`}>Quality over quantity</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          One link from a high-authority site like <strong>Forbes</strong> or{' '}
          <strong>HubSpot</strong> is worth far more than 100 links from unknown,
          low-quality websites. Always prioritise relevance and domain authority.
        </p>
      </div>
    </section>
  )
}

function LinkExchange() {
  const term = TERMS[8]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Link Exchange</strong> is an agreement between two webmasters where each
        agrees to link to the {"other's"} website. While it can be a legitimate practice,{' '}
        <strong>excessive and irrelevant link exchanges</strong> can be viewed as a link
        scheme and may be penalised by Google.
      </DefinitionCard>

      <div className="flex gap-6 items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-5">
        <div className={`${BG[term.color]} rounded-lg px-4 py-2 text-center`}>
          <p className={`${TEXT[term.color]} text-xs font-bold`}>Site A</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Links to Site B</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg">⇄</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Exchange</span>
        </div>
        <div className={`${BG[term.color]} rounded-lg px-4 py-2 text-center`}>
          <p className={`${TEXT[term.color]} text-xs font-bold`}>Site B</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Links to Site A</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-green-700 dark:text-green-300 text-xs font-bold mb-2">✅ Acceptable</p>
          <ul className="space-y-1.5">
            {[
              'Two related niche sites exchanging topically relevant links',
              'Partners or collaborators naturally linking to each other',
              'Occasional, contextual, editorial link swaps',
            ].map(i => <li key={i} className="text-xs text-green-700 dark:text-green-300 leading-relaxed">• {i}</li>)}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-300 text-xs font-bold mb-2">❌ Avoid</p>
          <ul className="space-y-1.5">
            {[
              'Mass link exchange schemes with unrelated websites',
              '"Link for a link" networks at scale',
              'Exchanges with low-quality or spammy sites',
            ].map(i => <li key={i} className="text-xs text-red-700 dark:text-red-300 leading-relaxed">• {i}</li>)}
          </ul>
        </div>
      </div>

      <WarningBox>
        Google's guidelines state that excessive link exchanges — especially those done
        purely to manipulate PageRank — qualify as a <strong>link scheme</strong> and can
        result in a manual action penalty.
      </WarningBox>
    </section>
  )
}

function LocalCitation() {
  const term = TERMS[9]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Local Citation</strong> is a mention of your {"business's"}{' '}
        <strong>Name, Address, and Phone number (NAP)</strong> on other websites. Citations
        can come from directories, social media profiles, or any other websites. They are a
        key ranking factor for <strong>local SEO</strong>.
      </DefinitionCard>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>NAP — The Three Components</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { letter: 'N', word: 'Name', ex: 'AMRYTT MEDIA LLC' },
            { letter: 'A', word: 'Address', ex: '123 Main St, New York' },
            { letter: 'P', word: 'Phone', ex: '+1 (800) 000-0000' },
          ].map(c => (
            <div key={c.letter} className="text-center">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${GRADIENT[term.color]} text-white font-bold text-lg flex items-center justify-center mx-auto mb-1`}>{c.letter}</div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{c.word}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.ex}</p>
            </div>
          ))}
        </div>
      </div>

      <InfoBox label="Types of Citation Sources" color={term.color}>
        <ul className="space-y-1 mt-1">
          {[
            'Business directories (Google Business Profile, Yelp, Yellow Pages)',
            'Social media profiles (Facebook, LinkedIn, Instagram)',
            'Industry-specific directories (local chambers of commerce)',
            'Review sites (TripAdvisor, Trustpilot)',
          ].map(s => <li key={s} className="text-sm">• {s}</li>)}
        </ul>
      </InfoBox>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Example of a business listed on a local citation directory:
      </p>
      <Screenshot
        src="/images/lesson17/local-citation.png"
        alt="Local citation example on JustDial"
        caption="A business listing on JustDial — a local citation directory"
      />
      <ResourceLink
        href="https://www.justdial.com/Mumbai/search?q=Sterling-Banquets&stype=company_list"
        label="View Local Citation Example on JustDial →"
      />
    </section>
  )
}

function LongTailKeyword() {
  const term = TERMS[10]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Long-tail Keywords</strong> are highly-specific search phrases with{' '}
        <strong>three or more words</strong>. They are typically less competitive than
        shorter, more generic keywords, making them valuable for SEO — especially for
        targeting users with a <strong>clear purchasing intent</strong>.
      </DefinitionCard>

      {/* Short vs long-tail comparison */}
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Short / Broad Keyword</p>
          <p className="text-base font-mono font-bold text-gray-900 dark:text-gray-50 mb-3">"dog food"</p>
          <ul className="space-y-1.5">
            {[
              { icon: '🔴', text: 'Very high competition' },
              { icon: '🔴', text: 'Vague search intent' },
              { icon: '🔴', text: 'Hard to rank for' },
              { icon: '🔴', text: 'Low conversion rate' },
            ].map(b => <li key={b.text} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><span>{b.icon}</span>{b.text}</li>)}
          </ul>
        </div>
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
          <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-2`}>Long-tail Keyword</p>
          <p className="text-base font-mono font-bold text-gray-900 dark:text-gray-50 mb-3">"how to make dog food at home"</p>
          <ul className="space-y-1.5">
            {[
              { icon: '🟢', text: 'Lower competition' },
              { icon: '🟢', text: 'Specific user intent' },
              { icon: '🟢', text: 'Easier to rank for' },
              { icon: '🟢', text: 'Higher conversion rate' },
            ].map(g => <li key={g.text} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200"><span>{g.icon}</span>{g.text}</li>)}
          </ul>
        </div>
      </div>

      <InfoBox label="Explanation" color={term.color}>
        While the keyword <strong>"dog food"</strong> is very broad and competitive, the
        long-tail keyword <strong>"how to make dog food at home"</strong> is more specific,
        targeting users who are looking to make dog food at home. This precision helps
        attract <strong>highly relevant traffic</strong> with a clear purchasing intent.
      </InfoBox>

      <Screenshot
        src="/images/lesson17/long-tail-keyword.png"
        alt="Long-tail keyword example"
        caption="Long-tail keywords are longer, more specific phrases that capture targeted intent"
      />
    </section>
  )
}

function LandingPage() {
  const term = TERMS[11]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Landing Page</strong> is a webpage specifically designed to receive traffic
        from specific sources — such as search engines, paid ads, or social media — and to
        prompt a <strong>specific action</strong> from visitors, such as making a purchase
        or signing up for a newsletter.
      </DefinitionCard>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <InfoBox label="Traffic Sources" color={term.color}>
          <ul className="space-y-1">
            {['Google Ads (PPC)', 'Organic search (SEO)', 'Social media campaigns', 'Email marketing links'].map(s => (
              <li key={s} className="flex items-center gap-2 text-sm"><span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${GRADIENT[term.color]} flex-shrink-0`} />{s}</li>
            ))}
          </ul>
        </InfoBox>
        <InfoBox label="Desired Actions (CTAs)" color={term.color}>
          <ul className="space-y-1">
            {['Buy now / Add to cart', 'Sign up for a newsletter', 'Request a free quote', 'Download an ebook'].map(a => (
              <li key={a} className="flex items-center gap-2 text-sm"><span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${GRADIENT[term.color]} flex-shrink-0`} />{a}</li>
            ))}
          </ul>
        </InfoBox>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Example of a landing page:</p>
      <Screenshot
        src="/images/lesson17/landing-page.png"
        alt="Landing page example"
        caption="A well-designed landing page has one goal — converting visitors into leads or customers"
      />
    </section>
  )
}

function LinkJuice() {
  const term = TERMS[12]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Link Juice</strong> refers to the <strong>value or authority</strong> passed
        from one webpage to another through hyperlinks. When a high-authority website links
        to your website, it passes "link juice," which can improve your {"site's"} search engine
        ranking. Search engines consider these links as{' '}
        <strong>votes of confidence</strong>, indicating that your content is trustworthy
        and relevant.
      </DefinitionCard>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>Real-world Example</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-center flex-1">
            <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">BBC.com</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">High-authority news outlet</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">DA: 95+</p>
          </div>
          <div className="flex flex-col items-center">
            <Zap className={`w-5 h-5 ${TEXT[term.color]} mb-1`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">Link juice flows</span>
            <span className="text-lg">→</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-center flex-1">
            <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">Your Article</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">"Climate Change Research"</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">Authority boosted ↑</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-4 leading-relaxed">
          If a major news outlet like <strong>BBC.com</strong> links to your article about
          climate change, the link juice from BBC (a high-authority website) boosts your
          {"website's"} credibility and can improve its ranking in search results.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'More juice from',    desc: 'High-DA sites, topically relevant pages, links placed in body content (not footer)' },
          { label: 'Less juice from',   desc: 'Low-DA sites, unrelated topics, links in sidebars, footers, or nofollow-tagged links' },
          { label: 'Blocked juice',     desc: 'rel="nofollow" or rel="sponsored" attributes prevent link juice from passing' },
        ].map(j => (
          <div key={j.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-3`}>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{j.label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{j.desc}</p>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson17/link-juice.png"
        alt="Link juice flowing between websites"
        caption="Link juice (authority) flows from the linking page to the linked page"
      />
    </section>
  )
}

// ─────────────────────────────────────
// Section components array
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  KeywordCannibalization, KeywordDensity, KeywordDifficulty, KeywordRanking,
  KeywordStuffing, KeywordResearch, KeywordAnalysis, LinkBuilding,
  LinkExchange, LocalCitation, LongTailKeyword, LandingPage, LinkJuice,
]

// ─────────────────────────────────────
// Main export
// ─────────────────────────────────────
export default function Lesson17KeyTerminologies() {
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
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-2">Module 2 · Lesson 17</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Key Terminologies in Content Marketing — 4</h1>
          <p className="text-violet-100 text-sm leading-relaxed max-w-xl">
            13 essential SEO and content marketing terms: Keyword Cannibalization, Density,
            Difficulty, Ranking, Stuffing, Research, Analysis, Link Building, Link Exchange,
            Local Citation, Long-tail Keyword, Landing Page, and Link Juice.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-violet-200">
            <span>📚 13 Terms</span>
            <span>🖼️ 12 Screenshots</span>
            <span>🔗 6 Resource Links</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* Sticky sidebar — desktop only */}
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
          <div className="mt-16 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 rounded-2xl border border-violet-100 dark:border-violet-900 p-8">
            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-4">Module 2 — Key Terms Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TERMS.map(t => {
                const Icon = t.Icon
                return (
                  <button key={t.id} onClick={() => scrollTo(t.id)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-900 transition text-left group">
                    <div className={`w-8 h-8 ${BG[t.color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${TEXT[t.color]}`} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 font-medium">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>{/* closes flex-1 min-w-0 */}
      </div>{/* closes flex gap-6 */}
    </div>
  )
}
