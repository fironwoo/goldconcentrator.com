# Authorized Factory Images

Updated: 2026-06-23

The factory images used by GoldConcentrator.com come from a user-confirmed authorized factory source. The public repository should not expose the original source domain or original source URLs while the project remains confidential.

## Public Images Added To This Site

| Local file | Private source filename | Current use |
| --- | --- | --- |
| `/images/hero-gravity-plant.webp` | `mobile-trommel-screen-23.jpg` | Homepage hero background, cropped to avoid people and source identifiers |
| `/images/factory/gold-trommel-workshop.webp` | `mobile-trommel-screen-23.jpg` | Manufacturing page factory gallery, cropped equipment detail |
| `/images/factory/rock-gold-field-installation.webp` | `rotary-scrubber-15.jpg` | Manufacturing page factory gallery, cropped drive/support detail |
| `/images/factory/jig-machine-workshop.webp` | `jig-machine-clean.jpg` | Manufacturing page factory gallery, cropped jig detail |
| `/images/factory/shaking-table-workshop.webp` | `rotary-scrubber-15.jpg` | Reserved local image, cropped equipment detail |
| `/images/factory/screen-loading-delivery.webp` | `mobile-trommel-screen-23.jpg` | Manufacturing page factory gallery, cropped mobile plant detail |

## Beautification And Desensitization Workflow

Images are processed locally with `scripts/beautify-authorized-factory-images.mjs`.

Run:

```bash
npm run beautify:factory-images
```

The script reads private source files from `private/factory-sources/`, crops them to site-ready sizes, applies a consistent GoldConcentrator.com treatment and writes optimized WebP files. The current launch set prefers clean crop areas over heavy watermark removal, so public images do not show obvious people, watermarks, company text or visible identifiers.

The treatment is intentionally conservative: exposure, contrast, saturation, sharpening, warm grading, subtle vignette and local patching. It should not invent customer scenes or unsupported project results.

## Confidentiality Rules

- Keep original source images under `private/factory-sources/`; this folder is ignored by Git.
- Do not publish the original source domain or original source URLs in current editable files.
- Do not use customer names, exact project countries, exact throughput or recovery claims unless separately verified.
- Public image captions may say factory workshop, equipment preparation, field installation reference or authorized factory photo.
