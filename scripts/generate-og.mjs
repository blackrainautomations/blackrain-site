/**
 * Generate the 1200×630 OG image as a TRUE proportional copy of the live
 * site's hero card (the BLACKRAIN business-card screen).
 *
 * Proportions are derived directly from src/styles.css and scaled uniformly:
 *
 *   live site (at desktop, body font-size 17px):
 *     .hero-droplet               height:    58px      margin-bottom: 25.5px  (1.5rem)
 *     .hero-card .wordmark        font-size: 22.95px   margin-bottom: 14.45px (0.85rem)
 *                                 letter-spacing: 0.32em
 *     .eyebrow                    font-size: 12.24px   margin: 0
 *                                 letter-spacing: 0.2em
 *
 *   OG scale factor: 2.4×
 *     droplet height:  140  | wordmark size:  55  | eyebrow size:  29
 *     gap below drop:   61  | gap below word:  35
 *     wordmark tracking: 17.6 (55 × 0.32em)  | eyebrow tracking: 5.8 (29 × 0.2em)
 *
 * The subtitle ends up visually wider than the wordmark — same as on the live
 * site — because it has 24 characters vs the wordmark's 9, not because of
 * heavier tracking. Character count drives apparent width.
 */
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Both .wordmark and .eyebrow on the live site inherit body's DM Sans and set
// font-weight: 500. One file covers both.
const dmSans = await readFile(resolve(here, "fonts/DMSans-Medium.ttf"));
const droplet = await readFile(resolve(root, "public/assets/droplet.png"));
const dropletDataUrl = `data:image/png;base64,${droplet.toString("base64")}`;

// Droplet source is 218×436 (1:2 aspect). Width derived from target height
// (140) to preserve the .hero-droplet { height: 58px; width: auto } behaviour.
const DROPLET_H = 140;
const DROPLET_W = 70;

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
          width: DROPLET_W,
          height: DROPLET_H,
          style: { marginBottom: 61 },
        },
      },
      {
        type: "div",
        props: {
          style: {
            fontFamily: "DM Sans",
            fontWeight: 500,
            fontSize: 55,
            color: "#0a0a0a",
            letterSpacing: 17.6,
            lineHeight: 1,
            marginBottom: 35,
            // .wordmark applies padding-left: 0.32em "to nudge back for optical
            // centering" against trailing letter-spacing; mirror it here.
            paddingLeft: 17.6,
          },
          children: "BLACKRAIN",
        },
      },
      {
        type: "div",
        props: {
          style: {
            fontFamily: "DM Sans",
            fontWeight: 500,
            fontSize: 29,
            color: "#a1a1aa",
            letterSpacing: 5.8,
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
    { name: "DM Sans", data: dmSans, weight: 500, style: "normal" },
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
