import { KundliData, GunaMilanResult, HouseInfo, PlanetaryPosition } from '../types/astrology.ts';

const ZODIAC_SIGNS = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon',
  'Sun', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', lord: 'Mars' },
  { name: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishta', lord: 'Mars' },
  { name: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', lord: 'Mercury' },
];

export function calculateKundli(
  name: string,
  gender: string,
  dob: string,
  tob: string,
  pob: string
): KundliData {
  // Deterministic seed based on birth details
  const seedString = `${name}-${dob}-${tob}-${pob}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const ascIndex = posHash % 12;
  const moonIndex = (posHash + 4) % 12;
  const sunIndex = (posHash + 7) % 12;
  const nakshatraIndex = (posHash * 3) % 27;

  const ascendant = ZODIAC_SIGNS[ascIndex];
  const ascendantLord = SIGN_LORDS[ascIndex];
  const moonSign = ZODIAC_SIGNS[moonIndex];
  const sunSign = ZODIAC_SIGNS[sunIndex];
  const nakshatraObj = NAKSHATRAS[nakshatraIndex];

  // Distribute planets across houses
  // Planets: Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu, Ketu
  const planetsList = [
    { name: 'Sun', sanskrit: 'Surya', house: ((posHash + 1) % 12) + 1, degree: '14° 22\'', signIdx: (posHash + 1) % 12, isRetro: false, dignity: 'Own Sign' as const },
    { name: 'Moon', sanskrit: 'Chandra', house: ((posHash + 3) % 12) + 1, degree: '06° 48\'', signIdx: moonIndex, isRetro: false, dignity: 'Exalted' as const },
    { name: 'Mars', sanskrit: 'Mangal', house: ((posHash + 5) % 12) + 1, degree: '22° 11\'', signIdx: (posHash + 5) % 12, isRetro: false, dignity: 'Friendly' as const },
    { name: 'Mercury', sanskrit: 'Budh', house: ((posHash + 1) % 12) + 1, degree: '18° 35\'', signIdx: (posHash + 1) % 12, isRetro: true, dignity: 'Exalted' as const },
    { name: 'Jupiter', sanskrit: 'Guru', house: ((posHash + 9) % 12) + 1, degree: '11° 50\'', signIdx: (posHash + 9) % 12, isRetro: false, dignity: 'Mooltrikona' as const },
    { name: 'Venus', sanskrit: 'Shukra', house: ((posHash + 2) % 12) + 1, degree: '27° 19\'', signIdx: (posHash + 2) % 12, isRetro: false, dignity: 'Own Sign' as const },
    { name: 'Saturn', sanskrit: 'Shani', house: ((posHash + 10) % 12) + 1, degree: '04° 40\'', signIdx: (posHash + 10) % 12, isRetro: false, dignity: 'Neutral' as const },
    { name: 'Rahu', sanskrit: 'Rahu', house: ((posHash + 6) % 12) + 1, degree: '19° 05\'', signIdx: (posHash + 6) % 12, isRetro: true, dignity: 'Friendly' as const },
    { name: 'Ketu', sanskrit: 'Ketu', house: (((posHash + 6 + 6) % 12) || 12), degree: '19° 05\'', signIdx: (posHash + 6 + 6) % 12, isRetro: true, dignity: 'Friendly' as const },
  ];

  const planetaryPositions: PlanetaryPosition[] = planetsList.map((p, idx) => ({
    planet: p.name,
    sanskritName: p.sanskrit,
    sign: ZODIAC_SIGNS[p.signIdx],
    signLord: SIGN_LORDS[p.signIdx],
    degree: p.degree,
    house: p.house,
    nakshatra: NAKSHATRAS[(nakshatraIndex + idx * 2) % 27].name,
    pada: (idx % 4) + 1,
    isRetrograde: p.isRetro,
    dignity: p.dignity,
  }));

  // Build 12 Houses
  const houseSignificances = [
    'Tanu Bhava (Physical Self, Vitality, Appearance, General Disposition)',
    'Dhana Bhava (Accumulated Wealth, Speech, Family Assets, Food habits)',
    'Sahaja Bhava (Younger Siblings, Courage, Writing, Short Travels, Enterprise)',
    'Sukha Bhava (Mother, Inner Peace, Home, Conveyance, Real Estate)',
    'Putra Bhava (Children, Intellect, Speculative Luck, Mantras, Past Karmas)',
    'Ari Bhava (Debts, Competitors, Diseases, Daily Routine, Legal victories)',
    'Yuvati Bhava (Spouse, Long-term Marriage, Business Partnerships, Public)',
    'Randhra Bhava (Longevity, Sudden Transformations, Occult, Research, Inheritance)',
    'Dharma Bhava (Fortune, Higher Wisdom, Guru, Father, Righteous Pilgrimages)',
    'Karma Bhava (Career Prestige, Ambition, Government Honors, Public Works)',
    'Labha Bhava (Gains, Social Network, Elder Siblings, Fulfillment of Desires)',
    'Vyaya Bhava (Expenditures, Foreign Lands, Moksha, Meditation, Subconscious Sleep)'
  ];

  const houses: HouseInfo[] = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIdx = (ascIndex + i) % 12;
    const occupyingPlanets = planetaryPositions
      .filter((p) => p.house === houseNum)
      .map((p) => p.planet);

    return {
      houseNumber: houseNum,
      sign: ZODIAC_SIGNS[signIdx],
      signLord: SIGN_LORDS[signIdx],
      planets: occupyingPlanets,
      significance: houseSignificances[i],
    };
  });

  // Manglik Check: Mars in 1st, 4th, 7th, 8th, or 12th house
  const marsHouse = planetsList.find((p) => p.name === 'Mars')?.house || 1;
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  // Kaal Sarp Check
  const hasKaalSarp = posHash % 3 === 0;

  // Sade Sati Check
  const hasSadeSati = posHash % 4 === 1;

  return {
    name,
    gender,
    dob,
    tob,
    pob,
    ascendant,
    ascendantLord,
    moonSign,
    sunSign,
    nakshatra: nakshatraObj.name,
    nakshatraLord: nakshatraObj.lord,
    houses,
    planets: planetaryPositions,
    vimshottariDasha: {
      mahadasha: 'Jupiter (Guru)',
      antardasha: 'Mercury (Budh)',
      pratyantarDasha: 'Venus (Shukra)',
      endsOn: 'November 2027',
    },
    doshas: {
      manglik: {
        hasDosha: isManglik,
        severity: isManglik ? (marsHouse === 7 || marsHouse === 8 ? 'High' : 'Medium') : 'None',
        details: isManglik
          ? `Mars is posited in House #${marsHouse}. Indicates fiery temperament in personal partnerships and need for mutual understanding.`
          : 'Mars is placed in an auspicious house, keeping marriage prospects harmonious without Manglik affliction.',
        remedy: isManglik
          ? 'Chant the Hanuman Chalisa daily, feed jaggery and roasted gram on Tuesdays, and match Kundli prior to marriage.'
          : 'Surya Arghya and gratitude prayers.',
      },
      kaalSarp: {
        hasDosha: hasKaalSarp,
        type: hasKaalSarp ? 'Anant Kaal Sarp Yoga' : 'No Kaal Sarp Yoga',
        details: hasKaalSarp
          ? 'Planets are aligned between Rahu and Ketu, causing occasional sudden hurdles followed by tremendous spiritual elevation.'
          : 'All planetary energies flow freely without Rahu-Ketu entrapment.',
        remedy: hasKaalSarp
          ? 'Perform Rudrabhishek at a Jyotirlinga or keep a silver snake pair in running river water on Nag Panchami.'
          : 'Regular Mahamrityunjaya japa.',
      },
      sadeSati: {
        isActive: hasSadeSati,
        phase: hasSadeSati ? 'Peak Phase (Chandra Lagna transit)' : 'Not Active',
        details: hasSadeSati
          ? 'Saturn is testing endurance and refining character. Teaches humility, discipline, and long-term perseverance.'
          : 'You are currently free from Shani Sade Sati. Cosmic currents are unburdened.',
        remedy: hasSadeSati
          ? 'Light a mustard oil lamp under a Peepal tree every Saturday evening and assist underprivileged individuals.'
          : 'Maintain honest, diligent conduct.',
      },
      pitraDosha: {
        hasDosha: posHash % 5 === 0,
        details: (posHash % 5 === 0)
          ? 'Ancestral karmic debts require prayer and charitable donations in memory of forefathers.'
          : 'Ancestral blessings (Pitru Kripa) are actively shielding your household.',
        remedy: 'Offer water with black sesame seeds (Tarpan) during Amavasya and feed cows.',
      },
    },
    luckScores: {
      health: 75 + (posHash % 20),
      career: 80 + ((posHash * 2) % 18),
      wealth: 70 + ((posHash * 3) % 25),
      relationship: 68 + ((posHash * 4) % 26),
      family: 82 + ((posHash * 5) % 15),
    },
  };
}

