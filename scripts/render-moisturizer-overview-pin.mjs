import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exportDir = path.resolve(root, '..', 'exports', 'pinterest');
await mkdir(exportDir, { recursive: true });
const width = 1000;
const height = 1500;
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, value, options = {}) => {
  const {
    size = 24, fill = '#29231f', weight = 400, family = 'Arial, sans-serif',
    anchor = 'start', tracking = 0,
  } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${tracking}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
};

const cards = [
  {
    x: 70, file: 'illiyoon-ceramide-ato.webp', label: 'ILLIYOON', skin: 'DRY + SENSITIVE',
    crop: { left: 320, top: 60, width: 614, height: 1150 }, width: 160, height: 300, top: 566,
  },
  {
    x: 290, file: 'cosrx-snail-92-cream.webp', label: 'COSRX', skin: 'NORMAL + COMBO',
    crop: { left: 180, top: 150, width: 900, height: 1030 }, width: 170, height: 270, top: 586,
  },
  {
    x: 510, file: 'belif-aqua-bomb.webp', label: 'belif', skin: 'OILY + COMBO',
    crop: { left: 120, top: 250, width: 1010, height: 850 }, width: 170, height: 230, top: 616,
  },
  {
    x: 730, file: 'beauty-of-joseon-dynasty-cream.webp', label: 'BEAUTY OF JOSEON', skin: 'DRY + GLOWY',
    crop: { left: 300, top: 570, width: 654, height: 600 }, width: 170, height: 230, top: 616,
  },
];

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="13" flood-color="#6d604c" flood-opacity=".13"/></filter>
  </defs>
  <rect width="1000" height="1500" fill="#f9f2e6"/>
  <circle cx="885" cy="96" r="220" fill="#edf1df" opacity=".9"/>
  <circle cx="115" cy="1400" r="250" fill="#fae4d6" opacity=".78"/>
  ${text(120, 108, 'ERABI / MOISTURIZER GUIDE', { size: 17, fill: '#674d35', weight: 700, tracking: 4 })}
  ${text(120, 220, '4 KOREAN', { size: 70, weight: 700, family: 'Georgia, serif' })}
  ${text(120, 295, 'MOISTURIZERS', { size: 70, weight: 700, family: 'Georgia, serif' })}
  ${text(120, 350, 'FOR EVERY SKIN TYPE', { size: 22, fill: '#d14e31', weight: 700, tracking: 1.6 })}
  ${text(120, 392, 'LIGHT GELS, BARRIER CREAMS + GLOWY PICKS', { size: 16, fill: '#756b60', weight: 700, tracking: 1.5 })}
  <path d="M0 480 C200 423 390 514 590 470 C760 433 885 471 1000 448" fill="none" stroke="#d9b98f" stroke-width="2" opacity=".75"/>
  ${cards.map((card) => `<rect x="${card.x}" y="520" width="200" height="420" rx="18" fill="#fffdf8" stroke="#d9c6a9" stroke-width="2" filter="url(#shadow)"/>
    ${text(card.x + 100, 988, card.label, { size: card.label.length > 10 ? 14 : 17, fill: '#352f2a', weight: 700, anchor: 'middle', tracking: .7 })}
    ${text(card.x + 100, 1024, card.skin, { size: 13, fill: '#d14e31', weight: 700, anchor: 'middle', tracking: .7 })}`).join('')}
  ${text(500, 1094, 'TEXTURE · FINISH · SKIN TYPE · BEST FOR', { size: 15, fill: '#756b60', weight: 700, anchor: 'middle', tracking: 1.7 })}
  <rect x="120" y="1175" width="760" height="165" rx="18" fill="#334b2d"/>
  ${text(500, 1246, 'Find your moisturizer match', { size: 39, fill: '#fff9ec', weight: 700, family: 'Georgia, serif', anchor: 'middle' })}
  ${text(500, 1294, 'READ THE FULL GUIDE →', { size: 17, fill: '#e1e8d7', weight: 700, anchor: 'middle', tracking: 2.2 })}
  ${text(500, 1430, 'K-BEAUTY MOISTURIZERS, EXPLAINED', { size: 15, fill: '#756b60', weight: 700, anchor: 'middle', tracking: 1.8 })}
</svg>`);

const products = await Promise.all(cards.map(async (card) => ({
  input: await sharp(path.join(root, 'public/img/products', card.file))
    .extract(card.crop)
    .resize(card.width, card.height, { fit: 'contain', background: '#fbf7ee' })
    .png().toBuffer(),
  left: card.x + Math.round((200 - card.width) / 2),
  top: card.top,
})));

const output = path.join(exportDir, 'pin-best-korean-moisturizers-v4-overview.png');
await sharp(svg).composite(products).png().toFile(output);
const metadata = await sharp(output).metadata();
console.log(`${output} (${metadata.width}×${metadata.height})`);
