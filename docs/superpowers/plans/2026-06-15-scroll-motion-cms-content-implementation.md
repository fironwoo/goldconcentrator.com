# Lightweight Motion and CMS Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add accessible, lightweight scroll reveals and make images, articles, projects, and public YouTube videos manageable through the Chinese Sveltia CMS.

**Architecture:** A small pure TypeScript module defines reveal targets and stagger delays, while a single browser script in `BaseLayout` applies `IntersectionObserver` behavior. Content metadata remains in Astro content collections; a second pure TypeScript module validates YouTube URLs and filters public videos for the new list/detail routes. Sveltia CMS edits the same Markdown and JSON files, and a Chinese handbook documents the publishing workflow.

**Tech Stack:** Astro 6, TypeScript, Vitest, native CSS, native `IntersectionObserver`, Sveltia CMS, GitHub editorial workflow.

---

## File Structure

- Create `src/lib/motion.ts`: pure reveal-target and stagger-delay rules.
- Create `src/lib/motion.test.ts`: motion rule tests.
- Create `src/scripts/reveal.ts`: browser observer and no-JavaScript-safe enhancement.
- Modify `src/layouts/BaseLayout.astro`: load the reveal script and mark JavaScript enhancement state.
- Modify `src/styles/global.css`: reveal states, hero entrance, image styles, reduced-motion behavior.
- Create `src/lib/videos.ts`: YouTube parsing and public-video filtering.
- Create `src/lib/videos.test.ts`: URL and draft-filter tests.
- Modify `src/content.config.ts`: optional cover image and alternative-text schemas.
- Replace `public/admin/config.yml`: valid UTF-8 Chinese labels and cover fields.
- Create `src/pages/videos/index.astro`: public video listing.
- Create `src/pages/videos/[...slug].astro`: public video detail pages.
- Modify `src/components/Header.astro`: add Videos navigation.
- Modify `src/components/Footer.astro`: add Videos navigation.
- Modify content detail/index pages: render optional cover images.
- Create `docs/cms-publishing-guide-zh.md`: complete Chinese operating guide.
- Modify `src/pages/admin/index.astro`: readable Chinese title, fallback text, and handbook reference.

### Task 1: Lightweight Reveal Rules

**Files:**
- Create: `src/lib/motion.test.ts`
- Create: `src/lib/motion.ts`
- Create: `src/scripts/reveal.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing tests for target rules and capped stagger delays**

```ts
import { describe, expect, it } from 'vitest';
import { getRevealDelay, REVEAL_SELECTOR } from './motion';

