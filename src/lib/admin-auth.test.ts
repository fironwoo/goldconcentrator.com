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
});
