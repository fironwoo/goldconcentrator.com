import { readFileSync } from 'node:fs';
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
});
