'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, Send, RotateCcw, Clock, BookOpen,
  Award, FileText,
} from 'lucide-react'
import { getQuizAttempts, saveQuizAttempt, getAttemptLimit, type QuizAttempt } from '@/lib/quiz-attempts'

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const TOTAL_TIME = 15 * 60
const MAX_TAB_SWITCHES = 3
const LESSON_ID = 10
const MAX_ATTEMPTS = 5

type Phase = 'intro' | 'quiz' | 'results'

interface MCQ { id: number; type: 'mcq'; text: string; options: string[]; correct: number; explanation: string }
interface TextQ { id: number; type: 'text'; text: string; explanation: string }
type Question = MCQ | TextQ

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

// ─────────────────────────────────────
// Questions
// ─────────────────────────────────────
const questions: Question[] = [
  {
    id: 1, type: 'mcq',
    text: 'Which of the following is NOT a key component of digital marketing?',
    options: ['Print Advertising', 'Search Engine Optimization (SEO)', 'Content Marketing'],
    correct: 0,
    explanation: 'Print Advertising is a traditional (offline) channel. SEO and Content Marketing are both core digital marketing pillars.',
  },
  {
    id: 2, type: 'mcq',
    text: 'What is the primary networking benefit of guest posting?',
    options: [
      'It isolates your business from industry competitors',
      'It limits your brand\'s collaboration opportunities',
      'It connects you with bloggers, influencers, and industry experts',
    ],
    correct: 2,
    explanation: 'Guest posting naturally builds relationships with publishers and experts, opening doors to future collaborations and referrals.',
  },
  {
    id: 3, type: 'mcq',
    text: 'Guest posting builds brand authority primarily because it...',
    options: [
      'Gets your expert content published on reputable external websites',
      'Allows businesses to bypass SEO entirely',
      'Generates immediate, direct product sales',
    ],
    correct: 0,
    explanation: 'Being featured on authoritative websites signals to both readers and search engines that you are an expert in your field.',
  },
  {
    id: 4, type: 'mcq',
    text: 'In the future of digital marketing, what is the main role of AI and automation?',
    options: [
      'Replace all human marketers entirely',
      'AI will only be used for customer service chatbots',
      'Enhance personalization and improve marketing efficiency',
    ],
    correct: 2,
    explanation: 'AI is a tool that enhances marketing — not a replacement for marketers. It boosts personalization, speed, and efficiency.',
  },
  {
    id: 5, type: 'text',
    text: 'In your own words, explain what Guest Posting is and why it matters for businesses.',
    explanation: 'Guest posting is writing and publishing content on someone else\'s website as a guest author to gain backlinks, traffic, and brand authority.',
  },
  {
    id: 6, type: 'mcq',
    text: 'A fashion brand sends free products to popular Instagram accounts with millions of followers for honest reviews. What digital marketing strategy is this?',
    options: [
      'Search Engine Marketing (SEM)',
      'Influencer Marketing',
      'Pay-Per-Click (PPC)',
    ],
    correct: 1,
    explanation: 'Influencer Marketing involves collaborating with people who have large, trusted followings to promote your brand authentically.',
  },
  {
    id: 7, type: 'mcq',
    text: 'A customer has been reading your weekly newsletter for 6 months and just made their 3rd purchase. Which content marketing benefit does this BEST show?',
    options: [
      'Earning customer loyalty through consistent educational value',
      'Generating leads through unsolicited cold emails',
      'Hard-selling products to first-time visitors',
    ],
    correct: 0,
    explanation: 'Consistent, valuable content builds habits around your brand — turning readers into loyal, repeat buyers over time.',
  },
  {
    id: 8, type: 'mcq',
    text: 'A company offers a free 40-page SEO guide — but you must submit your email to download it. What type of content marketing is this?',
    options: ['Social Media Posts', 'Case Studies', 'Gated E-books & Whitepapers'],
    correct: 2,
    explanation: 'Gated content trades value (the guide) for contact details (the email) — a classic lead generation technique.',
  },
  {
    id: 9, type: 'mcq',
    text: 'Why does publishing keyword-optimized blog posts improve your position on Google?',
    options: [
      'Because you\'re paying Google directly to rank higher',
      'Because relevant, optimized content earns organic search visibility',
      'Because video content always outranks written content',
    ],
    correct: 1,
    explanation: 'SEO-optimized content helps search engines understand what your page is about — driving organic (free) traffic without paid ads.',
  },
  {
    id: 10, type: 'mcq',
    text: 'What is the PRIMARY goal of content marketing?',
    options: [
      'To entertain audiences with no business objective',
      'To generate leads, build brand awareness, and engage a target audience',
      'To sell products directly through paid advertisements',
    ],
    correct: 1,
    explanation: 'Content marketing serves multiple business goals — awareness, leads, trust, and loyalty — through consistently valuable content.',
  },
  {
    id: 11, type: 'mcq',
    text: 'A startup with a limited budget chooses digital marketing over TV advertising. What is the MAIN advantage?',
    options: [
      'Digital marketing provides real-time analytics and measurable results',
      'Digital marketing always has larger upfront costs',
      'Digital marketing requires no target audience definition',
    ],
    correct: 0,
    explanation: 'Digital marketing lets you track every click, view, and conversion in real time — something TV ads can never offer.',
  },
  {
    id: 12, type: 'mcq',
    text: 'Which of the following is NOT an example of content marketing?',
    options: ['Blog Posts', 'E-books & Whitepapers', 'TV Commercials'],
    correct: 2,
    explanation: 'TV Commercials are traditional broadcast advertising, not content marketing. Blog posts and e-books are core content marketing formats.',
  },
  {
    id: 13, type: 'mcq',
    text: 'Your guest post on a popular industry blog includes a link back to your website. How does this DIRECTLY help your SEO?',
    options: [
      'By increasing the number of comments on your blog',
      'By adding a backlink that signals authority to search engines',
      'By running paid advertisements alongside the article',
    ],
    correct: 1,
    explanation: 'Backlinks from reputable sites are "votes of confidence" — they tell Google your site is trustworthy and worth ranking higher.',
  },
  {
    id: 14, type: 'mcq',
    text: 'You want your ad to appear at the TOP of Google search results immediately — without waiting months for SEO. Which strategy do you choose?',
    options: [
      'Search Engine Marketing (SEM)',
      'Content Marketing',
      'Social Media Marketing (SMM)',
    ],
    correct: 0,
    explanation: 'SEM (paid search ads) gets you to the top of search results immediately — you pay for that placement.',
  },
  {
    id: 15, type: 'mcq',
    text: 'Which of the following BEST defines Digital Marketing?',
    options: [
      'Marketing using print media and television',
      'Door-to-door sales campaigns',
      'Marketing efforts using electronic devices or the internet',
    ],
    correct: 2,
    explanation: 'Digital marketing encompasses all marketing that uses electronic devices or the internet — SEO, social media, email, and more.',
  },
  {
    id: 16, type: 'mcq',
    text: 'A company creates a one-page visual with statistics and colorful charts titled "10 Steps to Better Sleep" — it gets shared thousands of times on social media. What type of content is this?',
    options: ['Podcast', 'Infographic', 'Blog Post'],
    correct: 1,
    explanation: 'Infographics turn complex data into visual formats that are easy to understand and highly shareable across social platforms.',
  },
  {
    id: 17, type: 'text',
    text: 'What did you understand by Mutual Respect? How does it apply to working in a team?',
    explanation: 'Mutual respect in a team means valuing each person\'s contributions and treating colleagues with dignity regardless of role.',
  },
  {
    id: 18, type: 'mcq',
    text: 'Which of the following CORRECTLY describes a benefit of guest posting?',
    options: [
      'It decreases your website traffic over time',
      'It reduces your brand\'s online authority',
      'It improves SEO through backlinks and increases website traffic',
    ],
    correct: 2,
    explanation: 'Guest posting delivers two SEO and traffic benefits simultaneously — backlinks boost rankings, and the host site sends you referral visitors.',
  },
  {
    id: 19, type: 'mcq',
    text: 'PPC stands for:',
    options: ['Pay-Per-Click', 'Post-Paid Cost', 'Prepaid Clicks'],
    correct: 0,
    explanation: 'PPC (Pay-Per-Click) is an ad model where you pay only when someone actually clicks your ad — not just for it being shown.',
  },
  {
    id: 20, type: 'mcq',
    text: 'A company publishes weekly how-to guides, case studies, and a podcast. The COMBINED effect of all this content is best described as:',
    options: [
      'Reducing internal production costs',
      'Driving organic visitors, creating demand, and building long-term trust',
      'Creating viral videos to boost social engagement',
    ],
    correct: 1,
    explanation: 'A consistent multi-format content strategy drives organic traffic, creates demand, and builds the trust needed for lasting client relationships.',
  },
]

