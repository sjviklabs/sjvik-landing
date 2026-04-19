# brand-site

Source for [stevenjvik.tech](https://stevenjvik.tech) — Steve Vik's cybersecurity/DevOps portfolio + SJVIK Labs hub.

## What's on the site

Single-page home (`/`) with hash-anchor navigation (`#work`, `#projects`, `#guides`, `#contact`) plus deep pages for SEO and direct linking:

- **`/`** — terminal or editorial hero variant (swap via ⌘K), live SOC feed, uptime sparklines, NOW status card, projects grid with filters, guide cards
- **`/about`** — bio, 8 skill categories, active certs + exam-ready list, education, contact
- **`/experience`** + `/experience/{jblm,nexus-lab,sound-transit}` — full role timeline and rich case studies
- **`/projects`** — filterable project grid by kind (infrastructure / tools / security / mods) + digital products row
- **`/guides`** — two Gumroad guides with full chapters and free sample content
- **`/noc/`** — architecture overview of the SJVIK NOC (standalone static page in `public/`)

## Stack

- [Astro 6](https://astro.build) static site generation
- [Tailwind CSS v4](https://tailwindcss.com) with `@theme` design tokens
- React 19 as islands for interactive widgets (⌘K palette, tweaks panel, live widgets)
- [nanostores](https://github.com/nanostores/nanostores) + `@nanostores/persistent` for shared state
- TypeScript throughout
- Node 22

Interactive state (theme, accent, layout variant, motion) is hydrated via React + persisted to localStorage. A pre-hydration `<script is:inline>` in `Layout.astro` reads the same keys and writes `data-*` attrs on `<html>` before first paint, so there's no FOUC.

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output in dist/
npm run preview    # preview the production build
```

## Content

Single source of truth: `src/data/content.ts`. All experience, projects, guides, skills, certifications, and contact data is typed and imported from there — both the home-page sections and the deep pages read from this module. Update content there; components render it.

The rich HTML for guide sample chapters lives inline in `src/pages/guides.astro` via a `SAMPLES` map keyed by guide id (format-specific content, not typed data).

## CI / CD

GitHub Actions runs two workflows:

- **CI** (`.github/workflows/ci.yml`) — fires on every push and PR to `main`. Runs `npm ci && npm run build`, uploads the `dist/` artifact (7-day retention), and is the required status check that must pass before merging to `main`.

- **Deploy** (`.github/workflows/deploy.yml`) — triggered automatically via `workflow_run` after CI succeeds on `main`. Downloads the CI build artifact (no rebuild), mirrors to the Hostinger public_html over FTPS using `lftp`, and runs a smoke test that `curl`s the six main routes plus the `.htaccess` redirect — fails the job on any non-200/non-301 response. Concurrency group `deploy-production` serializes deploys so back-to-back pushes queue instead of racing.

Can be re-run manually from the Actions tab (`workflow_dispatch`) — that path rebuilds from the current `main` tip.

### Secrets

Set on the repo (via `gh secret set`):

- `HOSTINGER_USER` — FTP username
- `HOSTINGER_PASS` — FTP password

Rotate the password in hpanel → `Files → FTP Accounts → Change FTP password`, then update the secret:

```bash
printf '%s' 'new-password' | gh secret set HOSTINGER_PASS --repo sjviklabs/brand-site
```

### Environment

Deploys use the GitHub Environment `production` (URL: `https://stevenjvik.tech`). Deployments show in the **Environments** tab with full history, timing, and rollback pointers.

### Dependabot

`.github/dependabot.yml` runs weekly npm updates (grouped by ecosystem: astro / tailwind / react / nanostores) and monthly GitHub Actions updates.

## Project layout

```
src/
  components/
    Nav.astro, Footer.astro                  # shared shell
    sections/                                # static Astro sections
      HeroTerminal.astro, HeroEditorial.astro
      WorkSection.astro, ProjectsSection.astro
      GuidesSection.astro, ContactSection.astro
    react/                                   # hydrating React islands
      CommandPalette.tsx, TweaksPanel.tsx, StoreSync.tsx
      SocFeed.tsx, UptimeGrid.tsx, NowCard.tsx
      Typewriter.tsx, Scramble.tsx
      store.ts, useReducedMotion.ts
  data/
    content.ts                               # single source of truth
  layouts/
    Layout.astro                             # pre-hydration script + meta
  pages/
    index.astro                              # home (single-page assembly)
    about.astro, experience.astro, ...       # deep pages
    experience/{jblm,nexus-lab,sound-transit}.astro
  styles/
    global.css                               # @theme tokens + component classes
public/
  Steven_Vik_Resume.pdf, logo.png, favicon.svg
  noc/index.html                             # standalone NOC architecture doc
  .htaccess                                  # stale-URL redirect (managed on Hostinger)
```

## License

[MIT](LICENSE)
