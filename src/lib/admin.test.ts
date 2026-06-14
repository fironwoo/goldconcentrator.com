import { describe, expect, it } from 'vitest';
import { CMS_READY_SELECTOR } from './admin';

describe('CMS loading state', () => {
  it('recognizes the Sveltia application shell', () => {
    expect(CMS_READY_SELECTOR.split(',').map((selector) => selector.trim())).toContain('.app-shell');
  });
});
