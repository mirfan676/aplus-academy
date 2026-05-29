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
import datetime as dt
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
BLOG_INDEX = BLOG_DIR / "index.json"
SITEMAP = ROOT / "frontend" / "public" / "sitemap.xml"
SITE_URL = "https://www.aplusacademy.pk"

NEWS_QUERIES = [
    "Pakistan education students schools exams",
    "Pakistan higher education universities students",
    "online learning Pakistan education technology",
    "AI in education students teachers",
    "IELTS study abroad Pakistan students",
    "Cambridge O Level A Level Pakistan education",
]

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


def google_news_rss(query: str) -> str:
    encoded = urllib.parse.quote(query)
    return f"https://news.google.com/rss/search?q={encoded}&hl=en-PK&gl=PK&ceid=PK:en"


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


def gather_news(topic: str | None, max_items: int) -> list[dict]:
    queries = [topic] if topic else NEWS_QUERIES
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

    distinct_sources = []
    selected = []
    for item in items:
        source_key = item["source"].lower()
        if source_key not in distinct_sources:
            distinct_sources.append(source_key)
            selected.append(item)
        if len(selected) >= max_items:
            return selected

    return (selected + items)[:max_items]


def choose_topic(items: list[dict], forced_topic: str | None) -> str:
    if forced_topic:
        return forced_topic.strip()

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


def choose_image(topic: str, items: list[dict]) -> dict:
    haystack = " ".join([topic] + [item["title"] for item in items]).lower()
    best = IMAGE_POOL[0]
    best_score = -1
    for image in IMAGE_POOL:
        score = sum(1 for keyword in image["keywords"] if keyword in haystack)
        if score > best_score:
            best = image
            best_score = score
    return best


def sentence_from_item(item: dict) -> str:
    title = item["title"].rstrip(".")
    source = item["source"] or "a referenced source"
    return f"{source} reports: {title}."


def build_post(items: list[dict], topic: str | None) -> dict:
    if len(items) < 3:
        raise RuntimeError("At least three news sources are needed to create a referenced blog post.")

    now = dt.datetime.now(dt.timezone.utc)
    display_date = now.strftime("%B %d, %Y")
    chosen_topic = choose_topic(items, topic)
    image = choose_image(chosen_topic, items)
    slug = f"{now.strftime('%Y-%m-%d')}-{slugify(chosen_topic)}"

    title = f"{chosen_topic}: What Students and Parents Should Watch"
    description = (
        "A Plus Academy reviews current education updates and explains what they "
        "may mean for students, parents, and tutors in Pakistan."
    )

    evidence_lines = [sentence_from_item(item) for item in items[:6]]
    implications = [
        "Students should keep exam calendars, admission deadlines, and school notices under regular review.",
        "Parents can support learners by turning news into a weekly study plan rather than waiting until exams are close.",
        "Tutors should connect lessons with current syllabus, assessment, technology, and study-abroad changes when relevant.",
    ]

    sections = [
        {
            "heading": "What is trending",
            "body": "\n\n".join(evidence_lines[:3]),
        },
        {
            "heading": "Why it matters for learners in Pakistan",
            "body": (
                "Education news can affect how families plan tuition, exam preparation, admissions, digital learning, "
                "and skill development. The common signal across the latest sources is that students need flexible "
                "support, stronger fundamentals, and clearer guidance before pressure points arrive.\n\n"
                + "\n".join(f"- {line}" for line in implications)
            ),
        },
        {
            "heading": "How A Plus Academy recommends responding",
            "body": (
                "Use the update as a planning prompt. Review the learner's current class, weak subjects, upcoming tests, "
                "and preferred study mode. For school students, this may mean focused maths, science, English, or O/A Level "
                "support. For older learners, it may mean IELTS, programming, university subjects, or study-abroad readiness.\n\n"
                "A good next step is to create a short weekly routine: one concept session, one practice session, one review "
                "session, and one checkpoint with a parent or tutor."
            ),
        },
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

    word_count = sum(len(section["body"].split()) for section in sections) + len(description.split())
    read_minutes = max(3, round(word_count / 220))

    return {
        "slug": slug,
        "title": title,
        "seoTitle": f"{title} | A Plus Academy Blog",
        "description": description,
        "topic": chosen_topic,
        "publishedAt": now.isoformat(),
        "updatedAt": now.isoformat(),
        "readTime": f"{read_minutes} min read",
        "heroImage": image,
        "takeaways": [
            "This article is an original synthesis of multiple referenced education updates.",
            "Families should translate education news into practical weekly learning plans.",
            "Students benefit most when tutoring targets weak concepts before exam pressure rises.",
        ],
        "sections": sections,
        "references": references,
        "tags": sorted({word.lower() for word in re.findall(r"[a-zA-Z]{4,}", chosen_topic)})[:8],
        "generatedBy": "scripts/create_blog.py",
        "generationNote": (
            "Created from public RSS/news summaries and rewritten as original A Plus Academy guidance. "
            "References are included for attribution and reader verification."
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


def write_post(post: dict) -> Path:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    post_path = BLOG_DIR / f"{post['slug']}.json"

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
    run_git(["git", "add", str(post_path.relative_to(ROOT)), str(BLOG_INDEX.relative_to(ROOT)), str(SITEMAP.relative_to(ROOT))])
    run_git(["git", "commit", "-m", f"Publish blog: {post['title'][:50]}"])
    run_git(["git", "push", "origin", "main"])


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate an original referenced A Plus Academy education blog post."
    )
    parser.add_argument("--topic", help="Force a topic instead of selecting one from trending news.")
    parser.add_argument("--max-sources", type=int, default=6, help="Number of source items to cite.")
    parser.add_argument("--publish", action="store_true", help="Commit and push the generated post.")
    parser.add_argument("--dry-run", action="store_true", help="Print the post without writing files.")
    args = parser.parse_args()

    items = gather_news(args.topic, max(3, args.max_sources))
    post = build_post(items, args.topic)

    if args.dry_run:
        print(json.dumps(post, ensure_ascii=False, indent=2))
        return 0

    post_path = write_post(post)
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
