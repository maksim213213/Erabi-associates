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
    anchor = 'middle', tracking = 0,
  } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${tracking}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
};

const pins = [
  {
    filename: 'pin-best-korean-cleansers-v2-erabi.png',
    headline: [
      { value: 'CLEANSING BALM', size: 57 },
      { value: 'OR CLEANSING OIL?', size: 55 },
    ],
    subtitle: 'TWO FIRST-STEP PICKS FOR SPF + MAKEUP',
    cta: 'Build your double cleanse',
    ctaDetail: 'READ ALL 4 CLEANSER PICKS →',
    products: [
      {
        file: 'banila-co-clean-it-zero.webp', label: 'MELTS SPF + MAKEUP', name: 'CLEAN IT ZERO BALM',
        crop: { left: 120, top: 250, width: 1010, height: 850 },
        width: 320, height: 300, top: 650,
      },
      {
        file: 'anua-cleansing-oil.webp', label: 'LIGHTWEIGHT OIL CLEANSE', name: 'ANUA HEARTLEAF OIL',
        crop: { left: 300, top: 100, width: 650, height: 1120 },
        width: 250, height: 400, top: 590,
      },
    ],
  },
  {
    filename: 'pin-best-korean-cleansers-v3-erabi.png',
    headline: [
      { value: 'OILY SKIN?', size: 64 },
      { value: 'BREAKOUT-PRONE?', size: 57 },
    ],
    subtitle: 'FIND A CLEANSER THAT FITS YOUR ROUTINE',
    cta: 'Find your cleanser',
    ctaDetail: 'SEE THE FULL K-BEAUTY GUIDE →',
    products: [
      {
        file: 'cosrx-low-ph-cleanser.webp', label: 'DAILY LOW-PH GEL', name: 'COSRX LOW PH',
        crop: { left: 280, top: 100, width: 694, height: 1100 },
        width: 270, height: 400, top: 590,
      },
      {
        file: 'some-by-mi-aha-bha-pha-foam.webp', label: 'EXFOLIATING FOAM', name: 'SOME BY MI MIRACLE FOAM',
        crop: { left: 240, top: 20, width: 780, height: 1214 },
        width: 270, height: 400, top: 590,
      },
    ],
  },
];

for (const pin of pins) {
  const lefts = [87, 535];
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><filter id="shadow" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#7f6c51" flood-opacity=".12"/></filter></defs>
    <rect width="1000" height="1500" fill="#fbf2df"/>
    <circle cx="903" cy="257" r="184" fill="#e3efeb" opacity=".93"/>
    <circle cx="80" cy="1320" r="194" fill="#f8ded5" opacity=".88"/>
    <circle cx="846" cy="1200" r="224" fill="#eef1e7" opacity=".72"/>
    <rect x="22" y="22" width="956" height="1456" fill="none" stroke="#29231f" stroke-width="4"/>
    <rect x="39" y="39" width="922" height="1422" fill="none" stroke="#dc593a" stroke-width="2"/>
    <rect x="76" y="76" width="64" height="64" rx="10" fill="#d95031"/>
    ${text(108, 120, '選', { size: 35, fill: '#fffdf6', weight: 700, family: 'Noto Sans CJK JP, Noto Sans JP, Arial' })}
    ${text(156, 124, 'Erabi', { size: 43, weight: 700, family: 'Georgia, serif', anchor: 'start' })}
    ${text(925, 118, 'えらび', { size: 27, fill: '#83796b', family: 'Noto Sans CJK JP, Noto Sans JP, Arial', anchor: 'end' })}
    ${text(500, 225, 'K-BEAUTY CLEANSER GUIDE', { size: 20, fill: '#d15031', weight: 700, tracking: 3.2 })}
    <rect x="454" y="253" width="92" height="4" fill="#d15031"/>
    ${pin.headline.map((line, index) => text(500, 333 + index * 77, line.value, { size: line.size, weight: 700, family: 'Georgia, serif' })).join('')}
    ${text(500, 477, pin.subtitle, { size: 18, fill: '#74685d', weight: 700, tracking: 1.9 })}
    ${pin.products.map((product, index) => `<rect x="${lefts[index]}" y="555" width="378" height="485" rx="22" fill="#fffdf8" stroke="#d4bea0" stroke-width="2" filter="url(#shadow)"/>
      ${text(lefts[index] + 189, 1088, product.label, { size: 17, fill: '#cf5031', weight: 700, tracking: .9 })}
      ${text(lefts[index] + 189, 1128, product.name, { size: 18, fill: '#403730', weight: 700, tracking: .7 })}`).join('')}
    <rect x="112" y="1192" width="776" height="146" rx="19" fill="#334b2d"/>
    ${text(500, 1254, pin.cta, { size: 38, fill: '#fff9ec', weight: 700, family: 'Georgia, serif' })}
    ${text(500, 1300, pin.ctaDetail, { size: 17, fill: '#e1e8d7', weight: 700, tracking: 1.8 })}
    ${text(500, 1400, '4 PICKS · DOUBLE CLEANSE · LOW-PH · OILY SKIN', { size: 16, fill: '#766b5e', weight: 700, tracking: 1.5 })}
  </svg>`);

  const products = await Promise.all(pin.products.map(async (product, index) => ({
    input: await sharp(path.join(root, 'public/img/products', product.file))
      .extract(product.crop)
      .resize(product.width, product.height, { fit: 'cover' })
      .png().toBuffer(),
    left: lefts[index] + Math.round((378 - product.width) / 2),
    top: product.top,
  })));

  const output = path.join(exportDir, pin.filename);
  await sharp(svg).composite(products).png().toFile(output);
  const metadata = await sharp(output).metadata();
  console.log(`${output} (${metadata.width}×${metadata.height})`);
}
