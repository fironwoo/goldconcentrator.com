import { describe, expect, it } from 'vitest';
import { getPublicVideos, parseYouTubeVideoId } from './videos';

describe('video utilities', () => {
  it('parses standard, short and Shorts YouTube URLs', () => {
    expect(parseYouTubeVideoId('https://www.youtube.com/watch?v=abcDEF12345')).toBe(
      'abcDEF12345',
    );
    expect(parseYouTubeVideoId('https://youtu.be/abcDEF12345')).toBe('abcDEF12345');
    expect(parseYouTubeVideoId('https://www.youtube.com/shorts/abcDEF12345')).toBe(
      'abcDEF12345',
    );
  });

  it('rejects non-YouTube and malformed URLs', () => {
    expect(parseYouTubeVideoId('https://example.com/watch?v=abcDEF12345')).toBeNull();
    expect(parseYouTubeVideoId('https://www.youtube.com/')).toBeNull();
    expect(parseYouTubeVideoId('not a URL')).toBeNull();
  });

  it('excludes drafts and sorts newest first without mutating the input', () => {
    const videos = [
      { data: { draft: false, publishedAt: new Date('2026-01-01') } },
      { data: { draft: true, publishedAt: new Date('2026-03-01') } },
      { data: { draft: false, publishedAt: new Date('2026-02-01') } },
    ];

    const publicVideos = getPublicVideos(videos);

    expect(publicVideos.map((video) => video.data.publishedAt.toISOString())).toEqual([
      '2026-02-01T00:00:00.000Z',
      '2026-01-01T00:00:00.000Z',
    ]);
    expect(videos[0].data.publishedAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });
});
