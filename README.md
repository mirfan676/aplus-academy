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

The script uses public RSS/news summaries, writes an original A Plus Academy
article, adds source references, chooses a credited free Pexels image, updates
the blog index, and adds the post URL to the sitemap. A GitHub Actions workflow
also runs this daily and pushes a new post when sources are available.
aplus academy developer notes
