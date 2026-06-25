'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Search, TrendingUp, ExternalLink, DollarSign,
  Star, MousePointer, Network, BarChart2,
  AlertOctagon, Share2,
  BookOpen, AlertTriangle, Info, Check,
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
  { id: 'organic-search',    label: 'Organic Search Results',      shortLabel: 'Organic Search', color: 'emerald', Icon: Search       },
  { id: 'organic-traffic',   label: 'Organic Traffic',             shortLabel: 'Organic Traffic',color: 'teal',    Icon: TrendingUp   },
  { id: 'outbound-link',     label: 'Outbound Link',               shortLabel: 'Outbound Link',  color: 'blue',    Icon: ExternalLink },
  { id: 'paid-link',         label: 'Paid Link',                   shortLabel: 'Paid Link',      color: 'red',     Icon: DollarSign   },
  { id: 'primary-keyword',   label: 'Primary Keyword',             shortLabel: 'Primary KW',     color: 'violet',  Icon: Star         },
  { id: 'paid-search',       label: 'Paid Search',                 shortLabel: 'Paid Search',    color: 'orange',  Icon: MousePointer },
  { id: 'pbn',               label: 'PBN (Private Blog Network)',  shortLabel: 'PBN',            color: 'rose',    Icon: Network      },
  { id: 'page-authority',    label: 'Page Authority',              shortLabel: 'Page Authority', color: 'amber',   Icon: BarChart2    },
  { id: 'plagiarism',        label: 'Plagiarism',                  shortLabel: 'Plagiarism',     color: 'indigo',  Icon: AlertOctagon },
  { id: 'referral-traffic',  label: 'Referral Traffic',            shortLabel: 'Referral Traffic', color: 'sky',   Icon: Share2       },
]

// ─────────────────────────────────────
// Color maps (all 10 colors)
// ─────────────────────────────────────
const BG: Record<string, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  red:     'bg-red-100 dark:bg-red-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  orange:  'bg-orange-100 dark:bg-orange-900/40',
  rose:    'bg-rose-100 dark:bg-rose-900/40',
  amber:   'bg-amber-100 dark:bg-amber-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  sky:     'bg-sky-100 dark:bg-sky-900/40',
}

const TEXT: Record<string, string> = {
  emerald: 'text-emerald-700 dark:text-emerald-300',
  teal:    'text-teal-700 dark:text-teal-300',
  blue:    'text-blue-700 dark:text-blue-300',
  red:     'text-red-700 dark:text-red-300',
  violet:  'text-violet-700 dark:text-violet-300',
  orange:  'text-orange-700 dark:text-orange-300',
  rose:    'text-rose-700 dark:text-rose-300',
  amber:   'text-amber-700 dark:text-amber-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  sky:     'text-sky-700 dark:text-sky-300',
}

const BORDER: Record<string, string> = {
  emerald: 'border-emerald-200 dark:border-emerald-700',
  teal:    'border-teal-200 dark:border-teal-700',
  blue:    'border-blue-200 dark:border-blue-700',
  red:     'border-red-200 dark:border-red-700',
  violet:  'border-violet-200 dark:border-violet-700',
  orange:  'border-orange-200 dark:border-orange-700',
  rose:    'border-rose-200 dark:border-rose-700',
  amber:   'border-amber-200 dark:border-amber-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  sky:     'border-sky-200 dark:border-sky-700',
}

