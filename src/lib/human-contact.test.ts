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
    expect(homepage).toContain('Tell me what you already have on site');
    expect(homepage).toContain('I will not guess the flowsheet from a machine list');
    expect(homepage).toContain('Message us on WhatsApp</a>');
    expect(homepage).not.toContain('Message us on WhatsApp:');
  });

  it('turns project pages into a contact path for similar ore conditions', () => {
    const projectPage = readFileSync(resolve(process.cwd(), 'src/pages/projects/[...slug].astro'), 'utf8');

    expect(projectPage).toContain('Send ore photos and project notes');
    expect(projectPage).toContain('WhatsApp');
    expect(projectPage).toContain('one business day');
  });

  it('makes the assessment form read like a guided technical intake', () => {
    const assessmentPage = readFileSync(resolve(process.cwd(), 'src/pages/assess-my-project.astro'), 'utf8');
    const inquiryForm = readFileSync(resolve(process.cwd(), 'src/components/InquiryForm.astro'), 'utf8');

    expect(assessmentPage).toContain('You can send an imperfect project brief');
    expect(assessmentPage).toContain('What I look for first');
    expect(inquiryForm).toContain('Photos and short videos are useful');
    expect(inquiryForm).toContain('What are you trying to separate, and what is causing trouble?');
  });

  it('lets visitors close the persistent contact widget', () => {
    const floatingContact = readFileSync(resolve(process.cwd(), 'src/components/FloatingContact.astro'), 'utf8');

    expect(floatingContact).toContain('data-floating-contact');
    expect(floatingContact).toContain('data-floating-contact-close');
    expect(floatingContact).toContain("setAttribute('hidden', '')");
  });
});
