'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, RotateCcw, Clock, BookOpen, Send, Trophy,
} from 'lucide-react'

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const TOTAL_TIME = 20 * 60   // 20 minutes for the final assessment
const MAX_TAB_SWITCHES = 3
const PASS_MARK = 14          // 70% of 20

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
// Answer spread: A×6, B×7, C×7 — balanced
// Coverage:
//   Module 3 — Q1–Q12 (GUESTPOSTLINKS philosophy, services, niche filters)
//   Module 2 KT — Q13–Q19 (DA, Do/No-Follow, UGC, Search Intent, Short-tail, Sponsored, White Hat)
//   General/Module 1 — Q20 (White Hat vs Black Hat confirmation)
// ─────────────────────────────────────
const questions: MCQ[] = [

  // Q1 — GPL.NET origin — correct: B (1)
  {
    id: 1,
    text: "GUESTPOSTLINKS.NET was launched as the first product of which company?",
    options: [
      "Google",
      "AMRYTT MEDIA LLC",
      "Ahrefs",
    ],
    correct: 1,
    explanation: "AMRYTT MEDIA LLC launched GUESTPOSTLINKS.NET as its first and core product — a platform connecting guest post buyers and marketers with publishers for SEO and content marketing purposes.",
  },

  // Q2 — Publisher count — correct: C (2)
  {
    id: 2,
    text: "How many publishers are currently listed on the GUESTPOSTLINKS platform?",
    options: [
      "10,000+",
      "40,000+",
      "60,000+",
    ],
    correct: 2,
    explanation: "GUESTPOSTLINKS currently has 60,000+ publishers listed on its platform, serving both SEO agencies and direct clients with a diverse range of high-quality backlink solutions across every niche.",
  },

  // Q3 — NAP — correct: A (0)
  {
    id: 3,
    text: "What does NAP stand for in the context of Local Citation Building?",
    options: [
      "Name, Address, Phone",
      "Network Access Protocol",
      "Niche Authority Profile",
    ],
    correct: 0,
    explanation: "NAP stands for Name, Address, and Phone Number — the three core business details that must appear consistently across all online directories and citation sources for effective local SEO.",
  },

  // Q4 — Niche Edits definition — correct: B (1)
  {
    id: 4,
    text: "Which of the following BEST describes 'Niche Edits' as a link building service?",
    options: [
      "Writing brand-new articles for other websites to earn a backlink",
      "Inserting your link into existing, already-published articles on established websites",
      "Paying website owners for banner advertising space",
    ],
    correct: 1,
    explanation: "Niche Edits (also called link insertions) place your backlink within an already-indexed article on an established site — giving you immediate access to the page's existing authority, traffic, and trust signals.",
  },

  // Q5 — Press Release SEO benefit — correct: C (2)
  {
    id: 5,
    text: "What is the PRIMARY SEO benefit of Press Release Distribution?",
    options: [
      "Improving website loading speed",
      "Increasing social media followers",
      "Earning high-DA backlinks from authoritative news sites (often DA 50–90+)",
    ],
    correct: 2,
    explanation: "Press Release Distribution earns high-DA backlinks from major news outlets, syndicates your announcement to 300+ sites simultaneously, and can get your content indexed in Google News — making it a powerful tool for authority building.",
  },

  // Q6 — Foreign language filter — correct: A (0)
  {
    id: 6,
    text: "A website's main language is Spanish. A client orders a Spanish article for it. This order is:",
    options: [
      "NOT a foreign language order — it is the site's native language",
      "A foreign language order requiring the Foreign Language filter",
      "A pharmacy niche order",
    ],
    correct: 0,
    explanation: "The Foreign Language filter only applies when the article language DIFFERS from the site's primary language. If the site is already in Spanish, a Spanish article is native-language content — no special filter is needed.",
  },

  // Q7 — CBD fact — correct: B (1)
  {
    id: 7,
    text: "Which of the following is TRUE about CBD (Cannabidiol)?",
    options: [
      "CBD and THC both produce a psychoactive high",
      "CBD is non-intoxicating, unlike THC which produces a psychoactive high",
      "CBD is the same chemical compound as THC",
    ],
    correct: 1,
    explanation: "CBD (Cannabidiol) is non-intoxicating — it does not produce a high. THC (Tetrahydrocannabinol) is the psychoactive compound in cannabis. CBD has gained popularity for potential benefits like pain relief, anxiety reduction, and sleep improvement.",
  },

  // Q8 — What Sets Us Apart pillar — correct: C (2)
  {
    id: 8,
    text: "Which of the following is one of GUESTPOSTLINKS' four 'What Sets Us Apart' pillars?",
    options: [
      "Guaranteed first-page Google rankings within 30 days",
      "Unlimited free content revisions on every order",
      "Every website and publisher on the platform is carefully vetted for quality",
    ],
    correct: 2,
    explanation: "Commitment to Quality is one of GUESTPOSTLINKS' four key differentiators — every website and publisher is carefully vetted by the team to ensure the highest standards before they are listed on the platform.",
  },

  // Q9 — GPL philosophy — correct: A (0)
  {
    id: 9,
    text: "How does GUESTPOSTLINKS describe its relationship with its clients beyond being a service provider?",
    options: [
      "As an extension of its clients' teams, working toward shared sustainable growth and success",
      "As a social media management agency",
      "As a web design and development company",
    ],
    correct: 0,
    explanation: "GUESTPOSTLINKS' core philosophy states: 'We don't just see ourselves as a service provider — we see ourselves as an extension of our clients' teams, working together toward sustainable growth and success.'",
  },

  // Q10 — Casino/Gaming filter — correct: B (1)
  {
    id: 10,
    text: "What type of content does the 'Casino/Gaming' filter on GUESTPOSTLINKS help identify publishers for?",
    options: [
      "Pharmacy and CBD content",
      "Casino, sports betting, and online gambling-related content",
      "Multi-language content for non-English articles",
    ],
    correct: 1,
    explanation: "The Sports/Gaming (Casino/Gaming) filter identifies publishers that accept casino, online gambling, and sports betting content. Since many websites do not allow this type of content, this filter helps clients find the right publishers quickly.",
  },

  // Q11 — Guest Post vs Niche Edit key difference — correct: C (2)
  {
    id: 11,
    text: "What is the fundamental difference between Guest Posting and Niche Edits?",
    options: [
      "Guest posts always cost more than niche edits",
      "Niche edits require the client to write their own content",
      "Guest posts create brand-new articles; niche edits add links into existing, already-published articles",
    ],
    correct: 2,
    explanation: "The key distinction: Guest Posts create a brand-new article written for the host site with your link embedded. Niche Edits insert your link into an existing article that is already indexed and has established authority — providing faster, inherited SEO value.",
  },

  // Q12 — Type of backlinks GPL provides — correct: A (0)
  {
    id: 12,
    text: "What type of backlinks does GUESTPOSTLINKS.NET primarily specialise in providing?",
    options: [
      "In-content High-Quality Contextual Whitehat backlinks from High Authority niche websites",
      "Footer and sidebar links from high-traffic websites",
      "Private Blog Network (PBN) links for quick ranking boosts",
    ],
    correct: 0,
    explanation: "GUESTPOSTLINKS specialises in in-content High-Quality Contextual Whitehat backlinks placed naturally within relevant articles on high-authority niche websites — not PBN, footer, or sidebar links, which are lower quality and often risky.",
  },

  // Q13 — Domain Authority — correct: B (1)
  {
    id: 13,
    text: "Which of the following BEST describes Domain Authority (DA)?",
    options: [
      "The total number of indexed pages on a website",
      "A Moz metric (0–100) that predicts how well a website is likely to rank in search engine results",
      "The age of a domain name measured in years",
    ],
    correct: 1,
    explanation: "Domain Authority (DA) is a proprietary 0–100 metric developed by Moz. It predicts how well a website is likely to rank on SERPs — the higher the DA, the stronger the site's ranking power. It is not a Google metric and does not directly control rankings.",
  },

  // Q14 — Do-Follow vs No-Follow — correct: C (2)
  {
    id: 14,
    text: "What is the PRIMARY difference between a Do-Follow and a No-Follow link?",
    options: [
      "Do-Follow links are free; No-Follow links are paid",
      "No-Follow links appear in a different colour in the browser",
      "Do-Follow links pass link equity (PageRank) to the target site; No-Follow links instruct Google not to pass link equity",
    ],
    correct: 2,
    explanation: "A Do-Follow link passes 'link juice' (link equity/PageRank) to the destination — helping its search rankings. A No-Follow link contains rel='nofollow' and tells Google not to follow the link or pass authority. Neither link type changes appearance in a browser.",
  },

  // Q15 — rel=ugc attribute — correct: A (0)
  {
    id: 15,
    text: "Which HTML rel attribute identifies a link as pointing to user-generated content (e.g., blog comments or forum posts)?",
    options: [
      'rel="ugc"',
      'rel="nofollow"',
      'rel="sponsored"',
    ],
    correct: 0,
    explanation: "rel=\"ugc\" (User-Generated Content) is the correct attribute for links within user-generated content such as forum posts, blog comments, and community discussions. It signals to Google that the link may not be an editorial endorsement from the site owner.",
  },

  // Q16 — Search Intent — correct: B (1)
  {
    id: 16,
    text: "What does 'Search Intent' mean in the context of SEO and content marketing?",
    options: [
      "The number of times a keyword is searched per month (search volume)",
      "The underlying reason or goal behind a user's search query",
      "The speed at which search engine results are returned to a user",
    ],
    correct: 1,
    explanation: "Search Intent is the underlying goal behind a user's search query — whether they want to buy (transactional), learn (informational), compare options (commercial investigation), or navigate to a specific site. Matching content to search intent is critical for ranking well.",
  },

  // Q17 — Short-tail keyword example — correct: C (2)
  {
    id: 17,
    text: "Which of the following is the BEST example of a short-tail keyword?",
    options: [
      "best Italian restaurants in downtown Chicago",
      "affordable dentist near me open on Sundays",
      "shoes",
    ],
    correct: 2,
    explanation: "Short-tail keywords are short (typically 1–2 words), broad, and high-search-volume terms like 'shoes.' The other two examples are long-tail keywords — longer, more specific phrases with lower volume but higher purchase intent and less competition.",
  },

  // Q18 — rel=sponsored — correct: A (0)
  {
    id: 18,
    text: 'The rel="sponsored" attribute on a hyperlink tells Google that:',
    options: [
      "The link is paid or commercially motivated and should NOT pass PageRank",
      "The link is from a government or officially verified source",
      "The link has been manually reviewed and verified by a webmaster",
    ],
    correct: 0,
    explanation: "rel=\"sponsored\" tells Google the link is paid, commercial, or part of an advertising arrangement. Google's guidelines require that sponsored links do NOT pass PageRank — using this attribute ensures compliance and maintains the integrity of organic search rankings.",
  },

  // Q19 — White Hat SEO technique — correct: B (1)
  {
    id: 19,
    text: "Which of the following is a recognised WHITE HAT SEO technique?",
    options: [
      "Keyword stuffing",
      "Guest posting on reputable, niche-relevant websites",
      "Cloaking",
    ],
    correct: 1,
    explanation: "Guest posting on reputable, niche-relevant websites is a legitimate White Hat SEO technique that earns natural, high-quality backlinks. Keyword stuffing (overloading pages with keywords) and cloaking (showing different content to users vs. search engines) are both Black Hat techniques that violate Google's guidelines.",
  },

  // Q20 — NOT a GPL special niche filter — correct: C (2)
  {
    id: 20,
    text: "Which of the following is NOT one of the three special content niche filters available on the GUESTPOSTLINKS platform?",
    options: [
      "Pharmacy",
      "Casino / Gaming",
      "Technology / Software",
    ],
    correct: 2,
    explanation: "GUESTPOSTLINKS has exactly three special content niche filters: Pharmacy (health, pharmaceutical, CBD content), Casino/Gaming (sports betting and gambling content), and Foreign Language (non-primary language content). Technology/Software is NOT one of the three special filters.",
  },
]

