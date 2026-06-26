'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, RotateCcw, Clock, BookOpen, Send,
} from 'lucide-react'
import { getQuizAttempts, saveQuizAttempt, getAttemptLimit, type QuizAttempt } from '@/lib/quiz-attempts'

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const TOTAL_TIME = 15 * 60   // 15 minutes for 20 questions
const MAX_TAB_SWITCHES = 3
const LESSON_ID = 20
const MAX_ATTEMPTS = 5

type Phase = 'intro' | 'quiz' | 'results'

interface MCQ {
  id: number
  text: string
  options: string[]
  correct: number
  explanation: string
}

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

// ─────────────────────────────────────
// Questions  (A=0, B=1, C=2)
// Answer spread: A×7, B×7, C×6 — well balanced
// Covers all 11 terms from Lesson 19 (Key Terminologies-5)
// ─────────────────────────────────────
const questions: MCQ[] = [
  // Q1 — LSI Keywords (definition) — correct: A (0)
  {
    id: 1,
    text: "What are Latent Semantic Indexing (LSI) keywords in the context of SEO?",
    options: [
      "Conceptually related terms that search engines use to understand the full context of a webpage's content",
      "A list of the exact keywords that appear most frequently within a webpage",
      "A Google tool used to track keyword rankings across different search engines",
    ],
    correct: 0,
    explanation: "LSI keywords are conceptually related terms — not just repeated keywords. For example, an article about cold brew coffee might have LSI keywords like 'filter', 'grind', 'cold water', and 'temperature'. These help Google understand the topic more deeply.",
  },

  // Q2 — Meta Description (purpose) — correct: B (1)
  {
    id: 2,
    text: "What is the primary SEO purpose of a meta description?",
    options: [
      "To directly boost a page's position in Google's ranking algorithm",
      "To influence click-through rates by summarising the page content in search results",
      "To tell search engines which specific keywords the page should be ranked for",
    ],
    correct: 1,
    explanation: "A meta description is displayed beneath your page title in search results. While it does not directly affect rankings, a well-written meta description can significantly improve click-through rates by giving users a compelling reason to click your link.",
  },

  // Q3 — Meta Keywords (reason abandoned) — correct: C (2)
  {
    id: 3,
    text: "Why did Google stop using the meta keywords tag in its ranking algorithm?",
    options: [
      "The tag was too technically difficult for Google's crawlers to parse accurately",
      "It slowed down page indexing and negatively impacted overall site performance",
      "It was frequently abused by webmasters stuffing it with unrelated keywords to manipulate search rankings",
    ],
    correct: 2,
    explanation: "Google announced in 2009 that it no longer uses the meta keywords tag. The reason was widespread abuse — webmasters would stuff the tag with dozens of unrelated keywords to try to rank for more searches, making the tag unreliable and meaningless for ranking purposes.",
  },

  // Q4 — Meta Description (length) — correct: A (0)
  {
    id: 4,
    text: "What is the recommended length for a meta description to avoid being truncated in Google search results?",
    options: [
      "150–160 characters",
      "50–75 characters",
      "300–400 characters",
    ],
    correct: 0,
    explanation: "Meta descriptions should be between 150–160 characters. Shorter than 150 characters may not give enough information to attract clicks; longer than 160 characters will be cut off with '...' in search results, potentially hiding the most important part of your message.",
  },

  // Q5 — Metric (definition) — correct: B (1)
  {
    id: 5,
    text: "Which of the following best describes a 'metric' in digital marketing and SEO?",
    options: [
      "A type of meta tag used to indicate the primary keyword of a webpage",
      "A quantifiable measure used to track and assess the performance of a specific process or strategy",
      "A backlink score automatically assigned to a webpage by tools like Moz or Ahrefs",
    ],
    correct: 1,
    explanation: "A metric is a quantifiable measure — something you can count or measure to track performance. In SEO, common metrics include organic traffic, keyword rankings, Domain Authority (DA), Domain Rating (DR), Page Authority (PA), and bounce rate.",
  },

  // Q6 — Noindex Tag (effect) — correct: C (2)
  {
    id: 6,
    text: "What is the actual effect on a page that has a noindex tag correctly applied to it?",
    options: [
      "The page loads faster because search engine crawlers skip it entirely",
      "The page receives a ranking boost as it is treated as exclusive, members-only content",
      "The page will be crawled by search engines but will not appear in any search results",
    ],
    correct: 2,
    explanation: "A noindex tag does not prevent crawling — search engines can still visit and read the page. What it does is instruct the search engine not to include that page in its index, meaning it will never appear in search results for any query.",
  },

  // Q7 — On-page SEO (technique) — correct: A (0)
  {
    id: 7,
    text: "Which of the following is an on-page SEO technique?",
    options: [
      "Optimising title tags, headings, meta descriptions, and content directly on your website pages",
      "Earning backlinks from other authoritative websites in your industry",
      "Getting brand mentions and shares on third-party social media platforms",
    ],
    correct: 0,
    explanation: "On-page SEO encompasses all techniques applied directly on your website's pages — title tags, headings (H1–H6), meta descriptions, image alt text, internal links, URL structure, and content optimisation. Backlinks and social signals are off-page SEO activities.",
  },

  // Q8 — Niche (definition) — correct: B (1)
  {
    id: 8,
    text: "What does 'niche' refer to in the context of content marketing?",
    options: [
      "A broad market category designed to target the widest possible online audience",
      "A specialised segment of a broader market that focuses on a specific topic, audience, or product type",
      "The featured section of a website's homepage that targets new first-time visitors",
    ],
    correct: 1,
    explanation: "A niche is a specialised, narrowed-down segment of a broader market. Instead of targeting everyone interested in 'health', a niche might be 'yoga for seniors'. The more specific the niche, the more targeted and engaged the audience tends to be.",
  },

  // Q9 — No-follow (common use) — correct: C (2)
  {
    id: 9,
    text: "In which situations is the nofollow attribute most commonly applied to links?",
    options: [
      "Internal links between pages on the same website",
      "Links to your own homepage included in every page's header or footer",
      "Sponsored advertisements, paid links, and user-generated content such as comments and forum posts",
    ],
    correct: 2,
    explanation: "The nofollow attribute is commonly used for sponsored content, paid links, and user-generated content (comments, forum threads) — situations where you cannot personally vouch for the quality or trustworthiness of the linked page. It prevents search engines from treating the link as an endorsement.",
  },

  // Q10 — LSI Keywords (example) — correct: A (0)
  {
    id: 10,
    text: "If you write an article about cold brew coffee, which of the following is an example of an LSI keyword for that article?",
    options: [
      "Terms like 'filter', 'grind', 'cold water', and 'temperature' that relate to the brewing process",
      "The exact phrase 'cold brew coffee' repeated many times throughout the article to boost density",
      "Competitor website names that also publish content about coffee-related topics",
    ],
    correct: 0,
    explanation: "LSI keywords for a cold brew coffee article are semantically related terms — words you would naturally use when discussing the topic, like 'filter', 'grind', 'cold water', 'temperature', and 'ice'. These are NOT repeated instances of the main keyword (that would be keyword stuffing).",
  },

  // Q11 — Off-page SEO (primary goal) — correct: B (1)
  {
    id: 11,
    text: "What is the primary goal of off-page SEO?",
    options: [
      "To optimise the meta tags, headings, and written content directly on your website's pages",
      "To improve your site's credibility and authority through actions taken outside your own website",
      "To increase page loading speed and fix technical errors within your site's code",
    ],
    correct: 1,
    explanation: "Off-page SEO focuses on building your website's reputation and authority through external sources — primarily backlinks from other websites, brand mentions, and social signals. These external signals tell search engines that other reputable sites trust and endorse your content.",
  },

  // Q12 — No-referrer (function) — correct: C (2)
  {
    id: 12,
    text: "What does the 'noreferrer' attribute do when used on a link?",
    options: [
      "It tells search engines not to pass any link equity or ranking power to the destination page",
      "It prevents the linked page from opening in a new browser tab when clicked",
      "It stops the destination website from receiving information about which page sent the visitor",
    ],
    correct: 2,
    explanation: "The noreferrer attribute removes the HTTP referrer header when a user clicks the link. This means the destination website cannot see which page sent the visitor — the traffic appears as 'Direct' in their analytics. It protects user privacy but makes referral tracking more difficult.",
  },

  // Q13 — Noopener (security) — correct: A (0)
  {
    id: 13,
    text: "Why is the 'noopener' attribute important for website security?",
    options: [
      "It prevents the newly opened page from accessing and potentially manipulating the original page through the browser's window object",
      "It hides the destination URL from the visitor's browser history after they click the link",
      "It instructs search engine crawlers not to index the content of the linked page",
    ],
    correct: 0,
    explanation: "Without 'noopener', a page opened with target=\"_blank\" can use JavaScript to access window.opener and potentially redirect or modify the original page — a known security exploit. The noopener attribute blocks this access, protecting your users from such manipulation.",
  },

  // Q14 — Meta Keywords (year) — correct: B (1)
  {
    id: 14,
    text: "In which year did Google publicly announce that it no longer uses the meta keywords tag in its ranking algorithm?",
    options: [
      "2005",
      "2009",
      "2015",
    ],
    correct: 1,
    explanation: "Google made a public announcement in 2009 confirming it does not use the meta keywords meta tag as a ranking signal. This was due to the widespread abuse of the tag. Bing and most other major search engines followed suit and also stopped using it.",
  },

  // Q15 — Noindex Tag (appropriate pages) — correct: A (0)
  {
    id: 15,
    text: "Which of the following page types is MOST appropriate for applying a noindex tag?",
    options: [
      "A 'Thank You' confirmation page shown after a form submission with no independent SEO value",
      "A product page with detailed descriptions, rich media, and consistent high organic traffic",
      "A homepage that is the primary entry point for visitors arriving from search results",
    ],
    correct: 0,
    explanation: "'Thank you' pages, login pages, duplicate archive pages, thin content pages, and ad landing pages are suitable for noindex because they serve no purpose in search results. Homepages and high-value product pages should never be noindexed, as they need to appear in search results.",
  },

  // Q16 — Off-page SEO (example) — correct: B (1)
  {
    id: 16,
    text: "Which of the following is an example of an off-page SEO technique?",
    options: [
      "Optimising the H1 heading and page URL slug on a blog post",
      "Earning a backlink from an authoritative website that links to your content",
      "Adding internal links between related pages on your own website",
    ],
    correct: 1,
    explanation: "Earning backlinks from other websites is a classic off-page SEO technique — it happens outside your own site. Optimising H1 tags and internal linking are both on-page SEO activities because they involve changes made directly to your own website.",
  },

  // Q17 — No-follow (function) — correct: C (2)
  {
    id: 17,
    text: "What does the 'nofollow' link attribute instruct search engines to do?",
    options: [
      "Rank the linked page higher as an endorsement from your site",
      "Crawl the linked page more frequently since you consider it important",
      "Not follow the link or pass any link equity or ranking credit to the linked page",
    ],
    correct: 2,
    explanation: "The nofollow attribute tells search engine crawlers: 'Do not treat this as an endorsement, and do not pass any link equity (PageRank) to the linked page.' It does not prevent users from clicking the link — only the search engine signal is affected.",
  },

  // Q18 — Noopener + No-referrer (combined use) — correct: A (0)
  {
    id: 18,
    text: "When linking to an external website you are unfamiliar with using target=\"_blank\", which combination of attributes is recommended for maximum security and privacy?",
    options: [
      'rel="noopener noreferrer"',
      'rel="nofollow noindex"',
      'rel="sponsored dofollow"',
    ],
    correct: 0,
    explanation: 'The combination rel="noopener noreferrer" provides both security (noopener prevents the new page from manipulating the original) and privacy (noreferrer prevents the destination site from seeing where the visitor came from). This combination is best practice for any link opening in a new tab to an unfamiliar external site.',
  },

  // Q19 — On-page vs Off-page (NOT on-page) — correct: B (1)
  {
    id: 19,
    text: "Which of the following is NOT considered an on-page SEO element?",
    options: [
      "Image alt text and page title tags",
      "Backlinks from other websites pointing to your content",
      "Internal links connecting related pages on your website",
    ],
    correct: 1,
    explanation: "Backlinks come from other websites — they are an off-page SEO factor you cannot directly control on your own site. Image alt text, title tags, and internal links are all on-page SEO elements because they are implemented directly on your own website's pages.",
  },

  // Q20 — Niche (best example) — correct: C (2)
  {
    id: 20,
    text: "Which of the following is the best example of a niche market in content marketing?",
    options: [
      '"Shopping" — targeting all online consumers who make any kind of purchase',
      '"Health" — targeting everyone broadly interested in any aspect of wellbeing',
      '"Yoga for seniors" — targeting a specific activity for a specific demographic group',
    ],
    correct: 2,
    explanation: "A niche is defined by its specificity and focus. 'Shopping' and 'Health' are extremely broad markets. 'Yoga for seniors' is a genuine niche — it targets a specific activity (yoga) for a specific audience (seniors), allowing for highly targeted content, less competition, and more engaged readers.",
  },
]

