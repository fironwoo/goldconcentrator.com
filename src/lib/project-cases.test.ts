import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectDir = resolve(process.cwd(), 'src/content/projects');

const suppliedCaseFiles = [
  'romania-20tph-alluvial-gold-gravity-reference.md',
  'east-africa-200tph-alluvial-gold-reference.md',
  'australia-30tph-rock-gold-fine-gold-reference.md',
  'malaysia-50tph-rock-gold-line-reference.md',
  'tanzania-10tph-tin-tungsten-gravity-reference.md',
];

describe('supplied project reference cases', () => {
  it('publishes the five supplied reference cases instead of generic templates', () => {
    for (const filename of suppliedCaseFiles) {
      expect(existsSync(resolve(projectDir, filename)), `${filename} should exist`).toBe(true);
    }

    expect(readdirSync(projectDir).filter((file) => file.includes('template'))).toEqual([]);
  });

  it('keeps supplied cases as unverified reference pages until evidence is approved', () => {
    for (const filename of suppliedCaseFiles) {
      const content = readFileSync(resolve(projectDir, filename), 'utf8');

      expect(content, `${filename} should remain noindex through verified false`).toContain(
        'verified: false',
      );
      expect(content, `${filename} should explain evidence status`).toMatch(/evidenceNote:/);
      expect(content, `${filename} should not publish recovery claims`).not.toMatch(
        /\b\d{2,3}%\s+recovery\b/i,
      );
    }
  });

  it('does not present mercury or amalgamation as a default recommended route', () => {
    const eastAfricaCase = readFileSync(
      resolve(projectDir, 'east-africa-200tph-alluvial-gold-reference.md'),
      'utf8',
    );

    expect(eastAfricaCase).toContain('not recommended by default');
    expect(eastAfricaCase).not.toMatch(/we recommend mercury|recommended mercury|recommend amalgamation/i);
  });
});
