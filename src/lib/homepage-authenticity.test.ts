import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('homepage industrial authenticity without heavy media', () => {
  const homepage = () => readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');
  const component = (name: string) =>
    readFileSync(resolve(process.cwd(), `src/components/${name}.astro`), 'utf8');

  it('uses a controlled number of evidence images instead of a heavy gallery', () => {
    const source = homepage();
    const imageTags = source.match(/<img\b/g) || [];

    expect(imageTags).toHaveLength(6);
    expect(source.match(/loading="lazy"/g) || []).toHaveLength(5);
    expect(source.match(/loading="eager"/g) || []).toHaveLength(1);
    expect(source).toContain('Workshop, packing and delivery checks');
    expect(source).toContain('Watch with technical context');
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

    expect(source).toContain('What we need before recommending equipment');
    expect(source).toContain('Clay and washing difficulty');
    expect(source).toContain('Feed size before and after screening');
    expect(source).toContain('Where the valuable mineral may be lost');
    expect(source).not.toContain('A machine can be copied');
    expect(source).not.toContain('Evidence without invented claims');
  });

  it('avoids the repeated card and label patterns flagged by the Hallmark audit', () => {
    const source = homepage();

    expect(source.match(/class="eyebrow"/g) || []).toHaveLength(1);
    expect(source).toContain('class="response-desk"');
    expect(source).toContain('class="response-sequence"');
    expect(source).toContain('class="project-ledger"');
    expect(source).not.toContain('class="response-grid"');
    expect(source).not.toContain('class="card-grid"');
  });

  it('uses a process-desk header and an asymmetric project-review footer', () => {
    const header = component('Header');
    const footer = component('Footer');

    expect(header).toContain('class="header-utility"');
    expect(header).toContain('class="header-route-bar"');
    expect(footer).toContain('footer-lead');
    expect(footer).toContain('class="review-desk"');
    expect(footer).not.toContain('class="footer-grid"');
  });
});
