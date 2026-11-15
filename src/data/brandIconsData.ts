import saffronSuryaImg from '../assets/images/saffron_surya_icon_1794754245006.jpg';
import midnightAstrolabeImg from '../assets/images/midnight_astrolabe_icon_1794754247702.jpg';
import templeLotusImg from '../assets/images/temple_lotus_icon_1794754247446.jpg';
import modernIvoryImg from '../assets/images/modern_ivory_monogram_1794754249530.jpg';

export type BrandIconPresetId =
  | 'default-chakra'
  | 'saffron-surya'
  | 'midnight-astrolabe'
  | 'temple-lotus'
  | 'ivory-monogram'
  | 'obsidian-kundli';

export interface BrandIconSample {
  id: BrandIconPresetId;
  name: string;
  subtitle: string;
  styleTag: string;
  imageSrc?: string;
  palette: [string, string, string];
  bestFor: string;
  description: string;
}

export const BRAND_ICON_SAMPLES: BrandIconSample[] = [
  {
    id: 'saffron-surya',
    name: 'Royal Surya Kundli Chakra',
    subtitle: 'Saffron & Burnished Gold',
    styleTag: 'Flagship Play Store',
    imageSrc: saffronSuryaImg,
    palette: ['#EA580C', '#FBBF24', '#7C2D12'],
    bestFor: 'Primary Android / iOS Home Screen & Play Store Icon',
    description:
      'Radiant 12-ray golden Surya sun surrounding a Vedic Lagna diamond and bold "12" emblem on vibrant saffron amber.',
  },
  {
    id: 'midnight-astrolabe',
    name: 'Midnight Zodiac Astrolabe',
    subtitle: 'Deep Indigo & Champagne Gold',
    styleTag: 'Premium Celestial',
    imageSrc: midnightAstrolabeImg,
    palette: ['#0F172A', '#FDE68A', '#1E3A8A'],
    bestFor: 'Dark Mode Wallpapers, Pro App Tier & Horoscope Hub',
    description:
      'Precision 12-house astronomical wheel with all 12 Rashi zodiac constellations, crescent Chandra, and golden Surya core.',
  },
  {
    id: 'temple-lotus',
    name: 'Sacred Lotus Shri Yantra',
    subtitle: 'Temple Vermilion & Brass',
    styleTag: 'Heritage Spiritual',
    imageSrc: templeLotusImg,
    palette: ['#991B1B', '#F59E0B', '#450A0A'],
    bestFor: 'Live Puja, Spiritual Remedies & Traditional Seeker Audience',
    description:
      '12-petal auspicious lotus mandala enclosing a luminous Shri Yantra sacred geometry star and glowing solar bindu.',
  },
  {
    id: 'ivory-monogram',
    name: 'Minimal Yantra 12R Seal',
    subtitle: 'Warm Ivory & Terracotta',
    styleTag: 'Modern Brand Logo',
    imageSrc: modernIvoryImg,
    palette: ['#FFFBEB', '#C2410C', '#D97706'],
    bestFor: 'Website Header Logo, Invoices, PDF Reports & Packaging',
    description:
      'Clean architectural octagonal yantra frame with an intertwined "12R" monogram crafted for crisp scaling at any size.',
  },
  {
    id: 'default-chakra',
    name: 'Classic 12Rashi Sun Disc',
    subtitle: 'Signature Vector Chakra',
    styleTag: 'Current Live SVG',
    palette: ['#F97316', '#FEF08A', '#C2410C'],
    bestFor: 'Crisp Infinite-Resolution Navbar Favicon & PWA Shell',
    description:
      'The signature crisp SVG 12-ray Surya chakra with dashed golden ring and bold serif "12" numeral at center.',
  },
  {
    id: 'obsidian-kundli',
    name: 'Obsidian Diamond Kundli Grid',
    subtitle: 'Matte Onyx & Sacred Gold',
    styleTag: 'Vector Geometric',
    palette: ['#1C1917', '#FBBF24', '#EA580C'],
    bestFor: 'Astrologer Partner App, AI Engine & Minimal Dark Logos',
    description:
      'North-Indian Vedic Janam Kundli square grid rendered in radiant gold lines inside a sleek obsidian emblem.',
  },
];
