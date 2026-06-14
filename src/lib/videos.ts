const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export const DEFAULT_VIDEO_DRAFT = true;

export function parseYouTubeVideoId(value: string): string | null {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  let candidate: string | null = null;

  if (hostname === 'youtu.be') {
    candidate = url.pathname.split('/').filter(Boolean)[0] ?? null;
  } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      candidate = url.searchParams.get('v');
    } else {
      const [route, id] = url.pathname.split('/').filter(Boolean);
      if (route === 'shorts') candidate = id ?? null;
    }
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

type VideoLike = {
  data: {
    draft: boolean;
    publishedAt: Date;
  };
};

export function getPublicVideos<T extends VideoLike>(videos: readonly T[]): T[] {
  return videos
    .filter((video) => !video.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
