# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start local dev server (port 3000)
npm run build        # Build static export to /out
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting without writing
```

Docker development:

```bash
docker-compose build && docker-compose up
docker-compose exec app npm install  # Install node_modules in working dir
```

## Architecture

This is a **static site** built with Next.js 15 using static export (`output: "export"` in next.config.ts). All pages are pre-rendered at build time—there is no Node.js server at runtime.

### Content Model

- **`_pages/*.md`** - Static pages (homepage, about sections). Rendered via catch-all route `[[...slug]].tsx`
- **`_posts/*.md`** - Blog posts. Rendered via `posts/[slug].tsx`
- **`_projects/*.mdx`** - Projects with frontmatter: `title`, `slug`, `description`, `url`, `github`, `type` (venture/product/library/experiment), `launchDate`, `lastUpdated`
- **Frontmatter**: YAML metadata (slug, date, title, status). Use `status: "draft"` to hide posts

Content is parsed with `gray-matter` and rendered as MDX via `next-mdx-remote`.

### Updating Project Dates from GitHub

To get accurate `lastUpdated` dates for projects, fetch from GitHub API:

```
https://api.github.com/users/lorey/repos?per_page=100&sort=pushed
```

Look for `pushed_at` field for each repo and update the corresponding `_projects/*.mdx` file.

### Key Files

- `src/lib/api.ts` - All markdown/frontmatter parsing logic
- `src/pages/[[...slug]].tsx` - Dynamic route for `_pages` content
- `src/pages/posts/[slug].tsx` - Blog post template
- `src/mdx-components.tsx` - Custom MDX component overrides

### Path Aliases

Use `@/` for imports from `./src/` (e.g., `import { Header } from "@/components/Header"`)

## Tech Stack

- Next.js 15, React 19, TypeScript 5 (strict mode)
- Tailwind CSS 4 for styling
- MDX for content with JSX components
- GitHub Pages deployment (automated via GitHub Actions on push to main)
