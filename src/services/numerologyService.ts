// Indian Vedic & Chaldean Numerology Service (अंक ज्योतिष)

export interface ChaldeanBreakdown {
  letter: string;
  value: number;
}

export interface LoShuGrid {
  // 3x3 Grid values:
  // 4 9 2
  // 3 5 7
  // 8 1 6
  grid: Record<number, number>; // number -> count
  planes: {
    mental: boolean; // 4, 9, 2
    emotional: boolean; // 3, 5, 7
    practical: boolean; // 8, 1, 6
    thought: boolean; // 4, 3, 8
    will: boolean; // 9, 5, 1
    action: boolean; // 2, 7, 6
    goldenRajYoga: boolean; // 4, 5, 6
    silverRajYoga: boolean; // 2, 5, 8
  };
  missingNumbers: number[];
  remediesForMissing: { num: number; remedy: string; crystal: string }[];
}

export interface NumerologyReport {
  mulank: number; // Driver / Day Number (1-9)
  bhagyank: number; // Conductor / Life Path (1-9)
  namank: number; // Name Number (1-9)
  compoundNameNumber: number; // Compound Name Number (e.g. 33, 42)
  pythagoreanNameNumber: number;
  rulingPlanet: {
    nameEn: string;
    nameHi: string;
    deity: string;
    element: string;
  };
  traits: {
    strengths: string[];
    weaknesses: string[];
    careerMatches: string[];
    spiritualLesson: string;
  };
  luckyAttributes: {
    colors: string[];
    gemstones: string[];
    days: string[];
    dates: number[];
    favorableDirections: string[];
    friendlyNumbers: number[];
    neutralNumbers: number[];
    enemyNumbers: number[];
  };
  loShuGrid: LoShuGrid;
  personalYear: {
    year: number;
    number: number;
    theme: string;
    guidance: string;
  };
  nameHarmonious: boolean;
  nameHarmonyMessage: string;
}

