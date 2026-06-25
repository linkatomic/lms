'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, BarChart2, Link2, Link, Link2Off, Star, Copy, AlertOctagon,
  Navigation, Globe, Clock, TrendingUp, Award, ExternalLink, BookOpen
} from 'lucide-react'

// ─────────────────────────────────────
// Term navigation data
// ─────────────────────────────────────
const TERMS = [
  { id: 'competitor-analysis', label: 'Competitor Analysis', shortLabel: 'Comp. Analysis',    icon: BarChart2,    color: 'indigo'  },
  { id: 'contextual-links',    label: 'Contextual Links',    shortLabel: 'Contextual Links',  icon: Link2,         color: 'teal'    },
  { id: 'dofollow-link',       label: 'Do-follow Link',      shortLabel: 'Do-follow Link',    icon: Link,          color: 'green'   },
  { id: 'nofollow-link',       label: 'No-follow Link',      shortLabel: 'No-follow Link',    icon: Link2Off,      color: 'cyan'    },
  { id: 'domain-rating',       label: 'Domain Rating (DR)',  shortLabel: 'Domain Rating',     icon: Star,          color: 'violet'  },
  { id: 'duplicate-content',   label: 'Duplicate Content',   shortLabel: 'Duplicate Content', icon: Copy,          color: 'red'     },
  { id: 'de-index',            label: 'De-Index',            shortLabel: 'De-Index',          icon: AlertOctagon,  color: 'orange'  },
  { id: 'direct-traffic',      label: 'Direct Traffic',      shortLabel: 'Direct Traffic',    icon: Navigation,    color: 'blue'    },
  { id: 'domain',              label: 'Domain',              shortLabel: 'Domain',            icon: Globe,         color: 'purple'  },
  { id: 'domain-age',          label: 'Domain Age',          shortLabel: 'Domain Age',        icon: Clock,         color: 'amber'   },
  { id: 'domain-authority',    label: 'Domain Authority',    shortLabel: 'Domain Authority',  icon: TrendingUp,    color: 'emerald' },
  { id: 'editorial-link',      label: 'Editorial Link',      shortLabel: 'Editorial Link',    icon: Award,         color: 'rose'    },
]

// Color maps
const BG: Record<string, string> = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40',   teal: 'bg-teal-100 dark:bg-teal-900/40',
  green:  'bg-green-100 dark:bg-green-900/40',      cyan: 'bg-cyan-100 dark:bg-cyan-900/40',
  violet: 'bg-violet-100 dark:bg-violet-900/40',    red:  'bg-red-100 dark:bg-red-900/40',
  orange: 'bg-orange-100 dark:bg-orange-900/40',    blue: 'bg-blue-100 dark:bg-blue-900/40',
  purple: 'bg-purple-100 dark:bg-purple-900/40',    amber: 'bg-amber-100 dark:bg-amber-900/40',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40', rose: 'bg-rose-100 dark:bg-rose-900/40',
}
const TEXT: Record<string, string> = {
  indigo: 'text-indigo-700 dark:text-indigo-300',   teal: 'text-teal-700 dark:text-teal-300',
  green:  'text-green-700 dark:text-green-300',      cyan: 'text-cyan-700 dark:text-cyan-300',
  violet: 'text-violet-700 dark:text-violet-300',    red:  'text-red-700 dark:text-red-300',
  orange: 'text-orange-700 dark:text-orange-300',    blue: 'text-blue-700 dark:text-blue-300',
  purple: 'text-purple-700 dark:text-purple-300',    amber: 'text-amber-700 dark:text-amber-300',
  emerald: 'text-emerald-700 dark:text-emerald-300', rose: 'text-rose-700 dark:text-rose-300',
}
const BORDER: Record<string, string> = {
  indigo: 'border-indigo-200 dark:border-indigo-800',   teal: 'border-teal-200 dark:border-teal-800',
  green:  'border-green-200 dark:border-green-800',      cyan: 'border-cyan-200 dark:border-cyan-800',
  violet: 'border-violet-200 dark:border-violet-800',    red:  'border-red-200 dark:border-red-800',
  orange: 'border-orange-200 dark:border-orange-800',    blue: 'border-blue-200 dark:border-blue-800',
  purple: 'border-purple-200 dark:border-purple-800',    amber: 'border-amber-200 dark:border-amber-800',
  emerald: 'border-emerald-200 dark:border-emerald-800', rose: 'border-rose-200 dark:border-rose-800',
}
const GRADIENT: Record<string, string> = {
  indigo: 'from-indigo-500 to-blue-600',     teal: 'from-teal-500 to-cyan-600',
  green:  'from-green-500 to-emerald-600',   cyan: 'from-cyan-500 to-teal-600',
  violet: 'from-violet-500 to-purple-600',   red:  'from-red-500 to-rose-600',
  orange: 'from-orange-500 to-amber-600',    blue: 'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-violet-600',   amber: 'from-amber-500 to-orange-600',
  emerald: 'from-emerald-500 to-teal-600',   rose: 'from-rose-500 to-pink-600',
}

