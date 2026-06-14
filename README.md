# GoldConcentrator.com

English B2B mineral processing website built with Astro, Sveltia CMS and Cloudflare Pages.

## Local development

Requires Node.js 22.12 or newer.

```powershell
npm install
npm run dev
```

Quality checks:

```powershell
npm test
npm run check
npm run build
```

The static site is written to `dist/`. Cloudflare Pages Functions in `functions/` provide the
inquiry API.

## Content model

- `src/content/solutions/`: alluvial gold, hard rock gold, tin, tungsten, chrome and More.
- `src/content/projects/`: anonymized cases. The included launch files are templates and remain
  `noindex` until `verified: true`.
- `src/content/knowledge/`: weekly technical articles.
- `src/content/videos/`: YouTube metadata. The included CMS guide is an internal draft.
- `src/data/site.json`: contact details and global site settings.

The admin interface is available at `/admin/` and is connected to
`fironwoo/goldconcentrator.com`. Configure GitHub authentication for Sveltia CMS before using the
editor in production.

## Content publishing

- Open `/admin/` to manage solutions, projects, knowledge articles, videos, media and global
  contact details.
- Follow the [Chinese CMS publishing guide](docs/cms-publishing-guide-zh.md) for image
  specifications, editorial workflow, video drafts and troubleshooting.
- Uploaded media is stored in `public/images/uploads/`.
- Published changes trigger a new Cloudflare Pages deployment from `main`.

## Cloudflare deployment

1. Push the repository to GitHub using `main` as the production branch.
2. In Cloudflare Pages, connect the repository.
3. Set build command to `npm run build` and output directory to `dist`.
4. Create a D1 database named `goldconcentrator-inquiries`.
5. Apply the schema:

   ```powershell
   npx wrangler d1 execute goldconcentrator-inquiries --remote --file=database/schema.sql
   ```

6. Bind the database to Pages Functions as `DB`.
7. Add these encrypted variables in Cloudflare:
   - `TURNSTILE_SECRET_KEY`
   - `RESEND_API_KEY`
   - `INQUIRY_FROM_EMAIL`
   - `INQUIRY_TO_EMAIL`
   - `IP_HASH_SALT`
8. Add `PUBLIC_TURNSTILE_SITE_KEY` as a Pages build variable.
9. Create a Turnstile widget for `goldconcentrator.com`.
10. Verify `goldconcentrator.com` in Resend and configure SPF and DKIM before using the domain as
    the sender.
11. Enable Cloudflare Web Analytics. No GA4 or analytics cookie banner is required by this build.

## 180-day cleanup

Copy `workers/wrangler.example.toml` to `workers/wrangler.toml`, replace the D1 database ID and
deploy from the project root:

```powershell
npx wrangler deploy --config workers/wrangler.toml
```

The scheduled Worker deletes rows after their `expires_at` date.

## Domain migration

The domain currently points to a disabled Shopify store. After the Cloudflare Pages preview is
approved:

1. Add both `goldconcentrator.com` and `www.goldconcentrator.com` to the Pages project.
2. Make `www.goldconcentrator.com` the canonical public host.
3. Configure a permanent redirect from the root domain to `https://www.goldconcentrator.com`.
4. Remove the Shopify A and CNAME records only after Cloudflare confirms the new records.
5. Submit `https://www.goldconcentrator.com/sitemap-index.xml` in Google Search Console.

## Required content before public launch

- Replace the three project templates with verified project records and approved media.
- Add the real office or contracting address and WhatsApp number in `src/data/site.json`.
- Obtain written manufacturing-brand and image authorization before changing public wording to
  “our factory”.
- Replace atmospheric imagery over time with approved supplier and field photography.

The generated hero image at `public/images/hero-gravity-plant.webp` is an atmospheric visual only
and must never be described as a customer site or company factory.