describe('reveal motion rules', () => {
  it('targets headings, cards, process items, article rows, prose media and calls to action', () => {
    expect(REVEAL_SELECTOR).toContain('.section-heading');
    expect(REVEAL_SELECTOR).toContain('.surface-card');
    expect(REVEAL_SELECTOR).toContain('.process > li');
    expect(REVEAL_SELECTOR).toContain('.article-list > a');
    expect(REVEAL_SELECTOR).toContain('.prose img');
    expect(REVEAL_SELECTOR).toContain('.cta-inner');
  });

  it('staggers by 60ms and caps the delay at 300ms', () => {
    expect(getRevealDelay(0)).toBe(0);
    expect(getRevealDelay(3)).toBe(180);
    expect(getRevealDelay(20)).toBe(300);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- src/lib/motion.test.ts`

Expected: FAIL because `./motion` does not exist.

- [ ] **Step 3: Implement pure rules**

```ts
export const REVEAL_SELECTOR = [
  '.section-heading',
  '.surface-card',
  '.solution-card',
  '.process > li',
  '.article-list > a',
  '.process-list > li',
  '.role-grid > div',
  '.faq details',
  '.prose h2',
  '.prose h3',
  '.prose img',
  '.prose blockquote',
  '.testing-grid > *',
  '.cta-inner',
].join(',');

export function getRevealDelay(index: number): number {
  return Math.min(Math.max(index, 0) * 60, 300);
}
```

- [ ] **Step 4: Implement observer and CSS integration**

`src/scripts/reveal.ts` must:

- exit immediately when reduced motion is requested;
- add `.motion-ready` only after targets are available;
- set `--reveal-delay` using sibling order;
- add `.is-revealed` once an element intersects;
- reveal all targets immediately when `IntersectionObserver` is unavailable;
- disconnect after all targets are revealed.

`BaseLayout.astro` must import the script using Astro's bundled script pipeline. `global.css` must keep content visible unless `.motion-ready` exists, animate only `opacity` and `transform`, and disable all reveal states under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Run tests and type checks**

Run:

```powershell
npm.cmd test -- src/lib/motion.test.ts
npm.cmd run check
```

Expected: motion tests PASS and Astro check reports zero errors.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/motion.ts src/lib/motion.test.ts src/scripts/reveal.ts src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add lightweight scroll reveal motion"
```

### Task 2: Cover Images and Chinese CMS Configuration

**Files:**
- Modify: `src/content.config.ts`
- Replace: `public/admin/config.yml`
- Modify: `src/pages/solutions/[...slug].astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[...slug].astro`
- Modify: `src/pages/knowledge/index.astro`
- Modify: `src/pages/knowledge/[...slug].astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add failing schema tests**

Create a schema fixture test in `src/lib/content-metadata.test.ts` that imports shared `coverImageSchema` and verifies:

```ts
expect(coverImageSchema.parse({
  coverImage: '/images/uploads/wash-plant.webp',
  coverAlt: 'Alluvial gold wash plant beside the feed hopper',
})).toEqual({
  coverImage: '/images/uploads/wash-plant.webp',
  coverAlt: 'Alluvial gold wash plant beside the feed hopper',
});

expect(coverImageSchema.parse({})).toEqual({});
expect(() => coverImageSchema.parse({
  coverImage: '/images/uploads/wash-plant.webp',
})).toThrow();
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- src/lib/content-metadata.test.ts`

Expected: FAIL because the shared cover schema does not exist.

- [ ] **Step 3: Add and use shared cover metadata**

Create `src/lib/content-metadata.ts` with a Zod object where both fields are optional as a pair, and use it in all four content collection schemas. Existing content without covers must remain valid.

- [ ] **Step 4: Replace CMS configuration with valid UTF-8 Chinese**

The configuration must retain:

- GitHub backend `fironwoo/goldconcentrator.com`, branch `main`;
- `editorial_workflow`;
- `public/images/uploads` and `/images/uploads`;
- existing collection fields;
- optional `coverImage` image widget and conditionally required `coverAlt` string guidance;
- Chinese labels for all collections and fields.

Do not add public pricing, customer claims, or recovery-rate fields.

- [ ] **Step 5: Render optional cover images**

For list cards, render covers above card text when present. For detail pages, render one hero-adjacent or article-leading image with the supplied alternative text. Use a shared `.content-cover` style with a stable `16 / 9` aspect ratio and `object-fit: cover`.

- [ ] **Step 6: Verify schema, tests, and build**

Run:

```powershell
npm.cmd test -- src/lib/content-metadata.test.ts
npm.cmd run check
npm.cmd run build
```

Expected: tests PASS, zero Astro errors, and all existing routes build.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/content-metadata.ts src/lib/content-metadata.test.ts src/content.config.ts public/admin/config.yml src/pages src/styles/global.css
git commit -m "feat: add CMS cover image support"
```

### Task 3: Public Video Pages

**Files:**
- Create: `src/lib/videos.test.ts`
- Create: `src/lib/videos.ts`
- Create: `src/pages/videos/index.astro`
- Create: `src/pages/videos/[...slug].astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Write failing tests for YouTube parsing and draft filtering**

```ts
import { describe, expect, it } from 'vitest';
import { getPublicVideos, parseYouTubeVideoId } from './videos';

describe('video utilities', () => {
  it('parses standard, short and Shorts YouTube URLs', () => {
    expect(parseYouTubeVideoId('https://www.youtube.com/watch?v=abcDEF12345')).toBe('abcDEF12345');
    expect(parseYouTubeVideoId('https://youtu.be/abcDEF12345')).toBe('abcDEF12345');
    expect(parseYouTubeVideoId('https://www.youtube.com/shorts/abcDEF12345')).toBe('abcDEF12345');
  });

  it('rejects non-YouTube and malformed URLs', () => {
    expect(parseYouTubeVideoId('https://example.com/watch?v=abcDEF12345')).toBeNull();
    expect(parseYouTubeVideoId('https://www.youtube.com/')).toBeNull();
  });

  it('excludes drafts and sorts newest first', () => {
    const videos = getPublicVideos([
      { data: { draft: false, publishedAt: new Date('2026-01-01') } },
      { data: { draft: true, publishedAt: new Date('2026-03-01') } },
      { data: { draft: false, publishedAt: new Date('2026-02-01') } },
    ]);
    expect(videos.map((video) => video.data.publishedAt.toISOString())).toEqual([
      '2026-02-01T00:00:00.000Z',
      '2026-01-01T00:00:00.000Z',
    ]);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- src/lib/videos.test.ts`

Expected: FAIL because `./videos` does not exist.

- [ ] **Step 3: Implement URL parsing and public filtering**

Support only:

- `youtube.com/watch?v=<11-character-id>`;
- `youtube.com/shorts/<11-character-id>`;
- `youtu.be/<11-character-id>`.

Return `null` for other hosts, missing IDs, or invalid ID characters. `getPublicVideos` must return a new array, exclude `draft: true`, and sort newest first.

- [ ] **Step 4: Add video list and detail routes**

The list page must use `getPublicVideos(await getCollection('videos'))`. The detail route's `getStaticPaths` must use the same filtered list so draft files generate no route. Valid YouTube IDs render a privacy-enhanced `youtube-nocookie.com/embed/<id>` iframe; invalid URLs render a normal external link without an iframe.

Include Video structured data only when a valid ID is available. Use the cover image as the thumbnail when supplied.

- [ ] **Step 5: Add navigation links**

Add `Videos` beside `Knowledge` in the desktop/mobile header and in the footer Company column.

- [ ] **Step 6: Verify tests and generated routes**

Run:

```powershell
npm.cmd test -- src/lib/videos.test.ts
npm.cmd run check
npm.cmd run build
rg -n "/videos/" dist/sitemap-*.xml
Test-Path "dist/videos/cms-publishing-guide/index.html"
```

Expected: tests PASS; build succeeds; sitemap contains `/videos/`; the final command returns `False` because the existing guide is a draft.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/videos.ts src/lib/videos.test.ts src/pages/videos src/components/Header.astro src/components/Footer.astro
git commit -m "feat: publish verified video content"
```

### Task 4: Chinese Publishing Handbook and Admin Help

**Files:**
- Create: `docs/cms-publishing-guide-zh.md`
- Modify: `src/pages/admin/index.astro`
- Modify: `README.md`

- [ ] **Step 1: Write the handbook**

The guide must contain exact instructions for:

- signing in at `/admin/` with the authorized GitHub account;
- adding and editing solutions, projects, knowledge articles, and videos;
- uploading a cover and inserting Markdown body images;
- using English lowercase filenames with hyphens;
- recommended cover dimensions of `1600 x 900` and WebP/JPEG compression;
- writing useful alternative text;
- saving drafts, moving to review, and publishing;
- waiting for Cloudflare Pages deployment after publication;
- using `draft: true` for videos until they are approved;
- editing, unpublishing, and deleting;
- troubleshooting GitHub login, missing images, invalid YouTube links, and delayed deployments.

- [ ] **Step 2: Repair the admin fallback page**

Use valid UTF-8 Chinese for the page title and `noscript` message. Add a visible pre-CMS loading/help panel with a link to the repository handbook. Hide the panel after Sveltia CMS initializes so it does not obstruct the editor.

- [ ] **Step 3: Link the guide from README**

Add a short “Content publishing” section linking to `docs/cms-publishing-guide-zh.md` and `/admin/`.

- [ ] **Step 4: Verify text and configuration**

Run:

```powershell
rg -n "登录|封面|草稿|审核|发布|YouTube|Cloudflare|删除" docs/cms-publishing-guide-zh.md
rg -n "内容后台|JavaScript|操作指南" src/pages/admin/index.astro
npm.cmd run check
```

Expected: all handbook topics are found and Astro check reports zero errors.

- [ ] **Step 5: Commit**

```powershell
git add docs/cms-publishing-guide-zh.md src/pages/admin/index.astro README.md
git commit -m "docs: add Chinese CMS publishing handbook"
```

### Task 5: Full Verification and Browser Acceptance

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run complete automated verification**

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run build
git diff --check
```

Expected: all tests pass, Astro check has zero errors, production build completes, and `git diff --check` has no output.

- [ ] **Step 2: Start local preview**

Run `npm.cmd run dev -- --host 127.0.0.1` as a hidden background process and wait until the local URL responds.

- [ ] **Step 3: Verify in the in-app browser**

At desktop and mobile widths verify:

- the homepage initially displays all content and reveal targets gain `.is-revealed` while scrolling;
- reveal delays are capped and no horizontal overflow appears;
- a solution detail page reveals headings, process rows, FAQ, and CTA;
- `/videos/` loads and the existing draft does not appear;
- `/admin/` loads valid Chinese fallback/help text before Sveltia CMS takes over;
- reduced-motion emulation leaves targets visible with no translated state.

- [ ] **Step 4: Request final code review**

Review the complete diff against:

- `docs/superpowers/specs/2026-06-15-scroll-motion-cms-content-design.md`;
- this implementation plan.

Fix all critical and important findings, then repeat complete verification.

- [ ] **Step 5: Commit verification fixes, if any**

```powershell
git add -A
git commit -m "fix: address motion and CMS verification findings"
```

- [ ] **Step 6: Push the verified feature branch**

```powershell
git push -u origin codex/lightweight-motion-cms
```

Cloudflare Pages production remains on `main`; do not change the formal domain or DNS during this task.