// ─────────────────────────────────────
// Shared helper components
// ─────────────────────────────────────
function TermHeader({ id, color }: { id: string; color: string }) {
  const t = TERMS.find(x => x.id === id)!
  const Icon = t.icon
  return (
    <div className={`bg-gradient-to-r ${GRADIENT[color]} rounded-2xl p-6 text-white mb-6`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">{t.label}</h2>
      </div>
    </div>
  )
}

function DefinitionCard({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className={`${BG[color]} ${BORDER[color]} border rounded-2xl p-5 mb-5`}>
      <p className={`${TEXT[color]} text-sm font-bold uppercase tracking-widest mb-2`}>Definition</p>
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

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-5">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <img src={src} alt={alt} className="w-full object-contain" loading="lazy" />
      </div>
      {caption && <figcaption className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">{caption}</figcaption>}
    </figure>
  )
}

function YouTubeEmbed({ videoId, caption }: { videoId: string; caption?: string }) {
  return (
    <figure className="my-5">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="bg-red-600 px-3 py-1.5 flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
            <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[7px] border-transparent border-l-red-600 ml-0.5" />
          </div>
          <span className="text-white text-xs font-bold">YouTube</span>
        </div>
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={caption || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
      {caption && <figcaption className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">{caption}</figcaption>}
    </figure>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <span className="text-gray-400 text-xs font-mono">HTML</span>
      </div>
      <div className="bg-gray-900 px-4 py-3">
        <code className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">{code}</code>
      </div>
    </div>
  )
}

function ToolLink({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 transition group">
      <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-violet-700 dark:group-hover:text-violet-300 font-medium">{label}</span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-violet-500 flex-shrink-0" />
    </a>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <ChevronRight className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─────────────────────────────────────
// Individual term sections
// ─────────────────────────────────────

function CompetitorAnalysis() {
  return (
    <section id="competitor-analysis">
      <TermHeader id="competitor-analysis" color="indigo" />
      <DefinitionCard color="indigo">
        Competitor analysis is the process of <strong>evaluating and studying the strategies, strengths,
        weaknesses, and online presence of competitors</strong> in a specific industry or niche.
      </DefinitionCard>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
        It involves analysing their websites, keywords, backlink profiles, content strategies, and social
        media presence to gain insights and identify opportunities to improve your own SEO efforts.
      </p>
      <Screenshot
        src="/images/lesson13/competitive-analysis-infographic.png"
        alt="Competitive Analysis infographic showing key factors: industry, research, marketing strategies, comparison, company, strengths, weaknesses, and competitors"
        caption="Competitor analysis maps out every angle — from industry context to individual strengths and weaknesses."
      />
    </section>
  )
}

function ContextualLinks() {
  return (
    <section id="contextual-links">
      <TermHeader id="contextual-links" color="teal" />
      <DefinitionCard color="teal">
        A piece of <strong>clickable text (keyword)</strong> located in the body of a paragraph that
        contains similar ideas or context. They can be within a blog, press release, article, or any
        type of written content found online.
      </DefinitionCard>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
        Contextual links appear natural and are always relevant to the context of the destination site —
        making them both useful for readers and trustworthy for search engines.
      </p>
      <Screenshot
        src="/images/lesson13/contextual-link-article-example.png"
        alt="Example article with contextual link highlighted — 'negotiating your car insurance' links naturally within the surrounding content"
        caption="Example: 'negotiating your car insurance' is a natural contextual link within the paragraph."
      />
      <Screenshot
        src="/images/lesson13/contextual-relevance-google.png"
        alt="Infographic: Why contextual relevance is important to Google — won't be marked as spam, indicates a human touch, and is considered useful for readers"
        caption="Why contextual relevance matters to Google — three core reasons."
      />
    </section>
  )
}

function DofollowLink() {
  return (
    <section id="dofollow-link">
      <TermHeader id="dofollow-link" color="green" />
      <DefinitionCard color="green">
        A do-follow link is a type of hyperlink that allows search engines like Google to
        <strong> follow it and pass on "link juice" or SEO value</strong> from one website to another.
        When a webpage includes a do-follow link to another site, it signals to search engines that the
        linked site is trustworthy or valuable, which can improve that site's ranking.
      </DefinitionCard>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
        In simple terms, a do-follow link helps a website gain more authority in the eyes of search engines,
        which can lead to better visibility and traffic.
      </p>

      <InfoBox label="How They Work" color="green">
        <BulletList items={[
          'When a website links to another using a do-follow link, search engines like Google consider it as a vote of confidence.',
          'The linked website gains authority and relevance in the eyes of search engines, potentially improving its rankings in search results.',
        ]} />
      </InfoBox>

      <InfoBox label="Importance" color="green">
        <BulletList items={[
          'Do-follow backlinks are crucial for SEO because they directly impact a website\'s ranking potential.',
          'Acquiring high-quality do-follow backlinks from reputable websites can significantly boost your website\'s authority.',
        ]} />
      </InfoBox>

      <InfoBox label="HTML Example" color="green">
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
          A standard link without <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono">rel="nofollow"</code> is treated as a do-follow link by default:
        </p>
        <CodeBlock code={`<a href="https://www.example.com">Example Website</a>`} />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          A do-follow link will <strong>not</strong> have the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono">rel="nofollow"</code> attribute, while a no-follow link will include it.
        </p>
      </InfoBox>

      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">How to check if a link is do-follow:</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Visit the page, right-click the link, and select <strong>Inspect</strong> (or press F12) to open
          Chrome DevTools. Look for the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs font-mono">&lt;a&gt;</code> tag — if there is no <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs font-mono">rel="nofollow"</code>, it is a do-follow link.
        </p>
        <Screenshot
          src="/images/lesson13/dofollow-devtools-check.png"
          alt="Chrome DevTools Elements panel showing an anchor tag on dayspets.com — no rel=nofollow attribute confirms it is a do-follow link"
          caption="Chrome DevTools: no rel='nofollow' on the link confirms it passes SEO value."
        />
      </div>

      <YouTubeEmbed videoId="YxCsC9Mua3Q" caption="How to check if a link is do-follow or no-follow" />
    </section>
  )
}

function NofollowLink() {
  return (
    <section id="nofollow-link">
      <TermHeader id="nofollow-link" color="cyan" />
      <DefinitionCard color="cyan">
        A no-follow link is a type of hyperlink that <strong>tells search engines NOT to follow the
        link or pass any SEO value (link juice)</strong> to the destination site. It is created by
        adding the <code className="bg-cyan-100 dark:bg-cyan-900 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-700 dark:text-cyan-300">rel="nofollow"</code> attribute to the anchor tag.
      </DefinitionCard>

      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
        While no-follow links do not directly pass SEO authority, they can still drive referral traffic
        and contribute to a natural-looking backlink profile — which is a positive signal to Google.
      </p>

      <InfoBox label="HTML Example" color="cyan">
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
          A no-follow link includes <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono">rel="nofollow"</code> in the anchor tag:
        </p>
        <CodeBlock code={`<a href="https://www.example.com" rel="nofollow">Example Website</a>`} />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Compare this to a do-follow link which has <em>no</em> rel attribute at all.
        </p>
      </InfoBox>

      <InfoBox label="When No-follow Links Are Used" color="cyan">
        <BulletList items={[
          'Paid or sponsored content — to signal to Google the link was paid for, not editorially earned.',
          'User-generated content (comments, forums) — to prevent spammers from exploiting links.',
          'Untrusted or unverified external sites — when you want to link out but not vouch for them.',
          'Social media links — most platforms add nofollow to all external links by default.',
        ]} />
      </InfoBox>

      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Tool: NoFollow Chrome Extension
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Install the <strong>NoFollow</strong> browser extension to instantly see which links on any
          page are no-follow — they get highlighted with a red/orange box so you can spot them without
          opening DevTools.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/nofollow/dfogidghaigoomjdeacndafapdijmiid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition"
        >
          <ExternalLink className="w-4 h-4" />
          Install NoFollow Extension for Chrome
        </a>
        <Screenshot
          src="/images/lesson13/dofollow-link-barchart.png"
          alt="Barchart.com article with the NoFollow extension active — a no-follow link 'sites not on GamStop' is highlighted in a red box, making it immediately visible without inspecting the HTML"
          caption="NoFollow extension in action: no-follow links appear highlighted in a red box directly on the page."
        />
      </div>

      <InfoBox label="Do-follow vs No-follow — Quick Summary" color="cyan">
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">Do-follow ✓</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Passes link juice. No rel attribute in HTML.</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">No-follow ✗</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Blocks link juice. Has <code className="font-mono text-[10px]">rel="nofollow"</code> in HTML.</p>
          </div>
        </div>
      </InfoBox>
    </section>
  )
}

function DomainRating() {
  return (
    <section id="domain-rating">
      <TermHeader id="domain-rating" color="violet" />
      <DefinitionCard color="violet">
        A metric developed by <strong>Ahrefs</strong>, Domain Rating (DR) predicts how well a website
        will rank on search engine result pages (SERPs).
      </DefinitionCard>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
        DR represents the overall strength of a website's backlink profile and considers both the
        <strong> size and quality</strong> of the links pointing at a website. DR is plotted on a
        <strong> logarithmic scale from 0–100</strong> — meaning it becomes increasingly harder to move
        up the higher your score gets.
      </p>
      <InfoBox label="Key Points" color="violet">
        <BulletList items={[
          'Developed and maintained by Ahrefs — a leading SEO tool provider.',
          'Higher DR = stronger backlink profile = better ability to rank on Google.',
          'The scale is logarithmic: going from DR 70 to 80 is far harder than 10 to 20.',
          'DR is useful for benchmarking your site against competitors.',
        ]} />
      </InfoBox>
      <InfoBox label="How to Check DR" color="violet">
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">Visit Ahrefs Website Authority Checker:</p>
        <a href="https://ahrefs.com/website-authority-checker" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline font-medium">
          ahrefs.com/website-authority-checker
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </InfoBox>
    </section>
  )
}

function DuplicateContent() {
  return (
    <section id="duplicate-content">
      <TermHeader id="duplicate-content" color="red" />
      <DefinitionCard color="red">
        Duplicate content is <strong>content that appears on multiple web pages, either exactly the
        same or very similar</strong>. It can be on the same website or different websites. Duplicate
        content can negatively impact a website's SEO.
      </DefinitionCard>
      <InfoBox label="Why It's Harmful" color="red">
        <BulletList items={[
          'Search engines struggle to decide which version of the content to rank — leading to both versions ranking poorly.',
          'It can split link equity between multiple URLs, weakening the authority of each.',
          'Severe cases of plagiarism or copied content can result in penalties or de-indexing.',
        ]} />
      </InfoBox>
      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Tool: Duplicate Content Checker</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Use <strong>duplichecker.com</strong> to identify if your content already exists on other
          websites. Paste your text and the tool will scan the web for matching content.
        </p>
        <Screenshot
          src="/images/lesson13/duplicate-content-checker.png"
          alt="duplichecker.com results showing duplicate content detection — the scanned text matched content already published elsewhere"
          caption="duplichecker.com flags content that already exists on other websites."
        />
      </div>
      <YouTubeEmbed videoId="MXvQASyT5uE" caption="Understanding Duplicate Content and its SEO impact" />
    </section>
  )
}

function DeIndex() {
  return (
    <section id="de-index">
      <TermHeader id="de-index" color="orange" />
      <DefinitionCard color="orange">
        De-indexing refers to <strong>removing pages from a search engine's index</strong>. This can
        happen due to website updates, server misconfigurations, or deliberate action, causing search
        engines to remove your content from search results without warning.
      </DefinitionCard>
      <InfoBox label="Common Causes of De-indexing" color="orange">
        <BulletList items={[
          'Duplicate or plagiarised content',
          'Content that lacks credibility or authority',
          'Server misconfigurations (robots.txt blocking crawlers)',
          'Accidental noindex tags on important pages',
          'Manual penalty from Google for guideline violations',
          'An error during a website migration or update',
        ]} />
      </InfoBox>

      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          How to check if a domain or page is indexed in Google:
        </p>
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-xs mb-2 font-mono">Open Google and type:</p>
          <code className="text-green-400 text-sm font-mono block">site:guestpostlinks.net</code>
          <code className="text-green-400 text-sm font-mono block mt-1">site:https://guestpostlinks.net/guest-post-backlinks/</code>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          If your domain is indexed, Google will display the indexed pages. If no results appear, the
          domain is not indexed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-bold text-green-700 dark:text-green-400">Indexed ✓</span>
            </div>
            <Screenshot
              src="/images/lesson13/indexed-domain-guestpostlinks.png"
              alt="Google search for site:guestpostlinks.net showing indexed results — domain is indexed and appearing in search"
              caption="site:guestpostlinks.net — domain is indexed and shows up in Google."
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-bold text-red-700 dark:text-red-400">De-indexed ✗</span>
            </div>
            <Screenshot
              src="/images/lesson13/deindexed-domain-familyhw.png"
              alt="Google search for site:familyhw.com showing no results — domain is de-indexed and not appearing in Google"
              caption="site:familyhw.com — no results means this domain is de-indexed."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function DirectTraffic() {
  return (
    <section id="direct-traffic">
      <TermHeader id="direct-traffic" color="blue" />
      <DefinitionCard color="blue">
        Direct traffic refers to visitors who arrive at your website by <strong>entering your URL
        directly into their browser</strong> or through a bookmark. Unlike organic traffic, direct
        traffic does not come from a click on a search engine results page.
      </DefinitionCard>

      <InfoBox label="Real-World Example" color="blue">
        <p className="text-sm text-gray-700 dark:text-gray-200 italic">
          "I know Nike offers great shoes, and now I want to learn about their latest products.
          To do this, I'll type <strong>Nike.com</strong> directly into my browser and
          <strong> https://www.nike.com/in/</strong> will open. This makes me a direct source of traffic
          for the website."
        </p>
      </InfoBox>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Direct traffic is often a sign of strong brand awareness — people remember and type your URL
        because they already know and trust your brand.
      </p>

      <Screenshot
        src="/images/lesson13/direct-traffic-sources.png"
        alt="Direct Traffic Sources infographic showing 9 sources: URL typed directly, browser bookmark, HTTPS to HTTP referrer, missing or incorrect UTM parameters, links from mobile apps, links within emails or offline documents, incognito browsing, non-web internet traffic, social media platforms, certain browser conditions"
        caption="All the sources that Google Analytics counts as 'Direct Traffic'."
      />
    </section>
  )
}

function Domain() {
  return (
    <section id="domain">
      <TermHeader id="domain" color="purple" />
      <DefinitionCard color="purple">
        A domain is the <strong>main web address or Uniform Resource Locator (URL) of a site</strong> —
        for example, <code className="bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded text-xs font-mono text-purple-700 dark:text-purple-300">www.example.com</code>.
        Domains are important for SEO because search engines consider the domain's age, name, and
        history in their rankings.
      </DefinitionCard>
      <Screenshot
        src="/images/lesson13/domain-anatomy-url.png"
        alt="Anatomy of a URL diagram showing: 1=Protocol (https://), 2=Subdomain (blog.), 3=Domain (example), 4=Top-Level Domain (.com), 5=Subfolder (/subtopic/), 6=Slug (blog-post)"
        caption="The anatomy of a URL — a domain is just one part of the full web address."
      />
      <InfoBox label="Key Parts of a URL" color="purple">
        <div className="grid grid-cols-2 gap-2">
          {[
            { num: '1', label: 'Protocol', ex: 'https://' },
            { num: '2', label: 'Subdomain', ex: 'blog.' },
            { num: '3', label: 'Domain', ex: 'example' },
            { num: '4', label: 'Top-Level Domain', ex: '.com' },
            { num: '5', label: 'Subfolder', ex: '/subtopic/' },
            { num: '6', label: 'Slug', ex: 'blog-post' },
          ].map(p => (
            <div key={p.num} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{p.num}</span>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{p.label}</p>
                <code className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">{p.ex}</code>
              </div>
            </div>
          ))}
        </div>
      </InfoBox>
    </section>
  )
}

function DomainAge() {
  return (
    <section id="domain-age">
      <TermHeader id="domain-age" color="amber" />
      <DefinitionCard color="amber">
        Domain age refers to <strong>how long a domain has been registered and active</strong>. Older
        domains can be seen as more trustworthy by search engines, but the impact of domain age on
        ranking is generally minor compared to other factors like content quality and backlinks.
      </DefinitionCard>
      <InfoBox label="Why It Matters" color="amber">
        <BulletList items={[
          'Search engines associate longevity with trustworthiness — an older domain has more history to evaluate.',
          "Domain age alone won't make a site rank — it's one small factor among hundreds.",
          'A well-optimised new domain will outrank an old, neglected domain.',
        ]} />
      </InfoBox>
      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Check any domain's age:</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Use <strong>whatsmydns.net</strong> to look up when any domain was first registered.
        </p>
        <Screenshot
          src="/images/lesson13/domain-age-checker.png"
          alt="whatsmydns.net Domain Name Age Checker showing guestpostlinks.net was registered on Wednesday 17th of March 2021 — 3 years, 6 months and 1 day or 1281 days"
          caption="guestpostlinks.net was registered on 17 March 2021 — check any domain's age the same way."
        />
      </div>
    </section>
  )
}

function DomainAuthority() {
  const tools = [
    { label: 'Guestpostlinks — Bulk DA PA Checker Tool', url: 'https://guestpostlinks.net/bulk-da-pa-checker-tool/' },
    { label: 'WebsiteSEOChecker', url: 'https://websiteseochecker.com/bulk-check-page-authority/' },
    { label: 'Moz Domain Analysis', url: 'https://moz.com/domain-analysis' },
    { label: 'DapaChecker', url: 'https://www.dapachecker.org/' },
    { label: 'Small SEO Tools — DA Checker', url: 'https://smallseotools.com/domain-authority-checker/' },
    { label: 'PrePostSEO — DA Checker', url: 'https://www.prepostseo.com/domain-authority-checker' },
  ]
  return (
    <section id="domain-authority">
      <TermHeader id="domain-authority" color="emerald" />
      <DefinitionCard color="emerald">
        Domain Authority (DA) is a score developed by <strong>Moz</strong> that predicts how well a
        website will rank on search engine result pages (SERPs). DA scores range from <strong>1 to 100</strong>,
        with higher scores corresponding to a greater ability to rank.
      </DefinitionCard>
      <InfoBox label="How DA is Calculated" color="emerald">
        <BulletList items={[
          'DA is determined by Moz using its own DA and PA (Page Authority) checker tool.',
          'It considers the number and quality of backlinks pointing to your domain.',
          'The score is relative — it is best used to compare your site against competitors, not as an absolute metric.',
          'DA changes over time as your backlink profile grows or decays.',
        ]} />
      </InfoBox>
      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">DA Checker Tools:</p>
        <div className="space-y-2">
          {tools.map(t => <ToolLink key={t.url} label={t.label} url={t.url} />)}
        </div>
      </div>
    </section>
  )
}

function EditorialLink() {
  return (
    <section id="editorial-link">
      <TermHeader id="editorial-link" color="rose" />
      <DefinitionCard color="rose">
        An editorial link is a type of backlink that is <strong>voluntarily given by a website editor
        or author</strong>. These links are typically seen as high-quality and authoritative because
        they are naturally embedded within the content and are contextually relevant.
      </DefinitionCard>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
        Editorial links are a <em>result</em> of producing high-quality content that other websites
        want to link to — they are earned, not bought or requested.
      </p>
      <InfoBox label="Why Editorial Links Are Valuable" color="rose">
        <BulletList items={[
          'Voluntarily given — no money or favour exchanged — making them highly trusted by Google.',
          'Naturally contextual — placed within relevant content, not in footers or sidebars.',
          'Difficult to replicate at scale, so they carry significant SEO weight.',
          'Often come from high-authority publications like Forbes, Entrepreneur, or industry blogs.',
        ]} />
      </InfoBox>
      <div className="my-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Real Example:</p>
        <Screenshot
          src="/images/lesson13/editorial-link-forbes.png"
          alt="Forbes article screenshot with a pink arrow and 'Editorial link' label pointing to 'Loganix' — a link naturally placed in the author bio by the Forbes editor"
          caption="A Forbes editor naturally linked to 'Loganix' in the author bio — that is an editorial link."
        />
      </div>
    </section>
  )
}

// ─────────────────────────────────────
// Main component
// ─────────────────────────────────────
const SECTION_COMPONENTS = [
  CompetitorAnalysis, ContextualLinks, DofollowLink, NofollowLink, DomainRating,
  DuplicateContent, DeIndex, DirectTraffic, Domain,
  DomainAge, DomainAuthority, EditorialLink,
]

export default function Lesson13KeyTerminologies() {
  const [activeTerm, setActiveTerm] = useState(TERMS[0].id)
  const refsMap = useRef<Map<string, HTMLElement>>(new Map())

  const setRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) refsMap.current.set(id, el)
    else refsMap.current.delete(id)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveTerm(e.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )
    refsMap.current.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = refsMap.current.get(id)
    if (!el) return
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveTerm(id)
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-2">Module 2 · Lesson 13</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Key Terminologies in Content Marketing — 2</h1>
          <p className="text-violet-100 text-sm leading-relaxed max-w-xl">
            12 essential SEO and content marketing terms: Competitor Analysis, Contextual Links,
            Do-follow &amp; No-follow Links, Domain Authority, Editorial Links, and more.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-violet-200">
            <span>📚 12 Terms</span>
            <span>🖼️ 12 Screenshots</span>
            <span>▶️ 2 Videos</span>
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
                activeTerm === t.id
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
                    activeTerm === t.id
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
        {SECTION_COMPONENTS.map((SectionComp, i) => {
          const term = TERMS[i]
          return (
            <motion.div
              key={term.id}
              ref={setRef(term.id)}
              id={term.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SectionComp />
            </motion.div>
          )
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-16 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 rounded-2xl border border-violet-100 dark:border-violet-900 p-8">
        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-4">Module 2 — Key Terms Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TERMS.map(t => {
            const Icon = t.icon
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
