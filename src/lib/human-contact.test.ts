import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('human contact cues', () => {
  it('renders a persistent human contact widget from the shared layout', () => {
    const componentPath = resolve(process.cwd(), 'src/components/FloatingContact.astro');
    const layout = readFileSync(resolve(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf8');

    expect(existsSync(componentPath)).toBe(true);
    expect(layout).toContain('FloatingContact');
  });

  it('makes the homepage feel handled by a real reviewer', () => {
    const homepage = readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');

    expect(homepage).toContain('A real person reviews every project message');
    expect(homepage).toContain('WhatsApp is fastest for photos and short videos');
    expect(homepage).toContain('What happens after you send a message');
  });

  it('turns project pages into a contact path for similar ore conditions', () => {
    const projectPage = readFileSync(resolve(process.cwd(), 'src/pages/projects/[...slug].astro'), 'utf8');

    expect(projectPage).toContain('Send ore photos and project notes');
    expect(projectPage).toContain('WhatsApp');
    expect(projectPage).toContain('one business day');
  });
});
