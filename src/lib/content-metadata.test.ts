import { describe, expect, it } from 'vitest';
import { coverImageSchema } from './content-metadata';

describe('cover image metadata', () => {
  it('accepts a cover image with useful alternative text', () => {
    expect(
      coverImageSchema.parse({
        coverImage: '/images/uploads/wash-plant.webp',
        coverAlt: 'Alluvial gold wash plant beside the feed hopper',
      }),
    ).toEqual({
      coverImage: '/images/uploads/wash-plant.webp',
      coverAlt: 'Alluvial gold wash plant beside the feed hopper',
    });
  });

  it('keeps cover metadata optional for existing content', () => {
    expect(coverImageSchema.parse({})).toEqual({});
  });

  it('requires alternative text when a cover image is supplied', () => {
    expect(() =>
      coverImageSchema.parse({
        coverImage: '/images/uploads/wash-plant.webp',
      }),
    ).toThrow();
  });

  it('requires an image when alternative text is supplied', () => {
    expect(() =>
      coverImageSchema.parse({
        coverAlt: 'Alluvial gold wash plant beside the feed hopper',
      }),
    ).toThrow();
  });
});
