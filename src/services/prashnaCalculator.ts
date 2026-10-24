// Vedic Horary & Krishnamurti Paddhati (KP) Prashna Kundli Calculator
// Designed for seekers who do not possess their exact time of birth

import { PrashnaCalculationResult } from '../types/astrology.ts';

const ZODIAC_SIGNS = [
  'Aries (Mesha)',
  'Taurus (Vrishabha)',
  'Gemini (Mithuna)',
  'Cancer (Karka)',
  'Leo (Simha)',
  'Virgo (Kanya)',
  'Libra (Tula)',
  'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)',
  'Capricorn (Makara)',
  'Aquarius (Kumbha)',
  'Pisces (Meena)',
];

const SIGN_LORDS: Record<string, string> = {
  'Aries (Mesha)': 'Mars (Mangal)',
  'Taurus (Vrishabha)': 'Venus (Shukra)',
  'Gemini (Mithuna)': 'Mercury (Budha)',
  'Cancer (Karka)': 'Moon (Chandra)',
  'Leo (Simha)': 'Sun (Surya)',
  'Virgo (Kanya)': 'Mercury (Budha)',
  'Libra (Tula)': 'Venus (Shukra)',
  'Scorpio (Vrishchika)': 'Mars (Mangal)',
  'Sagittarius (Dhanu)': 'Jupiter (Guru)',
  'Capricorn (Makara)': 'Saturn (Shani)',
  'Aquarius (Kumbha)': 'Saturn (Shani)',
  'Pisces (Meena)': 'Jupiter (Guru)',
};

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export function calculatePrashnaKundli(params: {
  question: string;
  category: 'Career' | 'Marriage' | 'Finance' | 'Health' | 'Travel' | 'Lost Item' | 'General';
  prashnaNumber: number; // 1 to 249
  location?: string;
}): PrashnaCalculationResult {
  const seed = Math.max(1, Math.min(249, params.prashnaNumber));
  const now = new Date();

  // 1. Calculate Prashna Lagna from 249 KP Sub divisions
  const signIndex = Math.floor(((seed - 1) * 12) / 249);
  const prashnaLagna = ZODIAC_SIGNS[signIndex % 12];
  const lagnaLord = SIGN_LORDS[prashnaLagna];

  // 2. Moon coordinates for current query moment
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const moonNakshatraIndex = (dayOfYear * 2 + now.getHours()) % 27;
  const moonNakshatra = NAKSHATRAS[moonNakshatraIndex];
  const moonSignIndex = Math.floor(moonNakshatraIndex / 2.25) % 12;
  const moonSign = ZODIAC_SIGNS[moonSignIndex];

  // 3. Significant House (Karyesh Bhava) based on Category
  let karyeshHouse = 1;
  let targetLord = 'Jupiter (Guru)';

  switch (params.category) {
    case 'Career':
      karyeshHouse = 10;
      targetLord = 'Sun (Surya) & Mercury (Budha)';
      break;
    case 'Marriage':
      karyeshHouse = 7;
      targetLord = 'Venus (Shukra) & Jupiter (Guru)';
      break;
    case 'Finance':
      karyeshHouse = 11;
      targetLord = 'Mercury (Budha) & Jupiter (Guru)';
      break;
    case 'Health':
      karyeshHouse = 1;
      targetLord = 'Sun (Surya) & Mars (Mangal)';
      break;
    case 'Travel':
      karyeshHouse = 9;
      targetLord = 'Moon (Chandra) & Jupiter (Guru)';
      break;
    case 'Lost Item':
      karyeshHouse = 2;
      targetLord = 'Moon (Chandra)';
      break;
    default:
      karyeshHouse = 1;
      targetLord = lagnaLord;
  }

  // 4. Mathematical Parashari / KP Verdict Determination
  // Seeds with harmonious mathematical resonances (sub-lord aspect with benefic Grahas)
  const isHarmonious = (seed % 3 !== 0 && seed % 7 !== 0) || (seed >= 100 && seed <= 140) || seed % 5 === 0;
  const isDelayed = seed % 3 === 0 && seed % 2 !== 0;

  let verdict: 'Favorable (कार्य सिद्धि)' | 'Delayed Success (प्रयास से सिद्धि)' | 'Unfavorable / Obstacles (बाधा युक्त)';
  let confidencePercentage: number;
  let timeframeForecast: string;
  let detailedAnalysis: string;
  let prescribedRemedy: string;
  let suggestedAction: string;

  if (isHarmonious) {
    verdict = 'Favorable (कार्य सिद्धि)';
    confidencePercentage = 84 + (seed % 14);
    timeframeForecast = params.category === 'Career' ? 'Within 3 to 7 weeks' : 'Within 15 to 45 days';
    detailedAnalysis = `The Horary Lagna (${prashnaLagna}) and the 11th Labha house establish a favorable mutual aspect (Ithasala Yoga). The Karyesh for your query connects directly with benefic Jupiter. The universal Prana at the moment of your thought confirms completion of your goal with fruitful results.`;
    prescribedRemedy = 'Chant "ॐ नमो भगवते वासुदेवाय" 21 times in the morning. Feed a sacred cow with jaggery and wheat on Thursday.';
    suggestedAction = 'Proceed with confidence. The cosmic currents support initiating negotiations and formal commitments.';
  } else if (isDelayed) {
    verdict = 'Delayed Success (प्रयास से सिद्धि)';
    confidencePercentage = 68 + (seed % 12);
    timeframeForecast = 'Between 2 to 4 months (After initial revision)';
    detailedAnalysis = `The query moment reveals a Nakshatra Sub-Lord governed by Saturn. While the fundamental promise is positive, initial bureaucratic, familial, or procedural hurdles will test patience. Rushing decisions under emotional haste must be avoided.`;
    prescribedRemedy = 'Light a sesame oil lamp under a Peepal tree on Saturday evening. Recite Hanuman Chalisa daily at twilight.';
    suggestedAction = 'Do not take rejection as permanent. Re-apply or follow up after 21 days with refined documentation.';
  } else {
    verdict = 'Unfavorable / Obstacles (बाधा युक्त)';
    confidencePercentage = 75 + (seed % 15);
    timeframeForecast = 'Review needed after current Lunar cycle (30 days)';
    detailedAnalysis = `The Prashna chart indicates affliction to the 6th/8th house axis. There is hidden competition, lack of transparency, or unforeseen financial leaks associated with this specific proposition. Immediate venture without contractual scrutiny will create disputes.`;
    prescribedRemedy = 'Recite Durga Saptashati Argala Stotram. Avoid signing long-term partnership deeds on Tuesdays or during Rahu Kaal.';
    suggestedAction = 'Pause and verify all clauses. Seek an independent second opinion before committing resources.';
  }

  return {
    id: 'prashna-' + Date.now(),
    question: params.question,
    category: params.category,
    prashnaNumber: seed,
    queryTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    queryDate: now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    location: params.location || 'Kolkata, WB (22.57° N, 88.36° E)',
    prashnaLagna,
    prashnaLagnaLord: lagnaLord,
    moonSign,
    moonNakshatra,
    rulingPlanets: [lagnaLord, targetLord, 'Moon (Chandra)'],
    karyeshPlanet: targetLord,
    karyeshHouse,
    verdict,
    confidencePercentage,
    timeframeForecast,
    detailedAnalysis,
    prescribedRemedy,
    suggestedAction,
  };
}
