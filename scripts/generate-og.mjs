/**
 * Generate the 1200×630 OG image as a direct copy of the site's business-card hero.
 * Uses Satori (JSX/CSS → SVG) + @resvg/resvg-js (SVG → PNG) with the real
 * Instrument Serif + Inter TTFs from scripts/fonts/ so the wordmark + subtitle
 * render exactly as on the live site, not in a Times/Arial fallback.
 *
 * Re-run download-fonts.mjs if you ever delete scripts/fonts/.
 */
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const instrumentSerif = await readFile(resolve(here, "fonts/InstrumentSerif-Regular.ttf"));
const inter = await readFile(resolve(here, "fonts/Inter-Regular.ttf"));
const droplet = await readFile(resolve(root, "public/assets/droplet.png"));
const dropletDataUrl = `data:image/png;base64,${droplet.toString("base64")}`;

const tree = {
  type: "div",
  props: {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      backgroundColor: "#ffffff",
    },
    children: [
      {
        type: "img",
        props: {
          src: dropletDataUrl,
          width: 80,
          height: 160,
          style: { marginBottom: 50 },
        },
      },
      {
        type: "div",
        props: {
          style: {
            fontFamily: "Instrument Serif",
            fontSize: 84,
            color: "#0a0a0a",
            letterSpacing: 16.8,
            lineHeight: 1,
            marginBottom: 22,
          },
          children: "BLACKRAIN",
        },
      },
      {
        type: "div",
        props: {
          style: {
            fontFamily: "Inter",
            fontSize: 22,
            color: "#a1a1aa",
            letterSpacing: 7.7,
            lineHeight: 1,
          },
          children: "AI AUTOMATION CONSULTANCY",
        },
      },
    ],
  },
};

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    { name: "Instrument Serif", data: instrumentSerif, weight: 400, style: "normal" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
  ],
});

const resvg = new Resvg(svg, {
  background: "#ffffff",
  fitTo: { mode: "width", value: 1200 },
});
const pngBuf = resvg.render().asPng();

const outDir = resolve(root, "public/og");
const outPath = resolve(outDir, "og-image.png");
await mkdir(outDir, { recursive: true });
await writeFile(outPath, pngBuf);

const fileSize = (await stat(outPath)).size;
console.log(`wrote ${outPath}`);
console.log(`  dimensions: 1200×630`);
console.log(`  file size:  ${(fileSize / 1024).toFixed(1)} kB`);
