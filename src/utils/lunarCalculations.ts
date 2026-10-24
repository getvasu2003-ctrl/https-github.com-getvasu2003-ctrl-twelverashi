import { LunarPhaseType, LunarCalendarDay, LunarPhaseEvent } from '../types/astrology.ts';
import { LUNAR_PHASE_EVENTS } from '../data/lunarCalendarData.ts';

// Known Astronomical New Moon Epoch: January 6, 2000, 18:14 UTC
const KNOWN_NEW_MOON_EPOCH = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
const SYNODIC_MONTH = 29.53058867; // Mean synodic period in days
const MS_PER_DAY = 86400000;

export interface MoonPhaseDetails {
  phaseType: LunarPhaseType;
  phaseName: string;
  phaseNameHi: string;
  icon: string;
  illuminationPct: number;
  ageDays: number;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  tithiName: string;
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
}

const TITHI_NAMES = [
  'Pratipada (प्रतिपदा)',
  'Dwitiya (द्वितीया)',
  'Tritiya (तृतीया)',
  'Chaturthi (चतुर्थी)',
  'Panchami (पंचमी)',
  'Shashti (षष्ठी)',
  'Saptami (सप्तमी)',
  'Ashtami (अष्टमी)',
  'Navami (नवमी)',
  'Dashami (दशमी)',
  'Ekadashi (एकादशी)',
  'Dwadashi (द्वादशी)',
  'Trayodashi (त्रयोदशी)',
  'Chaturdashi (चतुर्दशी)',
  'Purnima / Amavasya',
];

/**
 * Calculates high-precision astronomical lunar phase for any date
 */
export function calculateMoonPhase(date: Date): MoonPhaseDetails {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON_EPOCH) / MS_PER_DAY;
  let phaseDays = diffDays % SYNODIC_MONTH;
  if (phaseDays < 0) {
    phaseDays += SYNODIC_MONTH;
  }

  // Fraction of cycle (0.0 to 1.0)
  const cycleFraction = phaseDays / SYNODIC_MONTH;

  // Illumination formula based on lunar phase angle
  // 0% at New Moon (0.0 & 1.0), 100% at Full Moon (~0.5)
  const angle = cycleFraction * 2 * Math.PI;
  const illuminationFraction = (1 - Math.cos(angle)) / 2;
  const illuminationPct = Math.round(illuminationFraction * 100);

  // Check specific curated event match first (for perfect precision)
  const dateStr = formatDateKey(date);
  const matchedEvent = LUNAR_PHASE_EVENTS.find((e) => e.date === dateStr);

  let phaseType: LunarPhaseType;
  let phaseName = '';
  let phaseNameHi = '';
  let icon = '🌕';

  if (matchedEvent) {
    if (matchedEvent.type === 'full_moon') {
      phaseType = 'full_moon';
      phaseName = 'Full Moon (Purnima)';
      phaseNameHi = 'पूर्णिमा (पूर्ण चन्द्र)';
      icon = '🌕';
    } else if (matchedEvent.type === 'new_moon') {
      phaseType = 'new_moon';
      phaseName = 'New Moon (Amavasya)';
      phaseNameHi = 'अमावस्या (दर्श चन्द्र)';
      icon = '🌑';
    } else {
      phaseType = 'waxing_gibbous';
      phaseName = 'Vrat Phase';
      phaseNameHi = 'व्रत पर्व';
      icon = '🌔';
    }
  } else {
    // Astronomical interval boundaries
    if (phaseDays < 1.4 || phaseDays >= 28.2) {
      phaseType = 'new_moon';
      phaseName = 'New Moon (Amavasya)';
      phaseNameHi = 'अमावस्या';
      icon = '🌑';
    } else if (phaseDays < 6.8) {
      phaseType = 'waxing_crescent';
      phaseName = 'Waxing Crescent';
      phaseNameHi = 'शुक्ल द्वितीया-पंचमी';
      icon = '🌒';
    } else if (phaseDays < 8.2) {
      phaseType = 'first_quarter';
      phaseName = 'First Quarter (Half Moon)';
      phaseNameHi = 'शुक्ल अष्टमी (दुर्गाष्टमी)';
      icon = '🌓';
    } else if (phaseDays < 13.6) {
      phaseType = 'waxing_gibbous';
      phaseName = 'Waxing Gibbous';
      phaseNameHi = 'शुक्ल एकादशी-चतुर्दशी';
      icon = '🌔';
    } else if (phaseDays < 16.0) {
      phaseType = 'full_moon';
      phaseName = 'Full Moon (Purnima)';
      phaseNameHi = 'पूर्णिमा';
      icon = '🌕';
    } else if (phaseDays < 21.2) {
      phaseType = 'waning_gibbous';
      phaseName = 'Waning Gibbous';
      phaseNameHi = 'कृष्ण प्रतिपदा-पंचमी';
      icon = '🌖';
    } else if (phaseDays < 22.8) {
      phaseType = 'third_quarter';
      phaseName = 'Third Quarter (Half Moon)';
      phaseNameHi = 'कृष्ण अष्टमी (काल भैरवाष्टमी)';
      icon = '🌗';
    } else {
      phaseType = 'waning_crescent';
      phaseName = 'Waning Crescent';
      phaseNameHi = 'कृष्ण एकादशी-चतुर्दशी';
      icon = '🌘';
    }
  }

  // Vedic Paksha determination
  const isShukla = phaseDays < 14.765;
  const paksha: 'Shukla Paksha' | 'Krishna Paksha' = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';

  // Calculate approximate Tithi (each tithi is ~0.9843 days)
  const tithiDuration = SYNODIC_MONTH / 30;
  let tithiNum = Math.floor(phaseDays / tithiDuration) + 1;
  if (tithiNum > 30) tithiNum = 30;

  let tithiName = '';
  let isPurnima = phaseType === 'full_moon';
  let isAmavasya = phaseType === 'new_moon';
  let isEkadashi = false;

  if (isShukla) {
    if (tithiNum >= 15 || isPurnima) {
      tithiName = 'Purnima (पूर्णिमा)';
      isPurnima = true;
    } else {
      const idx = Math.max(0, Math.min(13, tithiNum - 1));
      tithiName = `Shukla ${TITHI_NAMES[idx]}`;
      if (idx === 10) isEkadashi = true;
    }
  } else {
    const krishnaTithiNum = tithiNum - 15;
    if (krishnaTithiNum >= 15 || isAmavasya) {
      tithiName = 'Amavasya (अमावस्या)';
      isAmavasya = true;
    } else {
      const idx = Math.max(0, Math.min(13, krishnaTithiNum - 1));
      tithiName = `Krishna ${TITHI_NAMES[idx]}`;
      if (idx === 10) isEkadashi = true;
    }
  }

  return {
    phaseType,
    phaseName,
    phaseNameHi,
    icon,
    illuminationPct,
    ageDays: Number(phaseDays.toFixed(1)),
    paksha,
    tithiName,
    isPurnima,
    isAmavasya,
    isEkadashi,
  };
}

