'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Layers, FileText, Hash, BarChart2, Link2Off,
  EyeOff, Shield, ShieldOff, Target, Globe, Code,
  BookOpen, ExternalLink, AlertTriangle, Info, Check,
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
  { id: 'lsi-keywords',     label: 'LSI Keywords',     shortLabel: 'LSI Keywords',  color: 'amber',   Icon: Layers    },
  { id: 'meta-description', label: 'Meta Description', shortLabel: 'Meta Desc.',    color: 'blue',    Icon: FileText  },
  { id: 'meta-keywords',    label: 'Meta Keywords',    shortLabel: 'Meta Keywords', color: 'violet',  Icon: Hash      },
  { id: 'metric',           label: 'Metric',           shortLabel: 'Metric',        color: 'emerald', Icon: BarChart2 },
  { id: 'nofollow',         label: 'No-follow',        shortLabel: 'No-follow',     color: 'orange',  Icon: Link2Off  },
  { id: 'noindex',          label: 'Noindex Tag',      shortLabel: 'Noindex Tag',   color: 'red',     Icon: EyeOff    },
  { id: 'noopener',         label: 'Noopener',         shortLabel: 'Noopener',      color: 'indigo',  Icon: Shield    },
  { id: 'no-referrer',      label: 'No-referrer',      shortLabel: 'No-referrer',   color: 'sky',     Icon: ShieldOff },
  { id: 'niche',            label: 'Niche',            shortLabel: 'Niche',         color: 'pink',    Icon: Target    },
  { id: 'off-page-seo',     label: 'Off-page SEO',     shortLabel: 'Off-page SEO',  color: 'green',   Icon: Globe     },
  { id: 'on-page-seo',      label: 'On-page SEO',      shortLabel: 'On-page SEO',   color: 'teal',    Icon: Code      },
]

// ─────────────────────────────────────
// Color maps (all 11 colors)
// ─────────────────────────────────────
const BG: Record<string, string> = {
  amber:   'bg-amber-100 dark:bg-amber-900/40',
  blue:    'bg-blue-100 dark:bg-blue-900/40',
  violet:  'bg-violet-100 dark:bg-violet-900/40',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40',
  orange:  'bg-orange-100 dark:bg-orange-900/40',
  red:     'bg-red-100 dark:bg-red-900/40',
  indigo:  'bg-indigo-100 dark:bg-indigo-900/40',
  sky:     'bg-sky-100 dark:bg-sky-900/40',
  pink:    'bg-pink-100 dark:bg-pink-900/40',
  green:   'bg-green-100 dark:bg-green-900/40',
  teal:    'bg-teal-100 dark:bg-teal-900/40',
}

const TEXT: Record<string, string> = {
  amber:   'text-amber-700 dark:text-amber-300',
  blue:    'text-blue-700 dark:text-blue-300',
  violet:  'text-violet-700 dark:text-violet-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  orange:  'text-orange-700 dark:text-orange-300',
  red:     'text-red-700 dark:text-red-300',
  indigo:  'text-indigo-700 dark:text-indigo-300',
  sky:     'text-sky-700 dark:text-sky-300',
  pink:    'text-pink-700 dark:text-pink-300',
  green:   'text-green-700 dark:text-green-300',
  teal:    'text-teal-700 dark:text-teal-300',
}

const BORDER: Record<string, string> = {
  amber:   'border-amber-200 dark:border-amber-700',
  blue:    'border-blue-200 dark:border-blue-700',
  violet:  'border-violet-200 dark:border-violet-700',
  emerald: 'border-emerald-200 dark:border-emerald-700',
  orange:  'border-orange-200 dark:border-orange-700',
  red:     'border-red-200 dark:border-red-700',
  indigo:  'border-indigo-200 dark:border-indigo-700',
  sky:     'border-sky-200 dark:border-sky-700',
  pink:    'border-pink-200 dark:border-pink-700',
  green:   'border-green-200 dark:border-green-700',
  teal:    'border-teal-200 dark:border-teal-700',
}

