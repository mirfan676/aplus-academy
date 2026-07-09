import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allLandingPages } from "../src/pages/landing/landingPages.js";
import { languageCourses } from "../src/pages/courses/languageCoursesData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");
const distDir = path.join(frontendRoot, "dist");
const publicDir = path.join(frontendRoot, "public");
const siteUrl = "https://www.aplusacademy.pk";

const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  throw new Error(`Cannot generate SEO pages because ${indexPath} does not exist.`);
}

const shell = fs.readFileSync(indexPath, "utf8");

const baseLinks = [
  ["/", "Home"],
  ["/teachers", "Find a Tutor"],
  ["/teachers?subject=Physics", "Physics Tutors"],
  ["/register", "Become a Tutor"],
  ["/jobs", "Tutor Jobs"],
  ["/blog", "Education Blog"],
  ["/learning-tools", "Learning Tools"],
  ["/learning-tools/learn-english-vocabulary", "English Vocabulary Tool"],
  ["/learning-tools/improve-english-grammar", "Grammar Tool"],
  ["/learning-tools/text-to-mcqs-short-questions", "Study Questions Tool"],
  ["/learning-tools/pte-essay-practice", "PTE Essay Practice"],
  ["/courses/languages", "Language Courses"],
  ["/courses/languages/english", "English Language Course"],
  ["/courses/languages/german", "German Language Course"],
  ["/courses/languages/chinese", "Chinese Language Course"],
  ["/courses/languages/korean", "Korean Language Course"],
  ["/courses/languages/japanese", "Japanese Language Course"],
  ["/courses/languages/arabic", "Arabic Language Course"],
  ["/k-12", "K-12"],
  ["/o-a-level", "O and A Level"],
  ["/competitive-exams", "Competitive Exams"],
  ["/career-opportunities", "Career Opportunities"],
  ["/referral-program", "Referral Program"],
  ["/buy-courses", "Buy Courses"],
  ["/home-tutors-lahore", "Home Tutors Lahore"],
  ["/a-level-tutors-pakistan", "A Level Tutors Pakistan"],
  ["/ielts-tutor-pakistan", "IELTS Tutor Pakistan"],
  ["/verified-tutors-pakistan", "Verified Tutors Pakistan"],
  ["/quran-tajweed", "Quran and Tajweed"],
  ["/quran-tutor-with-tajweed", "Quran Tutor with Tajweed"],
  ["/ielts", "IELTS"],
  ["/about", "About"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms"],
];

const basePages = [
  {
    slug: "",
    title: "A Plus Home Tutors - Home and Online Tuition in Pakistan",
    description:
      "A Plus Academy helps students find verified home tutors, online tutors, Quran teachers, IELTS coaches, English tutors, and subject specialists across Pakistan.",
    heading: "Trusted home and online tutors for Pakistani students",
    intro:
      "A Plus Academy connects families with tutors for school subjects, O and A Level, Quran with Tajweed, IELTS, English language, programming, IT skills, competitive exams, and university support.",
    sections: [
      {
        title: "Find trusted tutors for important learning goals",
        body:
          "Students can explore tutor profiles, request home tuition, arrange online classes, apply as a tutor, read education updates, and use free study tools for vocabulary, grammar, MCQs, short questions, and revision.",
      },
    ],
  },
  {
    slug: "teachers",
    title: "Find a Tutor in Pakistan | A Plus Home Tutors",
    description:
      "Browse tutor profiles and request home or online tuition for school subjects, O/A Level, Quran, IELTS, English, programming, and university courses.",
    heading: "Find home and online tutors in Pakistan",
    intro:
      "Search verified tutors by subject, city, level, availability, and teaching mode for one-to-one academic and skills support.",
  },
  {
    slug: "register",
    title: "Become a Tutor | Register with A Plus Academy",
    description:
      "Register as a tutor with A Plus Academy for home tuition, online teaching, part-time tutor jobs, and subject-based teaching opportunities.",
    heading: "Register as a tutor with A Plus Academy",
    intro:
      "Qualified teachers can apply for tutoring opportunities in school subjects, Cambridge exams, Quran, IELTS, English, programming, IT, and university subjects.",
  },
  {
    slug: "jobs",
    title: "Tutor Jobs in Pakistan | A Plus Academy",
    description:
      "Explore tutor jobs and teaching opportunities for home tuition, online classes, academic subjects, Quran, IELTS, programming, and skills courses.",
    heading: "Tutor jobs and teaching opportunities",
    intro:
      "A Plus Academy lists tutoring opportunities for teachers who want subject-based home tuition and online teaching work across Pakistan.",
  },
  {
    slug: "blog",
    title: "A Plus Academy Blog | Education News and Learning Trends",
    description:
      "Read education summaries and learning trends across tutoring, exams, language learning, Quran education, skills, and digital learning.",
    heading: "Education insights, trends, and learning updates",
    intro:
      "The A Plus Academy blog covers compact education summaries, study trends, exam updates, and useful learning topics for students and families.",
  },
  {
    slug: "learning-tools",
    title: "Learning Tools for Students | A Plus Academy",
    description:
      "Use free student tools for English vocabulary, sentence translation, grammar improvement, MCQs, short questions, summaries, and revision packs.",
    heading: "Free learning tools for students",
    intro:
      "Students can practise English vocabulary, translate sentences, improve grammar, and turn long study text into MCQs and short questions for revision.",
  },
  {
    slug: "learning-tools/learn-english-vocabulary",
    title: "Learn English Vocabulary | Translate Words and Sentences",
    description:
      "Translate words and sentences into English, Arabic, Spanish, French, Hindi, and Urdu while building practical English vocabulary.",
    heading: "Learn English vocabulary with quick translation",
    intro:
      "Type a word or sentence and use the vocabulary tool to compare meanings across English, Arabic, Spanish, French, Hindi, and Urdu.",
  },
  {
    slug: "learning-tools/improve-english-grammar",
    title: "Improve English Grammar | Sentence Correction Tool",
    description:
      "Improve English grammar with quick corrections, clearer sentence suggestions, and simple explanations for common writing mistakes.",
    heading: "Improve English grammar with simple explanations",
    intro:
      "Paste an English sentence to review grammar, clarity, punctuation, and sentence structure for better writing practice.",
  },
  {
    slug: "learning-tools/text-to-mcqs-short-questions",
    title: "Text to MCQs and Short Questions | Study Pack Generator",
    description:
      "Turn long paragraphs into summaries, short questions, and MCQs for easier student revision and exam preparation.",
    heading: "Convert long study text into MCQs and short questions",
    intro:
      "Paste study notes, lesson text, or a long paragraph to create a compact revision pack with summary points, short questions, and MCQs.",
  },
  {
    slug: "learning-tools/pte-essay-practice",
    title: "Free PTE Essay Practice and Writing Scorer | A Plus Academy",
    description:
      "Sign in with Google to practise PTE essay writing, submit timed responses, receive adaptive feedback, and compare scored student essays.",
    heading: "Practise PTE essay writing with structure and feedback",
    intro:
      "Study original sample responses, sign in with Google, submit a timed essay, review adaptive writing indicators, and compare scored student responses.",
    sections: [
      {
        title: "A complete PTE writing workspace",
        body:
          "The account-based practice module combines sample essays, Google sign-in, a 20-minute timer that stops on submission, private draft saving, structured feedback, scored community responses, and editable planning templates. Results are educational estimates and are not official Pearson scores.",
      },
    ],
  },
  {
    slug: "courses/languages",
    title: "Language Courses in Pakistan | Learn Any Language from Home",
    description:
      "Explore English, German, Chinese, Korean, Japanese, and Arabic language courses from home with guided levels, speaking practice, and structured learning paths.",
    heading: "Learn any language from home",
    intro:
      "A Plus Academy offers language course guidance for English, German, Chinese, Korean, Japanese, and Arabic with beginner to advanced pathways for students and working learners.",
    sections: [
      {
        title: "What language courses usually include",
        body:
          "Strong language courses combine structured levels, speaking practice, listening activities, grammar support, reading tasks, vocabulary building, writing correction, and regular revision instead of isolated word memorization.",
      },
      {
        title: "Choose a course by goal",
        body:
          "Some learners want spoken confidence, others need exam preparation, university pathways, migration support, workplace communication, travel readiness, or a new language foundation from home.",
      },
    ],
  },
  {
    slug: "about",
    title: "About A Plus Academy | Home Tutors in Pakistan",
    description:
      "Learn about A Plus Academy, a home and online tutoring platform helping families find trusted tutors across Pakistan.",
    heading: "About A Plus Academy",
    intro:
      "A Plus Academy supports students and families through tutor matching, home tuition, online learning, education guidance, and student tools.",
  },
  {
    slug: "terms",
    title: "Terms and Conditions | A Plus Academy",
    description:
      "Read the terms and conditions for using A Plus Academy tutoring, tutor registration, student requests, and website services.",
    heading: "Terms and conditions",
    intro:
      "These terms explain how students, parents, tutors, and visitors use A Plus Academy services and website features.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy | A Plus Academy",
    description:
      "Read how A Plus Academy handles contact details, tutor requests, student inquiries, cookies, analytics, and website privacy.",
    heading: "Privacy policy",
    intro:
      "This privacy policy explains how A Plus Academy handles information submitted through forms, tutor requests, cookies, and analytics tools.",
  },
];

const languageCoursePages = languageCourses.map((course) => ({
  slug: `courses/languages/${course.slug}`,
  title: `${course.name} Course in Pakistan | A Plus Academy`,
  description: course.seoDescription,
  heading: course.heroTitle,
  intro: course.heroIntro,
  eyebrow: "Language Course",
  sections: [
    {
      title: "Course focus",
      body: `${course.name} learners usually work on ${course.focusPoints.join(", ").toLowerCase()} through a guided teacher-led pathway.`,
    },
    {
      title: "Course structure",
      body: course.framework,
    },
    ...course.modules.slice(0, 2).map((module, index) => ({
      title: `Learning module ${index + 1}`,
      body: module,
    })),
  ],
  links: [
    ["/courses/languages", "Language Courses"],
    ["/register", "Register"],
    ["/teachers", "Find a Tutor"],
  ],
}));

const landingPages = Object.values(allLandingPages).map((page) => ({
  slug: page.slug,
  title: page.title,
  description: page.description,
  heading: page.heading,
  intro: page.intro,
  eyebrow: page.eyebrow,
  sections: page.sections,
  links: page.popularLinks?.map((link) => [link.to || link.href, link.label]),
}));

const readJson = (filePath, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
};

const blogIndex = readJson(path.join(publicDir, "blogs", "index.json"), []);
const blogIndexLinks = blogIndex.map((post) => [`/blog/${post.slug}`, post.title]);
const blogPages = blogIndex.flatMap((post) => {
  const fullPost = readJson(path.join(publicDir, "blogs", `${post.slug}.json`), post);
  const sourceSections = (fullPost.sourceAnalyses || []).slice(0, 2).map((source) => ({
    title: source.title,
    body: source.summary,
  }));

  return [
    {
      slug: `blog/${post.slug}`,
      title: fullPost.seoTitle || `${post.title} | A Plus Academy Blog`,
      description: post.description,
      type: "article",
      heading: post.title,
      intro: post.description,
      image: fullPost.heroImage?.url || "https://www.aplusacademy.pk/aplus-logo.png",
      publishedAt: fullPost.publishedAt,
      updatedAt: fullPost.updatedAt || fullPost.publishedAt,
      topic: fullPost.topic || fullPost.category || "Education",
      sections: [
        ...((fullPost.sections || []).slice(0, 1)),
        ...sourceSections,
      ],
      links: [["/blog", "Education Blog"], ["/learning-tools", "Learning Tools"]],
    },
  ];
});

const pages = [...basePages, ...languageCoursePages, ...landingPages, ...blogPages];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pagePath = (slug) => `/${slug}`.replace(/\/$/, "") || "/";
const canonicalUrl = (slug) => `${siteUrl}${pagePath(slug) === "/" ? "" : pagePath(slug)}`;
const plainTitle = (title = "") => title.replace(/\s*\|\s*/g, " and ");

const buildSeoParagraphs = (page) => {
  const topic = plainTitle(page.title);
  const focus = page.eyebrow || page.heading || topic;
  const sectionTopics = (page.sections || []).map((section) => section.title || section.heading).filter(Boolean);
  const relatedLinks = (page.links || []).map(([, label]) => label).filter(Boolean);

  return [
    `This page focuses on ${topic}. ${page.heading || topic} is written for students, parents, and working learners who want a practical way to choose support instead of guessing from generic course lists. A Plus Academy looks at the learner's class level, subject gaps, target exam or skill goal, preferred timing, city, and whether home tuition or online tutoring will fit the routine better.`,
    `For ${focus} requests, the right tutor match usually depends on more than subject knowledge. Families often need someone who can explain concepts patiently, set a realistic study pace, notice weak areas early, and keep lessons consistent. Students may need help with homework, exam preparation, speaking confidence, coding practice, Quran reading, university topics, or a short course plan, so the learning path should stay flexible.`,
    `The sections on this page cover ${sectionTopics.join(", ") || "learning goals, tutor matching, study planning, and student support"}. These details help searchers understand what the service includes before contacting the team. Instead of using the same message for every learner, A Plus Academy encourages students to share their current level, syllabus, book or exam board, recent marks, available days, and the outcome they want from classes.`,
    `A useful tutoring plan also considers accountability. Regular lessons, revision targets, practice questions, feedback after mistakes, and parent or student updates make it easier to see whether progress is happening. This matters for school children, O Level and A Level students, IELTS learners, Quran students, university learners, and people building technology or communication skills.`,
    `Before starting classes, it helps to write down the learner's strongest topics, weakest topics, recent test results, preferred language of explanation, and whether the goal is long-term improvement or urgent exam preparation. Clear details make the first conversation more useful and help the tutor plan lessons with less delay.`,
    `This extra context also helps avoid mismatched expectations about fees, lesson frequency, travel, online class setup, and the amount of practice needed between sessions.`,
    `Parents and learners should also think about how success will be measured. A school student may need better marks in monthly tests, an IELTS learner may need a higher writing band, a Quran learner may need smoother recitation, and a programming student may need working projects. Clear targets make lessons easier to review and improve.`,
    `For many families, consistency is more important than a dramatic first lesson. Short revision tasks, weekly feedback, topic checklists, and honest communication help the tutor adjust the pace before small problems become large gaps. This is why A Plus Academy pages include context about subjects, class levels, study goals, and tutor matching instead of only showing a contact form.`,
    `Online tutoring and home tuition can both work well when the setup matches the learner. Home tuition can be useful for younger students who need supervision, while online classes can save travel time for language practice, Quran reading, coding, university topics, and exam revision. The best option depends on the student's routine, attention span, internet access, and need for direct monitoring.`,
    `If this is not the exact page you need, related searches such as ${relatedLinks.join(", ") || "Find a Tutor, Tutor Jobs, Learning Tools, and Education Blog"} can help you move to a closer option. You can also contact A Plus Academy on WhatsApp with the subject, class, city, area, timing, learning goal, and preferred tutor type so the team can suggest the next practical step.`,
  ];
};

const renderLinks = (links = []) => {
  const combined = [...links, ...baseLinks, ...blogIndexLinks];
  const unique = new Map();
  combined.forEach(([href, label]) => {
    if (href && label && href.startsWith("/")) unique.set(href, label);
  });

  return [...unique.entries()]
    .map(
      ([href, label]) =>
        `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`,
    )
    .join("\n          ");
};

const renderFallback = (page) => {
  const sections = (page.sections || [])
    .slice(0, 3)
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading || section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </section>`,
    )
    .join("");
  const seoParagraphs = buildSeoParagraphs(page)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n          ");

  return `<main style="font-family:Roboto,Arial,sans-serif;max-width:1120px;margin:0 auto;padding:40px 20px;line-height:1.7;color:#102019;">
        <h1>${escapeHtml(page.heading || page.title)}</h1>
        <p>${escapeHtml(page.intro || page.description)}</p>
        ${sections}
        <section>
          <h2>${escapeHtml(page.eyebrow || "A Plus Academy")} learning guide</h2>
          ${seoParagraphs}
        </section>
        <nav aria-label="A Plus Academy important pages">
          ${renderLinks(page.links)}
        </nav>
      </main>`;
};

const upsertMeta = (html, selector, replacement) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<meta\\s+${escapedSelector}[^>]*>`, "i");
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
};