const GRADIENT: Record<string, string> = {
  emerald: 'from-emerald-500 to-teal-500',
  teal:    'from-teal-500 to-cyan-600',
  blue:    'from-blue-500 to-indigo-500',
  red:     'from-red-500 to-rose-600',
  violet:  'from-violet-500 to-purple-600',
  orange:  'from-orange-500 to-red-500',
  rose:    'from-rose-500 to-pink-600',
  amber:   'from-amber-500 to-orange-500',
  indigo:  'from-indigo-500 to-blue-600',
  sky:     'from-sky-400 to-blue-500',
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

function OrganicSearchResults() {
  const term = TERMS[0]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Organic Search Results</strong> are the listings on a search engine results
        page (SERP) that appear because of their <strong>relevance to the search terms</strong>,
        as opposed to being advertisements. Organic search results are{' '}
        <strong>non-paid</strong>, and their ranking is determined by search engine algorithms.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson21/organic-search-results.png"
        alt="Organic search results shown on a Google SERP page"
        caption="Organic results appear below paid ads and are ranked purely by relevance — no payment required"
      />

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5`}>
          <p className="text-lg mb-2">🔍</p>
          <p className={`${TEXT[term.color]} text-xs font-bold mb-1 uppercase tracking-widest`}>Organic Results</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Ranked by Google based on content quality, relevance, backlinks, and user signals. No payment involved.
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5">
          <p className="text-lg mb-2">📢</p>
          <p className="text-yellow-700 dark:text-yellow-300 text-xs font-bold mb-1 uppercase tracking-widest">Paid Results (Ads)</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Advertisers pay per click to appear at the top or bottom of the SERP. Marked with a small "Sponsored" label.
          </p>
        </div>
      </div>

      <InfoBox label="Why Organic Rankings Matter" color={term.color}>
        Studies consistently show that users trust organic search results more than paid ads.
        The top organic result receives approximately{' '}
        <strong>28% of all clicks</strong> for a given search query — making organic SEO
        one of the highest-value channels in digital marketing.
      </InfoBox>
    </section>
  )
}

function OrganicTraffic() {
  const term = TERMS[1]
  const tools = [
    { name: 'Google Analytics', abbr: 'GA', desc: 'The industry-standard free tool to analyse how users find and behave on your site.', color: 'amber' },
    { name: 'Ahrefs',           abbr: 'AH', desc: 'Shows organic traffic estimates, keyword rankings, and backlink profiles.',         color: 'blue'  },
    { name: 'SEMrush',          abbr: 'SR', desc: 'Comprehensive SEO suite with organic traffic analysis and competitor insights.',      color: 'emerald'},
    { name: 'Similarweb',       abbr: 'SW', desc: "Estimates a site's total traffic breakdown — including organic vs. paid sources.",    color: 'violet' },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Organic Traffic</strong> is the traffic that comes to your website as a
        result of <strong>unpaid search results</strong>. Users find your website using a
        search engine like Google and click on a non-ad link in the search results — without
        you paying for that visit.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson21/organic-traffic.png"
        alt="Organic traffic graph showing visitor trends from search engines"
        caption="Organic traffic is tracked over time to measure the impact of SEO efforts"
      />

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
          How Is Organic Traffic Tracked?
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {tools.map(t => (
            <div key={t.name} className={`${BG[t.color]} border border-${t.color}-200 dark:border-${t.color}-700 rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${GRADIENT[t.color]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {t.abbr}
                </div>
                <p className={`${TEXT[t.color]} text-sm font-bold`}>{t.name}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <InfoBox label="Key Advantage" color={term.color}>
        Unlike paid traffic, organic traffic does not stop when you stop spending money.
        A well-optimised page can continue bringing visitors for months or years —
        making it one of the most cost-effective long-term marketing strategies.
      </InfoBox>
    </section>
  )
}

function OutboundLink() {
  const term = TERMS[2]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Outbound links</strong> are links that point to <strong>any domain other
        than the domain the link exists on</strong> — simply put, links going out to a
        different website. Outbound links to high-quality, reputable sites can improve
        the credibility of your site and potentially improve your rankings.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson21/outbound-link.png"
        alt="Diagram showing outbound links pointing from one website to another"
        caption="An outbound link leaves your website and sends the visitor to a different domain"
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '⬆️', label: 'Outbound Link',  desc: 'From YOUR site to another website (external).',         color: term.color },
          { icon: '⬇️', label: 'Inbound Link',   desc: 'From another website back to YOUR site (backlink).',    color: 'green'    },
          { icon: '🔁', label: 'Internal Link',  desc: 'From one page to another page on the SAME site.',       color: 'violet'   },
        ].map(lt => (
          <div key={lt.label} className={`${BG[lt.color]} ${BORDER[lt.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{lt.icon}</p>
            <p className={`${TEXT[lt.color]} text-xs font-bold mb-1`}>{lt.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{lt.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2 uppercase tracking-widest">Do This</p>
          <ul className="space-y-1.5">
            {[
              "Link to authoritative sources (Wikipedia, government sites, top publications).",
              "Use descriptive anchor text that tells readers what the linked page is about.",
              "Only link to pages that genuinely add value for your reader.",
            ].map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <WarningBox>
          <strong>Avoid</strong> linking to low-quality, spammy, or unrelated websites.
          An outbound link is an implicit endorsement — if the destination site is
          penalised by Google, it can reflect poorly on your own page.
        </WarningBox>
      </div>
    </section>
  )
}

function PaidLink() {
  const term = TERMS[3]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Paid Link</strong> is a link to a website for which the site owner{' '}
        <strong>paid money in exchange for placement</strong>. Buying and selling links
        is explicitly against{' '}
        <strong>Google&#39;s Webmaster Guidelines</strong>, because these links can
        artificially inflate the importance of a webpage and distort search rankings.
      </DefinitionCard>

      <WarningBox>
        <strong>Black Hat SEO Warning:</strong> Using paid links to manipulate PageRank is a
        direct violation of Google&#39;s guidelines. If Google detects paid links on your
        site, you risk a <strong>manual penalty</strong> that can cause your pages to drop
        drastically in search rankings — or be removed entirely.
      </WarningBox>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '❌', label: 'Paid Link (Black Hat)',   desc: "You pay another website to include a link back to yours. Google treats this as manipulative and penalises both sites if detected.", bad: true  },
          { icon: '✅', label: 'Earned Link (White Hat)', desc: "Another site links to you because your content is genuinely valuable. This is the only type of link Google rewards.", bad: false },
        ].map(c => (
          <div key={c.label}
            className={`border rounded-2xl p-5 ${c.bad ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'}`}>
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className={`text-xs font-bold mb-2 uppercase tracking-widest ${c.bad ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{c.label}</p>
            <p className={`text-sm leading-relaxed ${c.bad ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{c.desc}</p>
          </div>
        ))}
      </div>

      <ResourceLink
        href="https://www.linkresearchtools.com/kb/paid-links/"
        label="Learn more about paid links and their risks →"
      />
    </section>
  )
}

function PrimaryKeyword() {
  const term = TERMS[4]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        The <strong>Primary Keyword</strong> is the main term or phrase you hope to rank
        for on a webpage. It is the <strong>focus of the content</strong> and should be
        directly related to the core topic of the page. Every well-optimised page is
        built around a single primary keyword.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson21/primary-keyword.png"
        alt="Primary keyword placement in title, meta description, headings, and content"
        caption="The primary keyword should appear naturally in your title tag, H1, meta description, and throughout the content"
      />

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Where to Place Your Primary Keyword:</p>
        <div className="space-y-2">
          {[
            { place: 'Title Tag', tip: 'Include it as close to the beginning of the title as possible.', icon: '📌' },
            { place: 'H1 Heading', tip: "The main heading of your page — Google weights this heavily.", icon: '📝' },
            { place: 'Meta Description', tip: 'Mention it naturally to improve relevance and click-through rate.', icon: '🔍' },
            { place: 'First 100 Words', tip: 'Establish topic relevance early in the content body.', icon: '✍️' },
            { place: 'URL Slug', tip: 'Include a short, clean version in your page URL.', icon: '🔗' },
            { place: 'Image Alt Text', tip: 'Describe images using the keyword where it fits naturally.', icon: '🖼️' },
          ].map((pl, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <span className="text-lg flex-shrink-0">{pl.icon}</span>
              <div>
                <p className={`${TEXT[term.color]} text-xs font-bold mb-0.5`}>{pl.place}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{pl.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InfoBox label="Primary vs. Secondary Keywords" color={term.color}>
        Every page has one <strong>primary keyword</strong> (the main focus) and several
        <strong> secondary keywords</strong> (related terms that support the topic).
        For example, a page targeting <em>"cold brew coffee recipe"</em> (primary) might
        also naturally include <em>"how to make cold brew"</em> and{' '}
        <em>"coffee grind size"</em> (secondary).
      </InfoBox>
    </section>
  )
}

function PaidSearch() {
  const term = TERMS[5]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Paid Search</strong> is a type of digital marketing where search engines
        allow advertisers to <strong>show ads on their SERPs</strong>. Advertisers are
        charged each time a user clicks on the ad — which is why it is also known as{' '}
        <strong>Pay-Per-Click (PPC) advertising</strong>.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson21/paid-search.png"
        alt="Paid search ads shown at the top of a Google SERP with Sponsored label"
        caption="Paid search ads appear at the top and bottom of the SERP, marked with a 'Sponsored' label"
      />

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-6 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-4`}>How Paid Search Works</p>
        <div className="space-y-3">
          {[
            { step: '1', label: 'Advertisers Bid', desc: 'Businesses bid on keywords they want their ads to appear for, setting a maximum cost per click (CPC).' },
            { step: '2', label: 'Ad Auction', desc: "When a user searches, Google runs an instant auction to decide which ads show — based on bid amount and Quality Score." },
            { step: '3', label: 'Ad Appears', desc: "Winning ads are shown at the top or bottom of the SERP with a 'Sponsored' label." },
            { step: '4', label: 'Pay Per Click', desc: 'The advertiser is only charged when a user actually clicks the ad — not just for it being displayed.' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${GRADIENT[term.color]} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {s.step}
              </div>
              <div>
                <p className={`${TEXT[term.color]} text-sm font-bold`}>{s.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
          <p className={`${TEXT[term.color]} text-xs font-bold mb-2 uppercase tracking-widest`}>Paid Search (PPC)</p>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• Results appear immediately</li>
            <li>• You pay for every click</li>
            <li>• Stops when budget runs out</li>
            <li>• Great for time-sensitive campaigns</li>
          </ul>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <p className="text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2 uppercase tracking-widest">Organic Search (SEO)</p>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• Results take months to build</li>
            <li>• Clicks are free</li>
            <li>• Traffic continues long-term</li>
            <li>• Great for sustainable growth</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function PBN() {
  const term = TERMS[6]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Private Blog Network (PBN)</strong> is a network of websites built for
        the sole purpose of <strong>creating backlinks to a single target website</strong>{' '}
        in order to artificially manipulate its search engine rankings. This practice is
        explicitly against{' '}
        <strong>Google&#39;s Webmaster Guidelines</strong> and can result in a severe penalty.
      </DefinitionCard>

      <WarningBox>
        <strong>High Risk — Avoid PBNs entirely.</strong> Google actively detects PBN
        footprints (shared hosting, identical site structures, thin content). If your site
        is linked from a known PBN, Google can issue a{' '}
        <strong>manual action penalty</strong> that removes your pages from search results
        completely. Recovery can take months or years.
      </WarningBox>

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">How a PBN Works (and Why It Gets Penalised):</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🕸️', label: 'The Setup',    desc: 'A person buys expired domains that still have authority and backlinks, then builds websites on them with minimal content.' },
            { icon: '🔗', label: 'The Scheme',   desc: 'All PBN sites are then used to link back to one target website, artificially inflating its perceived authority.' },
            { icon: '🚨', label: 'Detection',    desc: "Google's algorithm flags patterns: same owner, shared IP, similar site structures, unnatural anchor text, and thin content." },
            { icon: '⚖️', label: 'The Penalty',  desc: 'Sites caught using PBNs receive a manual or algorithmic penalty — losing rankings and potentially being deindexed entirely.' },
          ].map(p => (
            <div key={p.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
              <p className="text-xl mb-1">{p.icon}</p>
              <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{p.label}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <ResourceLink
        href="https://www.seekahost.app/pbn-sites-examples-list/"
        label="See real examples of PBN sites →"
      />
    </section>
  )
}

function PageAuthority() {
  const term = TERMS[7]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Page Authority (PA)</strong> is a metric developed by{' '}
        <strong>Moz</strong> that predicts how well a specific web page is likely to rank
        in search engine results. It takes into account various factors including the
        quality and quantity of backlinks, social signals, and other SEO metrics.
        Page Authority is measured on a <strong>scale of 1 to 100</strong>.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson21/page-authority.png"
        alt="Page Authority score shown in the Moz SEO toolbar"
        caption="Page Authority is scored 1–100 by Moz; higher scores indicate stronger ranking potential"
      />

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Understanding the PA Scale:</p>
        <div className="space-y-2">
          {[
            { range: '1–20',   label: 'Low',     desc: 'New or low-authority pages. Difficult to rank competitively.',   color: 'red'     },
            { range: '21–40',  label: 'Fair',    desc: 'Some authority built up. Competitive in lower-competition niches.', color: 'orange'  },
            { range: '41–60',  label: 'Good',    desc: 'Solid authority. Able to rank well for moderate competition keywords.', color: 'amber' },
            { range: '61–80',  label: 'Strong',  desc: 'High authority. Common for established pages with strong backlink profiles.', color: 'emerald'},
            { range: '81–100', label: 'Elite',   desc: 'Exceptional authority. Typically Wikipedia, major news outlets, government pages.', color: 'blue'},
          ].map(s => (
            <div key={s.range} className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
              <div className={`w-14 h-8 rounded-lg bg-gradient-to-r ${GRADIENT[s.color]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{s.range}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`${TEXT[s.color]} text-xs font-bold mr-2`}>{s.label}:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InfoBox label="PA vs. DA — What Is the Difference?" color={term.color}>
        <strong>Page Authority (PA)</strong> predicts ranking potential for a{' '}
        <em>specific page</em>, while <strong>Domain Authority (DA)</strong> predicts
        ranking potential for the <em>entire domain</em>. A site can have a high DA but
        individual pages with low PA if those pages lack backlinks.
      </InfoBox>

      <ResourceLink
        href="https://moz.com/learn/seo/page-authority"
        label="Moz: Learn about Page Authority →"
      />
    </section>
  )
}

function Plagiarism() {
  const term = TERMS[8]
  const types = [
    {
      title: 'Verbatim / Copying',
      icon: '📋',
      desc: 'Directly copying text from a source without using quotation marks or citing the original author.',
    },
    {
      title: 'Paraphrasing',
      icon: '🔄',
      desc: 'Rewriting someone else\'s ideas in your own words but failing to credit the original source.',
    },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Plagiarism</strong> is the act of presenting someone else&#39;s work,
        ideas, or words as your own — whether <strong>intentionally or accidentally</strong>.
        It is considered a form of intellectual theft and a serious breach of honesty.
        The word "plagiarism" comes from the Latin word for <em>"kidnapper"</em>.
      </DefinitionCard>

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Types of Plagiarism:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {types.map(t => (
            <div key={t.title} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5`}>
              <p className="text-2xl mb-2">{t.icon}</p>
              <p className={`${TEXT[term.color]} text-sm font-bold mb-2`}>{t.title}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <WarningBox>
        <strong>In Content Marketing:</strong> Publishing plagiarised content can result in
        Google penalties (duplicate content), copyright claims, and serious damage to your
        brand reputation. Always write original content or properly attribute all sources.
      </WarningBox>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Info className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>How to Check for Plagiarism</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          Plagiarism checker tools compare your content against billions of web pages to
          identify copied or closely paraphrased sections and give you an originality
          score before you publish.
        </p>
        <ResourceLink
          href="https://www.scribbr.com/plagiarism/best-free-plagiarism-checker/"
          label="Scribbr: Best Free Plagiarism Checker Tools →"
        />
      </div>
    </section>
  )
}

function ReferralTraffic() {
  const term = TERMS[9]
  const sources = [
    { icon: '📱', label: 'Social Media',           desc: 'Users clicking links shared on Facebook, Twitter/X, LinkedIn, Instagram, etc.' },
    { icon: '🌐', label: 'Other Websites',          desc: 'Blogs, news articles, or partner sites that link to your content.' },
    { icon: '📂', label: 'Online Directories',      desc: 'Business listings, review platforms, or niche directories.' },
    { icon: '📧', label: 'Email Campaigns',         desc: 'Links clicked within email newsletters or promotional emails.' },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Referral Traffic</strong> refers to visitors who arrive at your website by
        clicking on a <strong>link from another website</strong>, rather than from search
        engine results or directly entering your URL. Monitoring and growing referral
        traffic helps diversify your website&#39;s traffic sources beyond organic search alone.
      </DefinitionCard>

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Where Does Referral Traffic Come From?</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {sources.map(s => (
            <div key={s.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{s.label}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Screenshot
        src="/images/lesson21/referral-traffic.png"
        alt="Referral traffic report shown in Google Analytics"
        caption="Google Analytics shows exactly which websites are sending referral visitors to your site"
      />

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-6 mb-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Info className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>Tracking Referral Traffic with Google Analytics</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          In Google Analytics, navigate to{' '}
          <strong>Acquisition → All Traffic → Referrals</strong> to see a full list of
          websites sending you traffic. You can see visitor counts, bounce rates, and
          conversions from each referral source — helping you identify your most valuable
          partner websites.
        </p>
      </div>

      <InfoBox label="Why Referral Traffic Matters" color={term.color}>
        Relying on only one traffic source is risky. If Google updates its algorithm and
        your organic traffic drops, referral traffic from social media, directories, and
        partner sites acts as a safety net. Diversifying traffic sources keeps your
        website stable regardless of search engine changes.
      </InfoBox>
    </section>
  )
}

// ─────────────────────────────────────
// Section components in TERMS order
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  OrganicSearchResults,
  OrganicTraffic,
  OutboundLink,
  PaidLink,
  PrimaryKeyword,
  PaidSearch,
  PBN,
  PageAuthority,
  Plagiarism,
  ReferralTraffic,
]

// ─────────────────────────────────────
// Main export
// ─────────────────────────────────────
export default function Lesson21KeyTerminologies() {
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
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Module 2 · Lesson 21</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Key Terminologies in Content Marketing — 6</h1>
          <p className="text-emerald-100 text-sm leading-relaxed max-w-xl">
            10 essential SEO and content marketing terms: Organic Search Results, Organic Traffic,
            Outbound Link, Paid Link, Primary Keyword, Paid Search, PBN, Page Authority,
            Plagiarism, and Referral Traffic.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-emerald-100">
            <span>📚 10 Terms</span>
            <span>🖼️ 7 Screenshots</span>
            <span>🔗 4 Resource Links</span>
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
          <div className="mt-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-8">
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
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 font-medium">{t.label}</span>
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
