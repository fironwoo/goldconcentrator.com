import { z } from 'astro/zod';

export type CoverImageData = {
  coverImage?: string;
  coverAlt?: string;
};

export const coverImageFields = {
  coverImage: z.string().min(1).optional(),
  coverAlt: z.string().min(1).optional(),
};

export function validateCoverImage(data: CoverImageData, context: z.RefinementCtx) {
  if (data.coverImage && !data.coverAlt) {
    context.addIssue({
      code: 'custom',
      path: ['coverAlt'],
      message: 'Alternative text is required when a cover image is supplied.',
    });
  }

  if (data.coverAlt && !data.coverImage) {
    context.addIssue({
      code: 'custom',
      path: ['coverImage'],
      message: 'A cover image is required when alternative text is supplied.',
    });
  }
}

export const coverImageSchema = z.object(coverImageFields).superRefine(validateCoverImage);
