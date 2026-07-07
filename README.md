# MalekLearns

> An open, growing learning hub — book summaries, course recaps, and engineering insights — built so others can learn and explore new fields alongside me.

[![Live Site](https://img.shields.io/badge/live-site-2563eb?style=flat-square)](https://malek-abdelrahman-hassan.github.io/MalekLearns/)
[![Portfolio](https://img.shields.io/badge/portfolio-visit-9b2bd6?style=flat-square)](https://malek-abdelrahman-hassan.github.io/)

## Overview

MalekLearns is a static, dependency-free website that distills books and courses
into clear, actionable summaries. It is my open notebook — everything I read and
study gets turned into chapter-by-chapter takeaways that anyone can follow.

- **Live site:** https://malek-abdelrahman-hassan.github.io/MalekLearns/
- **Portfolio:** https://malek-abdelrahman-hassan.github.io/

## Features

- Clean, IDE-inspired reading experience with a light *Code Studio* theme
- Chapter-by-chapter book summaries with an interactive reader carousel
- Reusable content components: callouts, takeaway boxes, rules, and tables
- Fully responsive layout with reduced-motion support
- Zero build step and zero runtime dependencies

## Project Structure

```
index.html                      Learning hub home page
books/index.html                Index of all book summaries
books/the-mom-test/index.html   Full chapter-by-chapter summary
css/styles.css                  Core theme (tokens, nav, footer, animations)
css/learning.css                Knowledge components (cards, prose, callouts, TOC)
js/scripts.js                   Shared interactions (scroll reveal, nav, scrollspy)
```

## Running Locally

The site is plain static HTML. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

The site is deployed via **GitHub Pages**:

1. In the repository settings, go to **Pages**.
2. Set the source to the `main` branch (root).

The included `.nojekyll` file ensures all paths are served verbatim.

## Adding a New Book

1. Create a folder `books/<book-slug>/` and copy
   `books/the-mom-test/index.html` as a starting point.
2. Replace the hero, chapter TOC, and `<section>` blocks with the new book's
   content, reusing the existing components (`.callout`, `.box.takeaways`,
   `.box.rules`, and `.prose table`).
3. Add a `.k-card` for the book in `books/index.html`, and optionally feature it
   on the home page (`index.html`).

Keep using the theme tokens (`var(--…)`) so everything stays visually consistent.

## License

© Malek Abdelrahman. All rights reserved.
