import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { coverImageFields, validateCoverImage } from './lib/content-metadata';

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: z
    .object({
      title: z.string(),
      eyebrow: z.string(),
      description: z.string(),
      seoTitle: z.string(),
      order: z.number(),
      category: z.enum(['gold', 'mineral', 'more']),
      featured: z.boolean().default(false),
      keyVariables: z.array(z.string()),
      processSteps: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      ),
      equipmentRoles: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      ),
      faq: z.array(faqSchema),
      ...coverImageFields,
    })
    .superRefine(validateCoverImage),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      country: z.string(),
      mineral: z.string(),
      capacity: z.string(),
      process: z.string(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      verified: z.boolean().default(false),
      evidenceNote: z.string(),
      ...coverImageFields,
    })
    .superRefine(validateCoverImage),
});

const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      youtubeUrl: z.url().optional(),
      ...coverImageFields,
    })
    .superRefine(validateCoverImage),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      mineral: z.string(),
      youtubeUrl: z.url(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...coverImageFields,
    })
    .superRefine(validateCoverImage),
});

export const collections = { solutions, projects, knowledge, videos };
