/**
 * Generate the on-brand app icon bundle from public/assets/droplet.png:
 *   public/favicon.ico         — multi-res (16, 32, 48)
 *   public/apple-touch-icon.png — 180×180
 *   public/icon-192.png         — Android PWA
 *   public/icon-512.png         — Android PWA + splash
 *
 * Composition for every icon:
 *   - solid #ffffff background (NOT transparent — looks clean on any
 *     home-screen or dark-mode browser chrome)
 *   - black droplet centered horizontally and vertically
 *   - droplet height = 62% of canvas dimension; width derived from
 *     the source's native aspect ratio (218×436 → 1:2)
 *
 * Re-run any time the source droplet changes.
 */
import sharp from "sharp";
import toIco from "to-ico";
import { writeFile, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const publicDir = resolve(root, "public");
const dropletPath = resolve(publicDir, "assets/droplet.png");

const dropletBuf = await readFile(dropletPath);
const meta = await sharp(dropletBuf).metadata();
const aspect = meta.width / meta.height; // width / height (≈ 0.5 for the droplet)

async function makeIcon(size) {
  const dropletH = Math.round(size * 0.62);
  const dropletW = Math.max(1, Math.round(dropletH * aspect));

  const resizedDroplet = await sharp(dropletBuf)
    .resize(dropletW, dropletH, { fit: "fill" })
    .png()
    .toBuffer();

  const x = Math.round((size - dropletW) / 2);
  const y = Math.round((size - dropletH) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resizedDroplet, left: x, top: y }])
    .png()
    .toBuffer();
}

// Stand-alone PNGs
const targets = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];
for (const t of targets) {
  const buf = await makeIcon(t.size);
  await writeFile(resolve(publicDir, t.name), buf);
}

// Multi-res ICO (16, 32, 48)
const ico = await toIco([
  await makeIcon(16),
  await makeIcon(32),
  await makeIcon(48),
]);
await writeFile(resolve(publicDir, "favicon.ico"), ico);

// Report
const all = ["favicon.ico", ...targets.map((t) => t.name)];
for (const f of all) {
  const s = await stat(resolve(publicDir, f));
  console.log(`  ${f.padEnd(22)} ${(s.size / 1024).toFixed(1).padStart(5)} kB`);
}
