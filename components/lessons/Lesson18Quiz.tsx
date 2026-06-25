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
// Answer spread: A×7, B×7, C×6 — well balanced
// Covers all 13 terms from Lesson 17 (Key Terminologies-4)
// ─────────────────────────────────────
const questions: MCQ[] = [
  // Q1 — Keyword Cannibalization — correct: A (0)
  {
    id: 1,
    text: "What happens when multiple pages on your website target the same or very similar keywords?",
    options: [
      "They cannibalize each other, confusing search engines about which page to rank and diluting both pages' relevance",
      "They boost each other's authority by doubling the keyword signals sent to Google",
      "They create stronger combined coverage, helping both pages appear higher in search results",
    ],
    correct: 0,
    explanation: "Keyword cannibalization occurs when two or more pages on the same site compete for the same keyword. Search engines cannot decide which page to rank, which weakens both pages instead of strengthening either one.",
  },

  // Q2 — Keyword Density (formula) — correct: C (2)
  {
    id: 2,
    text: "If the keyword \"digital marketing\" appears 10 times in a 500-word article, what is the keyword density?",
    options: [
      "5%",
      "10%",
      "2%",
    ],
    correct: 2,
    explanation: "Keyword Density = (Keyword appearances ÷ Total words) × 100. So (10 ÷ 500) × 100 = 2%. A density of 5% would mean the keyword appeared 25 times, and 10% would mean 50 times.",
  },

  // Q3 — Keyword Difficulty (factors) — correct: B (1)
  {
    id: 3,
    text: "Which three factors does Keyword Difficulty (KD) take into account when estimating how hard it is to rank?",
    options: [
      "Keyword density, bounce rate, and average session duration",
      "Search volume, competition level, and domain authority",
      "Content length, backlink anchor text, and keyword stuffing frequency",
    ],
    correct: 1,
    explanation: "Keyword Difficulty is a metric that considers Search Volume (how often the keyword is searched), Competition (how many sites are targeting it), and Domain Authority (the strength of competing domains). The higher the KD score, the harder it is to rank.",
  },

  // Q4 — Keyword Ranking (click share) — correct: C (2)
  {
    id: 4,
    text: "According to SEO research, approximately what percentage of all clicks goes to the website ranked #1 in search results?",
    options: [
      "5%",
      "10%",
      "28%",
    ],
    correct: 2,
    explanation: "Research shows that the #1 ranked result receives approximately 28% of all clicks for a query. This drops sharply for positions below it — which is why getting to the top of page 1 is a major goal of keyword ranking efforts.",
  },

  // Q5 — Keyword Stuffing (consequence) — correct: A (0)
  {
    id: 5,
    text: "What is the most likely consequence of using keyword stuffing on your website?",
    options: [
      "A Google penalty or removal of the page from search results entirely",
      "Higher keyword density scores that directly improve search rankings",
      "Improved user experience because the content is highly relevant to the keyword",
    ],
    correct: 0,
    explanation: "Keyword Stuffing is an outdated, black-hat technique. Google's algorithm now recognises unnatural keyword repetition and penalises pages that use it — removing them from search results or ranking them very low.",
  },

  // Q6 — Keyword Research (goal) — correct: B (1)
  {
    id: 6,
    text: "What is the primary goal of keyword research in content marketing?",
    options: [
      "To calculate the ideal keyword density percentage for each page on the website",
      "To identify the words and phrases that your target audience is actively typing into search engines",
      "To exchange backlinks with other websites that already rank for those keywords",
    ],
    correct: 1,
    explanation: "Keyword Research is the process of finding the actual queries people use to search for information, products, or services online. Knowing these keywords lets you create content that aligns with what your audience is already looking for.",
  },

  // Q7 — Keyword Analysis vs Research — correct: A (0)
  {
    id: 7,
    text: "How does keyword analysis differ from keyword research?",
    options: [
      "Keyword analysis evaluates and scores the keywords discovered during research to decide which ones are actually worth targeting",
      "Keyword analysis only measures how often keywords appear on a page, while research finds new keywords",
      "Keyword analysis and keyword research are two names for the exact same process",
    ],
    correct: 0,
    explanation: "Keyword Research finds the possible keywords; Keyword Analysis evaluates them. Analysis looks at factors like search volume, competition, and relevance to determine which keywords offer the best opportunity, so you know which ones to actually use in your content.",
  },

  // Q8 — Link Building (purpose) — correct: B (1)
  {
    id: 8,
    text: "What is the primary purpose of link building in SEO?",
    options: [
      "To increase website traffic through paid advertising campaigns on Google",
      "To acquire high-quality inbound links from other websites that point back to your own",
      "To exchange links with partner websites within the same industry niche",
    ],
    correct: 1,
    explanation: "Link Building is the process of actively getting other reputable websites to link to your content. These inbound links act as \"votes of confidence\" in the eyes of search engines, helping to improve your site's authority and organic rankings.",
  },

  // Q9 — Link Building (guest posting) — correct: C (2)
  {
    id: 9,
    text: "Which link building method involves writing and publishing an article on another website that contains a link back to your own site?",
    options: [
      "Broken link building",
      "Digital PR",
      "Guest posting",
    ],
    correct: 2,
    explanation: "Guest Posting means writing content for another website (as a \"guest\" author) in exchange for a backlink to your site within the article. Broken link building finds dead links on other sites; Digital PR earns links through press coverage.",
  },

  // Q10 — Link Exchange (definition) — correct: B (1)
  {
    id: 10,
    text: "What is a link exchange in SEO?",
    options: [
      "A Google-approved process for verifying and removing toxic links through Search Console",
      "An arrangement between two webmasters where each agrees to link to the other's website",
      "A paid method of acquiring backlinks through sponsored directory listings",
    ],
    correct: 1,
    explanation: "A Link Exchange (also called reciprocal linking) is when Site A links to Site B, and Site B links back to Site A. When done naturally and sparingly between relevant sites, this is acceptable — but excessive link exchanging purely to boost rankings is against Google's guidelines.",
  },

  // Q11 — Link Exchange (Google penalty) — correct: C (2)
  {
    id: 11,
    text: "What does Google classify excessive and irrelevant link exchanges as?",
    options: [
      "A white-hat SEO practice that builds authority naturally over time",
      "A neutral activity that has no positive or negative effect on search rankings",
      "A link scheme that can result in a manual action penalty from Google",
    ],
    correct: 2,
    explanation: "Google's link spam guidelines explicitly state that excessive link exchanges made purely to boost rankings constitute a \"link scheme.\" This can trigger a manual penalty, causing your site's rankings to drop significantly or be removed from search results.",
  },

  // Q12 — Local Citation (what it is) — correct: A (0)
  {
    id: 12,
    text: "What does a local citation typically contain?",
    options: [
      "A business's name, address, and phone number (NAP) on external websites",
      "A business's keyword density score and monthly organic traffic figures",
      "A business's social media follower count and engagement rate",
    ],
    correct: 0,
    explanation: "A Local Citation is any mention of a business's NAP — Name, Address, and Phone Number — on other websites such as directories, review sites, and social media profiles. Consistent NAP information across the web signals legitimacy to search engines.",
  },

  // Q13 — Local Citation (valid example) — correct: C (2)
  {
    id: 13,
    text: "Which of the following would count as a valid local citation for a restaurant?",
    options: [
      "A keyword-stuffed paragraph about the restaurant written on the restaurant's own homepage",
      "A food blog article that mentions the restaurant's name but does not include its address or phone number",
      "A JustDial listing showing the restaurant's name, full address, and contact number",
    ],
    correct: 2,
    explanation: "A local citation must include the NAP (Name, Address, Phone Number). A directory listing like JustDial showing all three components is a classic example. Content on your own site or mentions without contact details do not count as citations.",
  },

  // Q14 — Long-tail Keyword (definition) — correct: B (1)
  {
    id: 14,
    text: "What defines a long-tail keyword?",
    options: [
      "A single-word keyword that targets a very broad and general audience",
      "A highly-specific search phrase typically made up of three or more words",
      "A keyword that only appears in the meta description and URL of a webpage",
    ],
    correct: 1,
    explanation: "Long-tail keywords are longer, more specific phrases — usually three or more words. For example, \"how to make dog food at home\" is a long-tail keyword, while \"dog food\" is a short-tail keyword. Long-tails are more specific and usually signal stronger user intent.",
  },

  // Q15 — Long-tail Keyword (benefit) — correct: A (0)
  {
    id: 15,
    text: "Why are long-tail keywords particularly valuable for SEO?",
    options: [
      "They are less competitive and attract users with a clearer, more specific intent — often closer to making a decision",
      "They generate the highest search volumes of any keyword type, bringing the most visitors",
      "They are guaranteed to rank on page 1 because they face absolutely no competition",
    ],
    correct: 0,
    explanation: "Long-tail keywords have lower search volumes but also much lower competition. More importantly, users who search with long, specific phrases typically have a clear purpose — making them more likely to convert. This makes long-tails highly efficient for targeted content.",
  },

  // Q16 — Landing Page (primary purpose) — correct: B (1)
  {
    id: 16,
    text: "What is the primary purpose of a landing page?",
    options: [
      "To display a website's complete archive of blog posts and articles in one scrollable list",
      "To receive traffic from a specific source and prompt visitors to take one specific action",
      "To serve as the main navigation hub linking to every section of a website",
    ],
    correct: 1,
    explanation: "A Landing Page is a standalone page built to receive traffic from a specific source (like a Google Ad, email campaign, or social media post) and guide that visitor toward one clear action — such as signing up, downloading something, or making a purchase.",
  },

  // Q17 — Landing Page (what makes it different) — correct: A (0)
  {
    id: 17,
    text: "What distinguishes a landing page from a standard webpage on a website?",
    options: [
      "It is focused on a single call-to-action from a targeted traffic source, with no distracting navigation menus",
      "It contains full navigation menus and footer links to help visitors freely explore the entire website",
      "It can only be used for paid advertising traffic — never for organic search or email campaigns",
    ],
    correct: 0,
    explanation: "Unlike regular webpages, landing pages deliberately remove distractions like navigation menus so that visitors focus on one specific action. They are designed for a single traffic source and a single conversion goal, making them more effective than general web pages for campaigns.",
  },

  // Q18 — Link Juice (definition) — correct: B (1)
  {
    id: 18,
    text: "What is \"link juice\" in SEO?",
    options: [
      "A term used for paid links that are purchased from high-traffic directories",
      "The value, trust, or authority passed from one webpage to another through a hyperlink",
      "A metric that tracks how many times a keyword appears on the page being linked to",
    ],
    correct: 1,
    explanation: "Link Juice refers to the SEO value or authority that flows from one page to another through hyperlinks. When a high-authority site like BBC.com links to your page, it passes some of its authority — or link juice — to you, which can positively impact your search rankings.",
  },

  // Q19 — Link Juice (BBC example) — correct: C (2)
  {
    id: 19,
    text: "If BBC.com links to your article about climate change, what is the SEO effect of this?",
    options: [
      "Your article passes link juice to BBC.com, boosting BBC's authority for the topic",
      "Your article's keyword density for \"climate change\" automatically increases as a result",
      "BBC's link juice flows to your article, boosting your site's credibility and potentially improving its search ranking",
    ],
    correct: 2,
    explanation: "Link juice flows FROM the linking site TO the site being linked to. So BBC.com linking to your article means BBC's authority and trust passes to your page — not the other way around. This can improve your ranking for relevant search queries.",
  },

  // Q20 — Keyword Density (recommended range) — correct: A (0)
  {
    id: 20,
    text: "What keyword density range do SEO best practices recommend for natural, well-optimised content?",
    options: [
      "1–3%",
      "5–10%",
      "Over 10%",
    ],
    correct: 0,
    explanation: "A keyword density of 1–3% is generally considered the optimal range. Below 1%, you may not be signalling relevance strongly enough. Above 3%, you risk your content appearing spammy or being flagged for keyword stuffing — which Google penalises.",
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
          <h2 className="text-2xl font-bold mb-2">Test: Key Terminologies-4</h2>
          <p className="text-violet-100 text-sm">20 questions covering Keyword Cannibalization, Keyword Density, Keyword Difficulty, Keyword Ranking, Keyword Stuffing, Keyword Research, Keyword Analysis, Link Building, Link Exchange, Local Citation, Long-tail Keyword, Landing Page, and Link Juice.</p>
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
export default function Lesson18Quiz() {
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

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Test in Progress</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Key Terminologies-4</p>
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
