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

ARTICLE_IMAGE_SLOTS = [
    "hero",
    "student impact",
    "parent action plan",
    "tutor guidance",
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
    return trim_text(context, 900) or item.get("summary", "")


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


def sentence_from_item(item: dict) -> str:
    title = item["title"].rstrip(".")
    source = item["source"] or "a referenced source"
    return f"{source} reports: {title}."


def source_analysis(item: dict, topic: str, index: int) -> dict:
    source = item["source"] or f"Source {index}"
    title = item["title"].rstrip(".")
    context = clean_text(item.get("articleContext") or item.get("summary") or "")
    if not context:
        context = (
            "The public feed summary is limited, so this section focuses on the headline, "
            "publisher signal, and practical implications for students and families."
        )

    body = (
        f"{source} highlights the issue through the update titled \"{title}.\" "
        f"The available reporting points to a wider education concern connected with {topic.lower()}. "
        f"In practical terms, this is not just a news item for institutions; it can shape how students, "
        "parents, tutors, and school leaders prepare for the next academic checkpoint.\n\n"
        f"The source context says: {context} This information should be read as a signal rather than a "
        "complete policy brief. Families should confirm dates, exam-board notices, university instructions, "
        "and school circulars from official channels before making final decisions. Still, the update is useful "
        "because it shows where pressure is building: assessment reliability, class continuity, learning gaps, "
        "admissions planning, technology access, or the need for stronger academic support.\n\n"
        "For students, the main lesson is to avoid waiting for perfect clarity. A learner who keeps notes updated, "
        "tracks weak chapters, practises past-paper style questions, and asks for help early is less affected by "
        "sudden changes. If the update relates to exams, students should review the syllabus, marking pattern, "
        "and deadline calendar. If it relates to universities or study abroad, they should keep documents, English "
        "practice, and subject foundations ready. If it relates to online or digital learning, they should make sure "
        "their basic study setup and digital skills are not holding them back.\n\n"
        "For parents, the update is a reminder to convert news into a home learning routine. That means checking "
        "where the child is confident, where they are guessing, and where they need guided practice. A short weekly "
        "plan can work better than a last-minute rush: one concept-building session, one written practice session, "
        "one revision session, and one review conversation. Parents should also keep communication open with the "
        "school or tutor so that academic decisions are based on current information.\n\n"
        "For tutors, this source suggests a need for lessons that are connected to real academic conditions. Tutors "
        "should not only explain chapters; they should help students interpret exam expectations, organise revision, "
        "improve writing, and practise under time limits. In Pakistan, where students may be preparing for board "
        "exams, Cambridge exams, university admissions, IELTS, or skills-based courses at the same time, this kind "
        "of structured guidance can make the difference between scattered effort and measurable progress.\n\n"
        "The practical takeaway is simple: every education headline should lead to one concrete action. That action "
        "might be checking an official notice, booking a diagnostic session, revising one weak chapter, improving "
        "English writing, practising one past paper, or discussing a realistic timetable with a tutor. When families "
        "respond in small planned steps, news becomes useful information instead of stress.\n\n"
        "For SEO and reader clarity, this section deliberately connects the source update with common search needs in "
        "Pakistan: home tutors, online tutors, board exam preparation, O and A Level support, IELTS readiness, and "
        "subject-specific revision. That makes the article useful for readers while still giving credit to the original "
        "publisher for the reported news."
    )

    return {
        "source": source,
        "title": title,
        "url": item["url"],
        "publishedAt": item.get("publishedAt", ""),
        "heading": f"Source {index}: {source}",
        "summary": body,
    }


def general_section(topic: str) -> dict:
    return {
        "heading": "What families should do next",
        "body": (
            f"The safest response to {topic.lower()} news is a practical learning plan. Students should list "
            "their next tests, weak chapters, missing notes, and deadlines. Parents should decide whether the "
            "student needs home tuition, online support, a short revision plan, or a subject specialist. Tutors "
            "should begin with diagnosis before teaching: a short quiz, a writing sample, a past-paper question, "
            "or a conversation about the learner's routine can reveal where time is being wasted.\n\n"
            "A Plus Academy recommends a simple weekly rhythm for most students in Pakistan: understand the concept, "
            "practise it in writing, test it under time pressure, and review mistakes before moving on. This works "
            "for K-12, O Level, A Level, matric, intermediate, IELTS, university courses, Quran learning, programming, "
            "and skill-based subjects. News changes quickly, but strong learning habits remain useful in every season."
        ),
    }


def build_post(items: list[dict], topic: str | None, image_mode: str) -> dict:
    if len(items) < 3:
        raise RuntimeError("At least three news sources are needed to create a referenced blog post.")

    now = dt.datetime.now(dt.timezone.utc)
    display_date = now.strftime("%B %d, %Y")
    chosen_topic = choose_topic(items, topic)
    slug = f"{now.strftime('%Y-%m-%d')}-{slugify(chosen_topic)}"
    images = choose_images(chosen_topic, items, slug, image_mode)
    hero_image = images[0]

    title = f"{chosen_topic}: What Students and Parents Should Watch"
    description = (
        "A Plus Academy reviews current education updates and explains what they "
        "may mean for students, parents, and tutors in Pakistan."
    )

    selected_items = items[:3]
    for item in selected_items:
        item["articleContext"] = extract_article_context(item)

    source_analyses = [
        source_analysis(item, chosen_topic, index + 1)
        for index, item in enumerate(selected_items)
    ]

    sections = [
        {
            "heading": "Overview",
            "body": (
                f"Education updates around {chosen_topic.lower()} matter because they influence how Pakistani "
                "families plan exams, admissions, online learning, tutoring, and long-term academic confidence. "
                "This A Plus Academy article reviews three referenced news items, reorganises the public information "
                "into original guidance, and turns the headlines into a practical plan for students, parents, and tutors. "
                "The goal is not to replace the original reporting. The goal is to help readers understand what to watch, "
                "what to verify, and how to respond without panic."
            ),
        },
        general_section(chosen_topic),
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
        "publishedAt": now.isoformat(),
        "updatedAt": now.isoformat(),
        "readTime": f"{read_minutes} min read",
        "wordCount": word_count,
        "heroImage": hero_image,
        "images": images,
        "takeaways": [
            "This long-form article is an original synthesis of three referenced education updates.",
            "Each source is summarised and analysed separately so readers can compare the signals.",
            "Families should translate education news into weekly learning plans instead of waiting for exam pressure.",
        ],
        "sections": sections,
        "sourceAnalyses": source_analyses,
        "references": references,
        "tags": sorted({word.lower() for word in re.findall(r"[a-zA-Z]{4,}", chosen_topic)})[:8],
        "generatedBy": "scripts/create_blog.py",
        "generationNote": (
            "Created from public RSS/news summaries, limited page context where accessible, and original A Plus Academy "
            "analysis. References are included for attribution and reader verification."
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
        default=int(os.environ.get("BLOG_DUPLICATE_WINDOW_DAYS", "14")),
        help="Skip publishing if the same topic was published within this many days.",
    )
    parser.add_argument(
        "--allow-duplicate",
        action="store_true",
        help="Force publishing even if the same topic was recently published.",
    )
    parser.add_argument("--publish", action="store_true", help="Commit and push the generated post.")
    parser.add_argument("--dry-run", action="store_true", help="Print the post without writing files.")
    args = parser.parse_args()

    items = gather_news(args.topic, max(3, args.max_sources))
    selected_topic = choose_topic(items, args.topic)

    if not args.allow_duplicate:
        duplicate = find_recent_duplicate(selected_topic, args.duplicate_window_days)
        if duplicate:
            print(
                "Skipped blog creation: "
                f"'{selected_topic}' was already published recently at {SITE_URL}/blog/{duplicate['slug']}"
            )
            return 0

    post = build_post(items, selected_topic, args.image_mode)

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
