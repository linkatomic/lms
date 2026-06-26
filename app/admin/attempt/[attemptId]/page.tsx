import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, CheckCircle2, XCircle, Shield,
  Clock, AlertTriangle, PenLine, FileText,
} from 'lucide-react'
import ReviewForm from '@/components/admin/ReviewForm'

// ── L27 descriptive questions (Q31–Q40, zero-based indices 30–39) ─────────────
const L27_DESC_QUESTIONS = [
  {
    index: 30, id: 31,
    text: 'Break down the following URL and explain what each part means:\nhttps://www.guestpostlinks.net/guest-posting-service/?ref=blog#pricing',
    hint: 'Identify and describe: Protocol, Subdomain, Domain name, TLD, Path, Query string, and Fragment.',
  },
  {
    index: 31, id: 32,
    text: 'Explain the difference between On-Page SEO and Off-Page SEO. Give two examples of each.',
    hint: 'Think about what you control ON your own website vs what happens OUTSIDE of it.',
  },
  {
    index: 32, id: 33,
    text: 'Name and briefly describe all four types of Search Intent. Provide one example keyword for each type.',
    hint: 'Ask yourself: WHY is the user searching? Learn, find a site, compare, or buy?',
  },
  {
    index: 33, id: 34,
    text: 'Describe the Guest Posting process step by step — from the moment a client places an order to when the backlink goes live.',
    hint: 'Walk through: ordering, publisher selection, content creation, editorial review, publication, and delivery.',
  },
  {
    index: 34, id: 35,
    text: 'What is the difference between White Hat and Black Hat SEO? Give two specific examples of each. What are the risks of Black Hat techniques?',
    hint: 'Think about Google\'s guidelines, long-term sustainability vs short-term gains, and consequences.',
  },
  {
    index: 35, id: 36,
    text: 'What does NAP stand for? Why is NAP consistency critical for Local SEO? What specific problems arise from inconsistent NAP data?',
    hint: 'Think about how search engines verify business legitimacy and local map pack rankings.',
  },
  {
    index: 36, id: 37,
    text: 'What is a Press Release Distribution service? List and explain THREE specific benefits of using press release distribution for SEO and brand building.',
    hint: 'Think about: backlink quality, scale of distribution, Google News, brand credibility.',
  },
  {
    index: 37, id: 38,
    text: "A client messages you: 'I have a budget for 5 links. Should I go with Guest Posts or Niche Edits?' Write a thoughtful recommendation explaining when each option is the better choice.",
    hint: 'Consider: speed, content control, existing page authority, brand building vs link efficiency.',
  },
  {
    index: 38, id: 39,
    text: "Explain GUESTPOSTLINKS' Foreign Language filter. When does it apply and when does it NOT apply? Use a specific example to illustrate the difference.",
    hint: "The filter is about comparing the article language with the website's PRIMARY language.",
  },
  {
    index: 39, id: 40,
    text: 'In 4–6 sentences, describe what makes GUESTPOSTLINKS.NET stand out from other link building services. Include their philosophy, quality standards, and core service approach.',
    hint: 'Think about: team philosophy, publisher vetting, White Hat commitment, the four pillars, and service range.',
  },
]

