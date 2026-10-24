import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.resolve(process.cwd(), 'public/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 12Rashi Vedic Astrological Wheel SVG Brand Icon
const getSvg = (size, isMaskable = false) => {
  const pad = isMaskable ? Math.round(size * 0.15) : 0;
  const innerSize = size - pad * 2;
  const center = size / 2;
  const radius = innerSize / 2;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ea580c"/>
        <stop offset="50%" stop-color="#c2410c"/>
        <stop offset="100%" stop-color="#7c2d12"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>

    <!-- Background Base -->
    <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : Math.round(size * 0.22)}" fill="url(#bgGrad)" />

    <!-- Sacred Vedic Chakra Pattern -->
    <circle cx="${center}" cy="${center}" r="${radius * 0.88}" stroke="url(#goldGrad)" stroke-width="${Math.max(2, Math.round(size * 0.015))}" fill="none" opacity="0.6"/>
    <circle cx="${center}" cy="${center}" r="${radius * 0.72}" stroke="#fed7aa" stroke-width="${Math.max(1, Math.round(size * 0.008))}" stroke-dasharray="4,4" fill="none" opacity="0.7"/>

    <!-- 12 Radiating Rays (Representing 12 Rashis / Zodiacs) -->
    <g transform="translate(${center}, ${center})">
      ${Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30);
        return `<line x1="0" y1="-${radius * 0.65}" x2="0" y2="-${radius * 0.85}" stroke="url(#goldGrad)" stroke-width="${Math.max(2, Math.round(size * 0.015))}" transform="rotate(${angle})" stroke-linecap="round"/>`;
      }).join('\n')}
    </g>

    <!-- Central Inner Jewel -->
    <circle cx="${center}" cy="${center}" r="${radius * 0.45}" fill="#431407" stroke="url(#goldGrad)" stroke-width="${Math.max(2, Math.round(size * 0.02))}"/>

    <!-- 12R Emblem / Sacred Jyotish Motif -->
    <text x="${center}" y="${center + Math.round(size * 0.08)}" font-family="'Cinzel', serif, system-ui" font-size="${Math.round(size * 0.26)}" font-weight="900" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="-1">12R</text>
  </svg>
  `;
};

async function buildIcons() {
  console.log('Generating crisp Android & Google Play app icons...');

  // 192x192 Standard
  await sharp(Buffer.from(getSvg(192)))
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-192.png'));

  // 512x512 Standard (Google Play Store Hi-Res Icon requirement)
  await sharp(Buffer.from(getSvg(512)))
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-512.png'));

  // 512x512 Maskable (Android 12/13/14 Adaptive Squircle Icon)
  await sharp(Buffer.from(getSvg(512, true)))
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-maskable-512.png'));

  // 180x180 Apple Touch Icon
  await sharp(Buffer.from(getSvg(180)))
    .png()
    .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

  console.log('All icons generated successfully in public/icons/');
}

buildIcons().catch(console.error);
