# brand-site

Source for [sjvik-labs.stevenjvik.tech](https://sjvik-labs.stevenjvik.tech). The SJVIK Labs hub and professional portfolio site.

## What's on the site

- **Home** with hero section and navigation
- **About** page with skills grid (8 categories), active certs, and exam-ready list
- **Experience** with role summaries and detailed case studies for Sound Transit, JBLM, and the home lab (Nexus Lab)
- **Projects** page showcasing lab and tooling work
- **Guides** page linking to published resources

Resume PDF is served from `/Steven_Vik_Resume.pdf`.

## Stack

- [Astro](https://astro.build) for static site generation
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- TypeScript
- Node 22

## Development

```bash
npm install
npm run dev
```

## Build and deploy

The site builds to `dist/` and deploys to Hostinger via FTP. Beta PDFs from `static-assets/beta/` get copied into the build output automatically.

```bash
npm run build              # Build only
bash scripts/deploy.sh     # Build + FTP deploy
```

Set `HOSTINGER_PASS` env var or create `~/.hostinger-tahala-pass` for deploy credentials.

## CI

GitHub Actions runs type checking and build verification on pushes and PRs to main.

## License

[MIT](LICENSE)
