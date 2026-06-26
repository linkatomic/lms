'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, RotateCcw, Clock, Send, Trophy, PenLine,
} from 'lucide-react'
import { getQuizAttempts, saveQuizAttempt, getAttemptLimit, type QuizAttempt } from '@/lib/quiz-attempts'

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const TOTAL_TIME   = 60 * 60   // 60 minutes
const MAX_TAB_SWITCHES = 3
const PASS_MARK    = 21        // 70% of 30 MCQ
const MCQ_COUNT    = 30
const DESC_COUNT   = 10
const LESSON_ID = 27
const MAX_ATTEMPTS = 5

type Phase = 'intro' | 'quiz' | 'results'

interface MCQQuestion {
  id: number; type: 'mcq'
  text: string; options: string[]; correct: number; explanation: string
}
interface DescriptiveQuestion {
  id: number; type: 'descriptive'
  text: string; hint: string; modelAnswer: string
}
type Question = MCQQuestion | DescriptiveQuestion

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

// Simple **bold** renderer for model answers
function renderMD(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// ─────────────────────────────────────
// Questions
// Q1-Q30 : MCQ (auto-scored, pass = 21/30)
// Q31-Q40 : Descriptive written (self-reviewed after submission)
//
// MCQ answer balance: A(0)x10  B(1)x10  C(2)x10
// ─────────────────────────────────────
const questions: Question[] = [

  /* ── MODULE 3 MCQ (Q1–Q12) ──────────────────────────────────── */

  { id: 1, type: 'mcq',
    text: "GUESTPOSTLINKS.NET was launched as the first product of which company?",
    options: ["Google", "AMRYTT MEDIA LLC", "Ahrefs"],
    correct: 1,
    explanation: "AMRYTT MEDIA LLC launched GUESTPOSTLINKS.NET as its first and flagship product — a marketplace connecting link buyers with a vetted network of 60,000+ publishers for SEO and content marketing purposes." },

  { id: 2, type: 'mcq',
    text: "How many publishers are currently listed on the GUESTPOSTLINKS platform?",
    options: ["10,000+", "40,000+", "60,000+"],
    correct: 2,
    explanation: "GUESTPOSTLINKS currently has 60,000+ vetted publishers listed on its platform, giving clients an extensive range of niche-relevant, high-authority websites to place their backlinks on." },

  { id: 3, type: 'mcq',
    text: "What does NAP stand for in the context of Local Citation Building?",
    options: ["Name, Address, Phone", "Network Access Protocol", "Niche Authority Profile"],
    correct: 0,
    explanation: "NAP stands for Name, Address, and Phone Number — the three core business details that must appear consistently across all online directories and citation sources for effective local SEO." },

  { id: 4, type: 'mcq',
    text: "Which of the following BEST describes 'Niche Edits' as a link building service?",
    options: [
      "Writing brand-new articles for other websites to earn a backlink",
      "Inserting your link into existing, already-published articles on established websites",
      "Paying website owners for banner advertising space",
    ],
    correct: 1,
    explanation: "Niche Edits (link insertions) place your backlink within an already-indexed article on an established site, giving you immediate access to that page's existing authority, traffic, and trust signals." },

  { id: 5, type: 'mcq',
    text: "What is the PRIMARY SEO benefit of Press Release Distribution?",
    options: [
      "Improving website loading speed",
      "Increasing social media followers",
      "Earning high-DA backlinks from authoritative news sites (often DA 50–90+)",
    ],
    correct: 2,
    explanation: "Press Release Distribution earns high-DA backlinks from major news outlets, syndicates your announcement to 300+ sites simultaneously, and can get your content indexed in Google News — a powerful authority-building tool." },

  { id: 6, type: 'mcq',
    text: "A website's main language is Spanish. A client orders a Spanish article for it. This order is:",
    options: [
      "NOT a foreign language order — it is the site's native language",
      "A foreign language order requiring the Foreign Language filter",
      "A pharmacy niche order",
    ],
    correct: 0,
    explanation: "The Foreign Language filter only applies when the article language DIFFERS from the site's primary language. A Spanish article on a Spanish-primary site is simply a native-language order — no special filter needed." },

  { id: 7, type: 'mcq',
    text: "Which of the following is TRUE about CBD (Cannabidiol)?",
    options: [
      "CBD and THC both produce a psychoactive high",
      "CBD is non-intoxicating, unlike THC which produces a psychoactive high",
      "CBD is the same chemical compound as THC",
    ],
    correct: 1,
    explanation: "CBD (Cannabidiol) is non-intoxicating and does not produce a high. THC is the psychoactive compound in cannabis. CBD has gained popularity for potential benefits like pain relief, anxiety reduction, and sleep improvement." },

  { id: 8, type: 'mcq',
    text: "Which of the following is one of GUESTPOSTLINKS' four 'What Sets Us Apart' pillars?",
    options: [
      "Guaranteed first-page Google rankings within 30 days",
      "Unlimited free content revisions on every order",
      "Every website and publisher on the platform is carefully vetted for quality",
    ],
    correct: 2,
    explanation: "Commitment to Quality is one of GUESTPOSTLINKS' four key differentiators — every website and publisher is carefully vetted by the team to ensure the highest standards before being listed on the platform." },

  { id: 9, type: 'mcq',
    text: "How does GUESTPOSTLINKS describe its relationship with clients beyond being a service provider?",
    options: [
      "As an extension of its clients' teams, working toward shared sustainable growth and success",
      "As a social media management agency",
      "As a web design and development company",
    ],
    correct: 0,
    explanation: "GUESTPOSTLINKS' core philosophy: 'We don't just see ourselves as a service provider — we see ourselves as an extension of our clients' teams, working together toward sustainable growth and success.'" },

  { id: 10, type: 'mcq',
    text: "What type of content does the 'Casino/Gaming' filter on GUESTPOSTLINKS help identify publishers for?",
    options: [
      "Pharmacy and CBD-related content",
      "Casino, sports betting, and online gambling-related content",
      "Multi-language content for non-English articles",
    ],
    correct: 1,
    explanation: "The Sports/Gaming (Casino/Gaming) filter identifies publishers that accept casino, online gambling, and sports betting content. Since many websites do not allow this content, this filter helps clients find the right publishers quickly." },

  { id: 11, type: 'mcq',
    text: "What is the fundamental difference between Guest Posting and Niche Edits?",
    options: [
      "Guest posts always cost more than niche edits",
      "Niche edits require the client to write their own content",
      "Guest posts create brand-new articles; niche edits add links into existing, already-published articles",
    ],
    correct: 2,
    explanation: "Guest Posts create a brand-new article with your link embedded. Niche Edits insert your link into an existing article that is already indexed and has established authority — providing faster, inherited SEO value." },

  { id: 12, type: 'mcq',
    text: "What type of backlinks does GUESTPOSTLINKS.NET primarily specialise in providing?",
    options: [
      "In-content High-Quality Contextual Whitehat backlinks from high-authority niche websites",
      "Footer and sidebar links from high-traffic websites",
      "Private Blog Network (PBN) links for quick ranking boosts",
    ],
    correct: 0,
    explanation: "GUESTPOSTLINKS specialises in in-content High-Quality Contextual Whitehat backlinks placed naturally within relevant articles on high-authority niche websites — not PBN, footer, or sidebar links." },

  /* ── MODULE 2 KEY TERMINOLOGIES MCQ (Q13–Q22) ─────────────────── */

  { id: 13, type: 'mcq',
    text: "Which of the following BEST describes Domain Authority (DA)?",
    options: [
      "The total number of indexed pages on a website",
      "A Moz metric (0–100) that predicts how well a website is likely to rank in search engine results",
      "The age of a domain name measured in years",
    ],
    correct: 1,
    explanation: "Domain Authority (DA) is a proprietary 0–100 metric by Moz. It predicts how well a website is likely to rank on SERPs. The higher the DA, the stronger the site's ranking power. It is not a Google metric." },

  { id: 14, type: 'mcq',
    text: "What is the PRIMARY difference between a Do-Follow and a No-Follow link?",
    options: [
      "Do-Follow links are free; No-Follow links are paid",
      "No-Follow links appear in a different colour in the browser",
      "Do-Follow links pass link equity (PageRank) to the target; No-Follow links instruct Google not to pass equity",
    ],
    correct: 2,
    explanation: "A Do-Follow link passes 'link juice' (PageRank) to the destination — helping its search rankings. A No-Follow link tells Google not to follow the link or pass authority. Neither changes visual appearance in a browser." },

  { id: 15, type: 'mcq',
    text: 'Which HTML rel attribute identifies a link as pointing to user-generated content (e.g., blog comments or forum posts)?',
    options: ['rel="ugc"', 'rel="nofollow"', 'rel="sponsored"'],
    correct: 0,
    explanation: 'rel="ugc" (User-Generated Content) is the correct attribute for links within user-generated content such as forum posts and blog comments. It signals to Google the link may not be an editorial endorsement from the site owner.' },

  { id: 16, type: 'mcq',
    text: "What does 'Search Intent' mean in the context of SEO and content marketing?",
    options: [
      "The number of times a keyword is searched per month",
      "The underlying reason or goal behind a user's search query",
      "The speed at which search engine results are returned to a user",
    ],
    correct: 1,
    explanation: "Search Intent is the underlying goal behind a user's search — whether they want to buy, learn, compare options, or navigate to a specific site. Matching content to intent is critical for ranking." },

  { id: 17, type: 'mcq',
    text: "Which of the following is the BEST example of a short-tail keyword?",
    options: [
      "best Italian restaurants in downtown Chicago",
      "affordable dentist near me open on Sundays",
      "shoes",
    ],
    correct: 2,
    explanation: "Short-tail keywords are short (1–2 words), broad, and high-volume terms like 'shoes.' The other two examples are long-tail keywords — longer, specific phrases with lower volume but higher purchase intent." },

  { id: 18, type: 'mcq',
    text: 'The rel="sponsored" attribute on a hyperlink tells Google that:',
    options: [
      "The link is paid or commercially motivated and should NOT pass PageRank",
      "The link is from a government or officially verified source",
      "The link has been manually reviewed and verified by a webmaster",
    ],
    correct: 0,
    explanation: 'rel="sponsored" tells Google the link is paid or commercial. Google guidelines require sponsored links do NOT pass PageRank — using this attribute ensures compliance and maintains organic search integrity.' },

  { id: 19, type: 'mcq',
    text: "Which of the following is a recognised WHITE HAT SEO technique?",
    options: [
      "Keyword stuffing",
      "Guest posting on reputable, niche-relevant websites",
      "Cloaking",
    ],
    correct: 1,
    explanation: "Guest posting on reputable niche-relevant websites is a legitimate White Hat SEO technique. Keyword stuffing and cloaking (showing different content to users vs search engines) are both Black Hat techniques that violate Google's guidelines." },

  { id: 20, type: 'mcq',
    text: "What is Page Authority (PA) and how is it different from Domain Authority (DA)?",
    options: [
      "The total number of backlinks pointing to a specific page on a website",
      "A Moz metric (0–100) that predicts how well a specific PAGE will rank — unlike DA which scores the entire website",
      "Google's internal scoring system for ranking individual web pages",
    ],
    correct: 1,
    explanation: "Page Authority (PA) is a Moz metric that predicts how well a single, specific PAGE will rank in search results. Domain Authority (DA) scores the whole website. A strong individual page on a low-DA site can still rank well for specific keywords — which is why both metrics matter in link building." },

  /* ── EXTRA MCQ (Q21–Q30) ─────────────────────────────────────── */

  { id: 21, type: 'mcq',
    text: "What does SEO stand for?",
    options: [
      "Social Engagement Optimization",
      "Search Engine Optimization",
      "Site Efficiency Operations",
    ],
    correct: 1,
    explanation: "SEO stands for Search Engine Optimization — the practice of improving a website's visibility in organic (unpaid) search engine results. Good SEO drives consistent, long-term traffic without ongoing ad spend." },

  { id: 22, type: 'mcq',
    text: "Organic traffic refers to visitors who:",
    options: [
      "Arrive via paid search ads",
      "Come from email newsletters",
      "Find your site through unpaid search engine results",
    ],
    correct: 2,
    explanation: "Organic traffic is free search traffic — visitors who clicked your link in Google, Bing, or other search engines without you paying for it. It is the most sustainable long-term traffic source and the primary goal of SEO." },

  { id: 23, type: 'mcq',
    text: "An outbound (external) link is best defined as:",
    options: [
      "A link from another website pointing to your site",
      "A link from your website pointing to another website",
      "A link that connects two pages within the same website",
    ],
    correct: 1,
    explanation: "An outbound link goes OUT from your site to another site. It is the opposite of a backlink (inbound link). Including high-quality outbound links to authoritative sources can signal trustworthiness to search engines." },

  { id: 24, type: 'mcq',
    text: "Anchor text is defined as:",
    options: [
      "The URL that a hyperlink points to",
      "The hidden HTML code behind a hyperlink",
      "The visible, clickable text of a hyperlink",
    ],
    correct: 2,
    explanation: "Anchor text is the human-readable, clickable text of a link (e.g., 'click here' or 'best link building service'). Search engines use anchor text to understand what the linked page is about — keyword-rich anchor text is valuable for SEO." },

  { id: 25, type: 'mcq',
    text: "The primary goal of Content Marketing is to:",
    options: [
      "Drive instant sales through limited-time promotional offers",
      "Attract and retain a target audience by creating valuable, relevant content",
      "Generate viral social media posts for maximum reach",
    ],
    correct: 1,
    explanation: "Content Marketing is a long-term strategy focused on creating valuable, relevant content to attract and engage a clearly defined audience — building trust and authority over time rather than seeking immediate one-off sales." },

  { id: 26, type: 'mcq',
    text: "A 'high-DA' website in the context of link building means:",
    options: [
      "The site has a high Domain Authority score, making its backlinks more valuable for SEO",
      "The site receives high daily activity from automated bots",
      "The site is hosted on a government (.gov) domain",
    ],
    correct: 0,
    explanation: "DA (Domain Authority) is scored 0–100. A high-DA site has more ranking power, so a backlink from it passes more link equity ('link juice') to your site — making it significantly more valuable for improving your search rankings." },

  { id: 27, type: 'mcq',
    text: "Long-tail keywords are best described as:",
    options: [
      "Short 1–2 word terms with very high monthly search volume",
      "Medium-length phrases with moderate volume and moderate competition",
      "Longer, more specific phrases with lower volume but typically higher purchase intent and less competition",
    ],
    correct: 2,
    explanation: "Long-tail keywords (e.g., 'buy guest posts for tech websites') are specific and detailed. They have lower search volume but attract more qualified visitors — often resulting in higher conversion rates despite lower raw traffic numbers." },

  { id: 28, type: 'mcq',
    text: "A backlink is:",
    options: [
      "A link from your website pointing to an external site",
      "An internal link connecting pages within the same website",
      "A link on another website that points to your website",
    ],
    correct: 2,
    explanation: "A backlink (inbound link) is a link FROM another website TO yours. Backlinks are one of Google's most important ranking factors — the more high-quality sites link to you, the more authority search engines assign to your site." },

  { id: 29, type: 'mcq',
    text: "Referral traffic refers to:",
    options: [
      "Visitors who arrive directly by typing your URL into their browser",
      "Visitors who come to your site by clicking a link on another website",
      "Traffic generated specifically by email newsletter campaigns",
    ],
    correct: 1,
    explanation: "Referral traffic comes from visitors clicking a link on an external website — not from search engines, direct navigation, or paid ads. Backlinks are doubly valuable: they improve SEO rankings AND generate direct referral traffic from the linking page's audience." },

  { id: 30, type: 'mcq',
    text: "Which of the following is a Black Hat SEO technique that should be AVOIDED?",
    options: [
      "Buying bulk links from Private Blog Networks (PBNs) to artificially inflate rankings",
      "Creating original, long-form, helpful content that earns natural backlinks",
      "Reaching out to niche-relevant blogs for guest posting opportunities",
    ],
    correct: 0,
    explanation: "Buying PBN (Private Blog Network) links violates Google's Webmaster Guidelines. If detected, it results in manual penalties, ranking drops, or complete deindexing. GUESTPOSTLINKS exclusively provides White Hat, contextual backlinks from genuine vetted publishers." },

  /* ── DESCRIPTIVE WRITTEN (Q31–Q40) — self-reviewed after submit ── */

  { id: 31, type: 'descriptive',
    text: "Break down the following URL and explain what each part means:\nhttps://www.guestpostlinks.net/guest-posting-service/?ref=blog#pricing",
    hint: "Identify and describe: Protocol, Subdomain, Domain name, TLD, Path, Query string, and Fragment.",
    modelAnswer: `**Protocol:** https:// — HyperText Transfer Protocol Secure. The "S" means the connection is encrypted with SSL/TLS, keeping data safe between the browser and server.

**Subdomain:** www — A prefix to the main domain. Other examples are blog.example.com or shop.example.com.

**Domain Name:** guestpostlinks — The unique registered name of the website.

**TLD (Top-Level Domain):** .net — The domain extension (.com, .org, .net, .co.uk, etc.).

**Path:** /guest-posting-service/ — The specific page or section of the website being navigated to. Each slash (/) separates a folder or page level.

**Query String:** ?ref=blog — Additional parameters sent to the server (commonly used for tracking, filtering, or analytics). Everything AFTER the "?" is a query string. Multiple parameters are separated by "&".

**Fragment / Anchor:** #pricing — A bookmark that scrolls the page directly to the element with id="pricing" without reloading the page. Fragments are not sent to the server — they are handled entirely by the browser.` },

  { id: 32, type: 'descriptive',
    text: "Explain the difference between On-Page SEO and Off-Page SEO. Give two examples of each.",
    hint: "Think about what you control ON your own website vs what happens OUTSIDE of it on other websites or platforms.",
    modelAnswer: `**On-Page SEO** refers to all optimisations you make DIRECTLY on your own website to help search engines understand and rank your content. You have full control over these.

Examples:
1. Optimising page titles, meta descriptions, heading tags (H1, H2, H3), and URL structure
2. Creating high-quality, keyword-rich content that accurately matches the user's search intent
Also includes: image alt text, internal linking, page speed optimisation, and schema markup.

**Off-Page SEO** refers to actions taken OUTSIDE your website that build its authority, credibility, and reputation in the eyes of search engines.

Examples:
1. Earning backlinks through guest posting on reputable niche-relevant sites (via GUESTPOSTLINKS.NET)
2. Press release distribution that earns citations and mentions on authoritative news websites
Also includes: local citations (NAP consistency), social media signals, brand mentions, and reviews.

**Key principle:** On-Page SEO makes your site RELEVANT for a keyword topic. Off-Page SEO signals to Google that OTHERS TRUST your site. You need both working together for strong, sustainable rankings.` },

  { id: 33, type: 'descriptive',
    text: "Name and briefly describe all four types of Search Intent. Provide one example keyword for each type.",
    hint: "Ask yourself: WHY is the user searching? Are they trying to learn, find a site, compare options, or make a purchase?",
    modelAnswer: `**1. Informational Intent** — The user wants to learn something or find an answer to a question. They are not necessarily ready to buy.
Example keyword: "what is link building" / "how does guest posting work"

**2. Navigational Intent** — The user already knows where they want to go and is using search to find a specific website or page quickly.
Example keyword: "GUESTPOSTLINKS login" / "Moz DA checker tool"

**3. Commercial Investigation Intent** — The user is researching before making a purchase decision. They are comparing options, reading reviews, and evaluating services.
Example keyword: "best guest posting services 2024" / "GUESTPOSTLINKS vs competitors"

**4. Transactional Intent** — The user is ready to take a specific action — buy, sign up, download, or order.
Example keyword: "buy guest posts for SEO" / "order link building service"

**Why this matters:** Creating content that matches the CORRECT search intent is critical for ranking. If someone searches "what is a backlink" (Informational), a product sales page will NOT rank — Google expects and rewards an educational, informative article.` },

  { id: 34, type: 'descriptive',
    text: "Describe the Guest Posting process step by step. What happens from the moment a client places an order on GUESTPOSTLINKS.NET to when the backlink goes live?",
    hint: "Walk through each stage: ordering, publisher selection, content creation, editorial review, publication, and delivery.",
    modelAnswer: `**Step 1 — Client Places Order**
The client visits GUESTPOSTLINKS.NET and places an order specifying their requirements: target niche, minimum DA/DR, preferred language, anchor text, target URL, and any special filters (Pharmacy, Casino/Gaming, Foreign Language).

**Step 2 — Publisher Selection**
The GUESTPOSTLINKS team searches the network of 60,000+ vetted publishers to find the most suitable website that matches the client's niche, DA requirements, and topic relevance.

**Step 3 — Content Creation**
A professional writer creates a high-quality, original, niche-relevant article that naturally incorporates the client's backlink and anchor text. The article must provide genuine value to the publisher's readership.

**Step 4 — Article Submission and Editorial Review**
The article is submitted to the publisher for review. The publisher may request edits, adjustments, or additional information before approving the article for publication on their site.

**Step 5 — Publication and Quality Check**
Once published, the GUESTPOSTLINKS team verifies the live URL — checking that the backlink is correctly placed, is do-follow, and appears naturally within the content.

**Step 6 — Delivery to Client**
The verified live URL is delivered to the client, often with a report confirming the DA, placement, and link details. The in-content, contextual do-follow backlink is now live and actively contributing to the client's SEO.` },

  { id: 35, type: 'descriptive',
    text: "What is the difference between White Hat and Black Hat SEO? Give two specific examples of each. What are the risks of using Black Hat techniques?",
    hint: "Think about Google's guidelines, long-term sustainability vs short-term gains, and the consequences of getting caught.",
    modelAnswer: `**White Hat SEO** follows Google's official Webmaster Guidelines. It focuses on providing genuine value to users and builds rankings through legitimate, sustainable methods.

White Hat Examples:
1. Guest posting on real, niche-relevant websites (like through GUESTPOSTLINKS.NET) to earn natural contextual backlinks
2. Creating original, high-quality, helpful long-form content that naturally earns backlinks over time

**Black Hat SEO** uses manipulative techniques that violate Google's guidelines to artificially inflate rankings quickly.

Black Hat Examples:
1. Keyword stuffing — cramming keywords unnaturally into content or metadata to trick search algorithms
2. Private Blog Networks (PBNs) — networks of fake or low-quality sites created purely to sell backlinks

Other Black Hat techniques include: cloaking, link schemes, hidden text, article spinning, and doorway pages.

**Risks of Black Hat SEO:**
1. Google Manual Penalty — a human Google reviewer flags your site, causing severe ranking drops
2. Algorithmic Penalty — algorithm updates like Penguin or Panda automatically detect and penalise manipulation
3. Deindexing — Google removes your site from search results entirely, destroying all organic traffic overnight
4. Loss of investment — rankings built on Black Hat tactics can collapse suddenly, wasting months or years of spend
5. Reputation damage — being publicly associated with spammy SEO tactics harms client and partner trust

**GUESTPOSTLINKS' commitment:** All backlinks are 100% White Hat, contextual, and from genuine publishers — compliant with Google's guidelines, protecting clients' long-term SEO investments.` },

  { id: 36, type: 'descriptive',
    text: "What does NAP stand for? Why is NAP consistency critical for Local SEO? What specific problems arise from inconsistent NAP data across directories?",
    hint: "Think about how search engines verify business legitimacy, local map pack rankings, and what happens when your business info does not match.",
    modelAnswer: `**NAP stands for:** Name, Address, Phone Number — the three core pieces of business identity information used in local SEO.

**Why NAP consistency is critical for Local SEO:**
Search engines like Google cross-reference your business information across hundreds of online directories (Google Business Profile, Yelp, Yellow Pages, TripAdvisor, industry directories, etc.) to verify that your business is legitimate, correctly located, and trustworthy. When your NAP data is consistent everywhere, Google gains confidence in your business and is more likely to rank it prominently in local search results and the Google Map Pack (the top 3 local results shown on maps).

**Problems caused by inconsistent NAP data:**

1. **Confused search engines** — If your business appears as "AMRYTT Media" in one directory and "Amrytt Media LLC" in another, Google may treat them as two different businesses or flag the conflict as unreliable data.

2. **Lower local map pack rankings** — Inconsistent citations reduce Google's confidence in your business location, pushing you lower in the local 3-pack results that appear for location-based searches.

3. **Duplicate and competing listings** — Slight variations create duplicate entries that split authority between multiple profiles instead of consolidating it into one strong listing.

4. **Customer confusion** — Users may call old phone numbers, visit wrong addresses, or arrive at closed locations — damaging trust, conversion rates, and reviews.

**Solution:** Audit ALL directory listings regularly and ensure Name, Address, and Phone Number are IDENTICAL across every platform — even small differences like "Suite 101" vs "#101" or "St." vs "Street" can cause problems.` },

  { id: 37, type: 'descriptive',
    text: "What is a Press Release Distribution service? List and explain THREE specific benefits of using press release distribution for SEO and brand building.",
    hint: "Think about: backlink quality, scale of distribution, Google News, brand credibility, referral traffic, and the type of sites that publish press releases.",
    modelAnswer: `**What is a Press Release?**
A Press Release (PR) is an official written announcement about a newsworthy business event — a product launch, company milestone, award, partnership, research finding, or significant update.

**What is Press Release Distribution?**
Distribution services syndicate your press release SIMULTANEOUSLY to hundreds of news outlets, wire services, media sites, and industry publications (often 300+ sites in a single submission) — making your announcement visible across a wide media network instantly.

**Benefit 1 — High-DA Backlinks at Scale**
Press releases earn backlinks from major news sites that typically have Domain Authority (DA) scores of 50–90+. These are some of the most powerful backlinks available because news sites inherently carry enormous authority in Google's eyes. A single press release can generate dozens of high-DA backlinks simultaneously.

**Benefit 2 — Google News Indexation and Visibility**
When your press release is published on qualifying news sites, it can appear in Google News search results — creating a separate high-visibility discovery channel beyond standard organic search. This gives your content a second life and additional exposure to a broader audience.

**Benefit 3 — Brand Authority, Credibility, and Social Proof**
Being featured on recognised news outlets signals legitimacy and professionalism. When prospective clients, partners, or investors search your brand name, they find authoritative third-party coverage — building trust that paid advertising cannot fully replicate. This also supports ORM (Online Reputation Management) by ensuring positive, authoritative content appears alongside your brand name.

**Bonus:** Press releases also drive referral traffic directly from readers of those news sites — often a highly qualified, engaged audience.` },

  { id: 38, type: 'descriptive',
    text: "A client messages you: 'I have a budget for 5 links. Should I go with Guest Posts or Niche Edits?' Write a thoughtful recommendation explaining when each option is the better choice.",
    hint: "Consider: speed of SEO results, content control, existing page authority, brand building vs link efficiency, and whether a mix is ideal.",
    modelAnswer: `**My recommendation depends on your specific goals — here is how to decide:**

**Choose Guest Posts when:**
- You want to build brand awareness through new, original content on the publisher's site
- You need full creative control over the article topic, angle, and brand messaging
- You are targeting a specific niche audience who regularly reads that publication
- You want to introduce your brand, product, or service to a new readership base
- You are building a long-term, diverse link profile with fresh contextual content

**Choose Niche Edits when:**
- You want faster SEO results — the content is already indexed, trusted, and ranked by Google
- The host article already receives organic traffic for relevant keywords, giving your link immediate exposure
- You want to leverage the existing authority of an aged, established page without waiting for a new article to gain traction
- Efficiency is a priority — niche edits are often more cost-effective per link
- You want a quick win to complement a longer-term guest posting strategy

**My recommended approach:**
For a budget of 5 links, an ideal split might be 3 Guest Posts (for brand building and fresh content) and 2 Niche Edits (for fast authority signals and efficiency). This hybrid strategy gives you both immediate SEO impact from existing page trust AND long-term content equity from new articles.

**Bottom line:** If forced to choose just one — ask yourself: "Do I need speed and efficiency (Niche Edits) or brand building and content control (Guest Posts)?" For most clients, the best long-term answer is BOTH.` },

  { id: 39, type: 'descriptive',
    text: "Explain GUESTPOSTLINKS' Foreign Language filter. When does it apply and when does it NOT apply? Use a specific example to illustrate the difference.",
    hint: "Remember: the filter is about comparing the article language with the website's PRIMARY language. Refer to the artdaily.com example from the course.",
    modelAnswer: `**What the Foreign Language Filter does:**
The Foreign Language filter on the GUESTPOSTLINKS platform identifies publishers whose websites allow articles to be published in languages OTHER than the site's main/primary language — i.e., sites that accept multilingual content.

**When it APPLIES (use the Foreign Language filter):**
When the ordered article is written in a DIFFERENT language from the website's primary/main language.

Example — filter NEEDED:
artdaily.com is primarily an English-language website. However, it also accepts articles in Italian, Spanish, Thai, and German. If a client orders an Italian-language article for artdaily.com, this IS a foreign language order — because Italian is not the site's native language.
English website + Italian article = Foreign Language order

**When it does NOT apply (no filter needed):**
When the article language matches the website's primary language — it is simply a native-language order and does not require the Foreign Language filter.

Example — filter NOT needed:
A website whose primary language is Spanish. A client orders a Spanish-language article for it.
Spanish website + Spanish article = Native language order — NOT a Foreign Language order

**Why this matters in daily operations:**
When processing or placing orders, the key question to ask is: "Is the article language DIFFERENT from the site's main language?" Only if the answer is YES should the Foreign Language filter be applied to find the right set of publishers who support multilingual content.` },

  { id: 40, type: 'descriptive',
    text: "In 4–6 sentences, describe what makes GUESTPOSTLINKS.NET stand out from other link building services. Include their philosophy, quality standards, and core service approach.",
    hint: "Think about: the team philosophy, publisher vetting, type of backlinks provided, White Hat commitment, the four pillars, and the range of services offered.",
    modelAnswer: `GUESTPOSTLINKS.NET stands apart from typical link building services by viewing itself not as a mere vendor but as an extension of its clients' own teams — deeply committed to shared, long-term, sustainable growth rather than short-term transactions.

The platform maintains a rigorously vetted network of 60,000+ publishers, ensuring that every website meets strict quality standards for relevance, authority, and editorial integrity before being listed — because quality over quantity is a core founding principle.

Unlike services that offer risky or Black Hat link schemes, GUESTPOSTLINKS exclusively provides in-content, High-Quality Contextual Whitehat backlinks from high-authority niche websites — fully compliant with Google's Webmaster Guidelines, protecting clients from algorithm penalties and manual actions.

Their four guiding pillars drive every decision: (1) Commitment to Quality — every publisher is personally vetted; (2) Transparency — clear reporting, honest communication; (3) Innovation — continuously improving the platform and service; (4) Sustainable Growth — building link profiles that hold and compound value over time.

Beyond link building, GUESTPOSTLINKS also offers Local SEO, Local Citation Building, and Press Release Distribution — plus specialised handling for three sensitive niche areas (Pharmacy/CBD, Casino/Gaming, Foreign Language) — making them a comprehensive, one-stop partner for diverse, global SEO needs.` },

]

// ─────────────────────────────────────
// Circular Timer
// ─────────────────────────────────────
function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c * (1 - timeLeft / TOTAL_TIME)
  const color = timeLeft < 120 ? '#ef4444' : timeLeft < 300 ? '#f59e0b' : '#2563eb'
  const pulse = timeLeft < 120
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
// Question Grid — 30 MCQ + 10 Written
// ─────────────────────────────────────
function QGrid({ current, answers, onJump }: {
  current: number; answers: Record<number, string>; onJump: (i: number) => void
}) {
  const isMCQAnswered  = (i: number) => answers[i] !== undefined
  const isDescAnswered = (i: number) => answers[i] !== undefined && answers[i].trim() !== ''

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">MCQ &middot; Q1–30</p>
        <div className="grid grid-cols-6 gap-1">
          {questions.slice(0, MCQ_COUNT).map((_, i) => (
            <button key={i} onClick={() => onJump(i)} title={`Q${i + 1}`}
              className={`w-7 h-7 text-[10px] font-bold rounded-md transition-all ${
                i === current ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''
              } ${isMCQAnswered(i)
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}>{i + 1}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-1.5">Written &middot; Q31–40</p>
        <div className="grid grid-cols-5 gap-1">
          {questions.slice(MCQ_COUNT).map((_, idx) => {
            const i = idx + MCQ_COUNT
            return (
              <button key={i} onClick={() => onJump(i)} title={`Q${i + 1}`}
                className={`w-7 h-7 text-[10px] font-bold rounded-md transition-all ${
                  i === current ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''
                } ${isDescAnswered(i)
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900'
                }`}>{i + 1}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-gray-100 dark:border-gray-800">
        {[
          { color: 'bg-emerald-500', label: 'MCQ done' },
          { color: 'bg-amber-500', label: 'Written done' },
          { color: 'bg-gray-200 dark:bg-gray-700', label: 'Pending' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            <span className="text-[9px] text-gray-500 dark:text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
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
    { label: 'Duration', value: '60 Mins' },
    { label: 'MCQ', value: '30' },
    { label: 'Written', value: '10' },
    { label: 'Pass Mark', value: '21 / 30' },
  ]
  const rules = [
    "This is the Final Assessment for the entire 'Let's Create Foundation!' course.",
    'The test has 30 auto-scored MCQ questions and 10 written answer questions.',
    'Written questions are self-reviewed — type your answer and the model answer is revealed after submission.',
    'Once started, the 60-minute timer cannot be paused.',
    'Switching browser tabs is restricted — 3 violations will auto-terminate the test.',
    'You can navigate freely between all 40 questions using the question grid on the right.',
    'Unanswered MCQ questions count as incorrect. A pass mark of 70% (21 out of 30 MCQs) is required.',
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-blue-200" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest">Module 3 &middot; Final Assessment</p>
          </div>
          <h2 className="text-2xl font-bold mb-2">Test: Final Assessment</h2>
          <p className="text-blue-100 text-sm leading-relaxed">40 questions covering the complete course — GUESTPOSTLINKS.NET philosophy, key link building services, local SEO, niche filters, and core digital marketing terminologies. The last 10 are written questions for deeper learning.</p>
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
              <span className="font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>{r}
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
                  {a.review_status === 'pending' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      Written: Pending Review
                    </span>
                  )}
                  {a.review_status === 'reviewed' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      Written: Reviewed ✓
                    </span>
                  )}
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
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold py-4 rounded-2xl text-base shadow-lg flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4" />
          Start Final Test &#8594;
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
  let mcqCorrect = 0
  let mcqAnswered = 0
  questions.slice(0, MCQ_COUNT).forEach((q, i) => {
    if (q.type !== 'mcq') return
    if (answers[i] !== undefined) {
      mcqAnswered++
      if (parseInt(answers[i]) === q.correct) mcqCorrect++
    }
  })
  const mcqIncorrect = mcqAnswered - mcqCorrect
  const mcqSkipped   = MCQ_COUNT - mcqAnswered
  const descAnswered = questions.slice(MCQ_COUNT).filter((_, idx) => {
    const i = idx + MCQ_COUNT
    return answers[i] !== undefined && answers[i].trim() !== ''
  }).length
  const passed = mcqCorrect >= PASS_MARK && !terminated

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">

      {/* Hero */}
      <div className={`rounded-3xl p-8 text-white relative overflow-hidden ${
        terminated ? 'bg-gradient-to-br from-red-600 to-rose-700' :
        passed     ? 'bg-gradient-to-br from-emerald-600 to-teal-700' :
                     'bg-gradient-to-br from-amber-500 to-orange-600'
      }`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-black">{mcqCorrect}<span className="text-2xl font-semibold opacity-70">/{MCQ_COUNT}</span></div>
            <div className="text-sm opacity-80 mt-1">MCQ Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">
              {terminated ? 'Test Terminated' : passed ? 'Course Complete!' : 'Keep Practicing'}
            </div>
            <p className="text-sm opacity-90">
              {terminated
                ? 'Tab switching limit exceeded. Your score has been recorded.'
                : passed
                ? `Congratulations! You scored ${mcqCorrect}/30 and passed the Final Assessment.`
                : `You need ${PASS_MARK - mcqCorrect} more mark${PASS_MARK - mcqCorrect !== 1 ? 's' : ''} to pass (${PASS_MARK}/30 required). Review the content and try again.`}
            </p>
            <p className="text-xs opacity-70 mt-2">Time used: {fmt(timeUsed)} &middot; {descAnswered}/{DESC_COUNT} written questions answered</p>
          </div>
        </div>
      </div>

      {/* MCQ stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'MCQ Correct',   value: mcqCorrect,   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'MCQ Incorrect', value: mcqIncorrect, color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950',         border: 'border-red-200 dark:border-red-800'         },
          { label: 'MCQ Skipped',   value: mcqSkipped,   color: 'text-gray-500 dark:text-gray-400',       bg: 'bg-gray-50 dark:bg-gray-900',       border: 'border-gray-200 dark:border-gray-700'       },
        ].map(s => (
          <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* MCQ answer review */}
      <div>
        <p className="font-bold text-gray-900 dark:text-gray-50 mb-3 text-sm">MCQ Answer Review</p>
        <div className="space-y-2">
          {questions.slice(0, MCQ_COUNT).map((q, i) => {
            if (q.type !== 'mcq') return null
            const ua = answers[i]
            const isCorrect  = ua !== undefined && parseInt(ua) === q.correct
            const isWrong    = ua !== undefined && !isCorrect
            const unanswered = ua === undefined
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
                        <p className="text-xs text-red-600 dark:text-red-400">Your answer: <span className="font-semibold">{q.options[parseInt(ua)]}</span></p>
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

      {/* Descriptive self-review */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <PenLine className="w-4 h-4 text-amber-500" />
          <p className="font-bold text-gray-900 dark:text-gray-50 text-sm">Written Questions — Self-Review</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Compare your answers with the model answers below. These are not auto-scored — use them to reflect on your understanding of the course.</p>
        <div className="space-y-4">
          {questions.slice(MCQ_COUNT).map((q, idx) => {
            if (q.type !== 'descriptive') return null
            const qi = idx + MCQ_COUNT
            const userText = answers[qi]
            const hasAnswer = userText !== undefined && userText.trim() !== ''
            return (
              <div key={q.id} className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 overflow-hidden">
                <div className="px-5 py-4 border-b border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">Q{q.id} — Written Answer</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">{q.text}</p>
                </div>
                <div className="px-5 py-4 border-b border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Your Answer</p>
                  {hasAnswer
                    ? <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{userText}</p>
                    : <p className="text-xs text-gray-400 dark:text-gray-500 italic">Not answered</p>}
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Model Answer</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{renderMD(q.modelAnswer)}</p>
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
function SubmitConfirm({ unansweredMCQ, unansweredDesc, onConfirm, onCancel }: {
  unansweredMCQ: number; unansweredDesc: number; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">Submit Final Test?</h3>
        {(unansweredMCQ > 0 || unansweredDesc > 0) ? (
          <div className="space-y-1.5 mb-6">
            {unansweredMCQ > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                <strong>{unansweredMCQ}</strong> MCQ question{unansweredMCQ !== 1 ? 's' : ''} unanswered — will count as incorrect
              </p>
            )}
            {unansweredDesc > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                <strong>{unansweredDesc}</strong> written question{unansweredDesc !== 1 ? 's' : ''} not filled in
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">All 40 questions completed. Ready to submit your Final Assessment?</p>
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

  useEffect(() => {
    if (phase !== 'results' || savedRef.current) return
    savedRef.current = true
    let mcqCorrect = 0
    questions.slice(0, MCQ_COUNT).forEach((q, i) => {
      if (q.type === 'mcq' && answers[i] !== undefined && parseInt(answers[i]) === (q as MCQQuestion).correct) mcqCorrect++
    })
    const passed = mcqCorrect >= PASS_MARK && !terminated
    saveQuizAttempt({ lesson_id: LESSON_ID, score: mcqCorrect, total_questions: MCQ_COUNT, pass_mark: PASS_MARK, passed, terminated, time_used: TOTAL_TIME - timeLeft, answers: answers as Record<string, string>, review_status: 'pending' })
      .then(() => getQuizAttempts(LESSON_ID).then(setAttempts))
  }, [phase, answers, terminated, timeLeft])

  const go = (dir: number) => {
    const next = currentQ + dir
    if (next < 0 || next >= questions.length) return
    setDirection(dir)
    setCurrentQ(next)
  }
  const jumpTo = (i: number) => { setDirection(i > currentQ ? 1 : -1); setCurrentQ(i) }

  const unansweredMCQ  = questions.slice(0, MCQ_COUNT).filter((_, i) => answers[i] === undefined).length
  const unansweredDesc = questions.slice(MCQ_COUNT).filter((_, idx) => {
    const i = idx + MCQ_COUNT
    return !answers[i] || answers[i].trim() === ''
  }).length
  const totalAnswered = questions.filter((q, i) => {
    if (q.type === 'mcq') return answers[i] !== undefined
    return answers[i] !== undefined && answers[i].trim() !== ''
  }).length

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Final Assessment in Progress</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Test: Final Assessment</p>
        </div>
        <div className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`font-bold tabular-nums text-sm ${timeLeft < 120 ? 'text-red-500' : timeLeft < 300 ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
          animate={{ width: `${(totalAnswered / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{totalAnswered} answered</span>
        <span>{questions.length - totalAnswered} remaining</span>
      </div>

      <div className="flex gap-5 items-start">

        {/* Question card */}
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
              {/* Card header */}
              <div className={`px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between ${
                q.type === 'descriptive'
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950'
                  : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950 dark:via-indigo-950 dark:to-violet-950'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-black ${q.type === 'descriptive' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'}`}>
                    {(currentQ + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">/ {questions.length}</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  q.type === 'descriptive'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {q.type === 'descriptive' ? <><PenLine className="w-3 h-3" /> Written</> : '1 Mark'}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <p className="text-gray-900 dark:text-gray-50 font-semibold text-[15px] leading-relaxed whitespace-pre-wrap">{q.text}</p>

                {q.type === 'mcq' ? (
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
                          }`}>{letter}</span>
                          <p className={`text-sm flex-1 ${selected ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{opt}</p>
                          {selected && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                        </motion.button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-200 dark:border-amber-800 px-4 py-3">
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        <strong>Guide:</strong> {q.hint}
                      </p>
                    </div>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm resize-none focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none transition leading-relaxed"
                      rows={10}
                      placeholder="Write your answer here in as much detail as you can..."
                      value={answers[currentQ] ?? ''}
                      onChange={e => setAnswers(a => ({ ...a, [currentQ]: e.target.value }))}
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-right tabular-nums">
                      {(answers[currentQ] ?? '').length} characters
                    </p>
                  </div>
                )}
              </div>

              {/* Footer nav */}
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

        {/* Desktop sidebar */}
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
          <SubmitConfirm unansweredMCQ={unansweredMCQ} unansweredDesc={unansweredDesc}
            onConfirm={() => { clearInterval(timerRef.current!); setPhase('results') }}
            onCancel={() => setShowSubmit(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