// ── L27 MCQ question texts (Q1–Q30) ──────────────────────────────────────────
const L27_MCQ_TEXTS: Record<number, { text: string; options: string[]; correct: number }> = {
  0:  { text: 'GUESTPOSTLINKS.NET was launched as the first product of which company?', options: ['Google', 'AMRYTT MEDIA LLC', 'Ahrefs'], correct: 1 },
  1:  { text: 'How many publishers are currently listed on the GUESTPOSTLINKS platform?', options: ['10,000+', '40,000+', '60,000+'], correct: 2 },
  2:  { text: 'What does NAP stand for in the context of Local Citation Building?', options: ['Name, Address, Phone', 'Network Access Protocol', 'Niche Authority Profile'], correct: 0 },
  3:  { text: "Which BEST describes 'Niche Edits' as a link building service?", options: ['Writing new articles for other websites', 'Inserting your link into existing published articles', 'Paying for banner advertising space'], correct: 1 },
  4:  { text: 'What is the PRIMARY SEO benefit of Press Release Distribution?', options: ['Improving website loading speed', 'Increasing social media followers', 'Earning high-DA backlinks from authoritative news sites (DA 50–90+)'], correct: 2 },
  5:  { text: "A website's main language is Spanish. A client orders a Spanish article for it. This order is:", options: ['NOT a foreign language order — it is the site\'s native language', 'A foreign language order requiring the Foreign Language filter', 'A pharmacy niche order'], correct: 0 },
  6:  { text: 'Which of the following is TRUE about CBD (Cannabidiol)?', options: ['CBD and THC both produce a psychoactive high', 'CBD is non-intoxicating, unlike THC which produces a psychoactive high', 'CBD is the same chemical compound as THC'], correct: 1 },
  7:  { text: "Which is one of GUESTPOSTLINKS' four 'What Sets Us Apart' pillars?", options: ['Guaranteed first-page Google rankings within 30 days', 'Unlimited free content revisions on every order', 'Every website and publisher on the platform is carefully vetted for quality'], correct: 2 },
  8:  { text: 'How does GUESTPOSTLINKS describe its relationship with clients beyond being a service provider?', options: ['As an extension of its clients\' teams, working toward shared sustainable growth', 'As a social media management agency', 'As a web design and development company'], correct: 0 },
  9:  { text: "What type of content does the 'Casino/Gaming' filter help identify publishers for?", options: ['Pharmacy and CBD-related content', 'Casino, sports betting, and online gambling-related content', 'Multi-language content for non-English articles'], correct: 1 },
  10: { text: 'What is the fundamental difference between Guest Posting and Niche Edits?', options: ['Guest posts always cost more than niche edits', 'Niche edits require the client to write their own content', 'Guest posts create new articles; niche edits add links into existing published articles'], correct: 2 },
  11: { text: 'Which best describes a "do-follow" backlink?', options: ['A link that tells search engines not to pass authority to the linked page', 'A link that passes SEO authority and ranking power to the linked website', 'A link only visible to logged-in users'], correct: 1 },
  12: { text: 'Which metric measures the overall SEO strength of an entire domain?', options: ['Page Authority (PA)', 'Domain Authority (DA)', 'Click-Through Rate (CTR)'], correct: 1 },
  13: { text: 'What is "Anchor Text" in the context of backlinks?', options: ['The URL of the page being linked to', 'The clickable, visible text of a hyperlink that contains the backlink', 'The title tag of the page that contains the backlink'], correct: 1 },
  14: { text: 'Which of the following is an example of a LOCAL SEO technique?', options: ['Building backlinks from high-DA global news sites', 'Creating and optimising a Google Business Profile with consistent NAP data', 'Writing long-form blog content targeting broad industry keywords'], correct: 1 },
  15: { text: 'What does the term "Niche Relevance" mean in link building?', options: ['The backlink comes from a website in a closely related topic area to your own', 'The backlink is placed at the top of a webpage', 'The backlink uses exact-match anchor text'], correct: 0 },
  16: { text: 'What is a "Contextual Backlink"?', options: ['A backlink placed in a website\'s footer or sidebar', 'A backlink embedded naturally within the body text of a relevant article', 'A backlink displayed as a banner advertisement'], correct: 1 },
  17: { text: "Which of the following correctly defines 'Domain Rating (DR)'?", options: ['A metric by Moz measuring the strength of a webpage\'s backlink profile', 'A metric by Ahrefs measuring the overall strength of a website\'s backlink profile on a 0–100 scale', 'A metric by Google measuring how fast a website loads'], correct: 1 },
  18: { text: 'Which of the following BEST defines a "Backlink"?', options: ['An internal link from one page on your website to another page on the same website', 'A hyperlink on an external website that points to your website', 'A sponsored advertisement link displayed in Google search results'], correct: 1 },
  19: { text: 'What is Page Authority (PA) and how is it different from Domain Authority (DA)?', options: ['PA and DA are identical metrics that measure the same thing', 'PA measures the ranking strength of a SPECIFIC PAGE, while DA measures the overall strength of the entire DOMAIN', 'DA measures a single page\'s strength, while PA measures the whole domain'], correct: 1 },
  20: { text: 'What does "Organic Traffic" refer to in digital marketing?', options: ['Traffic generated from paid advertising campaigns on Google or social media', 'Traffic that comes from visitors clicking on natural, unpaid search engine results', 'Traffic generated by email marketing campaigns'], correct: 1 },
  21: { text: 'What is a "Local Citation" in Local SEO?', options: ['A customer review left on Google Business Profile', 'A mention of your business\'s NAP (Name, Address, Phone) on an external website or directory', 'A paid advertisement in a local newspaper'], correct: 1 },
  22: { text: 'Which of the following is TRUE about a "No-Follow" backlink?', options: ['It passes full SEO authority and is the most valuable type of backlink for ranking', 'It tells search engines not to pass authority to the linked site, but can still drive referral traffic', 'It is invisible to both users and search engines'], correct: 1 },
  23: { text: 'What is the PRIMARY purpose of a "Guest Post" in link building?', options: ['To advertise a product directly on another website using banner ads', 'To publish an original, informative article on another website that includes a backlink to your site', 'To copy existing content from your website and re-publish it on other sites'], correct: 1 },
  24: { text: 'What is "Link Juice" in SEO?', options: ['The volume of organic search traffic a website receives each month', 'The SEO authority and ranking power passed from one webpage to another through a hyperlink', 'The total number of social media shares a piece of content receives'], correct: 1 },
  25: { text: 'Which of the following BEST describes "Search Engine Optimisation (SEO)"?', options: ['Paying Google to display your website at the top of search results', 'The practice of optimising a website to rank higher in organic (unpaid) search engine results', 'Sending targeted email campaigns to potential customers'], correct: 1 },
  26: { text: "What does 'Link Building' mean in the context of SEO?", options: ['Fixing broken links within a website\'s internal pages', 'The process of acquiring hyperlinks from external websites that point back to your website', 'Building a sitemap to help search engines crawl your website'], correct: 1 },
  27: { text: 'What is "Referral Traffic"?', options: ['Traffic that comes from users typing your URL directly into their browser', 'Visitors who arrive at your website by clicking a link on another website (not a search engine)', 'Traffic generated from paid social media advertising campaigns'], correct: 1 },
  28: { text: "What does 'Keyword Ranking' mean in SEO?", options: ['The number of times a keyword appears on your webpage (keyword density)', "Your website's position in search engine results pages (SERPs) for a specific search term", 'The monthly search volume of a keyword on Google'], correct: 1 },
  29: { text: 'Which of the following is a Black Hat SEO technique that should be AVOIDED?', options: ['Buying bulk links from Private Blog Networks (PBNs) to artificially inflate rankings', 'Creating original, long-form, helpful content that earns natural backlinks', 'Reaching out to niche-relevant blogs for guest posting opportunities'], correct: 0 },
}

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default async function AttemptDetailPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params
  const admin = createAdminClient()

  const { data: attempt, error } = await admin
    .from('quiz_attempts')
    .select('*')
    .eq('id', attemptId)
    .single()

  if (error || !attempt) notFound()

  const isL27 = attempt.lesson_id === 27
  const isPending  = attempt.review_status === 'pending'
  const isReviewed = attempt.review_status === 'reviewed'
  const answers: Record<string, string> = attempt.answers ?? {}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center gap-2 text-sm overflow-x-auto">
          <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <Link href="/admin" className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition whitespace-nowrap">Admin</Link>
          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          <Link href="/admin/quiz" className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition whitespace-nowrap">Quizzes</Link>
          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          <Link href={`/admin/quiz/${attempt.lesson_id}`} className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition whitespace-nowrap">
            Lesson {attempt.lesson_id}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          <span className="font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap truncate max-w-[160px]">
            {attempt.user_email ?? 'Attempt'}
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Link href={`/admin/quiz/${attempt.lesson_id}`} className="mt-1 p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">Lesson {attempt.lesson_id} · Attempt</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">{attempt.user_email ?? attempt.user_id}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(attempt.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              &nbsp;&middot;&nbsp;Time used: {fmt(attempt.time_used)}
            </p>
          </div>
        </div>

        {/* Score summary */}
        <div className={`rounded-3xl p-6 text-white relative overflow-hidden ${
          attempt.terminated ? 'bg-gradient-to-br from-red-600 to-rose-700' :
          attempt.passed     ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
                               'bg-gradient-to-br from-amber-500 to-orange-600'
        }`}>
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-6 flex-wrap">
            <div className="text-center flex-shrink-0">
              <div className="text-4xl font-black tabular-nums">{attempt.score}<span className="text-xl font-semibold opacity-70">/{attempt.total_questions}</span></div>
              <div className="text-sm opacity-80 mt-1">MCQ Score</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-bold mb-1">
                {attempt.terminated ? 'Test Terminated' : attempt.passed ? 'Passed' : 'Failed'}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {attempt.terminated && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                    <AlertTriangle className="w-3 h-3" /> Tab violation
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold animate-pulse">
                    <Clock className="w-3 h-3" /> Written: Pending Review
                  </span>
                )}
                {isReviewed && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                    <PenLine className="w-3 h-3" /> Written: Reviewed
                  </span>
                )}
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                  Pass mark: {attempt.pass_mark}/{attempt.total_questions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MCQ answers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h2 className="font-bold text-gray-900 dark:text-gray-50 text-sm">MCQ Answers</h2>
          </div>
          <div className="space-y-2">
            {Array.from({ length: attempt.total_questions }, (_, i) => {
              const ua = answers[String(i)]
              const mcqData = isL27 ? L27_MCQ_TEXTS[i] : null
              const correct  = mcqData?.correct
              const isCorrect  = ua !== undefined && correct !== undefined && parseInt(ua) === correct
              const isWrong    = ua !== undefined && correct !== undefined && !isCorrect
              const unanswered = ua === undefined

              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 ${
                    unanswered ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50' :
                    isCorrect  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950' :
                                 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {unanswered ? (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      ) : isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-0.5">Q{i + 1}</p>
                      {mcqData && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 leading-snug">{mcqData.text}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs">
                        {ua !== undefined ? (
                          <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
                            Selected: <strong>{OPTION_LETTERS[parseInt(ua)]}</strong>
                            {mcqData && ` — ${mcqData.options[parseInt(ua)]}`}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Not answered</span>
                        )}
                        {isWrong && mcqData && (
                          <span className="text-emerald-700 dark:text-emerald-400">
                            Correct: <strong>{OPTION_LETTERS[mcqData.correct]}</strong> — {mcqData.options[mcqData.correct]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Written answers + review (L27 only) */}
        {isL27 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PenLine className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-gray-900 dark:text-gray-50 text-sm">Written Answers</h2>
              {isPending && (
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold animate-pulse">
                  Needs Review
                </span>
              )}
              {isReviewed && (
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
                  Review Complete
                </span>
              )}
            </div>
            <ReviewForm
              attemptId={attemptId}
              questions={L27_DESC_QUESTIONS}
              answers={answers}
              existingFeedback={attempt.admin_feedback ?? {}}
              existingScores={attempt.descriptive_scores ?? {}}
              alreadyReviewed={isReviewed}
            />
          </div>
        )}
      </div>
    </div>
  )
}