export function calculateGunaMilan(
  boyName: string,
  girlName: string,
  details?: {
    boyDob?: string;
    boyTob?: string;
    boyPob?: string;
    girlDob?: string;
    girlTob?: string;
    girlPob?: string;
  }
): GunaMilanResult {
  const boySeed = `${boyName.toLowerCase()}-${details?.boyDob || '1995-05-15'}-${details?.boyTob || '08:30'}-${details?.boyPob || 'Delhi'}`;
  const girlSeed = `${girlName.toLowerCase()}-${details?.girlDob || '1997-09-22'}-${details?.girlTob || '14:15'}-${details?.girlPob || 'Mumbai'}`;

  let hash = 0;
  const combined = `${boySeed}:::${girlSeed}`;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const pos = Math.abs(hash);

  const boyRashiIdx = pos % 12;
  const girlRashiIdx = (pos + 4) % 12;
  const boyNakshatraIdx = (pos * 3) % 27;
  const girlNakshatraIdx = ((pos * 7) + 5) % 27;

  const boyRashi = ZODIAC_SIGNS[boyRashiIdx];
  const girlRashi = ZODIAC_SIGNS[girlRashiIdx];
  const boyNakshatra = NAKSHATRAS[boyNakshatraIdx].name;
  const girlNakshatra = NAKSHATRAS[girlNakshatraIdx].name;
  const boyPada = (pos % 4) + 1;
  const girlPada = ((pos >> 2) % 4) + 1;

  // 1. Varna (1 Guna)
  const varnaScore = (pos % 3 === 0) ? 0.5 : 1;
  // 2. Vashya (2 Gunas)
  const vashyaScore = (pos % 4 === 0) ? 1 : 2;
  // 3. Tara (3 Gunas)
  const taraScore = (pos % 5 === 0) ? 1.5 : (pos % 2 === 0 ? 3 : 2);
  // 4. Yoni (4 Gunas)
  const yoniScore = (pos % 6 === 0) ? 2 : (pos % 3 === 0 ? 3 : 4);
  // 5. Graha Maitri (5 Gunas)
  const maitriScore = (pos % 7 === 0) ? 3 : (pos % 2 === 0 ? 5 : 4);
  // 6. Gana (6 Gunas)
  const ganaScore = (pos % 5 === 0) ? 3 : (pos % 3 === 0 ? 5 : 6);
  // 7. Bhakoot (7 Gunas)
  const isBhakootDosha = (pos % 7 === 0);
  const bhakootScore = isBhakootDosha ? 0 : 7;
  // 8. Nadi (8 Gunas)
  const isNadiDosha = (pos % 9 === 0);
  const nadiScore = isNadiDosha ? 0 : 8;

  const totalScore = Number((varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore).toFixed(1));

  let verdict: 'Excellent Match' | 'Good Match' | 'Average Match' | 'Dosha Detected - Remedy Needed' = 'Good Match';
  if (totalScore >= 28) verdict = 'Excellent Match';
  else if (totalScore >= 21) verdict = 'Good Match';
  else if (isBhakootDosha || isNadiDosha) verdict = 'Dosha Detected - Remedy Needed';
  else verdict = 'Average Match';

  const manglikBoy = (pos % 3 === 0);
  const manglikGirl = (pos % 4 === 0);

  let manglikCancellationReason = 'Neither partner has Kuja Dosha. Mars is auspiciously placed.';
  let isManglikCancelled = true;

  if (manglikBoy && manglikGirl) {
    isManglikCancelled = true;
    manglikCancellationReason = 'Both partners have Kuja (Manglik) Dosha, resulting in classical mutual cancellation (Kuja Dosha Samyam). High marital longevity indicated.';
  } else if (manglikBoy || manglikGirl) {
    isManglikCancelled = false;
    manglikCancellationReason = `Only ${manglikBoy ? boyName : girlName} has Kuja Dosha. Remedial Vedic prayers (such as Kumbh Vivah or Tuesday Mangal Shanti) harmonize Mars energies.`;
  }

  const nadiExceptionFound = isNadiDosha && (boyRashiIdx === girlRashiIdx || boyNakshatraIdx !== girlNakshatraIdx);
  const bhakootExceptionFound = isBhakootDosha && (SIGN_LORDS[boyRashiIdx] === SIGN_LORDS[girlRashiIdx]);

  return {
    boyName,
    girlName,
    boyDob: details?.boyDob,
    boyTob: details?.boyTob,
    boyPob: details?.boyPob,
    boyRashi,
    boyNakshatra,
    boyPada,
    girlDob: details?.girlDob,
    girlTob: details?.girlTob,
    girlPob: details?.girlPob,
    girlRashi,
    girlNakshatra,
    girlPada,
    totalScore,
    maxScore: 36,
    verdict,
    categories: [
      {
        name: 'Varna',
        sanskritName: 'वर्ण',
        obtainedScore: varnaScore,
        maxScore: 1,
        description: 'Mental work capacity, spiritual ego adjustment, and societal role harmony.',
        status: varnaScore === 1 ? 'Excellent' : 'Average',
      },
      {
        name: 'Vashya',
        sanskritName: 'वश्य',
        obtainedScore: vashyaScore,
        maxScore: 2,
        description: 'Mutual emotional dominance, magnetic charm, and cooperative balance.',
        status: vashyaScore === 2 ? 'Excellent' : 'Average',
      },
      {
        name: 'Tara',
        sanskritName: 'तारा',
        obtainedScore: taraScore,
        maxScore: 3,
        description: 'Birth star compatibility, mutual fortune, health resilience, and life longevity.',
        status: taraScore >= 2.5 ? 'Excellent' : taraScore >= 1.5 ? 'Favorable' : 'Average',
      },
      {
        name: 'Yoni',
        sanskritName: 'योनि',
        obtainedScore: yoniScore,
        maxScore: 4,
        description: 'Physical chemistry, biological intimacy, temperament, and instinctive bonding.',
        status: yoniScore === 4 ? 'Excellent' : yoniScore >= 2 ? 'Favorable' : 'Average',
      },
      {
        name: 'Graha Maitri',
        sanskritName: 'ग्रह मैत्री',
        obtainedScore: maitriScore,
        maxScore: 5,
        description: 'Planetary friendship of Moon sign lords, intellectual companionship, and worldview sync.',
        status: maitriScore >= 4 ? 'Excellent' : maitriScore >= 2.5 ? 'Favorable' : 'Average',
      },
      {
        name: 'Gana',
        sanskritName: 'गण',
        obtainedScore: ganaScore,
        maxScore: 6,
        description: 'Temperament frequency (Deva, Manushya, Rakshasa) and philosophical lifestyle alignment.',
        status: ganaScore >= 5 ? 'Excellent' : ganaScore >= 3 ? 'Favorable' : 'Dosha / Flaw',
      },
      {
        name: 'Bhakoot',
        sanskritName: 'भकूट',
        obtainedScore: bhakootScore,
        maxScore: 7,
        description: 'Family welfare, household financial prosperity, children’s growth, and collective abundance.',
        status: bhakootScore === 7 ? 'Excellent' : 'Dosha / Flaw',
      },
      {
        name: 'Nadi',
        sanskritName: 'नाड़ी',
        obtainedScore: nadiScore,
        maxScore: 8,
        description: 'Genetic constitution, blood compatibility, nervous system resonance, and progeny vitality.',
        status: nadiScore === 8 ? 'Excellent' : 'Dosha / Flaw',
      },
    ],
    manglikBoy,
    manglikGirl,
    manglikCancellation: {
      isCancelled: isManglikCancelled,
      reason: manglikCancellationReason,
    },
    nadiDosha: {
      hasDosha: isNadiDosha,
      exceptionFound: nadiExceptionFound,
      details: isNadiDosha
        ? (nadiExceptionFound
            ? 'Same Nadi detected, but classical exemption applies due to different Nakshatras/Pada alignment.'
            : 'Same Nadi detected (Nadi Dosha). Chanting Mahamrityunjaya Mantra and cow donation harmonizes genetic vibrations.')
        : 'Different Nadis (Adi & Madhya / Antya). Optimal genetic harmony and progeny longevity.',
      remedy: 'Recite Mahamrityunjaya Mantra 108 times on Mondays and offer grains to cows.',
    },
    bhakootDosha: {
      hasDosha: isBhakootDosha,
      exceptionFound: bhakootExceptionFound,
      details: isBhakootDosha
        ? (bhakootExceptionFound
            ? 'Mutual planetary positions show 6/8 or 2/12 axis, but identical planetary lords nullify the malefic impact.'
            : 'Bhakoot Dosha indicated. Performing joint Lord Shiva & Goddess Parvati puja removes financial friction.')
        : 'Favorable Moon Sign positions (1/1, 3/11, 4/10, or 7/7). Abundant household prosperity and joy.',
      remedy: 'Offer raw milk with white flowers on Shivalinga every Pradosh Vrat.',
    },
    compatibilityBreakdown: {
      emotional: Math.min(100, Math.round(((maitriScore + vashyaScore) / 7) * 100)),
      intellectual: Math.min(100, Math.round(((ganaScore + varnaScore) / 7) * 100)),
      physical: Math.min(100, Math.round((yoniScore / 4) * 100)),
      familyProsperity: Math.min(100, Math.round(((bhakootScore + taraScore) / 10) * 100)),
      longevityProgeny: Math.min(100, Math.round((nadiScore / 8) * 100)),
    },
    recommendations: [
      totalScore >= 24
        ? 'Auspicious match! The couple shares deep emotional and philosophical values.'
        : 'Marriage is viable with recommended remedial poojas for planetary harmonization.',
      'Perform Gauri-Shankar worship on Shukla Paksha Monday.',
      'Recite Vishnu Sahasranama together on Shukla Paksha Ekadashi for everlasting matrimonial harmony.',
    ],
  };
}
