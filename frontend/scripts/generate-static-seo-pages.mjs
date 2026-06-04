import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allLandingPages } from "../src/pages/landing/landingPages.js";

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
  ["/register", "Become a Tutor"],
  ["/jobs", "Tutor Jobs"],
  ["/blog", "Education Blog"],
  ["/learning-tools", "Learning Tools"],
  ["/k-12", "K-12"],
  ["/o-a-level", "O and A Level"],
  ["/quran-tajweed", "Quran and Tajweed"],
  ["/ielts", "IELTS"],
  ["/about", "About"],
];

const basePages = [
  {
    slug: "",
    title: "A Plus Home Tutors - Home and Online Tuition in Pakistan",
    description:
      "A Plus Academy helps students find verified home tutors, online tutors, Quran teachers, IELTS coaches, English tutors, and subject specialists across Pakistan.",
    heading: "A Plus Home Tutors - Home and Online Tuition in Pakistan",
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

const landingPages = Object.values(allLandingPages).map((page) => ({
  slug: page.slug,
  title: page.title,
  description: page.description,
  heading: page.heading,
  intro: page.intro,
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
const blogPages = blogIndex.flatMap((post) => {
  const fullPost = readJson(path.join(publicDir, "blogs", `${post.slug}.json`), post);
  const sourceSections = (fullPost.sourceAnalyses || []).slice(0, 2).map((source) => ({
    title: source.title,
    body: source.summary,
  }));

  return [
    {
      slug: `blog/${post.slug}`,
      title: fullPost.seoTitle || post.title,
      description: post.description,
      heading: post.title,
      intro: post.description,
      sections: [
        ...((fullPost.sections || []).slice(0, 1)),
        ...sourceSections,
      ],
      links: [["/blog", "Education Blog"], ["/learning-tools", "Learning Tools"]],
    },
  ];
});

const pages = [...basePages, ...landingPages, ...blogPages];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pagePath = (slug) => `/${slug}`.replace(/\/$/, "") || "/";
const canonicalUrl = (slug) => `${siteUrl}${pagePath(slug) === "/" ? "" : pagePath(slug)}`;

const renderLinks = (links = []) => {
  const combined = [...links, ...baseLinks];
  const unique = new Map();
  combined.forEach(([href, label]) => {
    if (href && label && href.startsWith("/")) unique.set(href, label);
  });

  return [...unique.entries()]
    .map(
      ([href, label]) =>
        `<a href="${escapeHtml(href)}" style="margin-right:14px;color:#198754;">${escapeHtml(label)}</a>`,
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

  return `<main style="font-family:Roboto,Arial,sans-serif;max-width:1120px;margin:0 auto;padding:40px 20px;line-height:1.7;color:#102019;">
        <h1>${escapeHtml(page.heading || page.title)}</h1>
        <p>${escapeHtml(page.intro || page.description)}</p>
        ${sections}
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

const replaceHead = (html, page) => {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description || page.intro || page.title);
  const canonical = canonicalUrl(page.slug);

  let output = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  output = upsertMeta(output, 'name="description"', `<meta name="description" content="${description}" />`);
  output = upsertMeta(output, 'property="og:title"', `<meta property="og:title" content="${title}" />`);
  output = upsertMeta(output, 'property="og:description"', `<meta property="og:description" content="${description}" />`);
  output = upsertMeta(output, 'property="og:url"', `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  output = upsertMeta(output, 'name="twitter:title"', `<meta name="twitter:title" content="${title}" />`);
  output = upsertMeta(output, 'name="twitter:description"', `<meta name="twitter:description" content="${description}" />`);
  output = upsertCanonical(output, canonical);
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
