import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

const factoryImages = [
  {
    source: 'https://oremachinery.com/wp-content/uploads/2017/09/200-tph-trommel-screen28.jpg',
    output: 'public/images/hero-gravity-plant.webp',
    width: 1400,
    height: 1000,
    quality: 78,
    position: 'centre',
    treatment: 'hero',
  },
  {
    source: 'https://oremachinery.com/wp-content/uploads/2017/09/200-tph-trommel-screen28.jpg',
    output: 'public/images/factory/gold-trommel-workshop.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    treatment: 'gallery',
  },
  {
    source: 'https://oremachinery.com/wp-content/uploads/2017/09/rock-gold-plant-3.jpg',
    output: 'public/images/factory/rock-gold-field-installation.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    treatment: 'gallery',
  },
  {
    source: 'https://oremachinery.com/wp-content/uploads/2017/09/JIG-MACHINE-30.jpg',
    output: 'public/images/factory/jig-machine-workshop.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    treatment: 'gallery',
  },
  {
    source: 'https://oremachinery.com/wp-content/uploads/2020/11/6S-shaking-table.jpg',
    output: 'public/images/factory/shaking-table-workshop.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    treatment: 'gallery',
  },
  {
    source: 'https://oremachinery.com/wp-content/uploads/2020/04/vibration-screen11.jpg',
    output: 'public/images/factory/screen-loading-delivery.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    treatment: 'gallery',
  },
];

const downloadDelayMs = 1200;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadImage(url, attempt = 1) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    if (attempt >= 3) {
      throw error;
    }

    console.warn(`Retrying ${url} after download error: ${error.message}`);
    await wait(downloadDelayMs * attempt);
    return downloadImage(url, attempt + 1);
  } finally {
    clearTimeout(timeout);
  }
}

function treatmentOverlays(width, height, treatment) {
  const warmthOpacity = treatment === 'hero' ? 0.11 : 0.075;
  const vignetteOpacity = treatment === 'hero' ? 0.28 : 0.18;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="48%" r="72%">
          <stop offset="56%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="${vignetteOpacity}"/>
        </radialGradient>
        <linearGradient id="warmth" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#d39a38" stop-opacity="${warmthOpacity}"/>
          <stop offset="54%" stop-color="#8a4c20" stop-opacity="${warmthOpacity * 0.65}"/>
          <stop offset="100%" stop-color="#191a19" stop-opacity="${warmthOpacity}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#warmth)"/>
      <rect width="100%" height="100%" fill="url(#vignette)"/>
    </svg>
  `);
}

async function beautifyImage(job) {
  const input = await downloadImage(job.source);
  const base = sharp(input)
    .rotate()
    .resize(job.width, job.height, {
      fit: 'cover',
      position: job.position,
    })
    .modulate({
      brightness: job.treatment === 'hero' ? 1.03 : 1.04,
      saturation: job.treatment === 'hero' ? 1.08 : 1.06,
    })
    .linear(job.treatment === 'hero' ? 1.07 : 1.055, job.treatment === 'hero' ? -5 : -4)
    .sharpen({
      sigma: 0.7,
      m1: 0.45,
      m2: 1.35,
    });

  await mkdir(dirname(job.output), { recursive: true });

  await base
    .composite([
      {
        input: treatmentOverlays(job.width, job.height, job.treatment),
        blend: 'overlay',
      },
    ])
    .webp({ quality: job.quality, effort: 5 })
    .toFile(job.output);

  const metadata = await sharp(job.output).metadata();
  console.log(`${job.output}\t${metadata.width}x${metadata.height}`);
}

for (const image of factoryImages) {
  await beautifyImage(image);
}
