import sharp from "sharp";
import { readFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const dropletPath = resolve(root, "public/assets/droplet.png");
const outDir = resolve(root, "public/og");
const outPath = resolve(outDir, "og-image.png");

const dropletBuf = await readFile(dropletPath);
const meta = await sharp(dropletBuf).metadata();

const CANVAS_W = 1200;
const CANVAS_H = 630;
const dropletH = 160;
const dropletW = Math.round((meta.width / meta.height) * dropletH);
const dropletX = Math.round((CANVAS_W - dropletW) / 2);
const dropletY = 150;

const dropletDataUrl = `data:image/png;base64,${dropletBuf.toString("base64")}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="#ffffff"/>
  <image x="${dropletX}" y="${dropletY}" width="${dropletW}" height="${dropletH}" href="${dropletDataUrl}" xlink:href="${dropletDataUrl}"/>
  <text x="600" y="400" text-anchor="middle" font-family="'Times New Roman', Times, serif" font-size="84" font-weight="400" fill="#0a0a0a" letter-spacing="16.8">BLACKRAIN</text>
  <text x="600" y="460" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#a1a1aa" letter-spacing="7.7">AI AUTOMATION CONSULTANCY</text>
</svg>`;

await mkdir(outDir, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(outPath);

const outMeta = await sharp(outPath).metadata();
const fileSize = (await stat(outPath)).size;
console.log(`wrote ${outPath}`);
console.log(`  dimensions: ${outMeta.width}×${outMeta.height}`);
console.log(`  file size:  ${(fileSize / 1024).toFixed(1)} kB`);
console.log(`  droplet:    ${dropletW}×${dropletH} at (${dropletX}, ${dropletY}) — source ${meta.width}×${meta.height}`);
