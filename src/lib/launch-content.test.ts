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

  it('uses authorized factory images and current factory wording on the manufacturing page', () => {
    const manufacturingPage = readFileSync(
      resolve(process.cwd(), 'src/pages/manufacturing-delivery.astro'),
      'utf8',
    );
    const factoryImageRefs = Array.from(
      manufacturingPage.matchAll(/src: '(\/images\/factory\/[^']+)'/g),
      (match) => match[1],
    );

    expect(factoryImageRefs.length).toBeGreaterThanOrEqual(4);
    expect(
      factoryImageRefs.filter(
        (imagePath) => !existsSync(resolve(process.cwd(), 'public', imagePath.replace(/^\//, ''))),
      ),
    ).toEqual([]);
    expect(manufacturingPage).toMatch(/our Jiangxi factory/i);
    expect(manufacturingPage).not.toMatch(/Change public wording to/);
  });

  it('does not expose confidential factory source URLs in current editable files', () => {
    const filesToCheck = [
      'docs/content-materials/authorized-factory-images.md',
      'scripts/beautify-authorized-factory-images.mjs',
    ];

    for (const file of filesToCheck) {
      const content = readFileSync(resolve(process.cwd(), file), 'utf8');

      expect(content).not.toContain('oremachinery.com');
    }
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