const upsertCanonical = (html, href) => {
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  return /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag)
    : html.replace("</head>", `    ${canonicalTag}\n  </head>`);
};

const upsertOrInsert = (html, regex, replacement) =>
  regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);

const replaceHead = (html, page) => {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description || page.intro || page.title);
  const canonical = canonicalUrl(page.slug);
  const image = escapeHtml(page.image || "https://www.aplusacademy.pk/aplus-logo.png");
  const ogType = page.type === "article" ? "article" : "website";
  const structuredData = page.type === "article"
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: page.heading || page.title,
        description: page.description || page.intro || page.title,
        image: page.image || "https://www.aplusacademy.pk/aplus-logo.png",
        datePublished: page.publishedAt,
        dateModified: page.updatedAt || page.publishedAt,
        articleSection: page.topic || "Education",
        mainEntityOfPage: canonical,
        author: {
          "@type": "Organization",
          name: "A Plus Academy",
        },
        publisher: {
          "@type": "Organization",
          name: "A Plus Academy",
          logo: {
            "@type": "ImageObject",
            url: "https://www.aplusacademy.pk/aplus-logo.png",
          },
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.heading || page.title,
        description: page.description || page.intro || page.title,
        url: canonical,
        isPartOf: {
          "@type": "WebSite",
          name: "A Plus Academy",
          url: siteUrl,
        },
      };

  let output = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  output = upsertMeta(output, 'name="description"', `<meta name="description" content="${description}" />`);
  output = upsertMeta(output, 'name="robots"', `<meta name="robots" content="index, follow" />`);
  output = upsertMeta(output, 'property="og:title"', `<meta property="og:title" content="${title}" />`);
  output = upsertMeta(output, 'property="og:description"', `<meta property="og:description" content="${description}" />`);
  output = upsertMeta(output, 'property="og:image"', `<meta property="og:image" content="${image}" />`);
  output = upsertMeta(output, 'property="og:url"', `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  output = upsertMeta(output, 'property="og:type"', `<meta property="og:type" content="${ogType}" />`);
  output = upsertMeta(output, 'property="og:site_name"', `<meta property="og:site_name" content="A Plus Academy" />`);
  output = upsertMeta(output, 'property="og:locale"', `<meta property="og:locale" content="en_PK" />`);
  output = upsertMeta(output, 'name="twitter:title"', `<meta name="twitter:title" content="${title}" />`);
  output = upsertMeta(output, 'name="twitter:description"', `<meta name="twitter:description" content="${description}" />`);
  output = upsertMeta(output, 'name="twitter:image"', `<meta name="twitter:image" content="${image}" />`);
  output = upsertCanonical(output, canonical);
  output = upsertOrInsert(
    output,
    /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`,
  );
  return output;
};

const writePage = (page) => {
  const rootHtml = `<div id="root">\n      ${renderFallback(page)}\n    </div>`;
  const html = replaceHead(shell, page).replace(/<div id="root">[\s\S]*<\/div>\s*<\/body>/, `${rootHtml}\n  </body>`);

  if (!page.slug) {
    fs.writeFileSync(indexPath, html);
    return;
  }

  const routeDir = path.join(distDir, ...page.slug.split("/"));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), html);
};

pages.forEach(writePage);

console.log(`Generated ${pages.length} crawlable SEO HTML pages.`);
