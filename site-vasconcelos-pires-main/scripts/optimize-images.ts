import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SRC = 'public/photos/_src';
const OUT = 'public/photos/partners';
const SIZES = [
  { w: 600, suffix: '' },
  { w: 1200, suffix: '@2x' },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  let files: string[];
  try {
    files = await fs.readdir(SRC);
  } catch {
    console.log('[optimize-images] No source directory yet — skipping. Drop portraits in public/photos/_src/ to enable.');
    return;
  }
  if (files.length === 0) {
    console.log('[optimize-images] Source directory empty — skipping. Drop portraits in public/photos/_src/.');
    return;
  }
  for (const file of files) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const base = path.parse(file).name;
    for (const { w, suffix } of SIZES) {
      const pipeline = sharp(path.join(SRC, file))
        .resize(w, Math.round((w * 4) / 3), { fit: 'cover' })
        .grayscale();
      await pipeline.clone().webp({ quality: 80 }).toFile(path.join(OUT, `${base}${suffix}.webp`));
      await pipeline.clone().avif({ quality: 60 }).toFile(path.join(OUT, `${base}${suffix}.avif`));
    }
    console.log('[optimize-images] ✓', file);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
