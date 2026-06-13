import { describe, expect, it } from 'vitest';
import {
  buildInquiryEmail,
  createInquiryReference,
  retentionCutoffIso,
} from './delivery';
import type { Inquiry } from './inquiry';

const inquiry: Inquiry = {
  mineral: 'tin',
  capacity: '20-50 TPH',
  oreType: 'Cassiterite-bearing gravel',
  grade: 'Not tested',
  feedSize: 'Below 50 mm',
  utilities: 'Diesel power and recycled water',
  country: 'Nigeria',
  projectStage: 'Sampling and testing',
  budget: 'Not sure yet',
  message: '<b>Need classification advice</b>',
  name: 'Buyer <script>',
  company: 'Sample Mining',
  email: 'buyer@example.com',
  whatsapp: '+234 000 0000',
  consent: true,
  turnstileToken: 'token',
};

describe('inquiry delivery helpers', () => {
  it('creates a human-readable daily reference', () => {
    expect(
      createInquiryReference(new Date('2026-06-13T12:00:00Z'), 'a1b2c3d4'),
    ).toBe('GC-20260613-A1B2C3');
  });

  it('escapes customer content in HTML email output', () => {
    const email = buildInquiryEmail(inquiry, 'GC-20260613-A1B2C3');
    expect(email.html).toContain('&lt;b&gt;Need classification advice&lt;/b&gt;');
    expect(email.html).not.toContain('<script>');
    expect(email.text).toContain('Need classification advice');
  });

  it('calculates a 180-day retention cutoff', () => {
    expect(retentionCutoffIso(new Date('2026-06-13T00:00:00.000Z'), 180)).toBe(
      '2025-12-15T00:00:00.000Z',
    );
  });
});