// ─────────────────────────────────────
// Circular Timer
// ─────────────────────────────────────
function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c * (1 - timeLeft / TOTAL_TIME)
  const color = timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : '#2563eb'
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
            i === current ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''
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
    { label: 'Duration',   value: '20 minutes' },
    { label: 'Questions',  value: '20'          },
    { label: 'Marks',      value: '20'          },
    { label: 'Pass Mark',  value: '14 / 20'     },
  ]
  const rules = [
    "This is the Final Assessment for the complete 'Let's Create Foundation!' course.",
    'Once started, the timer cannot be paused.',
    'Switching browser tabs is restricted — 3 violations will auto-terminate the test.',
    'You can navigate freely between all 20 questions using the number grid.',
    'Unanswered questions will be marked as incorrect.',
    'A pass mark of 70% (14 out of 20) is required to complete the course.',
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-blue-200" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest">Module 3 · Final Assessment</p>
          </div>
          <h2 className="text-2xl font-bold mb-2">Test: Final Assessment</h2>
          <p className="text-blue-100 text-sm leading-relaxed">20 comprehensive questions covering the entire course — GUESTPOSTLINKS.NET philosophy, key link building services, local SEO, special content niche filters, and core digital marketing terminologies.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {meta.map(m => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{m.value}</p>
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
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold py-4 rounded-2xl text-base shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-shadow flex items-center justify-center gap-2">
        <Trophy className="w-4 h-4" />
        Start Final Test &#8594;
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
  const passed = correct >= PASS_MARK && !terminated
  const skipped = questions.length - Object.keys(answers).length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className={`rounded-3xl p-8 text-white relative overflow-hidden ${
        terminated ? 'bg-gradient-to-br from-red-600 to-rose-700' :
        passed     ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
                     'bg-gradient-to-br from-amber-500 to-orange-600'
      }`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-black">{correct}/{questions.length}</div>
            <div className="text-sm opacity-80 mt-1">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">
              {terminated ? 'Test Terminated' : passed ? 'Course Complete!' : 'Keep Practicing'}
            </div>
            <div className="text-sm opacity-90">
              {terminated
                ? 'Tab switching limit exceeded. Your score has been recorded.'
                : passed
                ? `Congratulations! You passed with ${correct}/20. You have completed the Final Assessment.`
                : `You need ${PASS_MARK - correct} more mark${PASS_MARK - correct !== 1 ? 's' : ''} to pass (${PASS_MARK}/20 required). Review the content and try again.`}
            </div>
            <div className="text-xs opacity-70 mt-2">Time used: {fmt(timeUsed)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correct',   value: correct,                     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'Incorrect', value: questions.length - correct - skipped, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800' },
          { label: 'Skipped',   value: skipped,                     color: 'text-gray-500 dark:text-gray-400',       bg: 'bg-gray-50 dark:bg-gray-900',       border: 'border-gray-200 dark:border-gray-700'       },
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
        Retake Final Test
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
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Submit Final Test?</h3>
        {unanswered > 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You have <strong className="text-amber-600 dark:text-amber-400">{unanswered} unanswered question{unanswered !== 1 ? 's' : ''}</strong>. These will count as incorrect.
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">All 20 questions answered. Ready to submit your Final Assessment?</p>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Continue
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
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
export default function Lesson27Quiz() {
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
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Final Assessment in Progress</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Test: Final Assessment</p>
        </div>
        <div className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`font-bold tabular-nums text-sm ${timeLeft < 60 ? 'text-red-500' : timeLeft < 180 ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
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
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950 dark:via-indigo-950 dark:to-violet-950 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
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
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition ${
                          selected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {letter}
                        </span>
                        <p className={`text-sm flex-1 ${selected ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                          {opt}
                        </p>
                        {selected && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
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
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition">
                    <Send className="w-4 h-4" /> Submit Test
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => go(1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition">
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
                &#9888;&#65039; {tabSwitches}/{MAX_TAB_SWITCHES} tab switches
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
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition">
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
