// Premium Comprehensive Vedic Kundli PDF Reports Catalog
// High-margin 100% digital products for instant revenue generation

export interface KundliReportTier {
  id: string;
  title: string;
  hindiTitle: string;
  badge: string;
  pageCount: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  description: string;
  highlightCoverImage: string;
  samplePreviewImages: string[];
  chapters: string[];
  features: string[];
  deliveryTime: string;
  format: string;
  popularFor: string;
}

export interface PurchasedReportRecord {
  id: string;
  tierId: string;
  reportTitle: string;
  seekerName: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  rashi: string;
  nakshatra: string;
  lagna: string;
  amount: number;
  purchaseDate: string;
  status: 'READY' | 'PROCESSING';
  downloadUrl: string;
  certificateId: string;
  emailSentTo?: string;
  whatsappSentTo?: string;
}

export const KUNDLI_REPORTS_CATALOG: KundliReportTier[] = [
  {
    id: 'report-brihat-lifetime',
    title: '50+ Page Brihat Janam Kundli Lifetime Dossier',
    hindiTitle: 'बृहत् जन्म कुंडली संपूर्ण जीवन फल फलादेश (५०+ पृष्ठ)',
    badge: 'MOST POPULAR & COMPLETE',
    pageCount: '52 Pages',
    price: 499,
    originalPrice: 1999,
    discountPercentage: 75,
    description:
      'The ultimate Parashari encyclopedic horoscope report. Covers complete planetary degrees, Lagna (D1), Navamsha (D9), 120-year Vimshottari Mahadasha timeline, Sade Sati analysis, and 12-Bhava lifetime predictions for Career, Wealth, Marriage, and Health.',
    highlightCoverImage:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    samplePreviewImages: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80',
    ],
    chapters: [
      'Chapter 1: Vedic Avakahada Chakra, Birth Panchang & Gana/Nadi Coordinates',
      'Chapter 2: Planetary Astronomical Ephemeris, Retrograde States & Nakshatra Padas',
      'Chapter 3: Full Lagna (D1), Chandra (Moon), and Navamsha (D9) Golden Charts',
      'Chapter 4: Bhavamsha Analysis – Comprehensive 12 House Predictions',
      'Chapter 5: 120-Year Complete Vimshottari Mahadasha & Antardasha Calendar',
      'Chapter 6: Career & Profession Mastery – 10th House, D10 Dasamsha & Best Sectors',
      'Chapter 7: Wealth & Fortune Roadmap – 2nd & 11th House, Lakshmi Yogas & Assets',
      'Chapter 8: Marriage & Spousal Dynamics – 7th House, Vivah Muhurat & Harmony',
      'Chapter 9: Health & Vitality – 6th/8th House Afflictions & Ayurvedic Dosha Balance',
      'Chapter 10: Major Dosha Nivaran – Shani Sade Sati, Manglik, Kaal Sarp & Pitra Protocols',
      'Chapter 11: Sacred Vedic Remedies – Acoustic Beej Mantras, Fasting (Vrat) & Daan',
    ],
    features: [
      'Instant High-Res PDF Download with Golden Parashari Border',
      'Calculated using high-precision Lahiri Ayanamsha (Chitra Paksha)',
      '120-Year Vimshottari Dasha Dates mapped till year 2145',
      'Official Astrologer Seal with Unique Certificate Verification ID',
      'WhatsApp PDF Link dispatch via registered DLT Telecom Gateway',
    ],
    deliveryTime: 'Instant (Under 30 Seconds)',
    format: 'Print-Ready Multi-Page High-Res PDF & In-App Reader',
    popularFor: 'Full Life Roadmap, Long-Term Planning & Family Archives',
  },
  {
    id: 'report-career-wealth',
    title: '5-Year Career, Business & Wealth Roadmap (25+ Pages)',
    hindiTitle: 'कैरियर, व्यापार एवं धन समृद्धि पंचवर्षीय रोडमैप (२५+ पृष्ठ)',
    badge: 'CAREER ACCELERATOR',
    pageCount: '28 Pages',
    price: 299,
    originalPrice: 1299,
    discountPercentage: 77,
    description:
      'Detailed astrological blueprint designed for working professionals, entrepreneurs, and students. Decodes 10th house Karma Bhava, D10 Dasamsha, promotion windows, business partnerships, investment risks, and Lakshmi Yogas.',
    highlightCoverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    samplePreviewImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    ],
    chapters: [
      '1. 10th House (Karma Bhava) Analysis & Planetary Strengths',
      '2. D10 Dasamsha Chart & Favorable Corporate/Govt Sectors',
      '3. Dhana Yogas (2nd & 11th House) and Financial Accumulation Peaks',
      '4. 2026–2031 Yearly Career Transit Forecast (Guru & Shani Gochar)',
      '5. Auspicious Time Windows for Job Change, Promotion & Business Launch',
      '6. Remedial Sadhana: Mantras for Professional Authority & Removal of Obstacles',
    ],
    features: [
      'Quarter-by-quarter Career Transit Timeline',
      'Guidance on Government Exam vs Private Tech vs Business Alignment',
      'Stock Market & Real Estate Astrological Affinities',
    ],
    deliveryTime: 'Instant Download',
    format: 'Print-Ready PDF',
    popularFor: 'Job Switch, Promotion, Business Growth & Wealth Preservation',
  },
  {
    id: 'report-vivah-marriage',
    title: 'Vivah & Relationship Compatibility Dossier (30+ Pages)',
    hindiTitle: 'विवाह, जीवनसाथी एवं दांपत्य सुख फलादेश (३०+ पृष्ठ)',
    badge: 'RELATIONSHIP HARMONY',
    pageCount: '32 Pages',
    price: 349,
    originalPrice: 1499,
    discountPercentage: 76,
    description:
      'Exhaustive marriage analysis decoding your 7th house, spouse physical/temperamental characteristics, timing of marriage, Mangal/Kuja Dosha cancellation, and post-marriage fortune.',
    highlightCoverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    samplePreviewImages: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
    ],
    chapters: [
      '1. 7th House (Kalatra Bhava) & Venus/Jupiter Conjunctions',
      '2. Future Spouse: Profession, Personality Traits & Direction of Origin',
      '3. D9 Navamsha Analysis for Post-Marriage Domestic Bliss',
      '4. Manglik Dosha Audit, Exceptions & Neutralizing Combinations',
      '5. Vivah Muhurat Timing Windows & Dasha Triggers',
      '6. Vedic Remedies: Swayamvara Parvathi Japa & Harmony Protocols',
    ],
    features: [
      'In-depth 36 Guna Ashtakoota compatibility reference',
      'Remedies for late marriage or matchmaking friction',
      'Astrologer-endorsed Vivah Seal',
    ],
    deliveryTime: 'Instant Download',
    format: 'Print-Ready PDF',
    popularFor: 'Matchmaking, Late Marriage Relief & Married Life Peace',
  },
  {
    id: 'report-shani-sade-sati',
    title: 'Shani Sade Sati & Dhaiya Defense Dossier (20+ Pages)',
    hindiTitle: 'शनि साढ़े साती एवं ढैय्या संपूर्ण रक्षा कवच रिपोर्ट (२०+ पृष्ठ)',
    badge: 'DOSHA DEFENSE',
    pageCount: '22 Pages',
    price: 199,
    originalPrice: 999,
    discountPercentage: 80,
    description:
      'Complete 7.5-year timeline breakdown of your current or upcoming Shani transit. Analyzes Rising Phase (12th house), Peak Phase (1st house), and Setting Phase (2nd house) with exact dates and protective remedies.',
    highlightCoverImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    samplePreviewImages: [
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=400&q=80',
    ],
    chapters: [
      '1. Exact Dates of 7.5-Year Sade Sati / Dhaiya Cycles in Your Lifetime',
      '2. Current Phase Diagnosis: Rising, Peak, or Setting Effects',
      '3. Career, Mental Health, Family & Financial Impact Analysis',
      '4. Kantaka Shani & Ashtama Shani Sensitivity Periods',
      '5. Complete Non-Physical Remedy Matrix: Dasharatha Stotram & Seva Guidelines',
    ],
    features: [
      'Clear, calming, fear-free Vedic perspective',
      'Saturday discipline & diet recommendations',
      'Step-by-step Hanuman Chalisa & mustard oil deep-daan rules',
    ],
    deliveryTime: 'Instant Download',
    format: 'Print-Ready PDF',
    popularFor: 'Relief from Stress, Career Delays & Health Fatigue',
  },
  {
    id: 'report-varshphal-annual',
    title: '2026–2027 Annual Varshphal (Solar Return) Report',
    hindiTitle: 'वर्षफल २०२६-२०२७ वार्षिक फलादेश (३५+ पृष्ठ)',
    badge: 'YEARLY FORECAST',
    pageCount: '36 Pages',
    price: 399,
    originalPrice: 1599,
    discountPercentage: 75,
    description:
      'Tajika system annual horoscope calculated for your exact solar return moment. Features Muntha Lord analysis, Varsheshwara (Year Lord), and month-by-month prediction for all 12 upcoming months.',
    highlightCoverImage:
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    samplePreviewImages: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
    ],
    chapters: [
      '1. Tajika Solar Return Chart & Year Lord (Varsheshwara)',
      '2. Muntha Placement & Auspicious House Transit',
      '3. Patyayini Dasha Timeline for the Year',
      '4. Month-by-Month Forecast: Months 1 through 12',
      '5. Key Opportunities, Caution Windows & Yearly Remedies',
    ],
    features: [
      '12 Month-by-Month predictive calendar',
      'Specific guidance for financial investments during the year',
      'Annual auspicious muhurat windows',
    ],
    deliveryTime: 'Instant Download',
    format: 'Print-Ready PDF',
    popularFor: 'Birthdays, New Year Planning & Annual Milestones',
  },
];