/**
 * Formats a Date object as YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generates an array of calendar days for a specific year and month
 * including leading days from the previous month to align with Sunday start
 */
export function getCalendarDaysForMonth(year: number, monthIndex: number): LunarCalendarDay[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const days: LunarCalendarDay[] = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, monthIndex, -i);
    const dateStr = formatDateKey(prevDate);
    const phase = calculateMoonPhase(prevDate);
    const event = LUNAR_PHASE_EVENTS.find((e) => e.date === dateStr);

    days.push({
      date: prevDate,
      dateString: dateStr,
      dayOfMonth: prevDate.getDate(),
      phaseType: phase.phaseType,
      phaseName: phase.phaseName,
      illuminationPct: phase.illuminationPct,
      paksha: phase.paksha,
      approxTithi: phase.tithiName,
      isPurnima: phase.isPurnima,
      isAmavasya: phase.isAmavasya,
      isEkadashi: phase.isEkadashi,
      event,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, monthIndex, d);
    const dateStr = formatDateKey(currentDate);
    const phase = calculateMoonPhase(currentDate);
    const event = LUNAR_PHASE_EVENTS.find((e) => e.date === dateStr);

    days.push({
      date: currentDate,
      dateString: dateStr,
      dayOfMonth: d,
      phaseType: phase.phaseType,
      phaseName: phase.phaseName,
      illuminationPct: phase.illuminationPct,
      paksha: phase.paksha,
      approxTithi: phase.tithiName,
      isPurnima: phase.isPurnima,
      isAmavasya: phase.isAmavasya,
      isEkadashi: phase.isEkadashi,
      event,
    });
  }

  // Next month leading days to complete the weekly rows (up to 35 or 42 cells)
  const remainingCells = 7 - (days.length % 7);
  if (remainingCells < 7) {
    for (let j = 1; j <= remainingCells; j++) {
      const nextDate = new Date(year, monthIndex + 1, j);
      const dateStr = formatDateKey(nextDate);
      const phase = calculateMoonPhase(nextDate);
      const event = LUNAR_PHASE_EVENTS.find((e) => e.date === dateStr);

      days.push({
        date: nextDate,
        dateString: dateStr,
        dayOfMonth: nextDate.getDate(),
        phaseType: phase.phaseType,
        phaseName: phase.phaseName,
        illuminationPct: phase.illuminationPct,
        paksha: phase.paksha,
        approxTithi: phase.tithiName,
        isPurnima: phase.isPurnima,
        isAmavasya: phase.isAmavasya,
        isEkadashi: phase.isEkadashi,
        event,
      });
    }
  }

  return days;
}

/**
 * Returns the nearest upcoming Purnima and Amavasya relative to reference date
 */
export function getUpcomingKeyLunarEvents(refDate: Date = new Date()) {
  const refTime = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()).getTime();

  // Sort events chronologically
  const sorted = [...LUNAR_PHASE_EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Find future events
  const futureEvents = sorted.filter((e) => new Date(e.date).getTime() >= refTime);

  const nextPurnima = futureEvents.find((e) => e.type === 'full_moon') || sorted.find((e) => e.type === 'full_moon');
  const nextAmavasya = futureEvents.find((e) => e.type === 'new_moon') || sorted.find((e) => e.type === 'new_moon');

  return {
    nextPurnima,
    nextAmavasya,
    upcomingList: futureEvents.slice(0, 8),
  };
}

/**
 * Calculates friendly countdown text
 */
export function getCountdownBadge(dateString: string, refDate: Date = new Date()): {
  text: string;
  isToday: boolean;
  daysDiff: number;
} {
  const target = new Date(dateString);
  const now = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  const diffTime = target.getTime() - now.getTime();
  const daysDiff = Math.ceil(diffTime / MS_PER_DAY);

  if (daysDiff === 0) {
    return { text: 'TODAY (आज)', isToday: true, daysDiff };
  } else if (daysDiff === 1) {
    return { text: 'TOMORROW (कल)', isToday: false, daysDiff };
  } else if (daysDiff > 1) {
    return { text: `In ${daysDiff} days`, isToday: false, daysDiff };
  } else {
    return { text: `${Math.abs(daysDiff)} days ago`, isToday: false, daysDiff };
  }
}
