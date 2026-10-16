import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const article = readFileSync(
  resolve(process.cwd(), 'src/content/knowledge/questions-before-alluvial-gold-wash-plant.md'),
  'utf8',
);

describe('public project data sheet', () => {
  it('keeps every linked resource available in the static site', () => {
    const resources = [...article.matchAll(/href="(\/resources\/[^"]+)"/g)];
    expect(resources).toHaveLength(1);
    for (const [, resource] of resources) {
      expect(existsSync(resolve(process.cwd(), 'public', resource.slice(1)))).toBe(true);
    }
  });

  it('states measurement bases and evidence limits instead of prescribing a plant', () => {
    const sheet = readFileSync(
      resolve(process.cwd(), 'public/resources/alluvial-gold-project-data-sheet.txt'),
      'utf8',
    );
    expect(sheet).toContain('dry t/h');
    expect(sheet).toContain('% by mass or % by volume');
    expect(sheet).toContain('Write UNKNOWN');
    expect(sheet).toContain('not a sampling protocol');
    expect(sheet).toContain('No backlink or purchase is required.');
  });

  it('keeps the resource on the established indexable article URL', () => {
    expect(article).toContain('updatedAt: 2026-10-16');
    expect(article).toContain('(/solutions/alluvial-gold/)');
    expect(article).toContain('(/testing-process-design/)');
    expect(article).not.toMatch(/\/projects\/.+reference/);
  });
});