// ─────────────────────────────────────
// Circular Timer
// ─────────────────────────────────────
function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c * (1 - timeLeft / TOTAL_TIME)
  const color = timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : '#7c3aed'
  const pulse = timeLeft < 60
  return (
    <div className={`relative inline-flex items-center justify-center ${pulse ? 'animate-pulse' : ''}`}>
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="7" className="dark:stroke-gray-700" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-base font-bold tabular-nums leading-none" style={{ color }}>{fmt(timeLeft)}</span>
        <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">left</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────
// Question Grid
// ─────────────────────────────────────
function QGrid({ current, answers, onJump }: {
  current: number; answers: Record<number, string>; onJump: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {questions.map((_, i) => (
        <button key={i} onClick={() => onJump(i)} title={`Question ${i + 1}`}
          className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
            i === current ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-gray-900' : ''
          } ${
            answers[i] !== undefined
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────
// Intro Screen
// ─────────────────────────────────────
function IntroScreen({ onStart, attempts, attemptsLoading, maxAttempts }: {
  onStart: () => void; attempts: QuizAttempt[]; attemptsLoading: boolean; maxAttempts: number
}) {
  const meta = [
    { label: 'Duration', value: '15 minutes' },
    { label: 'Questions', value: '20' },
    { label: 'Marks', value: '20' },
    { label: 'Pass Mark', value: '100%' },
  ]
  const rules = [
    'Once started, the timer cannot be paused.',
    'Switching browser tabs is restricted — 3 violations will auto-terminate the test.',
    'All questions must be answered within the allotted time.',
    'Unanswered questions will be counted as incorrect.',
    'You can navigate between questions freely using the number grid.',
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-violet-300" />
            <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest">Module 2 · Test</p>
          </div>
          <h2 className="text-2xl font-bold mb-2">Test: Key Terminologies-5</h2>
          <p className="text-violet-100 text-sm">20 questions covering LSI Keywords, Meta Description, Meta Keywords, Metric, No-follow, Noindex Tag, Noopener, No-referrer, Niche, Off-page SEO, and On-page SEO.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {meta.map(m => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{m.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">Important Rules</p>
        </div>
        <ul className="space-y-2">
          {rules.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
              <span className="font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Past Attempts */}
      {attemptsLoading ? (
        <div className="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      ) : attempts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Your Attempts</p>
          <div className="space-y-2">
            {attempts.map((a, i) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Attempt {attempts.length - i}</span>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${a.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {a.score}/{a.total_questions}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    a.passed ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
                    a.terminated ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                    'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                  }`}>{a.terminated ? 'Terminated' : a.passed ? 'Passed' : 'Failed'}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          {attempts.length < maxAttempts && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              {maxAttempts - attempts.length} attempt{maxAttempts - attempts.length !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>
      )}

      {/* Start button — disabled when max attempts reached */}
      {attempts.length >= maxAttempts ? (
        <div className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold text-base text-center">
          Maximum attempts reached ({maxAttempts}/{maxAttempts})
        </div>
      ) : (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onStart}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-base shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900 transition-shadow">
          Start Test →
        </motion.button>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────
// Results Screen
// ─────────────────────────────────────
function ResultsScreen({ answers, terminated, timeUsed, onRetry }: {
  answers: Record<number, string>; terminated: boolean; timeUsed: number; onRetry: () => void
}) {
  let correct = 0
  questions.forEach((q, i) => {
    if (answers[i] !== undefined && parseInt(answers[i]) === q.correct) correct++
  })
  const passed = correct === questions.length && !terminated

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className={`rounded-3xl p-8 text-white relative overflow-hidden ${
        terminated ? 'bg-gradient-to-br from-red-600 to-rose-700' :
        passed     ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
                     'bg-gradient-to-br from-amber-500 to-orange-600'
      }`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-black">{correct}/{questions.length}</div>
            <div className="text-sm opacity-80 mt-1">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">
              {terminated ? 'Test Terminated' : passed ? 'Perfect Score!' : 'Almost There!'}
            </div>
            <div className="text-sm opacity-90">
              {terminated
                ? 'Tab switching limit exceeded.'
                : passed
                ? 'All 20 questions answered correctly!'
                : `${questions.length - correct} question${questions.length - correct !== 1 ? 's' : ''} need review.`}
            </div>
            <div className="text-xs opacity-70 mt-2">Time used: {fmt(timeUsed)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correct',   value: correct,                                        color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'Incorrect', value: questions.length - correct,                     color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950',         border: 'border-red-200 dark:border-red-800'         },
          { label: 'Skipped',   value: questions.length - Object.keys(answers).length, color: 'text-gray-500 dark:text-gray-400',       bg: 'bg-gray-50 dark:bg-gray-900',       border: 'border-gray-200 dark:border-gray-700'       },
        ].map(s => (
          <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="font-bold text-gray-900 dark:text-gray-50 mb-3 text-sm">Answer Review</p>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const isCorrect  = userAnswer !== undefined && parseInt(userAnswer) === q.correct
            const isWrong    = userAnswer !== undefined && !isCorrect
            const unanswered = userAnswer === undefined
            return (
              <div key={q.id} className={`rounded-xl border p-4 ${
                isCorrect  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950' :
                isWrong    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950' :
                             'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect  ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                     isWrong    ? <XCircle className="w-4 h-4 text-red-500" /> :
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">Q{q.id}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 leading-snug">{q.text}</p>
                    {isWrong && (
                      <div className="space-y-1">
                        <p className="text-xs text-red-600 dark:text-red-400">Your answer: <span className="font-semibold">{q.options[parseInt(userAnswer)]}</span></p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Correct: <span className="font-semibold">{q.options[q.correct]}</span></p>
                      </div>
                    )}
                    {unanswered && <p className="text-xs text-gray-400 dark:text-gray-500">Not answered</p>}
                    {isWrong && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onRetry}
        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        <RotateCcw className="w-4 h-4" />
        Retake Test
      </motion.button>
    </motion.div>
  )
}

// ─────────────────────────────────────
// Tab Warning Modal
// ─────────────────────────────────────
function TabWarning({ count, countdown, onDismiss }: { count: number; countdown: number; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Tab Switch Detected</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          This is warning <strong className="text-amber-600 dark:text-amber-400">{count}</strong> of {MAX_TAB_SWITCHES}.
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {MAX_TAB_SWITCHES - count} more {MAX_TAB_SWITCHES - count === 1 ? 'violation' : 'violations'} will terminate your test.
        </p>
        <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-4 tabular-nums">{countdown}</div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onDismiss}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl">
          Return to Test
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────
// Submit Confirm Modal
// ─────────────────────────────────────
function SubmitConfirm({ unanswered, onConfirm, onCancel }: {
  unanswered: number; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Submit Test?</h3>
        {unanswered > 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You have <strong className="text-amber-600 dark:text-amber-400">{unanswered} unanswered question{unanswered !== 1 ? 's' : ''}</strong>. These will count as incorrect.
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">All 20 questions answered. Ready to submit?</p>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Continue
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition">
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────
// Main Component
// ─────────────────────────────────────
export default function Lesson20Quiz() {
  const [phase, setPhase]       = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers]   = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [warningOpen, setWarningOpen] = useState(false)
  const [warningCountdown, setWarningCountdown] = useState(10)
  const [terminated, setTerminated] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [direction, setDirection] = useState(1)

  const [attempts, setAttempts]           = useState<QuizAttempt[]>([])
  const [attemptsLoading, setAttemptsLoading] = useState(true)
  const [maxAttempts, setMaxAttempts] = useState(MAX_ATTEMPTS)
  const savedRef = useRef(false)

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const warnRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const tabCountRef = useRef(0)

  useEffect(() => {
    Promise.all([
      getQuizAttempts(LESSON_ID),
      getAttemptLimit(LESSON_ID),
    ]).then(([data, limit]) => {
      setAttempts(data)
      setMaxAttempts(limit)
      setAttemptsLoading(false)
    })
  }, [])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'quiz') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setPhase('results'); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  // Tab switching detection
  useEffect(() => {
    if (phase !== 'quiz') return
    const onVis = () => {
      if (!document.hidden) return
      tabCountRef.current += 1
      const c = tabCountRef.current
      setTabSwitches(c)
      if (c >= MAX_TAB_SWITCHES) {
        setTerminated(true)
        clearInterval(timerRef.current!)
        setPhase('results')
        return
      }
      setWarningCountdown(10)
      setWarningOpen(true)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [phase])

  // Warning countdown
  useEffect(() => {
    if (!warningOpen) return
    warnRef.current = setInterval(() => {
      setWarningCountdown(prev => {
        if (prev <= 1) { clearInterval(warnRef.current!); setWarningOpen(false); return 10 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(warnRef.current!)
  }, [warningOpen])

  useEffect(() => {
    if (phase !== 'results' || savedRef.current) return
    savedRef.current = true
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && parseInt(answers[i]) === q.correct) correct++
    })
    const passed = correct === questions.length && !terminated
    saveQuizAttempt({ lesson_id: LESSON_ID, score: correct, total_questions: questions.length, pass_mark: questions.length, passed, terminated, time_used: TOTAL_TIME - timeLeft, answers: answers as Record<string, string> })
      .then((saved) => {
        if (saved) {
          fetch('/api/notify/quiz-submitted', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId: LESSON_ID, score: correct, totalQuestions: questions.length, passed, needsReview: false }),
          }).catch(() => {})
        }
        return getQuizAttempts(LESSON_ID).then(setAttempts)
      })
  }, [phase, answers, terminated, timeLeft])

  const go = (dir: number) => {
    const next = currentQ + dir
    if (next < 0 || next >= questions.length) return
    setDirection(dir)
    setCurrentQ(next)
  }

  const jumpTo = (i: number) => { setDirection(i > currentQ ? 1 : -1); setCurrentQ(i) }

  const unanswered = questions.length - Object.keys(answers).length
  const q = questions[currentQ]

  const handleRetry = () => {
    savedRef.current = false
    setPhase('intro'); setCurrentQ(0); setAnswers({}); setTimeLeft(TOTAL_TIME)
    setTabSwitches(0); setTerminated(false); setShowSubmit(false); tabCountRef.current = 0
  }

  if (phase === 'intro')   return <IntroScreen onStart={() => setPhase('quiz')} attempts={attempts} attemptsLoading={attemptsLoading} maxAttempts={maxAttempts} />
  if (phase === 'results') return <ResultsScreen answers={answers} terminated={terminated} timeUsed={TOTAL_TIME - timeLeft} onRetry={handleRetry} />

  return (
    <div className="space-y-4">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Test in Progress</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Key Terminologies-5</p>
        </div>
        <div className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`font-bold tabular-nums text-sm ${timeLeft < 60 ? 'text-red-500' : timeLeft < 180 ? 'text-amber-500' : 'text-violet-600 dark:text-violet-400'}`}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{Object.keys(answers).length} answered</span>
        <span>{unanswered} remaining</span>
      </div>

      {/* Main layout */}
      <div className="flex gap-5 items-start">

        {/* Question panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQ}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.22 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              {/* Question header */}
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-violet-700 dark:text-violet-400">
                    {(currentQ + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">/ {questions.length}</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  1 Mark
                </span>
              </div>

              {/* Options */}
              <div className="p-6 space-y-5">
                <p className="text-gray-900 dark:text-gray-50 font-semibold text-[15px] leading-relaxed">{q.text}</p>
                <div className="space-y-2.5">
                  {q.options.map((opt, oi) => {
                    const selected = answers[currentQ] === oi.toString()
                    const letter = ['A', 'B', 'C'][oi]
                    return (
                      <motion.button key={oi} whileTap={{ scale: 0.99 }}
                        onClick={() => setAnswers(a => ({ ...a, [currentQ]: oi.toString() }))}
                        className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all ${
                          selected
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950'
                            : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition ${
                          selected ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {letter}
                        </span>
                        <p className={`text-sm flex-1 ${selected ? 'text-violet-900 dark:text-violet-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                          {opt}
                        </p>
                        {selected && <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Nav */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => go(-1)} disabled={currentQ === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </motion.button>
                {currentQ === questions.length - 1 ? (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSubmit(true)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition">
                    <Send className="w-4 h-4" /> Submit Test
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => go(1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition">
                    Next <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col gap-4 w-56 flex-shrink-0 sticky top-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Time Left</p>
            <CircularTimer timeLeft={timeLeft} />
            {tabSwitches > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">
                ⚠️ {tabSwitches}/{MAX_TAB_SWITCHES} tab switches
              </p>
            )}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Questions</p>
            <QGrid current={currentQ} answers={answers} onJump={jumpTo} />
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
              </div>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSubmit(true)}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-sm transition">
            <Send className="w-4 h-4" /> Submit Test
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {warningOpen && (
          <TabWarning count={tabSwitches} countdown={warningCountdown}
            onDismiss={() => { clearInterval(warnRef.current!); setWarningOpen(false) }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSubmit && (
          <SubmitConfirm unanswered={unanswered}
            onConfirm={() => { clearInterval(timerRef.current!); setPhase('results') }}
            onCancel={() => setShowSubmit(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
