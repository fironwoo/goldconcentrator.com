import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { cmsOptional } from './cms-values';

describe('optional values saved by the CMS', () => {
  it('treats blank dates, URLs and disabled media objects as absent', () => {
    const schema = z.object({
      updatedAt: cmsOptional(z.coerce.date()),
      youtubeUrl: cmsOptional(z.url()),
      coverImage: cmsOptional(z.object({ src: z.string(), alt: z.string() })),
    });
    const parsed = schema.parse({ updatedAt: '', youtubeUrl: '', coverImage: null });
    expect(parsed).toEqual({ updatedAt: undefined, youtubeUrl: undefined, coverImage: undefined });
  });

  it('preserves supplied values and rejects nonempty invalid content', () => {
    const schema = z.object({
      updatedAt: cmsOptional(z.coerce.date()),
      youtubeUrl: cmsOptional(z.url()),
      coverImage: cmsOptional(z.object({ src: z.string(), alt: z.string() })),
    });
    const values = { updatedAt: '2026-10-14', youtubeUrl: 'https://youtu.be/8xrSEmnUiwQ', coverImage: { src: '/images/factory.webp', alt: 'Workshop' } };
    expect(schema.parse(values)).toEqual({ ...values, updatedAt: new Date('2026-10-14') });
    expect(schema.safeParse({ ...values, youtubeUrl: 'not-a-url' }).success).toBe(false);
    expect(schema.safeParse({ ...values, updatedAt: 'not-a-date' }).success).toBe(false);
    expect(schema.safeParse({ ...values, coverImage: { src: '/images/factory.webp' } }).success).toBe(false);
  });
});