const MCQ_QUESTIONS = questions.filter(q => q.type === 'mcq').length // 18

// ─────────────────────────────────────
// Circular Timer
// ─────────────────────────────────────
function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c * (1 - timeLeft / TOTAL_TIME)
  const color = timeLeft < 120 ? '#ef4444' : timeLeft < 300 ? '#f59e0b' : '#7c3aed'
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
// Question grid
// ─────────────────────────────────────
function QGrid({ current, answers, onJump }: {
  current: number; answers: Record<number, string>; onJump: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {questions.map((_, i) => (
        <button key={i} onClick={() => onJump(i)}
          title={`Question ${i + 1}`}
          className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
            i === current
              ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-gray-900'
              : ''
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
    'Written responses will be reviewed by your manager.',
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-violet-300" />
            <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest">Module 2 · Test</p>
          </div>
          <h2 className="text-2xl font-bold mb-2">Digital, Content Marketing & Guest Posting</h2>
          <p className="text-violet-100 text-sm">Test your knowledge from Lessons 1–4 of Module 2.</p>
        </div>
      </div>

      {/* Metadata strip */}
      <div className="grid grid-cols-4 gap-3">
        {meta.map(m => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{m.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Rules */}
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
  // Calculate MCQ score
  let mcqCorrect = 0
  questions.forEach((q, i) => {
    if (q.type === 'mcq' && answers[i] !== undefined) {
      if (parseInt(answers[i]) === (q as MCQ).correct) mcqCorrect++
    }
  })
  const textAnswered = questions.filter((q, i) => q.type === 'text' && answers[i]).length
  const passed = mcqCorrect === MCQ_QUESTIONS && !terminated

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">

      {/* Score header */}
      <div className={`rounded-3xl p-8 text-white relative overflow-hidden ${
        terminated ? 'bg-gradient-to-br from-red-600 to-rose-700' :
        passed ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
        'bg-gradient-to-br from-amber-500 to-orange-600'
      }`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-black">{mcqCorrect}/{MCQ_QUESTIONS}</div>
            <div className="text-sm opacity-80 mt-1">MCQ Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">
              {terminated ? 'Test Terminated' : passed ? 'Excellent!' : 'Almost There!'}
            </div>
            <div className="text-sm opacity-90">
              {terminated ? 'Tab switching limit exceeded.' :
               passed ? 'You answered all MCQ questions correctly.' :
               `${MCQ_QUESTIONS - mcqCorrect} MCQ question${MCQ_QUESTIONS - mcqCorrect !== 1 ? 's' : ''} need review.`}
            </div>
            <div className="text-xs opacity-70 mt-2">
              Time used: {fmt(timeUsed)} · Written responses: {textAnswered}/2 submitted
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correct', value: mcqCorrect, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'Incorrect', value: MCQ_QUESTIONS - mcqCorrect, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800' },
          { label: 'Written', value: `${textAnswered}/2`, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950', border: 'border-violet-200 dark:border-violet-800' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Written note */}
      {textAnswered > 0 && (
        <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 flex gap-3">
          <FileText className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-violet-700 dark:text-violet-300">
            <strong>Written responses submitted.</strong> Your manager will review these separately and update your score.
          </p>
        </div>
      )}

      {/* Per-question breakdown */}
      <div>
        <p className="font-bold text-gray-900 dark:text-gray-50 mb-3 text-sm">Answer Review</p>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const isText = q.type === 'text'
            const userAnswer = answers[i]
            const isCorrect = !isText && userAnswer !== undefined && parseInt(userAnswer) === (q as MCQ).correct
            const isWrong = !isText && userAnswer !== undefined && !isCorrect
            const unanswered = userAnswer === undefined

            return (
              <div key={q.id} className={`rounded-xl border p-4 ${
                isText ? 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950' :
                isCorrect ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950' :
                isWrong ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950' :
                'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isText ? <FileText className="w-4 h-4 text-violet-500" /> :
                     isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                     isWrong ? <XCircle className="w-4 h-4 text-red-500" /> :
                     <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">Q{q.id}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 leading-snug">{q.text}</p>
                    {isText && (
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold">
                        {userAnswer ? '✅ Response submitted' : '⚠️ Not answered'}
                      </p>
                    )}
                    {isWrong && !isText && (
                      <div className="space-y-1">
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Your answer: <span className="font-semibold">{(q as MCQ).options[parseInt(userAnswer)]}</span>
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          Correct: <span className="font-semibold">{(q as MCQ).options[(q as MCQ).correct]}</span>
                        </p>
                      </div>
                    )}
                    {unanswered && !isText && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">Not answered</p>
                    )}
                    {isWrong && !isText && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Retry */}
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
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Tab Switch Detected</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          This is warning <strong className="text-amber-600 dark:text-amber-400">{count}</strong> of {MAX_TAB_SWITCHES}.
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {MAX_TAB_SWITCHES - count} more {MAX_TAB_SWITCHES - count === 1 ? 'violation' : 'violations'} will terminate your test automatically.
        </p>
        <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-4 tabular-nums">{countdown}</div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl"
        >
          Return to Test
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────
// Submit Confirmation Modal
// ─────────────────────────────────────
function SubmitConfirm({ unanswered, onConfirm, onCancel }: {
  unanswered: number; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Submit Test?</h3>
        {unanswered > 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You have <strong className="text-amber-600 dark:text-amber-400">{unanswered} unanswered question{unanswered !== 1 ? 's' : ''}</strong>. Unanswered questions count as incorrect.
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            All questions answered. Ready to submit?
          </p>
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
// Main Quiz Component
// ─────────────────────────────────────
export default function Lesson10Quiz() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const warnRef = useRef<ReturnType<typeof setInterval> | null>(null)
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

  // Main countdown
  useEffect(() => {
    if (phase !== 'quiz') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setPhase('results')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  // Tab switch detection
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
        if (prev <= 1) {
          clearInterval(warnRef.current!)
          setWarningOpen(false)
          return 10
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(warnRef.current!)
  }, [warningOpen])

  useEffect(() => {
    if (phase !== 'results' || savedRef.current) return
    savedRef.current = true
    let mcqCorrect = 0
    questions.forEach((q, i) => {
      if (q.type === 'mcq' && answers[i] !== undefined && parseInt(answers[i]) === (q as MCQ).correct) mcqCorrect++
    })
    const passed = mcqCorrect === MCQ_QUESTIONS && !terminated
    saveQuizAttempt({ lesson_id: LESSON_ID, score: mcqCorrect, total_questions: MCQ_QUESTIONS, pass_mark: MCQ_QUESTIONS, passed, terminated, time_used: TOTAL_TIME - timeLeft, answers: answers as Record<string, string> })
      .then(() => getQuizAttempts(LESSON_ID).then(setAttempts))
  }, [phase, answers, terminated, timeLeft])

  const go = (dir: number) => {
    const next = currentQ + dir
    if (next < 0 || next >= questions.length) return
    setDirection(dir)
    setCurrentQ(next)
  }

  const jumpTo = (i: number) => {
    setDirection(i > currentQ ? 1 : -1)
    setCurrentQ(i)
  }

  const unanswered = questions.length - Object.keys(answers).length
  const q = questions[currentQ]

  const handleRetry = () => {
    savedRef.current = false
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
    setTimeLeft(TOTAL_TIME)
    setTabSwitches(0)
    setTerminated(false)
    setShowSubmit(false)
    tabCountRef.current = 0
  }

  if (phase === 'intro')   return <IntroScreen onStart={() => setPhase('quiz')} attempts={attempts} attemptsLoading={attemptsLoading} maxAttempts={maxAttempts} />
  if (phase === 'results') return (
    <ResultsScreen answers={answers} terminated={terminated} timeUsed={TOTAL_TIME - timeLeft} onRetry={handleRetry} />
  )

  return (
    <div className="space-y-4">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Test in Progress</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Digital, Content Marketing & Guest Posting</p>
        </div>
        {/* Mobile timer */}
        <div className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`font-bold tabular-nums text-sm ${timeLeft < 120 ? 'text-red-500' : timeLeft < 300 ? 'text-amber-500' : 'text-violet-600 dark:text-violet-400'}`}>
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
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    q.type === 'text'
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {q.type === 'text' ? '✍️ Written' : '1 Mark'}
                  </span>
                </div>
              </div>

              {/* Question body */}
              <div className="p-6 space-y-5">
                <p className="text-gray-900 dark:text-gray-50 font-semibold text-[15px] leading-relaxed">{q.text}</p>

                {/* MCQ options */}
                {q.type === 'mcq' && (
                  <div className="space-y-2.5">
                    {(q as MCQ).options.map((opt, oi) => {
                      const selected = answers[currentQ] === oi.toString()
                      const letter = ['A', 'B', 'C'][oi]
                      return (
                        <motion.button
                          key={oi}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setAnswers(a => ({ ...a, [currentQ]: oi.toString() }))}
                          className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all ${
                            selected
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950'
                              : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition ${
                            selected
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
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
                )}

                {/* Text question */}
                {q.type === 'text' && (
                  <div>
                    <textarea
                      value={answers[currentQ] ?? ''}
                      onChange={e => {
                        const v = e.target.value
                        if (v.length <= 600)
                          setAnswers(a => ({ ...a, [currentQ]: v }))
                      }}
                      placeholder="Write your answer here…"
                      rows={6}
                      className="w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 resize-none transition placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">
                      {(answers[currentQ] ?? '').length}/600 characters
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom nav */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => go(-1)}
                  disabled={currentQ === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </motion.button>

                {currentQ === questions.length - 1 ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSubmit(true)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition"
                  >
                    <Send className="w-4 h-4" />
                    Submit Test
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => go(1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col gap-4 w-56 flex-shrink-0 sticky top-4">

          {/* Timer */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Time Left</p>
            <CircularTimer timeLeft={timeLeft} />
            {tabSwitches > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">
                ⚠️ {tabSwitches}/{MAX_TAB_SWITCHES} tab switches
              </p>
            )}
          </div>

          {/* Question grid */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Questions</p>
            </div>
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

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSubmit(true)}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-sm transition"
          >
            <Send className="w-4 h-4" />
            Submit Test
          </motion.button>
        </div>
      </div>

      {/* Tab warning modal */}
      <AnimatePresence>
        {warningOpen && (
          <TabWarning
            count={tabSwitches}
            countdown={warningCountdown}
            onDismiss={() => { clearInterval(warnRef.current!); setWarningOpen(false) }}
          />
        )}
      </AnimatePresence>

      {/* Submit confirm modal */}
      <AnimatePresence>
        {showSubmit && (
          <SubmitConfirm
            unanswered={unanswered}
            onConfirm={() => { clearInterval(timerRef.current!); setPhase('results') }}
            onCancel={() => setShowSubmit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
