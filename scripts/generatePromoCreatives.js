import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const promoDir = path.resolve('public', 'promo');
if (!fs.existsSync(promoDir)) {
  fs.mkdirSync(promoDir, { recursive: true });
}

// 1. Post 1: First 5-Min Free Call (1080x1080 Square for Instagram, FB, WhatsApp)
const svgPost1 = `
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e0533" />
      <stop offset="40%" stop-color="#4a044e" />
      <stop offset="75%" stop-color="#9a3412" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>

    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.6" />
    </filter>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1080" height="1080" fill="url(#bgGrad)" />

  <!-- Sacred Geometry Mandala Circles -->
  <g opacity="0.15" stroke="#fde047" stroke-width="2" fill="none">
    <circle cx="540" cy="540" r="500" stroke-dasharray="12 12" />
    <circle cx="540" cy="540" r="420" />
    <circle cx="540" cy="540" r="340" stroke-dasharray="6 6" />
    <circle cx="540" cy="540" r="260" />
    <circle cx="540" cy="540" r="180" stroke-dasharray="4 4" />
    <line x1="40" y1="540" x2="1040" y2="540" />
    <line x1="540" y1="40" x2="540" y2="1040" />
    <line x1="186" y1="186" x2="894" y2="894" stroke-dasharray="6 6" />
    <line x1="894" y1="186" x2="186" y2="894" stroke-dasharray="6 6" />
  </g>

  <!-- Top Brand Header Pill -->
  <g transform="translate(340, 70)">
    <rect width="400" height="60" rx="30" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(253, 224, 71, 0.4)" stroke-width="2" />
    <text x="200" y="38" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="24" fill="#fef08a" letter-spacing="3">
      ॐ 12RASHI.COM ॐ
    </text>
  </g>

  <!-- Special Offer Top Tag -->
  <g transform="translate(540, 200)">
    <rect x="-240" y="-24" width="480" height="48" rx="24" fill="#16a34a" filter="url(#shadow)" />
    <text x="0" y="8" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" letter-spacing="1">
      ★ LIMITED TIME WELCOME OFFER ★
    </text>
  </g>

  <!-- Main Hindi / English Headline -->
  <text x="540" y="300" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="900" font-size="64" fill="url(#goldGrad)" filter="url(#shadow)">
    पहला कॉल 5 मिनट बिल्कुल FREE
  </text>
  <text x="540" y="370" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="800" font-size="34" fill="#ffffff" opacity="0.95">
    Talk to India's Top Verified Vedic Astrologers
  </text>

  <!-- Center Feature Box -->
  <g transform="translate(140, 430)" filter="url(#shadow)">
    <rect width="800" height="340" rx="36" fill="rgba(15, 7, 25, 0.75)" stroke="rgba(251, 191, 36, 0.5)" stroke-width="3" />

    <!-- Feature 1: Kundli & Horoscope -->
    <g transform="translate(60, 60)">
      <circle cx="30" cy="30" r="30" fill="#f59e0b" opacity="0.2" />
      <text x="30" y="40" text-anchor="middle" font-size="30">📜</text>
      <text x="80" y="28" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="24" fill="#ffffff">सटीक जन्म कुंडली एवं राशिफल</text>
      <text x="80" y="52" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#cbd5e1">करियर, विवाह, व्यापार एवं स्वास्थ्य मार्गदर्शन</text>
    </g>

    <!-- Feature 2: Fair Billing -->
    <g transform="translate(60, 150)">
      <circle cx="30" cy="30" r="30" fill="#10b981" opacity="0.2" />
      <text x="30" y="40" text-anchor="middle" font-size="30">🛡️</text>
      <text x="80" y="28" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="24" fill="#ffffff">Fair-Billing Guarantee™ (Per-Second)</text>
      <text x="80" y="52" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#cbd5e1">असंतोष पर 60 सेकंड के अंदर 100% पूरा रिफंड</text>
    </g>

    <!-- Feature 3: Prashna Kundli -->
    <g transform="translate(60, 240)">
      <circle cx="30" cy="30" r="30" fill="#8b5cf6" opacity="0.2" />
      <text x="30" y="40" text-anchor="middle" font-size="30">🔮</text>
      <text x="80" y="28" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="24" fill="#ffffff">प्रश्न कुंडली (बिना जन्म समय के सटीक उत्तर)</text>
      <text x="80" y="52" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#cbd5e1">तत्काल तात्कालिक समय गणना द्वारा समाधान</text>
    </g>
  </g>

  <!-- Big Call to Action Button -->
  <g transform="translate(290, 820)" filter="url(#shadow)">
    <rect width="500" height="90" rx="45" fill="url(#ctaGrad)" stroke="#fef08a" stroke-width="3" />
    <text x="250" y="56" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="900" font-size="32" fill="#ffffff" letter-spacing="1">
      ⚡ अभी बात करें | CLAIM FREE CALL
    </text>
  </g>

  <!-- Footer Trust Badges -->
  <text x="540" y="960" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="22" fill="#fde047">
    🔒 100% गोपनीय • प्रमाणित ज्योतिषी • तुरंत लाइव कनेक्ट
  </text>
  <text x="540" y="1000" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#ffffff" opacity="0.8">
    Visit: www.12rashi.com | Helpline: +91 9831039814
  </text>
</svg>
`;

