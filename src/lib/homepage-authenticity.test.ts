import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('homepage industrial authenticity without heavy media', () => {
  const homepage = () => readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');

  it('uses a small number of lazy evidence images instead of a heavy gallery', () => {
    const source = homepage();
    const imageTags = source.match(/<img\b/g) || [];

    expect(imageTags.length).toBeGreaterThanOrEqual(2);
    expect(imageTags.length).toBeLessThanOrEqual(3);
    expect(source.match(/loading="lazy"/g) || []).toHaveLength(imageTags.length);
    expect(source).toContain('Workshop, packing and delivery checks');
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
