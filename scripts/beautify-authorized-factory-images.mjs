import { access, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

const privateSourceDir = 'private/factory-sources';

const factoryImages = [
  {
    source: `${privateSourceDir}/mobile-trommel-screen-23.jpg`,
    output: 'public/images/hero-gravity-plant.webp',
    width: 1400,
    height: 1000,
    quality: 78,
    position: 'centre',
    sourceCrop: { left: 120, top: 45, width: 600, height: 470 },
    treatment: 'hero',
  },
  {
    source: `${privateSourceDir}/mobile-trommel-screen-23.jpg`,
    output: 'public/images/factory/gold-trommel-workshop.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    sourceCrop: { left: 265, top: 70, width: 435, height: 360 },
    treatment: 'gallery',
  },
  {
    source: `${privateSourceDir}/rotary-scrubber-15.jpg`,
    output: 'public/images/factory/rock-gold-field-installation.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    sourceCrop: { left: 900, top: 520, width: 520, height: 420 },
    treatment: 'gallery',
  },
  {
    source: `${privateSourceDir}/jig-machine-clean.jpg`,
    output: 'public/images/factory/jig-machine-workshop.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    sourceCrop: { left: 520, top: 590, width: 980, height: 680 },
    treatment: 'gallery',
  },
  {
    source: `${privateSourceDir}/rotary-scrubber-15.jpg`,
    output: 'public/images/factory/shaking-table-workshop.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    sourceCrop: { left: 900, top: 520, width: 520, height: 420 },
    treatment: 'gallery',
  },
  {
    source: `${privateSourceDir}/mobile-trommel-screen-23.jpg`,
    output: 'public/images/factory/screen-loading-delivery.webp',
    width: 980,
    height: 680,
    quality: 76,
    position: 'centre',
    sourceCrop: { left: 190, top: 235, width: 520, height: 275 },
    treatment: 'gallery',
  },
];

function clampRedaction(redaction, width, height) {
  const target = {
    left: Math.max(0, Math.min(redaction.target.left, width - 1)),
    top: Math.max(0, Math.min(redaction.target.top, height - 1)),
    width: Math.min(redaction.target.width, width - redaction.target.left),
    height: Math.min(redaction.target.height, height - redaction.target.top),
  };
  const source = {
    left: Math.max(0, Math.min(redaction.source.left, width - target.width)),
    top: Math.max(0, Math.min(redaction.source.top, height - target.height)),
  };

  return { ...redaction, target, source };
}

function treatmentOverlays(width, height, treatment) {
  const warmthOpacity = treatment === 'hero' ? 0.12 : 0.085;
  const vignetteOpacity = treatment === 'hero' ? 0.3 : 0.2;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="48%" r="72%">
          <stop offset="54%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="${vignetteOpacity}"/>
        </radialGradient>
        <linearGradient id="warmth" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#d39a38" stop-opacity="${warmthOpacity}"/>
          <stop offset="54%" stop-color="#8a4c20" stop-opacity="${warmthOpacity * 0.68}"/>
          <stop offset="100%" stop-color="#191a19" stop-opacity="${warmthOpacity}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#warmth)"/>
      <rect width="100%" height="100%" fill="url(#vignette)"/>
    </svg>
  `);
}

function coverOverlay({ width, height, opacity }) {
  const fill = `<rect width="${width}" height="${height}" fill="#191a19" opacity="${opacity}"/>`;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${fill}
    </svg>
  `);
}

async function redactionPatch(baseBuffer, redaction, width, height) {
  const { target, source, blur = 1.5 } = clampRedaction(redaction, width, height);
  const input = sharp(baseBuffer).extract({
    left: Math.round(source.left),
    top: Math.round(source.top),
    width: Math.round(target.width),
    height: Math.round(target.height),
  });

  return {
    input: await input.blur(blur).png().toBuffer(),
    left: Math.round(target.left),
    top: Math.round(target.top),
  };
}

async function assertPrivateSourceExists(source) {
  try {
    await access(source);
  } catch {
    throw new Error(`Missing private source image: ${source}`);
  }
}

async function beautifyImage(job) {
  await assertPrivateSourceExists(job.source);

  let sourcePipeline = sharp(job.source).rotate();

  if (job.sourceCrop) {
    sourcePipeline = sourcePipeline.extract(job.sourceCrop);
  }

  const baseBuffer = await sourcePipeline
    .resize(job.width, job.height, {
      fit: 'cover',
      position: job.position,
    })
    .modulate({
      brightness: job.treatment === 'hero' ? 1.035 : 1.045,
      saturation: job.treatment === 'hero' ? 1.08 : 1.055,
    })
    .linear(job.treatment === 'hero' ? 1.065 : 1.05, job.treatment === 'hero' ? -5 : -4)
    .sharpen({
      sigma: 0.7,
      m1: 0.45,
      m2: 1.35,
    })
    .png()
    .toBuffer();

  const redactionComposites = [];

  for (const redaction of job.redactions ?? []) {
    redactionComposites.push(await redactionPatch(baseBuffer, redaction, job.width, job.height));
  }

  for (const cover of job.covers ?? []) {
    redactionComposites.push({
      input: coverOverlay(cover),
      left: Math.round(cover.left),
      top: Math.round(cover.top),
    });
  }

  await mkdir(dirname(job.output), { recursive: true });

  await sharp(baseBuffer)
    .composite([
      ...redactionComposites,
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
