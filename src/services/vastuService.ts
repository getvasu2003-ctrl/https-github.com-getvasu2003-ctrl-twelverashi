// Vedic Vastu Shastra Audit & Directional Energy Service (वास्तु शास्त्र)

export type VastuDirection =
  | 'North'
  | 'North-East'
  | 'East'
  | 'South-East'
  | 'South'
  | 'South-West'
  | 'West'
  | 'North-West'
  | 'Center (Brahmasthan)';

export interface VastuZoneDetail {
  direction: VastuDirection;
  hindiName: string;
  rulingDeity: string;
  planet: string;
  element: 'Water' | 'Fire' | 'Earth' | 'Air' | 'Space';
  attribute: string;
  idealRooms: string[];
  forbiddenRooms: string[];
  favorableColors: string[];
  unfavorableColors: string[];
}

export interface RoomAuditInput {
  mainEntrance: VastuDirection;
  kitchen: VastuDirection;
  masterBedroom: VastuDirection;
  mandir: VastuDirection;
  toilet: VastuDirection;
  livingRoom: VastuDirection;
  staircase: VastuDirection;
  waterStorage: VastuDirection;
}

export interface VastuDosha {
  room: string;
  direction: VastuDirection;
  severity: 'Critical' | 'Moderate' | 'Minor';
  impact: string;
  remedy: string;
  nonDemolitionTools: string[];
}

export interface VastuAuditResult {
  score: number; // 0 - 100
  grade: 'A+ (Mahavastu Auspicious)' | 'A (Auspicious)' | 'B (Moderate - Needs Remedies)' | 'C (Heavy Doshas Present)';
  summary: string;
  elementalBalance: {
    water: number; // %
    fire: number;
    earth: number;
    air: number;
    space: number;
  };
  doshas: VastuDosha[];
  favorablePlacements: { room: string; direction: VastuDirection; benefit: string }[];
  generalRemedies: string[];
}

