import { describe, expect, it } from 'vitest';
import {
  buildCanonicalUrl,
  getHomepageSolutionCards,
  getWhatsAppUrl,
  truncateDescription,
} from './site';

describe('site utilities', () => {
  it('builds canonical URLs without duplicate slashes', () => {
    expect(buildCanonicalUrl('/solutions/alluvial-gold/')).toBe(
      'https://www.goldconcentrator.com/solutions/alluvial-gold/',
    );
  });

  it('keeps gold solutions first and More last on the homepage', () => {
    expect(getHomepageSolutionCards().map((item) => item.slug)).toEqual([
      'alluvial-gold',
      'hard-rock-gold',
      'tin',
      'tungsten',
      'chrome',
      'more-minerals',
    ]);
  });

  it('truncates descriptions without cutting the final word', () => {
    const value =
      'A practical mineral processing route should be built around representative ore data and project conditions.';
    expect(truncateDescription(value, 72)).toBe(
      'A practical mineral processing route should be built around…',
    );
  });

  it('builds a WhatsApp click URL from formatted international numbers', () => {
    expect(getWhatsAppUrl('+86 185 0797 7930')).toBe('https://wa.me/8618507977930');
  });
});
