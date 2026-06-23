import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SITE } from './site';

describe('launch contact content', () => {
  it('uses verified public contact details instead of launch placeholders', () => {
    expect(SITE.whatsapp).toBe('+86 185 0797 7930');
    expect(SITE.officeAddress).toBe(
      'Chuangye Road, Guzhang Industrial Park, Shicheng County, Ganzhou City, Jiangxi Province, China',
    );
    expect(SITE.youtube).toBe('');
    expect(SITE.officeAddress).not.toMatch(/add the verified/i);
  });

  it('does not show the launch information placeholder on the About page', () => {
    const aboutPage = readFileSync(resolve(process.cwd(), 'src/pages/about.astro'), 'utf8');

    expect(aboutPage).not.toMatch(/Launch information required/);
    expect(aboutPage).toContain('{SITE.officeAddress}');
  });

  it('keeps solution process illustration references backed by public assets', () => {
    const solutionDir = resolve(process.cwd(), 'src/content/solutions');
    const missingAssets: string[] = [];

    for (const filename of readdirSync(solutionDir).filter((file) => file.endsWith('.md'))) {
      const content = readFileSync(resolve(solutionDir, filename), 'utf8');
      const imageMatches = content.matchAll(/!\[[^\]]*]\((\/images\/process\/[^)]+)\)/g);

      for (const match of imageMatches) {
        const publicPath = resolve(process.cwd(), 'public', match[1].replace(/^\//, ''));

        if (!existsSync(publicPath)) {
          missingAssets.push(`${filename}: ${match[1]}`);
        }
      }
    }

    expect(missingAssets).toEqual([]);
  });
});