export const VASTU_ZONES: Record<VastuDirection, VastuZoneDetail> = {
  'North': {
    direction: 'North',
    hindiName: 'उत्तर दिशा (कुबेर स्थान)',
    rulingDeity: 'Lord Kuber (Lord of Wealth)',
    planet: 'Mercury (Budha)',
    element: 'Water',
    attribute: 'Treasury, Career Opportunities, Cash Inflow, Customer Attraction',
    idealRooms: ['Treasury / Cash Safe', 'Living Room', 'Underground Water Sump', 'Balcony', 'Open Garden'],
    forbiddenRooms: ['Toilet', 'Kitchen (Extinguishes Wealth)', 'Heavy Storage', 'Master Bedroom'],
    favorableColors: ['Light Green', 'Sky Blue', 'White'],
    unfavorableColors: ['Red', 'Deep Orange', 'Dark Brown'],
  },
  'North-East': {
    direction: 'North-East',
    hindiName: 'ईशान कोण (देव स्थान)',
    rulingDeity: 'Lord Shiva & Brihaspati (Jupiter)',
    planet: 'Jupiter (Guru)',
    element: 'Water',
    attribute: 'Spiritual Purity, Intuition, Mental Peace, Household Harmony, Divine Blessings',
    idealRooms: ['Mandir / Puja Room', 'Meditation Corner', 'Study Room for Children', 'Underground Borewell'],
    forbiddenRooms: ['Toilet (Major Dosha)', 'Kitchen', 'Staircase', 'Overhead Water Tank', 'Dustbins'],
    favorableColors: ['Light Yellow', 'Cream', 'Off-White', 'Soft Golden'],
    unfavorableColors: ['Dark Red', 'Black', 'Dark Blue'],
  },
  'East': {
    direction: 'East',
    hindiName: 'पूर्व दिशा (इंद्र स्थान)',
    rulingDeity: 'Lord Indra & Lord Surya (Sun)',
    planet: 'Sun (Surya)',
    element: 'Air',
    attribute: 'Social Connections, Recognition, Vital Health, Government Relations',
    idealRooms: ['Main Entrance', 'Living Room', 'Study Desk', 'Verandah', 'Large Windows'],
    forbiddenRooms: ['Toilet', 'Heavy Storage', 'High Walls blocking sunlight'],
    favorableColors: ['Sunlight Gold', 'Light Orange', 'Soft Green'],
    unfavorableColors: ['Dark Charcoal', 'Heavy Greys'],
  },
  'South-East': {
    direction: 'South-East',
    hindiName: 'आग्नेय कोण (अग्नि स्थान)',
    rulingDeity: 'Lord Agni & Shukracharya (Venus)',
    planet: 'Venus (Shukra)',
    element: 'Fire',
    attribute: 'Metabolic Health, Passion, Daily Cashflow, Female Vitality, Kitchen',
    idealRooms: ['Main Kitchen (Cooktop facing East)', 'Electrical Meter / Inverter', 'Generator', 'Gym / Workout'],
    forbiddenRooms: ['Underground Water Tank', 'Puja Room', 'Master Bedroom', 'Toilet'],
    favorableColors: ['Peach', 'Light Pink', 'Pastel Orange', 'Warm Cream'],
    unfavorableColors: ['Navy Blue', 'Black (Water drowns Fire)'],
  },
  'South': {
    direction: 'South',
    hindiName: 'दक्षिण दिशा (यम स्थान)',
    rulingDeity: 'Lord Yama (God of Dharma & Rest)',
    planet: 'Mars (Mangal)',
    element: 'Earth',
    attribute: 'Rest, Reputation, Relaxation, Mental Peace during Sleep',
    idealRooms: ['Secondary Bedroom', 'Staircase', 'Overhead Water Tank', 'Storage'],
    forbiddenRooms: ['Underground Water Tank', 'Main Entrance (without protection)', 'Puja Room'],
    favorableColors: ['Warm Terracotta', 'Sand', 'Brick Red', 'Wood tones'],
    unfavorableColors: ['Cool Light Blues', 'Aqua'],
  },
  'South-West': {
    direction: 'South-West',
    hindiName: 'नैऋत्य कोण (पितृ स्थान)',
    rulingDeity: 'Nirriti & Pitrus (Ancestors)',
    planet: 'Rahu',
    element: 'Earth',
    attribute: 'Stability, Master Authority, Wealth Retention, Relationship Longevity',
    idealRooms: ['Master Bedroom (Head pointing South/East)', 'Heavy Storage / Wardrobes', 'Heavy Machinery'],
    forbiddenRooms: ['Toilet', 'Main Entrance', 'Puja Room', 'Underground Water Tank (Severe Dosha)'],
    favorableColors: ['Earthy Brown', 'Ochre Yellow', 'Warm Beige', 'Clay'],
    unfavorableColors: ['Emerald Green', 'Electric Blue', 'White'],
  },
  'West': {
    direction: 'West',
    hindiName: 'पश्चिम दिशा (वरुण स्थान)',
    rulingDeity: 'Lord Varuna (God of Rain & Seas)',
    planet: 'Saturn (Shani)',
    element: 'Space',
    attribute: 'Business Gains, Profits, Realized Ambitions, Study Focus for Students',
    idealRooms: ['Children Study Room', 'Dining Area', 'Overhead Water Tank', 'Staircase'],
    forbiddenRooms: ['Kitchen', 'Basement without vents', 'Puja Room'],
    favorableColors: ['White', 'Light Silver', 'Ash Grey', 'Steel Blue'],
    unfavorableColors: ['Bright Red', 'Coral'],
  },
  'North-West': {
    direction: 'North-West',
    hindiName: 'वायव्य कोण (वायु स्थान)',
    rulingDeity: 'Lord Vayu & Chandra (Moon)',
    planet: 'Moon (Chandra)',
    element: 'Air',
    attribute: 'Movement, Banking Support, Guest Welcoming, Finished Goods Dispatch',
    idealRooms: ['Guest Bedroom', 'Unmarried Daughter Bedroom', 'Store for Finished Goods', 'Toilet / Washroom'],
    forbiddenRooms: ['Master Bedroom (Creates restlessness)', 'Heavy Safe / Cash Box'],
    favorableColors: ['Cream', 'Silver White', 'Light Grey'],
    unfavorableColors: ['Deep Red', 'Heavy Earthy Brown'],
  },
  'Center (Brahmasthan)': {
    direction: 'Center (Brahmasthan)',
    hindiName: 'ब्रह्मस्थान (केंद्रीय नाभि)',
    rulingDeity: 'Lord Brahma (Creator of Universe)',
    planet: 'Jupiter & Sun',
    element: 'Space',
    attribute: 'Lungs & Heart of the House, Spiritual Energy Circulation, Vital Prana',
    idealRooms: ['Open Courtyard (Aangan)', 'Light Living Room Center', 'Clear Open Space with natural light'],
    forbiddenRooms: ['Pillars / Heavy Load Bearing Column', 'Toilet', 'Kitchen', 'Staircase', 'Underground Sump'],
    favorableColors: ['Pure White', 'Crystal Clear', 'Soft Gold'],
    unfavorableColors: ['Heavy Dark Colors', 'Black'],
  },
};

