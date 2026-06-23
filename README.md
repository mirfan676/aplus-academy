# aplus-academy

## Blog publishing

Create a referenced education-news blog post:

```bash
python scripts/create_blog.py
```

Create and publish it through GitHub/Vercel:

```bash
python scripts/create_blog.py --publish
```

Create a post around a specific topic:

```bash
python scripts/create_blog.py --topic "IELTS preparation in Pakistan"
```

Create a post for a specific approved category:

```bash
python scripts/create_blog.py --category IELTS
python scripts/create_blog.py --category "IT & Technology"
```

Use only credited Pexels fallback images:

```bash
python scripts/create_blog.py --image-mode pexels
```

Use AI-generated article images:

```bash
set OPENAI_API_KEY=your_key_here
python scripts/create_blog.py --image-mode ai
```

The script uses public RSS/news summaries, writes an original A Plus Academy
article of roughly 1500+ words, adds source references, creates multiple images
per article, updates the blog index, and adds the post URL to the sitemap. Daily
posts rotate through approved categories: K-12, O & A Level, Bachelors / Masters,
Competitive Exams, IT & Technology, Programming, Qur'an & Tajweed, English
Language, IELTS, and Graphics & Multimedia. In `auto` mode it generates AI
images when `OPENAI_API_KEY` is available and falls back to credited Pexels images
otherwise. A GitHub Actions workflow also runs this daily and pushes a new post
when sources are available.
aplus academy developer notes

## PTE AI scoring

The essay scorer uses the authenticated Vercel endpoint at `/api/pte-score`.
Shorter text-based PTE tasks use `/api/pte-task-score`. Set `OPENAI_API_KEY` as
a server-only Production and Preview environment variable in Vercel. `OPENAI_MODEL`
is optional and defaults to `gpt-5-mini`.

Set `PTE_AI_MONTHLY_FREE_LIMIT` to control the shared free AI scoring pool. For
example, `900` is roughly 30 scores each for 30 learners in a month. OpenAI API
calls are billed to the OpenAI API project that owns `OPENAI_API_KEY`; they do
not use ChatGPT Plus or Codex subscription credits.

When the AI service is unavailable, the browser uses the bundled adaptive scorer
and labels the result accordingly.
