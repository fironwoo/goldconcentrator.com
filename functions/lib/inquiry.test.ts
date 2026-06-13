import { describe, expect, it } from 'vitest';
import { parseInquiry, shouldRateLimit } from './inquiry';

const validInquiry = {
  mineral: 'alluvial_gold',
  capacity: '20-50 TPH',
  oreType: 'Free-washing alluvial material',
  grade: '2.4 g/t',
  feedSize: 'Below 80 mm',
  country: 'Ghana',
  projectStage: 'Planning and supplier evaluation',
  budget: 'Not sure yet',
  message: 'We need a practical washing and gravity recovery route.',
  name: 'Sample Buyer',
  company: 'Sample Mining Ltd',
  email: 'buyer@example.com',
  whatsapp: '+233 000 000 000',
  consent: true,
  turnstileToken: 'token',
};

describe('inquiry parsing', () => {
  it('accepts a complete supported inquiry', () => {
    const result = parseInquiry(validInquiry);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.mineral).toBe('alluvial_gold');
      expect(result.value.email).toBe('buyer@example.com');
    }
  });

  it('rejects unsupported minerals and invalid email addresses', () => {
    const result = parseInquiry({
      ...validInquiry,
      mineral: 'coal',
      email: 'not-an-email',
    });
    expect(result).toEqual({
      ok: false,
      errors: expect.arrayContaining([
        'Select a supported mineral.',
        'Enter a valid email address.',
      ]),
    });
  });

  it('requires privacy consent and a Turnstile token', () => {
    const result = parseInquiry({
      ...validInquiry,
      consent: false,
      turnstileToken: '',
    });
    expect(result).toEqual({
      ok: false,
      errors: expect.arrayContaining([
        'Privacy consent is required.',
        'Please complete the anti-spam check.',
      ]),
    });
  });

  it('rejects an oversized project description', () => {
    const result = parseInquiry({
      ...validInquiry,
      message: 'x'.repeat(5001),
    });
    expect(result).toEqual({
      ok: false,
      errors: expect.arrayContaining([
        'Project description must be 5,000 characters or fewer.',
      ]),
    });
  });
});

describe('rate limiting', () => {
  it('limits repeated submissions inside the configured window', () => {
    expect(
      shouldRateLimit({
        recentSubmissions: 3,
        maxSubmissions: 3,
      }),
    ).toBe(true);
  });
});
