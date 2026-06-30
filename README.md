# MalekLearns

An open, growing learning hub — book summaries, course recaps, and engineering
insights — so other people can learn and explore new fields along with me.

**Live site:** https://malek-abdelrahman-hassan.github.io/MalekLearns/
**Portfolio:** https://malek-abdelrahman-hassan.github.io/

The site uses the *Code Studio* theme (a light, IDE / code-editor aesthetic).
The full design system is documented in [STUDIO-THEME-GUIDE.md](STUDIO-THEME-GUIDE.md).

## Structure

```
index.html                      → learning hub home
books/index.html                → list of book summaries
books/the-mom-test/index.html   → full chapter-by-chapter summary
css/styles.css                  → core theme (tokens, nav, footer, animations)
css/learning.css                → knowledge components (cards, prose, callouts, TOC)
js/scripts.js                   → shared interactions (scroll reveal, nav, TOC scrollspy)
Resources/Books/                → source markdown notes the site is built from
linkedin-posts/                 → personal LinkedIn drafts (NOT part of the website)
```

## Preview locally

It's plain static HTML — just open `index.html`, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

In the repo settings → Pages, set the source to the `main` branch (root).
The `.nojekyll` file ensures all paths are served verbatim.

## Add a new book

1. Create a folder `books/<book-slug>/` and copy
   `books/the-mom-test/index.html` as a starting point.
2. Replace the hero, the chapter TOC, and the `<section>` blocks with the new
   book's content. Reuse the existing components: `.callout` (quote / warning /
   important / example), `.box.takeaways`, `.box.rules`, and `.prose table`.
3. Add a `.k-card` for the book in `books/index.html`, and optionally feature it
   on the home page (`index.html`).

No build step, no dependencies — keep using the theme tokens (`var(--…)`) so
everything stays visually consistent.