export function performVastuAudit(input: RoomAuditInput): VastuAuditResult {
  let score = 100;
  const doshas: VastuDosha[] = [];
  const favorablePlacements: { room: string; direction: VastuDirection; benefit: string }[] = [];

  // 1. Main Entrance (Dwar) Check
  if (['North-East', 'North', 'East'].includes(input.mainEntrance)) {
    favorablePlacements.push({
      room: 'Main Entrance (मुख्य द्वार)',
      direction: input.mainEntrance,
      benefit: 'Highly auspicious! Invites uninterrupted positive Prana, wealth flow, and divine luck into the household.',
    });
  } else if (['South-West'].includes(input.mainEntrance)) {
    score -= 22;
    doshas.push({
      room: 'Main Entrance (मुख्य द्वार)',
      direction: input.mainEntrance,
      severity: 'Critical',
      impact: 'South-West entrance (Nairutya Dwar) causes unexpected financial drain, instability in relationships, and stress.',
      remedy: 'Install a Brass / Lead Energy Strip on the threshold, fix a Panchamukhi Hanuman Ji idol above door, and place yellow Vastu pyramid blocks.',
      nonDemolitionTools: ['Lead Threshold Strip', 'Panchamukhi Hanuman Tile', 'Yellow Jasper Pyramids'],
    });
  } else if (['South-East', 'South'].includes(input.mainEntrance)) {
    score -= 12;
    doshas.push({
      room: 'Main Entrance (मुख्य द्वार)',
      direction: input.mainEntrance,
      severity: 'Moderate',
      impact: 'May trigger occasional legal friction or heated family temperaments.',
      remedy: 'Fix a Copper Swastik and Gayatri Mantra plaque above the frame. Keep a red coral crystal.',
      nonDemolitionTools: ['Copper Swastik', 'Gayatri Mantra Plaque', 'Copper Helix'],
    });
  } else {
    // West / North-West
    favorablePlacements.push({
      room: 'Main Entrance (मुख्य द्वार)',
      direction: input.mainEntrance,
      benefit: 'Favorable for trade, networking, and social mobility.',
    });
  }

  // 2. Kitchen (Rasoi) Check
  if (input.kitchen === 'South-East') {
    favorablePlacements.push({
      room: 'Kitchen (रसोई घर)',
      direction: input.kitchen,
      benefit: 'Agneya Kshetra (SE): Optimal fire placement. Ensures metabolic vitality for cook and steady liquidity of family wealth.',
    });
  } else if (input.kitchen === 'North-West') {
    favorablePlacements.push({
      room: 'Kitchen (रसोई घर)',
      direction: input.kitchen,
      benefit: 'Vayavya (NW) is the secondary auspicious fire zone. Balances hospitality and routine cooking.',
    });
  } else if (['North-East', 'North'].includes(input.kitchen)) {
    score -= 25;
    doshas.push({
      room: 'Kitchen (रसोई घर)',
      direction: input.kitchen,
      severity: 'Critical',
      impact: 'Fire in the Water / Dev zone (Ishanya) extinguishes prosperity, triggers digestive ailments, and causes constant mental unrest.',
      remedy: 'Place a natural green marble slab beneath the gas burner, install a copper Vastu ceiling pyramid, and avoid red tones in the kitchen tiles.',
      nonDemolitionTools: ['Green Baroda Marble Slab', 'Copper Ceiling Pyramids', 'Vastu Water Crystal Jar'],
    });
  } else if (input.kitchen === 'South-West') {
    score -= 15;
    doshas.push({
      room: 'Kitchen (रसोई घर)',
      direction: input.kitchen,
      severity: 'Critical',
      impact: 'Affects the authority of the breadwinner and leads to frequent kitchen appliances breakdown.',
      remedy: 'Place a yellow Jaisalmer marble slab under cooktop and stick 3 brass pyramids in the south-west corner.',
      nonDemolitionTools: ['Yellow Marble Slab', 'Brass Vastu Pyramids'],
    });
  } else {
    score -= 8;
    doshas.push({
      room: 'Kitchen (रसोई घर)',
      direction: input.kitchen,
      severity: 'Minor',
      impact: 'Sub-optimal element alignment. Mild fatigue experienced during preparation.',
      remedy: 'Ensure cook faces East while cooking. Keep cooking area well illuminated.',
      nonDemolitionTools: ['Sunlight Simulator LED', 'Copper Swastik'],
    });
  }

  // 3. Master Bedroom Check
  if (input.masterBedroom === 'South-West') {
    favorablePlacements.push({
      room: 'Master Bedroom (शयन कक्ष)',
      direction: input.masterBedroom,
      benefit: 'Nairutya (SW): Supreme earth zone. Ensures deep grounding, sound restorative sleep, and unmatched leadership authority.',
    });
  } else if (['South', 'West'].includes(input.masterBedroom)) {
    favorablePlacements.push({
      room: 'Master Bedroom (शयन कक्ष)',
      direction: input.masterBedroom,
      benefit: 'Solid restful placement. Supports good health and longevity.',
    });
  } else if (['North-East'].includes(input.masterBedroom)) {
    score -= 18;
    doshas.push({
      room: 'Master Bedroom (शयन कक्ष)',
      direction: input.masterBedroom,
      severity: 'Critical',
      impact: 'Bedroom in North-East burdens the divine spiritual zone with worldly attachment, leading to insomnia and relationship discord.',
      remedy: 'Sleep with head strictly pointing South. Keep an Amethyst cluster near bed and avoid heavy wooden wardrobes in North-East corner.',
      nonDemolitionTools: ['Amethyst Cluster', 'Selenite Tower', 'Off-white Bed Linen'],
    });
  } else if (['South-East'].includes(input.masterBedroom)) {
    score -= 10;
    doshas.push({
      room: 'Master Bedroom (शयन कक्ष)',
      direction: input.masterBedroom,
      severity: 'Moderate',
      impact: 'Excess Agni (Fire) triggers fiery temperaments, sleep interruptions, and minor arguments between couples.',
      remedy: 'Use soft pastel or cream wall colors. Place a bowl of natural Himalayan pink rock salt on nightstand to absorb fiery vibrations.',
      nonDemolitionTools: ['Himalayan Pink Rock Salt Bowl', 'Rose Quartz Sphere'],
    });
  }

  // 4. Mandir / Puja Room Check
  if (input.mandir === 'North-East') {
    favorablePlacements.push({
      room: 'Mandir / Puja Room (पूजा घर)',
      direction: input.mandir,
      benefit: 'Supreme Ishanya alignment! Grants divine grace, spiritual enlightenment, high intelligence, and cosmic tranquility.',
    });
  } else if (['North', 'East'].includes(input.mandir)) {
    favorablePlacements.push({
      room: 'Mandir / Puja Room (पूजा घर)',
      direction: input.mandir,
      benefit: 'Highly auspicious directional flow for daily prayers and mental tranquility.',
    });
  } else if (['South', 'South-West'].includes(input.mandir)) {
    score -= 15;
    doshas.push({
      room: 'Mandir / Puja Room (पूजा घर)',
      direction: input.mandir,
      severity: 'Moderate',
      impact: 'Heavy Tamasic / Earth zones are unsuited for Sattvic deity worship.',
      remedy: 'Elevate temple on wooden pedestal, ensure deity faces East or West, and keep a burning brass Akhand Diya with pure cow ghee.',
      nonDemolitionTools: ['Elevated Teakwood Chowki', 'Brass Bell', 'Sphatik Shri Yantra'],
    });
  }

  // 5. Toilet / Bathroom Check
  if (['North-West', 'West', 'South-South-West'].includes(input.toilet)) {
    favorablePlacements.push({
      room: 'Toilet / Drainage (शौचालय)',
      direction: input.toilet,
      benefit: 'Ideal disposal zone (Vayavya/West). Easily flushes out negative household toxins and bodily waste.',
    });
  } else if (['North-East'].includes(input.toilet)) {
    score -= 30; // Maximum Dosha in Vastu
    doshas.push({
      room: 'Toilet / Drainage (शौचालय)',
      direction: input.toilet,
      severity: 'Critical',
      impact: 'Mahadosha: Toilet in Ishanya creates chronic neuro-health issues, stagnant finances, and blocks children progress.',
      remedy: 'Never leave commode lid open. Place a bronze Vastu pyramid, insert a Zinc / Brass strip in floor threshold, keep sea salt bowl, and place a Spider Plant.',
      nonDemolitionTools: ['Zinc Floor Strip (Threshold Blocker)', 'Vastu Sea Salt Ceramic Jar', 'Spider Plant (Air Purifier)'],
    });
  } else if (['North', 'East'].includes(input.toilet)) {
    score -= 15;
    doshas.push({
      room: 'Toilet / Drainage (शौचालय)',
      direction: input.toilet,
      severity: 'Moderate',
      impact: 'Drains positive social opportunities and dampens immune resilience.',
      remedy: 'Install a Copper threshold wire, hang a mirror on outer door to reflect energy, and keep camphor lamp.',
      nonDemolitionTools: ['Copper Strip Threshold', 'Outer Door Convex Mirror'],
    });
  } else if (['South-West'].includes(input.toilet)) {
    score -= 20;
    doshas.push({
      room: 'Toilet / Drainage (शौचालय)',
      direction: input.toilet,
      severity: 'Critical',
      impact: 'Flushes away family stability, leading to relationship cracks and loss of savings.',
      remedy: 'Insert a 3-inch thick Yellow Lead tape along the boundary of commode, place 3 brass pyramids, and burn loban/camphor.',
      nonDemolitionTools: ['Yellow Lead Commode Tape', 'Brass Pyramids Set of 3'],
    });
  }

  // Ensure bounded score
  const finalScore = Math.max(35, Math.min(100, score));

  let grade: VastuAuditResult['grade'] = 'A+ (Mahavastu Auspicious)';
  let summary = '';

  if (finalScore >= 85) {
    grade = 'A+ (Mahavastu Auspicious)';
    summary = 'Exceptional Vastu harmony! Your residence aligns closely with the cosmic Vastu Purusha Mandala, generating consistent wealth, vitality, and family happiness.';
  } else if (finalScore >= 70) {
    grade = 'A (Auspicious)';
    summary = 'Very good Vastu balance. Minor directional adjustments or non-demolition crystal cures will further amplify your peace and financial prosperity.';
  } else if (finalScore >= 55) {
    grade = 'B (Moderate - Needs Remedies)';
    summary = 'Noticeable Vastu doshas detected in key energy sectors. Applying the recommended non-demolition elemental remedies will neutralize negative blockages quickly.';
  } else {
    grade = 'C (Heavy Doshas Present)';
    summary = 'Significant Vastu afflictions detected in sacred zones (Ishanya/Nairutya). Immediate deployment of threshold barrier tapes, pyramids, and salt cures is strongly recommended.';
  }

  // Calculate Elemental Balance approximate
  const water = (input.mandir === 'North-East' ? 30 : 15) + (input.kitchen !== 'North-East' ? 20 : 0);
  const fire = (input.kitchen === 'South-East' ? 40 : 20);
  const earth = (input.masterBedroom === 'South-West' ? 40 : 20);
  const air = (input.mainEntrance === 'East' || input.toilet === 'North-West' ? 35 : 20);
  const space = 25;

  const total = water + fire + earth + air + space;
  const elementalBalance = {
    water: Math.round((water / total) * 100),
    fire: Math.round((fire / total) * 100),
    earth: Math.round((earth / total) * 100),
    air: Math.round((air / total) * 100),
    space: Math.round((space / total) * 100),
  };

  const generalRemedies = [
    'Light a pure cow ghee lamp or Kapoor (Camphor) every evening at twilight (Sandhya Kaal) to purify atmospheric Prana.',
    'Keep North and North-East corners impeccably clean, clutter-free, and bathed in gentle warm light.',
    'Place a bowl of unrefined raw sea salt in bathrooms and replace it every 15 days to absorb stale toxic energy.',
    'Hang a traditional Brass Swastik or auspicious Om symbol on the outside of your main entrance door.',
    'Ensure water taps and showerheads do not constantly drip; leaking water represents financial drain in Vastu Shastra.',
  ];

  return {
    score: finalScore,
    grade,
    summary,
    elementalBalance,
    doshas,
    favorablePlacements,
    generalRemedies,
  };
}
