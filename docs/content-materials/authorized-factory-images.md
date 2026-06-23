# Authorized Factory Images

Updated: 2026-06-23

The user confirmed that `oremachinery.com` is the factory / authorized factory image source for GoldConcentrator.com. Images copied from this domain may be used as factory, equipment, delivery or installation materials. Do not convert image use into unsupported customer case claims.

## Images Added To This Site

| Local file | Source URL | Current use |
| --- | --- | --- |
| `/images/hero-gravity-plant.webp` | `https://oremachinery.com/wp-content/uploads/2017/09/200-tph-trommel-screen28.jpg` | Homepage hero background |
| `/images/factory/gold-trommel-workshop.webp` | `https://oremachinery.com/wp-content/uploads/2017/09/200-tph-trommel-screen28.jpg` | Manufacturing page factory gallery |
| `/images/factory/rock-gold-field-installation.webp` | `https://oremachinery.com/wp-content/uploads/2017/09/rock-gold-plant-3.jpg` | Manufacturing page factory gallery |
| `/images/factory/jig-machine-workshop.webp` | `https://oremachinery.com/wp-content/uploads/2017/09/JIG-MACHINE-30.jpg` | Manufacturing page factory gallery |
| `/images/factory/shaking-table-workshop.webp` | `https://oremachinery.com/wp-content/uploads/2020/11/6S-shaking-table.jpg` | Reserved local image |
| `/images/factory/screen-loading-delivery.webp` | `https://oremachinery.com/wp-content/uploads/2020/04/vibration-screen11.jpg` | Manufacturing page factory gallery |

## Beautification Workflow

Images are beautified locally with `scripts/beautify-authorized-factory-images.mjs`.

Run:

```bash
npm run beautify:factory-images
```

The script downloads the authorized originals, crops them to site-ready sizes, applies a consistent GoldConcentrator.com treatment and writes optimized WebP files. The treatment is intentionally light: exposure, contrast, saturation, sharpening, warm grading and a subtle vignette. It does not remove watermarks, change equipment, replace backgrounds or invent project scenes.

## Safe Caption Rules

- Use: factory workshop, equipment prepared for delivery, field installation reference, authorized factory photo.
- Avoid: customer success, guaranteed recovery, exact throughput, exact country, exact ore grade, unless separately verified.
- Keep GoldConcentrator.com positioned as process-led. Images support trust; they should not turn the site into an equipment catalog.
