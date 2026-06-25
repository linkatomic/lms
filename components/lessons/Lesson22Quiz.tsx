'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, RotateCcw, Clock, BookOpen, Send,
} from 'lucide-react'

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const TOTAL_TIME = 15 * 60   // 15 minutes for 20 questions
const MAX_TAB_SWITCHES = 3

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
// Answer spread: A×7, B×7, C×6 — balanced
// Covers all 10 terms from Lesson 21 (Key Terminologies-6):
// Organic Search Results, Organic Traffic, Outbound Link, Paid Link,
// Primary Keyword, Paid Search, PBN, Page Authority, Plagiarism, Referral Traffic
// ─────────────────────────────────────
const questions: MCQ[] = [
  // Q1 — Organic Search Results (definition) — correct: A (0)
  {
    id: 1,
    text: "What makes organic search results different from paid advertisements on a search engine results page (SERP)?",
    options: [
      "They are non-paid listings ranked by search engine algorithms based on relevance to the search terms",
      "They always appear at the very top of the search page, above every paid ad",
      "They are shown exclusively to users who have an active and signed-in Google account",
    ],
    correct: 0,
    explanation: "Organic search results are non-paid — they appear because of their relevance to the search query, as determined by the search engine's algorithm. Paid ads (marked 'Sponsored') often appear above organic results, not the other way around.",
  },

  // Q2 — Paid Link (definition & risk) — correct: B (1)
  {
    id: 2,
    text: "What is a 'Paid Link' in SEO, and why is it considered a problem?",
    options: [
      "A link shared freely between two websites for mutual content benefits — it is generally accepted by Google",
      "A link for which the site owner paid money — it violates Google's Webmaster Guidelines and can artificially inflate a page's importance",
      "A link placed inside a paid display advertisement that directs users to a product landing page",
    ],
    correct: 1,
    explanation: "A paid link is one where the site owner pays another website to include a link pointing to theirs. Google explicitly prohibits this because such links can manipulate search rankings unfairly. Both the buying and selling site risk manual penalties if detected.",
  },

  // Q3 — Page Authority (developer) — correct: C (2)
  {
    id: 3,
    text: "Page Authority (PA) is a metric that predicts how well a specific web page will rank. Which company developed it?",
    options: [
      "Google",
      "Ahrefs",
      "Moz",
    ],
    correct: 2,
    explanation: "Page Authority is a metric developed by Moz, measured on a scale of 1 to 100. Google and Ahrefs have their own separate metrics (PageRank and URL Rating, respectively), but Page Authority specifically refers to Moz's score.",
  },

  // Q4 — PBN (acronym) — correct: A (0)
  {
    id: 4,
    text: "In the context of SEO, what does the acronym PBN stand for?",
    options: [
      "Private Blog Network",
      "Public Blog Network",
      "Paid Blog Network",
    ],
    correct: 0,
    explanation: "PBN stands for Private Blog Network — a group of websites secretly controlled by one person or entity, used to build backlinks to a target site in order to manipulate its search rankings. It is a black-hat SEO technique.",
  },

  // Q5 — Organic Traffic (definition) — correct: B (1)
  {
    id: 5,
    text: "How does organic traffic differ from other types of website traffic?",
    options: [
      "It comes exclusively from social media platforms such as Facebook, LinkedIn, and Instagram",
      "It comes from unpaid search engine results when users click a non-ad link after a search query",
      "It is traffic purchased through paid search advertising campaigns like Google Ads",
    ],
    correct: 1,
    explanation: "Organic traffic arrives when a user performs a search and clicks on a non-advertisement result — no payment is involved. Social media traffic is called 'social traffic', and paid campaign traffic is called 'paid traffic' — both are distinct from organic.",
  },

  // Q6 — Plagiarism (definition) — correct: C (2)
  {
    id: 6,
    text: "Which of the following is the correct description of plagiarism?",
    options: [
      "Quoting someone else's work verbatim while using quotation marks and fully citing the original source",
      "Writing content inspired by another author's topic, while using entirely your own original words and ideas",
      "Presenting someone else's work, ideas, or words as your own — whether intentionally or accidentally — without giving proper credit",
    ],
    correct: 2,
    explanation: "Plagiarism is presenting someone else's content as your own, intentionally or not. Option A describes proper citation (not plagiarism), and Option B describes inspiration — using a topic as inspiration while writing original content is acceptable.",
  },

  // Q7 — Primary Keyword (definition) — correct: A (0)
  {
    id: 7,
    text: "What is the primary keyword on a webpage?",
    options: [
      "The main term or phrase the page is specifically built and optimised to rank for in search results",
      "Any keyword that is currently trending on social media or in a Google Trends report",
      "A keyword used exclusively in paid Google Ads campaigns targeting that particular page",
    ],
    correct: 0,
    explanation: "The primary keyword is the single core term your page targets — it is the focus of all your content and should appear naturally in the title, H1, meta description, URL, and body. Trending keywords and paid keywords are entirely different concepts.",
  },

  // Q8 — Paid Search (model) — correct: B (1)
  {
    id: 8,
    text: "Which of the following best describes how the Paid Search advertising model works?",
    options: [
      "Advertisers pay a fixed monthly fee to guarantee their website appears at the top of all search results",
      "Advertisers bid for ad placement and are charged each time a user actually clicks their ad — known as Pay-Per-Click (PPC)",
      "Websites pay search engines a fee to boost their organic keyword rankings in the natural search results",
    ],
    correct: 1,
    explanation: "Paid Search works on a Pay-Per-Click model — advertisers only pay when a user clicks their ad, not simply for it being displayed. There is no flat-fee guarantee of top placement, and paying search engines does not improve organic rankings (that is the domain of SEO).",
  },

  // Q9 — Referral Traffic (definition) — correct: C (2)
  {
    id: 9,
    text: "How is referral traffic defined in digital marketing?",
    options: [
      "Traffic that arrives when a user types your website address directly into the browser bar without clicking any link",
      "Traffic generated through your own paid search or display advertising campaigns",
      "Visitors who arrive at your website by clicking a link located on a different website",
    ],
    correct: 2,
    explanation: "Referral traffic comes from other websites — when another site links to yours and a user clicks that link. Option A describes direct traffic, and Option B describes paid traffic. Both are separate categories in Google Analytics.",
  },

  // Q10 — Outbound Link (definition) — correct: A (0)
  {
    id: 10,
    text: "What is an outbound link?",
    options: [
      "A link on your website that points to a page on a completely different domain",
      "A link that connects two separate pages within the same website",
      "A link from another website that points back to a page on your own site",
    ],
    correct: 0,
    explanation: "An outbound link goes OUT from your site to another domain. A link between pages on your own site is an internal link. A link from another site to yours is an inbound link (backlink). These three are the main link types in SEO.",
  },

  // Q11 — PBN (risk) — correct: B (1)
  {
    id: 11,
    text: "Why is operating a Private Blog Network (PBN) considered a high-risk SEO strategy?",
    options: [
      "PBNs are expensive to build and require ongoing investment to maintain across multiple domains",
      "They violate Google's Webmaster Guidelines and can result in a manual action penalty, causing pages to lose rankings or be deindexed entirely",
      "Links from PBN sites are automatically categorised as referral traffic rather than backlinks, reducing their SEO effectiveness",
    ],
    correct: 1,
    explanation: "The core risk of PBNs is Google's response — using PBN links to manipulate rankings violates their guidelines. When detected, Google can issue a manual penalty that removes your pages from search results. The cost or traffic categorisation are not the primary concerns.",
  },

  // Q12 — Organic Traffic (tools) — correct: C (2)
  {
    id: 12,
    text: "Which combination of tools is used to track and analyse organic traffic to a website?",
    options: [
      "Photoshop, Microsoft Word, and Canva",
      "Facebook Ads Manager, YouTube Analytics, and TikTok Studio",
      "Google Analytics, Ahrefs, SEMrush, and Similarweb",
    ],
    correct: 2,
    explanation: "Google Analytics (GA) is the primary tool for tracking organic traffic behaviour on your site. Ahrefs, SEMrush, and Similarweb provide organic traffic estimates and keyword data from an external perspective. Options A and B are design or social media tools, not SEO analytics tools.",
  },

  // Q13 — Page Authority (scale) — correct: A (0)
  {
    id: 13,
    text: "On what numerical scale is Page Authority (PA) measured by Moz?",
    options: [
      "1 to 100",
      "0 to 10",
      "1 to 1000",
    ],
    correct: 0,
    explanation: "Page Authority is measured on a scale of 1 to 100 — with 100 being the highest possible authority. A score of 0–10 is a different scale (sometimes used by other metrics), and 1–1000 does not correspond to any standard SEO metric.",
  },

  // Q14 — Outbound Link (benefit) — correct: B (1)
  {
    id: 14,
    text: "How can linking to high-quality external websites potentially benefit your own website?",
    options: [
      "It guarantees your page will outrank the linked website for any shared keywords",
      "It can improve your site's credibility and may positively influence your own search rankings",
      "It directly increases your own Domain Authority score in Moz's algorithm",
    ],
    correct: 1,
    explanation: "Outbound links to reputable, relevant sources signal to search engines that your content is well-researched and trustworthy, which can indirectly support your rankings. They do not guarantee outranking the linked site, and they do not directly raise your Domain Authority.",
  },

  // Q15 — Paid Link (consequence) — correct: C (2)
  {
    id: 15,
    text: "According to Google's guidelines, what is the most likely consequence for a website caught buying links to inflate its search rankings?",
    options: [
      "The page receives a short-term ranking boost before Google's algorithm returns it to its natural position",
      "The purchased links are simply ignored by Google's algorithm and have no effect on rankings",
      "The site risks receiving a manual action penalty from Google, which can cause significant ranking drops or removal from search results",
    ],
    correct: 2,
    explanation: "Buying links is a direct violation of Google's Webmaster Guidelines. When detected, Google can issue a manual action penalty — a serious punishment that can remove pages from the index or drop them far down in rankings. Google does not simply ignore paid links or gently 'undo' their effect.",
  },

  // Q16 — Plagiarism (type: paraphrasing) — correct: A (0)
  {
    id: 16,
    text: "Which form of plagiarism involves rewriting someone else's ideas in your own words without acknowledging the original source?",
    options: [
      "Paraphrasing without citation — rewriting someone's ideas but failing to credit them",
      "Verbatim copying — reproducing exact text without quotation marks",
      "Proper attribution — quoting a source with full citation and quotation marks",
    ],
    correct: 0,
    explanation: "Paraphrasing without citation is a form of plagiarism specifically called out in the lesson — rewriting content in your own words does not remove the obligation to credit the original author. Verbatim copying is a different form, and proper attribution (Option C) is the correct way to reference sources.",
  },

  // Q17 — Referral Traffic (GA classification) — correct: B (1)
  {
    id: 17,
    text: "A user discovers your website by clicking a link in an article published on another blog. How would Google Analytics classify this visit?",
    options: [
      "Organic traffic — because the user found you through written content published online",
      "Referral traffic — because they arrived via a link on a different website",
      "Direct traffic — because they clicked a specific link rather than typing in your URL",
    ],
    correct: 1,
    explanation: "Referral traffic is specifically defined as visits from users who clicked a link on a different website. 'Organic traffic' comes from search engine results pages. 'Direct traffic' comes from users who type your URL directly or use a bookmark — not from clicking links on other sites.",
  },

  // Q18 — Primary Keyword (placement) — correct: A (0)
  {
    id: 18,
    text: "Where should a primary keyword appear to maximise the SEO performance of a webpage?",
    options: [
      "In the title tag, H1 heading, meta description, URL slug, image alt text, and naturally within the content",
      "Only in the title tag and URL slug — placing it elsewhere risks keyword overuse penalties from Google",
      "Exclusively in hidden meta tags so that search engines can read it without cluttering the visible content",
    ],
    correct: 0,
    explanation: "The primary keyword should appear across all key on-page elements: title tag, H1, meta description, URL slug, image alt text, and naturally within the body text. Restricting it to just two locations (Option B) leaves ranking signals on the table, and hidden keyword stuffing (Option C) is a black-hat technique.",
  },

  // Q19 — Paid Search (ad auction) — correct: B (1)
  {
    id: 19,
    text: "When a user searches on Google, what process determines which paid search advertisements are shown and in what order?",
    options: [
      "The age and domain history of the advertiser's website, which determines their trust level",
      "An instant ad auction based on the advertiser's bid amount and their ad's Quality Score",
      "The total number of previous campaigns an advertiser has run on the Google Ads platform",
    ],
    correct: 1,
    explanation: "Google runs an instant ad auction every time a search is performed. The winner is not simply the highest bidder — it is determined by both the bid amount and the Quality Score (which includes ad relevance, landing page quality, and expected click-through rate). Domain age and campaign history are not direct auction factors.",
  },

  // Q20 — Organic Search Results (trust) — correct: C (2)
  {
    id: 20,
    text: "Why do organic search results typically receive more clicks than paid ads for the same search query?",
    options: [
      "Organic results are always displayed above paid advertisements on the search results page",
      "Search engines artificially inflate click-through rates for organic results in their analytics reporting",
      "Users tend to trust organic results more, as they reflect genuine relevance rather than paid placement",
    ],
    correct: 2,
    explanation: "Research consistently shows that users trust organic results more because they know organic rankings are earned through content quality and relevance — not payment. Paid ads are often shown above organic results (not below), and Google does not inflate click-through rate data.",
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
function IntroScreen({ onStart }: { onStart: () => void }) {
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
          <h2 className="text-2xl font-bold mb-2">Test: Key Terminologies-6</h2>
          <p className="text-violet-100 text-sm">20 questions covering Organic Search Results, Organic Traffic, Outbound Link, Paid Link, Primary Keyword, Paid Search, PBN, Page Authority, Plagiarism, and Referral Traffic.</p>
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

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onStart}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-base shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900 transition-shadow">
        Start Test →
      </motion.button>
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
                    {(isWrong || unanswered) && (
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
export default function Lesson22Quiz() {
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

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const warnRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const tabCountRef = useRef(0)

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
    setPhase('intro'); setCurrentQ(0); setAnswers({}); setTimeLeft(TOTAL_TIME)
    setTabSwitches(0); setTerminated(false); setShowSubmit(false); tabCountRef.current = 0
  }

  if (phase === 'intro')   return <IntroScreen onStart={() => setPhase('quiz')} />
  if (phase === 'results') return <ResultsScreen answers={answers} terminated={terminated} timeUsed={TOTAL_TIME - timeLeft} onRetry={handleRetry} />

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Test in Progress</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Key Terminologies-6</p>
        </div>
        <div className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`font-bold tabular-nums text-sm ${timeLeft < 60 ? 'text-red-500' : timeLeft < 180 ? 'text-amber-500' : 'text-violet-600 dark:text-violet-400'}`}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

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

      <div className="flex gap-5 items-start">

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
