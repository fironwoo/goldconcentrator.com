import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('homepage industrial authenticity without heavy media', () => {
  const homepage = () => readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');

  it('uses a controlled number of evidence images instead of a heavy gallery', () => {
    const source = homepage();
    const imageTags = source.match(/<img\b/g) || [];

    expect(imageTags).toHaveLength(5);
    expect(source.match(/loading="lazy"/g) || []).toHaveLength(4);
    expect(source.match(/loading="eager"/g) || []).toHaveLength(1);
    expect(source).toContain('Workshop, packing and delivery checks');
  });

  it('keeps secondary solution copy aligned and justified', () => {
    const source = homepage();

    expect(source).toContain('class="solution-card__body"');
    expect(source).toContain('grid-template-rows: 1.25rem 3.9rem minmax(7.4rem, 1fr) auto');
    expect(source).toContain('text-align: justify');
    expect(source).toContain('text-align-last: left');
  });

  it('supports an optional controlled hero video with a still-image fallback', () => {
    const source = homepage();

    expect(source).toContain('heroVideoActive');
    expect(source).toContain('data-hero-video-toggle');
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).toContain('homepageData.hero.poster');
  });

  it('replaces abstract landing-page language with practical ore questions', () => {
    const source = homepage();

    expect(source).toContain('What I check before naming equipment');
    expect(source).toContain('Clay and washing difficulty');
    expect(source).toContain('Feed size before and after screening');
    expect(source).toContain('Where the valuable mineral may be lost');
    expect(source).not.toContain('A machine can be copied');
    expect(source).not.toContain('Evidence without invented claims');
  });
});
