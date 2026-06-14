import { describe, expect, it } from 'vitest';
import { getRevealDelay, REVEAL_SELECTOR } from './motion';

describe('reveal motion rules', () => {
  it('targets hero content, headings, cards, process items, prose media and calls to action', () => {
    expect(REVEAL_SELECTOR).toContain('.hero-content > *');
    expect(REVEAL_SELECTOR).toContain('.section-heading');
    expect(REVEAL_SELECTOR).toContain('.surface-card');
    expect(REVEAL_SELECTOR).toContain('.process > li');
    expect(REVEAL_SELECTOR).toContain('.article-list > a');
    expect(REVEAL_SELECTOR).toContain('.prose img');
    expect(REVEAL_SELECTOR).toContain('.cta-inner');
  });

  it('staggers by 60ms and caps the delay at 300ms', () => {
    expect(getRevealDelay(0)).toBe(0);
    expect(getRevealDelay(3)).toBe(180);
    expect(getRevealDelay(20)).toBe(300);
  });

  it('does not return a negative delay', () => {
    expect(getRevealDelay(-2)).toBe(0);
  });
});
