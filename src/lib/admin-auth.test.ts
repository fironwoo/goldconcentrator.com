import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

describe('CMS GitHub authentication', () => {
  it('uses the Cloudflare OAuth worker', () => {
    const config = parse(
      readFileSync(resolve(process.cwd(), 'public/admin/config.yml'), 'utf8'),
    );

    expect(config.backend.base_url).toBe(
      'https://sveltia-cms-auth.fironwoo.workers.dev',
    );
  });

  it('optimizes uploaded images and exposes beginner-friendly media fields', () => {
    const config = parse(
      readFileSync(resolve(process.cwd(), 'public/admin/config.yml'), 'utf8'),
    );
    const globalCollection = config.collections.find((item: { name: string }) => item.name === 'global');
    const homepageFile = globalCollection.files.find((item: { name: string }) => item.name === 'homepage');
    const projectCollection = config.collections.find((item: { name: string }) => item.name === 'projects');
    const knowledgeCollection = config.collections.find((item: { name: string }) => item.name === 'knowledge');
    const videoCollection = config.collections.find((item: { name: string }) => item.name === 'videos');

    expect(config.media_libraries.default.config.transformations.raster_image).toMatchObject({
      format: 'webp',
      width: 2000,
      height: 2000,
    });
    expect(homepageFile.file).toBe('src/data/homepage.json');
    expect(projectCollection.fields.some((field: { name: string }) => field.name === 'coverImage')).toBe(true);
    expect(knowledgeCollection.fields.some((field: { name: string }) => field.name === 'coverImage')).toBe(true);
    expect(videoCollection.fields.some((field: { name: string }) => field.name === 'videoFile')).toBe(true);
    expect(videoCollection.fields.some((field: { name: string }) => field.name === 'posterImage')).toBe(true);
  });
});
