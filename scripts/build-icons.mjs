// アイコンと棚の表紙。絵素材は使わず、図形と数字だけをコードで描く（ChatGPT 製ではない）。
// ChatGPT が使えるようになったら、assets-src/ に絵を置いて差し替える（TODO は Vault の Projects/torikko.md）。
//   node scripts/build-icons.mjs [--cover=出力パス]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f6f5ef"/>
  <rect x="34" y="26" width="132" height="40" rx="10" fill="#e9e2fa" stroke="#7f63c9" stroke-width="5"/>
  <text x="100" y="56" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#7f63c9" text-anchor="middle">9</text>
  <rect x="34" y="80" width="132" height="40" rx="10" fill="#ffffff" stroke="#e3dfd6" stroke-width="4"/>
  <text x="100" y="110" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#b23c3c" text-anchor="middle">-4</text>
  <rect x="34" y="134" width="132" height="40" rx="10" fill="#fbe3dc" stroke="#e0674e" stroke-width="5"/>
  <text x="100" y="164" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#e0674e" text-anchor="middle">7</text>
</svg>`;
for (const [size, name] of [[192, 'icon-192.png'], [512, 'icon-512.png'], [180, 'apple-touch-icon.png'], [64, 'favicon.png']]) {
  await sharp(Buffer.from(svg(size))).png({ compressionLevel: 9 }).toFile(`public/${name}`);
}
const cover = process.argv.find((a) => a.startsWith('--cover='));
if (cover) await sharp(Buffer.from(svg(200))).webp({ quality: 82 }).toFile(cover.slice(8));
console.log('icons done');
