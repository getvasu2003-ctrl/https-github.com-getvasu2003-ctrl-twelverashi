import sharp from 'sharp';
import fs from 'fs';

const width = 1024;
const height = 500;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Cosmic Radiant Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b0764" />
      <stop offset="35%" stop-color="#701a75" />
      <stop offset="70%" stop-color="#c2410c" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>

    <!-- Golden Text Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="30%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.18)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.08)" />
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Sacred Vedic Chakra Circles (Left & Right background accents) -->
  <g opacity="0.12" stroke="#fef08a" stroke-width="2" fill="none">
    <circle cx="120" cy="250" r="220" />
    <circle cx="120" cy="250" r="170" stroke-dasharray="8 8" />
    <circle cx="120" cy="250" r="110" />
    <circle cx="120" cy="250" r="60" stroke-dasharray="4 4" />

    <circle cx="920" cy="250" r="220" />
    <circle cx="920" cy="250" r="170" stroke-dasharray="8 8" />
    <circle cx="920" cy="250" r="110" />
    <circle cx="920" cy="250" r="60" stroke-dasharray="4 4" />
  </g>

  <!-- Subtle Constellation Stars -->
  <g fill="#fef08a" opacity="0.4">
    <circle cx="80" cy="90" r="2.5" />
    <circle cx="200" cy="60" r="3" />
    <circle cx="340" cy="110" r="2" />
    <circle cx="480" cy="50" r="2.5" />
    <circle cx="620" cy="80" r="3" />
    <circle cx="780" cy="60" r="2" />
    <circle cx="940" cy="100" r="3.5" />
    <circle cx="150" cy="420" r="2.5" />
    <circle cx="320" cy="440" r="3" />
    <circle cx="700" cy="430" r="2.5" />
    <circle cx="880" cy="410" r="3" />
  </g>

  <!-- Central Content Box -->
  <g filter="url(#softShadow)">
    <!-- Top Category Tag -->
    <g transform="translate(362, 50)">
      <rect width="300" height="36" rx="18" fill="url(#badgeGrad)" stroke="rgba(254, 240, 138, 0.4)" stroke-width="1.5" />
      <text x="150" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="2">
        ✦ VEDIC ASTROLOGY &amp; HOROSCOPE ✦
      </text>
    </g>

    <!-- Main Title: 12Rashi -->
    <text x="512" y="195" font-family="'Cinzel', Georgia, serif" font-size="94" font-weight="900" fill="url(#goldGrad)" text-anchor="middle" filter="url(#glow)" letter-spacing="2">
      12Rashi
    </text>

    <!-- Subtitle -->
    <text x="512" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#fed7aa" text-anchor="middle" letter-spacing="1.5">
      LIVE ASTROLOGY • JANAM KUNDLI • HOROSCOPE
    </text>

    <!-- Feature Pills -->
    <g transform="translate(182, 305)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="200" height="48" rx="24" fill="rgba(0, 0, 0, 0.35)" stroke="rgba(254, 240, 138, 0.3)" stroke-width="1.5" />
        <text x="100" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">
          🕉️ Verified Astrologers
        </text>
      </g>

      <!-- Pill 2 -->
      <g transform="translate(230, 0)">
        <rect width="200" height="48" rx="24" fill="rgba(0, 0, 0, 0.35)" stroke="rgba(254, 240, 138, 0.3)" stroke-width="1.5" />
        <text x="100" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">
          ⚡ 24/7 AI Consultations
        </text>
      </g>

      <!-- Pill 3 -->
      <g transform="translate(460, 0)">
        <rect width="200" height="48" rx="24" fill="rgba(0, 0, 0, 0.35)" stroke="rgba(254, 240, 138, 0.3)" stroke-width="1.5" />
        <text x="100" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">
          ✨ 36-Guna Kundli Milan
        </text>
      </g>
    </g>

    <!-- Bottom Rating / Trust Ribbon -->
    <g transform="translate(262, 395)">
      <rect width="500" height="44" rx="14" fill="rgba(234, 88, 12, 0.4)" stroke="rgba(254, 240, 138, 0.5)" stroke-width="1" />
      <text x="250" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#fef08a" text-anchor="middle">
        100% Confidential • Chat, Call &amp; Video Consultations
      </text>
    </g>
  </g>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(svg))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile('public/feature-graphic.png');
  console.log('Feature graphic created successfully at public/feature-graphic.png (1024x500)');
}

generate();