const GRADIENT: Record<string, string> = {
  amber:   'from-amber-500 to-orange-500',
  blue:    'from-blue-500 to-indigo-500',
  violet:  'from-violet-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-500',
  orange:  'from-orange-500 to-red-500',
  red:     'from-red-500 to-rose-600',
  indigo:  'from-indigo-500 to-blue-600',
  sky:     'from-sky-400 to-blue-500',
  pink:    'from-pink-500 to-rose-500',
  green:   'from-green-500 to-emerald-500',
  teal:    'from-teal-500 to-cyan-600',
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

function LSIKeywords() {
  const term = TERMS[0]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Latent Semantic Indexing (LSI) keywords</strong> are conceptually related terms
        that search engines use to deeply understand content on a webpage. They provide context
        to your content, making it more understandable for search engines and users alike.
      </DefinitionCard>

      <InfoBox label="How It Works" color={term.color}>
        Google scans your page not just for your target keyword, but also for related terms
        and phrases surrounding it. These related terms help Google understand the full
        context and topic of your content — even beyond your primary keyword.
      </InfoBox>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-6 mb-5`}>
        <div className="flex items-center gap-2 mb-4">
          <Info className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>Example: Article About Cold Brew Coffee</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {"If you publish a blog post about cold brew coffee, Google will scan your title tag, content, and image alt text. It will also pick up these LSI keywords from the page:"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {['filter', 'temperature', 'grind', 'cold water', 'ice', 'brewing time'].map(kw => (
            <span key={kw}
              className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs px-3 py-2 rounded-lg text-center font-semibold">
              {kw}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
          These terms confirm to Google that your content is genuinely about cold brew coffee.
        </p>
      </div>

      <Screenshot
        src="/images/lesson19/lsi-keywords.png"
        alt="LSI Keywords example showing related terms"
        caption="Google scans for related terms (LSI keywords) to understand the full context of your page"
      />
    </section>
  )
}

function MetaDescription() {
  const term = TERMS[1]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>Meta Description</strong> is a short description in the HTML of a webpage
        that summarizes the content of that page. Search engines often display the meta
        description in search results, where it can significantly <strong>influence click-through rates</strong>.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson19/meta-description-1.png"
        alt="Meta description in HTML and search results"
        caption="The meta description lives in the HTML &lt;head&gt; and appears beneath your page title in Google search results"
      />

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-6 mb-5`}>
        <div className="flex items-center gap-2 mb-3">
          <FileText className={`w-4 h-4 ${TEXT[term.color]}`} />
          <p className={`${TEXT[term.color]} text-sm font-bold`}>Live Example — Inspired Homes</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          The screenshot below shows how a meta description appears in Google search results for a real website.
          Notice how the description beneath the page title gives the user a reason to click.
        </p>
        <Screenshot
          src="/images/lesson19/meta-description-2.png"
          alt="Meta description shown in Google search results for Inspired Homes"
          caption="The meta description snippet shown in Google search results for inspiredhomes.uk.com"
        />
        <ResourceLink
          href="https://inspiredhomes.uk.com/best-upvc-sash-windows/"
          label="See the live page with this meta description →"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: '✍️', title: 'Length', desc: 'Keep it between 150–160 characters to avoid truncation in search results.' },
          { icon: '🎯', title: 'Include Your Keyword', desc: 'Mention the primary keyword naturally — it may be bolded in the results.' },
          { icon: '📢', title: 'Add a Call-to-Action', desc: 'Phrases like "Learn more", "Get started", or "Find out how" increase clicks.' },
        ].map(tip => (
          <div key={tip.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-lg mb-1">{tip.icon}</p>
            <p className="text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">{tip.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{tip.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MetaKeywords() {
  const term = TERMS[2]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Meta Keywords</strong> are a type of meta tag that used to be used by search
        engines to understand the content of a webpage. However, due to widespread abuse,{' '}
        <strong>Google announced in 2009 that they no longer use this tag</strong> in their
        ranking algorithm.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson19/meta-keywords.png"
        alt="Meta keywords tag in HTML source code"
        caption="The meta keywords tag still appears in some websites' HTML code, but Google ignores it"
      />

      <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-5">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-800 dark:text-amber-200 mb-1">Deprecated Since 2009</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            Webmasters abused the meta keywords tag by stuffing it with keywords unrelated to
            their content to manipulate rankings. Google responded by publicly removing it from
            their algorithm entirely. You can safely ignore it.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-2 uppercase tracking-widest">Then (Before 2009)</p>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
            Search engines read the meta keywords tag to understand page topics.
            Marketers would stuff it with dozens of keywords to rank for more searches.
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2 uppercase tracking-widest">Now (Post 2009)</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
            Google, Bing, and most major search engines ignore the meta keywords tag completely.
            Focus on quality on-page content instead.
          </p>
        </div>
      </div>
    </section>
  )
}

function Metric() {
  const term = TERMS[3]
  const metrics = [
    { name: 'Organic Traffic', desc: 'Visitors arriving from unpaid search results' },
    { name: 'Keyword Rankings', desc: "Your page's position in search results for target keywords" },
    { name: 'Domain Authority (DA)', desc: 'Moz score predicting a site\'s ability to rank (0–100)' },
    { name: 'Domain Rating (DR)', desc: "Ahrefs' score based on backlink profile strength (0–100)" },
    { name: 'Page Authority (PA)', desc: "Moz score predicting a specific page's ranking potential" },
    { name: 'Bounce Rate', desc: 'Percentage of visitors who leave after viewing only one page' },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        In digital marketing, a <strong>metric</strong> is a quantifiable measure used to
        track and assess the status of a specific process. In SEO, metrics help you understand
        whether your strategies are working and where improvements are needed.
      </DefinitionCard>

      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Common SEO Metrics:</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {metrics.map(m => (
          <div key={m.name} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <Check className={`w-3.5 h-3.5 ${TEXT[term.color]}`} />
              <p className={`${TEXT[term.color]} text-xs font-bold`}>{m.name}</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{m.desc}</p>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson19/metric.png"
        alt="SEO metrics dashboard example"
        caption="Metrics like DA, DR, and organic traffic are tracked to measure SEO performance"
      />

      <ResourceLink
        href="https://backlinko.com/hub/seo/bounce-rate"
        label="Backlinko: What is Bounce Rate? (Full guide) →"
      />
    </section>
  )
}

function Nofollow() {
  const term = TERMS[4]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>No-follow</strong> is a link attribute (<code className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">rel="nofollow"</code>)
        that can be added to a hyperlink to tell search engines <strong>not to follow the link
        or pass any link equity</strong> to the linked page. It is commonly used for
        user-generated content, advertisements, and links you cannot personally vouch for.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson19/nofollow.png"
        alt="No-follow link attribute shown in HTML and a browser"
        caption="A nofollow link tells search engines to skip the link when calculating page authority"
      />

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>HTML Example</p>
        <CodeBlock code={`<a href="https://www.example.com" rel="nofollow">Example Website</a>`} />
        <div className="flex items-start gap-2 mt-3">
          <Info className={`w-4 h-4 ${TEXT[term.color]} flex-shrink-0 mt-0.5`} />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {"The "}
            <code className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-1 rounded text-xs font-mono">rel="nofollow"</code>
            {" attribute tells Google's crawler: \"I'm linking here, but I'm not endorsing this page.\""}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">How They Work:</p>
        <div className="space-y-2">
          {[
            "When a website links to another using a nofollow link, search engines do not consider it as an endorsement.",
            "These links do not contribute to the search engine ranking of the linked website.",
          ].map((pt, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pt}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Why Nofollow Links Are Still Valuable:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🚦', title: 'Still Drives Traffic', desc: 'Nofollow backlinks can still send real visitors to your website, even without passing SEO value.' },
            { icon: '🛡️', title: 'Protects Your Site', desc: "Used for UGC, comments, ads, and sponsored content — it signals you aren't vouching for the linked site's quality." },
          ].map(pt => (
            <div key={pt.title} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
              <p className="text-lg mb-1">{pt.icon}</p>
              <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{pt.title}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <ResourceLink
        href="https://www.gizbot.com/partner-content/covestros-sustainable-polycarbonate-solutions-for-electronics-innovation-100971.html"
        label="See a live example of a nofollow link in action →"
      />
    </section>
  )
}

function NoindexTag() {
  const term = TERMS[5]
  const pageTypes = [
    { label: '"Thank You" pages', icon: '🙏' },
    { label: 'Ad landing pages', icon: '📣' },
    { label: 'Thin or low-quality pages', icon: '📄' },
    { label: 'Blog archives', icon: '🗂️' },
    { label: 'Author & tag pages', icon: '🏷️' },
    { label: 'Login pages', icon: '🔐' },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        The <strong>Noindex Tag</strong> is an HTML tag added to a page&#39;s code to instruct
        search engines <strong>not to index the page</strong> — meaning it will not appear in
        search results. Using noindex effectively prevents specific pages from being shown to
        search engine users.
      </DefinitionCard>

      <InfoBox label="Common Usage" color={term.color}>
        <code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded text-xs font-mono">{`<meta name="robots" content="noindex">`}</code>
        {' '}is placed in the HTML{' '}
        <code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded text-xs font-mono">&lt;head&gt;</code>
        {' '}to tell Google not to show this page in search results.
      </InfoBox>

      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">When Should You Use Noindex?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        {pageTypes.map(pt => (
          <div key={pt.label} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-3 text-center`}>
            <p className="text-xl mb-1">{pt.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-semibold leading-snug`}>{pt.label}</p>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson19/noindex.png"
        alt="Noindex tag in website HTML source and its effect on search results"
        caption="A page with noindex will be crawled but will never appear in search engine results pages"
      />

      <WarningBox>
        <strong>Caution:</strong> If misused, the noindex tag can harm your website&#39;s
        visibility in search. Never add it to pages you want to appear in search results —
        for example, your homepage, product pages, or key blog posts.
      </WarningBox>

      <ResourceLink
        href="https://guestpostlinks.net/product/guest-post-on-worldranksolutions-com/"
        label="See a live example of a noindex page →"
      />
    </section>
  )
}

function Noopener() {
  const term = TERMS[6]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Noopener</strong> is a security attribute used when opening links in a new
        tab (<code className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">target="_blank"</code>).
        It prevents the new page from being able to{' '}
        <strong>access or manipulate the original page</strong> through the browser&#39;s
        window object — protecting your users from a known security vulnerability.
      </DefinitionCard>

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>HTML Example</p>
        <CodeBlock code={`<a href="https://guaranteedremovals.com/content-removal/" target="_blank" rel="noopener">delete news from the internet</a>`} />
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          When a user clicks this link, the guaranteedremovals.com page opens in a new tab —
          but thanks to <code className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1 rounded text-xs font-mono">rel="noopener"</code>,
          that new page cannot access or modify the original page the user came from.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '✅', title: 'What It Allows', desc: 'The linked page opens normally in a new browser tab and works as expected for the user.', green: true },
          { icon: '🚫', title: 'What It Blocks', desc: "The new page cannot use JavaScript to access window.opener and redirect or manipulate the original page.", green: false },
        ].map(c => (
          <div key={c.title}
            className={`border rounded-xl p-4 ${c.green ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
            <p className="text-lg mb-1">{c.icon}</p>
            <p className={`text-xs font-bold mb-1 ${c.green ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{c.title}</p>
            <p className={`text-sm leading-snug ${c.green ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{c.desc}</p>
          </div>
        ))}
      </div>

      <InfoBox label="Security Tip" color={term.color}>
        Always use <code className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1 rounded text-xs font-mono">rel="noopener noreferrer"</code> together
        whenever you use <code className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1 rounded text-xs font-mono">target="_blank"</code>.
        This gives your users both security (noopener) and privacy (noreferrer) when they follow your links.
      </InfoBox>

      <ResourceLink
        href="https://ahrefs.com/seo/glossary/noopener"
        label="Ahrefs: What is Noopener? Full explanation →"
      />
    </section>
  )
}

function NoReferrer() {
  const term = TERMS[7]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>No-referrer</strong> is a link attribute that prevents the destination webpage
        from knowing where the traffic came from. When a user clicks a noreferrer link, the
        new page receives <strong>no referrer information</strong> — offering additional
        privacy, but also making analytics tracking more challenging.
      </DefinitionCard>

      <Screenshot
        src="/images/lesson19/no-referrer.png"
        alt="No-referrer attribute shown in HTML"
        caption="The noreferrer attribute strips the referrer header so the destination site cannot see where the click came from"
      />

      <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5 mb-5`}>
        <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-3`}>HTML Example in Action</p>
        <CodeBlock code={`<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">Visit Example</a>`} />
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          When a user clicks this link, example.com opens in a new tab — but it will
          not receive any referrer data about the original page. The analytics tool on
          example.com will show this visit as <strong>Direct traffic</strong> instead
          of knowing it came from your site.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Privacy Benefit', icon: '🛡️', desc: "Protects the user's browsing path. The destination site won't know which page sent them.", color: 'emerald' },
          { label: 'Analytics Challenge', icon: '📊', desc: 'The referral source appears as "direct" in analytics, making it harder to track where traffic originated.', color: 'amber' },
        ].map(c => (
          <div key={c.label}
            className={`${BG[c.color]} ${BORDER[c.color]} border rounded-xl p-4`}>
            <p className="text-lg mb-1">{c.icon}</p>
            <p className={`${TEXT[c.color]} text-xs font-bold mb-1`}>{c.label}</p>
            <p className={`${TEXT[c.color]} text-sm leading-snug`}>{c.desc}</p>
          </div>
        ))}
      </div>

      <InfoBox label="Best Practice" color={term.color}>
        If you are linking to an external website — especially one that might be unfamiliar
        or untrustworthy — use{' '}
        <code className="bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-1 rounded text-xs font-mono">rel="noopener noreferrer"</code>
        {' '}together. This ensures both security (noopener) and privacy (noreferrer) for
        your users.
      </InfoBox>
    </section>
  )
}

function Niche() {
  const term = TERMS[8]
  const niches = [
    {
      category: 'Health & Fitness',
      icon: '💪',
      examples: ['Yoga for seniors', 'Strength training for women', 'Plant-based diets'],
      color: 'emerald',
    },
    {
      category: 'Technology',
      icon: '💻',
      examples: ['Cybersecurity for small businesses', 'AI-driven marketing solutions'],
      color: 'blue',
    },
    {
      category: 'Education',
      icon: '📚',
      examples: ['Online courses for graphic designers', 'Homeschooling for gifted children'],
      color: 'violet',
    },
  ]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        A <strong>niche</strong> in content marketing refers to a <strong>specialized segment
        of a broader market</strong> that focuses on a particular topic, audience, or product
        type. Targeting a niche allows businesses and marketers to cater to the unique needs
        and challenges of a smaller, more defined audience — often leading to more engaged
        and loyal customers.
      </DefinitionCard>

      <InfoBox label="Key Insight" color={term.color}>
        Instead of trying to appeal to everyone, niche marketing focuses on a specific group
        who cares deeply about your topic. A smaller, targeted audience often converts
        better than a large, broad one.
      </InfoBox>

      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Examples of Niche Categories:</p>
      <div className="space-y-3 mb-5">
        {niches.map(n => (
          <div key={n.category} className={`${BG[n.color]} ${BORDER[n.color]} border rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{n.icon}</span>
              <p className={`${TEXT[n.color]} font-bold`}>{n.category}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {n.examples.map(ex => (
                <span key={ex} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full font-medium">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson19/niche.png"
        alt="Niche marketing concept showing specialized market segments"
        caption="A niche is a focused slice of a broader market — the more specific, the more you stand out"
      />
    </section>
  )
}

function OffPageSEO() {
  const term = TERMS[9]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>Off-page SEO</strong> refers to all the actions taken{' '}
        <strong>outside of your own website</strong> to impact your rankings within search
        engine results pages (SERPs). While on-page SEO is about what you control on your
        site, off-page SEO is about how the rest of the web perceives and references your site.
      </DefinitionCard>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '🔗', title: 'Link Building', desc: 'Earning backlinks from other authoritative websites that point to your content.' },
          { icon: '📱', title: 'Social Media Signals', desc: 'Shares, mentions, and engagement on social platforms that drive traffic and awareness.' },
          { icon: '⭐', title: 'Brand Mentions', desc: 'When other websites mention your brand — even without a direct link — search engines take note.' },
          { icon: '📝', title: 'Guest Posting', desc: 'Publishing content on other relevant websites to earn backlinks and reach new audiences.' },
        ].map(item => (
          <div key={item.title} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-xl mb-1">{item.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{item.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      <Screenshot
        src="/images/lesson19/off-page-seo.png"
        alt="Off-page SEO activities and how they influence search rankings"
        caption="Off-page SEO activities happen away from your website but still directly affect your search rankings"
      />

      <ResourceLink
        href="https://www.javatpoint.com/seo-off-page-optimization"
        label="JavaTpoint: Off-page SEO — Complete Guide →"
      />
    </section>
  )
}

function OnPageSEO() {
  const term = TERMS[10]
  return (
    <section id={term.id}>
      <SectionHeader term={term} />
      <DefinitionCard color={term.color}>
        <strong>On-page SEO</strong> encompasses all the techniques that can be implemented{' '}
        <strong>directly on your website&#39;s pages</strong> to optimize them for search
        engines. Unlike off-page SEO, you have full control over these factors.
      </DefinitionCard>

      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Key On-page SEO Elements:</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[
          { icon: '📌', title: 'Title Tags', desc: 'The clickable headline for your page in search results — include your primary keyword.' },
          { icon: '📝', title: 'Meta Description', desc: 'The snippet shown below your title in SERPs — influences click-through rate.' },
          { icon: '🔤', title: 'Headings (H1–H6)', desc: 'Proper heading hierarchy helps search engines understand page structure and topic.' },
          { icon: '🖼️', title: 'Image Alt Text', desc: 'Descriptive alt attributes help Google index your images and understand page context.' },
          { icon: '🔗', title: 'Internal Links', desc: 'Links to other pages on your own site distribute authority and help navigation.' },
          { icon: '⚡', title: 'Page Speed', desc: 'Fast-loading pages improve user experience and are a direct ranking factor for Google.' },
        ].map(el => (
          <div key={el.title} className={`${BG[term.color]} ${BORDER[term.color]} border rounded-xl p-4`}>
            <p className="text-lg mb-1">{el.icon}</p>
            <p className={`${TEXT[term.color]} text-xs font-bold mb-1`}>{el.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{el.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className={`${BG[term.color]} ${BORDER[term.color]} border rounded-2xl p-5`}>
          <p className={`${TEXT[term.color]} text-xs font-bold uppercase tracking-widest mb-2`}>On-page SEO</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Changes made <strong>inside your website</strong> — content, HTML, structure, speed.
            You have 100% control over these factors.
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl p-5">
          <p className="text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-widest mb-2">Off-page SEO</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Actions taken <strong>outside your website</strong> — backlinks, social signals,
            brand mentions. You influence but cannot fully control these.
          </p>
        </div>
      </div>

      <ResourceLink
        href="https://ahrefs.com/blog/on-page-seo/"
        label="Ahrefs: On-page SEO — The Definitive Guide →"
      />
    </section>
  )
}

// ─────────────────────────────────────
// Section components in TERMS order
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  LSIKeywords,
  MetaDescription,
  MetaKeywords,
  Metric,
  Nofollow,
  NoindexTag,
  Noopener,
  NoReferrer,
  Niche,
  OffPageSEO,
  OnPageSEO,
]

// ─────────────────────────────────────
// Main export
// ─────────────────────────────────────
export default function Lesson19KeyTerminologies() {
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
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-2">Module 2 · Lesson 19</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Key Terminologies in Content Marketing — 5</h1>
          <p className="text-orange-100 text-sm leading-relaxed max-w-xl">
            11 essential SEO and content marketing terms: LSI Keywords, Meta Description,
            Meta Keywords, Metric, No-follow, Noindex Tag, Noopener, No-referrer, Niche,
            Off-page SEO, and On-page SEO.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-orange-100">
            <span>📚 11 Terms</span>
            <span>🖼️ 10 Screenshots</span>
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
          <div className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-2xl border border-amber-100 dark:border-amber-900 p-8">
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
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-300 font-medium">{t.label}</span>
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
