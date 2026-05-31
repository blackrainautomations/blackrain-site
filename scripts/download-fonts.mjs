/**
 * Download Instrument Serif Regular + Inter Regular as TTFs into scripts/fonts/.
 *
 * Uses the Google Fonts CSS2 endpoint with an ancient User-Agent so Google
 * serves us TTF URLs instead of WOFF2 (Satori does not support WOFF2).
 * Run once after install; the TTFs are then checked into git.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fontsDir = resolve(here, "fonts");

async function downloadTtf(family, weight = 400) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/4.0" } }).then((r) => r.text());
  const m = css.match(/url\((https:\/\/[^)]+?\.(?:ttf|otf))\)/);
  if (!m) throw new Error(`No TTF/OTF URL in Google Fonts CSS for ${family}\nCSS body:\n${css}`);
  const fontUrl = m[1];
  const buf = await fetch(fontUrl).then((r) => r.arrayBuffer());
  return { buf: Buffer.from(buf), url: fontUrl };
}

await mkdir(fontsDir, { recursive: true });

// Both the BLACKRAIN wordmark and the AI AUTOMATION CONSULTANCY eyebrow on
// the live site inherit from `body { font-family: "DM Sans" }` with
// `font-weight: 500` set on both .wordmark and .eyebrow rules. One file.
const targets = [
  { family: "DM Sans", weight: 500, file: "DMSans-Medium.ttf" },
];

for (const t of targets) {
  process.stdout.write(`fetching ${t.family} ${t.weight}... `);
  const { buf, url } = await downloadTtf(t.family, t.weight);
  await writeFile(resolve(fontsDir, t.file), buf);
  console.log(`${(buf.length / 1024).toFixed(1)} kB`);
  console.log(`  source: ${url}`);
}
