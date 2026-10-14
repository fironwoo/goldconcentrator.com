import { z } from 'astro/zod';

export function cmsOptional<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (value) => value === '' || value === null ? undefined : value,
    schema.optional(),
  );
}
