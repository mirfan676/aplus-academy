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
per article, updates the blog index, and adds the post URL to the sitemap. In
`auto` mode it generates AI images when `OPENAI_API_KEY` is available and falls
back to credited Pexels images otherwise. A GitHub Actions workflow also runs
this daily and pushes a new post when sources are available.
aplus academy developer notes