// Chaldean letter vibration mapping widely used in India
const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// Pythagorean letter vibration mapping for comparison
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const PLANET_PROFILES: Record<number, {
  nameEn: string;
  nameHi: string;
  deity: string;
  element: string;
  colors: string[];
  gemstones: string[];
  days: string[];
  dates: number[];
  directions: string[];
  friendly: number[];
  neutral: number[];
  enemy: number[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  lesson: string;
}> = {
  1: {
    nameEn: 'Sun (Surya)',
    nameHi: 'सूर्य देव',
    deity: 'Lord Shiva & Surya Narayana',
    element: 'Fire (Agni)',
    colors: ['Gold', 'Orange', 'Ruby Red', 'Copper'],
    gemstones: ['Ruby (Manikya)', 'Sunstone', 'Garnet'],
    days: ['Sunday'],
    dates: [1, 10, 19, 28],
    directions: ['East (Purva)'],
    friendly: [1, 2, 3, 5, 9],
    neutral: [4, 7],
    enemy: [6, 8],
    strengths: ['Natural leader', 'Independent', 'Authoritative', 'Ambitious', 'Charismatic'],
    weaknesses: ['Ego issues', 'Stubbornness', 'Impatience with slower thinkers'],
    careers: ['Government administration', 'Corporate leadership', 'Politics', 'Entrepreneurship', 'Surgeon'],
    lesson: 'Lead with compassion and humility rather than commanding from pure pride.',
  },
  2: {
    nameEn: 'Moon (Chandra)',
    nameHi: 'चंद्र देव',
    deity: 'Goddess Parvati & Lord Shiva',
    element: 'Water (Jal)',
    colors: ['White', 'Cream', 'Silver', 'Pearl'],
    gemstones: ['Pearl (Moti)', 'Moonstone'],
    days: ['Monday'],
    dates: [2, 11, 20, 29],
    directions: ['North-West (Vayavya)'],
    friendly: [1, 3, 5],
    neutral: [2, 6, 7],
    enemy: [4, 8, 9],
    strengths: ['Intuitive', 'Diplomatic', 'Creative', 'Caring', 'Peace-loving'],
    weaknesses: ['Mood swings', 'Over-sensitive', 'Indecisiveness'],
    careers: ['Counseling', 'Psychology', 'Writing', 'Culinary arts', 'Hospitality', 'Public Relations'],
    lesson: 'Balance your deep emotional intuition with practical grounding and mental resilience.',
  },
  3: {
    nameEn: 'Jupiter (Brihaspati / Guru)',
    nameHi: 'गुरु / बृहस्पति',
    deity: 'Lord Vishnu & Brihaspati',
    element: 'Ether / Fire',
    colors: ['Yellow', 'Saffron', 'Gold', 'Amber'],
    gemstones: ['Yellow Sapphire (Pukhraj)', 'Citrine', 'Topaz'],
    days: ['Thursday'],
    dates: [3, 12, 21, 30],
    directions: ['North-East (Ishanya)'],
    friendly: [1, 2, 3, 9],
    neutral: [5, 7],
    enemy: [4, 6, 8],
    strengths: ['Wise', 'Optimistic', 'Philosophical', 'Excellent mentor', 'Generous'],
    weaknesses: ['Over-spending', 'Preachy at times', 'Scattered energies'],
    careers: ['Teaching', 'Law', 'Astrology & Spiritual guidance', 'Finance', 'Advisory'],
    lesson: 'Anchor expansive wisdom with steady discipline to prevent dissipated focus.',
  },
  4: {
    nameEn: 'Rahu (North Node / Uranus)',
    nameHi: 'राहु देव',
    deity: 'Goddess Durga & Lord Bhairava',
    element: 'Air / Shadow',
    colors: ['Electric Blue', 'Grey', 'Brown', 'Navy'],
    gemstones: ['Hessonite Garnet (Gomed)', 'Lapis Lazuli'],
    days: ['Saturday', 'Wednesday'],
    dates: [4, 13, 22, 31],
    directions: ['South-West (Nairutya)'],
    friendly: [5, 6, 7, 8],
    neutral: [1],
    enemy: [2, 4, 9],
    strengths: ['Revolutionary thinker', 'Master strategist', 'Tech-savvy', 'Unconventional', 'Tenacious'],
    weaknesses: ['Sudden mood shifts', 'Secretive', 'Misunderstood'],
    careers: ['Software & AI Engineering', 'Data Science', 'Forensics', 'Research', 'Aviation'],
    lesson: 'Channel unconventional vision into ethical, disciplined execution for lasting glory.',
  },
  5: {
    nameEn: 'Mercury (Budha)',
    nameHi: 'बुध देव',
    deity: 'Lord Ganesha & Lord Vishnu',
    element: 'Earth / Air',
    colors: ['Emerald Green', 'Light Green', 'Mint', 'Turquoise'],
    gemstones: ['Emerald (Panna)', 'Peridot', 'Green Tourmaline'],
    days: ['Wednesday'],
    dates: [5, 14, 23],
    directions: ['North (Uttara)'],
    friendly: [1, 5, 6],
    neutral: [2, 3, 7, 8],
    enemy: [4, 9],
    strengths: ['Fast communicator', 'Versatile', 'Great networking', 'Business acumen', 'Witty'],
    weaknesses: ['Restlessness', 'Gets bored easily', 'High-strung nervous energy'],
    careers: ['Marketing & Media', 'Trading & Commerce', 'Journalism', 'Data analysis', 'Sales'],
    lesson: 'Find stillness amidst mental velocity; complete one masterpiece before leaping to the next.',
  },
  6: {
    nameEn: 'Venus (Shukra)',
    nameHi: 'शुक्र देव',
    deity: 'Goddess Lakshmi & Shukracharya',
    element: 'Water / Earth',
    colors: ['Soft Pink', 'Diamond White', 'Pastels', 'Sky Blue'],
    gemstones: ['Diamond (Heera)', 'White Sapphire', 'Opal', 'Zircon'],
    days: ['Friday'],
    dates: [6, 15, 24],
    directions: ['South-East (Agneya)'],
    friendly: [4, 5, 6, 7, 8],
    neutral: [2, 3],
    enemy: [1, 9],
    strengths: ['Artistic', 'Magnetically charming', 'Luxury & aesthetics lover', 'Harmonizer', 'Refined'],
    weaknesses: ['Over-indulgent', 'Conflict-averse', 'Self-absorbed'],
    careers: ['Fashion & Jewelry design', 'Film & Media arts', 'Interior Architecture', 'Cosmetics', 'Luxury hospitality'],
    lesson: 'True beauty radiates from inner spiritual self-worth, not mere outward opulence.',
  },
  7: {
    nameEn: 'Ketu (South Node / Neptune)',
    nameHi: 'केतु देव',
    deity: 'Lord Ganesha & Lord Matsya',
    element: 'Water / Ether',
    colors: ['White', 'Light Grey', 'Smoky Green', 'Yellow'],
    gemstones: ['Cat\'s Eye (Lehsunia)', 'Chrysoberyl'],
    days: ['Thursday', 'Sunday'],
    dates: [7, 16, 25],
    directions: ['North-East (Ishanya)'],
    friendly: [4, 5, 6, 8],
    neutral: [1, 2, 3],
    enemy: [9],
    strengths: ['Deeply intuitive', 'Occult wisdom', 'Analytical detective mind', 'Detached observer', 'Philosophical'],
    weaknesses: ['Aloof', 'Pessimistic tendencies', 'Overthinking'],
    careers: ['Scientific research', 'Astrology & Occult sciences', 'Philosophy', 'Cybersecurity', 'Spirituality'],
    lesson: 'Integrate your profound otherworldly insights with practical earthly relationships.',
  },
  8: {
    nameEn: 'Saturn (Shani)',
    nameHi: 'शनि देव',
    deity: 'Lord Shani & Lord Shiva (Hanuman Ji as shield)',
    element: 'Earth / Air',
    colors: ['Dark Blue', 'Black', 'Steel Grey', 'Dark Purple'],
    gemstones: ['Blue Sapphire (Neelam)', 'Amethyst', 'Iolite'],
    days: ['Saturday'],
    dates: [8, 17, 26],
    directions: ['West (Pashchim)'],
    friendly: [4, 5, 6, 7],
    neutral: [3],
    enemy: [1, 2, 9],
    strengths: ['Supreme resilience', 'Disciplined', 'Karmic justice seeker', 'Master of perseverance', 'Long-term builder'],
    weaknesses: ['Melancholic', 'Late recognition', 'Can be unyielding'],
    careers: ['Heavy Industries & Mining', 'Real Estate & Infrastructure', 'Judiciary & Law', 'Public Administration', 'Civil Engineering'],
    lesson: 'Trust the slow crucible of time; every karmic obstacle builds an unbreakable empire.',
  },
  9: {
    nameEn: 'Mars (Mangal)',
    nameHi: 'मंगल देव',
    deity: 'Lord Kartikeya & Lord Hanuman',
    element: 'Fire (Agni)',
    colors: ['Bright Red', 'Crimson', 'Coral', 'Blood Orange'],
    gemstones: ['Red Coral (Moonga)', 'Carnelian'],
    days: ['Tuesday'],
    dates: [9, 18, 27],
    directions: ['South (Dakshin)'],
    friendly: [1, 2, 3],
    neutral: [7],
    enemy: [4, 5, 6, 8],
    strengths: ['Courageous', 'Dynamic warrior spirit', 'Protector', 'High physical stamina', 'Direct'],
    weaknesses: ['Fiery temper', 'Aggressive haste', 'Combative'],
    careers: ['Defense & Armed forces', 'Sports & Athletics', 'Surgery & Medicine', 'Real estate development', 'Emergency management'],
    lesson: 'Master the sacred art of controlled fire; channel passion into constructive conquest.',
  },
};

export function reduceToSingleDigit(num: number): number {
  if (num === 0) return 0;
  let sum = num;
  while (sum > 9) {
    sum = String(sum)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

export function calculateMulank(day: number): number {
  return reduceToSingleDigit(day);
}

export function calculateBhagyank(dobString: string): number {
  // dobString format: YYYY-MM-DD
  const digits = dobString.replace(/\D/g, '').split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

export function calculateChaldeanNamank(name: string): { compound: number; single: number; breakdown: ChaldeanBreakdown[] } {
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  const breakdown: ChaldeanBreakdown[] = [];
  let compound = 0;

  for (const char of upper) {
    const val = CHALDEAN_MAP[char] || 0;
    compound += val;
    breakdown.push({ letter: char, value: val });
  }

  const single = reduceToSingleDigit(compound);
  return { compound, single, breakdown };
}

export function calculatePythagoreanNamank(name: string): number {
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (const char of upper) {
    sum += PYTHAGOREAN_MAP[char] || 0;
  }
  return reduceToSingleDigit(sum);
}

export function buildLoShuGrid(dobString: string, mulank: number, bhagyank: number): LoShuGrid {
  const clean = dobString.replace(/\D/g, '');
  const counts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  // Add DOB digits (ignore zeros)
  for (const char of clean) {
    const d = parseInt(char, 10);
    if (d >= 1 && d <= 9) counts[d]++;
  }

  // Include Mulank & Bhagyank
  counts[mulank]++;
  counts[bhagyank]++;

  // Check Planes
  const has = (n: number) => counts[n] > 0;

  const planes = {
    mental: has(4) && has(9) && has(2),
    emotional: has(3) && has(5) && has(7),
    practical: has(8) && has(1) && has(6),
    thought: has(4) && has(3) && has(8),
    will: has(9) && has(5) && has(1),
    action: has(2) && has(7) && has(6),
    goldenRajYoga: has(4) && has(5) && has(6),
    silverRajYoga: has(2) && has(5) && has(8),
  };

  const missingNumbers: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (counts[i] === 0) missingNumbers.push(i);
  }

  const REMEDIES: Record<number, { remedy: string; crystal: string }> = {
    1: { remedy: 'Wear a Surya Yantra or offer Arghya with copper pot to rising sun.', crystal: 'Sunstone / Red Carnelian' },
    2: { remedy: 'Drink water from silver vessel; respect and take blessings from mother.', crystal: 'Pearl / White Selenite' },
    3: { remedy: 'Apply saffron (kesar) tilak on forehead; respect teachers and mentors.', crystal: 'Citrine / Yellow Aventurine' },
    4: { remedy: 'Wear wooden Tulsi mala; keep home clutter-free, especially North-East.', crystal: 'Hessonite / Smoky Quartz' },
    5: { remedy: 'Keep green plants (Money plant/Tulsi) in North; chant Budh mantra.', crystal: 'Green Jade / Aventurine' },
    6: { remedy: 'Keep white scented flowers; use natural fragrances and sandalwood.', crystal: 'Clear Quartz / Opal' },
    7: { remedy: 'Feed street dogs; meditate in quiet spaces; avoid over-analyzing.', crystal: 'Cat\'s Eye / Tiger Eye' },
    8: { remedy: 'Light mustard oil diya near Peepal tree on Saturdays; donate to needy.', crystal: 'Black Tourmaline / Amethyst' },
    9: { remedy: 'Recite Hanuman Chalisa on Tuesdays; channel vitality into sports.', crystal: 'Red Jasper / Coral' },
  };

  const remediesForMissing = missingNumbers.map((num) => ({
    num,
    remedy: REMEDIES[num]?.remedy || 'Perform regular meditation and Surya Arghya.',
    crystal: REMEDIES[num]?.crystal || 'Sphatik Crystal',
  }));

  return {
    grid: counts,
    planes,
    missingNumbers,
    remediesForMissing,
  };
}

export function calculatePersonalYear(dobString: string, targetYear: number = new Date().getFullYear()): {
  year: number;
  number: number;
  theme: string;
  guidance: string;
} {
  const parts = dobString.split('-');
  const month = parseInt(parts[1] || '1', 10);
  const day = parseInt(parts[2] || '1', 10);

  const sum = day + month + targetYear;
  const num = reduceToSingleDigit(sum);

  const THEMES: Record<number, { theme: string; guidance: string }> = {
    1: { theme: 'New Beginnings & Leadership', guidance: 'Sow new seeds. Excellent year to launch startups, projects, and reinvent personal goals.' },
    2: { theme: 'Patience, Partnerships & Balance', guidance: 'Consolidate alliances. Focus on diplomatic cooperation, harmony, and emotional listening.' },
    3: { theme: 'Self-Expression & Creative Expansion', guidance: 'Year of joy, social networking, media exposure, and creative breakthroughs.' },
    4: { theme: 'Discipline, Hard Work & Foundation', guidance: 'Establish strong foundations. Organize finances, real estate, and daily health routines.' },
    5: { theme: 'Freedom, Travel & Rapid Transformation', guidance: 'Dynamic shifts, travel, business pivots, and exciting breakthroughs. Embrace agility.' },
    6: { theme: 'Family, Responsibility & Domestic Harmony', guidance: 'Focus on marriage, home renovation, parenthood, and family investments.' },
    7: { theme: 'Spiritual Introspection & Deep Wisdom', guidance: 'Year of research, meditation, higher learning, and soul recalibration.' },
    8: { theme: 'Financial Power, Karma & Abundance', guidance: 'Harvest time. Major career advancements, investments, and karmic returns for past efforts.' },
    9: { theme: 'Completion, Release & Preparation', guidance: 'Let go of stagnant relationships and outdated patterns. Prepare for the next 9-year cycle.' },
  };

  return {
    year: targetYear,
    number: num,
    theme: THEMES[num]?.theme || 'Transformation',
    guidance: THEMES[num]?.guidance || 'Stay aligned with your inner values.',
  };
}

export function generateNumerologyReport(name: string, dobString: string): NumerologyReport {
  const parts = dobString.split('-');
  const day = parseInt(parts[2] || '15', 10);

  const mulank = calculateMulank(day);
  const bhagyank = calculateBhagyank(dobString);
  const { compound, single: namank } = calculateChaldeanNamank(name);
  const pythagoreanNameNumber = calculatePythagoreanNamank(name);

  const planetInfo = PLANET_PROFILES[mulank] || PLANET_PROFILES[1];
  const loShuGrid = buildLoShuGrid(dobString, mulank, bhagyank);
  const personalYear = calculatePersonalYear(dobString);

  // Name Harmony Check: does Namank match Mulank or Bhagyank?
  const isFriendlyWithMulank = planetInfo.friendly.includes(namank);
  const isFriendlyWithBhagyank = PLANET_PROFILES[bhagyank]?.friendly.includes(namank);
  const isHarmonious = isFriendlyWithMulank || isFriendlyWithBhagyank || namank === mulank || namank === bhagyank;

  let harmonyMessage = '';
  if (isHarmonious) {
    harmonyMessage = `Your name number (${namank}) is vibrating in harmony with your Mulank (${mulank}) and Bhagyank (${bhagyank}). No spelling alterations needed.`;
  } else {
    harmonyMessage = `Your current name vibration (${namank}) is neutral or conflicting with your Mulank (${mulank}). Adding an auspicious vowel (A, E, or N) to reach ${planetInfo.friendly[0] || 5} will dramatically accelerate prosperity.`;
  }

  return {
    mulank,
    bhagyank,
    namank,
    compoundNameNumber: compound,
    pythagoreanNameNumber,
    rulingPlanet: {
      nameEn: planetInfo.nameEn,
      nameHi: planetInfo.nameHi,
      deity: planetInfo.deity,
      element: planetInfo.element,
    },
    traits: {
      strengths: planetInfo.strengths,
      weaknesses: planetInfo.weaknesses,
      careerMatches: planetInfo.careers,
      spiritualLesson: planetInfo.lesson,
    },
    luckyAttributes: {
      colors: planetInfo.colors,
      gemstones: planetInfo.gemstones,
      days: planetInfo.days,
      dates: planetInfo.dates,
      favorableDirections: planetInfo.directions,
      friendlyNumbers: planetInfo.friendly,
      neutralNumbers: planetInfo.neutral,
      enemyNumbers: planetInfo.enemy,
    },
    loShuGrid,
    personalYear,
    nameHarmonious: isHarmonious,
    nameHarmonyMessage: harmonyMessage,
  };
}

export function evaluatePhoneOrVehicleNumber(input: string, mulank: number): {
  sum: number;
  singleDigit: number;
  isFavorable: boolean;
  verdict: string;
  rulingPlanet: string;
} {
  const clean = input.replace(/\D/g, '');
  if (!clean) {
    return {
      sum: 0,
      singleDigit: 0,
      isFavorable: false,
      verdict: 'Please enter digits',
      rulingPlanet: 'Unknown',
    };
  }

  const digits = clean.split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  const single = reduceToSingleDigit(sum);

  const planet = PLANET_PROFILES[single]?.nameEn || 'Universal';
  const ownerPlanet = PLANET_PROFILES[mulank] || PLANET_PROFILES[1];

  const isFavorable = ownerPlanet.friendly.includes(single) || single === mulank;

  let verdict = '';
  if (isFavorable) {
    verdict = `Highly Auspicious! The total reduces to ${single} (${planet}), which harmonizes with your Mulank ${mulank}. Attracts luck, trade, and smooth journeys.`;
  } else if (ownerPlanet.enemy.includes(single)) {
    verdict = `Challenging Vibration. The total reduces to ${single} (${planet}), which sits in opposition with your Mulank ${mulank}. Consider placing a copper yantra inside the vehicle or on your mobile case.`;
  } else {
    verdict = `Neutral Vibration. Total is ${single} (${planet}). Works reliably with balanced day-to-day results.`;
  }

  return {
    sum,
    singleDigit: single,
    isFavorable,
    verdict,
    rulingPlanet: planet,
  };
}
