import sharp from "sharp";
import { writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const appDir = path.join(__dirname, "..", "src", "app");
mkdirSync(publicDir, { recursive: true });

const iconSvg = readFileSync(path.join(appDir, "icon.svg"));

async function writePng(size, dir, outName) {
  const buffer = await sharp(iconSvg, { density: 384 }).resize(size, size).png().toBuffer();
  writeFileSync(path.join(dir, outName), buffer);
  return buffer;
}

// --- App icons (Next.js file-convention icons live in src/app/) ---
const icon32 = await writePng(32, appDir, "favicon-32.png");
await writePng(180, appDir, "apple-icon.png");
await writePng(192, publicDir, "icon-192.png");
await writePng(512, publicDir, "icon-512.png");

// --- favicon.ico (single 32x32 PNG payload, ICO container) ---
function buildIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image size
  entry.writeUInt32LE(header.length + entry.length, 12); // offset

  return Buffer.concat([header, entry, pngBuffer]);
}

writeFileSync(path.join(appDir, "favicon.ico"), buildIco(icon32, 32));
rmSync(path.join(appDir, "favicon-32.png"));

// --- site.webmanifest ---
const manifest = {
  name: "Quill",
  short_name: "Quill",
  description:
    "An AI content studio for generating, organizing, and reviewing on-brand marketing copy.",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  theme_color: "#0d9488",
  background_color: "#0e1512",
  display: "standalone",
  start_url: "/login",
};
writeFileSync(path.join(publicDir, "site.webmanifest"), JSON.stringify(manifest, null, 2));

// --- Open Graph image (1200x630) ---
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#0f2e2b"/>
    </linearGradient>
    <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="rgba(255,255,255,0.18)"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <g transform="translate(96, 96)">
    <rect width="72" height="72" rx="20" fill="white"/>
    <path
      d="M51.75 14.6L21.4 45C19.1 47.3 18 50.5 18.7 53.7C21.9 54.5 25.5 53.3 27.6 51.2L58.9 21.8C61.2 19.4 61.1 15.5 58.6 13.3C56.1 11.1 53.9 12.4 51.75 14.6Z"
      fill="#0d9488"
    />
    <path d="M23.6 42.3L30.4 49.1" stroke="white" stroke-width="2.9" stroke-linecap="round"/>
    <path d="M18.7 53.7C15.3 57.5 11.7 58.9 9 58" stroke="#0d9488" stroke-width="3.6" stroke-linecap="round"/>
  </g>

  <text x="96" y="260" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="white">Quill</text>
  <text x="98" y="322" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="rgba(255,255,255,0.82)">AI content, on brand, on demand</text>

  <g font-family="Arial, Helvetica, sans-serif" font-size="24" fill="rgba(255,255,255,0.92)">
    <g transform="translate(98, 400)">
      <circle cx="8" cy="-6" r="4" fill="#99f6e4"/>
      <text x="26" y="0">AI-powered generation, streamed live</text>
    </g>
    <g transform="translate(98, 448)">
      <circle cx="8" cy="-6" r="4" fill="#99f6e4"/>
      <text x="26" y="0">Organized by project, searchable history</text>
    </g>
    <g transform="translate(98, 496)">
      <circle cx="8" cy="-6" r="4" fill="#99f6e4"/>
      <text x="26" y="0">Analytics built in</text>
    </g>
  </g>
</svg>`;

const ogBuffer = await sharp(Buffer.from(ogSvg)).png().toBuffer();
writeFileSync(path.join(appDir, "opengraph-image.png"), ogBuffer);

console.log("Branding assets generated in src/app/ and public/.");
