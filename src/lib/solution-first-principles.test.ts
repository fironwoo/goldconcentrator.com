import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { solutionProfiles } from '../data/solutionProfiles';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('solution pages follow the site first principles', () => {
  it('documents the non-negotiable decision sequence', () => {
    const path = 'docs/site-first-principles.md';
    expect(existsSync(resolve(process.cwd(), path))).toBe(true);

    const principles = read(path);
    expect(principles).toContain('Ore behavior comes before machine names.');
    expect(principles).toContain('Unknown information is a valid answer');
    expect(principles).toContain('A case proves relevant experience');
    expect(principles).toContain('Interaction must reduce uncertainty');
  });

  it('provides mineral-specific route questions and honest boundaries', () => {
    expect(Object.keys(solutionProfiles)).toEqual([
      'alluvial-gold',
      'hard-rock-gold',
      'tin',
      'tungsten',
      'chrome',
      'more-minerals',
    ]);

    for (const profile of Object.values(solutionProfiles)) {
      expect(profile.suitableFor).toHaveLength(3);
      expect(profile.routeMayChangeWhen).toHaveLength(3);
      expect(profile.diagnosticQuestions).toHaveLength(3);
      expect(profile.verificationNeeds.length).toBeGreaterThanOrEqual(4);
      for (const question of profile.diagnosticQuestions) {
        expect(question.options.some((option) => option.label === 'I do not know yet')).toBe(true);
        expect(question.options.every((option) => option.insight.length > 40)).toBe(true);
      }
    }
  });

  it('uses a lightweight accessible route checker that preserves context', () => {
    const checker = read('src/components/SolutionRouteChecker.astro');

    expect(checker).toContain('<fieldset data-route-step');
    expect(checker).toContain('aria-live="polite"');
    expect(checker).toContain('sessionStorage.setItem');
    expect(checker).toContain("prefers-reduced-motion: reduce");
    expect(checker).toContain('Continue with these notes');
    expect(checker).toContain('This is not final equipment selection.');
  });

  it('turns solution pages into a technical review path with comparable evidence', () => {
    const page = read('src/pages/solutions/[...slug].astro');

    expect(page).toContain('Check whether this route fits the ore.');
    expect(page).toContain('The route may change when');
    expect(page).toContain('Why equipment appears in the route');
    expect(page).toContain('Case notes to compare with your ore');
    expect(page).toContain('What a reviewer will return');
    expect(page).toContain('We will not generate a final equipment package from capacity alone.');
  });

  it('carries route context into the project form without repeating mineral selection', () => {
    const form = read('src/components/InquiryForm.astro');
    const globalStyles = read('src/styles/global.css');

    expect(form).toContain('new URLSearchParams(window.location.search)');
    expect(form).toContain("query.get('mineral')");
    expect(form).toContain("query.get('routeNotes')");
    expect(form).toContain('data-step-heading');
    expect(form).toContain("setAttribute('aria-current', 'step')");
    expect(form).toContain("prefers-reduced-motion: reduce");
    expect(globalStyles).toContain('[hidden]');
    expect(globalStyles).toContain('display: none !important');
  });

  it('keeps contact visible but avoids a fake live-chat signal or content obstruction', () => {
    const contact = read('src/components/FloatingContact.astro');

    expect(contact).toContain('Manual review, not live chat');
    expect(contact).toContain("sessionStorage.setItem(dismissalKey, 'true')");
    expect(contact).toContain('width: 44px');
    expect(contact).toContain('height: 44px');
    expect(contact).not.toContain('#76d36b');
    expect(contact).not.toContain('box-shadow: 0 0 0 5px');
  });

  it('provides complete keyboard and dismissal behavior for navigation', () => {
    const header = read('src/components/Header.astro');

    expect(header).toContain('aria-controls="solutions-dropdown"');
    expect(header).toContain("event.key !== 'Escape'");
    expect(header).toContain('closeSolutions(true)');
    expect(header).toContain('header?.contains(event.target)');
    expect(header).toContain("aria-current={isCurrent(href) ? 'page' : undefined}");
  });
});
