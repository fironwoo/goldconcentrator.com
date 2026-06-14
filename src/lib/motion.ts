export const REVEAL_SELECTOR = [
  '.hero-content > *',
  '.page-hero .container > *',
  '.principle-grid > *',
  '.section-heading',
  '.surface-card',
  '.solution-card',
  '.process > li',
  '.article-list > a',
  '.process-list > li',
  '.role-grid > div',
  '.faq details',
  '.prose h2',
  '.prose h3',
  '.prose img',
  '.prose blockquote',
  '.testing-grid > *',
  '.variables .container > *',
  '.cta-inner',
].join(',');

export function getRevealDelay(index: number): number {
  return Math.min(Math.max(index, 0) * 60, 300);
}

export function shouldEnableReveal(prefersReducedMotion: boolean): boolean {
  return !prefersReducedMotion;
}
