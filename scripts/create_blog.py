#!/usr/bin/env python3
"""Create and optionally publish an original education-news blog post.

The script intentionally uses public RSS/search feeds and short snippets only.
It does not copy full articles. Each generated post includes references back to
the original sources plus a credited free image.

Usage:
  python scripts/create_blog.py
  python scripts/create_blog.py --publish
  python scripts/create_blog.py --topic "IELTS preparation in Pakistan"
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import email.utils
import html
import json
import os
import re
import subprocess
import sys
import textwrap
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "frontend" / "public" / "blogs"
BLOG_IMAGE_DIR = BLOG_DIR / "images"
BLOG_INDEX = BLOG_DIR / "index.json"
SITEMAP = ROOT / "frontend" / "public" / "sitemap.xml"
SITE_URL = "https://www.aplusacademy.pk"

BLOG_CATEGORIES = [
    {
        "label": "K-12",
        "queries": [
            "global K-12 education students schools learning trends",
            "primary secondary education curriculum students worldwide",
            "school learning recovery assessment education international",
        ],
    },
    {
        "label": "O & A Level",
        "queries": [
            "Cambridge O Level A Level education exams students international",
            "Cambridge International education A Level O Level exams",
            "IGCSE O Level A Level students schools global education",
        ],
    },
    {
        "label": "Bachelors / Masters",
        "queries": [
            "higher education university students bachelors masters global trends",
            "university admissions graduate education international students",
            "college students skills employment higher education worldwide",
        ],
    },
    {
        "label": "Competitive Exams",
        "queries": [
            "competitive exams students test preparation education global",
            "standardized tests admissions exams students international",
            "exam preparation students assessment education news worldwide",
        ],
    },
    {
        "label": "IT & Technology",
        "queries": [
            "education technology IT skills students global learning",
            "digital skills computer science education students worldwide",
            "AI technology education students teachers global",
        ],
    },
    {
        "label": "Programming",
        "queries": [
            "programming education coding students global computer science",
            "coding skills students schools universities programming learning",
            "software development education students programming courses worldwide",
        ],
    },
    {
        "label": "Qur'an & Tajweed",
        "queries": [
            "Quran education Tajweed online learning students global",
            "Islamic education Quran learning children online classes",
            "Quran Tajweed teaching students education worldwide",
        ],
    },
    {
        "label": "English Language",
        "queries": [
            "English language learning students global education",
            "spoken English learning students education worldwide",
            "English grammar writing language learning international students",
        ],
    },
    {
        "label": "IELTS",
        "queries": [
            "IELTS students study abroad English test global education",
            "IELTS preparation international students study abroad news",
            "English proficiency tests IELTS education migration students",
        ],
    },
    {
        "label": "Graphics & Multimedia",
        "queries": [
            "graphic design education students multimedia skills global",
            "digital media design courses students creative skills education",
            "multimedia design learning students creative technology worldwide",
        ],
    },
]

NEWS_QUERIES = [query for category in BLOG_CATEGORIES for query in category["queries"][:1]]

STOPWORDS = {
    "about",
    "after",
    "again",
    "against",
    "also",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "have",
    "how",
    "in",
    "into",
    "is",
    "it",
    "new",
    "news",
    "of",
    "on",
    "or",
    "pakistan",
    "says",
    "school",
    "schools",
    "students",
    "that",
    "the",
    "their",
    "this",
    "to",
    "with",
}

IMAGE_POOL = [
    {
        "keywords": ["ai", "technology", "online", "digital", "computer"],
        "url": "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/person-using-macbook-pro-1181354/",
        "credit": "Pexels free photo",
        "alt": "Student using a laptop for online learning",
    },
    {
        "keywords": ["ielts", "abroad", "english", "language"],
        "url": "https://images.pexels.com/photos/5940831/pexels-photo-5940831.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/person-writing-on-white-paper-5940831/",
        "credit": "Pexels free photo",
        "alt": "Student writing study notes",
    },
    {
        "keywords": ["university", "higher", "college", "admission"],
        "url": "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/people-walking-in-a-campus-267885/",
        "credit": "Pexels free photo",
        "alt": "Students walking on a university campus",
    },
    {
        "keywords": ["exam", "exams", "assessment", "cambridge", "level"],
        "url": "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/books-on-library-shelf-256417/",
        "credit": "Pexels free photo",
        "alt": "Books in a library for exam preparation",
    },
    {
        "keywords": ["teacher", "class", "curriculum", "children"],
        "url": "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/a-child-studying-with-a-tutor-5212345/",
        "credit": "Pexels free photo",
        "alt": "Child studying with tutor support",
    },
]

ARTICLE_IMAGE_SLOTS = [
    "hero",
    "student impact",
    "parent action plan",
    "tutor guidance",
]

CATEGORY_GUIDANCE = {
    "K-12": {
        "focus": "school routines, concept clarity, assessments, homework support, and age-appropriate online learning",
        "actions": [
            "Check the child's current syllabus and mark the three weakest chapters before booking extra support.",
            "Build a weekly plan with one concept session, one written practice session, and one short review conversation.",
            "Ask the tutor to share visible progress: quiz scores, corrected mistakes, and next-week goals.",
        ],
    },
    "O & A Level": {
        "focus": "Cambridge syllabus coverage, past papers, subject choices, predicted grades, and exam-board updates",
        "actions": [
            "Match every lesson to the current Cambridge syllabus and keep a topic-by-topic checklist.",
            "Practise past-paper questions under timed conditions, then review the mark scheme rather than only the answer.",
            "Confirm registration deadlines, component codes, and predicted-grade requirements with the school.",
        ],
    },
    "Bachelors / Masters": {
        "focus": "university admissions, degree planning, research skills, employability, and postgraduate readiness",
        "actions": [
            "Shortlist programmes by entry requirements, fee deadlines, scholarship dates, and career outcomes.",
            "Strengthen academic writing, presentation, and research methods before final-year pressure arrives.",
            "Use tutoring or mentoring for difficult courses instead of waiting until the final exam week.",
        ],
    },
    "Competitive Exams": {
        "focus": "syllabus tracking, past papers, admissions tests, time management, and official notices",
        "actions": [
            "Download the latest official syllabus and convert it into a weekly preparation tracker.",
            "Do one timed practice set every week and record mistakes by topic, not just by score.",
            "Verify dates, centres, roll-number slips, and result notices from official boards or testing bodies.",
        ],
    },
    "IT & Technology": {
        "focus": "digital skills, certifications, AI literacy, freelancing readiness, and practical projects",
        "actions": [
            "Choose one job-relevant skill track and build a small portfolio project within two weeks.",
            "Compare certifications by employer value, course depth, project work, and local affordability.",
            "Practise explaining technical work in simple English because interviews and freelancing both require it.",
        ],
    },
    "Programming": {
        "focus": "coding fundamentals, software projects, debugging habits, computer science concepts, and portfolio building",
        "actions": [
            "Pick one language and complete small projects before jumping between frameworks.",
            "Keep a debugging journal that records the error, cause, fix, and lesson learned.",
            "Publish a simple portfolio project or GitHub repository to show real problem-solving ability.",
        ],
    },
    "Qur'an & Tajweed": {
        "focus": "tajweed rules, hifz planning, qari qualifications, online Quran classes, recitation practice, and family routines",
        "actions": [
            "Choose a qualified qari or qaria who can correct makharij, tajweed rules, fluency, and revision habits.",
            "Set a realistic hifz or nazra routine with daily recitation, weekly revision, and parent listening time.",
            "Evaluate online Quran platforms by teacher screening, trial class quality, class timing, and progress reports.",
        ],
    },
    "English Language": {
        "focus": "spoken English, grammar, vocabulary, writing confidence, pronunciation, and practical communication",
        "actions": [
            "Balance grammar study with daily speaking practice so confidence grows with accuracy.",
            "Keep a vocabulary notebook with example sentences instead of isolated word lists.",
            "Ask the tutor to correct pronunciation, sentence structure, and writing in the same weekly cycle.",
        ],
    },
    "IELTS": {
        "focus": "band-score targets, writing task 2, speaking practice, listening and reading strategy, and test timelines",
        "actions": [
            "Take a diagnostic test and set separate band targets for listening, reading, writing, and speaking.",
            "Practise IELTS Writing Task 2 with feedback on task response, coherence, vocabulary, and grammar.",
            "Choose a test date only after mock results are close to the required band score.",
        ],
    },
    "Graphics & Multimedia": {
        "focus": "design fundamentals, creative software, portfolio work, branding, video, animation, and freelancing readiness",
        "actions": [
            "Learn design principles alongside software tools so the portfolio looks intentional, not template-based.",
            "Create three portfolio pieces: one social campaign, one brand layout, and one motion or multimedia sample.",
            "Collect feedback on readability, spacing, colour, and client goals before publishing work online.",
        ],
    },
}

CATEGORY_OUTCOMES = {
    "K-12": "a corrected worksheet, a clearer concept explanation, or a stronger quiz result",
    "O & A Level": "a marked past-paper answer, a completed syllabus checklist, or a better timed response",
    "Bachelors / Masters": "a stronger assignment draft, a clearer research outline, or a completed admissions task",
    "Competitive Exams": "a timed practice score, a corrected weak topic, or a verified exam deadline",
    "IT & Technology": "a working project, a completed certification module, or a clearer technical explanation",
    "Programming": "a running program, a fixed bug, or a small project pushed to a portfolio",
    "Qur'an & Tajweed": "a corrected recitation, stronger makharij, or a consistent hifz revision record",
    "English Language": "a clearer spoken response, a corrected paragraph, or a stronger vocabulary routine",
    "IELTS": "a marked Task 2 essay, a recorded speaking answer, or a timed listening and reading score",
    "Graphics & Multimedia": "a cleaner layout, a stronger portfolio piece, or a revised design based on feedback",
}

CATEGORY_KEYWORDS = {
    "K-12": ["k-12", "school", "primary", "secondary", "children", "curriculum", "assessment", "classroom", "teacher"],
    "O & A Level": ["cambridge", "o level", "a level", "igcse", "exam", "syllabus", "cie", "pearson", "edexcel"],
    "Bachelors / Masters": ["university", "college", "bachelor", "master", "graduate", "degree", "admission", "higher education"],
    "Competitive Exams": ["exam", "test", "assessment", "admission", "competitive", "standardized", "board", "result", "entry test"],
    "IT & Technology": ["technology", "digital", "ai", "computer", "cyber", "data", "cloud", "edtech", "skills"],
    "Programming": ["programming", "coding", "software", "developer", "computer science", "python", "javascript", "code"],
    "Qur'an & Tajweed": ["quran", "qur'an", "tajweed", "hifz", "hafiz", "recitation", "qari", "islamic education", "memorization", "memorisation", "online quran"],
    "English Language": ["english", "language", "grammar", "spoken", "writing", "vocabulary", "pronunciation", "communication"],
    "IELTS": ["ielts", "english proficiency", "study abroad", "band score", "speaking test", "writing task", "idp", "british council"],
    "Graphics & Multimedia": ["graphic", "design", "multimedia", "creative", "animation", "video", "photoshop", "illustrator", "portfolio"],
}

GLOBAL_BLOCKLIST_TERMS = [
    "taliban",
    "terror",
    "terrorism",
    "suspect",
    "attack",
    "extremist",
    "militant",
    "war crime",
    "shooting",
    "bomb",
]

AGGREGATOR_SNIPPETS = [
    "comprehensive, up-to-date news coverage",
    "coverage, aggregated from sources all over the world",
    "google news",
]

MAX_SOURCE_AGE_DAYS = 180


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9\s-]", "", value).strip().lower()
    value = re.sub(r"[\s-]+", "-", value)
    return value[:80].strip("-") or "education-update"


def clean_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = html.unescape(value)
    replacements = {
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
        "â€“": "-",
        "â€”": "-",
        "â€˜": "'",
    }
    for bad, good in replacements.items():
        value = value.replace(bad, good)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def trim_text(value: str, limit: int = 155) -> str:
    if len(value) <= limit:
        return value
    trimmed = value[:limit].rsplit(" ", 1)[0].rstrip(" ,.;:")
    return f"{trimmed}."


def split_sentences(value: str) -> list[str]:
    cleaned = clean_text(value)
    if not cleaned:
        return []
    sentences = re.split(r"(?<=[.!?])\s+", cleaned)
    return [sentence.strip() for sentence in sentences if len(sentence.split()) >= 6]


def strip_source_from_title(title: str, source: str) -> str:
    cleaned = clean_text(title).rstrip(".")
    if source:
        cleaned = re.sub(rf"\s+-\s+{re.escape(source)}$", "", cleaned, flags=re.I)
    return cleaned


def category_focus(category_label: str | None) -> str:
    if not category_label:
        return "learning plans, tutor support, exam preparation, and student progress"
    return CATEGORY_GUIDANCE.get(category_label, {}).get(
        "focus",
        "learning plans, tutor support, exam preparation, and student progress",
    )


def category_actions(category_label: str | None) -> list[str]:
    if not category_label:
        return [
            "Check the official source behind the update before changing a study plan.",
            "Turn the news into one weekly academic target instead of reacting with stress.",
            "Ask a tutor to diagnose weak areas before adding more lessons.",
        ]
    return CATEGORY_GUIDANCE.get(category_label, {}).get("actions", [])


def category_outcome(category_label: str | None) -> str:
    return CATEGORY_OUTCOMES.get(
        category_label or "",
        "a visible learning result, a corrected mistake, or a verified next step",
    )


def parse_feed_date(value: str) -> dt.datetime | None:
    if not value:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed.astimezone(dt.timezone.utc)


def is_recent_source(item: dict, max_age_days: int = MAX_SOURCE_AGE_DAYS) -> bool:
    published = parse_feed_date(item.get("publishedAt", ""))
    if published is None:
        return True
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=max_age_days)
    return published >= cutoff


def fetch_url(url: str, timeout: int = 20) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "APlusAcademyBlogBot/1.0 (+https://www.aplusacademy.pk)",
            "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def decode_html(raw: bytes) -> str:
    for encoding in ("utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def extract_meta(html_text: str, key: str) -> str:
    patterns = [
        rf'<meta[^>]+property=["\']{re.escape(key)}["\'][^>]+content=["\']([^"\']+)["\']',
        rf'<meta[^>]+name=["\']{re.escape(key)}["\'][^>]+content=["\']([^"\']+)["\']',
        rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{re.escape(key)}["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, html_text, flags=re.I)
        if match:
            return clean_text(match.group(1))
    return ""


def extract_article_context(item: dict) -> str:
    try:
        raw = fetch_url(item["url"], timeout=12)
    except Exception:
        return item.get("summary", "")

    html_text = decode_html(raw)
    parts = [
        extract_meta(html_text, "description"),
        extract_meta(html_text, "og:description"),
    ]
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", html_text, flags=re.I | re.S)
    for paragraph in paragraphs[:8]:
        cleaned = clean_text(paragraph)
        if len(cleaned.split()) >= 12:
            parts.append(cleaned)

    context = " ".join(part for part in parts if part)
    context = trim_text(context, 900)
    if any(snippet in context.lower() for snippet in AGGREGATOR_SNIPPETS):
        return item.get("summary", "")
    return context or item.get("summary", "")


def google_news_rss(query: str) -> str:
    if "when:" not in query:
        query = f"{query} when:{MAX_SOURCE_AGE_DAYS}d"
    encoded = urllib.parse.quote(query)
    return f"https://news.google.com/rss/search?q={encoded}&hl=en-US&gl=US&ceid=US:en"


def parse_feed(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return []

    items = []
    for item in channel.findall("item"):
        title = clean_text(item.findtext("title"))
        link = clean_text(item.findtext("link"))
        description = clean_text(item.findtext("description"))
        published = clean_text(item.findtext("pubDate"))
        source_el = item.find("source")
        source = clean_text(source_el.text if source_el is not None else "")
        source_url = source_el.attrib.get("url", "") if source_el is not None else ""

        if not title or not link:
            continue

        items.append(
            {
                "title": title,
                "url": link,
                "sourceHomepage": source_url,
                "feedUrl": link,
                "summary": description,
                "publishedAt": published,
                "source": source or urllib.parse.urlparse(source_url or link).netloc,
            }
        )
    return items


def relevance_score(item: dict, category: dict | None) -> int:
    if not category:
        return 1

    if not is_recent_source(item):
        return -90

    category_label = category["label"]
    text = " ".join(
        [
            item.get("title", ""),
            item.get("summary", ""),
            item.get("source", ""),
        ]
    ).lower()

    if any(term in text for term in GLOBAL_BLOCKLIST_TERMS):
        return -100

    keywords = CATEGORY_KEYWORDS.get(category_label, [])
    score = 0
    for keyword in keywords:
        if keyword in text:
            score += 3 if " " in keyword else 2

    if "education" in text or "learning" in text or "students" in text:
        score += 1
    if category_label == "Qur'an & Tajweed" and "madrasa" in text and score < 3:
        score -= 4
    if item.get("source", "").lower() in {"google news"}:
        score -= 1
    return score


def select_relevant_items(items: list[dict], category: dict | None, max_items: int) -> list[dict]:
    if not category:
        return items[:max_items]

    scored = sorted(
        ((relevance_score(item, category), index, item) for index, item in enumerate(items)),
        key=lambda row: (row[0], -row[1]),
        reverse=True,
    )
    minimum_score = 2
    filtered = [item for score, _, item in scored if score >= minimum_score]
    if len(filtered) < 3:
        filtered = [item for score, _, item in scored if score > -50 and is_recent_source(item)]
    if len(filtered) < 3:
        filtered = [item for score, _, item in scored if score > -50]

    distinct_sources = []
    selected = []
    for item in filtered:
        source_key = item["source"].lower()
        if source_key not in distinct_sources:
            distinct_sources.append(source_key)
            selected.append(item)
        if len(selected) >= max_items:
            return selected

    return (selected + filtered)[:max_items]


def gather_news(topic: str | None, max_items: int, category: dict | None = None) -> list[dict]:
    if topic:
        queries = [topic]
    elif category:
        queries = category["queries"]
    else:
        queries = NEWS_QUERIES
    seen = set()
    items: list[dict] = []

    for query in queries:
        try:
            feed_items = parse_feed(fetch_url(google_news_rss(query)))
        except Exception as exc:
            print(f"Warning: could not fetch news for {query!r}: {exc}", file=sys.stderr)
            continue

        for item in feed_items:
            key = (item["title"].lower(), item["source"].lower())
            if key in seen:
                continue
            seen.add(key)
            items.append(item)
        time.sleep(1)

    return select_relevant_items(items, category, max_items)


def choose_topic(items: list[dict], forced_topic: str | None, category_label: str | None = None) -> str:
    if forced_topic:
        return forced_topic.strip()

    if category_label:
        haystack = " ".join(item["title"] for item in items[:8]).lower()
        if any(word in haystack for word in ("ai", "artificial intelligence", "digital", "technology")):
            return f"{category_label} And Digital Learning"
        if any(word in haystack for word in ("exam", "assessment", "test", "admission")):
            return f"{category_label} Exam And Assessment Trends"
        if any(word in haystack for word in ("skills", "career", "jobs", "employment")):
            return f"{category_label} Skills And Career Readiness"
        if any(word in haystack for word in ("online", "remote", "hybrid")):
            return f"{category_label} Online Learning Trends"
        return f"{category_label} Global Education Trends"

    haystack = " ".join(item["title"] for item in items[:10]).lower()
    topic_rules = [
        (["exam", "exams", "matric", "ssc", "board", "assessment"], "Board Exams And School Assessment"),
        (["ai", "artificial intelligence", "technology", "digital", "online"], "AI And Digital Learning"),
        (["ielts", "study abroad", "visa", "international"], "IELTS And Study Abroad Preparation"),
        (["university", "higher education", "college", "admission"], "Higher Education And Admissions"),
        (["teacher", "teachers", "curriculum", "classroom"], "Teaching And Classroom Learning"),
    ]
    for keywords, label in topic_rules:
        if any(keyword in haystack for keyword in keywords):
            return label

    words: list[str] = []
    for item in items[:10]:
        words.extend(re.findall(r"[a-zA-Z]{4,}", item["title"].lower()))

    common = [word for word, _ in Counter(words).most_common(8) if word not in STOPWORDS]
    if "education" not in common:
        common.insert(0, "education")

    phrase = " ".join(common[:4]).title()
    return phrase or "Pakistan Education Update"


def choose_images(topic: str, items: list[dict], slug: str, image_mode: str) -> list[dict]:
    if image_mode in {"auto", "ai"} and os.environ.get("OPENAI_API_KEY"):
        try:
            return generate_ai_images(topic, items, slug)
        except Exception as exc:
            if image_mode == "ai":
                raise
            print(f"Warning: AI image generation failed, using Pexels fallback: {exc}", file=sys.stderr)

    haystack = " ".join([topic] + [item["title"] for item in items]).lower()
    ranked = []
    for image in IMAGE_POOL:
        score = sum(1 for keyword in image["keywords"] if keyword in haystack)
        ranked.append((score, image))
    ranked.sort(key=lambda item: item[0], reverse=True)

    images = []
    for index, (_, image) in enumerate(ranked[:4]):
        images.append(
            {
                **image,
                "kind": "pexels",
                "placement": ARTICLE_IMAGE_SLOTS[index],
            }
        )
    return images


def generate_ai_images(topic: str, items: list[dict], slug: str) -> list[dict]:
    BLOG_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    api_key = os.environ["OPENAI_API_KEY"]
    model = os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1-mini")
    titles = "; ".join(item["title"] for item in items[:3])
    images = []

    for index, slot in enumerate(ARTICLE_IMAGE_SLOTS):
        prompt = (
            "Create a realistic editorial image for A Plus Academy Pakistan. "
            f"Topic: {topic}. Article context: {titles}. "
            f"Image role: {slot}. Show Pakistani students, parents, tutors, desks, notebooks, "
            "classrooms, laptops, or exam preparation as relevant. No logos, no readable text, "
            "no political symbols, natural lighting, professional education blog style."
        )
        payload = {
            "model": model,
            "prompt": prompt,
            "size": "1536x1024",
            "quality": "low",
            "n": 1,
        }
        request = urllib.request.Request(
            "https://api.openai.com/v1/images/generations",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=90) as response:
            data = json.loads(response.read().decode("utf-8"))

        image_data = data["data"][0]
        if image_data.get("b64_json"):
            raw = base64.b64decode(image_data["b64_json"])
        elif image_data.get("url"):
            raw = fetch_url(image_data["url"], timeout=60)
        else:
            raise RuntimeError("OpenAI image response did not include image data.")

        filename = f"{slug}-{index + 1}.png"
        output = BLOG_IMAGE_DIR / filename
        output.write_bytes(raw)
        images.append(
            {
                "kind": "ai",
                "placement": slot,
                "url": f"/blogs/images/{filename}",
                "sourceUrl": "https://platform.openai.com/docs/guides/image-generation",
                "credit": f"AI-generated image by A Plus Academy using {model}",
                "alt": f"{topic} education blog illustration for {slot}",
                "prompt": prompt,
            }
        )

    return images


def summarize_source(item: dict, category_label: str | None) -> str:
    source = item["source"] or "the referenced source"
    title = strip_source_from_title(item["title"], source)
    context = clean_text(item.get("articleContext") or item.get("summary") or "")
    title_key = re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()
    title_tokens = set(title_key.split())
    sentences = []
    for sentence in split_sentences(context):
        sentence_key = re.sub(r"[^a-z0-9]+", " ", sentence.lower()).strip()
        sentence_tokens = set(sentence_key.split())
        token_overlap = len(title_tokens & sentence_tokens) / max(1, len(sentence_tokens))
        if title_key and (sentence_key == title_key or title_key in sentence_key):
            continue
        if token_overlap >= 0.75:
            continue
        if source and sentence.lower().strip() == source.lower().strip():
            continue
        sentences.append(sentence)
    if sentences:
        detail = " ".join(sentences[:2])
        return (
            f"{source} reports that {title[0].lower() + title[1:] if title else 'this update matters'}. "
            f"{detail}"
        )

    focus = category_focus(category_label)
    return (
        f"{source} reports on \"{title}.\" The public feed gives limited article text, so the useful signal "
        f"for readers is the connection to {focus}."
    )


def source_analysis(item: dict, topic: str, index: int, category_label: str | None) -> dict:
    source = item["source"] or f"Source {index}"
    title = strip_source_from_title(item["title"], source)
    summary = summarize_source(item, category_label)
    focus = category_focus(category_label)
    body = (
        f"{summary}\n\n"
        f"Why it matters: for A Plus Academy readers, this source should be read through the lens of {focus}. "
        "It is useful because it points to a real study decision: what to verify, what skill to practise next, "
        "and whether the learner needs clearer guidance before deadlines arrive."
    )

    return {
        "source": source,
        "title": title,
        "url": item["url"],
        "publishedAt": item.get("publishedAt", ""),
        "heading": f"Source {index}: {source}",
        "summary": body,
    }


def shared_guidance_section(topic: str, category_label: str | None) -> dict:
    focus = category_focus(category_label)
    return {
        "heading": "What this means for students, parents, and tutors",
        "body": (
            f"The shared message across these sources is that {topic.lower()} should be turned into a practical "
            f"learning plan, not treated as background noise. For this category, the important areas are {focus}. "
            "Students should identify the next skill or chapter that needs attention. Parents should ask whether "
            "the current routine is producing visible progress. Tutors should connect each lesson to a measurable "
            f"outcome: {category_outcome(category_label)}.\n\n"
            "For Pakistani families, the safest habit is to verify official dates and requirements, then act early. "
            "A short diagnostic session, a weekly written task, or a structured revision plan can prevent confusion "
            "from becoming exam pressure. A Plus Academy can support that work through subject tutors, online classes, "
            "exam preparation, language coaching, Quran learning, programming support, and skill-based mentoring."
        ),
    }


def action_steps_section(category_label: str | None) -> dict:
    actions = category_actions(category_label)
    body = "\n".join(f"{index + 1}. {action}" for index, action in enumerate(actions))
    return {
        "heading": f"Three action steps for {category_label or 'education'} learners in Pakistan",
        "body": body,
    }


def build_takeaways(selected_items: list[dict], category_label: str | None) -> list[str]:
    takeaways = []
    for item in selected_items[:3]:
        title = strip_source_from_title(item["title"], item.get("source", ""))
        takeaways.append(trim_text(title, 120))
    if len(takeaways) < 3:
        takeaways.append(f"Focus today's response on {category_focus(category_label)}.")
    return takeaways[:3]


def build_post(
    items: list[dict],
    topic: str | None,
    image_mode: str,
    category: dict | None = None,
    replace_slug: str | None = None,
    preserve_published_at: str | None = None,
) -> dict:
    if len(items) < 3:
        raise RuntimeError("At least three news sources are needed to create a referenced blog post.")

    now = dt.datetime.now(dt.timezone.utc)
    display_date = now.strftime("%B %d, %Y")
    category_label = category["label"] if category else None
    chosen_topic = choose_topic(items, topic, category_label)
    slug = replace_slug or f"{now.strftime('%Y-%m-%d')}-{slugify(chosen_topic)}"
    images = choose_images(chosen_topic, items, slug, image_mode)
    hero_image = images[0]

    title = f"{chosen_topic}: What Students and Parents Should Watch"
    description = (
        f"A Plus Academy reviews current {category_label or 'education'} updates with source-specific "
        "analysis and practical next steps for learners in Pakistan."
    )

    selected_items = items[:3]
    for item in selected_items:
        item["articleContext"] = extract_article_context(item)

    source_analyses = [
        source_analysis(item, chosen_topic, index + 1, category_label)
        for index, item in enumerate(selected_items)
    ]

    source_observation = summarize_source(selected_items[0], category_label)

    sections = [
        {
            "heading": "Overview",
            "body": (
                f"Today's education signals around {chosen_topic.lower()} start with a specific pattern: "
                f"{source_observation} When this is read alongside the other sources below, the useful question "
                "is not only what happened, but what a learner should do next.\n\n"
                f"This A Plus Academy article keeps the references visible, but the main value is original guidance "
                f"for Pakistani students, parents, and tutors. The focus is {category_focus(category_label)}. "
                "The goal is to help readers compare the sources, avoid irrelevant noise, and turn the news into "
                "a practical study decision."
            ),
        },
        shared_guidance_section(chosen_topic, category_label),
        action_steps_section(category_label),
    ]

    references = [
        {
            "title": item["title"],
            "source": item["source"],
            "url": item["url"],
            "publishedAt": item["publishedAt"],
        }
        for item in items[:8]
    ]

    word_count = (
        sum(len(section["body"].split()) for section in sections)
        + sum(len(analysis["summary"].split()) for analysis in source_analyses)
        + len(description.split())
    )
    read_minutes = max(3, round(word_count / 220))

    return {
        "slug": slug,
        "title": title,
        "seoTitle": f"{title} | A Plus Academy Blog",
        "description": description,
        "topic": chosen_topic,
        "category": category_label or "Education",
        "publishedAt": preserve_published_at or now.isoformat(),
        "updatedAt": now.isoformat(),
        "readTime": f"{read_minutes} min read",
        "wordCount": word_count,
        "heroImage": hero_image,
        "images": images,
        "takeaways": build_takeaways(selected_items, category_label),
        "sections": sections,
        "sourceAnalyses": source_analyses,
        "references": references,
        "tags": sorted({word.lower() for word in re.findall(r"[a-zA-Z]{4,}", chosen_topic)})[:8],
        "generatedBy": "scripts/create_blog.py",
        "generationNote": (
            "Created from public RSS/news summaries, limited page context where accessible, relevance filtering, "
            "and original A Plus Academy analysis. References are included for attribution and reader verification."
        ),
    }


def load_index() -> list[dict]:
    if not BLOG_INDEX.exists():
        return []
    try:
        data = json.loads(BLOG_INDEX.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def parse_published_at(value: str) -> dt.datetime | None:
    if not value:
        return None
    try:
        return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def find_recent_duplicate(topic: str, days: int) -> dict | None:
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)
    topic_key = slugify(topic)
    for post in load_index():
        published_at = parse_published_at(post.get("publishedAt", ""))
        if published_at is None or published_at < cutoff:
            continue

        existing_topic = post.get("topic") or post.get("title", "")
        if slugify(existing_topic) == topic_key:
            return post
    return None


def load_post(slug: str) -> dict | None:
    post_path = BLOG_DIR / f"{slug}.json"
    if not post_path.exists():
        return None
    try:
        data = json.loads(post_path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        return None


def normalize_category(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def category_last_published(category_label: str) -> dt.datetime | None:
    normalized = normalize_category(category_label)
    dates = []
    for post in load_index():
        post_category = post.get("category") or post.get("topic") or ""
        if normalize_category(post_category).startswith(normalized):
            published_at = parse_published_at(post.get("publishedAt", ""))
            if published_at:
                dates.append(published_at)
    return max(dates) if dates else None


def resolve_category(category_name: str | None) -> dict | None:
    if not category_name:
        return None
    requested = normalize_category(category_name)
    for category in BLOG_CATEGORIES:
        if normalize_category(category["label"]) == requested:
            return category
    labels = ", ".join(category["label"] for category in BLOG_CATEGORIES)
    raise ValueError(f"Unknown category {category_name!r}. Choose one of: {labels}")


def choose_daily_category(duplicate_window_days: int) -> dict:
    now = dt.datetime.now(dt.timezone.utc)
    offset = now.toordinal() % len(BLOG_CATEGORIES)
    ordered = BLOG_CATEGORIES[offset:] + BLOG_CATEGORIES[:offset]
    cutoff = now - dt.timedelta(days=duplicate_window_days)

    for category in ordered:
        last_published = category_last_published(category["label"])
        if last_published is None or last_published < cutoff:
            return category

    return min(
        BLOG_CATEGORIES,
        key=lambda category: category_last_published(category["label"]) or dt.datetime.min.replace(tzinfo=dt.timezone.utc),
    )


def write_post(post: dict, replace_slug: str | None = None) -> Path:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    post_path = BLOG_DIR / f"{post['slug']}.json"

    if replace_slug:
        post["slug"] = replace_slug
        post_path = BLOG_DIR / f"{replace_slug}.json"
    else:
        suffix = 2
        while post_path.exists():
            post["slug"] = re.sub(r"-\d+$", "", post["slug"]) + f"-{suffix}"
            post_path = BLOG_DIR / f"{post['slug']}.json"
            suffix += 1

    post_path.write_text(json.dumps(post, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    index = [item for item in load_index() if item.get("slug") != post["slug"]]
    index.insert(
        0,
        {
            "slug": post["slug"],
            "title": post["title"],
            "description": post["description"],
            "topic": post["topic"],
            "category": post.get("category", "Education"),
            "publishedAt": post["publishedAt"],
            "readTime": post["readTime"],
            "heroImage": post["heroImage"],
        },
    )
    index = sorted(index, key=lambda item: item.get("publishedAt", ""), reverse=True)[:60]
    BLOG_INDEX.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    update_sitemap(post["slug"])
    return post_path


def update_sitemap(slug: str) -> None:
    if not SITEMAP.exists():
        return

    ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    existing = {loc.text for loc in root.findall("sm:url/sm:loc", namespace)}
    today = dt.datetime.now(dt.timezone.utc).date().isoformat()

    def add_url(loc: str, priority: str) -> None:
        if loc in existing:
            return
        url = ET.SubElement(root, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text = loc
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod").text = today
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}priority").text = priority

    add_url(f"{SITE_URL}/blog", "0.8")
    add_url(f"{SITE_URL}/blog/{slug}", "0.7")
    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)


def run_git(args: list[str]) -> None:
    subprocess.run(args, cwd=ROOT, check=True)


def publish(post: dict, post_path: Path) -> None:
    paths = [
        str(post_path.relative_to(ROOT)),
        str(BLOG_INDEX.relative_to(ROOT)),
        str(SITEMAP.relative_to(ROOT)),
    ]
    for image in post.get("images", []):
        url = image.get("url", "")
        if url.startswith("/blogs/images/"):
            image_path = ROOT / "frontend" / "public" / url.lstrip("/")
            if image_path.exists():
                paths.append(str(image_path.relative_to(ROOT)))
    run_git(["git", "add", *paths])
    run_git(["git", "commit", "-m", f"Publish blog: {post['title'][:50]}"])
    run_git(["git", "push", "origin", "main"])


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate an original referenced A Plus Academy education blog post."
    )
    parser.add_argument(
        "--category",
        help="Pick one category from the approved list. If omitted, the script rotates daily.",
    )
    parser.add_argument("--topic", help="Force a topic instead of selecting one from trending news.")
    parser.add_argument("--max-sources", type=int, default=6, help="Number of source items to cite.")
    parser.add_argument(
        "--image-mode",
        choices=["auto", "ai", "pexels"],
        default=os.environ.get("BLOG_IMAGE_MODE", "auto"),
        help="Use AI images when OPENAI_API_KEY is available, require AI, or use Pexels fallback.",
    )
    parser.add_argument(
        "--duplicate-window-days",
        type=int,
        default=int(os.environ.get("BLOG_DUPLICATE_WINDOW_DAYS", "9")),
        help="Prefer categories not used within this many days. Daily publishing still continues.",
    )
    parser.add_argument(
        "--allow-duplicate",
        action="store_true",
        help="Force publishing even if the same topic was recently published.",
    )
    parser.add_argument(
        "--replace-slug",
        help="Overwrite an existing blog JSON while keeping its URL. Useful for quality revisions.",
    )
    parser.add_argument("--publish", action="store_true", help="Commit and push the generated post.")
    parser.add_argument("--dry-run", action="store_true", help="Print the post without writing files.")
    args = parser.parse_args()

    existing_post = load_post(args.replace_slug) if args.replace_slug else None
    if args.replace_slug and existing_post is None:
        raise RuntimeError(f"Cannot replace missing blog post: {args.replace_slug}")

    requested_category = resolve_category(args.category)
    if existing_post and not requested_category:
        requested_category = resolve_category(existing_post.get("category"))
    category = requested_category or choose_daily_category(args.duplicate_window_days)

    attempts = [category]
    if not requested_category:
        attempts.extend(candidate for candidate in BLOG_CATEGORIES if candidate is not category)

    post = None
    for candidate in attempts:
        items = gather_news(args.topic, max(3, args.max_sources), candidate)
        selected_topic = choose_topic(items, args.topic, candidate["label"])
        duplicate = find_recent_duplicate(selected_topic, args.duplicate_window_days)
        if duplicate and not args.allow_duplicate and not requested_category:
            print(
                "Trying another category because "
                f"'{selected_topic}' was recently published at {SITE_URL}/blog/{duplicate['slug']}"
            )
            continue
        post = build_post(
            items,
            selected_topic,
            args.image_mode,
            candidate,
            replace_slug=args.replace_slug,
            preserve_published_at=existing_post.get("publishedAt") if existing_post else None,
        )
        break

    if post is None:
        fallback_category = choose_daily_category(0)
        items = gather_news(args.topic, max(3, args.max_sources), fallback_category)
        selected_topic = choose_topic(items, args.topic, fallback_category["label"])
        post = build_post(
            items,
            selected_topic,
            args.image_mode,
            fallback_category,
            replace_slug=args.replace_slug,
            preserve_published_at=existing_post.get("publishedAt") if existing_post else None,
        )

    if args.dry_run:
        sys.stdout.buffer.write((json.dumps(post, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
        return 0

    post_path = write_post(post, args.replace_slug)
    print(f"Created blog post: {post_path.relative_to(ROOT)}")
    print(f"URL after deployment: {SITE_URL}/blog/{post['slug']}")
    print("\nImportant: this is an original synthesis, not copied article text.")
    print(textwrap.fill("Sources and image credit were written into the post references.", width=80))

    if args.publish:
        publish(post, post_path)
        print("Committed and pushed. Vercel will deploy from GitHub.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
