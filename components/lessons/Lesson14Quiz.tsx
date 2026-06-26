'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, Send, RotateCcw, Clock, BookOpen,
} from 'lucide-react'
import { getQuizAttempts, saveQuizAttempt, getAttemptLimit, type QuizAttempt } from '@/lib/quiz-attempts'

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const TOTAL_TIME = 12 * 60   // 12 minutes for 15 questions
const MAX_TAB_SWITCHES = 3
const LESSON_ID = 14
const MAX_ATTEMPTS = 5

type Phase = 'intro' | 'quiz' | 'results'

interface MCQ { id: number; type: 'mcq'; text: string; options: string[]; correct: number; explanation: string }
type Question = MCQ

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

// ─────────────────────────────────────
// Questions  (A=0, B=1, C=2)
// Answer spread: A×5, B×5, C×5 — perfectly balanced
// Covers all 12 terms from Lesson 13 (Key Terminologies-2)
// ─────────────────────────────────────
const questions: Question[] = [
  // Q1 — De-Index — correct: A (0)
  {
    id: 1, type: 'mcq',
    text: 'De-indexing refers to:',
    options: [
      'Removing pages from a search engine\'s index',
      'Improving a website\'s search ranking with new optimisations',
      'Creating new optimised content for Google to crawl',
    ],
    correct: 0,
    explanation: 'De-indexing is when search engines remove your pages from their index. De-indexed pages no longer appear in search results.',
  },
  // Q2 — Direct Traffic — correct: C (2)
  {
    id: 2, type: 'mcq',
    text: 'A user types "nike.com" directly into their browser without clicking any link or search result. What type of traffic does this create for Nike?',
    options: [
      'Organic traffic — the user found Nike through a Google search result',
      'Referral traffic — the user clicked a link from another website',
      'Direct traffic — the user navigated directly without a search engine',
    ],
    correct: 2,
    explanation: 'Direct traffic means visitors who arrive by typing a URL or using a bookmark — no search engine click was involved.',
  },
  // Q3 — Contextual Links — correct: B (1)
  {
    id: 3, type: 'mcq',
    text: 'Where are contextual links placed, and what makes them valuable?',
    options: [
      'In the footer or sidebar of a webpage, targeting all visitors equally',
      'Within the body of a paragraph, naturally relevant to the surrounding content',
      'In image alt text only, invisible to regular readers',
    ],
    correct: 1,
    explanation: 'Contextual links are embedded within paragraph text, surrounded by relevant content. This makes them appear natural and signals genuine editorial intent to search engines.',
  },
  // Q4 — Domain Authority (DA) — correct: C (2)
  {
    id: 4, type: 'mcq',
    text: 'Domain Authority (DA), a score created by Moz, predicts:',
    options: [
      'How old a domain is and when it was first registered',
      'How much organic traffic a website receives per month',
      'How well a website will rank on search engine result pages',
    ],
    correct: 2,
    explanation: 'DA predicts ranking potential on a scale of 1–100. Higher scores mean greater ability to rank. It is based on the quality and quantity of backlinks.',
  },
  // Q5 — Duplicate Content — correct: A (0)
  {
    id: 5, type: 'mcq',
    text: 'Why does duplicate content negatively impact SEO?',
    options: [
      'Search engines cannot decide which version to rank, so both versions rank poorly',
      'It automatically increases server load and slows the website down',
      'Google issues an immediate manual penalty and bans the domain',
    ],
    correct: 0,
    explanation: 'When the same content appears in multiple places, search engines split ranking signals between versions — weakening all of them. Severe cases can also lead to penalties.',
  },
  // Q6 — Editorial Link — correct: B (1)
  {
    id: 6, type: 'mcq',
    text: 'Which of the following BEST describes an editorial link?',
    options: [
      'A paid link inserted into sponsored content for a fee',
      'A link voluntarily given by an editor or author because the content earns it',
      'A link automatically generated in a website\'s footer by a CMS',
    ],
    correct: 1,
    explanation: 'Editorial links are earned, not bought. They are placed naturally by editors or authors who find the linked content genuinely valuable — making them highly trusted by Google.',
  },
  // Q7 — Do-follow Link — correct: A (0)
  {
    id: 7, type: 'mcq',
    text: 'A do-follow link allows search engines to:',
    options: [
      'Follow the link and pass SEO value ("link juice") to the destination site',
      'Index the destination page faster using cached data',
      'Display the link in a special "trusted sources" section of search results',
    ],
    correct: 0,
    explanation: 'Do-follow links pass link equity from the linking site to the destination — acting as a "vote of confidence" that can boost the destination site\'s rankings.',
  },
  // Q8 — Competitor Analysis — correct: C (2)
  {
    id: 8, type: 'mcq',
    text: 'What is the PRIMARY purpose of competitor analysis in SEO?',
    options: [
      'To copy a competitor\'s content and republish it on your own site',
      'To report competitors to Google for using Black Hat SEO techniques',
      'To study competitors\' strategies, backlinks, and keywords to improve your own SEO',
    ],
    correct: 2,
    explanation: 'Competitor analysis reveals what is working for others in your niche — their keywords, backlink sources, and content strategies — so you can find opportunities to outperform them.',
  },
  // Q9 — Domain Rating (DR) — correct: B (1)
  {
    id: 9, type: 'mcq',
    text: 'Domain Rating (DR) is a metric developed by Ahrefs that:',
    options: [
      'Measures how many years a domain has been registered and active',
      'Predicts ranking potential based on the strength of a site\'s backlink profile',
      'Shows the exact number of monthly visitors a website receives',
    ],
    correct: 1,
    explanation: 'DR is plotted on a logarithmic scale from 0–100 and reflects the size and quality of backlinks pointing to a domain. Higher DR means stronger ranking potential.',
  },
  // Q10 — No-follow Link — correct: A (0)
  {
    id: 10, type: 'mcq',
    text: 'Which HTML attribute is added to a link to make it a no-follow link?',
    options: [
      'rel="nofollow" — instructs search engines not to pass link juice to the destination',
      'rel="external" — marks the link as pointing to an outside domain',
      'rel="sponsored" — declares the link was paid for by an advertiser',
    ],
    correct: 0,
    explanation: 'rel="nofollow" tells Google to ignore the link for ranking purposes. Without this attribute, a link is treated as do-follow by default.',
  },
  // Q11 — Domain — correct: C (2)
  {
    id: 11, type: 'mcq',
    text: 'Which of the following is an example of a domain?',
    options: [
      '/blog/how-to-write — this is the slug, the path after the domain name',
      'https:// — this is the protocol that secures the connection',
      'www.guestpostlinks.net — this is the main web address of the site',
    ],
    correct: 2,
    explanation: 'A domain is the primary web address of a site (e.g. guestpostlinks.net). It is just one part of the full URL, alongside the protocol, subdomain, slug, and subfolder.',
  },
  // Q12 — Domain Age — correct: B (1)
  {
    id: 12, type: 'mcq',
    text: 'Older domains can be seen as slightly more trustworthy by search engines because:',
    options: [
      'They have been crawled more times and accumulate more index entries automatically',
      'They have a longer history for search engines to evaluate for consistency and credibility',
      'They automatically receive high-quality editorial backlinks as they age',
    ],
    correct: 1,
    explanation: 'Domain age is a minor ranking factor. A longer history gives search engines more data to assess trust — but quality content and backlinks matter far more.',
  },
  // Q13 — No-follow Link (sponsored use case) — correct: A (0)
  {
    id: 13, type: 'mcq',
    text: 'You publish a sponsored article and link to the advertiser\'s website. To comply with Google\'s guidelines, which link type should you use?',
    options: [
      'No-follow or rel="sponsored" — paid links must not pass organic link juice',
      'Do-follow — sponsored links earn the highest editorial SEO value',
      'Editorial — because you are choosing to include the link voluntarily',
    ],
    correct: 0,
    explanation: 'Google requires that paid or sponsored links use rel="nofollow" or rel="sponsored" to prevent artificial inflation of the linked site\'s rankings.',
  },
  // Q14 — De-Index (detection) — correct: C (2)
  {
    id: 14, type: 'mcq',
    text: 'You type "site:familyhw.com" into Google and see "Your search did not match any documents." What does this tell you?',
    options: [
      'The website is brand new and Google has not yet had time to crawl it',
      'Google is temporarily unable to load the website due to a server error',
      'The domain has been de-indexed and none of its pages appear in Google',
    ],
    correct: 2,
    explanation: 'The site: operator shows all indexed pages for a domain. If no results appear, the domain is either de-indexed or has never been indexed. For familyhw.com — it is de-indexed.',
  },
  // Q15 — Contextual Links (why valuable) — correct: B (1)
  {
    id: 15, type: 'mcq',
    text: 'Why do contextual links carry more SEO value than links placed in a website\'s footer or sidebar?',
    options: [
      'Because they are hidden from users and only visible to search engine crawlers',
      'Because they are surrounded by relevant content, signalling genuine editorial intent',
      'Because contextual links always use branded anchor text which Google prioritises',
    ],
    correct: 1,
    explanation: 'A link embedded within relevant paragraph content signals to search engines that the link was editorially placed with purpose — making it more trustworthy and more powerful than navigational or footer links.',
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
    { label: 'Duration', value: '12 minutes' },
    { label: 'Questions', value: '15' },
    { label: 'Marks', value: '15' },
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
          <h2 className="text-2xl font-bold mb-2">Test: Key Terminologies-2</h2>
          <p className="text-violet-100 text-sm">15 questions covering Competitor Analysis, Contextual Links, Do-follow &amp; No-follow Links, Domain Rating, Duplicate Content, De-Index, Direct Traffic, Domain, Domain Age, Domain Authority, and Editorial Links.</p>
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
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-base shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900 transition-shadow"
        >
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
        passed ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
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
              {terminated ? 'Tab switching limit exceeded.' :
               passed ? 'All 15 questions answered correctly!' :
               `${questions.length - correct} question${questions.length - correct !== 1 ? 's' : ''} need review.`}
            </div>
            <div className="text-xs opacity-70 mt-2">Time used: {fmt(timeUsed)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correct',   value: correct,                    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'Incorrect', value: questions.length - correct, color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950',         border: 'border-red-200 dark:border-red-800'         },
          { label: 'Skipped',   value: questions.length - Object.keys(answers).length, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900', border: 'border-gray-200 dark:border-gray-700' },
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
                    {isWrong && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{q.explanation}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onRetry}
        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
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
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">All 15 questions answered. Ready to submit?</p>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Continue
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition">
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
export default function Lesson14Quiz() {
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

  // Countdown
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

  // Tab switching
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
      .then(() => getQuizAttempts(LESSON_ID).then(setAttempts))
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
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Key Terminologies-2</p>
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