// 2. Post 2: Prashna Kundli - No Birth Time Needed (1080x1080 Square)
const svgPost2 = `
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>

    <linearGradient id="purpleGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <linearGradient id="btnGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.7" />
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="url(#bgGrad2)" />

  <!-- Celestial Constellation Rings -->
  <g opacity="0.2" stroke="#c084fc" stroke-width="2" fill="none">
    <circle cx="540" cy="500" r="460" stroke-dasharray="8 8" />
    <circle cx="540" cy="500" r="360" />
    <circle cx="540" cy="500" r="260" stroke-dasharray="16 8" />
  </g>

  <!-- Top Pill -->
  <g transform="translate(365, 80)">
    <rect width="350" height="56" rx="28" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(216, 180, 254, 0.5)" stroke-width="2" />
    <text x="175" y="36" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="22" fill="#f3e8ff" letter-spacing="2">
      🔮 VEDIC PRASHNA SHASTRA
    </text>
  </g>

  <!-- Main Question Callout -->
  <text x="540" y="240" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="900" font-size="54" fill="#ffffff" filter="url(#shadow2)">
    जन्म का सही समय नहीं मालूम?
  </text>
  <text x="540" y="315" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="900" font-size="62" fill="url(#purpleGold)" filter="url(#shadow2)">
    चिंता छोड़ें! प्रश्न कुंडली से जानें उत्तर
  </text>

  <!-- 3 Questions Box -->
  <g transform="translate(140, 390)" filter="url(#shadow2)">
    <rect width="800" height="380" rx="32" fill="rgba(30, 27, 75, 0.85)" stroke="rgba(244, 114, 182, 0.4)" stroke-width="2" />

    <text x="400" y="55" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="26" fill="#fef08a">
      आपके मन का कोई भी जरूरी सवाल:
    </text>

    <!-- Q1 -->
    <g transform="translate(60, 90)">
      <rect width="680" height="70" rx="20" fill="rgba(255, 255, 255, 0.07)" />
      <text x="35" y="44" font-size="28">💼</text>
      <text x="85" y="44" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff">नई नौकरी या प्रमोशन कब तक मिलेगा?</text>
    </g>

    <!-- Q2 -->
    <g transform="translate(60, 180)">
      <rect width="680" height="70" rx="20" fill="rgba(255, 255, 255, 0.07)" />
      <text x="35" y="44" font-size="28">💍</text>
      <text x="85" y="44" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff">विवाह में देरी का क्या कारण और सटीक समय?</text>
    </g>

    <!-- Q3 -->
    <g transform="translate(60, 270)">
      <rect width="680" height="70" rx="20" fill="rgba(255, 255, 255, 0.07)" />
      <text x="35" y="44" font-size="28">🏠</text>
      <text x="85" y="44" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff">मकान, जमीन या विदेश यात्रा का योग कब बनेगा?</text>
    </g>
  </g>

  <!-- CTA -->
  <g transform="translate(265, 830)" filter="url(#shadow2)">
    <rect width="550" height="90" rx="45" fill="url(#btnGrad2)" stroke="#ffffff" stroke-width="2" />
    <text x="275" y="56" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="900" font-size="30" fill="#ffffff">
      ✨ प्रश्न पूछें - मात्र ₹99 से शुरू
    </text>
  </g>

  <text x="540" y="970" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="24" fill="#ffffff">
    12Rashi.com | वैदिक ज्योतिषियों से समाधान
  </text>
  <text x="540" y="1010" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#cbd5e1">
    No Birth Date/Time Needed • Prashna Cast at Exact Query Time
  </text>
</svg>
`;

async function generate() {
  console.log('Rendering promotional creatives...');
  await sharp(Buffer.from(svgPost1)).png({ quality: 95 }).toFile(path.join(promoDir, 'promo-free-call.png'));
  console.log('✓ Created public/promo/promo-free-call.png (1080x1080)');

  await sharp(Buffer.from(svgPost2)).png({ quality: 95 }).toFile(path.join(promoDir, 'promo-prashna-kundli.png'));
  console.log('✓ Created public/promo/promo-prashna-kundli.png (1080x1080)');

  // Also copy to dist if dist exists so preview serves immediately
  const distPromoDir = path.resolve('dist', 'promo');
  if (fs.existsSync(path.resolve('dist'))) {
    if (!fs.existsSync(distPromoDir)) fs.mkdirSync(distPromoDir, { recursive: true });
    fs.copyFileSync(path.join(promoDir, 'promo-free-call.png'), path.join(distPromoDir, 'promo-free-call.png'));
    fs.copyFileSync(path.join(promoDir, 'promo-prashna-kundli.png'), path.join(distPromoDir, 'promo-prashna-kundli.png'));
    console.log('✓ Copied to dist/promo/');
  }
}

generate().catch(console.error);
