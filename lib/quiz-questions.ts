export interface AdminQuestion {
  index: number        // 0-based position in the answers record
  id: number           // question number shown to user (1-based)
  type: 'mcq' | 'text' | 'descriptive'
  text: string
  options?: string[]   // MCQ only
  correct?: number     // MCQ only (0-based index)
  hint?: string        // text/descriptive only
}

export const QUIZ_QUESTIONS: Record<number, AdminQuestion[]> = {
  // ── Lesson 10 — Digital, Content Marketing & Guest Posting (18 MCQ + 2 Text) ──
  10: [
    {
      index: 0, id: 1, type: 'mcq',
      text: 'Which of the following is NOT a key component of digital marketing?',
      options: ['Print Advertising', 'Search Engine Optimization (SEO)', 'Content Marketing'],
      correct: 0,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: 'What is the primary networking benefit of guest posting?',
      options: [
        'It isolates your business from industry competitors',
        "It limits your brand's collaboration opportunities",
        'It connects you with bloggers, influencers, and industry experts',
      ],
      correct: 2,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: 'Guest posting builds brand authority primarily because it...',
      options: [
        'Gets your expert content published on reputable external websites',
        'Allows businesses to bypass SEO entirely',
        'Generates immediate, direct product sales',
      ],
      correct: 0,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'In the future of digital marketing, what is the main role of AI and automation?',
      options: [
        'Replace all human marketers entirely',
        'AI will only be used for customer service chatbots',
        'Enhance personalization and improve marketing efficiency',
      ],
      correct: 2,
    },
    {
      index: 4, id: 5, type: 'text',
      text: 'In your own words, explain what Guest Posting is and why it matters for businesses.',
      hint: 'Think about backlinks, traffic, and brand authority — and how publishing on another site helps your own.',
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'A fashion brand sends free products to popular Instagram accounts with millions of followers for honest reviews. What digital marketing strategy is this?',
      options: [
        'Search Engine Marketing (SEM)',
        'Influencer Marketing',
        'Pay-Per-Click (PPC)',
      ],
      correct: 1,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'A customer has been reading your weekly newsletter for 6 months and just made their 3rd purchase. Which content marketing benefit does this BEST show?',
      options: [
        'Earning customer loyalty through consistent educational value',
        'Generating leads through unsolicited cold emails',
        'Hard-selling products to first-time visitors',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'A company offers a free 40-page SEO guide — but you must submit your email to download it. What type of content marketing is this?',
      options: ['Social Media Posts', 'Case Studies', 'Gated E-books & Whitepapers'],
      correct: 2,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'Why does publishing keyword-optimized blog posts improve your position on Google?',
      options: [
        "Because you're paying Google directly to rank higher",
        'Because relevant, optimized content earns organic search visibility',
        'Because video content always outranks written content',
      ],
      correct: 1,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'What is the PRIMARY goal of content marketing?',
      options: [
        'To entertain audiences with no business objective',
        'To generate leads, build brand awareness, and engage a target audience',
        'To sell products directly through paid advertisements',
      ],
      correct: 1,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'A startup with a limited budget chooses digital marketing over TV advertising. What is the MAIN advantage?',
      options: [
        'Digital marketing provides real-time analytics and measurable results',
        'Digital marketing always has larger upfront costs',
        'Digital marketing requires no target audience definition',
      ],
      correct: 0,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: 'Which of the following is NOT an example of content marketing?',
      options: ['Blog Posts', 'E-books & Whitepapers', 'TV Commercials'],
      correct: 2,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: 'Your guest post on a popular industry blog includes a link back to your website. How does this DIRECTLY help your SEO?',
      options: [
        'By increasing the number of comments on your blog',
        'By adding a backlink that signals authority to search engines',
        'By running paid advertisements alongside the article',
      ],
      correct: 1,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: 'You want your ad to appear at the TOP of Google search results immediately — without waiting months for SEO. Which strategy do you choose?',
      options: [
        'Search Engine Marketing (SEM)',
        'Content Marketing',
        'Social Media Marketing (SMM)',
      ],
      correct: 0,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: 'Which of the following BEST defines Digital Marketing?',
      options: [
        'Marketing using print media and television',
        'Door-to-door sales campaigns',
        'Marketing efforts using electronic devices or the internet',
      ],
      correct: 2,
    },
    {
      index: 15, id: 16, type: 'mcq',
      text: 'A company creates a one-page visual with statistics and colorful charts titled "10 Steps to Better Sleep" — it gets shared thousands of times on social media. What type of content is this?',
      options: ['Podcast', 'Infographic', 'Blog Post'],
      correct: 1,
    },
    {
      index: 16, id: 17, type: 'text',
      text: 'What did you understand by Mutual Respect? How does it apply to working in a team?',
      hint: 'Think about how valuing each team member\'s contributions and treating colleagues with dignity — regardless of role — creates a better work environment.',
    },
    {
      index: 17, id: 18, type: 'mcq',
      text: 'Which of the following CORRECTLY describes a benefit of guest posting?',
      options: [
        'It decreases your website traffic over time',
        "It reduces your brand's online authority",
        'It improves SEO through backlinks and increases website traffic',
      ],
      correct: 2,
    },
    {
      index: 18, id: 19, type: 'mcq',
      text: 'PPC stands for:',
      options: ['Pay-Per-Click', 'Post-Paid Cost', 'Prepaid Clicks'],
      correct: 0,
    },
    {
      index: 19, id: 20, type: 'mcq',
      text: 'A company publishes weekly how-to guides, case studies, and a podcast. The COMBINED effect of all this content is best described as:',
      options: [
        'Reducing internal production costs',
        'Driving organic visitors, creating demand, and building long-term trust',
        'Creating viral videos to boost social engagement',
      ],
      correct: 1,
    },
  ],

  // ── Lesson 12 — Key Terminologies-1 (13 MCQ) ─────────────────────────────────
  12: [
    {
      index: 0, id: 1, type: 'mcq',
      text: 'What is anchor text?',
      options: [
        'The title displayed at the top of a browser tab',
        'The clickable, visible text inside a hyperlink',
        'Alternative text added to an image to help search engines understand it',
      ],
      correct: 1,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: 'Which of the following is an example of BRANDED anchor text?',
      options: [
        'GUESTPOSTLINKS',
        'Click here',
        'https://www.guestpostlinks.com',
      ],
      correct: 0,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: "Your article links to a client's site with the anchor text \"click here.\" What type of anchor text is this?",
      options: [
        'Branded',
        'Naked URL',
        'Generic',
      ],
      correct: 2,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'A visually impaired user is browsing with a screen reader. Which HTML element describes an image they cannot see?',
      options: [
        "The hyperlink's anchor text",
        "The image's alt text",
        "The page's meta description",
      ],
      correct: 1,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: 'Which of the following BEST defines an authority site?',
      options: [
        'A trusted, high-quality website that earns strong organic traffic and backlinks from reputable sources',
        'A website that uses paid ads to appear at the top of search results',
        'A brand-new website that publishes 10 articles per day',
      ],
      correct: 0,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'thewayofthegame.net publishes an article and links to standardperhead.com inside it. Which website RECEIVES the backlink?',
      options: [
        'thewayofthegame.net — the website that published the article',
        'Both websites receive it equally',
        'standardperhead.com — the linked destination',
      ],
      correct: 2,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'Why does a higher number of quality backlinks generally help a website rank better on Google?',
      options: [
        'Each backlink acts as a "vote of confidence" that signals to Google the content is trustworthy',
        "Backlinks automatically copy the high-ranking page's content to your website",
        'Google counts backlinks like advertising credits — more links means more ad spend',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'What makes a blog different from a regular static company webpage?',
      options: [
        'A blog requires a paid subscription to publish content',
        'A blog is only used by B2B companies for marketing',
        'A blog is frequently updated with new articles written in a casual, conversational tone',
      ],
      correct: 2,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'You click a link in an article and land on a page that says "No Results Found." What has happened?',
      options: [
        'The page has been successfully crawled and indexed by Google',
        "You've followed a broken link — the destination page has been moved or deleted",
        'The website is using cloaking to show you different content than what search engines see',
      ],
      correct: 1,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'A clothing manufacturer sells fabric in bulk to other fashion brands. What type of transaction is this?',
      options: [
        'B2B (Business-to-Business) — a transaction between two companies',
        'B2C (Business-to-Consumer) — selling directly to individual shoppers',
        "Black Hat SEO — using aggressive tactics to dominate the market",
      ],
      correct: 0,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'In terms of SEO strategy, what is the MAIN difference between B2B and B2C?',
      options: [
        'B2C campaigns always cost more money than B2B campaigns',
        'B2B companies never need a website; B2C companies always do',
        'B2B targets niche keywords with longer sales cycles; B2C targets broader keywords with faster buying decisions',
      ],
      correct: 2,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: "A website secretly shows Google's crawler keyword-stuffed text while showing real users a completely different, clean-looking page. What Black Hat technique is this?",
      options: [
        'PBN (Private Blog Network)',
        'Cloaking',
        'Naked URL anchor text',
      ],
      correct: 1,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: 'What do web crawlers (also called spiders or bots) primarily do?',
      options: [
        'Systematically scan and read websites so search engines can index their content',
        'Automatically remove broken links from websites',
        'Generate backlinks for websites to improve their SEO ranking',
      ],
      correct: 0,
    },
  ],

  // ── Lesson 14 — Key Terminologies-2 (15 MCQ) ─────────────────────────────────
  14: [
    {
      index: 0, id: 1, type: 'mcq',
      text: 'De-indexing refers to:',
      options: [
        "Removing pages from a search engine's index",
        'Improving a website\'s search ranking with new optimisations',
        'Creating new optimised content for Google to crawl',
      ],
      correct: 0,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: 'A user types "nike.com" directly into their browser without clicking any link or search result. What type of traffic does this create for Nike?',
      options: [
        'Organic traffic — the user found Nike through a Google search result',
        'Referral traffic — the user clicked a link from another website',
        'Direct traffic — the user navigated directly without a search engine',
      ],
      correct: 2,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: 'Where are contextual links placed, and what makes them valuable?',
      options: [
        'In the footer or sidebar of a webpage, targeting all visitors equally',
        'Within the body of a paragraph, naturally relevant to the surrounding content',
        'In image alt text only, invisible to regular readers',
      ],
      correct: 1,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'Domain Authority (DA), a score created by Moz, predicts:',
      options: [
        'How old a domain is and when it was first registered',
        'How much organic traffic a website receives per month',
        'How well a website will rank on search engine result pages',
      ],
      correct: 2,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: 'Why does duplicate content negatively impact SEO?',
      options: [
        'Search engines cannot decide which version to rank, so both versions rank poorly',
        'It automatically increases server load and slows the website down',
        'Google issues an immediate manual penalty and bans the domain',
      ],
      correct: 0,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'Which of the following BEST describes an editorial link?',
      options: [
        'A paid link inserted into sponsored content for a fee',
        'A link voluntarily given by an editor or author because the content earns it',
        "A link automatically generated in a website's footer by a CMS",
      ],
      correct: 1,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'A do-follow link allows search engines to:',
      options: [
        'Follow the link and pass SEO value ("link juice") to the destination site',
        'Index the destination page faster using cached data',
        'Display the link in a special "trusted sources" section of search results',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'What is the PRIMARY purpose of competitor analysis in SEO?',
      options: [
        "To copy a competitor's content and republish it on your own site",
        'To report competitors to Google for using Black Hat SEO techniques',
        "To study competitors' strategies, backlinks, and keywords to improve your own SEO",
      ],
      correct: 2,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'Domain Rating (DR) is a metric developed by Ahrefs that:',
      options: [
        'Measures how many years a domain has been registered and active',
        "Predicts ranking potential based on the strength of a site's backlink profile",
        'Shows the exact number of monthly visitors a website receives',
      ],
      correct: 1,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'Which HTML attribute is added to a link to make it a no-follow link?',
      options: [
        'rel="nofollow" — instructs search engines not to pass link juice to the destination',
        'rel="external" — marks the link as pointing to an outside domain',
        'rel="sponsored" — declares the link was paid for by an advertiser',
      ],
      correct: 0,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'Which of the following is an example of a domain?',
      options: [
        '/blog/how-to-write — this is the slug, the path after the domain name',
        'https:// — this is the protocol that secures the connection',
        'www.guestpostlinks.net — this is the main web address of the site',
      ],
      correct: 2,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: 'Older domains can be seen as slightly more trustworthy by search engines because:',
      options: [
        'They have been crawled more times and accumulate more index entries automatically',
        'They have a longer history for search engines to evaluate for consistency and credibility',
        'They automatically receive high-quality editorial backlinks as they age',
      ],
      correct: 1,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: "You publish a sponsored article and link to the advertiser's website. To comply with Google's guidelines, which link type should you use?",
      options: [
        'No-follow or rel="sponsored" — paid links must not pass organic link juice',
        'Do-follow — sponsored links earn the highest editorial SEO value',
        'Editorial — because you are choosing to include the link voluntarily',
      ],
      correct: 0,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: 'You type "site:familyhw.com" into Google and see "Your search did not match any documents." What does this tell you?',
      options: [
        'The website is brand new and Google has not yet had time to crawl it',
        'Google is temporarily unable to load the website due to a server error',
        'The domain has been de-indexed and none of its pages appear in Google',
      ],
      correct: 2,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: "Why do contextual links carry more SEO value than links placed in a website's footer or sidebar?",
      options: [
        'Because they are hidden from users and only visible to search engine crawlers',
        'Because they are surrounded by relevant content, signalling genuine editorial intent',
        'Because contextual links always use branded anchor text which Google prioritises',
      ],
      correct: 1,
    },
  ],

  // ── Lesson 16 — Key Terminologies-3 (15 MCQ) ─────────────────────────────────
  16: [
    {
      index: 0, id: 1, type: 'mcq',
      text: 'Which of the following best describes an external link?',
      options: [
        'A link that points from one domain to a completely different domain',
        'A link that connects two pages within the same website',
        'A link placed at the bottom of a webpage in the footer section',
      ],
      correct: 0,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: 'A website wants to rank for the keyword "Grand Cayman". Which of the following is an example of exact match anchor text?',
      options: [
        '"Click here to learn more about Caribbean island tours"',
        '"Located just minutes from the Grand Cayman, Dolphin Discovery is easily accessible..."',
        '"Visit our partner at dolphindiscovery.com for more details"',
      ],
      correct: 1,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: 'Why can excessive use of footer links be problematic for SEO?',
      options: [
        "Footer links always point to external domains, which reduces the site's link equity",
        'Footer links are invisible to users and therefore make the site difficult to navigate',
        "Too many keyword-stuffed footer links can appear spammy and violate Google's guidelines",
      ],
      correct: 2,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'Which of the following is NOT a factor the Google Algorithm considers when ranking pages?',
      options: [
        'The colour scheme and visual design of the website',
        'Keyword usage and relevancy to the search query',
        'Backlinks from other websites pointing to the page',
      ],
      correct: 0,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: 'Which of the following can Google Analytics track and report for your website?',
      options: [
        'The manual penalty actions applied by Google to penalise your site',
        'Website traffic, user behaviour, bounce rate, and conversion rate',
        'The number and quality of backlinks pointing to your website from other domains',
      ],
      correct: 1,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'Which of the following actions is most likely to result in a Google Penalty?',
      options: [
        "Using Google Analytics to monitor your website's visitor data",
        "Publishing long-form content that targets a single primary keyword",
        'Having a large number of unnatural or paid links pointing to your website',
      ],
      correct: 2,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'Google Search Console is best described as:',
      options: [
        "A free service to monitor, maintain, and troubleshoot your site's presence in Google Search",
        'A paid advertising platform for running keyword-targeted ads in Google search results',
        'A keyword research tool that shows monthly search volume and competition data',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'americanceliac.org publishes an article and includes a hyperlink to safestcheats.com. Which site receives the inbound link?',
      options: [
        'americanceliac.org — because it is the site that published the article',
        'safestcheats.com — because it is the destination site receiving the link',
        'Both sites equally — every hyperlink counts as an inbound link for both pages',
      ],
      correct: 1,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'What are the three steps a search engine must complete to index a webpage?',
      options: [
        'Write, Edit, and Publish the page content',
        'Research keywords, Design the layout, and Deploy to a server',
        'Discover the page URL, Crawl it (download its content), and Process it',
      ],
      correct: 2,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'A link from guestpostlinks.net/guest-post-backlinks/ to guestpostlinks.net/what-is-an-authority-website/ is an example of:',
      options: [
        'An internal link — both pages are on the same domain (guestpostlinks.net)',
        'An external link — it points to a different article on a different topic',
        'An inbound link — it passes authority from one page to another page',
      ],
      correct: 0,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'What is the Google Index?',
      options: [
        'A ranking system that shows which websites have the highest Domain Authority score',
        'A massive collection of web pages that Google uses to deliver search results',
        'A list of websites that have been removed or penalised by Google',
      ],
      correct: 1,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: 'You type "site:https://guestpostlinks.net" into Google and several results appear. What does this confirm?',
      options: [
        'The website has a high Domain Authority and Domain Rating score',
        'The website has been manually reviewed and approved by a Google employee',
        'Multiple pages from guestpostlinks.net have been crawled and indexed by Google',
      ],
      correct: 2,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: 'Which of the following is a key SEO benefit of publishing infographics?',
      options: [
        'They are highly shareable and often attract backlinks from other websites',
        "They significantly improve a webpage's loading speed and Core Web Vitals",
        "They allow Google to understand the page's content better than written text alone",
      ],
      correct: 0,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: 'What is the risk of overusing exact match anchor text across many backlinks?',
      options: [
        'It guarantees higher rankings — the more exact matches used, the better the result',
        'Search engines may see it as a manipulation attempt, potentially leading to penalties',
        'It can only be detected by Google Search Console, not by the core algorithm',
      ],
      correct: 1,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: 'Which of the following files can prevent search engine crawlers from accessing and indexing specific pages on your website?',
      options: [
        'Your Google Analytics tracking code embedded in the page header',
        'Your XML sitemap submitted through Google Search Console',
        'Your robots.txt file — it can explicitly block crawlers from certain URLs',
      ],
      correct: 2,
    },
  ],

  // ── Lesson 18 — Key Terminologies-4 (20 MCQ) ─────────────────────────────────
  18: [
    {
      index: 0, id: 1, type: 'mcq',
      text: 'What happens when multiple pages on your website target the same or very similar keywords?',
      options: [
        "They cannibalize each other, confusing search engines about which page to rank and diluting both pages' relevance",
        "They boost each other's authority by doubling the keyword signals sent to Google",
        'They create stronger combined coverage, helping both pages appear higher in search results',
      ],
      correct: 0,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: 'If the keyword "digital marketing" appears 10 times in a 500-word article, what is the keyword density?',
      options: ['5%', '10%', '2%'],
      correct: 2,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: 'Which three factors does Keyword Difficulty (KD) take into account when estimating how hard it is to rank?',
      options: [
        'Keyword density, bounce rate, and average session duration',
        'Search volume, competition level, and domain authority',
        'Content length, backlink anchor text, and keyword stuffing frequency',
      ],
      correct: 1,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'According to SEO research, approximately what percentage of all clicks goes to the website ranked #1 in search results?',
      options: ['5%', '10%', '28%'],
      correct: 2,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: 'What is the most likely consequence of using keyword stuffing on your website?',
      options: [
        'A Google penalty or removal of the page from search results entirely',
        'Higher keyword density scores that directly improve search rankings',
        'Improved user experience because the content is highly relevant to the keyword',
      ],
      correct: 0,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'What is the primary goal of keyword research in content marketing?',
      options: [
        'To calculate the ideal keyword density percentage for each page on the website',
        'To identify the words and phrases that your target audience is actively typing into search engines',
        'To exchange backlinks with other websites that already rank for those keywords',
      ],
      correct: 1,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'How does keyword analysis differ from keyword research?',
      options: [
        'Keyword analysis evaluates and scores the keywords discovered during research to decide which ones are actually worth targeting',
        'Keyword analysis only measures how often keywords appear on a page, while research finds new keywords',
        'Keyword analysis and keyword research are two names for the exact same process',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'What is the primary purpose of link building in SEO?',
      options: [
        'To increase website traffic through paid advertising campaigns on Google',
        'To acquire high-quality inbound links from other websites that point back to your own',
        'To exchange links with partner websites within the same industry niche',
      ],
      correct: 1,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'Which link building method involves writing and publishing an article on another website that contains a link back to your own site?',
      options: [
        'Broken link building',
        'Digital PR',
        'Guest posting',
      ],
      correct: 2,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'What is a link exchange in SEO?',
      options: [
        "A Google-approved process for verifying and removing toxic links through Search Console",
        "An arrangement between two webmasters where each agrees to link to the other's website",
        'A paid method of acquiring backlinks through sponsored directory listings',
      ],
      correct: 1,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'What does Google classify excessive and irrelevant link exchanges as?',
      options: [
        'A white-hat SEO practice that builds authority naturally over time',
        'A neutral activity that has no positive or negative effect on search rankings',
        'A link scheme that can result in a manual action penalty from Google',
      ],
      correct: 2,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: 'What does a local citation typically contain?',
      options: [
        "A business's name, address, and phone number (NAP) on external websites",
        "A business's keyword density score and monthly organic traffic figures",
        "A business's social media follower count and engagement rate",
      ],
      correct: 0,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: 'Which of the following would count as a valid local citation for a restaurant?',
      options: [
        "A keyword-stuffed paragraph about the restaurant written on the restaurant's own homepage",
        "A food blog article that mentions the restaurant's name but does not include its address or phone number",
        "A JustDial listing showing the restaurant's name, full address, and contact number",
      ],
      correct: 2,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: 'What defines a long-tail keyword?',
      options: [
        'A single-word keyword that targets a very broad and general audience',
        'A highly-specific search phrase typically made up of three or more words',
        'A keyword that only appears in the meta description and URL of a webpage',
      ],
      correct: 1,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: 'Why are long-tail keywords particularly valuable for SEO?',
      options: [
        'They are less competitive and attract users with a clearer, more specific intent — often closer to making a decision',
        'They generate the highest search volumes of any keyword type, bringing the most visitors',
        'They are guaranteed to rank on page 1 because they face absolutely no competition',
      ],
      correct: 0,
    },
    {
      index: 15, id: 16, type: 'mcq',
      text: 'What is the primary purpose of a landing page?',
      options: [
        "To display a website's complete archive of blog posts and articles in one scrollable list",
        'To receive traffic from a specific source and prompt visitors to take one specific action',
        'To serve as the main navigation hub linking to every section of a website',
      ],
      correct: 1,
    },
    {
      index: 16, id: 17, type: 'mcq',
      text: 'What distinguishes a landing page from a standard webpage on a website?',
      options: [
        'It is focused on a single call-to-action from a targeted traffic source, with no distracting navigation menus',
        'It contains full navigation menus and footer links to help visitors freely explore the entire website',
        'It can only be used for paid advertising traffic — never for organic search or email campaigns',
      ],
      correct: 0,
    },
    {
      index: 17, id: 18, type: 'mcq',
      text: 'What is "link juice" in SEO?',
      options: [
        'A term used for paid links that are purchased from high-traffic directories',
        'The value, trust, or authority passed from one webpage to another through a hyperlink',
        'A metric that tracks how many times a keyword appears on the page being linked to',
      ],
      correct: 1,
    },
    {
      index: 18, id: 19, type: 'mcq',
      text: 'If BBC.com links to your article about climate change, what is the SEO effect of this?',
      options: [
        "Your article passes link juice to BBC.com, boosting BBC's authority for the topic",
        'Your article\'s keyword density for "climate change" automatically increases as a result',
        "BBC's link juice flows to your article, boosting your site's credibility and potentially improving its search ranking",
      ],
      correct: 2,
    },
    {
      index: 19, id: 20, type: 'mcq',
      text: 'What keyword density range do SEO best practices recommend for natural, well-optimised content?',
      options: ['1–3%', '5–10%', 'Over 10%'],
      correct: 0,
    },
  ],

  // ── Lesson 20 — Key Terminologies-5 (20 MCQ) ─────────────────────────────────
  20: [
    {
      index: 0, id: 1, type: 'mcq',
      text: "What are Latent Semantic Indexing (LSI) keywords in the context of SEO?",
      options: [
        "Conceptually related terms that search engines use to understand the full context of a webpage's content",
        'A list of the exact keywords that appear most frequently within a webpage',
        'A Google tool used to track keyword rankings across different search engines',
      ],
      correct: 0,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: "What is the primary SEO purpose of a meta description?",
      options: [
        "To directly boost a page's position in Google's ranking algorithm",
        'To influence click-through rates by summarising the page content in search results',
        'To tell search engines which specific keywords the page should be ranked for',
      ],
      correct: 1,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: "Why did Google stop using the meta keywords tag in its ranking algorithm?",
      options: [
        "The tag was too technically difficult for Google's crawlers to parse accurately",
        'It slowed down page indexing and negatively impacted overall site performance',
        'It was frequently abused by webmasters stuffing it with unrelated keywords to manipulate search rankings',
      ],
      correct: 2,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'What is the recommended length for a meta description to avoid being truncated in Google search results?',
      options: ['150–160 characters', '50–75 characters', '300–400 characters'],
      correct: 0,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: "Which of the following best describes a 'metric' in digital marketing and SEO?",
      options: [
        'A type of meta tag used to indicate the primary keyword of a webpage',
        'A quantifiable measure used to track and assess the performance of a specific process or strategy',
        'A backlink score automatically assigned to a webpage by tools like Moz or Ahrefs',
      ],
      correct: 1,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'What is the actual effect on a page that has a noindex tag correctly applied to it?',
      options: [
        'The page loads faster because search engine crawlers skip it entirely',
        'The page receives a ranking boost as it is treated as exclusive, members-only content',
        'The page will be crawled by search engines but will not appear in any search results',
      ],
      correct: 2,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'Which of the following is an on-page SEO technique?',
      options: [
        'Optimising title tags, headings, meta descriptions, and content directly on your website pages',
        'Earning backlinks from other authoritative websites in your industry',
        'Getting brand mentions and shares on third-party social media platforms',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: "What does 'niche' refer to in the context of content marketing?",
      options: [
        'A broad market category designed to target the widest possible online audience',
        'A specialised segment of a broader market that focuses on a specific topic, audience, or product type',
        "The featured section of a website's homepage that targets new first-time visitors",
      ],
      correct: 1,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'In which situations is the nofollow attribute most commonly applied to links?',
      options: [
        'Internal links between pages on the same website',
        "Links to your own homepage included in every page's header or footer",
        'Sponsored advertisements, paid links, and user-generated content such as comments and forum posts',
      ],
      correct: 2,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'If you write an article about cold brew coffee, which of the following is an example of an LSI keyword for that article?',
      options: [
        "Terms like 'filter', 'grind', 'cold water', and 'temperature' that relate to the brewing process",
        "The exact phrase 'cold brew coffee' repeated many times throughout the article to boost density",
        'Competitor website names that also publish content about coffee-related topics',
      ],
      correct: 0,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'What is the primary goal of off-page SEO?',
      options: [
        "To optimise the meta tags, headings, and written content directly on your website's pages",
        "To improve your site's credibility and authority through actions taken outside your own website",
        "To increase page loading speed and fix technical errors within your site's code",
      ],
      correct: 1,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: "What does the 'noreferrer' attribute do when used on a link?",
      options: [
        'It tells search engines not to pass any link equity or ranking power to the destination page',
        'It prevents the linked page from opening in a new browser tab when clicked',
        'It stops the destination website from receiving information about which page sent the visitor',
      ],
      correct: 2,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: "Why is the 'noopener' attribute important for website security?",
      options: [
        "It prevents the newly opened page from accessing and potentially manipulating the original page through the browser's window object",
        "It hides the destination URL from the visitor's browser history after they click the link",
        'It instructs search engine crawlers not to index the content of the linked page',
      ],
      correct: 0,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: "In which year did Google publicly announce that it no longer uses the meta keywords tag in its ranking algorithm?",
      options: ['2005', '2009', '2015'],
      correct: 1,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: 'Which of the following page types is MOST appropriate for applying a noindex tag?',
      options: [
        "A 'Thank You' confirmation page shown after a form submission with no independent SEO value",
        'A product page with detailed descriptions, rich media, and consistent high organic traffic',
        'A homepage that is the primary entry point for visitors arriving from search results',
      ],
      correct: 0,
    },
    {
      index: 15, id: 16, type: 'mcq',
      text: 'Which of the following is an example of an off-page SEO technique?',
      options: [
        'Optimising the H1 heading and page URL slug on a blog post',
        'Earning a backlink from an authoritative website that links to your content',
        'Adding internal links between related pages on your own website',
      ],
      correct: 1,
    },
    {
      index: 16, id: 17, type: 'mcq',
      text: "What does the 'nofollow' link attribute instruct search engines to do?",
      options: [
        'Rank the linked page higher as an endorsement from your site',
        'Crawl the linked page more frequently since you consider it important',
        'Not follow the link or pass any link equity or ranking credit to the linked page',
      ],
      correct: 2,
    },
    {
      index: 17, id: 18, type: 'mcq',
      text: 'When linking to an external website you are unfamiliar with using target="_blank", which combination of attributes is recommended for maximum security and privacy?',
      options: [
        'rel="noopener noreferrer"',
        'rel="nofollow noindex"',
        'rel="sponsored dofollow"',
      ],
      correct: 0,
    },
    {
      index: 18, id: 19, type: 'mcq',
      text: 'Which of the following is NOT considered an on-page SEO element?',
      options: [
        'Image alt text and page title tags',
        'Backlinks from other websites pointing to your content',
        'Internal links connecting related pages on your website',
      ],
      correct: 1,
    },
    {
      index: 19, id: 20, type: 'mcq',
      text: 'Which of the following is the best example of a niche market in content marketing?',
      options: [
        '"Shopping" — targeting all online consumers who make any kind of purchase',
        '"Health" — targeting everyone broadly interested in any aspect of wellbeing',
        '"Yoga for seniors" — targeting a specific activity for a specific demographic group',
      ],
      correct: 2,
    },
  ],

  // ── Lesson 22 — Key Terminologies-6 (20 MCQ) ─────────────────────────────────
  22: [
    {
      index: 0, id: 1, type: 'mcq',
      text: 'What makes organic search results different from paid advertisements on a search engine results page (SERP)?',
      options: [
        'They are non-paid listings ranked by search engine algorithms based on relevance to the search terms',
        'They always appear at the very top of the search page, above every paid ad',
        'They are shown exclusively to users who have an active and signed-in Google account',
      ],
      correct: 0,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: "What is a 'Paid Link' in SEO, and why is it considered a problem?",
      options: [
        'A link shared freely between two websites for mutual content benefits — it is generally accepted by Google',
        "A link for which the site owner paid money — it violates Google's Webmaster Guidelines and can artificially inflate a page's importance",
        'A link placed inside a paid display advertisement that directs users to a product landing page',
      ],
      correct: 1,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: 'Page Authority (PA) is a metric that predicts how well a specific web page will rank. Which company developed it?',
      options: ['Google', 'Ahrefs', 'Moz'],
      correct: 2,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: 'In the context of SEO, what does the acronym PBN stand for?',
      options: ['Private Blog Network', 'Public Blog Network', 'Paid Blog Network'],
      correct: 0,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: 'How does organic traffic differ from other types of website traffic?',
      options: [
        'It comes exclusively from social media platforms such as Facebook, LinkedIn, and Instagram',
        'It comes from unpaid search engine results when users click a non-ad link after a search query',
        'It is traffic purchased through paid search advertising campaigns like Google Ads',
      ],
      correct: 1,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'Which of the following is the correct description of plagiarism?',
      options: [
        "Quoting someone else's work verbatim while using quotation marks and fully citing the original source",
        "Writing content inspired by another author's topic, while using entirely your own original words and ideas",
        "Presenting someone else's work, ideas, or words as your own — whether intentionally or accidentally — without giving proper credit",
      ],
      correct: 2,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'What is the primary keyword on a webpage?',
      options: [
        'The main term or phrase the page is specifically built and optimised to rank for in search results',
        'Any keyword that is currently trending on social media or in a Google Trends report',
        'A keyword used exclusively in paid Google Ads campaigns targeting that particular page',
      ],
      correct: 0,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'Which of the following best describes how the Paid Search advertising model works?',
      options: [
        'Advertisers pay a fixed monthly fee to guarantee their website appears at the top of all search results',
        'Advertisers bid for ad placement and are charged each time a user actually clicks their ad — known as Pay-Per-Click (PPC)',
        "Websites pay search engines a fee to boost their organic keyword rankings in the natural search results",
      ],
      correct: 1,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: 'How is referral traffic defined in digital marketing?',
      options: [
        'Traffic that arrives when a user types your website address directly into the browser bar without clicking any link',
        'Traffic generated through your own paid search or display advertising campaigns',
        'Visitors who arrive at your website by clicking a link located on a different website',
      ],
      correct: 2,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: 'What is an outbound link?',
      options: [
        'A link on your website that points to a page on a completely different domain',
        'A link that connects two separate pages within the same website',
        'A link from another website that points back to a page on your own site',
      ],
      correct: 0,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: 'Why is operating a Private Blog Network (PBN) considered a high-risk SEO strategy?',
      options: [
        'PBNs are expensive to build and require ongoing investment to maintain across multiple domains',
        "They violate Google's Webmaster Guidelines and can result in a manual action penalty, causing pages to lose rankings or be deindexed entirely",
        'Links from PBN sites are automatically categorised as referral traffic rather than backlinks, reducing their SEO effectiveness',
      ],
      correct: 1,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: 'Which combination of tools is used to track and analyse organic traffic to a website?',
      options: [
        'Photoshop, Microsoft Word, and Canva',
        'Facebook Ads Manager, YouTube Analytics, and TikTok Studio',
        'Google Analytics, Ahrefs, SEMrush, and Similarweb',
      ],
      correct: 2,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: 'On what numerical scale is Page Authority (PA) measured by Moz?',
      options: ['1 to 100', '0 to 10', '1 to 1000'],
      correct: 0,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: 'How can linking to high-quality external websites potentially benefit your own website?',
      options: [
        'It guarantees your page will outrank the linked website for any shared keywords',
        "It can improve your site's credibility and may positively influence your own search rankings",
        "It directly increases your own Domain Authority score in Moz's algorithm",
      ],
      correct: 1,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: "According to Google's guidelines, what is the most likely consequence for a website caught buying links to inflate its search rankings?",
      options: [
        "The page receives a short-term ranking boost before Google's algorithm returns it to its natural position",
        "The purchased links are simply ignored by Google's algorithm and have no effect on rankings",
        'The site risks receiving a manual action penalty from Google, which can cause significant ranking drops or removal from search results',
      ],
      correct: 2,
    },
    {
      index: 15, id: 16, type: 'mcq',
      text: "Which form of plagiarism involves rewriting someone else's ideas in your own words without acknowledging the original source?",
      options: [
        "Paraphrasing without citation — rewriting someone's ideas but failing to credit them",
        'Verbatim copying — reproducing exact text without quotation marks',
        'Proper attribution — quoting a source with full citation and quotation marks',
      ],
      correct: 0,
    },
    {
      index: 16, id: 17, type: 'mcq',
      text: 'A user discovers your website by clicking a link in an article published on another blog. How would Google Analytics classify this visit?',
      options: [
        'Organic traffic — because the user found you through written content published online',
        'Referral traffic — because they arrived via a link on a different website',
        "Direct traffic — because they clicked a specific link rather than typing in your URL",
      ],
      correct: 1,
    },
    {
      index: 17, id: 18, type: 'mcq',
      text: 'Where should a primary keyword appear to maximise the SEO performance of a webpage?',
      options: [
        'In the title tag, H1 heading, meta description, URL slug, image alt text, and naturally within the content',
        'Only in the title tag and URL slug — placing it elsewhere risks keyword overuse penalties from Google',
        'Exclusively in hidden meta tags so that search engines can read it without cluttering the visible content',
      ],
      correct: 0,
    },
    {
      index: 18, id: 19, type: 'mcq',
      text: 'When a user searches on Google, what process determines which paid search advertisements are shown and in what order?',
      options: [
        "The age and domain history of the advertiser's website, which determines their trust level",
        "An instant ad auction based on the advertiser's bid amount and their ad's Quality Score",
        'The total number of previous campaigns an advertiser has run on the Google Ads platform',
      ],
      correct: 1,
    },
    {
      index: 19, id: 20, type: 'mcq',
      text: 'Why do organic search results typically receive more clicks than paid ads for the same search query?',
      options: [
        'Organic results are always displayed above paid advertisements on the search results page',
        "Search engines artificially inflate click-through rates for organic results in their analytics reporting",
        'Users tend to trust organic results more, as they reflect genuine relevance rather than paid placement',
      ],
      correct: 2,
    },
  ],

  // ── Lesson 24 — Key Terminologies-7 (20 MCQ) ─────────────────────────────────
  24: [
    {
      index: 0, id: 1, type: 'mcq',
      text: "In web analytics, what does 'traffic' specifically refer to?",
      options: [
        'The number of pages a visitor views per session on a website',
        'The amount of data sent and received by visitors to a website',
        'The speed at which a website loads for its visitors',
      ],
      correct: 1,
    },
    {
      index: 1, id: 2, type: 'mcq',
      text: 'Where are sidebar links typically located on a webpage?',
      options: [
        'Embedded within the main body paragraphs of the page',
        'In a vertical column on the left or right side of a webpage',
        'At the bottom of the page inside the footer section',
      ],
      correct: 1,
    },
    {
      index: 2, id: 3, type: 'mcq',
      text: "Which of the following is NOT considered a ranking factor by Google's search algorithm?",
      options: [
        'Page speed and loading time',
        'Quality and quantity of backlinks',
        'The colour scheme and font choice used on the website',
      ],
      correct: 2,
    },
    {
      index: 3, id: 4, type: 'mcq',
      text: "A user searches 'best noise-cancelling headphones 2024.' What type of search intent does this most likely represent?",
      options: [
        "Navigational — the user wants to reach a specific brand's website",
        'Transactional — the user is ready to make a purchase immediately',
        'Commercial investigation — the user is researching before making a purchase decision',
      ],
      correct: 2,
    },
    {
      index: 4, id: 5, type: 'mcq',
      text: 'What is a Search Engine Results Page (SERP)?',
      options: [
        'A backend database where search engines store all indexed web pages',
        'The list of web pages a search engine displays in response to a specific query',
        "A report generated by an SEO tool showing your website's keyword rankings",
      ],
      correct: 1,
    },
    {
      index: 5, id: 6, type: 'mcq',
      text: 'Which of the following labels is commonly found in a sponsored blog post to indicate paid content?',
      options: [
        '"Written by an expert contributor"',
        '"Presented by"',
        '"Editor\'s Pick"',
      ],
      correct: 1,
    },
    {
      index: 6, id: 7, type: 'mcq',
      text: 'When a hyperlink uses the rel="sponsored" attribute, what does this tell search engines?',
      options: [
        'The link should be followed and will pass full SEO link equity to the destination page',
        'The linked page should be removed from the search index entirely',
        'The link is part of a paid promotion and will not pass SEO link equity (PageRank)',
      ],
      correct: 2,
    },
    {
      index: 7, id: 8, type: 'mcq',
      text: 'Which of the following BEST describes a webpage?',
      options: [
        'A document or information resource suitable for the World Wide Web, accessible through a web browser',
        "A website's navigation menu structure and internal link architecture",
        "The URL slug that appears at the end of a website's address",
      ],
      correct: 0,
    },
    {
      index: 8, id: 9, type: 'mcq',
      text: "What is a 'search term' or 'search query' in SEO?",
      options: [
        'The title tag of a webpage that search engines use to identify it in results',
        'The word or phrase a user types into a search engine to find information',
        'The URL of a webpage submitted to a search engine for indexing',
      ],
      correct: 1,
    },
    {
      index: 9, id: 10, type: 'mcq',
      text: "If 'Italian restaurants' is the primary keyword, which of the following would be considered a secondary keyword?",
      options: ['Pizza', 'Dog food', 'Running shoes'],
      correct: 0,
    },
    {
      index: 10, id: 11, type: 'mcq',
      text: "What does 'Trust Flow' measure in SEO?",
      options: [
        'The level of confidence search engines have in a website, influenced by content quality and the quality of its backlinks',
        "The speed at which pages on a website load in a user's browser",
        'The total number of backlinks pointing to a website, regardless of their quality',
      ],
      correct: 0,
    },
    {
      index: 11, id: 12, type: 'mcq',
      text: "Why is improving 'search visibility' important for a website?",
      options: [
        'It directly increases the number of backlinks pointing to a website',
        "It guarantees that a website's pages will be indexed by Google within 24 hours",
        'It determines how often a website appears for its target keywords, directly impacting organic traffic',
      ],
      correct: 2,
    },
    {
      index: 12, id: 13, type: 'mcq',
      text: "How does site speed impact a website's performance in search engines?",
      options: [
        'Google has confirmed page speed as a ranking factor, so slow sites may rank lower than faster competitors',
        'Site speed only affects user experience and has no influence on search engine rankings',
        'Faster websites are penalised by Google because they may load before content is fully optimised',
      ],
      correct: 0,
    },
    {
      index: 13, id: 14, type: 'mcq',
      text: 'What keyboard shortcut opens the word count window in Google Docs?',
      options: ['Ctrl + Alt + Delete', 'Ctrl + Shift + C', 'Ctrl + Shift + T'],
      correct: 1,
    },
    {
      index: 14, id: 15, type: 'mcq',
      text: 'Which of the following correctly describes the components of a web address (URL)?',
      options: [
        'A protocol (e.g., https://), a domain name, and a path to the specific resource or page',
        'An email address combined with a domain name and a password',
        'Only the domain name of the website',
      ],
      correct: 0,
    },
    {
      index: 15, id: 16, type: 'mcq',
      text: 'What is the key difference between White Hat SEO and Black Hat SEO?',
      options: [
        "White Hat SEO follows Google's guidelines and provides genuine value to users; Black Hat SEO violates them using deceptive tactics",
        'White Hat SEO is a premium paid service while Black Hat SEO is free to implement',
        'Black Hat SEO improves user experience while White Hat SEO prioritises search engines over users',
      ],
      correct: 0,
    },
    {
      index: 16, id: 17, type: 'mcq',
      text: 'What does the rel="ugc" link attribute tell search engines about a hyperlink?',
      options: [
        'The link is a sponsored advertisement placed by the website owner',
        'The link was created by a user (e.g., in a comment or forum post), not by the website owner',
        'The link leads to an official social media profile verified by the platform',
      ],
      correct: 1,
    },
    {
      index: 17, id: 18, type: 'mcq',
      text: 'Which of the following is the BEST example of a short-tail keyword?',
      options: [
        '"Best noise-cancelling headphones under $100 for remote work"',
        '"How to train a golden retriever puppy in 30 days"',
        '"Shoes"',
      ],
      correct: 2,
    },
    {
      index: 18, id: 19, type: 'mcq',
      text: "What does 'website navigation' fundamentally refer to?",
      options: [
        'The process of navigating a network of information resources on the web, organised as hypertext or hypermedia',
        'The URL structure and folder hierarchy used to organise pages within a domain',
        'The speed at which a user can load each page while browsing a website',
      ],
      correct: 0,
    },
    {
      index: 19, id: 20, type: 'mcq',
      text: "In the URL 'https://example.com/blog/what-is-seo', what is the URL slug?",
      options: [
        'https://example.com',
        '/blog',
        'what-is-seo',
      ],
      correct: 2,
    },
  ],
}
